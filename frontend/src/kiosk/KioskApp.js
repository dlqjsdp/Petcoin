/*
 * KioskApp.js
 * - 키오스크 실행 전용 화면 컴포넌트
 * - 단계별 화면 전환을 useState로 관리
 *   (Main → PhoneInput → InsertBottle → Processing → Completion)
 *
 * 주요 기능:
 *   - currentStep 상태값에 따라 화면 전환
 *   - 각 단계 컴포넌트에 onNext/onBack/onComplete/onHome 콜백 전달
 *   - 헤더 영역에는 로고 고정 표시
 *
 * @fileName: KioskApp.js
 * @author  : yukyeong
 * @since   : 250901
 * @history
 *   - 250901 | yukyeong | 파일명 App.js → KioskApp.js 로 변경
 *                        - 함수명 App → KioskApp 으로 수정
 *                        - export default KioskApp 적용
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

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1:
        return <MainScreen onNext={() => goToStep(2)} />;
      case 2:
        return (
          <PhoneInputScreen 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onNext={() => goToStep(3)}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <InsertBottleScreen 
            onNext={() => goToStep(4)}
            onBack={goBack}
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
            onHome={() => goToStep(1)}
          />
        );
      default:
        return <MainScreen onNext={() => goToStep(2)} />;
    }
  };

  return (
    <div className="App">
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