/*
 * axios 인스턴스 설정 파일
 * - 공통 baseURL, JSON 기본 헤더, 쿠키 설정 포함
 * - JWT accessToken 자동 첨부 (localStorage → Authorization 헤더)
 *
 * @author  : yukyeong
 * @fileName: axios.js
 * @since   : 250901
 * @history
 *   - 250901 | yukyeong | 파일 최초 생성
 *                        - baseURL을 환경변수(REACT_APP_API_URL)로 분리
 *                        - withCredentials 옵션 활성화 (세션 쿠키 허용)
 *                        - 기본 Content-Type을 application/json으로 설정
 *                        - 요청 인터셉터에서 JWT 토큰 자동 부착 처리 추가
 */


import axios from 'axios';

// 1) 인스턴스 생성
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// 2) 인터셉터 설정 (요청 직전)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken'); // JWT 꺼내오기
    console.log('[인터셉터] accessToken =', token); // 콘솔에 출력해보기
    if (token) config.headers.Authorization = `Bearer ${token}`; // 있으면 헤더에 추가
    return config;
});

// 3) 내보내기
export default api;