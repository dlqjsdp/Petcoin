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

function KioskApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessToken, setAccessToken] = useState(null); // 토큰 추가
  const [petBottleCount, setPetBottleCount] = useState(3);
  const [points, setPoints] = useState(1000);
  const [isProcessing, setIsProcessing] = useState(false);

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 홈으로 이동하면 초기화
  const handleGoHome = () => {
    setPhoneNumber('');
    setAccessToken(null);
    setCurrentStep(1);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <MainScreen onNext={(role) => {
          if (role === 'member') goToStep(2); // 전화번호 입력
          else if (role === 'nonMember') goToStep(3); // 페트병 투입
        }} />;
      case 2:
        return (
          <PhoneInputScreen
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onNext={() => goToStep(3)} // 성공 후 다음 단계
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
            onNext={() => goToStep(4)}
            onBack={goBack}
            accessToken={accessToken} // 필요 시 API 호출용
          />
        );
      case 4:
        return (
          <ProcessingScreen
            onComplete={() => goToStep(5)}
          />
        );
      case 5:
        return (
          <CompletionScreen
            petBottleCount={petBottleCount}
            points={points}
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
            <img
              src={logoImage}
              alt="PETCoin Logo"
              className="logo-image"
            />
          </div>
        </div>

        {/* 화면 내용 */}
        <div className="screen-content">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}

export default KioskApp;