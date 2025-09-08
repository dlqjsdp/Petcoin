package com.petcoin.service;

import com.petcoin.domain.PointHistoryVO;
import com.petcoin.dto.PointHistoryDto;
import com.petcoin.dto.PointRequestDto;

import java.util.List;

/*
 * 포인트 내역 Service 인터페이스
 * @author : sehui
 * @fileName : PointHisService
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 내역 조회 기능 추가
 * - 250828 | sehui | 현재 포인트 잔액 조회 기능 추가
 * - 250828 | sehui | 포인트 내역 추가 (환급 시 포인트 차감) 기능 추가
 * - 250901 | leejihye | 포인트 적립 기능 추가
 */

public interface PointHisService {

    //회원별 포인트 내역 조회
    public List<PointHistoryDto> getPointHistoryById(Long memberId);

    //현재 포인트 잔액 조회
    public int getLatestPointBalance(Long memberId);

    //포인트 내역 추가 (환급 시 포인트 차감)
    public int addPointHistory(PointRequestDto pointRequestDto);

    //포인트 적립 내역 추가
    public void plusPoint(Long memberId, int totalPet);

    //키오스크 내 적립된 포인트 및 누적 포인트 조회
    public PointHistoryDto getNewPointChange(Long memberId);
}
