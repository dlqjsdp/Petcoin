import React, { useState } from 'react';
import '../styles/NoticePage.css';

const notices = [
  {
    id: 1,
    type: '공지',
    title: '서비스 점검 안내',
    date: '2025-09-05',
    content: '서버 점검으로 인해 9월 5일 02:00~04:00 동안 접속이 제한됩니다.',
    priority: 'high',
    isNew: true
  },
  {
    id: 2,
    type: '이벤트',
    title: '신규 가입 이벤트',
    date: '2025-09-01',
    content: '신규 가입 고객에게 100포인트를 지급합니다. 지금 바로 참여하세요!',
    priority: 'medium',
    isNew: false
  },
  {
    id: 3,
    type: '중요',
    title: '계정 보안 강화',
    date: '2025-09-03',
    content: '비밀번호 변경이 필수입니다. 계정 보호를 위해 반드시 업데이트하세요.',
    priority: 'high',
    isNew: true
  },
  {
    id: 4,
    type: 'FAQ',
    title: '포인트 사용 방법',
    date: '2025-08-28',
    content: '마이페이지 → 포인트 → 사용하기에서 간단히 사용할 수 있습니다.',
    priority: 'low',
    isNew: false
  },
  {
    id: 5,
    type: '업데이트',
    title: 'v2.3.1 업데이트',
    date: '2025-09-02',
    content: '버그 수정 및 UI 개선이 적용되었습니다. 최신 버전으로 업데이트하세요.',
    priority: 'medium',
    isNew: true
  },
];

function NoticePage() {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  const getTypeColor = (type) => {
    switch (type) {
      case '공지':
        return '#FF8C00'; // 주황색
      case '이벤트':
        return '#32CD32'; // 라임그린
      case '중요':
        return '#DC143C'; // 크림슨
      case 'FAQ':
        return '#4169E1'; // 로얄블루
      case '업데이트':
        return '#9932CC'; // 다크바이올렛
      default:
        return '#FF8C00';
    }
  };

  const handleSearch = () => {
    // 검색 로직은 이미 filteredNotices에서 처리됨
    console.log('Searching for:', searchTerm);
  };

  const filterTypes = ['전체', '공지', '이벤트', '중요', 'FAQ', '업데이트'];

  const filteredNotices = notices.filter(notice => {
    const matchesFilter = selectedFilter === '전체' || notice.type === selectedFilter;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#DC143C';
      case 'medium': return '#FFD700';
      case 'low': return '#32CD32';
      default: return '#888';
    }
  };

  return (
    <div className="notice-page">
      <div className="main-content">
        {/* Filter Tabs */}
        <div className="filter-section">
          <div className="filter-tabs">
            {filterTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`filter-tab ${selectedFilter === type ? 'active' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="공지사항 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>

        {/* Notice Cards */}
        <div className="notice-grid">
          {filteredNotices.map((notice) => {
            const isExpanded = expandedCard === notice.id;
            return (
              <div
                key={notice.id}
                className={`notice-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setExpandedCard(isExpanded ? null : notice.id)}
              >
                {/* Priority Indicator */}
                <div 
                  className="priority-indicator"
                  style={{ backgroundColor: getPriorityColor(notice.priority) }}
                ></div>
                
                {/* New Badge */}
                {notice.isNew && (
                  <div className="new-badge">NEW</div>
                )}

                <div className="card-content">
                  {/* Header */}
                  <div className="card-header">
                    <span
                      className="notice-type-tag"
                      style={{ backgroundColor: getTypeColor(notice.type) }}
                    >
                      {notice.type}
                    </span>
                    <div className="notice-date">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="currentColor"/>
                      </svg>
                      {formatDate(notice.date)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="card-title">{notice.title}</h3>

                  {/* Content */}
                  <div className={`card-text ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    {notice.content}
                  </div>

                  {/* Expand/Collapse Indicator */}
                  <div className="expand-indicator">
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`expand-icon ${isExpanded ? 'rotated' : ''}`}
                    >
                      <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredNotices.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="empty-title">검색 결과가 없습니다</h3>
            <p className="empty-description">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="footer-stats">
        <div className="stats-grid">
          {filterTypes.slice(1).map((type) => {
            const count = notices.filter(n => n.type === type).length;
            return (
              <div key={type} className="stat-item">
                <div className="stat-number" style={{ color: getTypeColor(type) }}>{count}</div>
                <div className="stat-label">{type}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NoticePage;