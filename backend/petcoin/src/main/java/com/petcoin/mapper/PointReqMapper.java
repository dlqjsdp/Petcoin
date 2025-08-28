package com.petcoin.mapper;

import com.petcoin.constant.RequestStatus;
import com.petcoin.dto.PointRequestDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/*
 * 포인트 환급 요청 Mapper 인터페이스
 * @author : sehui
 * @fileName : PointReqMapper
 * @since : 250828
 * @history
 * - 250828 | sehui | 포인트 환급 요청 목록 조회 기능 추가
 * - 250828 | sehui | 포인트 환급 요청 단건 조회 기능 추가
 * - 250828 | sehui | 포인트 환급 요청 상태 변경(대기, 승인, 처리 완료, 거절) 기능 추가
 */

@Mapper
public interface PointReqMapper {

    //포인트 환급 요청 목록 조회
    public List<PointRequestDto> findAllPointRequests();

    //포인트 환급 요청 단건 조회
    public PointRequestDto findPointRequestById(Long requestId);

    //포인트 환급 요청 상태 변경
    public int updatePointRequestStatus(Long requestId, RequestStatus requestStatus, String note);
}
