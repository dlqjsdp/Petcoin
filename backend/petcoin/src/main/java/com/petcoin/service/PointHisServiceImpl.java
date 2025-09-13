package com.petcoin.service;

import com.petcoin.constant.ActionType;
import com.petcoin.constant.RequestStatus;
import com.petcoin.domain.PointHistoryVO;
import com.petcoin.dto.PointHistoryDto;
import com.petcoin.dto.PointRequestDto;
import com.petcoin.mapper.PointHisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.util.List;
import java.util.stream.Collectors;

/*
 * 포인트 내역 Service
 * @author : sehui
 * @fileName : PointHisServiceImpl
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 내역 조회 기능 추가
 * - 250828 | sehui | 현재 포인트 잔액 조회 기능 추가
 * - 250828 | sehui | 포인트 내역 추가 (환급 시 포인트 차감) 기능 추가
 * - 250901 | leejihye | 포인트 적립 기능 추가
 * - 250910 | sehui | 포인트 내역 추가 메서드의 반환타입 boolean으로 변경
 * - 250912 | sehui | 포인트 내역 추가 메서드에 거부 시 기록만 추가하도록 수정
 * - 250912 | sehui | 포인트 내역 추가 메서드에 description 변수 추가
 * - 250912 | sehui | 포인트 내역 추가 메서드에 계산 로직 추가
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class PointHisServiceImpl implements PointHisService {

    private final PointHisMapper pointHisMapper;

    //VO -> DTO 변환 메소드
    private List<PointHistoryDto> convertVoToDto(List<PointHistoryVO> voList) {
        return voList.stream()
                .map(vo -> PointHistoryDto.builder()
                        .historyId(vo.getHistoryId())
                        .memberId(vo.getMemberId())
                        .pointChange(vo.getPointChange())
                        .pointBalance(vo.getPointBalance())
                        .actionType(vo.getActionType())
                        .description(vo.getDescription())
                        .createdAt(vo.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    };

    //회원별 포인트 내역 조회
    @Override
    public List<PointHistoryDto> getPointHistoryById(Long memberId) {

        List<PointHistoryVO> pointHisVoList = pointHisMapper.findPointHistoryById(memberId);

        if(pointHisVoList.isEmpty()){
            throw new IllegalArgumentException("해당 회원의 포인트 내역을 조회할 수 없습니다.");
        }

        //VO -> DTO 변환
        List<PointHistoryDto> pointHisDtoList = convertVoToDto(pointHisVoList);

        return pointHisDtoList;
    }

    //현재 포인트 잔액 조회
    @Override
    public int getLatestPointBalance(Long memberId) {

        int latestPointBalance = pointHisMapper.findLatestPointBalance(memberId);

        if(latestPointBalance < 0){
            throw new IllegalArgumentException("포인트 잔액이 0 미만입니다. 확인이 필요합니다.");
        }

        return latestPointBalance;
    }

    //포인트 내역 추가 (환급 시)
    @Override
    public boolean addPointHistory(PointRequestDto pointRequestDto, ActionType actionType) {

        Long memberId = pointRequestDto.getMemberId();
        int requestAmount = pointRequestDto.getRequestAmount();
        String description = "";

        //승인 시 포인트 차감
        if(actionType == ActionType.USE) {
            //현재 포인트 잔액 조회
            int latestPointBalance = getLatestPointBalance(memberId);

            //잔액이 부족한 경우
            if(latestPointBalance < requestAmount){
                return false;
            }

            //포인트 차감한 내역 DB에 추가
            pointHisMapper.insertPointHistory(
                    memberId,
                    -requestAmount,
                    latestPointBalance-requestAmount,
                    ActionType.USE,
                    "포인트 환급 승인");
        }else if(actionType == ActionType.ADJUST) {
            //거부 시 기록만 추가
            int latestPointBalance = getLatestPointBalance(memberId);

            pointHisMapper.insertPointHistory(
                    memberId,
                    +requestAmount,
                    latestPointBalance,
                    ActionType.ADJUST,
                    "포인트 환급 거부");
        }

        return true;
    }

    private static final int POINT_PER_PET = 10; // 페트병당 적립 포인트

    //포인트 적립 내역 추가
    @Override
    public void plusPoint(Long memberId, int totalPet) {
        // memberId가 null이면 1로 처리
        if (memberId == null) {
            memberId = 1L;
        }

        int pointChange = totalPet * POINT_PER_PET; // 규칙에 따라 계산

        //1. 현재 포인트 잔액 조회(null일 경우 정수 0으로 변환)
        int latestPointBalance;
        try {
            // 기존 회원 포인트 잔액 조회
            latestPointBalance = getLatestPointBalance(memberId);
        } catch (Exception e) {
            // 예외 발생 시 null 반환 상황 포함, 신규 회원으로 간주해 0으로 처리
            latestPointBalance = 0;

            // 신규 회원 초기 기록 생성
            PointHistoryVO initVo = new PointHistoryVO();
            initVo.setMemberId(memberId);
            initVo.setPointChange(0);
            initVo.setPointBalance(0);
            initVo.setActionType(ActionType.EARN);
            initVo.setDescription("최초 포인트 DB 데이터 생성");

            int inserted = pointHisMapper.newMemberPointHistory(initVo);
            log.info("신규 회원 초기 레코드 insert 결과: {}", inserted);
        }

        //2. 누적 포인트 계산
        int newBalance = latestPointBalance + pointChange;

        // 3. VO에 세팅
        PointHistoryVO vo = new PointHistoryVO();
        vo.setMemberId(memberId);
        vo.setPointChange(pointChange);
        vo.setPointBalance(newBalance);
        vo.setActionType(ActionType.EARN);
        vo.setDescription("페트병 회수 포인트 적립 (" + totalPet + "개)");

        //4. mapper 호출
        int result = pointHisMapper.plusPoint(vo);
        if (result != 1) {
            throw new IllegalArgumentException("포인트 적립 내역 추가 오류 발생");
        }
        log.info("plusPoint 서비스 진입: {}", result);
    }

    //키오스크 내 적립된 포인트 및 누적 포인트 조회
    @Override
    public PointHistoryDto getNewPointChange(Long memberId) {

        int newPointChange = pointHisMapper.getNewPointChange(memberId);
        int latestPointBalance = getLatestPointBalance(memberId);

        return PointHistoryDto.builder()
                .memberId(memberId)
                .pointChange(newPointChange)
                .pointBalance(latestPointBalance)
                .build();
    }
}
