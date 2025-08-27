package com.petcoin.mapper;

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
 */

@SpringBootTest
@Transactional
@Slf4j
class PointMapperTest {

    @Autowired
    private PointMapper pointMapper;

    @Test
    @DisplayName("회원별 포인트 전체 내역 조회")
    void testPointHisById() {

        //given : 회원 ID 설정
        Long memberId = 1L;

        //when : 포인트 전체 내역 조회
        List<PointHistoryVO> pointHistory = pointMapper.findPointHistoryById(memberId);

        //then: 결과 검증
        assertNotNull(pointHistory, "해당 회원ID로 조회되는 포인트 내역이 null입니다.");

        for (PointHistoryVO vo : pointHistory) {
            log.info("포인트 내역 >> {}", vo);
        }
    }

}