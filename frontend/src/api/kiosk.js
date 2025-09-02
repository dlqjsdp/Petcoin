/*
 * 키오스크 실행 관련 API 모듈
 * - axios 인스턴스(api)를 사용해 Spring Boot 서버와 통신
 * - 실행 시작 / 종료 / 취소 요청을 각각 함수로 제공
 *
 * 주요 역할:
 *   - startKioskRun(dto) : 실행 시작 요청 (POST /api/kiosk-runs)
 *   - endKioskRun(runId) : 실행 종료 요청 (POST /api/kiosk-runs/{runId}/end)
 *   - cancelKioskRun(runId) : 실행 취소 요청 (POST /api/kiosk-runs/{runId}/cancel)
 *
 * 요청 형식:
 *   - Method: POST
 *   - URL : /api/kiosk-runs, /api/kiosk-runs/{runId}/end, /api/kiosk-runs/{runId}/cancel
 *   - Body : JSON (시작: { kioskId, memberId }, 종료/취소: body 없음, runId는 path로 전달)
 *
 * @author  : yukyeong
 * @fileName: kiosk.js
 * @since   : 250901
 * @history
 *   - 250901 | yukyeong | 엔드포인트를 KioskRunApiController 설계에 맞게 수정 (/api/kiosk/run/* → /api/kiosk-runs, /{runId}/end, /{runId}/cancel)
 * 
 * 
 */


import api from './axios';

// 키오스크 실행 시작
export const startKioskRun = (dto) =>
    api.post('/api/kiosk-runs', dto);

// 키오스크 실행 종료
export const endKioskRun = (runId) =>
    api.post(`/api/kiosk-runs/${runId}/end`);

// 키오스크 실행 취소
export const cancelKioskRun = (runId) =>
    api.post(`/api/kiosk-runs/${runId}/cancel`);