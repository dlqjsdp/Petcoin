package com.petcoin.mapper;

import com.petcoin.constant.ActionType;
import com.petcoin.domain.PointHistoryVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/*
 * 포인트 내역 Mapper 인터페이스
 * @author : sehui
 * @fileName : PointHisMapper
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 내역 조회 기능 추가
 * - 250828 | sehui | 현재 포인트 잔액 조회 기능 추가
 * - 250828 | sehui | 포인트 내역 추가 (환급 시 포인트 차감) 기능 추가
 * - 250901 | leejihye | 포인트 적립 기능 추가
 */

@Mapper
public interface PointHisMapper {

    //회원별 포인트 내역 조회
    public List<PointHistoryVO> findPointHistoryById(Long memberId);

    //현재 포인트 잔액 조회
    public int findLatestPointBalance(Long memberId);

    //포인트 내역 추가 (환급 시 포인트 차감)
    public int insertPointHistory(Long memberId, int requestAmount, int latestPointBalance, ActionType actionType);

    //포인트 내역 추가 (포인트 적립)
    public int plusPoint(PointHistoryVO pointHistoryVO);
}
