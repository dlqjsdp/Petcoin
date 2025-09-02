package com.petcoin.service;

import com.petcoin.constant.RunStatus;
import com.petcoin.dto.KioskRunEndRequest;
import com.petcoin.dto.KioskRunResponse;
import com.petcoin.dto.KioskRunStartRequest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/*
 * 키오스크 실행 세션 Service 테스트
 * - 실제 DB와 연동하여 실행 시작 → 종료까지의 전체 플로우를 검증
 * - @SpringBootTest + @Transactional 환경에서 실행되며, 테스트 종료 후 롤백 처리됨
 *
 * 주요 시나리오:
 *  - 실행 시작 요청(KioskRunStartRequest) → RUNNING 상태 세션 생성
 *  - 실행 종료 요청(KioskRunEndRequest) → 해당 세션을 COMPLETED 상태로 전이
 *  - 각 단계에서 runId, 상태 값이 예상대로 반영되는지 단언(assert)
 *
 * 로그 출력:
 *  - 요청/응답 객체 주요 필드(runId, kioskId, memberId, status, startedAt/endedAt)를 INFO 레벨로 출력
 *  - 실패 시 디버깅을 쉽게 하기 위함
 *
 * @author  : yukyeong
 * @fileName: KioskRunServiceTest
 * @since   : 250829
 * @history
 *   - 250829 | yukyeong | 실행 시작 ~ 종료까지의 정상 흐름 테스트(testRun) 작성
 */

@SpringBootTest
@Slf4j
class KioskRunServiceTest {

    @Autowired
    private KioskRunService kioskRunService;

    @Test
    //@Transactional
    @DisplayName("실행 시작부터 종료까지 테스트")
    public void testRun(){
        // Given : 실행 시작 요청
        KioskRunStartRequest startReq = new KioskRunStartRequest();
        startReq.setKioskId(1L); // 실제 DB에 있는 키오스크 ID
        startReq.setMemberId(4L); // 실제 DB에 있는 회원 ID
        log.info("StartReq 생성 -> kioskId={}, memberId={}", startReq.getKioskId(), startReq.getMemberId());

        // When : 실행 시작
        KioskRunResponse started = kioskRunService.startRun(startReq);
        log.info("실행 시작 결과 -> runId={}, kioskId={}, memberId={}, status={}, startedAt={}",
                started.getRunId(), started.getKioskId(), started.getMemberId(),
                started.getStatus(), started.getStartedAt());

        // Then : Running 상태 확인
        assertNotNull(started.getRunId());
        assertEquals(RunStatus.RUNNING, started.getStatus());

        // When : 실행 종료
        KioskRunEndRequest endReq = new KioskRunEndRequest();

        endReq.setRunId(started.getRunId());
        endReq.setTotalPet(7);
        log.info("EndReq 생성 -> runId={}", endReq.getRunId());


        KioskRunResponse ended = kioskRunService.endRun(endReq);
        log.info("실행 종료 결과 -> runId={}, status={}, endedAt={}",
                ended.getRunId(), ended.getStatus(), ended.getEndedAt());

        // Then : COMPLETED 상태 확인
        assertEquals(RunStatus.COMPLETED, ended.getStatus());
    }

}