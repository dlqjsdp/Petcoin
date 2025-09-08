/*
 * KioskTab.js
 * - 관리자 페이지 내 키오스크 관리 탭 컴포넌트
 *
 * 주요 기능:
 *   - 키오스크 선택 드롭다운 (전체 / 특정 키오스크)
 *   - 선택된 키오스크 데이터 상태 카드 표시 (위치, 수용량, 온도/습도, 오류 건수)
 *   - 키오스크 상태 변경 (ONLINE / MAINT) 드롭다운 → handleKioskStatusChange 호출
 *   - 키오스크 로그 표시 (수거/오류/점검/시스템) 및 필터링 기능
 *   - 로그가 없을 경우 빈 상태(empty-state) 표시
 *
 * props:
 *   - kioskData: 전체 키오스크 목록
 *   - selectedKiosk: 현재 선택된 키오스크 ID ('all' 또는 숫자)
 *   - setSelectedKiosk: 키오스크 선택 상태 변경 함수
 *   - selectedLogType: 현재 선택된 로그 유형
 *   - setSelectedLogType: 로그 유형 상태 변경 함수
 *   - getFilteredKioskData: 선택 조건에 맞는 키오스크 목록 반환 함수
 *   - getFilteredLogs: 선택 조건에 맞는 로그 목록 반환 함수
 *   - handleKioskStatusChange: 키오스크 상태 변경 처리 함수
 *
 * @fileName : KioskTab.js
 * @author   : yukyeong
 * @since    : 250909
 * @history
 *   - 250909 | yukyeong | 키오스크 관리/로그 UI 및 상태 변경 처리 로직 구현
 *   - 250909 | yukyeong | selectedKiosk 문자열 → 숫자 변환 처리 추가 (타입 불일치 방지)
 *   - 250909 | yukyeong | 수용량 퍼센티지 계산 시 capacity=0/누락 대비 안전 처리 (NaN/Infinity 방지)
 *   - 250909 | yukyeong | 로그 레벨 기본값 처리(log.level ?? 'info') 및 안전성 강화
 */

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
                    onChange={(e) => setSelectedKiosk(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="kiosk-select"
                >
                    <option value="all">전체 키오스크</option>
                    {kioskData.map(kiosk => (
                        <option key={kiosk.kioskId} value={kiosk.kioskId}>{kiosk.name}</option>
                    ))}
                </select>
            </div>

            {/* 키오스크 상태 관리 */}
            <div className="kiosk-management">
                <h3>키오스크 상태 관리</h3>
                <div className="kiosk-status-grid">
                    {getFilteredKioskData().map(kiosk => (
                        <div key={kiosk.kioskId} className={`kiosk-status-card ${kiosk.status}`}>
                            <div className="status-card-header">
                                <h4>{kiosk.name}</h4>
                                <div className="status-controls">
                                    <select
                                        value={kiosk.status}
                                        onChange={(e) => handleKioskStatusChange(kiosk.kioskId, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="ONLINE">운영중</option>
                                        <option value="MAINT">점검중</option>
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
                                        {kiosk.currentCount}/{kiosk.capacity} (
                                        {kiosk.capacity ? Math.round((kiosk.currentCount / kiosk.capacity) * 100) : 0}
                                        %)
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
                                <div key={log.id} className={`log-row ${log.level ?? 'info'}`}>
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