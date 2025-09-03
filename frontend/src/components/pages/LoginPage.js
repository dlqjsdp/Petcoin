/*
 * LoginPage.js
 * 전화번호 기반 간편 로그인 화면
 *
 * 기능 요약:
 *  - 전화번호 정규화(normalizePhone) 후 길이(10~11) 검증
 *  - 로그인 1차: login(..., false) 호출(미가입이면 400 → 모달)
 *  - 모달 동의 후 2차: login(..., true) 호출(자동가입 + 토큰 발급)
 *  - 액세스 토큰 localStorage 저장 + axios Authorization 헤더 주입
 *  - 성공 시 마이페이지(/user)로 이동, replace:true로 뒤로가기 방지
 *  - 폼 접근성(label htmlFor ↔ input id), 필드/전역 에러 메시지 표시
 *
 * @author  : yukyeong
 * @file    : LoginPage.js
 * @since   : 250902
 * @history
 *   - 250902 | yukyeong | 초기 작성: 전화번호 입력/검증/로그인/토큰 저장/마이페이지 이동 기본 흐름 구현.
 *   - 250902 | yukyeong | useNavigate로 라우팅 이동 통일(navigateTo prop 제거).
 *   - 250902 | yukyeong | validate()가 { ok, p } 반환하도록 변경, API에 정규화된 p 적용.
 *   - 250902 | yukyeong | axios 전역 인증 헤더 설정(api.defaults.headers.common.Authorization) 추가.
 *   - 250902 | yukyeong | 로그인 성공 시 navigate('/user', { replace: true })로 히스토리 교체.
 *   - 250902 | yukyeong | 접근성 보강: label htmlFor ↔ input id, 에러 메시지 role="alert".
 *   - 250902 | yukyeong | 로고 파일 교체: logo-c.png 사용.
 *   - 250903 | heekyung | 회원가입 모달, 연락처 자동, 화면 - 자동 기재 - 추가 코드 작성.
 * 
 */

import React, { useState } from 'react';
import '../styles/LoginPage.css';
import logo from "../../img/logo-c.png";
import { login, normalizePhone } from '../../api/auth'; // 로그인 API 호출 함수, 전화번호 정규화 유틸
import api from '../../api/axios'; // 공용 axios 인스턴스(헤더 설정용)
import { useNavigate } from 'react-router-dom'; // 라우팅 이동 훅

const LoginPage = () => {
  // 입력값/오류/로딩 상태
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false); // 자동가입 동의 모달 표시 여부를 제어하는 상태(false → 숨김, true → 화면에 모달 표시)
  const [pendingPhone, setPendingPhone] = useState(null); // 로그인 시 입력한 번호가 DB에 없을 때 이 값에 저장 → 모달에서 안내/재사용
  const [signupLoading, setSignupLoading] = useState(false); // 자동가입 진행 중 로딩 스피너/버튼 비활성화를 위한 상태
  const navigate = useNavigate();

  // 클라이언트 유효성 검증
  // - normalizePhone: 하이픈/공백 제거 → 숫자만 남김
  // - 길이 제한: 10~11자리(국내 휴대폰 기준)
  // - 결과로 ok(통과 여부)와 정규화된 p 반환 → API에 그대로 사용
  const validate = () => {
    const p = normalizePhone(phone); // 숫자만 남기기 (예: "010-1234-5678" -> "01012345678")
    const newErrors = {};
    if (!p) newErrors.phone = '전화번호를 입력해주세요';
    else if (p.length < 10 || p.length > 11) newErrors.phone = '올바른 전화번호 형식이 아닙니다';
    setErrors(newErrors);
    return { ok: Object.keys(newErrors).length === 0, p };
  };

  // 폼 제출 핸들러
  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 제출(페이지 리로드) 방지
    const { ok, p } = validate(); // 검증 + 정규화된 번호 획득
    if (!ok) return; // 실패 시 중단

    setIsLoading(true); // 중복 제출/레이스 방지
    try {
      // 서버가 숫자만 받는 경우 정규화된 p 사용 (일관성)
      const res = await login(p, false); // 1차: allowAutoRegister=false (미가입이면 400 반환 → 모달)
      const token = res.data?.accessToken;

      if (token) {
        // 1) 새로고침 후에도 유지하려면 localStorage에 저장
        localStorage.setItem('accessToken', token);
        // 2) 이후 모든 요청에 자동으로 인증 헤더 포함
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        console.log('발급된 토큰:', localStorage.getItem('accessToken'));
      }

      alert('로그인 성공');
      // 성공 후 마이페이지로 이동
      // replace: true → 히스토리 교체(뒤로가기로 로그인 화면 복귀 방지)
      navigate('/user', { replace: true });
    } catch (err) { // 없는 회원이면 자동가입 동의 모달 띄움
        const status = err?.response?.status;             
          if (status === 400) {                                     
            setPendingPhone(p);                         
            setShowSignupModal(true);                     
            return;                                        
          }
      console.error(err);
      // 전역 에러 배너로 노출
      setErrors({ general: '로그인 실패. 전화번호를 확인해주세요.' });
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 자동가입 실행 핸들러
    const handleAutoSignup = async () => {                            // 모달의 "동의하고 가입" 클릭 시 실행
    if (!pendingPhone) return;                              
    setSignupLoading(true);                               
    setErrors({});                                       
    try {
      const res = await login(pendingPhone, true);                  // 2차 호출: 자동가입 허용으로 재시도(신규 생성 후 토큰 발급)
      const token = res.data?.accessToken;              
      if (token) {
        localStorage.setItem('accessToken', token);                 // 토큰을 로컬스토리지에 저장해 새로고침에도 유지
        api.defaults.headers.common.Authorization = `Bearer ${token}`; 
      }
      setShowSignupModal(false);                         
      alert('회원가입 및 로그인 완료!');                          
      navigate('/user');                                        
    } catch (e) {
      console.error(e);                                        
      setErrors({ general: '회원가입 처리에 실패했습니다. 잠시 후 다시 시도해주세요.' });
    } finally {
      setSignupLoading(false);                                      // 로딩 종료
    }
  };

    // 화면 표시용: 한국 휴대폰(10~11자리) 자동 하이픈
    const formatPhoneKR = (v) => {
      const d = (v ?? '').replace(/\D/g, '');      // 숫자만
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`; // 3-3(또는 3-? 진행중)
      if (d.length <= 10) return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`; // 3-3-4 (10자리)
      return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7,11)}`; // 3-4-4 (11자리)
    };

    const handlePhoneChange = (e) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 11); // 숫자만 최대 11자리
      setPhone(formatPhoneKR(digits));                               // 화면엔 하이픈 포함 표시
      if (errors.phone || errors.general) setErrors({});
    };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-shapes">
          <div className="shape login-shape-1">♻️</div>
          <div className="shape login-shape-2">🌱</div>
          <div className="shape login-shape-3">💚</div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* 헤더: 로고/제목/보조문구 */}
          <div className="login-header">
            <div className="login-logo">
              <img src={logo} alt="PetCoin" className="logo-image" />
              <h1>PetCoin</h1>
            </div>
            <h2 className="login-title">로그인</h2>
            <p className="login-subtitle">전화번호로 간편하게 <br></br>로그인(회원가입) 가능해요.</p>
          </div>

          {/* 전역 에러 배너(서버 응답 등) */}
          {errors.general && (
            <div className="error-banner" role="alert">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              {/* 접근성: label htmlFor ↔ input id 매칭 */}
              <label className="form-label" htmlFor="phone">전화번호</label>
              <input
                id="phone" // htmlFor와 동일한 값
                type="tel" // tel: 모바일에서 전화/숫자 키패드(앞자리 0 유지)
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                inputMode="numeric"
                autoComplete="tel"
                maxLength={13}
                className={`form-input ${errors.phone ? 'error' : ''}`} // 시각적 에러 스타일
                placeholder="010-1234-5678"
                disabled={isLoading || signupLoading} // 제출 중 입력 잠금(중복 방지)
              />
              {errors.phone && <div className="error-message" role="alert">{errors.phone}</div>}
            </div>

            {/* 제출 버튼: 로딩 상태에 따라 스피너/문구 토글 */}
            <button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || signupLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          {/* 회원가입 유도영역: 라우터 이동(useNavigate)
          <div className="login-footer">
            <p>계정이 없으신가요?</p>
            <button
              className="link-btn"
              onClick={() => navigate('/signup')}  // useNavigate로 통일
              disabled={isLoading || signupLoading}
            >
              회원가입
            </button>
          </div> */}
        </div>

        {/* 메인으로 돌아가기 버튼: 라우터 이동(useNavigate) */}
        <button
          className="back-btn"
          onClick={() => navigate('/')} // useNavigate로 통일
          disabled={isLoading || signupLoading}
        >
          ← 메인으로
        </button>

        {/* 회원가입 여부 모달 노출 */}
        {showSignupModal && (                                   
          <div className="modal-backdrop">                       
            <div className="modal-card">                              
              <h3>회원가입 동의</h3>                               
              <p className="modal-text">                         
                <b>{formatPhoneKR(pendingPhone)}</b> 번호로 가입 내역이 없습니다.
                <br />
                해당 번호로 회원가입을 진행하시겠어요?
              </p>

              <div className="modal-actions">                   
                <button
                  className="btn-outline"
                  onClick={() => setShowSignupModal(false)}          
                  disabled={signupLoading}                          
                >
                  취소
                </button>
                <button
                  className={`btn-primary ${signupLoading ? 'loading' : ''}`} 
                  onClick={handleAutoSignup}                              
                  disabled={signupLoading}                                
                >
                  {signupLoading ? '처리 중...' : '동의하고 가입'}        
                </button>
              </div>
        </div>
      </div>
    )}
      </div>
    </div>
  );
};

export default LoginPage;