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
 *   - 250905 | yukyeong | endKioskRun 호출 시 totalPet 전달, 응답 기반 회원/비회원 UI 분기
 *   - 250905 | yukyeong | points prop 제거, remainingPoints를 서버 응답으로 표시
 *   - 250905 | yukyeong | status prop('DONE'|'TIMEOUT'|'ERROR') 도입 → DONE일 때만 endKioskRun 호출
 *   - 250905 | yukyeong | runId 유효성 가드 및 콘솔 로그 정리, useEffect deps를 [status, runId, petBottleCount]로 조정
 *   - 250905 | yukyeong | endKioskRun에 { totalPet } 전달, 응답(memberId/pointBalance) 기반으로 회원/비회원 UI 및 잔여 포인트 표시
 */

import React, { useEffect, useState } from 'react';
import '../styles/common.css';
import { endKioskRun } from '../../api/kiosk';

const CompletionScreen = ({ status = 'DONE', petBottleCount, onHome, runId }) => {
  const [isMember, setIsMember] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState(0);

  useEffect(() => {
    console.log('[CompletionScreen] 마운트됨. runId:', runId);

    const completeRun = async () => {
      if (status !== 'DONE') {
        console.log('[CompletionScreen] DONE이 아니므로 종료 API 호출 건너뜀. status =', status);
        return;
      }
      
      if (!runId) {
        console.warn('[CompletionScreen] runId 없음 → 종료 요청 생략');
        return;
      }

      try {
        // totalPet 포함해서 종료 요청
        const response = await endKioskRun(runId, { totalPet: petBottleCount });
        console.log('[CompletionScreen] 종료 API 호출 성공:', response.data)

        const data = response.data;
        if (data.memberId) {
          setIsMember(true);
          setPointsEarned(petBottleCount * 10); // 서버 정책에 맞게 계산
          setRemainingPoints(data.pointBalance ?? 0);
        } else {
          setIsMember(false);
        }

      } catch (err) {
        console.error('[CompletionScreen] 종료 API 호출 실패:', err);
      }
    };

    completeRun();
  }, [status, runId, petBottleCount]); // 마운트 시 한 번만 실행

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

        {isMember ? (
          <>
            <div className="points-earned">
              +{pointsEarned} 포인트 적립
            </div>
            <div className="points-display">
              <span>잔여 포인트:</span>
              <span style={{ fontWeight: 'bold' }}>{remainingPoints.toLocaleString()}p</span>
            </div>
          </>
        ) : (
          <div className="points-earned">
            비회원은 포인트 적립이 되지 않습니다
          </div>
        )}
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