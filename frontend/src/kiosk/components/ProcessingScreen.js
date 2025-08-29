import React, { useEffect } from 'react';
import '../styles/common.css';

const ProcessingScreen = ({ onComplete }) => {
  useEffect(() => {
    // 3초 후 완료 화면으로 이동
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="content">
      <h1 className="title">분석 중입니다.</h1>
      
      <div className="loading-spinner"></div>
      
      <div className="processing-text">
        페트병을 분석하고 있습니다.<br />
        잠시만 기다려 주세요...
      </div>
    </div>
  );
};

export default ProcessingScreen;