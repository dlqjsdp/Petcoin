/*
 * 키오스크 실행 관련 API 모듈
 * - axios 인스턴스(api)를 사용해 Spring Boot 서버와 통신
 * - 실행 시작 / 종료 / 취소 요청을 각각 함수로 제공
 *
 * 주요 역할:
 *   - startKioskRun(dto, accessToken) : 실행 시작 요청 (POST /api/kiosk-runs)
 *     · 회원: Authorization 헤더에 accessToken 포함
 *     · 비회원: accessToken 없이 호출
 *   - endKioskRun(runId, body) : 실행 종료 요청 (POST /api/kiosk-runs/{runId}/end)
 *     · body에 totalPet 포함 가능 (없으면 0 처리)
 *   - cancelKioskRun(runId, body) : 실행 취소 요청 (POST /api/kiosk-runs/{runId}/cancel)
 *     · 보통 body 없음, 필요시 구조 맞추기 위해 전달 가능
 *   - getPointChange(memberId) : 잔여 포인트 조회 (GET /api/kiosk-runs/getpointchange/{memberId})
 *
 * 요청 형식:
 *   - Method : POST / GET
 *   - URL : /api/kiosk-runs, /api/kiosk-runs/{runId}/end, /api/kiosk-runs/{runId}/cancel, /api/kiosk-runs/getpointchange/{memberId}
 *   - Body : JSON (시작: { kioskId, memberId }, 종료/취소: { totalPet } or 없음)
 *
 * 
 * @author  : yukyeong
 * @fileName: kiosk.js
 * @since   : 250901
 * @history
 *   - 250901 | yukyeong | 최초 작성 - KioskRunApiController 설계에 맞게 엔드포인트 정리
 *   - 250905 | yukyeong | startKioskRun에 accessToken 옵션 추가 (회원/비회원 구분 처리)
 *   - 250905 | yukyeong | endKioskRun, cancelKioskRun에 body 전달 가능하도록 수정 (totalPet 지원)
 *   - 250908 | yukyeong | getPointChange API 추가 (회원 잔여 포인트 조회 기능)
 */


import api from './axios';

// 키오스크 실행 시작
// 회원: accessToken 전달 (Authorization 헤더)
// 비회원: accessToken 생략
export const startKioskRun = (dto, accessToken) =>
    api.post('/api/kiosk-runs', dto, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    });

// 키오스크 실행 종료
// totalPet을 서버로 넘기고 싶으면 body에 담아서 보낼 수 있게 함
// 서버는 null/미전달이면 0으로 처리 가능
export const endKioskRun = (runId, body) =>
    api.post(`/api/kiosk-runs/${runId}/end`, body ?? {});

// 키오스크 실행 취소
export const cancelKioskRun = (runId, body) =>
    api.post(`/api/kiosk-runs/${runId}/cancel`, body ?? {});

// 최근 포인트 변화량 + 현재 잔액 조회 (PointHistoryDto 반환)
// 응답 예: { memberId: 1, pointChange: 10, pointBalance: 40, ... }
export const getPointChange = (memberId) =>
    api.get(`/api/kiosk-runs/getpointchange/${memberId}`);

