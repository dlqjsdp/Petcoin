package com.petcoin.service;

import com.petcoin.dto.DashboardResponse;
import com.petcoin.dto.KioskResponse;
import com.petcoin.mapper.KioskMapper;
import com.petcoin.mapper.KioskRunMapper;
import com.petcoin.mapper.MemberMapper;
import com.petcoin.mapper.PointHisMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * 대시보드 조회용 Service 구현체
 * 대시보드 조회용 : 총 수거량, 총 회원수, 총 포인트, 수거함 운영상태, 대표 수거함 3개 현황
 * @author : sehui
 * @fileName : DashboardServiceImpl
 * @since : 250905
 * @history
 * - 250905 | sehui | 대시보드 조회 메서드 생성
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService{
    
    private final KioskRunMapper kioskRunMapper;
    private final KioskMapper kioskMapper;
    private final MemberMapper memberMapper;
    private final PointHisMapper pointHisMapper;
    
    //대시보드 조회
    @Override
    public DashboardResponse getDashboardData() {
        
        //총 수거량 조회
        int totalRecycle = kioskRunMapper.getTotalPetCount();
        
        //총 회원수 조회
        int totalMember = memberMapper.getTotalMember();

        //모든 회원의 포인트 잔액 합계 조회
        int totalPoint = pointHisMapper.totalPoint();

        //키오스크 상태별 개수 조회
        int onlineCount = kioskMapper.onlineCount();
        int offlineCount = kioskMapper.offlineCount();
        int maintCount = kioskMapper.maintCount();
        int totalCount = onlineCount + offlineCount + maintCount;

        //반환타입 객체에 담기
        DashboardResponse dashboardResponse = DashboardResponse.builder()
                .totalRecycle(totalRecycle)
                .totalMember(totalMember)
                .totalPoint(totalPoint)
                .onlineCount(onlineCount)
                .offlineCount(offlineCount)
                .maintCount(maintCount)
                .totalCount(totalCount)
                .build();

        return dashboardResponse;
    }
}
