import React from 'react';
import '../styles/common.css';

const CompletionScreen = ({ petBottleCount, points, onHome }) => {
  const pointsEarned = petBottleCount * 10;

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