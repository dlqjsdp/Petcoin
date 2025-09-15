/**
 * CollectionHistoryTab.js
 * - 관리자 페이지 수거 내역 탭 컴포넌트
 *
 * 주요 기능:
 *   - 무인 회수기(재활용기) 수거 내역 표시
 *   - 드롭다운으로 특정 수거기 선택 (전체/단일)
 *   - 총 수거량, 마지막 수거 시각, 경과 시간 표시
 *   - 위치 정보 표시
 *
 * @fileName : CollectionHistoryTab.js
 * @author   : yukyeong
 * @since    : 250911
 * @history
 *   - 250911 | yukyeong | 무인 회수기 수거 내역 전용 컴포넌트 구현
 *   - 250911 | yukyeong | recycleId/recycleName 기반 드롭다운 및 카드 렌더링 적용
 *   - 250911 | yukyeong | 총 수거량(totalCount), 마지막 수거 시각(lastCollection) 표시 추가
 *   - 250911 | yukyeong | 경과 시간 계산 로직 추가 (분/시간/일 단위 표시)
 *   - 250911 | yukyeong | todayCollection, capacity, 센서 데이터(온도/습도/오류) 섹션 주석 처리
 *   - 250911 | yukyeong | ONLINE/MAINT 상태를 뱃지(`status-badge`) 스타일로 표시하도록 수정
 *   - 250913 | yukyeong | 리스트 key를 name 대신 recycleId로 사용하여 경고 제거, OFFLINE 상태를 inactive로 매핑해 UI 표시 개선
 *   - 250915 | yukyeong | props를 selectedRecycleId/setSelectedRecycleId로 교체
 *   - 250915 | yukyeong | 카드 key 안전 처리(recycleId → kioskId → name 순서)
 */

import React from 'react';

const statusToCss = (s) => {
    if (s === 'ONLINE') return 'active';
    if (s === 'MAINT') return 'maintenance';
    if (s === 'OFFLINE') return 'inactive';
    return 'unknown';
};

function CollectionHistoryTab({ kioskData, selectedRecycleId, setSelectedRecycleId, getFilteredKioskData }) {
    return (
        <div className="collection-section">
            <div className="collection-header">
                <h2>수거 내역</h2>
                <select
                    value={selectedRecycleId}
                    onChange={(e) => setSelectedRecycleId(e.target.value)}
                    className="kiosk-select"
                >
                    <option value="all">전체 수거함</option>
                    {kioskData.map(kiosk => (
                        <option key={kiosk.recycleId} value={kiosk.recycleId}>
                            {kiosk.recycleName ?? kiosk.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="collection-stats">
                {getFilteredKioskData().map(kiosk => (
                    <div key={kiosk.recycleId ?? kiosk.kioskId ?? kiosk.name} className="collection-card">
                        <div className="collection-card-header">
                            <h3>📍 {kiosk.recycleName ?? kiosk.name}</h3>
                            <span className={`status-badge ${statusToCss(kiosk.status)}`}>
                                {kiosk.status === 'ONLINE' ? '운영중' 
                                    : kiosk.status === 'MAINT' ? '점검중' 
                                    : kiosk.status === 'OFFLINE' ? '미운영'  : '알수없음'}
                            </span>
                        </div>

                        {/* <div className="capacity-info">
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
                        </div> */}

                        <div className="collection-metrics">
                            {/* <div className="metric">
                                <span className="metric-label">오늘 수거량</span>
                                <span className="metric-value">{kiosk.todayCollection}개</span>
                            </div> */}
                            <div className="metric">
                                <span className="metric-label">총 수거량</span>
                                <span className="metric-value">{(kiosk.totalCount ?? 0).toLocaleString()}개</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">마지막 수거</span>
                                <span className="metric-value">
                                    {kiosk.lastCollection
                                        ? new Date(kiosk.lastCollection).toLocaleString('ko-KR', {
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : '-'}
                                </span>
                            </div>
                            {/* 🔽 여기 추가 */}
                            <div className="metric">
                                <span className="metric-label">경과 시간</span>
                                <span className="metric-value">
                                    {kiosk.lastCollection
                                        ? (() => {
                                            const diffMs = new Date() - new Date(kiosk.lastCollection);
                                            const diffMins = Math.floor(diffMs / 60000);
                                            if (diffMins < 60) return `${diffMins}분 전`;
                                            const diffHours = Math.floor(diffMins / 60);
                                            if (diffHours < 24) return `${diffHours}시간 전`;
                                            const diffDays = Math.floor(diffHours / 24);
                                            return `${diffDays}일 전`;
                                        })()
                                        : '-'}
                                </span>
                            </div>
                        </div>

                        <div className="system-info">
                            {/* <div className="info-item">
                                <span>🌡️ 온도: {kiosk.temperature}°C</span>
                            </div>
                            <div className="info-item">
                                <span>💧 습도: {kiosk.humidity}%</span>
                            </div>
                            <div className="info-item">
                                <span>⚠️ 오류: {kiosk.errorCount}건</span>
                            </div> */}
                            <div className="info-item">
                                <span>📍 위치: {kiosk.address}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollectionHistoryTab;