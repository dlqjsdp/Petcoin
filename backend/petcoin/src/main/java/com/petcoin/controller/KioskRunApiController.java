package com.petcoin.controller;

import com.petcoin.dto.KioskRunEndRequest;
import com.petcoin.dto.KioskRunResponse;
import com.petcoin.dto.KioskRunStartRequest;
import com.petcoin.service.KioskRunService;
import com.petcoin.service.PointHisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

/*
 * 키오스크 실행 세션 API 컨트롤러
 * - 실행 시작, 종료, 취소를 처리하는 REST API
 * - 서비스 계층(KioskRunService) 호출 후 결과를 HTTP 응답으로 변환
 * - 예외 상황은 상태 코드(400, 409, 500)로 매핑하여 클라이언트에 반환
 *
 * @author  : yukyeong
 * @fileName: KioskRunApiController
 * @since   : 250830
 * @history
 *   - 250830 | yukyeong | 최초 생성
 *                        - 실행 시작 API (POST /api/kiosk-runs) 구현
 *                        - 실행 종료 API (POST /api/kiosk-runs/{runId}/end) 구현
 *                        - 실행 취소 API (POST /api/kiosk-runs/{runId}/cancel) 구현
 *                        - 예외 처리 추가 (IllegalArgumentException → 400, IllegalStateException → 409, 기타 → 500)
 *                        - 세션 종료시 회수 페트병 수 받아서 dto에 넣어야 함
 *   - 250905 | yukyeong | POST /api/kiosk-runs/{runId}/cancel 엔드포인트에서 포인트 부수효과 제거
 */

@RestController
@RequestMapping("/api/kiosk-runs")
@RequiredArgsConstructor
@Validated
@Slf4j
public class KioskRunApiController {

    private final KioskRunService kioskRunService;
    private final PointHisService pointHisService;

    /**
     * 실행 시작
     * - body: { "kioskId": 1, "memberId": 1 }
     * - 201 Created + Location: /api/kiosk-runs/{runId}
     */
    @PostMapping
    public ResponseEntity<?> start(@Valid @RequestBody KioskRunStartRequest request) {
        try {
            // 1) 실행 시작 처리
            KioskRunResponse res = kioskRunService.startRun(request);
            // 2) 생성된 리소스의 URI (/api/kiosk-runs/{runId}) 생성
            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest() // 현재 요청 URL (/api/kiosk-runs)
                    .path("/{id}") // 뒤에 /{id} 붙이기
                    .buildAndExpand(res.getRunId()) // 실제 runId 값 대입
                    .toUri(); // URI 객체로 변환
            // 3) 201 Created + Location 헤더 + body 응답
            return ResponseEntity.created(location).body(res);

        } catch (IllegalArgumentException e) {
            // 잘못된 입력값/존재하지 않는 리소스
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 Bad Request
        } catch (IllegalStateException e) {
            // 비즈니스 충돌 (이미 실행중, ONLINE 아님 등)
            return ResponseEntity.status(409).body(e.getMessage());  // 409 Conflict
        } catch (Exception e) {
            // 그 외 알 수 없는 오류
            log.error("실행 시작 중 서버 오류", e);
            return ResponseEntity.status(500).body("서버 오류가 발생했습니다."); // 500 Internal Server Error
        }
    }

    /**
     * 실행 종료 (멱등)
     * - path: /api/kiosk-runs/{runId}/end
     * - body: {}
     * - 200 OK
     */
    @PostMapping("/{runId}/end")
    public ResponseEntity<?> end(@PathVariable Long runId,
                                    @RequestBody(required = false) KioskRunEndRequest reqBody) {
        try {
            // 1) DTO 생성 (PathVariable → DTO 세팅)
            KioskRunEndRequest req = new KioskRunEndRequest();
            req.setRunId(runId);
            if (reqBody != null && reqBody.getTotalPet() != 0) {
                req.setTotalPet(reqBody.getTotalPet()); // totalPet 세팅
            }
            // 2) 실행 종료 처리
            KioskRunResponse res = kioskRunService.endRun(req);
            // 3) 200 OK + body 응답
            return ResponseEntity.ok(res);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 Bad Request (세션 없음 등)
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage()); // 409 Conflict
        } catch (Exception e) {
            log.error("실행 종료 중 서버 오류", e);
            return ResponseEntity.status(500).body("서버 오류가 발생했습니다."); // 500 Internal Server Error
        }
    }

    /**
     * 실행 취소 (멱등)
     * - path: /api/kiosk-runs/{runId}/cancel
     * - body: {}
     * - 200 OK
     */
    @PostMapping("/{runId}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long runId) {
        try {
            // 1) DTO 생성
            KioskRunEndRequest req = new KioskRunEndRequest();
            req.setRunId(runId);
            // 2) 실행 취소 처리
            KioskRunResponse res = kioskRunService.cancelRun(req);
            // 3) 200 OK + body 응답
            return ResponseEntity.ok(res);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 Bad Request (세션 없음 등)
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage()); // 409 Conflict
        } catch (Exception e) {
            log.error("실행 취소 중 서버 오류", e);
            return ResponseEntity.status(500).body("서버 오류가 발생했습니다."); // 500 Internal Server Error
        }
    }

    @GetMapping("/getpointchange/{memberId}")
    public ResponseEntity<?> getPointChange(@PathVariable Long memberId) {

        int newPointChange = pointHisService.getNewPointChange(memberId);

        return ResponseEntity.ok(newPointChange);
    }

}
