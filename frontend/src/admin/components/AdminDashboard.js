import React, { useState, useEffect } from 'react';

// AdminDashboard.js에서
import DashboardTab from '../pages/DashboardTab.jsx';       // admin/pages/에서 가져옴
import CollectionHistoryTab from '../pages/CollectionHistoryTab.jsx';
import UserManagementTab from '../pages/UserManagementTab.jsx';
import PointsTab from '../pages/PointsTab.jsx';
import KioskTab from '../pages/KioskTab.jsx';
import NoticeTab from '../pages/NoticeTab.jsx';              // 새로 추가
import '../styles/AdminDashboard.css'; // styles 폴더 위치 확인 필요
import logo from '../img/logo.png';    // img 폴더 위치 확인 필요

function AdminDashboard({ onNavigateToMain }) {
    // ========== 상태 관리 ==========
    const [currentTime, setCurrentTime] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedKiosk, setSelectedKiosk] = useState('all');
    const [selectedLogType, setSelectedLogType] = useState('all');

    // ========== 대시보드 통계 데이터 (REQ-001) ==========
    const [dashboardStats] = useState({
        totalBottles: 2847,
        totalMembers: 1847,
        totalPoints: 142350,
        co2Saved: 175.4,
        todayCollection: 247,
        activeKiosks: 42,
        totalKiosks: 45
    });

    // ========== 키오스크 데이터 (REQ-002) ==========
    const [kioskData, setKioskData] = useState([
        {
            id: 'K001',
            name: '강남역점',
            location: '서울시 강남구 강남대로 지하 2층',
            status: 'active',
            capacity: 500,
            currentCount: 342,
            todayCollection: 89,
            totalCollection: 2847,
            lastCollection: '2024-12-18 14:32:00',
            temperature: 24,
            humidity: 65,
            errorCount: 0
        },
        {
            id: 'K002',
            name: '홍대입구역점',
            location: '서울시 마포구 양화로 지하 1층',
            status: 'active',
            capacity: 500,
            currentCount: 78,
            todayCollection: 156,
            totalCollection: 4521,
            lastCollection: '2024-12-18 15:21:00',
            temperature: 22,
            humidity: 62,
            errorCount: 1
        },
        {
            id: 'K003',
            name: '명동점',
            location: '서울시 중구 명동길 1층',
            status: 'maintenance',
            capacity: 500,
            currentCount: 0,
            todayCollection: 0,
            totalCollection: 1892,
            lastCollection: '2024-12-17 18:45:00',
            temperature: 0,
            humidity: 0,
            errorCount: 3
        }
    ]);

    // ========== 회원 데이터 (REQ-003) ==========
    const [memberData, setMemberData] = useState([
        {
            id: 'U001',
            name: '김*민',
            email: 'kim***@gmail.com',
            phone: '010-****-1234',
            joinDate: '2024-10-15',
            totalBottles: 234,
            currentPoints: 1170,
            usedPoints: 430,
            totalPoints: 1600,
            lastActivity: '2024-12-18 14:30:00',
            status: 'active'
        },
        {
            id: 'U002',
            name: '이*수',
            email: 'lee***@naver.com',
            phone: '010-****-5678',
            joinDate: '2024-11-02',
            totalBottles: 189,
            currentPoints: 945,
            usedPoints: 200,
            totalPoints: 1145,
            lastActivity: '2024-12-18 13:45:00',
            status: 'active'
        }
    ]);

    // ========== 환급 요청 데이터 (REQ-004, REQ-005) ==========
    const [refundRequests, setRefundRequests] = useState([
        {
            id: 'RF001',
            memberId: 'U001',
            memberName: '김*민',
            requestedPoints: 1000,
            requestDate: '2024-12-18 09:30:00',
            status: 'pending',
            accountInfo: '국민은행 123-456-789012',
            processedDate: null,
            processedBy: null,
            note: ''
        },
        {
            id: 'RF002',
            memberId: 'U002',
            memberName: '이*수',
            requestedPoints: 500,
            requestDate: '2024-12-17 16:45:00',
            status: 'approved',
            accountInfo: '신한은행 987-654-321098',
            processedDate: '2024-12-18 10:15:00',
            processedBy: 'admin',
            note: '환급 처리 완료'
        }
    ]);

    // ========== 키오스크 로그 데이터 (REQ-006) ==========
    const [kioskLogs, setKioskLogs] = useState([
        {
            id: 'LOG001',
            kioskId: 'K001',
            kioskName: '강남역점',
            timestamp: '2024-12-18 16:45:23',
            type: 'collection',
            message: '페트병 3개 수거 완료',
            userId: 'U001',
            userName: '김*민',
            details: 'bottles: 3, points: 15',
            level: 'info'
        },
        {
            id: 'LOG002',
            kioskId: 'K002',
            kioskName: '홍대입구역점',
            timestamp: '2024-12-18 16:42:15',
            type: 'error',
            message: '센서 오류 감지',
            userId: null,
            userName: null,
            details: 'sensor_id: S003, error_code: E102',
            level: 'error'
        }
    ]);

    // ========== 공지사항 데이터 (새로 추가) ==========
    const [noticeData, setNoticeData] = useState([
        {
            id: 'N001',
            title: '페트코인 서비스 정기점검 안내',
            content: '더 나은 서비스 제공을 위해 페트코인 시스템 정기점검을 실시합니다.\n\n점검 시간: 2024년 12월 20일 오전 2:00 ~ 4:00\n점검 내용: 시스템 업데이트 및 성능 개선\n\n점검 시간 중에는 일시적으로 서비스 이용이 제한될 수 있습니다.\n불편을 드려 죄송합니다.',
            author: 'admin',
            createdDate: '2024-12-18 10:00:00',
            updatedDate: '2024-12-18 10:00:00',
            views: 125,
            isImportant: true,
            status: 'published',
            category: '시스템'
        },
        {
            id: 'N002',
            title: '새로운 키오스크 설치 완료 안내',
            content: '서울 강남구 삼성역 지하 1층에 새로운 페트코인 키오스크가 설치되었습니다.\n\n설치 위치: 삼성역 2번 출구 근처\n운영 시간: 오전 6시 ~ 밤 12시\n\n많은 이용 부탁드립니다!',
            author: 'admin',
            createdDate: '2024-12-17 15:30:00',
            updatedDate: '2024-12-17 15:30:00',
            views: 89,
            isImportant: false,
            status: 'published',
            category: '서비스'
        },
        {
            id: 'N003',
            title: '포인트 적립률 변경 안내',
            content: '환경 보호 활동 장려를 위해 페트병 1개당 적립 포인트가 5포인트에서 7포인트로 상향 조정됩니다.\n\n적용 일시: 2024년 12월 25일부터\n변경 내용: 페트병 1개 = 7 포인트\n\n더 많은 포인트로 환경 보호에 참여해 보세요!',
            author: 'admin',
            createdDate: '2024-12-16 14:20:00',
            updatedDate: '2024-12-16 14:20:00',
            views: 234,
            isImportant: true,
            status: 'published',
            category: '정책'
        }
    ]);

    // ========== useEffect: 실시간 시간 업데이트 ==========
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const time = now.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setCurrentTime(time);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // ========== 이벤트 핸들러 함수들 ==========

    /**
     * 환급 요청 처리 (승인/거부)
     */
    const handleRefundProcess = (refundId, action, note = '') => {
        setRefundRequests(prev => 
            prev.map(request => 
                request.id === refundId 
                    ? {
                        ...request,
                        status: action,
                        processedDate: new Date().toLocaleString('ko-KR'),
                        processedBy: 'admin',
                        note: note
                    }
                    : request
            )
        );

        // 승인 시 회원 포인트 차감
        if (action === 'approved') {
            const request = refundRequests.find(req => req.id === refundId);
            if (request) {
                setMemberData(prev =>
                    prev.map(member =>
                        member.id === request.memberId
                            ? {
                                ...member,
                                currentPoints: member.currentPoints - request.requestedPoints,
                                usedPoints: member.usedPoints + request.requestedPoints
                            }
                            : member
                    )
                );
            }
        }
    };

    /**
     * 키오스크 상태 변경
     */
    const handleKioskStatusChange = (kioskId, newStatus) => {
        setKioskData(prev =>
            prev.map(kiosk =>
                kiosk.id === kioskId
                    ? { ...kiosk, status: newStatus }
                    : kiosk
            )
        );

        // 상태 변경 로그 추가
        const kiosk = kioskData.find(k => k.id === kioskId);
        if (kiosk) {
            const newLog = {
                id: `LOG${Date.now()}`,
                kioskId: kioskId,
                kioskName: kiosk.name,
                timestamp: new Date().toISOString(),
                type: 'system',
                message: `상태 변경: ${newStatus === 'active' ? '운영중' : '점검중'}`,
                userId: null,
                userName: null,
                details: `status_change: ${kiosk.status} -> ${newStatus}`,
                level: 'info'
            };
            setKioskLogs(prev => [newLog, ...prev]);
        }
    };

    /**
     * 회원 상태 변경
     */
    const handleMemberStatusChange = (memberId, newStatus) => {
        setMemberData(prev =>
            prev.map(member =>
                member.id === memberId
                    ? { ...member, status: newStatus }
                    : member
            )
        );
    };

    /**
     * 공지사항 관리 함수들 (새로 추가)
     */
    const handleNoticeCreate = (noticeData) => {
        const newNotice = {
            id: `N${String(Date.now()).slice(-3).padStart(3, '0')}`,
            ...noticeData,
            author: 'admin',
            createdDate: new Date().toLocaleString('ko-KR'),
            updatedDate: new Date().toLocaleString('ko-KR'),
            views: 0,
            status: 'published'
        };
        setNoticeData(prev => [newNotice, ...prev]);
    };

    const handleNoticeUpdate = (noticeId, updatedData) => {
        setNoticeData(prev =>
            prev.map(notice =>
                notice.id === noticeId
                    ? {
                        ...notice,
                        ...updatedData,
                        updatedDate: new Date().toLocaleString('ko-KR')
                    }
                    : notice
            )
        );
    };

    const handleNoticeDelete = (noticeId) => {
        setNoticeData(prev => prev.filter(notice => notice.id !== noticeId));
    };

    const handleNoticeStatusChange = (noticeId, newStatus) => {
        setNoticeData(prev =>
            prev.map(notice =>
                notice.id === noticeId
                    ? { ...notice, status: newStatus }
                    : notice
            )
        );
    };

    const handleNoticeViewIncrease = (noticeId) => {
        setNoticeData(prev =>
            prev.map(notice =>
                notice.id === noticeId
                    ? { ...notice, views: notice.views + 1 }
                    : notice
            )
        );
    };

    /**
     * 메인 화면으로 돌아가기
     */
    const handleBackToMain = () => {
        if (onNavigateToMain) {
            onNavigateToMain();
        } else {
            alert('메인 화면으로 돌아갑니다.');
        }
    };

    // ========== 필터링 함수들 ==========
    const getFilteredKioskData = () => {
        return selectedKiosk === 'all' 
            ? kioskData 
            : kioskData.filter(kiosk => kiosk.id === selectedKiosk);
    };

    const getFilteredLogs = () => {
        let filteredLogs = selectedKiosk === 'all' 
            ? kioskLogs 
            : kioskLogs.filter(log => log.kioskId === selectedKiosk);

        if (selectedLogType !== 'all') {
            filteredLogs = filteredLogs.filter(log => log.type === selectedLogType);
        }

        return filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    // ========== 렌더링 ==========
    return (
        <div className="admin-dashboard">
            {/* 상단 헤더 */}
            <header className="mypage-header">
                <div className="container">
                    {/* 왼쪽: 로고 */}
                    <div className="header-left">
                        <div className="logo">
                            <img src={logo} alt="PETCoin 로고" className="logo-img" />
                        </div>
                    </div>
                    
                    {/* 오른쪽: 관리자 정보 */}
                    <div className="header-right">
                        <div className="user-profile">
                            <div className="profile-avatar">
                                👨‍💼
                            </div>
                            <div className="profile-info">
                                <h1 className="profile-name">관리자</h1>
                                <p className="profile-details">
                                    시스템 관리 • {currentTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ========== 탭 네비게이션 ========== */}
            <nav className="admin-nav">
                <div className="nav-tabs">
                    <button 
                        className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📊 대시보드
                    </button>
                    <button 
                        className={`nav-tab ${activeTab === 'collection' ? 'active' : ''}`}
                        onClick={() => setActiveTab('collection')}
                    >
                        📦 수거 내역
                    </button>
                    <button 
                        className={`nav-tab ${activeTab === 'members' ? 'active' : ''}`}
                        onClick={() => setActiveTab('members')}
                    >
                        👥 회원 관리
                    </button>
                    <button 
                        className={`nav-tab ${activeTab === 'points' ? 'active' : ''}`}
                        onClick={() => setActiveTab('points')}
                    >
                        💰 포인트
                    </button>
                    <button 
                        className={`nav-tab ${activeTab === 'kiosk' ? 'active' : ''}`}
                        onClick={() => setActiveTab('kiosk')}
                    >
                        🖥️ 키오스크
                    </button>
                    <button 
                        className={`nav-tab ${activeTab === 'notice' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notice')}
                    >
                        📢 공지사항
                    </button>
                </div>
            </nav>

            {/* ========== 메인 컨텐츠 ========== */}
            <main className="admin-main">
                {activeTab === 'dashboard' && (
                    <DashboardTab 
                        dashboardStats={dashboardStats}
                        kioskData={kioskData}
                    />
                )}

                {activeTab === 'collection' && (
                    <CollectionHistoryTab 
                        kioskData={kioskData}
                        selectedKiosk={selectedKiosk}
                        setSelectedKiosk={setSelectedKiosk}
                        getFilteredKioskData={getFilteredKioskData}
                    />
                )}

                {activeTab === 'members' && (
                    <UserManagementTab 
                        memberData={memberData}
                        handleMemberStatusChange={handleMemberStatusChange}
                    />
                )}

                {activeTab === 'points' && (
                    <PointsTab 
                        refundRequests={refundRequests}
                        handleRefundProcess={handleRefundProcess}
                    />
                )}

                {activeTab === 'kiosk' && (
                    <KioskTab 
                        kioskData={kioskData}
                        selectedKiosk={selectedKiosk}
                        setSelectedKiosk={setSelectedKiosk}
                        selectedLogType={selectedLogType}
                        setSelectedLogType={setSelectedLogType}
                        getFilteredKioskData={getFilteredKioskData}
                        getFilteredLogs={getFilteredLogs}
                        handleKioskStatusChange={handleKioskStatusChange}
                    />
                )}

                {activeTab === 'notice' && (
                    <NoticeTab 
                        noticeData={noticeData}
                        onNoticeCreate={handleNoticeCreate}
                        onNoticeUpdate={handleNoticeUpdate}
                        onNoticeDelete={handleNoticeDelete}
                        onNoticeStatusChange={handleNoticeStatusChange}
                        onNoticeViewIncrease={handleNoticeViewIncrease}
                    />
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;