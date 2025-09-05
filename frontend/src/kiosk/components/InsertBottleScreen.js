/*
 * InsertBottleScreen.js
 * - 키오스크 페트병 투입 화면 컴포넌트
 * - 이용 방법 안내 → 분석 시작 → Conveyor 작동 → 다음 단계로 전환
 *
 * 주요 기능:
 *   - 안내 팝업 확인 → 분석 시작 버튼 활성화
 *   - startKioskRun API 호출로 runId 생성
 *   - conveyorStart API 호출로 라즈베리파이에 메시지 전달
 *   - 분석 시작 중에는 버튼 비활성화 및 안내 메시지 표시
 *   - 3초 후 onNext()로 다음 단계 전환
 *
 * @fileName : InsertBottleScreen.js
 * @author   : yukyeong
 * @since    : 250903
 * @history
 *   - 250903 | yukyeong | 최초 생성 - 키오스크 투입 단계 UI 및 API 연동 구현
 *   - 250903 | yukyeong | runId 생성 및 conveyorStart 연동 로직 추가
 *   - 250903 | yukyeong | 중복 클릭 방지, 버튼 상태 관리 로직 구현
 *   - 250903 | yukyeong | 분석 시작 후 3초 대기 후 자동 화면 전환 처리
 *   - 250905 | yukyeong | startKioskRun 호출 시 accessToken 전달 로직 반영 (회원/비회원 구분)
 *   - 250905 | yukyeong | runId 미생성/에러 상황에 대한 예외 처리 및 상태코드별 알림 추가
 *   - 250905 | yukyeong | 시작 중(back 버튼 클릭) 방지 로직 추가
 */

import React, { useState } from 'react';
import '../styles/common.css';
import { conveyorStart } from '../../api/pi';
import { startKioskRun } from '../../api/kiosk';

// 상위 컴포넌트(KioskApp)에서 전달할 setRunId를 props로 추가
const InsertBottleScreen = ({ onNext, onBack, memberId, kioskId, setRunId, accessToken }) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const handleConfirm = () => {
    setShowInstructions(false);
  };

  const handleStart = async () => {
    if (isStarting) return; // 중복 클릭 방지

    setIsStarting(true);
    console.log('시작 버튼 클릭됨'); // 디버깅용

    try {
      // 1) payload 구성: 회원이면 memberId 포함, 비회원이면 kioskId만
      const payload = Number.isFinite(memberId) ? { kioskId, memberId } : { kioskId };

      // 2) 세션 시작 → runId 생성 (회원 모드면 토큰 전달)
      const runResponse = await startKioskRun(payload, accessToken);
      const runId = runResponse?.data?.runId;
      console.log("생성된 runId:", runId);
      if (!runId) throw new Error('runId 생성 실패');

      setRunId(runId); // run_id 추가

      // 콘솔에 확인용 로그 추가
      console.log("✔️ 라즈베리파이에 전달할 데이터:");
      console.log("memberId:", memberId);
      console.log("runId:", runId);

      // 3) 라즈베리파이에 conveyor 시작 지시 (runId + memberId 전달)
      const piPayload = { message: 'start', runId };
      // 비회원이면 memberId를 아예 포함하지 않음
      if (Number.isFinite(memberId)) piPayload.memberId = memberId;
      await conveyorStart(piPayload);

      // 3초 후 다음 단계로 이동
      setTimeout(() => {
        console.log('다음 화면으로 이동');
        onNext(runId);
      }, 3000);

    } catch (err) {
      // 상태코드별 사용자 안내
      const status = err?.response?.status;
      if (status === 409) {
        alert('이미 진행 중인 세션이 있습니다. 잠시 후 다시 시도해주세요.');
      } else if (status === 400) {
        alert('요청 값이 올바르지 않습니다. (회원/기기 정보를 확인해주세요)');
      } else {
        alert('기기와의 통신에 문제가 발생했습니다.');
      }
      setIsStarting(false); // 실패 시 다시 버튼 활성화
    }
  };

  // 시작 중에는 뒤로가기 막기
  const handleBack = () => {
    if (isStarting) return;
    onBack();
  };

  // 키오스크 이용방법 팝업 화면
  if (showInstructions) {
    return (
      <div className="screen popup-overlay">
        <div className="instruction-popup">
          <h1 className="title">키오스크 이용 방법</h1>

          <div className="instruction-content">
            <div className="instruction-step">
              <span className="step-number">1</span>
              <span className="step-text">투입구에 페트병을 넣어주세요</span>
            </div>

            <div className="instruction-step">
              <span className="step-number">2</span>
              <span className="step-text">AI가 자동으로 페트병을 분석합니다</span>
            </div>

            <div className="instruction-step">
              <span className="step-number">3</span>
              <span className="step-text">분석 완료 후 포인트가 적립됩니다</span>
            </div>
          </div>

          <button
            className="confirm-button"
            onClick={handleConfirm}
            type="button"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  // UI
  // 페트병 투입 화면
  return (
    <div className="screen">
      <div className="content">
        <h1 className="title">투입구에 페트병을 넣어주세요.</h1>

        <div className="bottle-illustration">
          <div className="arrow-down">↓</div>
          <div className="bottle-graphic">
            <div className="bottle-cap"></div>
            <div className="bottle-lines">
              <div className="bottle-line"></div>
              <div className="bottle-line"></div>
              <div className="bottle-line"></div>
            </div>
          </div>
        </div>

        <button
          className={`start-button ${isStarting ? 'starting' : ''}`}
          onClick={handleStart}
          disabled={isStarting}
          type="button"
          style={{
            background: isStarting ? '#45a049' : '#4CAF50',
            cursor: isStarting ? 'not-allowed' : 'pointer',
            opacity: isStarting ? 0.7 : 1
          }}
        >
          {isStarting ? '분석 시작 중...' : '시작하기'}
        </button>

        {isStarting && (
          <div style={{
            marginTop: '20px',
            color: '#666',
            fontSize: '16px',
            textAlign: 'center'
          }}>
            3초 후 자동으로 분석이 시작됩니다...
          </div>
        )}
      </div>

      <button className="back-button" onClick={handleBack} type="button" disabled={isStarting}>
        ←이전
      </button>
    </div>
  );
};

export default InsertBottleScreen;