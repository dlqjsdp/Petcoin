/*
 * PhoneInputScreen.js
 * - 키오스크 전용 전화번호 입력 화면 컴포넌트
 * - 사용자 번호를 키패드로 입력받고 인증 요청을 처리하며,
 *   인증 성공 시 액세스 토큰을 상위 컴포넌트로 전달
 *
 * 주요 기능:
 *   - 숫자 키패드 기반 번호 입력 (0~9, 지우기, 전체삭제)
 *   - 입력 포맷팅 및 자리 수 안내 (ex: 010-1234-5678)
 *   - 서버에 인증 요청 (POST /api/auth/login)
 *   - 인증 성공 시 setAccessToken, onNext() 호출
 *
 * @fileName: PhoneInputScreen.js
 * @author  : yukyeong
 * @since   : 250903
 * @history
 *   - 250903 | yukyeong | 최초 생성 - 전화번호 입력 및 인증 처리 로직 구현
 *   - 250903 | yukyeong | 숫자 키패드 UI 및 포맷팅 기능 추가
 *   - 250903 | yukyeong | 인증 성공 시 토큰 저장 및 다음 단계 전환 처리
 *   - 250903 | yukyeong | UX 개선 - 입력 자리 수 안내 및 버튼 활성화 제어
 */


import React from 'react';
import '../styles/common.css';
import api from '../../api/axios';


// 전화번호에서 숫자 이외 문자를 제거
const sanitizePhone = (raw) => raw.replace(/[^0-9]/g, '');

const PhoneInputScreen = ({ phoneNumber, setPhoneNumber, onNext, onBack, setAccessToken }) => {
  
  // 숫자 입력 처리 함수
  const handleNumberClick = (num) => {
    if (phoneNumber.length < 11) {
      setPhoneNumber(prev => prev + num);
    }
  };

  // 지우기: 마지막 자리 제거
  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  // 전체삭제: 전화번호 전체 초기화
  const handleClear = () => {
    setPhoneNumber('');
  };

  // 입력 포맷 및 유효성 검사
  const formatPhoneNumber = (number) => {
    if (number.length <= 3) return number;
    if (number.length <= 7) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
  };

  // 전화번호 유효성 검사 개선 (10자리 또는 11자리일 때만 다음 버튼 활성화)
  const isValidPhoneNumber = phoneNumber.length >= 10 && phoneNumber.length <= 11;

  // 인증 요청 처리
  const handleNextClick = async () => {
    try {
      const response = await api.post('/api/auth/login', { // POST 요청으로 /api/auth/login 호출
        phone: sanitizePhone(phoneNumber) // 전화번호는 숫자만 서버에 전달
      });

      const tokenData = response.data;
      console.log("인증 성공:", tokenData);

    // ⭐ 토큰 로컬 저장
    localStorage.setItem('accessToken', tokenData.accessToken);

      setAccessToken(tokenData.accessToken); // 성공 시 accessToken을 KioskApp에 전달
      onNext(); // 다음 단계 이동
    } catch (error) {
      console.error("인증 실패:", error); // 실패 시 alert 표시
      alert("등록되지 않은 번호거나 서버 오류입니다.");
    }
  };

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
        onClick={handleNextClick}
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