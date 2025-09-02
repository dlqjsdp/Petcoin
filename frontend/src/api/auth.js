/*
 * 인증(Auth) 관련 API 모듈
 * - axios 인스턴스(api)를 사용해 Spring Boot 서버와 통신
 * - AuthController (/api/auth/**), MemberController (/api/member/**)와 1:1 매핑
 * - 주요 기능:
 *   - login(phone, allowAutoRegister) : 로그인(+자동가입) → JWT 발급
 *   - checkPhone(phone) : 연락처 존재 여부 확인
 *   - register(phone) : 회원가입(+JWT 즉시 발급)
 *   - logout() : 클라이언트 토큰 삭제
 *
 * DTO 매핑:
 *   - PhoneRequest : { phone }
 *   - ExistsResponse : { exists: boolean }
 *   - TokenResponse : { token: 'Bearer', accessToken, expiresIn? }
 *
 * @fileName: auth.js
 * @author  : yukyeong
 * @since   : 250902
 * @history
 *   - 250902 | yukyeong | 최초 작성 (로그인/회원가입/존재확인/로그아웃 API 함수 추가)
 */

import api from './axios';

// PhoneRequest DTO 정규화: 숫자만 남김 (010-1111-1111 -> 01011111111)
export const normalizePhone = (raw) => (raw ?? '').replace(/[^0-9]/g, '');

// 로그인(+자동가입)
export const login = (phone, allowAutoRegister = true) => {
    const payload = { phone: normalizePhone(phone) };
    return api.post(`/api/auth/login`, payload, {
        params: { allowAutoRegister },
    });
};

// 연락처 DB 존재 여부 확인
export const checkPhone = (phone) => {
    const payload = { phone: normalizePhone(phone) };
    return api.post('/api/member/check', payload);
};

// 회원가입 + 즉시 JWT 발급
export const register = (phone) => {
    const payload = { phone: normalizePhone(phone) };
    return api.post('/api/member/register', payload);
};


// 로그아웃 (클라이언트 토큰 삭제)
export const logout = () => {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common.Authorization; // 즉시 반영
    // navigate('/login')는 컴포넌트에서 실행
};