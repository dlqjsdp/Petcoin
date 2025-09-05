/*
 * KioskApp.js
 * - 키오스크 모드의 루트 컴포넌트
 * - 단계별 화면 전환 (회원/비회원 선택 → 전화번호 입력 → 페트병 투입 → 처리 중 → 완료)
 *
 * 주요 기능:
 *   - currentStep 상태에 따라 각 화면(MainScreen~CompletionScreen) 조건부 렌더링
 *   - 회원은 전화번호 입력(2단계), 비회원은 바로 페트병 투입(3단계)
 *   - 헤더 영역(로고)은 고정, 본문만 동적으로 변경
 *   - 완료 화면에서 다시 홈으로 이동 가능
 *
 * @fileName : KioskApp.js
 * @author   : yukyeong
 * @since    : 250903
 * @history
 *   - 250903 | yukyeong | 최초 생성 - 화면 단계 상태 관리 및 각 스크린 컴포넌트 연결 구조 구현
 *   - 250903 | yukyeong | 회원/비회원 분기 로직 추가 (전화번호 입력 vs 바로 투입)
 *   - 250903 | yukyeong | 로고 고정 헤더 및 공통 레이아웃 구성 완료
 *   - 250903 | yukyeong | 전화번호 입력 화면에 onBack 시 전화번호 초기화 추가
 *   - 250903 | yukyeong | 로그인 성공 시 setAccessToken으로 토큰 저장 기능 추가
 *   - 250903 | yukyeong | InsertBottleScreen에 memberId, kioskId 동적 전달 처리 완료 (case 3 수정)
 *   - 250904 | yukyeong | CompletionScreen에서 runId 기반 종료 처리 및 handleGoHome 초기화 검증
 *   - 250904 | yukyeong | handleGoHome 실행 시 runId, phoneNumber, token, count, point 상태 초기화 확인용 console 추가
 *   - 250904 | yukyeong | CompletionScreen → onHome 실행 시 정상적으로 MainScreen 복귀 및 초기화되도록 검증 완료
 * 
 */

import React, { useState } from 'react';
import MainScreen from './components/MainScreen';
import PhoneInputScreen from './components/PhoneInputScreen';
import InsertBottleScreen from './components/InsertBottleScreen';
import ProcessingScreen from './components/ProcessingScreen';
import CompletionScreen from './components/CompletionScreen';
import logoImage from './img/logo.png';
import './App.css';
import './styles/common.css';
import { jwtDecode } from 'jwt-decode';

function KioskApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessToken, setAccessToken] = useState(null); // 토큰 추가
  const [petBottleCount, setPetBottleCount] = useState(0); // 실제 수량을 나중에 세팅
  const [runId, setRunId] = useState(null); // runId 상태 추가

  const goToStep = (step) => {
    setCurrentStep(step);
  };


  // 홈으로 이동하면 초기화
  const handleGoHome = () => {
    console.log('🏠 홈 초기화 실행');

    setPhoneNumber('');
    setAccessToken(null);
    setRunId(null); // runId도 초기화
    setPetBottleCount(0); // 페트병 수 초기화
    setCurrentStep(1); // 메인 화면으로
  };

  const renderCurrentStep = () => {
    // 현재 한 대만 운용하므로 고정 kioskId
    const kioskId = 1;

    // accessToken → memberId 추출
    let memberId = null;
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        memberId = decoded.memberId;
      } catch (err) {
        console.error("JWT 디코딩 실패:", err);
      }
    }

    switch (currentStep) {
      case 1:
        return (
          <MainScreen
            onNext={(role) => {
              if (role === 'member') goToStep(2); // 전화번호 입력 화면
              else if (role === 'nonMember') goToStep(3); // 바로 투입 화면
            }}
          />
        );
      case 2:
        return (
          <PhoneInputScreen
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onNext={() => goToStep(3)} // 로그인 성공 후 투입 화면
            onBack={() => {
              setPhoneNumber(''); // 전화번호 초기화
              goToStep(1);  // 1단계로 이동
            }}
            setAccessToken={setAccessToken} // 토큰 전달
          />
        );
      case 3:
        return (
          <InsertBottleScreen
            onNext={(runId) => {
              setRunId(runId); // runId 저장
              goToStep(4); // 처리 중 화면
            }}
            // 뒤로가기: 회원이면 Step2, 비회원이면 Step1
            onBack={() => (accessToken ? goToStep(2) : goToStep(1))}
            accessToken={accessToken} // 필요 시 API 호출용
            memberId={memberId} // 동적으로 추출
            kioskId={kioskId} // 기기 고유값
            setRunId={setRunId} // runId를 상위에 저장하도록 props 전달
          />
        );
      case 4:
        return (
          <ProcessingScreen
            runId={runId} // runId 전달
            // 완료 시 실제 수량을 받아서 세팅하고 Step5로 이동
            onComplete={({ status = 'DONE', totalPet = 0 } = {}) => {
              if (!runId) {
                console.error('runId 없음 → 홈으로 복귀');
                handleGoHome();
                return;
              }
              if (status === 'DONE') {
                setPetBottleCount(Number.isFinite(totalPet) ? totalPet : 0);
                goToStep(5); // 완료 화면
              } else {
                // TIMEOUT/ERROR → 취소(또는 중단) 화면으로 보내거나 곧장 홈
                setPetBottleCount(0);
                alert('세션이 중단되었습니다.');
                handleGoHome();
              }
            }}
          />
        );
      case 5:
        return (
          <CompletionScreen
            status="DONE"
            petBottleCount={petBottleCount}
            runId={runId}
            onHome={handleGoHome} // 초기화 포함
          />
        );
      default:
        return <MainScreen onNext={() => goToStep(2)} />;
    }
  };

  return (
    <div className="KioskApp">
      <div className="kiosk-container">
        {/* 헤더 - 모든 화면에 고정 */}
        <div className="header">
          <div className="logo">
            <img src={logoImage} alt="PETCoin Logo" className="logo-image" />
          </div>
        </div>

        {/* 화면 내용 */}
        <div className="screen-content">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}

export default KioskApp;