package com.petcoin.service;

import com.petcoin.dto.Criteria;
import com.petcoin.dto.RecycleStatsDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 * 무인 회수기의 페트병 수거 내역 Service 테스트
 * @author : sehui
 * @fileName : RecycleStatsServiceTest
 * @since : 250902
 * @history
 * - 250902 | sehui | 전체 무인 회수기 수거 내역 조회 Test
 * - 250902 | sehui | 전체 무인 회수기 수 조회 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class RecycleStatsServiceTest {

    @Autowired
    private RecycleStatsService statsService;

    @Test
    @DisplayName("전체 무인 회수기 수거 내역 조회")
    void testGetRecycleStats() {

        //given : 페이징 처리 설정
        Criteria cri = new Criteria();

        //when : 전체 무인 회수기 수거 내역 조회
        List<RecycleStatsDto> statsDtoList = statsService.getRecycleStatsWithPaging(cri);

        //then : 결과 검증
        assertNotNull(statsDtoList, "조회한 전체 무인 회수기 수거 내역이 null입니다.");
        assertFalse(statsDtoList.isEmpty(), "조회한 전체 무인 회수기 수거 내역이 비어있습니다.");

        for(RecycleStatsDto dto : statsDtoList) {
            log.info("Recycle stats >> {}", dto);
        }
    }

    @Test
    @DisplayName("전체 무인 회수기 수 조회")
    void testTotalRecycle() {

        //when : 전체 무인 회수기 수 조회
        int TotalRecycle = statsService.getTotalRecycle();

        //then : 결과 검증
        assertNotNull(TotalRecycle, "전체 무인 회수기의 수가 null입니다.");

        log.info("Total Recycle >> {}", TotalRecycle);
    }
}