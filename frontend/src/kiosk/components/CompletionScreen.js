/*
 * CompletionScreen.js
 * - 키오스크 페트병 분석 완료 화면 컴포넌트
 * - 분석이 완료되면 종료 API 호출 후, 결과(성공 개수/포인트/잔여포인트)를 사용자에게 안내
 *
 * 주요 기능:
 *   - runId 기반 종료 처리 API 호출 (endKioskRun)
 *   - 페트병 개수 및 적립 포인트 UI 표시
 *   - 홈으로 가기 버튼 클릭 시 초기화 콜백 실행
 *
 * 화면 구성:
 *   - 분석 성공 아이콘 및 안내 타이틀
 *   - 페트병 성공 수량 뱃지, 하트 아이콘, 포인트 적립 안내
 *   - 잔여 포인트 표시 및 홈 버튼
 *
 * 사용 API:
 *   - POST /api/kiosk/end (runId 기반 종료 처리)
 *
 * @fileName : CompletionScreen.js
 * @author   : yukyeong
 * @since    : 250904
 * @history
 *   - 250904 | yukyeong | 최초 생성 - 분석 완료 화면 UI 및 포인트/성공 수량 렌더링
 *   - 250904 | yukyeong | runId 기반 종료 처리 API 연동(endKioskRun) 및 useEffect 적용
 *   - 250904 | yukyeong | 홈으로 가기 버튼 클릭 시 초기화 함수(onHome) 호출 처리
 */

import React, { useEffect } from 'react';
import '../styles/common.css';
import { endKioskRun } from '../../api/kiosk';

const CompletionScreen = ({ petBottleCount, points, onHome, runId }) => {
  const pointsEarned = petBottleCount * 10;

  useEffect(() => {
    console.log('[CompletionScreen] 마운트됨. runId:', runId);

    const completeRun = async () => {
      if (!runId) {
        console.warn('[CompletionScreen] runId 없음 → 종료 요청 생략');
        return;
      }

      try {
        const response = await endKioskRun(runId);
        console.log('[CompletionScreen] 종료 API 호출 성공:', response.data);
      } catch (err) {
        console.error('[CompletionScreen] 종료 API 호출 실패:', err);
      }
    };

    completeRun();
  }, [runId]); // 마운트 시 한 번만 실행

  const handleHomeClick = () => {
    console.log('홈으로 가기 버튼 클릭됨'); // 디버깅용
    onHome();
  };

  return (
    <div className="content">
      <div className="success-icon">
        ✓
      </div>

      <h1 className="title">분석 완료!</h1>

      <div className="result-card">
        <div className="pet-count-badge">
          페트병 {petBottleCount}개 중 {petBottleCount}개 성공!
        </div>

        <div className="heart-icon">
          <span>♡</span>
        </div>

        <div className="points-earned">
          +{pointsEarned} 포인트 적립
        </div>

        <div className="points-display">
          <span>잔여 포인트:</span>
          <span style={{ fontWeight: 'bold' }}>{points.toLocaleString()}p</span>
        </div>
      </div>

      <div className="button-group" style={{ marginTop: '40px' }}>
        <button
          className="main-button member-button"
          onClick={handleHomeClick}
          type="button"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;