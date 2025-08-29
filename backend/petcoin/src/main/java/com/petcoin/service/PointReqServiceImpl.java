package com.petcoin.service;

import com.petcoin.constant.RequestStatus;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.PointRequestDto;
import com.petcoin.dto.PointRequestProcessDto;
import com.petcoin.mapper.PointReqMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * 포인트 내역 Service
 * @author : sehui
 * @fileName : PointReqServiceImpl
 * @since : 250828
 * @history
 * - 250828 | sehui | 포인트 환급 요청 목록 조회 기능 추가
 * - 250828 | sehui | 포인트 환급 요청 단건 조회 기능 추가
 * - 250828 | sehui | 포인트 환급 요청 상태 변경 기능 추가
 * - 250829 | sehui | 페이징 처리를 위한 전체 포인트 환급 요청의 수 조회 기능 추가
 * - 250829 | sehui | 포인트 환급 요청 상태 변경의 매개변수 변경
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class PointReqServiceImpl implements PointReqService {

    private final PointReqMapper pointReqMapper;

    //포인트 환급 요청 목록 조회
    @Override
    public List<PointRequestDto> getPointRequestsWithPaging(Criteria cri) {
        List<PointRequestDto> pointRequestDtoList = pointReqMapper.findPointRequestsWithPaging(cri);

        if(pointRequestDtoList.isEmpty()){
            throw new IllegalArgumentException("포인트 환급 요청 목록 조회 오류 발생");
        }
        return pointRequestDtoList;
    }

    //포인트 환급 요청 단건 조회
    @Override
    public PointRequestDto getPointRequestById(Long requestId) {
        PointRequestDto pointRequestDto = pointReqMapper.findPointRequestById(requestId);

        if(pointRequestDto == null){
            throw new IllegalArgumentException("환급 요청 단건 조회 오류 발생");
        }

        return pointRequestDto;
    }

    //포인트 환급 요청 상태 변경 기능
    @Override
    public int updatePointRequestStatus(PointRequestProcessDto pointRequestDto) {
        int result = pointReqMapper.updatePointRequestStatus(pointRequestDto);

        if(result != 1){
            throw new IllegalArgumentException("환급 요청 상태 변경 오류 발생");
        }

        return result;
    }

    //전체 포인트 환급 요청의 수
    @Override
    public int getTotalPointRequests() {
        int TotalPointRequests = pointReqMapper.getTotalPointRequests();

        if(TotalPointRequests == 0){
            throw new IllegalArgumentException("전체 환급 요청의 수가 null입니다.");
        }

        return TotalPointRequests;
    }
}
