package com.petcoin.mapper;

import com.petcoin.constant.RunStatus;
import com.petcoin.domain.KioskRunVO;
import com.petcoin.dto.KioskRunResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

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
 *   - 250828 | yukyeong | completeRunTest 작성
 *                        - 실행 중 세션(RUNNING) → 실행 완료(COMPLETED) 상태 전환 검증
 *                        - update 영향 행 수(1) 확인 및 readRun 결과 상태 확인
 *   - 250828 | yukyeong | cancelRunTest 작성
 *                        - 실행 중 세션(RUNNING) → 실행 취소(CANCELLED) 상태 전환 검증
 *                        - update 영향 행 수(1) 확인 및 readRun 결과 상태 확인
 *   - 250828 | yukyeong | getRunningCountByKioskIdTest 작성
 *                        - kiosk_id=1에 RUNNING 세션을 2개 추가 생성
 *                        - 기존 DB에 남아있던 RUNNING 1개 포함, 총 3개 집계되는지 확인
 *                        - 중복 실행 방지 로직 적용 전 카운트 확인용
 *
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

    @Test
    @Transactional
    @DisplayName("실행 완료 처리 테스트")
    public void completeRunTest(){

        // Given
        KioskRunVO run = new KioskRunVO();
        run.setKioskId(1L);
        run.setMemberId(1L);
        run.setStatus(RunStatus.RUNNING);
        run.setStartedAt(LocalDateTime.now());
        kioskRunMapper.insertRun(run); // DB에 INSERT → runId가 자동 생성됨

        // When
        run.setEndedAt(LocalDateTime.now());
        int update = kioskRunMapper.completeRun(run.getRunId(), run.getEndedAt());

        // Then
        assertEquals(1, update);
        KioskRunResponse completed = kioskRunMapper.readRun(run.getRunId());
        assertEquals(RunStatus.COMPLETED, completed.getStatus()); // runId의 상태를 RUNNING → COMPLETED로 업데이트
        log.info("completed runId={} status={}", run.getRunId(), completed.getStatus());
    }

    @Test
    @Transactional
    @DisplayName("실행 처리 취소 테스트")
    public void cancelRunTest(){

        // Given
        KioskRunVO run = new KioskRunVO();
        run.setKioskId(1L);
        run.setMemberId(1L);
        run.setStatus(RunStatus.RUNNING);
        run.setStartedAt(LocalDateTime.now());
        kioskRunMapper.insertRun(run); // DB에 INSERT → runId가 자동 생성됨

        // When
        run.setEndedAt(LocalDateTime.now());
        int update = kioskRunMapper.cancelRun(run.getRunId(), run.getEndedAt());

        // Then
        assertEquals(1, update);
        KioskRunResponse cancelled = kioskRunMapper.readRun(run.getRunId());
        assertEquals(RunStatus.CANCELLED, cancelled.getStatus()); // runId의 상태를 RUNNING → CANCELLED로 업데이트
        log.info("cancelled runId={} status={}", run.getRunId(), cancelled.getStatus());
    }

    @Test
    @Transactional
    @DisplayName("키오스트 RUNNING 세션 중복 실행 시 카운트 값이 정확히 집계되는지 확인 테스트")
    public void getRunningCountByKioskIdTest() {
        // Given: kiosk_id=1에서 RUNNING 상태 세션을 2개 생성
        KioskRunVO run1 = new KioskRunVO();
        run1.setKioskId(1L);
        run1.setMemberId(1L);
        run1.setStatus(RunStatus.RUNNING);
        run1.setStartedAt(LocalDateTime.now());
        kioskRunMapper.insertRun(run1);

        KioskRunVO run2 = new KioskRunVO();
        run2.setKioskId(1L);
        run2.setMemberId(2L);
        run2.setStatus(RunStatus.RUNNING);
        run2.setStartedAt(LocalDateTime.now());
        kioskRunMapper.insertRun(run2);

        // When: kiosk_id=1에서 RUNNING 세션 개수 조회
        int runningCount = kioskRunMapper.getRunningCountByKioskId(1L);

        // Then: 3개가 조회되어야 함 (기존에 있던거 + 방금 만든 2개)
        assertEquals(3, runningCount);
        log.info("kioskId=1 runningCount={}", runningCount);
    }
}