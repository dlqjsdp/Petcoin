import React from 'react';
import '../styles/MainPage.css';

const MainPage = ({ navigateTo }) => {
  const kioskLocations = [
    { name: '홍대입구역 1번 출구', address: '서울시 마포구 홍대입구역', distance: '0.5km' },
    { name: '강남역 2번 출구', address: '서울시 강남구 강남역', distance: '1.2km' },
    { name: '신촌역 3번 출구', address: '서울시 서대문구 신촌역', distance: '2.1km' },
    { name: '이태원역 1번 출구', address: '서울시 용산구 이태원역', distance: '3.5km' }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: '즉시 포인트 적립',
      description: '페트병을 넣는 순간 바로 포인트가 적립되어 실시간으로 확인 가능합니다',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: '💳',
      title: '현금 전환 가능',
      description: '적립된 포인트를 언제든지 현금으로 출금하여 바로 사용할 수 있습니다',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      icon: '🌍',
      title: '지구 환경 보호',
      description: '재활용을 통해 환경을 보호하고 지속가능한 미래를 함께 만들어갑니다',
      gradient: 'from-green-400 to-green-600'
    },
    {
      icon: '🎯',
      title: '간편한 이용',
      description: '복잡한 절차 없이 페트병만 넣으면 끝! 누구나 쉽게 이용 가능합니다',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  return (
    <div className="main-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1">♻️</div>
            <div className="shape shape-2">🌱</div>
            <div className="shape shape-3">💚</div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span>🎉 신규 회원 1,000P 지급!</span>
            </div>
            <h1 className="hero-title">
              페트병 재활용하고<br/>
              <span className="highlight-text">현금 포인트</span> 받아가세요!
            </h1>
            <p className="hero-description">
              키오스크에 페트병을 넣으면 즉시 포인트가 적립되고,<br/>
              현금으로 전환할 수 있습니다. 지구환경도 보호하고 용돈도 벌어보세요!
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary glow"
                onClick={() => navigateTo('signup')}
              >
                <span>지금 시작하기</span>
                <div className="btn-shine"></div>
              </button>
              <button 
                className="btn-secondary glass"
                onClick={() => navigateTo('guide')}
              >
                이용방법 보기
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="kiosk-container">
              <div className="kiosk-mockup">
                <div className="kiosk-screen">
                  <div className="screen-glow"></div>
                  <div className="screen-content">
                    <div className="pulse-circle">
                      <div className="screen-icon">♻️</div>
                    </div>
                    <div className="screen-text">페트병을 넣어주세요</div>
                    <div className="screen-points">+50P 적립 예정</div>
                  </div>
                </div>
                <div className="kiosk-slot">
                  <div className="slot-opening"></div>
                </div>
              </div>
              <div className="floating-bottles">
                <div className="bottle bottle-1">🍼</div>
                <div className="bottle bottle-2">🍼</div>
                <div className="bottle bottle-3">🍼</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">어떻게 사용하나요?</h2>
            <p className="section-subtitle">간단한 4단계로 포인트를 받아보세요</p>
          </div>
          <div className="steps-container">
            {[
              { number: 1, title: '키오스크 찾기', desc: '가까운 키오스크를 찾아 방문하세요', icon: '📍' },
              { number: 2, title: '페트병 투입', desc: '깨끗한 페트병을 키오스크에 넣어주세요', icon: '🍼' },
              { number: 3, title: '포인트 적립', desc: '즉시 포인트가 적립됩니다', icon: '⚡' },
              { number: 4, title: '현금 전환', desc: '적립된 포인트를 현금으로 받으세요', icon: '💰' }
            ].map((step, index) => (
              <div key={index} className="step-wrapper">
                <div className="step-card">
                  <div className="step-icon-bg">
                    <div className="step-icon">{step.icon}</div>
                  </div>
                  <div className="step-number">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="step-connector">
                    <div className="connector-line"></div>
                    <div className="connector-arrow">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">가까운 키오스크 찾기</h2>
            <p className="section-subtitle">내 주변 키오스크 위치를 확인해보세요</p>
          </div>
          <div className="map-container">
            <div className="map-visual">
              <div className="map-placeholder">
                <div className="map-bg"></div>
                <div className="map-markers">
                  <div className="marker marker-1">📍</div>
                  <div className="marker marker-2">📍</div>
                  <div className="marker marker-3">📍</div>
                  <div className="marker marker-4">📍</div>
                </div>
                <div className="map-content">
                  <div className="map-icon">🗺️</div>
                  <h3 className="map-title">키오스크 위치</h3>
                  <p className="map-description">가까운 키오스크를 찾아보세요</p>
                  <button className="btn-primary small">
                    지도에서 보기
                  </button>
                </div>
              </div>
            </div>
            <div className="location-list">
              <div className="location-header">
                <h3 className="location-title">주변 키오스크</h3>
                <div className="location-refresh">🔄</div>
              </div>
              {kioskLocations.map((location, index) => (
                <div key={index} className="location-item">
                  <div className="location-marker">📍</div>
                  <div className="location-info">
                    <h4 className="location-name">{location.name}</h4>
                    <p className="location-address">{location.address}</p>
                  </div>
                  <div className="location-distance">{location.distance}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">PETCOIN의 특별한 장점</h2>
            <p className="section-subtitle">왜 PETCOIN를 선택해야 할까요?</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card" style={{'--delay': `${index * 0.1}s`}}>
                <div className={`benefit-gradient bg-gradient-to-br ${benefit.gradient}`}></div>
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
                <div className="benefit-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-pattern"></div>
        </div>
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon">🚀</div>
            <h2 className="cta-title">지금 바로 시작해보세요!</h2>
            <p className="cta-description">
              회원가입하고 첫 번째 페트병 재활용으로<br/>
              <strong>보너스 1,000 포인트</strong>를 받아가세요
            </p>
            <div className="cta-buttons">
              <button 
                className="btn-primary large glow"
                onClick={() => navigateTo('signup')}
              >
                <span>무료 회원가입</span>
                <div className="btn-shine"></div>
              </button>
              <button 
                className="btn-secondary large glass"
                onClick={() => navigateTo('guide')}
              >
                자세히 알아보기
              </button>
            </div>
            <div className="cta-trust">
              <div className="trust-item">
                <span className="trust-icon">✅</span>
                <span>무료 서비스</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>안전한 거래</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                <span>즉시 적립</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;