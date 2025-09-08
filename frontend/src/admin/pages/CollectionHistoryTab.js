import React from 'react';

function CollectionHistoryTab({ kioskData, selectedKiosk, setSelectedKiosk, getFilteredKioskData }) {
    return (
        <div className="collection-section">
            <div className="collection-header">
                <h2>수거 내역</h2>
                <select
                    value={selectedKiosk}
                    onChange={(e) => setSelectedKiosk(e.target.value)}
                    className="kiosk-select"
                >
                    <option value="all">전체 수거함</option>
                    {kioskData.map(kiosk => (
                        <option key={kiosk.id} value={kiosk.id}>{kiosk.name}</option>
                    ))}
                </select>
            </div>

            <div className="collection-stats">
                {getFilteredKioskData().map(kiosk => (
                    <div key={kiosk.id} className="collection-card">
                        <div className="collection-card-header">
                            <h3>📍 {kiosk.name}</h3>
                            <span className={`status-badge ${kiosk.status}`}>
                                {kiosk.status === 'active' ? '운영중' : '점검중'}
                            </span>
                        </div>

                        <div className="capacity-info">
                            <div className="capacity-header">
                                <span>현재 수용량</span>
                                <span>
                                    {kiosk.currentCount}/{kiosk.capacity} 
                                    ({Math.round((kiosk.currentCount / kiosk.capacity) * 100)}%)
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className={`progress ${(kiosk.currentCount / kiosk.capacity) > 0.8 ? 'warning' : ''}`}
                                    style={{ width: `${(kiosk.currentCount / kiosk.capacity) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="collection-metrics">
                            <div className="metric">
                                <span className="metric-label">오늘 수거량</span>
                                <span className="metric-value">{kiosk.todayCollection}개</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">총 수거량</span>
                                <span className="metric-value">{kiosk.totalCollection.toLocaleString()}개</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">마지막 수거</span>
                                <span className="metric-value">
                                    {new Date(kiosk.lastCollection).toLocaleString('ko-KR', {
                                        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="system-info">
                            <div className="info-item">
                                <span>🌡️ 온도: {kiosk.temperature}°C</span>
                            </div>
                            <div className="info-item">
                                <span>💧 습도: {kiosk.humidity}%</span>
                            </div>
                            <div className="info-item">
                                <span>⚠️ 오류: {kiosk.errorCount}건</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollectionHistoryTab;