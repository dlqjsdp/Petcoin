import React, { useState } from 'react';
import '../styles/LoginPage.css';
import '../../img/logo.png';
import logo from "../../img/logo.png";

const LoginPage = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 임시 사용자 데이터 (실제로는 서버에서 관리)
  const users = {
    'admin': { password: 'admin123', role: 'admin' },
    'user1': { password: 'user123', role: 'user' },
    'test': { password: 'test123', role: 'user' }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // 로그인 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      const user = users[formData.username];
      
      if (user && user.password === formData.password) {
        // 로그인 성공
        localStorage.setItem('user', JSON.stringify({
          username: formData.username,
          role: user.role
        }));
        
        // 역할에 따른 페이지 이동
        if (user.role === 'admin') {
          navigateTo('admin');
        } else {
          navigateTo('user');
        }
      } else {
        // 로그인 실패
        setErrors({
          general: '아이디 또는 비밀번호가 올바르지 않습니다'
        });
      }
      
      setIsLoading(false);
    }, 1000);
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
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">♻️</div>
              <h1>PetCoin</h1>
            </div>
            <h2 className="login-title">로그인</h2>
            <p className="login-subtitle">계정에 로그인하여 서비스를 이용해보세요</p>
          </div>

          {errors.general && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">아이디</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="아이디를 입력하세요"
                disabled={isLoading}
              />
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
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

          <div className="login-footer">
            <p>계정이 없으신가요?</p>
            <button 
              className="link-btn" 
              onClick={() => navigateTo('signup')}
              disabled={isLoading}
            >
              회원가입
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

export default LoginPage;