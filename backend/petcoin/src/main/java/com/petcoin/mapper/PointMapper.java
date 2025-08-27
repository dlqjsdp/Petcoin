package com.petcoin.mapper;

import com.petcoin.constant.PointType;
import com.petcoin.domain.PointHistoryVO;
import com.petcoin.dto.PointHistoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/*
 * 포인트 Mapper 인터페이스
 * @author : sehui
 * @fileName : PointMapper
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 내역 조회 기능 추가
 */

@Mapper
public interface PointMapper {

    //회원별 포인트 내역 조회 기능
    public List<PointHistoryVO> findPointHistoryById(Long memberId);

    //
    long sumByType(@Param("memberId") long memberId, @Param("type") PointType type);
    long sumRefundHold(@Param("memberId") long memberId);

    List<PointHistoryDto> selectHistoryPaged(@Param("memberId") long memberId,
                                             @Param("from") LocalDate from,
                                             @Param("to") LocalDate to,
                                             @Param("type") PointType type,
                                             @Param("offset") int offset,
                                             @Param("limit") int limit);
    long countHistory(@Param("memberId") long memberId,
                      @Param("from") LocalDate from,
                      @Param("to") LocalDate to,
                      @Param("type") PointType type);

    long sumEarnByFilter(@Param("memberId") long memberId,
                         @Param("from") LocalDate from,
                         @Param("to") LocalDate to);
    long sumUseByFilter(@Param("memberId") long memberId,
                        @Param("from") LocalDate from,
                        @Param("to") LocalDate to);

}
