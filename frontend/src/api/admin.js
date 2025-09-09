/*
 * 관리자(Admin) 관련 API 모듈
 * - axios 인스턴스(api)를 사용해 Spring Boot 서버와 통신
 * - 회원 관리 및 포인트 환급 요청 관련 엔드포인트 호출 함수들을 제공
 *
 * 주요 기능:
 *   - getAllMembers(criteria) : 전체 회원 목록 조회 (페이징/검색 포함)
 *   - getMemberDetail(memberId) : 회원 단건 상세 조회
 *   - getPointRequests(criteria) : 포인트 환급 요청 목록 조회 (페이징/검색 포함)
 *   - getPointRequestById(requestId) : 포인트 환급 단건 상세 조회
 *   - processPointRequest(id, payload) : 포인트 환급 요청 처리 (승인/거절 등 상태 변경)
 *   - getKiosks(criteria) : 키오스크 장치 목록 조회 (페이징/검색 포함)
 *   - getKiosk(kioskId) : 키오스크 장치 단건 상세 조회
 *   - createKiosk(payload) : 키오스크 장치 등록
 *   - updateKiosk(id, payload) : 키오스크 장치 수정
 *   - deleteKiosk(id) : 키오스크 장치 삭제 (소프트 삭제)
 *   - getKioskRuns(criteria) : 키오스크 실행 세션 목록 조회 (페이징/검색 포함)
 *   - getKioskRun(runId) : 키오스크 실행 세션 단건 상세 조회
 *
 * 요청 경로는 AdminApiController와 1:1 매핑됨.
 *
 * @author  : yukyeong
 * @fileName: admin.js
 * @since   : 250901
 * @history
 *   - 250901 | yukyeong | 최초 작성 (회원/포인트 환급 관련 API 함수 추가)
 *   - 250908 | yukyeong | 키오스크 장치/실행 세션 관련 API 함수 추가
 *   - 250909 | yukyeong | 키오스크 API 개선: getKiosks/getKioskRuns 응답 구조를 {list, pageInfo} 형태로 통일,
 *                         getKiosk/getKioskRun 단건 조회 시 null 가드 처리 추가
 */


import api from './axios';

/* 기존 회원/포인트 API */

// 전체 회원 목록 조회 (Criteria를 쿼리로 전달)
export const getAllMembers = (params) =>
    api.get('/api/admin/member/list', { params });

// 회원 단건 조회 (서버가 포인트 내역까지 포함해 주면 그대로 사용)
export const getMemberDetail = (memberId) =>
    api.get(`/api/admin/member/${memberId}`);

// 포인트 환급 요청 목록 조회 (Criteria를 쿼리스트링으로 전달)
export const getPointRequests = (params) =>
    api.get('/api/admin/point/list', { params });

// 포인트 환급 단건 상세 조회
export const getPointRequestById = (requestId) =>
    api.get(`/api/admin/point/${requestId}`);

// 포인트 환급 요청 처리 (승인/거절 등 상태 변경)
export const processPointRequest = (requestId, payload) =>
    api.put(`/api/admin/point/process/${requestId}`, payload);


/* 키오스크 장치 */
// 목록 조회 (list + pageInfo 같이 반환)
export const getKiosks = (params) =>
    api.get('/api/admin/kiosk/list', { params })
        .then(r => ({
            list: r?.data?.kioskList ?? [],
            pageInfo: r?.data?.pageInfo ?? null,
        }));

// 단건 조회 (단일 객체만 반환)
export const getKiosk = (kioskId) =>
    api.get(`/api/admin/kiosk/${kioskId}`)
        .then(r => r?.data?.kiosk ?? null);

// 등록
export const createKiosk = (payload) =>
    api.post('/api/admin/kiosk/register', payload);

// 수정
export const updateKiosk = (kioskId, payload) =>
    api.put(`/api/admin/kiosk/${kioskId}`, payload);

// 삭제(소프트 삭제)
export const deleteKiosk = (kioskId) =>
    api.delete(`/api/admin/kiosk/${kioskId}`);


/* 키오스크 실행 세션 로그 */
// 목록 조회 (list + pageInfo 같이 반환)
export const getKioskRuns = (params) =>
    api.get('/api/admin/kiosk/log/list', { params })
        .then(r => ({
            list: r?.data?.kioskRunList ?? [],
            pageInfo: r?.data?.pageInfo ?? null,
        }));

// 단건 조회
export const getKioskRun = (runId) =>
    api.get(`/api/admin/kiosk/log/${runId}`)
        .then(r => r?.data?.kioskRun ?? null);