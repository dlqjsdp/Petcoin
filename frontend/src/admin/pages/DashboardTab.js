import React from 'react';

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
                        <div className="card-number">{dashboardStats.totalBottles.toLocaleString()}</div>
                        <p>개</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon">👥</div>
                    <div className="card-content">
                        <h3>전체 회원</h3>
                        <div className="card-number">{dashboardStats.totalMembers.toLocaleString()}</div>
                        <p>명</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon">💰</div>
                    <div className="card-content">
                        <h3>총 포인트</h3>
                        <div className="card-number">{dashboardStats.totalPoints.toLocaleString()}</div>
                        <p>P</p>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="card-icon">🌱</div>
                    <div className="card-content">
                        <h3>CO₂ 절약</h3>
                        <div className="card-number">{dashboardStats.co2Saved}</div>
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
                        <span className="status-count active">{kioskData.filter(k => k.status === 'active').length}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">점검중</span>
                        <span className="status-count maintenance">{kioskData.filter(k => k.status === 'maintenance').length}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">전체</span>
                        <span className="status-count total">{kioskData.length}</span>
                    </div>
                </div>
                <div className="kiosk-grid">
                    {kioskData.map(kiosk => (
                        <div key={kiosk.id} className={`kiosk-card ${kiosk.status}`}>
                            <div className="kiosk-header">
                                <h4>{kiosk.name}</h4>
                                <span className={`status-badge ${kiosk.status}`}>
                                    {kiosk.status === 'active' ? '운영중' : '점검중'}
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