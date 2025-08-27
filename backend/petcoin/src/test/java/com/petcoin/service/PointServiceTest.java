package com.petcoin.service;

import com.petcoin.dto.PointHistoryDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 * 포인트 Service 테스트
 * @author : sehui
 * @fileName : PointServiceTest
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 전체 내역 조회 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class PointServiceTest {

    @Autowired
    private PointService pointService;

    @Test
    @DisplayName("회원별 포인트 전체 내역 조회")
    void testGetPointHis() {

        //given : 회원ID 설정
        Long memberId = 1L;

        //when : 회원별 포인트 전체 내역 조회
        List<PointHistoryDto> pointHistoryList = pointService.getPointHistoryById(memberId);

        //then : 결과 검증
        assertNotNull(pointHistoryList, "해당 ID의 회원의 포인트 내역이 null입니다.");

        for(PointHistoryDto dto : pointHistoryList) {
            log.info("PointHistory >> {}", dto);
        }
    }

}