package com.petcoin.service;

import com.petcoin.domain.PointHistoryVO;
import com.petcoin.dto.PointHistoryDto;

import java.util.List;

/*
 * 포인트 Service 인터페이스
 * @author : sehui
 * @fileName : PointService
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 내역 조회 기능 추가
 */

public interface PointService {

    //회원별 포인트 내역 조회
    public List<PointHistoryDto> getPointHistoryById(Long memberId);
}
