import React, { useState } from 'react';
import '../styles/SignupPage.css';

const SignupPage = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // 아이디 검증
    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요';
    } else if (formData.username.length < 4) {
      newErrors.username = '아이디는 4자 이상이어야 합니다';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = '아이디는 영문, 숫자만 사용 가능합니다';
    }
    
    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다';
    }
    
    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }
    
    // 전화번호 검증
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요';
    } else if (!/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다';
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다';
    }
    
    // 비밀번호 확인
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    // 약관 동의
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '이용약관에 동의해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // 회원가입 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      // 중복 아이디 체크 시뮬레이션
      const existingUsers = ['admin', 'user1', 'test'];
      
      if (existingUsers.includes(formData.username)) {
        setErrors({
          username: '이미 사용중인 아이디입니다'
        });
        setIsLoading(false);
        return;
      }
      
      // 회원가입 성공
      setIsSuccess(true);
      setIsLoading(false);
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigateTo('login');
      }, 3000);
      
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="signup-page">
        <div className="signup-background">
          <div className="signup-shapes">
            <div className="shape signup-shape-1">🎉</div>
            <div className="shape signup-shape-2">✅</div>
            <div className="shape signup-shape-3">🌟</div>
          </div>
        </div>
        
        <div className="signup-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2 className="success-title">회원가입 완료!</h2>
            <p className="success-message">
              환영합니다, {formData.name}님!<br/>
              회원가입이 성공적으로 완료되었습니다.<br/>
              잠시 후 로그인 페이지로 이동합니다.
            </p>
            <div className="success-bonus">
              <div className="bonus-icon">🎁</div>
              <div className="bonus-text">
                <strong>가입 축하 보너스!</strong><br/>
                1,000 포인트가 지급되었습니다
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-background">
        <div className="signup-shapes">
          <div className="shape signup-shape-1">♻️</div>
          <div className="shape signup-shape-2">🌱</div>
          <div className="shape signup-shape-3">💚</div>
        </div>
      </div>

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <div className="signup-logo">
              <div className="logo-icon">♻️</div>
              <h1>PETCOIN</h1>
            </div>
            <h2 className="signup-title">회원가입</h2>
            <p className="signup-subtitle">
              페트병 재활용으로 포인트를 적립해보세요<br/>
              <span className="highlight-text">신규 가입 시 1,000P 지급! 🎁</span>
            </p>
          </div>

          <form onSubmit={handleSignup} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  아이디 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="영문, 숫자 4자 이상"
                  disabled={isLoading}
                />
                {errors.username && (
                  <div className="error-message">{errors.username}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  이름 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="실명을 입력하세요"
                  disabled={isLoading}
                />
                {errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                이메일 <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="example@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                전화번호 <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="010-1234-5678"
                disabled={isLoading}
              />
              {errors.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  비밀번호 <span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="영문+숫자 6자 이상"
                  disabled={isLoading}
                />
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  비밀번호 확인 <span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="비밀번호를 다시 입력하세요"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  <span className="required">*</span> 
                  <span>이용약관 및 개인정보처리방침에 동의합니다</span>
                  <button type="button" className="terms-link">약관보기</button>
                </span>
              </label>
              {errors.agreeToTerms && (
                <div className="error-message">{errors.agreeToTerms}</div>
              )}
            </div>

            <button 
              type="submit" 
              className={`signup-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  계정 생성 중...
                </>
              ) : (
                '회원가입 완료'
              )}
            </button>
          </form>

          <div className="signup-footer">
            <p>이미 계정이 있으신가요?</p>
            <button 
              className="link-btn" 
              onClick={() => navigateTo('login')}
              disabled={isLoading}
            >
              로그인
            </button>
          </div>
        </div>

        <button 
          className="back-btn"
          onClick={() => navigateTo('main')}
          disabled={isLoading}
        >
          ← 메인으로
        </button>
      </div>
    </div>
  );
};

export default SignupPage;