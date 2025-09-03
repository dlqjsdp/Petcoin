/*
 * MainScreen.js
 * - 메인 키오스크 화면 구성 컴포넌트
 * - 회원/비회원 선택 버튼 및 공지사항 마퀴 표시
 *
 * 주요 기능:
 *   - mock 공지사항 데이터 렌더링 및 NoticeMarquee 컴포넌트 전달
 *   - "회원" 버튼 클릭 시 onNext('member') 호출
 *   - "비회원" 버튼 클릭 시 onNext('nonMember') 호출
 *
 * @fileName : MainScreen.js
 * @author   : yukyeong
 * @since    : 250903
 * @history
 *   - 250903 | yukyeong | 최초 생성 - mock 데이터 기반 공지사항 마퀴 + 회원/비회원 선택 버튼 구현
 *   - 250903 | yukyeong | 버튼 클릭 시 onNext 콜백으로 다음 화면 전환 처리
 */

import React, { useState, useEffect } from 'react';
import NoticeMarquee from './NoticeMarquee';
import '../styles/common.css';

const MainScreen = ({ onNext }) => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const mockNotices = [
      {
        id: 'N001',
        title: '페트코인 서비스 정기점검 안내 - 12월 20일 오전 2:00~4:00 점검 예정입니다',
        content: '더 나은 서비스 제공을 위해 정기점검을 실시합니다.',
        isImportant: true,
        status: 'published',
        category: '시스템'
      },
      {
        id: 'N002', 
        title: '포인트 적립률 변경 안내 - 페트병 1개당 10포인트로 상향 조정!',
        content: '환경보호 활동 장려를 위해 포인트를 상향 조정합니다.',
        isImportant: true,
        status: 'published',
        category: '정책'
      }
    ];
    setNotices(mockNotices);
  }, []);

  const handleMemberClick = () => {
    console.log('회원 버튼 클릭됨');
    onNext('member');
  };

  const handleNonMemberClick = () => {
    console.log('비회원 버튼 클릭됨');
    onNext('nonMember');
  };

  return (
    <div className="main-screen-container">
      {/* 공지사항 마퀴 */}
      <NoticeMarquee 
        notices={notices}
        isVisible={true}
        speed={50}
      />
      
      <div className="content">
        <div className="service-intro">
          <h1 className="main-title">페트병을 넣고<br/>포인트를 받으세요!</h1>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">페트병 1개당 10포인트</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">환경보호에 기여</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">즉시 포인트 적립</span>
            </div>
          </div>
        </div>
        
        <div className="button-group">
          <button 
            className="main-button non-member-button"
            onClick={handleNonMemberClick}
            type="button"
          >
            비회원
            <div className="button-subtitle">(포인트 적립X)</div>
          </button>
          
          <button 
            className="main-button member-button"
            onClick={handleMemberClick}
            type="button"
          >
            회원
            <div className="button-subtitle">(적립하기)</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;