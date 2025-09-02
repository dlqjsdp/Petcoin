/*
 * App.js
 * - React Router v6 기반 최상위 라우팅 + 공통 레이아웃(Header)
 *
 * 주요 기능:
 *   - "/" → 사용자 메인 페이지(UserApp)
 *   - "/admin/*" → 관리자 페이지(AdminApp)
 *   - "/kiosk/*" → 키오스크 전용 페이지(KioskApp)
 *   - "/guide" → 안내사항 페이지
 *   - "/login", "/signup" → 로그인/회원가입 페이지
 *
 * @fileName : App.js
 * @author : yukyeong
 * @since : 250901
 * @history
 *   - 250901 | yukyeong | 최초 생성 - React Router v6 구조
 *   - 250902 | yukyeong | Header 레이아웃 추가 (main, guide 경로에서만 표시)
 *   - 250902 | yukyeong | Header 컴포넌트 추가 - "/" 및 "/guide" 경로에서만 표시되도록 조건부 렌더링 구현
 *   - 250902 | yukyeong | MainPage, LoginPage, SignupPage, NoticePage 라우트 추가 - 사용자 메인/안내사항/인증 페이지 분리
 */

import React from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import UserApp from "./user/UserApp";
import AdminApp from "./admin/AdminApp";
import KioskApp from "./kiosk/KioskApp";

import MainPage from "./components/pages/MainPage";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import NoticePage from "./components/pages/NoticePage";

import "./App.css";
import logo from "./img/logo.png";

function Header() {
  const location = useLocation();
  const showHeader = location.pathname === "/" || location.pathname.startsWith("/guide");

  if (!showHeader) return null;

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/">
              <img src={logo} alt="에코포인트" className="logo-image" />
            </Link>
          </div>

          <nav className="main-nav">
            <Link
              to="/guide"
              className={`nav-btn ${location.pathname === "/guide" ? "active" : ""}`}
            >
              안내사항
            </Link>
          </nav>

          <div className="auth-buttons">
            <Link to="/login" className="btn btn-secondary small">로그인</Link>
            <Link to="/signup" className="btn btn-primary small">회원가입</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="App">
      <Header /> {/* 공통 Header (조건부 표시) */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/guide" element={<NoticePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 영역별 라우트 */}
          <Route path="/user/*" element={<UserApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/kiosk/*" element={<KioskApp />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;
