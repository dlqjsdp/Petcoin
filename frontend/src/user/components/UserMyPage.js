import React, { useState, useEffect } from 'react';
import '../styles/UserMyPage.css';
import logo from "../img/logo.png";
import DashboardTab from '../pages/DashboardTad.js';  // 이미 맞음
//import PointsTab from '../pages/PointsTab.js';        // 이미 맞음
import PointsTab from './PointHistoryList.js';        // 이미 맞음
import DisposalHistoryTab from '../pages/DisposalHistoryTab.js'; // 이미 맞음
import SettingsTab from '../pages/SettingsTab.js';    // 이미 맞음

function UserMyPage({ 
    phoneNumber = "010-1234-5678", 
    onBackToMain, 
    userPoints, 
    onUseCoupon, 
    totalBottles, 
    pointHistory,
    kioskData 
}) {
    
    /* ==================== 상태 관리 ==================== */
    
    const [currentTime, setCurrentTime] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    
    /* ==================== 사용자 기본 정보 ==================== */
    
    const [userData] = useState({
        name: "김환경",
        email: "eco.kim@email.com",
        joinDate: "2024-01-15",
        profileImage: "👤",
        grade: "골드",
        totalPoints: 1250,
        usablePoints: userPoints || 890
    });

    /* ==================== 환경 임팩트 데이터 ==================== */
    
    const environmentalData = {
        totalBottles: totalBottles || 247,
        co2Saved: 123.5,
        oceanProtected: 15.6,
        marineLifeSaved: 89,
        monthlyBottles: 45,
        weeklyBottles: 12,
        consecutiveDays: 15
    };

    /* ==================== 포인트 내역 데이터 처리 (MYP_002) ==================== */
    
    const currentPointHistory = pointHistory || [
        { 
            id: 1, 
            date: '2024-12-20', 
            type: 'EARN',
            amount: 75, 
            detail: '페트병 15개 투입', 
            location: '강남역점' 
        },
        { 
            id: 2, 
            date: '2024-12-19', 
            type: 'USE',
            amount: -50, 
            detail: '스타벅스 아메리카노', 
            location: '온라인' 
        },
        { 
            id: 3, 
            date: '2024-12-18', 
            type: 'EARN',
            amount: 35, 
            detail: '페트병 7개 투입', 
            location: '홍대점' 
        },
        { 
            id: 4, 
            date: '2024-12-17', 
            type: 'BONUS',
            amount: 20, 
            detail: '첫 이용 보너스', 
            location: '이벤트' 
        },
        { 
            id: 5, 
            date: '2024-12-16', 
            type: 'EARN',
            amount: 60, 
            detail: '페트병 12개 투입', 
            location: '강남역점' 
        }
    ];

    /* ==================== 분리수거 내역 데이터 (MYP_006) ==================== */
    
    const [disposalHistoryData] = useState([
        {
            id: 1,
            date: '2024-12-20',
            kioskName: '강남역점',
            items: [
                { type: '페트병', count: 8, points: 40 },
                
            ],
            totalPoints: 75,
            location: '서울시 강남구 강남대로 396'
        },
        {
            id: 2,
            date: '2024-12-18',
            kioskName: '강남역점',
            items: [
                { type: '페트병', count: 7, points: 35 }
            ],
            totalPoints: 35,
            location: '서울시 강남구 강남대로 396'
        },
        {
            id: 3,
            date: '2024-12-16',
            kioskName: '강남역점',
            items: [
                { type: '페트병', count: 10, points: 50 },
                { type: '유색페트병', count: 2, points: 10 }
            ],
            totalPoints: 60,
            location: '서울시 강남구 강남대로 396'
        }
    ]);

    /* ==================== 알림 설정 (MYP_003, MYP_004) ==================== */
    
    const [notifications, setNotifications] = useState({
        newKiosk: true,
        pointExpiry: true,
        weeklyReport: false,
        friendActivity: true,
        eventNews: true,
        pointThreshold: true
    });

    /* ==================== 목표 설정 ==================== */
    
    const [goals, setGoals] = useState({
        monthlyBottles: 50,
        dailyBottles: 2,
        pointTarget: 1500
    });

    /* ==================== useEffect 훅들 ==================== */
    
    useEffect(() => {
        if (totalBottles) {
            console.log('총 페트병 수 업데이트:', totalBottles);
        }
    }, [totalBottles]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            setCurrentTime(time);
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    /* ==================== 이벤트 핸들러 함수들 ==================== */
    
    const handleNotificationChange = (key, value) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleGoalChange = (key, value) => {
        setGoals(prev => ({
            ...prev,
            [key]: parseInt(value) || 0
        }));
    };

    // 공통 props 정의
    const commonProps = {
        userData,
        environmentalData,
        currentPointHistory,
        disposalHistoryData,
        notifications,
        goals,
        userPoints,
        phoneNumber,
        handleNotificationChange,
        handleGoalChange
    };

    /* ==================== 렌더링 부분 ==================== */
    
    return (
        <div className="user-mypage">
            
            {/* 상단 헤더 */}
            <header className="mypage-header">
                <div className="container">
                    
                    {/* 왼쪽: 로고 */}
                    <div className="header-left">
                        <div className="logo">
                            <img src={logo} alt="PETCoin 로고" className="logo-img" />
                        </div>
                    </div>
                    
                    {/* 오른쪽: 사용자 정보 */}
                    <div className="header-right">
                        <div className="user-profile">
                            <div className="profile-avatar">
                                {userData.profileImage}
                            </div>
                            <div className="profile-info">
                                <h1 className="profile-name">{userData.name}</h1>
                                <p className="profile-details">
                                    {userData.grade} 등급 • {environmentalData.consecutiveDays}일 연속 참여
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </header>

            {/* 네비게이션 탭 */}
            <nav className="mypage-nav">
                <div className="container">
                    <div className="nav-tabs">
                        <button 
                            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <span>📊</span> 대시보드
                        </button>
                        <button 
                            className={`nav-tab ${activeTab === 'points' ? 'active' : ''}`}
                            onClick={() => setActiveTab('points')}
                        >
                            <span>💰</span> 포인트
                        </button>
                        <button 
                            className={`nav-tab ${activeTab === 'disposal' ? 'active' : ''}`}
                            onClick={() => setActiveTab('disposal')}
                        >
                            <span>📂</span> 분리배출
                        </button>
                        <button 
                            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <span>⚙️</span> 설정
                        </button>
                    </div>
                </div>
            </nav>

            {/* 메인 컨텐츠 영역 */}
            <main className="mypage-main">
                <div className="container">
                    
                    {/* 대시보드 탭 내용 */}
                    {activeTab === 'dashboard' && (
                        <DashboardTab {...commonProps} />
                    )}

                    {/* 포인트 탭 내용 */}
                    {activeTab === 'points' && (
                        <PointsTab {...commonProps} />
                    )}

                    {/* 분리배출 탭 내용 */}
                    {activeTab === 'disposal' && (
                        <DisposalHistoryTab {...commonProps} />
                    )}

                    {/* 설정 탭 내용 */}
                    {activeTab === 'settings' && (
                        <SettingsTab {...commonProps} />
                    )}
                </div>
            </main>
        </div>
    );
}

export default UserMyPage;