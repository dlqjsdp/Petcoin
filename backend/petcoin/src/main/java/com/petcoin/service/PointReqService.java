package com.petcoin.service;

/*
 * 포인트 환급 요청 Service 인터페이스
 * @author : sehui
 * @fileName : PointReqService
 * @since : 250828
 * @history
 * - 250828 | sehui | 포인트 환급 요청 목록 조회 기능 추가
 * - 250828 | sehui | 포인트 환급 요청 단건 조회 기능 추가
 * - 250828 | sehui | 포인트 환급 요청 상태 변경 기능 추가
 */

import com.petcoin.constant.RequestStatus;
import com.petcoin.dto.PointRequestDto;

import java.util.List;

public interface PointReqService {

    //포인트 환급 요청 목록 조회
    public List<PointRequestDto> getAllPointRequests();

    //포인트 환급 요청 단건 조회
    public PointRequestDto getPointRequestById(Long requestId);

    //포인트 환경 요청 상태 변경 기능
    public int updatePointRequestStatus(Long requestId, RequestStatus requestStatus, String note);
}
