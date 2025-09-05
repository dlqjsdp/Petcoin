package com.petcoin.service;

import com.petcoin.dto.DashboardResponse;

/*
 * 대시보드 조회용 Service 인터페이스
 * @author : sehui
 * @fileName : DashboardService
 * @since : 250905
 * @history
 * - 250905 | sehui | 대시보드 조회 메서드 생성
 */

public interface DashboardService {

    //대시보드 조회용
    public DashboardResponse getDashboardData();
}
