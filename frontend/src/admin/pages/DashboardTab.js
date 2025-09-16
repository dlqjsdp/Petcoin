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
 *   - 250911 | yukyeong | 미운영 상태 표시 추가: statusToCss에 OFFLINE→'inactive' 매핑, 카드/뱃지 라벨에 '미운영' 분기
 *   - 250912 | yukyeong | 수용량(오늘 기준) 표시/막대 추가: CAPACITY_DEFAULT=300, cap/remain/usedPct 계산, OFFLINE일 때 막대 숨김
 * 
 */

import React from 'react';

const CAPACITY_DEFAULT = 500; // 임시 총 수용량(병 개수)

const statusToCss = (s) => {
    if (s === 'ONLINE') return 'active';
    if (s === 'MAINT') return 'maintenance';
    if (s === 'OFFLINE') return 'inactive';
    return 'unknown';
};


function DashboardTab({ dashboardStats = {}, kioskData = [], kioskRuns = [] }) {

    // 특정 키오스크의 "오늘" 병 합계 + 건수만 계산 (로컬 날짜 기준, KST 고려 X: 가장 단순)
    const getTodayStats = (kiosk) => {
        const id = kiosk.recycleId ?? kiosk.kioskId ?? kiosk.id;
        const today = new Date();

        let bottles = 0;
        let sessions = 0;

        for (const r of kioskRuns) {
            const runId = r.recycleId ?? r.kioskId ?? r.id;
            if (runId !== id) continue;
            if (r.status !== 'COMPLETED') continue;

            const ended = new Date(r.endedAt ?? r.ended_at);
            if (
                ended.getFullYear() !== today.getFullYear() ||
                ended.getMonth() !== today.getMonth() ||
                ended.getDate() !== today.getDate()
            ) continue;

            bottles += Number(r.total_pet ?? r.totalPet ?? 0) || 0; // 병 개수
            sessions += 1;                                          // 런 건수
        }

        return { bottles, sessions };
    };
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
                <h3>키오스크 현황</h3>
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
                    {kioskData.map(kiosk => {
                        const { bottles, sessions } = getTodayStats(kiosk);

                        // 추가
                        const cap = kiosk.capacity ?? CAPACITY_DEFAULT;            // BE가 주면 그 값, 없으면 300
                        const remain = Math.max(cap - bottles, 0);                 // 오늘 투입량 기준 잔여
                        const remainPct = cap ? Math.round((remain / cap) * 100) : 0;
                        const isInactive = kiosk.status === 'OFFLINE';

                        const usedPct = cap ? Math.min(100, Math.max(0, Math.round((bottles / cap) * 100))) : 0; // 사용률
                        const fillClass = usedPct < 60 ? 'ok' : usedPct < 85 ? 'warn' : 'crit';

                        return (
                            <div key={kiosk.kioskId} className={`kiosk-card ${statusToCss(kiosk.status)}`}>
                                <div className="kiosk-header">
                                    <h4>{kiosk.name}</h4>
                                    <span className={`status-badge ${statusToCss(kiosk.status)}`}>
                                        {kiosk.status === 'ONLINE' ? '운영중'
                                            : kiosk.status === 'MAINT' ? '점검중'
                                                : kiosk.status === 'OFFLINE' ? '미운영'
                                                    : '-'}
                                    </span>
                                </div>

                                <div className="kiosk-stats">
                                    <span>
                                        수용량: {isInactive ? '-' : `${remain}/${cap} (${remainPct}%)`}
                                        <small style={{ marginLeft: 6, color: '#94a3b8' }}>오늘 기준</small>
                                    </span>
                                    <span>오늘: {bottles}개 · {sessions}건</span>
                                </div>

                                {!isInactive && (
                                    <div className="capacity-bar">
                                        <div className={`capacity-fill ${fillClass}`} style={{ width: `${usedPct}%` }} />
                                    </div>
                                )}

                                <div className="kiosk-location">{kiosk.location}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default DashboardTab;