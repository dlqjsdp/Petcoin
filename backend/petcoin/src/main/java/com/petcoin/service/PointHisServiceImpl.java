package com.petcoin.service;

import com.petcoin.constant.ActionType;
import com.petcoin.domain.PointHistoryVO;
import com.petcoin.dto.PointHistoryDto;
import com.petcoin.dto.PointRequestDto;
import com.petcoin.mapper.PointHisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    //포인트 내역 추가 (환급 시 포인트 차감)
    @Override
    public int addPointHistory(PointRequestDto pointRequestDto) {

        Long memberId = pointRequestDto.getMemberId();
        int requestAmount = pointRequestDto.getRequestAmount();

        //현재 포인트 잔액 조회
        int latestPointBalance = getLatestPointBalance(memberId);

        //잔액이 부족한 경우
        if(latestPointBalance < requestAmount){
            throw new IllegalArgumentException("포인트 잔액이 부족하여 환급 요청을 처리할 수 없습니다.");
        }

        //포인트 차감한 내역 DB에 추가
        int resultAdd = pointHisMapper.insertPointHistory(memberId, requestAmount, latestPointBalance, ActionType.USE);

        if(resultAdd != 1) {
            throw new IllegalArgumentException("포인트 내역 추가 오류 발생");
        }

        return resultAdd;
    }

    //포인트 적립 내역 추가
    @Override
    public void plusPoint(PointHistoryVO pointHistoryVO) {
        Long memberId = pointHistoryVO.getMemberId();
        int pointChange = pointHistoryVO.getPointChange();

        //1. 현재 포인트 잔액 조회
        int latestPointBalance = getLatestPointBalance(memberId);

        //2. 누적 포인트 계산
        int newBalance = latestPointBalance + pointChange;

        // 3. VO에 세팅
        pointHistoryVO.setPointBalance(newBalance);
        pointHistoryVO.setActionType(ActionType.EARN);
        pointHistoryVO.setDescription("페트병 무인 회수기 포인트 적립");

        //4. mapper 호출
        int result = pointHisMapper.plusPoint(pointHistoryVO);
        if (result != 1) {
            throw new IllegalArgumentException("포인트 적립 내역 추가 오류 발생");
        }
        log.info("plusPoint 서비스 진입: {}", pointHistoryVO);
    }
}
