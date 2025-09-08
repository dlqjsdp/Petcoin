/*
 * CompletionScreen.js
 * - 키오스크 페트병 분석 완료 화면 컴포넌트
 * - 분석이 완료되면 종료 API 호출 후, 결과(성공 개수/포인트/잔여포인트)를 사용자에게 안내
 * - 회원일 경우 서버에서 잔여 포인트를 조회하여 안내
 * 
 * 주요 기능:
 *   - petBottleCount 기반 포인트 계산 및 UI 표시
 *   - 회원(memberId 존재)일 경우 getPointChange API 호출해 잔여 포인트 표시
 *   - 비회원은 포인트 적립 불가 안내
 *   - 홈으로 가기 버튼 클릭 시 초기화 콜백(onHome) 실행
 *
 * 화면 구성:
 *   - 분석 성공 아이콘 및 안내 타이틀
 *   - 페트병 성공 수량 뱃지, 하트 아이콘
 *   - 포인트 적립 안내 및 잔여 포인트 표시(회원 전용)
 *   - 홈으로 가기 버튼
 *
 * 사용 API:
 *   - GET /api/kiosk-runs/getpointchange/{memberId} (회원 잔여 포인트 조회)
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
 *   - 250908 | yukyeong | endKioskRun 연동 제거, ProcessingScreen에서 전달된 petBottleCount 사용
 *   - 250908 | yukyeong | 회원일 경우 getPointChange API 호출해 잔여 포인트 조회/표시하도록 로직 변경
 */

import React, { useEffect, useState } from 'react';
import '../styles/common.css';
import { getPointChange } from '../../api/kiosk';

const CompletionScreen = ({ status = 'DONE', petBottleCount, onHome, runId, memberId }) => {
  const [isMember, setIsMember] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState(0);

  useEffect(() => {
    // 1) 성공 개수는 ProcessingScreen에서 넘어온 값 사용
    const total = Number.isFinite(petBottleCount) ? petBottleCount : 0;
    setPointsEarned(total * 10);

    // 2) 회원이면 Boot에서 잔여포인트만 조회
    if (status === 'DONE' && memberId) {
      setIsMember(true);
      (async () => {
        try {
          const { data } = await getPointChange(memberId);
          // data가 잔여 포인트라고 가정
          setRemainingPoints(Number.isFinite(data) ? data : 0);
        } catch (e) {
          console.error('[Completion] 포인트 조회 실패', e);
          setRemainingPoints(0);
        }
      })();
    } else {
      setIsMember(false);
      setRemainingPoints(0);
    }
  }, [status, petBottleCount, memberId]);

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