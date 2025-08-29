import React, { useState } from 'react';
import MainScreen from './components/MainScreen';
import PhoneInputScreen from './components/PhoneInputScreen';
import InsertBottleScreen from './components/InsertBottleScreen';
import ProcessingScreen from './components/ProcessingScreen';
import CompletionScreen from './components/CompletionScreen';
import logoImage from './img/logo.png';
import './App.css';
import './styles/common.css';

function App() {
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

export default App;