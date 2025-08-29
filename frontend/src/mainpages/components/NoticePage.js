import React, { useState } from 'react';
import './NoticePage.css';
import logo from '../../img/logo.png';


// 헤더 컴포넌트
const Header = ({ onLogin, onSignup, onNavigate, currentPage }) => {
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
              className={`nav-item ${currentPage === 'notice' ? 'active' : ''}`}
              onClick={() => onNavigate('notice')}
            >
              안내사항
            </div>
          </div>
          <div className="nav-buttons">
            <button className="btn btn-secondary" onClick={onLogin}>
              로그인
            </button>
            <button className="btn btn-primary" onClick={onSignup}>
              회원가입
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

// 공지사항 아이템 컴포넌트
const AnnouncementItem = ({ title, content, date, isImportant }) => {
  return (
    <div className={`announcement-item ${isImportant ? 'important' : ''}`}>
      <div className="announcement-header">
        <h4>{title}</h4>
        <span className="announcement-date">{date}</span>
      </div>
      <p>{content}</p>
      {isImportant && <div className="important-badge">중요</div>}
    </div>
  );
};

// 카테고리 버튼 컴포넌트
const CategoryButton = ({ category, isActive, onClick, count }) => {
  return (
    <button 
      className={`category-btn ${isActive ? 'active' : ''}`}
      onClick={() => onClick(category)}
    >
      {category} ({count})
    </button>
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

// 안내사항 페이지 컴포넌트
const NoticePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('전체');

  const showLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleLogin = () => {
    showLoading();
    setTimeout(() => {
      alert('로그인 페이지로 이동합니다.');
    }, 1000);
  };

  const handleSignup = () => {
    showLoading();
    setTimeout(() => {
      alert('회원가입 페이지로 이동합니다.');
    }, 1000);
  };

  const handleNavigate = (page) => {
    showLoading();
    setTimeout(() => {
      if (page === 'main') {
        alert('메인페이지로 이동합니다.');
      }
    }, 1000);
  };

  // 공지사항 데이터
  const allAnnouncements = [
    {
      id: 1,
      title: "🎉 페트코인 서비스 정식 오픈!",
      content: "PET병 재활용으로 코인을 얻는 혁신적인 서비스가 시작됩니다. 지금 가입하고 환경 보호에 동참하세요! 초기 가입자에게는 특별 보너스 100 포인트를 드립니다.",
      date: "2024.03.15",
      category: "서비스",
      isImportant: true
    },
    {
      id: 2,
      title: "📍 새로운 수거함 설치 완료",
      content: "서울 강남구, 마포구에 페트코인 수거함이 새롭게 설치되었습니다. 위치 찾기에서 확인해보세요! 총 27개의 새로운 지점이 추가되어 더욱 편리하게 이용하실 수 있습니다.",
      date: "2024.03.12",
      category: "시설",
      isImportant: false
    },
    {
      id: 3,
      title: "💰 보상 시스템 업데이트",
      content: "PET병 1개당 5 페트코인 지급! 대용량 병은 10 페트코인까지 받을 수 있습니다. 또한 연속 참여 보너스와 대량 투입 보너스가 새롭게 추가되었습니다.",
      date: "2024.03.10",
      category: "보상",
      isImportant: true
    },
    {
      id: 4,
      title: "🌍 환경 보호 캠페인",
      content: "이달의 재활용 챌린지 참여하고 추가 보너스 코인을 받아가세요. 함께 만드는 깨끗한 지구! 목표 달성시 모든 참여자에게 특별 리워드를 제공합니다.",
      date: "2024.03.08",
      category: "이벤트",
      isImportant: false
    },
    {
      id: 5,
      title: "📱 모바일 앱 업데이트 (v2.1)",
      content: "더욱 편리한 UI/UX로 업데이트되었습니다. 앱스토어에서 최신 버전으로 업데이트해주세요! 새로운 기능: 실시간 포인트 알림, 수거함 예약 기능, 친구 추천 시스템이 추가되었습니다.",
      date: "2024.03.05",
      category: "앱",
      isImportant: false
    },
    {
      id: 6,
      title: "🏆 월간 랭킹 시스템 도입",
      content: "매월 가장 많은 PET병을 재활용한 사용자에게 특별 보너스를 지급합니다. 1등 10,000 포인트, 2등 5,000 포인트, 3등 3,000 포인트가 추가로 지급됩니다.",
      date: "2024.03.03",
      category: "이벤트",
      isImportant: false
    },
    {
      id: 7,
      title: "⚠️ 시스템 점검 안내",
      content: "서비스 안정화를 위한 정기 점검이 예정되어 있습니다. 점검 시간: 3월 20일 오전 2시~6시 (4시간). 점검 중에는 서비스 이용이 제한될 수 있습니다.",
      date: "2024.03.01",
      category: "점검",
      isImportant: true
    },
    {
      id: 8,
      title: "🎁 신규 상품 교환 서비스",
      content: "페트코인으로 다양한 친환경 상품을 교환하세요! 텀블러, 에코백, 대나무 칫솔 등 실용적인 친환경 제품들을 포인트로 교환할 수 있습니다.",
      date: "2024.02.28",
      category: "서비스",
      isImportant: false
    }
  ];

  // 카테고리별 개수 계산
  const categories = {
    '전체': allAnnouncements.length,
    '서비스': allAnnouncements.filter(item => item.category === '서비스').length,
    '시설': allAnnouncements.filter(item => item.category === '시설').length,
    '보상': allAnnouncements.filter(item => item.category === '보상').length,
    '이벤트': allAnnouncements.filter(item => item.category === '이벤트').length,
    '앱': allAnnouncements.filter(item => item.category === '앱').length,
    '점검': allAnnouncements.filter(item => item.category === '점검').length
  };

  // 필터링된 공지사항
  const filteredAnnouncements = activeCategory === '전체' 
    ? allAnnouncements 
    : allAnnouncements.filter(item => item.category === activeCategory);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    showLoading();
  };

  return (
    <div>
      {/* 헤더 */}
      <Header 
        onLogin={handleLogin} 
        onSignup={handleSignup} 
        onNavigate={handleNavigate}
        currentPage="notice"
      />
      
      <div className="container">
        <div className="notice-page">
          <button 
            className="back-button"
            onClick={() => handleNavigate('main')}
          >
            ← 메인으로 돌아가기
          </button>
          
          <div className="notice-header">
            <h1 className="notice-title">📢 안내사항</h1>
            <p className="notice-subtitle">
              페트코인 서비스 관련 중요한 공지사항과 업데이트 소식을 확인하세요
            </p>
          </div>

          {/* 카테고리 필터 */}
          <div className="category-filter">
            <h3>카테고리별 보기</h3>
            <div className="category-buttons">
              {Object.entries(categories).map(([category, count]) => (
                <CategoryButton
                  key={category}
                  category={category}
                  count={count}
                  isActive={activeCategory === category}
                  onClick={handleCategoryChange}
                />
              ))}
            </div>
          </div>

          {/* 공지사항 목록 */}
          <div className="announcements">
            <div className="announcements-header">
              <h3>
                {activeCategory === '전체' ? '전체 공지사항' : `${activeCategory} 관련 공지사항`}
                <span className="count">({filteredAnnouncements.length}건)</span>
              </h3>
            </div>
            
            {filteredAnnouncements.map((item) => (
              <AnnouncementItem
                key={item.id}
                title={item.title}
                content={item.content}
                date={item.date}
                isImportant={item.isImportant}
              />
            ))}

            {filteredAnnouncements.length === 0 && (
              <div className="no-announcements">
                <p>해당 카테고리에 공지사항이 없습니다.</p>
              </div>
            )}
          </div>

          {/* 고객센터 안내 */}
          <div className="customer-service">
            <h3>📞 고객센터</h3>
            <div className="service-info">
              <div className="service-item">
                <strong>전화문의:</strong>
                <span>1588-1234 (평일 9:00~18:00)</span>
              </div>
              <div className="service-item">
                <strong>이메일:</strong>
                <span>support@petcoin.com</span>
              </div>
              <div className="service-item">
                <strong>카카오톡:</strong>
                <span>@페트코인고객센터</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 스피너 */}
      <LoadingSpinner isVisible={isLoading} />
    </div>
  );
};

export default NoticePage;