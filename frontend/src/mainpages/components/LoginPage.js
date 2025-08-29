import React, { useState } from 'react';
import './LoginPage.css';
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
        <p>로그인 중...</p>
      </div>
    </div>
  );
};

// 로그인 페이지 컴포넌트
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleNavigate = (page) => {
    alert(`${page} 페이지로 이동합니다.`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상 입력해주세요.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    // 실제 로그인 처리 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      
      // 간단한 로그인 체크 (실제로는 서버 API 호출)
      if (formData.email === 'test@petcoin.com' && formData.password === '123456') {
        alert('로그인 성공! 메인 페이지로 이동합니다.');
        // 실제로는 토큰 저장 후 페이지 리다이렉트
      } else {
        setErrors({
          general: '이메일 또는 비밀번호가 잘못되었습니다.'
        });
      }
    }, 2000);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${provider} 로그인 기능은 준비 중입니다.`);
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('비밀번호 재설정 이메일을 발송했습니다.\n(데모 기능입니다)');
  };

  const handleSignupRedirect = () => {
    alert('회원가입 페이지로 이동합니다.');
  };

  return (
    <div>
      {/* 헤더 */}
      <Header onNavigate={handleNavigate} />
      
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-header">
            <div className="login-logo">
              <div className="login-logo-icon">♻️</div>
              <h1>페트코인 로그인</h1>
            </div>
            <p className="login-subtitle">
              환경을 보호하고 포인트를 적립해보세요
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  className={errors.email ? 'error' : ''}
                />
                <span className="input-icon">✉️</span>
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
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

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                로그인 상태 유지
              </label>
              <button 
                type="button" 
                className="forgot-password"
                onClick={handleForgotPassword}
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="divider">
            <span>또는</span>
          </div>

          <div className="social-login">
            <button 
              type="button" 
              className="social-btn google-btn"
              onClick={() => handleSocialLogin('Google')}
            >
              <span className="social-icon">🔍</span>
              Google로 로그인
            </button>
            <button 
              type="button" 
              className="social-btn kakao-btn"
              onClick={() => handleSocialLogin('카카오')}
            >
              <span className="social-icon">💬</span>
              카카오로 로그인
            </button>
            <button 
              type="button" 
              className="social-btn naver-btn"
              onClick={() => handleSocialLogin('네이버')}
            >
              <span className="social-icon">🟢</span>
              네이버로 로그인
            </button>
          </div>

          <div className="signup-link">
            <span>아직 계정이 없으신가요?</span>
            <button 
              type="button" 
              className="signup-btn"
              onClick={handleSignupRedirect}
            >
              회원가입하기
            </button>
          </div>

          <div className="demo-info">
            <h4>🎯 데모 계정 정보</h4>
            <p>이메일: test@petcoin.com</p>
            <p>비밀번호: 123456</p>
          </div>
        </div>
      </div>

      {/* 로딩 스피너 */}
      <LoadingSpinner isVisible={isLoading} />
    </div>
  );
};

export default LoginPage;