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
 *
 * 요청 경로는 AdminApiController와 1:1 매핑됨.
 *
 * @author  : yukyeong
 * @fileName: admin.js
 * @since   : 250901
 * @history
 *   - 250901 | yukyeong | 최초 작성 (회원/포인트 환급 관련 API 함수 추가)
 */


import api from './axios';

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
