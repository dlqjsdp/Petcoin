import React, { useState } from 'react';
import MainPage from './components/pages/MainPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import NoticePage from './components/pages/NoticePage';
import './App.css';
import logo from './img/logo.png';


function App() {
  const [currentPage, setCurrentPage] = useState('main');
  
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'main':
        return <MainPage navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'signup':
        return <SignupPage navigateTo={navigateTo} />;
      case 'guide':
        return <NoticePage navigateTo={navigateTo} />;
      case 'admin':
        return <div>관리자 페이지 (준비중)</div>;
      case 'user':
        return <div>사용자 페이지 (준비중)</div>;
      default:
        return <MainPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="App">
      {/* 헤더는 메인페이지와 안내사항에서만 표시 */}
      {(currentPage === 'main' || currentPage === 'guide') && (
        <header className="app-header">
          <div className="container">
            <div className="header-content">
              <div className="logo-section" onClick={() => navigateTo('main')}>
                <img src={logo} alt="에코포인트" className="logo-image" />
              </div>

              <nav className="main-nav">
                <button
                  onClick={() => navigateTo('guide')}
                  className={`nav-btn ${currentPage === 'guide' ? 'active' : ''}`}
                >
                  안내사항
                </button>
              </nav>
              <div className="auth-buttons">
                <button
                  onClick={() => navigateTo('login')}
                  className="btn-secondary small"
                >
                  로그인
                </button>
                <button
                  onClick={() => navigateTo('signup')}
                  className="btn-primary small"
                >
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;