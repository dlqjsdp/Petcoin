import React, { useState } from 'react';

// 키오스크 위치 데이터
const kioskLocations = [
    {
        id: 1,
        name: '강남역점',
        address: '서울시 강남구 강남대로 396',
        status: 'active', // active, inactive, full
        distance: '250m',
        type: 'indoor',
        operatingHours: '24시간',
        capacity: 85
    },
    {
        id: 2,
        name: '홍대점',
        address: '서울시 마포구 와우산로 94',
        status: 'active',
        distance: '1.2km',
        type: 'outdoor',
        operatingHours: '06:00-24:00',
        capacity: 62
    },
    {
        id: 3,
        name: '신촌점',
        address: '서울시 서대문구 신촌로 134',
        status: 'full',
        distance: '1.8km',
        type: 'indoor',
        operatingHours: '24시간',
        capacity: 100
    },
    {
        id: 4,
        name: '종로점',
        address: '서울시 종로구 종로 51',
        status: 'inactive',
        distance: '2.1km',
        type: 'outdoor',
        operatingHours: '점검중',
        capacity: 45
    },
    {
        id: 5,
        name: '명동점',
        address: '서울시 중구 명동길 74',
        status: 'active',
        distance: '1.9km',
        type: 'indoor',
        operatingHours: '08:00-22:00',
        capacity: 78
    }
];

function DashboardTab({ environmentalData, goals, userData }) {
    const [selectedKiosk, setSelectedKiosk] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showOnlyNearby, setShowOnlyNearby] = useState(false);

    // 필터링된 키오스크 목록
    const filteredKiosks = kioskLocations.filter(kiosk => {
        if (filterStatus !== 'all' && kiosk.status !== filterStatus) return false;
        if (showOnlyNearby && parseFloat(kiosk.distance) > 1.0) return false;
        return true;
    });

    // 키오스크 상태별 아이콘 및 색상
    const getKioskIcon = (status) => {
        switch (status) {
            case 'active':
                return '🟢';
            case 'full':
                return '🟡';
            case 'inactive':
                return '🔴';
            default:
                return '⚪';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return '운영중';
            case 'full':
                return '포화상태';
            case 'inactive':
                return '점검중';
            default:
                return '알 수 없음';
        }
    };

    const handleKioskClick = (kiosk) => {
        setSelectedKiosk(selectedKiosk?.id === kiosk.id ? null : kiosk);
    };

    return (
        <div className="dashboard-content">
            
            {/* 환경 임팩트 카드들 */}
            <section className="environmental-impact">
                <h2 className="section-title">🌍 나의 환경 임팩트</h2>
                <div className="impact-grid">
                    <div className="impact-card primary">
                        <div className="card-icon">♻️</div>
                        <div className="card-content">
                            <h3>총 투입 페트병</h3>
                            <div className="impact-number">
                                {environmentalData.totalBottles.toLocaleString()}
                            </div>
                            <p>개의 페트병</p>
                        </div>
                    </div>
                    
                    <div className="impact-card green">
                        <div className="card-icon">🌱</div>
                        <div className="card-content">
                            <h3>CO₂ 절약량</h3>
                            <div className="impact-number">
                                {environmentalData.co2Saved}
                            </div>
                            <p>kg 절약</p>
                        </div>
                    </div>
                    
                    <div className="impact-card blue">
                        <div className="card-icon">🌊</div>
                        <div className="card-content">
                            <h3>보호한 바다</h3>
                            <div className="impact-number">
                                {environmentalData.oceanProtected}
                            </div>
                            <p>m² 보호</p>
                        </div>
                    </div>
                    
                    <div className="impact-card orange">
                        <div className="card-icon">🐠</div>
                        <div className="card-content">
                            <h3>구한 해양생물</h3>
                            <div className="impact-number">
                                {environmentalData.marineLifeSaved}
                            </div>
                            <p>개체 구조</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 이번 달 활동 현황 */}
            <section className="monthly-activity">
                <h2 className="section-title">📈 이번 달 활동</h2>
                <div className="activity-card">
                    <div className="activity-item">
                        <div className="activity-label">
                            <span className="label-text">월간 투입 목표</span>
                            <span className="label-progress">
                                {environmentalData.monthlyBottles}/{goals.monthlyBottles}개
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ 
                                    width: `${Math.min((environmentalData.monthlyBottles / goals.monthlyBottles) * 100, 100)}%` 
                                }}
                            ></div>
                        </div>
                        <div className="progress-percentage">
                            {Math.round((environmentalData.monthlyBottles / goals.monthlyBottles) * 100)}%
                        </div>
                    </div>
                    
                    <div className="activity-stats">
                        <div className="stat-item">
                            <span className="stat-label">이번 주 투입</span>
                            <span className="stat-value">{environmentalData.weeklyBottles}개</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">연속 참여일</span>
                            <span className="stat-value">{environmentalData.consecutiveDays}일</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">현재 등급</span>
                            <span className="stat-value">{userData.grade}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 키오스크 위치 지도 섹션 */}
            <section className="kiosk-map-section">
                <div className="map-section-header">
                    <h2 className="section-title">🗺️ 근처 키오스크</h2>
                    <div className="map-controls">
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="status-filter"
                        >
                            <option value="all">전체 상태</option>
                            <option value="active">운영중</option>
                            <option value="full">포화상태</option>
                            <option value="inactive">점검중</option>
                        </select>
                        <label className="nearby-toggle">
                            <input
                                type="checkbox"
                                checked={showOnlyNearby}
                                onChange={(e) => setShowOnlyNearby(e.target.checked)}
                            />
                            <span>1km 이내만</span>
                        </label>
                    </div>
                </div>

                <div className="kiosk-map-container">
                    
                    {/* 지도 영역 */}
                    <div className="map-area">
                        <div className="map-placeholder">
                            <div className="map-info">
                                <h4>지도 API 연동 예정</h4>
                                <p>Google Maps, 네이버 지도, 또는 카카오맵</p>
                                <div className="map-legend">
                                    <div className="legend-item">
                                        <span className="legend-icon">🟢</span>
                                        <span>운영중</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-icon">🟡</span>
                                        <span>포화상태</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-icon">🔴</span>
                                        <span>점검중</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 키오스크 목록 */}
                    <div className="kiosk-list">
                        <div className="kiosk-list-header">
                            <h4>키오스크 목록 ({filteredKiosks.length}개)</h4>
                        </div>
                        <div className="kiosk-items">
                            {filteredKiosks.map(kiosk => (
                                <div 
                                    key={kiosk.id}
                                    className={`kiosk-item ${selectedKiosk?.id === kiosk.id ? 'selected' : ''}`}
                                    onClick={() => handleKioskClick(kiosk)}
                                >
                                    <div className="kiosk-item-header">
                                        <div className="kiosk-status">
                                            <span className="status-icon">
                                                {getKioskIcon(kiosk.status)}
                                            </span>
                                            <div className="kiosk-info">
                                                <h5 className="kiosk-name">{kiosk.name}</h5>
                                                <p className="kiosk-distance">{kiosk.distance}</p>
                                            </div>
                                        </div>
                                        <div className="kiosk-status-text">
                                            <span className={`status-badge ${kiosk.status}`}>
                                                {getStatusText(kiosk.status)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {selectedKiosk?.id === kiosk.id && (
                                        <div className="kiosk-details">
                                            <div className="detail-row">
                                                <span className="detail-label">주소</span>
                                                <span className="detail-value">{kiosk.address}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">운영시간</span>
                                                <span className="detail-value">{kiosk.operatingHours}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">수용량</span>
                                                <span className="detail-value">{kiosk.capacity}%</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">설치형태</span>
                                                <span className="detail-value">
                                                    {kiosk.type === 'indoor' ? '실내' : '실외'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DashboardTab;