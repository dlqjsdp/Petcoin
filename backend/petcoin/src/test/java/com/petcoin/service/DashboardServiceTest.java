package com.petcoin.service;

import com.petcoin.dto.DashboardResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/*
 * 대시보드 Service 테스트
 * @author  : sehui
 * @fileName: DashboardServiceTest
 * @since   : 250909
 * @history
 *   - 250909 | sehui | 대시보드 조회 메서드 Test
 */

@SpringBootTest
@Slf4j
class DashboardServiceTest {

    @Autowired
    private DashboardService dashboardService;

    @Test
    @DisplayName("대시보드 조회")
    void testGetDashboard() {

        //when : 대시보드 조회
        DashboardResponse response = dashboardService.getDashboardData();

        //then : 결과 검증
        assertNotNull(response);
        log.info("Dashboard response: {}", response);
    }
}