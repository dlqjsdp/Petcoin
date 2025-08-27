package com.petcoin.mapper;

import com.petcoin.constant.RunStatus;
import com.petcoin.domain.KioskRunVO;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/*
 * KioskRunMapperTest
 * kiosk_run 테이블과 연동된 Mapper의 단위 테스트 클래스
 *
 * 주요 목적:
 *  - 실행 세션 생성/완료/취소/조회 등 Mapper 동작을 검증
 *
 * @author  : yukyeong
 * @fileName: KioskRunMapperTest.java
 * @since   : 250827
 * @history
 *   - 250827 | yukyeong | insertRunTest 작성
 *                        - kiosk_id=1, member_id=1 더미 데이터 기반 실행 세션 생성 검증
 *                        - 영향받은 row 수(1) 확인
 *                        - useGeneratedKeys 옵션에 의해 runId 자동 주입 검증
 */

@SpringBootTest
@Slf4j
class KioskRunMapperTest {

    @Autowired
    private KioskRunMapper kioskRunMapper;

    @Test
    @DisplayName("실행 세션 생성 테스트")
    public void insertRunTest(){
        // Given
        KioskRunVO run = new KioskRunVO();
        run.setKioskId(1L);
        run.setMemberId(1L);
        run.setStatus(RunStatus.RUNNING);
        run.setStartedAt(LocalDateTime.now());

        // When
        int insert = kioskRunMapper.insertRun(run);

        // Then
        assertEquals(1, insert);
        assertNotNull(run.getRunId());
        log.info("new runId={}", run.getRunId());
    }
}