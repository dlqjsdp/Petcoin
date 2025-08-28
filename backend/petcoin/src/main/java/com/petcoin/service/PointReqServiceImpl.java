package com.petcoin.service;

import com.petcoin.constant.RequestStatus;
import com.petcoin.dto.PointRequestDto;
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
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class PointReqServiceImpl implements PointReqService {

    private final PointReqMapper pointReqMapper;

    //포인트 환급 요청 목록 조회
    @Override
    public List<PointRequestDto> getAllPointRequests() {
        List<PointRequestDto> pointRequestDtoList = pointReqMapper.findAllPointRequests();

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
    public int updatePointRequestStatus(Long requestId, RequestStatus requestStatus, String note) {
        int result = pointReqMapper.updatePointRequestStatus(requestId, requestStatus, note);

        if(result != 1){
            throw new IllegalArgumentException("환급 요청 상태 변경 오류 발생");
        }

        return result;
    }
}
