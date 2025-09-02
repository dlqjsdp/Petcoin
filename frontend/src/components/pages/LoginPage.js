import React, { useState } from 'react';
import '../styles/LoginPage.css';
import '../../img/logo.png';
import logo from "../../img/logo.png";
import { login, normalizePhone } from '../../api/auth';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ navigateTo }) => {
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const p = normalizePhone(phone);
    const newErrors = {};
    if (!p) newErrors.phone = '전화번호를 입력해주세요';
    else if (p.length < 10 || p.length > 11) newErrors.phone = '올바른 전화번호 형식이 아닙니다';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await login(phone, true); // allowAutoRegister = true
      const token = res.data?.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        console.log("발급된 토큰:", localStorage.getItem('accessToken'));
      
      }
      alert('로그인 성공');
      navigate('/user'); // 필요 시 'main' 등으로 변경
    } catch (err) {
      console.error(err);
      setErrors({ general: '로그인 실패. 전화번호를 확인해주세요.' });
    } finally {
      setIsLoading(false);
    }
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
              <img src={logo} alt="PetCoin" className="logo-image" />
              <h1>PetCoin</h1>
            </div>
            <h2 className="login-title">로그인</h2>
            <p className="login-subtitle">전화번호로 간편하게 로그인하세요</p>
          </div>

          {errors.general && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">전화번호</label>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="010-1234-5678"
                disabled={isLoading}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
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