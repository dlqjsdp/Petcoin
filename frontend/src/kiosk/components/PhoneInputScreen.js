import React from 'react';
import '../styles/common.css';

const PhoneInputScreen = ({ phoneNumber, setPhoneNumber, onNext, onBack }) => {
  const handleNumberClick = (num) => {
    if (phoneNumber.length < 11) {
      setPhoneNumber(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  const formatPhoneNumber = (number) => {
    if (number.length <= 3) return number;
    if (number.length <= 7) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
  };

  // 전화번호 유효성 검사 개선
  const isValidPhoneNumber = phoneNumber.length >= 10 && phoneNumber.length <= 11;

  return (
    <div className="screen">
      <div className="content">
        <h1 className="title">휴대폰 번호 입력</h1>
        
        <input 
          type="text" 
          className="phone-input"
          value={formatPhoneNumber(phoneNumber)}
          readOnly
          placeholder="휴대폰 번호를 입력하세요"
        />
        
        {/* 입력 상태 표시 추가 */}
        <div style={{ marginBottom: '20px', color: '#666', fontSize: '16px' }}>
          {phoneNumber.length}/11 자리 입력됨
        </div>
        
        <div className="number-pad">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
            <button 
              key={num}
              className="number-button"
              onClick={() => handleNumberClick(num.toString())}
              type="button"
            >
              {num}
            </button>
          ))}
          
          <button 
            className="number-button delete-key"
            onClick={handleDelete}
            type="button"
            disabled={phoneNumber.length === 0}
          >
            지우기
          </button>
          
          <button 
            className="number-button"
            onClick={() => handleNumberClick('0')}
            type="button"
          >
            0
          </button>
          
          <button 
            className="number-button delete-key"
            onClick={handleClear}
            type="button"
            disabled={phoneNumber.length === 0}
          >
            전체삭제
          </button>
        </div>
      </div>
      
      <button className="back-button" onClick={onBack} type="button">
        ←이전
      </button>
      
      <button 
        className="next-button" 
        onClick={onNext}
        disabled={!isValidPhoneNumber}
        type="button"
        style={{
          background: isValidPhoneNumber ? '#ff4444' : '#cccccc',
          cursor: isValidPhoneNumber ? 'pointer' : 'not-allowed'
        }}
      >
        다음→ {!isValidPhoneNumber && `(${10 - phoneNumber.length}자리 더 입력)`}
      </button>
    </div>
  );
};

export default PhoneInputScreen;