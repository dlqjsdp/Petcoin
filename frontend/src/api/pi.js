/*
 * @fileName : pi.js
 * @description : 라즈베리파이와 통신하는 키오스크 전용 API 모듈
 * @author : yukyeong
 * @since : 250903
 * @history
 *   - 250903 | yukyeong | conveyorStart: 컨베이어 동작 시작 요청 API 추가
 *   - 250903 | yukyeong | predictImage: AI 이미지 예측 요청 API 추가
 *   - 250903 | yukyeong | conveyorResult: 예측 결과(정상/불량) 전달 API 추가 (LED/부저 제어용)
 */

import pi from './axiosPi';

// 컨베이어 시작
export const conveyorStart = (payload) =>
    pi.post('/api/conveyor/start', payload);

// 이미지 예측 요청
export const predictImage = (payload) =>
    pi.post('/api/predict', payload);

// 예측 결과 전달 (LED/부저 제어)
export const conveyorResult = (payload) =>
    pi.post('/api/conveyor/result', payload);

// 분석 상태 확인
export const checkAnalysisComplete = (runId) =>
    pi.get('/api/analysis/status', {
        params: { runId },
    });