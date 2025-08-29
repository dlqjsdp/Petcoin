import React from 'react';

function KioskTab({ 
    kioskData, 
    selectedKiosk, 
    setSelectedKiosk, 
    selectedLogType, 
    setSelectedLogType, 
    getFilteredKioskData, 
    getFilteredLogs, 
    handleKioskStatusChange 
}) {
    return (
        <div className="kiosk-section">
            <div className="kiosk-header">
                <h2>키오스크 관리</h2>
                <select
                    value={selectedKiosk}
                    onChange={(e) => setSelectedKiosk(e.target.value)}
                    className="kiosk-select"
                >
                    <option value="all">전체 키오스크</option>
                    {kioskData.map(kiosk => (
                        <option key={kiosk.id} value={kiosk.id}>{kiosk.name}</option>
                    ))}
                </select>
            </div>

            {/* 키오스크 상태 관리 */}
            <div className="kiosk-management">
                <h3>키오스크 상태 관리</h3>
                <div className="kiosk-status-grid">
                    {getFilteredKioskData().map(kiosk => (
                        <div key={kiosk.id} className={`kiosk-status-card ${kiosk.status}`}>
                            <div className="status-card-header">
                                <h4>{kiosk.name}</h4>
                                <div className="status-controls">
                                    <select
                                        value={kiosk.status}
                                        onChange={(e) => handleKioskStatusChange(kiosk.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="active">운영중</option>
                                        <option value="maintenance">점검중</option>
                                    </select>
                                </div>
                            </div>
                            <div className="status-info">
                                <div className="info-row">
                                    <span>위치:</span>
                                    <span>{kiosk.location}</span>
                                </div>
                                <div className="info-row">
                                    <span>수용량:</span>
                                    <span>
                                        {kiosk.currentCount}/{kiosk.capacity} 
                                        ({Math.round((kiosk.currentCount / kiosk.capacity) * 100)}%)
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span>온도:</span>
                                    <span>{kiosk.temperature}°C</span>
                                </div>
                                <div className="info-row">
                                    <span>습도:</span>
                                    <span>{kiosk.humidity}%</span>
                                </div>
                                <div className="info-row">
                                    <span>오류 건수:</span>
                                    <span className={kiosk.errorCount > 0 ? 'error-count' : ''}>
                                        {kiosk.errorCount}건
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 키오스크 로그 */}
            <div className="kiosk-logs">
                <h3>키오스크 로그</h3>
                <div className="log-filters">
                    <div className="filter-group">
                        <label>로그 유형:</label>
                        <select 
                            className="log-type-filter"
                            value={selectedLogType}
                            onChange={(e) => setSelectedLogType(e.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="collection">수거</option>
                            <option value="error">오류</option>
                            <option value="maintenance">점검</option>
                            <option value="system">시스템</option>
                        </select>
                    </div>
                </div>
                
                <div className="logs-table">
                    <div className="logs-header">
                        <span>시간</span>
                        <span>키오스크</span>
                        <span>유형</span>
                        <span>메시지</span>
                        <span>사용자</span>
                        <span>상세정보</span>
                    </div>
                    
                    <div className="logs-body">
                        {getFilteredLogs().length > 0 ? (
                            getFilteredLogs().map(log => (
                                <div key={log.id} className={`log-row ${log.level}`}>
                                    <span className="log-time">
                                        {new Date(log.timestamp).toLocaleString('ko-KR', {
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </span>
                                    <span className="log-kiosk">{log.kioskName}</span>
                                    <span className={`log-type ${log.type}`}>
                                        {log.type === 'collection' && '📦 수거'}
                                        {log.type === 'error' && '⚠️ 오류'}
                                        {log.type === 'maintenance' && '🔧 점검'}
                                        {log.type === 'system' && '⚙️ 시스템'}
                                    </span>
                                    <span className="log-message">{log.message}</span>
                                    <span className="log-user">
                                        {log.userName ? (
                                            <span className="user-info">
                                                👤 {log.userName}
                                            </span>
                                        ) : (
                                            <span className="no-user">-</span>
                                        )}
                                    </span>
                                    <span className="log-details">
                                        <code>{log.details}</code>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <p>선택한 조건에 해당하는 로그가 없습니다.</p>
                                <small>다른 필터 조건을 선택해보세요.</small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KioskTab;