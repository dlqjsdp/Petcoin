/*
 * 라즈베리파이 전용 axios 인스턴스 설정 파일
 * - Flask/FastAPI 등 라즈베리파이 서버와 통신할 때 사용
 * - baseURL은 환경변수(REACT_APP_PI_API_URL)에서 주입
 *   예: http://192.168.10.245:5000
 * - Content-Type을 application/json으로 고정
 *
 * 사용 예시:
 *   import pi from './axiosPi';
 *
 *   // 라즈베리파이에 예측 결과 전송
 *   pi.post('/conveyor/result', { result: 'OK' });
 *
 *
 * @author  : yukyeong
 * @fileName: axiosPi.js
 * @since   : 250901
 * @history
 *   - 250901 | yukyeong | 파일 최초 생성
 *                       - baseURL을 라즈베리파이 서버 전용으로 분리
 *                       - JSON Content-Type 기본 헤더 적용
 */


import axios from 'axios';

// 1) 인스턴스 생성
const pi = axios.create({
    baseURL: process.env.REACT_APP_PI_API_URL, // 예: http://192.168.10.245:5000
    headers: { 'Content-Type': 'application/json' },
});

// 2) 내보내기
export default pi;