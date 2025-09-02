package com.petcoin.mapper;

import com.petcoin.dto.Criteria;
import com.petcoin.dto.RecycleStatsDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

/*
 * 무인 회수기의 페트병 수거 내역 Mapper 테스트
 * @author : sehui
 * @fileName : RecycleStatsMapperTest
 * @since : 250902
 * @history
 * - 250902 | sehui | 전체 무인 회수기 수거 내역 조회 Test
 * - 250902 | sehui | 전체 무인 회수기 수 조회 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class RecycleStatsMapperTest {

    @Autowired
    private RecycleStatsMapper petRecycleStatsMapper;

    @Test
    @DisplayName("전체 무인 회수기 수거 내역 조회")
    void testAllRecycleStats() {

        //given : 페이징 처리 설정
        Criteria cri = new Criteria();

        //when : 전체 무인 회수기 수거 내역 조회
        List<RecycleStatsDto> RecycleStatsDto = petRecycleStatsMapper.findRecycleStatsWithPaging(cri);

        //then : 결과 검증
        assertNotNull(RecycleStatsDto, "조회된 무인 회수기 목록이 null입니다.");
        assertFalse(RecycleStatsDto.isEmpty(), "조회된 무인 회수기 목록이 비어있습니다.");

        for(RecycleStatsDto dto : RecycleStatsDto) {
            log.info("Recycle Stats >> {}", dto);
        }
    }

    @Test
    @DisplayName("전체 무인 회수기 수 조회")
    void testTotalRecycle() {

        //when : 전체 무인 회수기 수 조회
        int resultTotal = petRecycleStatsMapper.getTotalRecycle();

        //then : 결과 검증
        assertNotNull(resultTotal, "전체 무인 회수기의 수가 null입니다.");

        log.info("Total Recycle >> {}", resultTotal);
    }
}