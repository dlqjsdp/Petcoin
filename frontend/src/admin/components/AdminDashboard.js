/*
 * AdminDashboard.js
 * - 관리자 페이지 메인 대시보드 컴포넌트
 *
 * 주요 기능:
 *   - 상단 헤더: 로고, 관리자 정보, 현재 시간 실시간 표시
 *   - 탭 네비게이션: 대시보드, 수거 내역, 회원 관리, 포인트, 키오스크, 공지사항 전환
 *   - 각 탭 전환 시 해당 서브 컴포넌트(DashboardTab, CollectionHistoryTab 등) 렌더링
 *
 * 상태 관리:
 *   - kioskData: 키오스크 목록 데이터
 *   - kioskLogs: 키오스크 로그 데이터
 *   - memberData: 회원 데이터
 *   - refundRequests: 환급 요청 데이터
 *   - noticeData: 공지사항 데이터
 *   - selectedKiosk: 현재 선택된 키오스크 ID ('all' 또는 숫자)
 *   - selectedLogType: 현재 선택된 로그 유형
 *   - activeTab: 현재 활성화된 탭
 *   - currentTime: 실시간 현재 시각
 *
 * @fileName : AdminDashboard.js
 * @author   : yukyeong
 * @since    : 250908
 * @history

 *   - 250908 | yukyeong | 관리자 대시보드 기본 레이아웃 및 탭 구조 구현
 *   - 250908 | yukyeong | 키오스크 관련 하드코딩 데이터 삭제, 상태를 빈 배열([])로 초기화
 *   - 250909 | yukyeong | id 필드명을 kioskId 등 백엔드와 일치하도록 통일
 *   - 250909 | yukyeong | 키오스크 목록(getKiosks) 마운트 시 1회 로딩 useEffect 추가, 로딩 실패 시 빈 배열로 폴백, alive 플래그로 언마운트 후 setState 방지
 *   - 250909 | yukyeong | 키오스크 로그(getKioskRuns) 탭 활성/필터 변경 시 로딩 useEffect 추가,'all' 선택 시 쿼리 파라미터(kioskId/status) 조건부 제외 처리, 로딩 실패 시 빈 배열로 폴백 및 alive 플래그 적용
 *   - 250909 | yukyeong | 키오스크 상태값을 ONLINE/MAINT 기준으로 통일(요약/필터/뱃지 일관화), handleKioskStatusChange 메시지도 ONLINE/MAINT에 맞게 수정
 *   - 250909 | yukyeong | 관리자 대시보드 기본 레이아웃 및 탭 구조 구현
 *   - 250909 | yukyeong | 키오스크 관련 하드코딩 데이터 삭제, 상태를 빈 배열([])로 초기화
 *   - 250909 | sehui | 회원 관리 하드코딩 데이터 삭제, 상태의 기본값을 빈 배열([])로 설정
 *   - 250909 | sehui | 포인트 환급 요청 하드코딩 데이터 삭제, 상태의 기본값을 빈 배열([])로 설정
 *   - 250909 | sehui | 페이지 정보 상태의 기본 값을 빈 배열([])로 설정
 *   - 250910 | sehui | 포인트 환급 요청 처리 이벤트 핸들러 작성(서버에 요청 전송, 환급 요청 목록 상태 업데이트, 승인 시 회원 포인트 차감)
 *   - 250910 | sehui | 포인트 환급 요청 필터링 상태 변수 생성
 *   - 250910 | sehui | 대시보트 통계 조회 상태 변수와 함수 생성
 *   - 250910 | sehui | 공지사항 관련 변수와 함수 삭제
 */

import { getKiosks, getKioskRuns, updateKiosk, getTotal } from '../../api/admin.js';
import { getAllMembers, getMemberDetail } from '../../api/admin.js';
import { getPointRequests, getPointRequestById, processPointRequest } from '../../api/admin.js';
import React, { useState, useEffect } from 'react';

// AdminDashboard.js에서
import DashboardTab from '../pages/DashboardTab.js';       // admin/pages/에서 가져옴
import CollectionHistoryTab from '../pages/CollectionHistoryTab.js';
import UserManagementTab from '../pages/UserManagementTab.js';
import PointsTab from '../pages/PointsTab.js';
import KioskTab from '../pages/KioskTab.js';
import NoticeTab from '../pages/NoticeTab.js';              // 새로 추가
import '../styles/AdminDashboard.css'; // styles 폴더 위치 확인 필요
import logo from '../img/logo.png';    // img 폴더 위치 확인 필요

function AdminDashboard({ onNavigateToMain }) {

    // 하드코딩 삭제하고 빈 배열로 시작
    const [kioskData, setKioskData] = useState([]); // 키오스크 데이터 (REQ-002)
    const [kioskLogs, setKioskLogs] = useState([]); // 키오스크 로그 데이터 (REQ-006)
    const [selectedKiosk, setSelectedKiosk] = useState('all'); // 현재 선택된 키오스크 ID (드롭다운) - 기본은 'all' (전체 보기)
    const [selectedLogType, setSelectedLogType] = useState('all'); // 현재 선택된 로그 유형 (드롭다운) - 기본은 'all' (전체 보기)
    const [memberData, setMemberData] = useState([]);   //회원 관리 데이터 (REQ-003)
    const [refundRequests, setRefundRequests] = useState([]);       //포인트 환급 요청 데이터 (REQ-004, REQ-005)
    const [dashboardStats, setDashboardStats] = useState([]);   //대시보드 통계 데이터 (REQ-001)
    const [pageInfo, setPageInfo] = useState([]);       //페이지 정보

    // ========== 상태 관리 ==========
    const [currentTime, setCurrentTime] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    // 실시간 시간 업데이트 (헤더 우측 표시용)
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


    // 1) 키오스크 목록: 마운트 시 한 번
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const { list /*, pageInfo*/ } = await getKiosks({ pageNum: 1, amount: 100 });
                if (alive) setKioskData(list);
                // pageInfo 필요해지면 setKioskPageInfo(pageInfo) 추가
            } catch (e) {
                console.error('키오스크 목록 로딩 실패', e);
                if (alive) setKioskData([]);
            }
        })();
        return () => { alive = false; };
    }, []);

    // 2) 로그: 키오스크 탭일 때, 선택 변경마다
    useEffect(() => {
        if (activeTab !== 'kiosk') return;

        let alive = true;
        // selectedKiosk가 'all'이면 쿼리에서 제외(=undefined)해서 불필요한 "status=null" 전송 방지
        const params = {
            pageNum: 1,
            amount: 50,
            ...(selectedKiosk === 'all' ? {} : { kioskId: selectedKiosk }),
            ...(selectedLogType === 'all' ? {} : { status: selectedLogType }),
        };

        (async () => {
            try {
                const { list /*, pageInfo*/ } = await getKioskRuns(params);
                if (alive) setKioskLogs(list);
                // pageInfo 필요해지면 setKioskRunPageInfo(pageInfo) 추가
            } catch (e) {
                console.error('키오스크 로그 로딩 실패', e);
                if (alive) setKioskLogs([]);
            }
        })();

        return () => { alive = false; };
    }, [activeTab, selectedKiosk, selectedLogType]);

    //전체 회원 목록 조회
    useEffect(() => {
        const params = { pageNum: 1, amount: 10 };

        getAllMembers(params)
            .then(res => {
                console.log("👤 회원 목록 조회");

                setMemberData(res.data.memberList || []);
                setPageInfo(res.data.pageInfo);
            })
            .catch(err => console.error("⚠️ 회원 목록 조회 실패", err))
    }, []);

    //환급 요청 목록 조회
    useEffect(() => {
        const params = { pageNum: 1, amount: 10 };

        getPointRequests(params)
            .then(res => {
                console.log("💰 포인트 환급 요청 목록 조회");

                setRefundRequests(res.data.pointReqList || [])
            })
            .catch(err => console.error("⚠️ 포인트 환급 요청 목록 조회 실패", err));
    }, []);

    //대시보드 통계 조회
    useEffect(() => {
        getTotal()
            .then(total => {
                    console.log("🏠 대시보드 통계 조회");
                setDashboardStats(total.data)
            })
            .catch(err => console.error("⚠️ 대시보드 통계 조회 실패", err))
    }, []);

    // ========== 이벤트 핸들러 함수들 ==========

    /**
     * 환급 요청 처리 (승인/거부)
     */
    const handleRefundProcess = (refundId, action, note = '') => {
        const payload = {
            requestId: refundId,
            requestStatus: action,
            note: note
        };

        processPointRequest(refundId, payload)
            .then((res) => {
                console.log("✅ 처리 결과:", res.data.message);
                console.log("✅ 포인트 차감 여부:", res.data.pointDeducted);

                setRefundRequests(prev => 
                    prev.map(request => 
                        request.requestId === refundId 
                            ? {
                                ...request,
                                requestStatus: action,
                                processedAt: new Date().toLocaleString('ko-KR'),
                                note: note
                            }
                            : request
                    )
                );
                
                //승인 시 회원 포인트 차감
                if(action === 'APPROVED') {
                    const request = refundRequests.find(req => req.requestId === refundId);
                    if(request) {
                        setMemberData(prev =>
                            prev.map(member =>
                                member.memberId === request.memberId
                                    ? {
                                        ...member,
                                        currentPoint: member.currentPoint - request.requestAmount
                                    }
                                    : member
                            )
                        );
                    }
                }
            })
            .catch(err => console.error("⚠️ 포인트 환급 처리 실패", err));
    };

    /**
     * 키오스크 상태 변경
     */
    const handleKioskStatusChange = (kioskId, newStatus) => {
        setKioskData(prev =>
            prev.map(kiosk =>
                kiosk.kioskId === kioskId
                    ? { ...kiosk, status: newStatus }
                    : kiosk
            )
        );

        // 상태 변경 로그 추가
        const kiosk = kioskData.find(k => k.kioskId === kioskId);
        if (kiosk) {
            const newLog = {
                id: `LOG${Date.now()}`,
                kioskId: kioskId,
                kioskName: kiosk.name,
                timestamp: new Date().toISOString(),
                type: 'system',
                message: `상태 변경: ${newStatus === 'ONLINE' ? '운영중' : '점검중'}`,
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
                member.memberId === memberId
                    ? { ...member, status: newStatus }
                    : member
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
            : kioskData.filter(kiosk => kiosk.kioskId === selectedKiosk);
    };

    const getFilteredLogs = () => {
        let logs = kioskLogs ?? [];

        // 상태 필터만 적용 (kioskId 필터는 서버에서 이미 적용됨)
        if (selectedLogType !== 'all') {
            logs = logs.filter(l => l.status === selectedLogType);
        }

        // endedAt > startedAt > timestamp 순으로 정렬키 선택
        const ts = l => new Date(l.endedAt ?? l.startedAt ?? l.timestamp ?? 0).getTime();
        return [...logs].sort((a, b) => ts(b) - ts(a));
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
                </div>
            </nav>

            {/* ========== 메인 컨텐츠 ========== */}
            <main className="admin-main">
                {activeTab === 'dashboard' && (
                    <DashboardTab
                        dashboardStats={dashboardStats}
                        setDashboardStats={setDashboardStats}
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
                        pageInfo={pageInfo}
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
            </main>
        </div>
    );
}

export default AdminDashboard;