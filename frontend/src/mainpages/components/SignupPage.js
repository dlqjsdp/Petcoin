import React, { useState } from 'react';
import './SignupPage.css';
import logo from '../../img/logo.png';  

// 헤더 컴포넌트
const Header = ({ onNavigate }) => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo" onClick={() => onNavigate('main')}>
          <div className="logo">
              <img src={logo} alt="페트코인 로고" className="logo-icon" />
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-menu">
            <div 
              className="nav-item"
              onClick={() => onNavigate('notice')}
            >
              안내사항
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

// 로딩 컴포넌트
const LoadingSpinner = ({ isVisible }) => {
  return (
    <div className={`loading ${isVisible ? '' : 'hidden'}`}>
      <div className="loading-content">
        <div className="spinner"></div>
        <p>회원가입 중...</p>
      </div>
    </div>
  );
};

// 회원가입 페이지 컴포넌트
const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthdate: '',
    gender: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNavigate = (page) => {
    alert(`${page} 페이지로 이동합니다.`);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요.';
    }

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상 입력해주세요.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '휴대폰 번호를 입력해주세요.';
    } else if (!/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 휴대폰 번호를 입력해주세요.';
    }

    if (!formData.birthdate.trim()) {
      newErrors.birthdate = '생년월일을 입력해주세요.';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.';
    }

    return newErrors;
  };

  const handleNext = () => {
    let validationErrors = {};

    if (currentStep === 1) {
      validationErrors = validateStep1();
    } else if (currentStep === 2) {
      validationErrors = validateStep2();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setCurrentStep(prev => prev + 1);
    setErrors({});
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateStep3();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    // 실제 회원가입 처리 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      alert('🎉 회원가입이 완료되었습니다!\n페트코인과 함께 환경을 보호해주셔서 감사합니다.\n\n🎁 가입 축하 보너스 100 포인트가 지급되었습니다!');
      // 실제로는 로그인 페이지로 리다이렉트
    }, 3000);
  };

  const handleSocialSignup = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${provider} 간편가입 기능은 준비 중입니다.`);
    }, 1500);
  };

  const handleLoginRedirect = () => {
    alert('로그인 페이지로 이동합니다.');
  };

  const handleSelectAll = (checked) => {
    setFormData(prev => ({
      ...prev,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked
    }));
  };

  const isAllRequired = formData.agreeTerms && formData.agreePrivacy;
  const isAllSelected = formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing;

  return (
    <div>
      {/* 헤더 */}
      <Header onNavigate={handleNavigate} />
      
      <div className="signup-container">
        <div className="signup-wrapper">
          {/* 진행상황 표시 */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                <span>1</span>
                <label>약관동의</label>
              </div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                <span>2</span>
                <label>계정정보</label>
              </div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                <span>3</span>
                <label>개인정보</label>
              </div>
            </div>
          </div>

          <div className="signup-header">
            <div className="signup-logo">
              <div className="signup-logo-icon">♻️</div>
              <h1>페트코인 회원가입</h1>
            </div>
            <p className="signup-subtitle">
              환경 보호와 함께하는 스마트한 리워드 서비스
            </p>
          </div>

          {/* Step 1: 약관동의 */}
          {currentStep === 1 && (
            <div className="step-content">
              <h2 className="step-title">이용약관 및 개인정보처리방침</h2>
              
              <div className="terms-section">
                <div className="select-all">
                  <label className="checkbox-wrapper large">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    <strong>전체 동의</strong>
                  </label>
                </div>

                <div className="terms-list">
                  <div className="terms-item">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      <span className="required">[필수]</span> 이용약관 동의
                    </label>
                    <button type="button" className="view-terms">보기</button>
                  </div>

                  <div className="terms-item">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        name="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      <span className="required">[필수]</span> 개인정보처리방침 동의
                    </label>
                    <button type="button" className="view-terms">보기</button>
                  </div>

                  <div className="terms-item">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        name="agreeMarketing"
                        checked={formData.agreeMarketing}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      <span className="optional">[선택]</span> 마케팅 정보 수신 동의
                    </label>
                    <button type="button" className="view-terms">보기</button>
                  </div>
                </div>

                {(errors.agreeTerms || errors.agreePrivacy) && (
                  <div className="error-message">
                    {errors.agreeTerms || errors.agreePrivacy}
                  </div>
                )}
              </div>

              <div className="step-buttons">
                <button 
                  type="button" 
                  className="next-btn" 
                  onClick={handleNext}
                  disabled={!isAllRequired}
                >
                  다음 단계
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 계정정보 */}
          {currentStep === 2 && (
            <div className="step-content">
              <h2 className="step-title">계정 정보를 입력해주세요</h2>
              
              <form className="signup-form">
                <div className="form-group">
                  <label htmlFor="email">이메일 *</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@petcoin.com"
                      className={errors.email ? 'error' : ''}
                    />
                    <span className="input-icon">✉️</span>
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">비밀번호 *</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="영문, 숫자 조합 8자 이상"
                      className={errors.password ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">비밀번호 확인 *</label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 다시 입력하세요"
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              </form>

              <div className="step-buttons">
                <button type="button" className="prev-btn" onClick={handlePrev}>
                  이전 단계
                </button>
                <button type="button" className="next-btn" onClick={handleNext}>
                  다음 단계
                </button>
              </div>
            </div>
          )}

          {/* Step 3: 개인정보 */}
          {currentStep === 3 && (
            <div className="step-content">
              <h2 className="step-title">개인 정보를 입력해주세요</h2>
              
              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">이름 *</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="실명을 입력하세요"
                      className={errors.name ? 'error' : ''}
                    />
                    <span className="input-icon">👤</span>
                  </div>
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">휴대폰 번호 *</label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="010-0000-0000"
                      className={errors.phone ? 'error' : ''}
                    />
                    <span className="input-icon">📱</span>
                  </div>
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="birthdate">생년월일 *</label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleInputChange}
                      className={errors.birthdate ? 'error' : ''}
                    />
                    <span className="input-icon">🎂</span>
                  </div>
                  {errors.birthdate && (
                    <span className="error-message">{errors.birthdate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>성별 *</label>
                  <div className="radio-group">
                    <label className="radio-wrapper">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-mark"></span>
                      남성
                    </label>
                    <label className="radio-wrapper">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-mark"></span>
                      여성
                    </label>
                  </div>
                  {errors.gender && (
                    <span className="error-message">{errors.gender}</span>
                  )}
                </div>

                <div className="step-buttons">
                  <button type="button" className="prev-btn" onClick={handlePrev}>
                    이전 단계
                  </button>
                  <button type="submit" className="signup-btn" disabled={isLoading}>
                    {isLoading ? '가입 중...' : '회원가입 완료'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 첫 번째 단계에서만 소셜 가입 옵션 표시 */}
          {currentStep === 1 && (
            <>
              <div className="divider">
                <span>또는</span>
              </div>

              <div className="social-signup">
                <button 
                  type="button" 
                  className="social-btn google-btn"
                  onClick={() => handleSocialSignup('Google')}
                >
                  <span className="social-icon">🔍</span>
                  Google로 간편가입
                </button>
                <button 
                  type="button" 
                  className="social-btn kakao-btn"
                  onClick={() => handleSocialSignup('카카오')}
                >
                  <span className="social-icon">💬</span>
                  카카오로 간편가입
                </button>
                <button 
                  type="button" 
                  className="social-btn naver-btn"
                  onClick={() => handleSocialSignup('네이버')}
                >
                  <span className="social-icon">🟢</span>
                  네이버로 간편가입
                </button>
              </div>
            </>
          )}

          <div className="login-link">
            <span>이미 계정이 있으신가요?</span>
            <button 
              type="button" 
              className="login-btn-link"
              onClick={handleLoginRedirect}
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>

      {/* 로딩 스피너 */}
      <LoadingSpinner isVisible={isLoading} />
    </div>
  );
};

export default SignupPage;