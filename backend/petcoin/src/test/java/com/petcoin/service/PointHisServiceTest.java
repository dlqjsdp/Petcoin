package com.petcoin.service;

import com.petcoin.dto.PointHistoryDto;
import com.petcoin.dto.PointRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 * 포인트 내역 Service 테스트
 * @author : sehui
 * @fileName : PointHisServiceTest
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 전체 내역 조회 Test
 * - 250828 | sehui | 현재 포인트 잔액 조회 Test
 * - 250828 | sehui | 포인트 내역 추가 (환급 시 포인트 차감) Test
 */

@SpringBootTest
@Transactional
@Slf4j
class PointHisServiceTest {

    @Autowired
    private PointHisService pointHisService;

    @Test
    @DisplayName("회원별 포인트 전체 내역 조회")
    void testGetPointHis() {

        //given : 회원ID 설정
        Long memberId = 1L;

        //when : 회원별 포인트 전체 내역 조회
        List<PointHistoryDto> pointHistoryList = pointHisService.getPointHistoryById(memberId);

        //then : 결과 검증
        assertNotNull(pointHistoryList, "해당 ID의 회원의 포인트 내역이 null입니다.");

        for(PointHistoryDto dto : pointHistoryList) {
            log.info("PointHistory >> {}", dto);
        }
    }

    @Test
    @DisplayName("현재 포인트 잔액 조회")
    void testGetLatestPoint() {

        //given : 회원 ID 설정
        Long memberId = 1L;

        //when : 현재 포인트 잔액 조회
        int latestPointBalance = pointHisService.getLatestPointBalance(memberId);

        //then : 결과 검증
        assertNotNull(latestPointBalance, "현재 포인트 잔액이 null입니다.");
        log.info("latestPointBalance >> {}", latestPointBalance);
    }

    @Test
    @DisplayName("포인트 차감한 내역 추가")
    void testAddPointHistory() {

        //given : 사용자가 입력한 값 설정
        PointRequestDto requestDto = PointRequestDto.builder()
                .memberId(1L)
                .requestAmount(10)
                .build();

        //when : 포인트 차감 내역 추가
        int resultAdd = pointHisService.addPointHistory(requestDto);

        //then : 결과 검증
        assertNotNull(resultAdd, "포인트 내역 추가 오류 발생");
        log.info("포인트 내역 추가된 항목의 수 >> {}", resultAdd);

        int latestPointBalance = pointHisService.getLatestPointBalance(1L);
        log.info("변경된 포인트 잔액 >> {}", latestPointBalance);
    }

}