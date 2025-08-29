import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import logo from '../../img/logo.png';


// 헤더 컴포넌트
const Header = ({ currentPage }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleNavigate = (page) => {
    if (page === 'main') {
      navigate('/');
    } else if (page === 'notice') {
      navigate('/notice');
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo" onClick={() => handleNavigate('main')}>
           <div className="logo">
              <img src={logo} alt="페트코인 로고" className="logo-icon" />
            </div>
        </div>
        <div className="nav-right">
          <div className="nav-menu">
            <div 
              className={`nav-item ${currentPage === 'notice' ? 'active' : ''}`}
              onClick={() => handleNavigate('notice')}
            >
              안내사항
            </div>
          </div>
          <div className="nav-buttons">
            <button className="btn btn-secondary" onClick={handleLogin}>
              로그인
            </button>
            <button className="btn btn-primary" onClick={handleSignup}>
              회원가입
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

// 히어로 섹션 컴포넌트
const HeroSection = () => {
  return (
    <section className="hero">
      <h1 className="hero-title">♻️ 페트코인으로 지구를 구하세요!</h1>
      <p className="hero-subtitle">
        PET병 재활용으로 코인을 얻고, 환경도 보호하는 똑똑한 선택
      </p>
      
      <div className="hero-stats">
        <div className="stat">
          <div className="stat-number">127,543</div>
          <div className="stat-label">재활용된 PET병</div>
        </div>
        <div className="stat">
          <div className="stat-number">15,230</div>
          <div className="stat-label">활성 사용자</div>
        </div>
        <div className="stat">
          <div className="stat-number">89</div>
          <div className="stat-label">수거 지점</div>
        </div>
      </div>
    </section>
  );
};

// 서비스 카드 컴포넌트
const ServiceCard = ({ icon, title, description, onClick }) => {
  return (
    <div className="service-card" onClick={onClick}>
      <div className="service-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="btn btn-primary">시작하기</button>
    </div>
  );
};

// 지도 섹션 컴포넌트
const MapSection = () => {
  return (
    <section className="map-section">
      <h2>🗺️ 수거함 위치 지도</h2>
      <div className="map-container">
        <div className="map-placeholder">
          <div className="map-icon">📍</div>
          <p>실시간 수거함 위치를 확인하세요</p>
          <div className="map-info">
            <div className="location-item">
              <span className="location-name">강남구 테헤란로 - 5개 지점</span>
              <span className="location-status available">운영중</span>
            </div>
            <div className="location-item">
              <span className="location-name">마포구 홍대입구 - 3개 지점</span>
              <span className="location-status available">운영중</span>
            </div>
            <div className="location-item">
              <span className="location-name">종로구 광화문 - 4개 지점</span>
              <span className="location-status maintenance">점검중</span>
            </div>
          </div>
          <button className="btn btn-primary map-btn">전체 지도 보기</button>
        </div>
      </div>
    </section>
  );
};

// 재활용 가이드 섹션
const RecyclingGuideSection = () => {
  const guideSteps = [
    { 
      icon: "🧽", 
      title: "깨끗이 세척", 
      description: "내용물을 비우고 물로 깨끗이 헹궈주세요" 
    },
    { 
      icon: "🏷️", 
      title: "라벨 제거", 
      description: "비닐 라벨과 뚜껑을 분리해주세요" 
    },
    { 
      icon: "👤", 
      title: "찌그러뜨리기", 
      description: "부피를 줄이기 위해 납작하게 눌러주세요" 
    },
    { 
      icon: "📦", 
      title: "유색/무색병 분리", 
      description: "유색페트병과 무색페트병을 구분해주세요" 
    }
  ];

  return (
    <section className="recycling-guide">
      <h2>♻️ 재활용 가이드</h2>
      <div className="guide-steps">
        {guideSteps.map((step, index) => (
          <div key={index} className="guide-step">
            <div className="guide-icon">{step.icon}</div>
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
      <div className="guide-tip">
        <h4>💡 더 많은 포인트를 얻는 팁</h4>
        <ul>
          <li>대용량 PET병(500ml 이상)은 더 많은 포인트를 받을 수 있어요</li>
          <li>한 번에 많은 병을 가져오면 보너스 포인트가 추가돼요</li>
          <li>매일 재활용하면 연속 참여 보너스를 받아요</li>
        </ul>
      </div>
    </section>
  );
};

// 포인트 환급 섹션
const PointExchangeSection = () => {
  const navigate = useNavigate();

  const handleExchangeClick = () => {
    alert('로그인 후 이용 가능합니다.');
    navigate('/login');
  };

  return (
    <section className="point-exchange">
      <h2>💰 포인트 환급 방법</h2>
      <div className="exchange-info">
        <div className="exchange-card" onClick={handleExchangeClick}>
          <div className="exchange-icon">🏦</div>
          <h3>계좌 환급</h3>
          <p>1,000 포인트부터 현금으로 환급 가능</p>
          <div className="exchange-rate">
            <span className="rate">1 포인트 = 1원</span>
          </div>
        </div>
        <div className="exchange-card" onClick={handleExchangeClick}>
          <div className="exchange-icon">🎁</div>
          <h3>상품 교환</h3>
          <p>다양한 친환경 상품으로 교환 가능</p>
          <div className="exchange-rate">
            <span className="rate">500 포인트부터</span>
          </div>
        </div>
        <div className="exchange-card" onClick={handleExchangeClick}>
          <div className="exchange-icon">🌱</div>
          <h3>기부하기</h3>
          <p>환경 보호 단체에 포인트 기부</p>
          <div className="exchange-rate">
            <span className="rate">100 포인트부터</span>
          </div>
        </div>
      </div>
      <div className="exchange-process">
        <h3>환급 절차</h3>
        <div className="process-steps">
          <div className="process-item">
            <span className="step-number">1</span>
            <span>로그인 후 마이페이지 접속</span>
          </div>
          <div className="process-item">
            <span className="step-number">2</span>
            <span>포인트 환급 메뉴 선택</span>
          </div>
          <div className="process-item">
            <span className="step-number">3</span>
            <span>환급 방법 및 금액 선택</span>
          </div>
          <div className="process-item">
            <span className="step-number">4</span>
            <span>신청 완료 (영업일 기준 3일 내 처리)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// 로딩 컴포넌트
const LoadingSpinner = ({ isVisible }) => {
  return (
    <div className={`loading ${isVisible ? '' : 'hidden'}`}>
      <div className="loading-content">
        <div className="spinner"></div>
        <p>로딩 중...</p>
      </div>
    </div>
  );
};

// 메인 컴포넌트
const MainPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleLocationSearch = () => {
    showLoading();
    setTimeout(() => {
      setIsLoading(false);
      alert('페트코인 수거함 위치 찾기로 이동합니다.\n\n📍 현재 운영 중인 지역:\n• 서울시 강남구 - 15개 지점\n• 서울시 마포구 - 12개 지점\n• 부산시 해운대구 - 8개 지점\n• 대구시 중구 - 6개 지점\n\n더 많은 지역 확장 예정!');
    }, 1500);
  };

  const handlePointExchange = () => {
    alert('로그인 후 이용 가능합니다.');
    navigate('/login');
  };

  return (
    <div>
      {/* 헤더 */}
      <Header currentPage="main" />
      
      <div className="container">
        {/* 히어로 섹션 */}
        <HeroSection />
        
        {/* 수거함 위치 지도 */}
        <MapSection />
        
        {/* 재활용 가이드 */}
        <RecyclingGuideSection />
        
        {/* 포인트 환급 방법 */}
        <PointExchangeSection />
        
        {/* 서비스 카드들 */}
        <div className="services">
          <ServiceCard 
            icon="📍"
            title="수거함 위치 찾기"
            description="가까운 페트코인 수거함을 찾아보세요. 실시간 잔여 공간과 운영 시간까지 확인할 수 있습니다."
            onClick={handleLocationSearch}
          />
          
          <ServiceCard 
            icon="💰"
            title="포인트 환급하기"
            description="획득한 페트코인을 현금으로 환전하거나 다른 상품과 교환할 수 있는 안전한 거래 플랫폼입니다."
            onClick={handlePointExchange}
          />
          
          <ServiceCard 
            icon="♻️"
            title="재활용 가이드"
            description="올바른 PET병 분리배출 방법과 재활용 팁을 알려드립니다. 더 많은 코인을 얻는 비법도 공개!"
            onClick={() => document.querySelector('.recycling-guide').scrollIntoView({ behavior: 'smooth' })}
          />
        </div>
      </div>

      {/* 로딩 스피너 */}
      <LoadingSpinner isVisible={isLoading} />
    </div>
  );
};

export default MainPage;