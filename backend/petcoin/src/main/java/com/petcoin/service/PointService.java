package com.petcoin.service;

import com.petcoin.constant.PointType;
import com.petcoin.domain.PointHistoryVO;
import com.petcoin.dto.PointHistoryDto;
import com.petcoin.dto.PointHistoryFilter;
import com.petcoin.dto.PointSummaryDto;

import java.time.LocalDate;
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

    //
    long sumEarnByFilter(Long memberId, LocalDate from, LocalDate to);
    long sumUseByFilter(Long memberId, LocalDate from, LocalDate to);
    long sumRefundHold(Long memberId);
    long calculateBalance(Long memberId);

    List<PointHistoryDto> getHistoryPaged(Long memberId,
                                          LocalDate from,
                                          LocalDate to,
                                          PointType type,
                                          int limit,
                                          int offset);

    PointSummaryDto summary(Long memberId);
    PointSummaryDto summaryWithFilter(Long memberId, LocalDate from, LocalDate to);
    List<PointHistoryDto> history(Long memberId, PointHistoryFilter filter);
    long countHistory(Long memberId, PointHistoryFilter filter);

}
