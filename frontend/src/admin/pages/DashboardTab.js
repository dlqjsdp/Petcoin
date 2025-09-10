/*
 * DashboardTab.js
 * - 관리자 페이지 대시보드 탭 컴포넌트
 *
 * 주요 기능:
 *   - 상단 요약 통계 카드
 *   - 키오스크 현황(운영중/점검중/전체) 요약 및 목록
 *
 * @fileName : DashboardTab.js
 * @author   : yukyeong
 * @since    : 250909
 * @history
 *   - 250909 | yukyeong | 키오스크 상태 표기를 ONLINE/MAINT 기준으로 통일, statusToCss 헬퍼 추가 및 적용
 *   - 250909 | yukyeong | 상태 요약 카운트(운영중/점검중) 필터 로직을 ONLINE/MAINT 기준으로 수정
 *   - 250909 | yukyeong | 키(key) 필드를 kioskId 로 통일
 *   - 250910 | sehui | 통계 카드 데이터 연결
 * 
 */

import React from 'react';

const statusToCss = (s) => s === 'ONLINE' ? 'active' : s === 'MAINT' ? 'maintenance' : 'unknown';

function DashboardTab({ dashboardStats, kioskData }) {
    return (
        <div className="dashboard-section">
            <h2>대시보드</h2>

            {/* 통계 카드들 */}
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="card-icon">📦</div>
                    <div className="card-content">
                        <h3>총 수거량</h3>
                        <div className="card-number">{dashboardStats.totalRecycle}</div>
                        <p>개</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon">👥</div>
                    <div className="card-content">
                        <h3>전체 회원</h3>
                        <div className="card-number">{dashboardStats.totalMember}</div>
                        <p>명</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon">💰</div>
                    <div className="card-content">
                        <h3>총 포인트</h3>
                        <div className="card-number">{dashboardStats.totalPoint}</div>
                        <p>P</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon">🌱</div>
                    <div className="card-content">
                        <h3>CO₂ 절약</h3>
                        <div className="card-number">175.4</div>
                        <p>kg</p>
                    </div>
                </div>
            </div>

            {/* 키오스크 현황 */}
            <div className="kiosk-overview">
                <h3>수거함 현황</h3>
                <div className="kiosk-status-summary">
                    <div className="status-item">
                        <span className="status-label">운영중</span>
                        <span className="status-count active">{kioskData.filter(k => k.status === 'ONLINE').length}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">점검중</span>
                        <span className="status-count maintenance">{kioskData.filter(k => k.status === 'MAINT').length}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">전체</span>
                        <span className="status-count total">{kioskData.length}</span>
                    </div>
                </div>
                <div className="kiosk-grid">
                    {kioskData.map(kiosk => (
                        <div key={kiosk.kioskId} className={`kiosk-card ${statusToCss(kiosk.status)}`}>
                            <div className="kiosk-header">
                                <h4>{kiosk.name}</h4>
                                <span className={`status-badge ${statusToCss(kiosk.status)}`}>
                                    {kiosk.status === 'ONLINE' ? '운영중'
                                        : kiosk.status === 'MAINT' ? '점검중'
                                            : kiosk.status}
                                </span>
                            </div>
                            <div className="kiosk-stats">
                                <span>수용량: {kiosk.currentCount}/{kiosk.capacity}</span>
                                <span>오늘: {kiosk.todayCollection}개</span>
                            </div>
                            <div className="capacity-bar">
                                <div
                                    className="capacity-fill"
                                    style={{ width: `${(kiosk.currentCount / kiosk.capacity) * 100}%` }}
                                ></div>
                            </div>
                            <div className="kiosk-location">{kiosk.location}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardTab;