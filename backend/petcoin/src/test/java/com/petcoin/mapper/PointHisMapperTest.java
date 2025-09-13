package com.petcoin.mapper;

import com.petcoin.constant.ActionType;
import com.petcoin.domain.PointHistoryVO;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 * 포인트 Mapper 테스트
 * @author : sehui
 * @fileName : PointMapperTest
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 전체 내역 조회 기능 Test
 * - 250828 | sehui | 현재 포인트 잔액 조회 기능 Test
 * - 250828 | sehui | 포인트 내역 추가 (환급 시 포인트 차감) 기능 Test
 * - 250901 | leejihye | 포인트 적립 기능 Test
 * - 250905 | sehui | 모든 회원의 포인트 잔액 합계 조회 기능 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class PointHisMapperTest {

    @Autowired
    private PointHisMapper pointHisMapper;

    @Test
    @DisplayName("회원별 포인트 전체 내역 조회")
    void testPointHisById() {

        //given : 회원 ID 설정
        Long memberId = 1L;

        //when : 포인트 전체 내역 조회
        List<PointHistoryVO> pointHistory = pointHisMapper.findPointHistoryById(memberId);

        //then: 결과 검증
        assertNotNull(pointHistory, "해당 회원ID로 조회되는 포인트 내역이 null입니다.");

        for (PointHistoryVO vo : pointHistory) {
            log.info("포인트 내역 >> {}", vo);
        }
    }

    @Test
    @DisplayName("현재 포인트 잔액 조회")
    void testPointBalance() {

        //given : 회원 ID 설정
        Long memberId = 1L;

        //when : 현재 포인트 잔액 조회
        int currentPoint = pointHisMapper.findLatestPointBalance(memberId);

        //then : 결과 검증
        assertNotNull(currentPoint, "해당 회원ID의 현재 포인트 잔액이 null입니다.");

        log.info("현재 포인트 잔액 >> {}", currentPoint);
    }

    @Test
    @DisplayName("포인트 차감 내역 추가")
    void testInsertPointHistory() {

        //given : 환급 요청 정보 설정
        Long memberId = 1L;
        int requestAmount = 10;
        ActionType actionType = ActionType.USE;
        int latestPointBalance = 50;
        String description = "포인트 환급 승인";

        //when : 포인트 차감 내역 추가
        int result = pointHisMapper.insertPointHistory(memberId, requestAmount, latestPointBalance, actionType, description);

        //then : 결과 검증
        assertEquals(result, 1, "포인트 차감 내역이 1개 추가되어야 합니다.");

        List<PointHistoryVO> pointHistory = pointHisMapper.findPointHistoryById(memberId);

        for (PointHistoryVO vo : pointHistory) {
            log.info("포인트 내역 >> {}", vo);
        }
    }
    
    @Test
    @DisplayName("포인트 적립 내역 추가")
    void plusPointTest() {
        PointHistoryVO pointHistoryVO = PointHistoryVO.builder()
                .memberId(3L)
                .pointChange(10)
                .pointBalance(10)
                .actionType(ActionType.EARN)
                .build();
        pointHisMapper.plusPoint(pointHistoryVO);

        int result = pointHisMapper.plusPoint(pointHistoryVO);

        log.info(String.valueOf(result));
    }

    @Test
    @DisplayName("모든 회원의 포인트 잔액 합계 조회")
    void testTotalPoint() {
        //when : 모든 회원의 포인트 잔액 합계 조회
        int totalPoint = pointHisMapper.totalPoint();

        //then : 결과 검증
        assertNotNull(totalPoint);
        log.info("Total Point >> {}", totalPoint);
    }

}