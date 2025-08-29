import React, { useState } from 'react';
import '../styles/common.css';

const InsertBottleScreen = ({ onNext, onBack }) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const handleConfirm = () => {
    setShowInstructions(false);
  };

  const handleStart = () => {
    if (isStarting) return; // 중복 클릭 방지
    
    setIsStarting(true);
    console.log('시작 버튼 클릭됨'); // 디버깅용
    
    // 3초 후 자동으로 다음 단계로
    setTimeout(() => {
      console.log('다음 화면으로 이동'); // 디버깅용
      onNext();
    }, 3000);
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
          {isStarting ? '분석 시작 중...' : '시작 하기'}
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
      
      <button className="back-button" onClick={onBack} type="button">
        ←이전
      </button>
    </div>
  );
};

export default InsertBottleScreen;