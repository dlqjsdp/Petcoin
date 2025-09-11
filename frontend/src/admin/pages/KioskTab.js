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
 * @since    : 250908
 * @history
 *   - 250908 | yukyeong | 키오스크 관리/로그 UI 및 상태 변경 처리 로직 구현
 *   - 250908 | yukyeong | selectedKiosk 문자열 → 숫자 변환 처리 추가 (타입 불일치 방지)
 *   - 250908 | yukyeong | 수용량 퍼센티지 계산 시 capacity=0/누락 대비 안전 처리 (NaN/Infinity 방지)
 *   - 250908 | yukyeong | 로그 레벨 기본값 처리(log.level ?? 'info') 및 안전성 강화
 *   - 250909 | yukyeong | 로그 필터 라벨 '로그 유형'→'로그 상태'로 변경, 옵션을 RUNNING/COMPLETED/CANCELLED로 통일(백엔드 status 필드와 일치)
 *   - 250909 | yukyeong | 로그 시간 표시 로직 개선: endedAt 우선, 없으면 startedAt 사용 + 안전 포맷팅(safeTime)
 *   - 250909 | yukyeong | 로그 키/필드 정합성: key를 runId(없으면 id)로, kioskName→name, status 소문자 클래스 적용(String(status).toLowerCase())
 *   - 250909 | yukyeong | 로그 상세(details) 안전 출력: 문자열/객체 모두 처리(JSON.stringify)로 예외 방지
 *   - 250909 | yukyeong | CSS 정합성: 키오스크 상태(ONLINE/MAINT) → UI 클래스(active/maintenance) 매핑 함수(statusToCss) 추가로 스타일 미적용 문제 해결
 *   - 250909 | yukyeong | 로그 배지 라벨/아이콘 통일: statusLabel(🔄/✅/⛔) 추가, 상태→기존 유형 CSS 매핑(statusToTypeClass: COMPLETED→collection, RUNNING→maintenance, CANCELLED→system) 적용
 *   - 250909 | yukyeong | 로그 테이블 헤더 '유형'→'상태'로 교체 및 배지 클래스 바인딩을 statusToTypeClass로 변경
 *   - 250909 | yukyeong | 사용자 표시 로직 변경: userName/아이콘 제거, phone 기반 표시(없으면 '비회원'), guest 상태에 전용 클래스(log-user guest) 적용
 *   - 250909 | yukyeong | 휴대폰 포맷터 formatPhone 추가(10/11자리 하이픈 처리), 개인정보 마스킹 미적용
 *   - 250909 | yukyeong | 로그 상세 텍스트(detailsText) 추가: 상태별 요약(진행중/취소/총 N개 수거), totalPet 활용
 *   - 250911 | yukyeong | 로그 테이블에서 상세정보 칸 제거, detailsText 내용을 메시지 칸으로 이동하여 UI 단순화
 *   - 250911 | yukyeong | 로그 시간 포맷 수정: 날짜+시간을 한 줄로 표시하도록 locale 옵션 지정
 *   - 250911 | yukyeong | 상태 드롭다운에 OFFLINE(미운영) 옵션 추가 및 statusToCss에 offline 매핑 반영
 *   - 250911 | yukyeong | 미운영 상태 도입: 드롭다운에 OFFLINE(미운영) 옵션 추가, statusToCss에 OFFLINE→'inactive' 매핑
 * 
 */

import React from 'react';

const formatPhone = (p) => {
    if (!p) return null;
    const d = String(p).replace(/\D/g, '');
    if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
    return p;
};

const statusToCss = (s) =>
  s === 'ONLINE' ? 'active'
  : s === 'MAINT' ? 'maintenance'
  : s === 'OFFLINE' ? 'inactive'   // ← 추가
  : 'unknown';

const statusLabel = s =>
    s === 'RUNNING' ? '🔄 실행중' :
        s === 'COMPLETED' ? '✅ 완료' :
            s === 'CANCELLED' ? '⛔ 취소' : '-';

// 기존 CSS 색을 재사용하기 위해 상태→유형 클래스로 매핑
// (예: 완료=collection 색, 실행중=maintenance 색, 취소=system 색)
const statusToTypeClass = s =>
    s === 'COMPLETED' ? 'collection' :
        s === 'RUNNING' ? 'maintenance' :
            s === 'CANCELLED' ? 'system' : 'system';

const detailsText = (log) => {
    const n = log?.totalPet ?? null; // number or null
    switch (log?.status) {
        case 'COMPLETED':
            return n != null ? `총 ${Number(n)}개 수거` : '총 수거량 미보고';
        case 'RUNNING':
            return '진행중';
        case 'CANCELLED':
            return '취소됨';
        default:
            return '-';
    }
};

function KioskTab({
    kioskData, // 전체 키오스크 목록
    selectedKiosk, // 현재 선택된 키오스크 ID ('all' 또는 숫자)
    setSelectedKiosk, // 키오스크 선택 변경 함수
    selectedLogType, // 현재 선택된 로그 상태 (RUNNING/COMPLETED/CANCELLED/all)
    setSelectedLogType, // 로그 상태 변경 함수
    getFilteredKioskData, // 선택된 조건에 맞는 키오스크 목록 반환 함수
    getFilteredLogs, // 선택된 조건에 맞는 로그 목록 반환 함수
    handleKioskStatusChange // 키오스크 상태 변경 처리 함수
}) {
    return (
        <div className="kiosk-section">
            {/* 상단: 키오스크 선택 드롭다운 */}
            <div className="kiosk-header">
                <h2>키오스크 관리</h2>
                <select
                    value={selectedKiosk}
                    onChange={(e) => setSelectedKiosk(e.target.value === 'all' ? 'all' : Number(e.target.value))}  // all이면 문자열, 아니면 숫자 변환
                    className="kiosk-select"
                >
                    {/* 전체 선택 */}
                    <option value="all">전체 키오스크</option>
                    {/* kioskData 배열을 돌면서 option 생성 */}
                    {kioskData.map(kiosk => (
                        <option key={kiosk.kioskId} value={kiosk.kioskId}>{kiosk.name}</option>
                    ))}
                </select>
            </div>

            {/* 키오스크 상태 관리 카드 */}
            <div className="kiosk-management">
                <h3>키오스크 상태 관리</h3>
                <div className="kiosk-status-grid">
                    {/* 선택된 조건에 맞는 키오스크 데이터만 렌더링 */}
                    {getFilteredKioskData().map(kiosk => (
                        <div key={kiosk.kioskId} className={`kiosk-status-card ${statusToCss(kiosk.status)}`}>
                            <div className="status-card-header">
                                <h4>{kiosk.name}</h4>
                                {/* 상태 변경 드롭다운 */}
                                <div className="status-controls">
                                    <select
                                        value={kiosk.status}
                                        onChange={(e) => handleKioskStatusChange(kiosk.kioskId, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="ONLINE">운영중</option>
                                        <option value="MAINT">점검중</option>
                                        <option value="OFFLINE">미운영</option>
                                    </select>
                                </div>
                            </div>
                            {/* 키오스크 상세 정보 */}
                            <div className="status-info">
                                <div className="info-row">
                                    <span>위치:</span>
                                    <span>{kiosk.location}</span>
                                </div>
                                <div className="info-row">
                                    <span>수용량:</span>
                                    <span>
                                        {kiosk.currentCount}/{kiosk.capacity} (
                                        {/* 퍼센티지 계산: capacity가 0이면 0%로 처리 */}
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
                                    {/* 오류 건수가 0보다 크면 빨간색 강조 */}
                                    <span className={kiosk.errorCount > 0 ? 'error-count' : ''}>
                                        {kiosk.errorCount}건
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 키오스크 로그 영역 */}
            <div className="kiosk-logs">
                <h3>키오스크 로그</h3>

                {/* 로그 필터 (상태별) */}
                <div className="log-filters">
                    <div className="filter-group">
                        <label>로그 상태:</label>
                        <select
                            className="log-type-filter"
                            value={selectedLogType}
                            onChange={(e) => setSelectedLogType(e.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="RUNNING">실행중</option>
                            <option value="COMPLETED">완료</option>
                            <option value="CANCELLED">취소</option>
                        </select>
                    </div>
                </div>

                {/* 로그 테이블 */}
                <div className="logs-table">
                    {/* 헤더 */}
                    <div className="logs-header">
                        <span>시간</span>
                        <span>키오스크</span>
                        <span>상태</span>
                        <span>메시지</span>
                        <span>사용자</span>
                        {/* <span>상세정보</span> */}
                    </div>

                    {/* 로그 목록 */}
                    <div className="logs-body">
                        {getFilteredLogs().length > 0 ? (
                            getFilteredLogs().map(log => {
                                // 시간 안전 처리: endedAt가 있으면 그걸, 없으면 startedAt 사용
                                const dt = new Date(log.endedAt ?? log.startedAt);
                                const safeTime = isNaN(dt.getTime())
                                    ? '-'
                                    : `${dt.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })} ${dt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
                                return (
                                    <div
                                        key={log.runId ?? log.id}
                                        className={`log-row ${String(log.status ?? '').toLowerCase()}`}
                                    >
                                        {/* 로그 시간 */}
                                        <span className="log-time">{safeTime}</span>

                                        {/* 키오스크 이름 (백엔드 DTO 필드: name) */}
                                        <span className="log-kiosk">{log.name ?? '-'}</span>

                                        {/* 백엔드 DTO: 상태 필드는 status (RUNNING/COMPLETED/CANCELLED) */}
                                        <span className={`log-type ${statusToTypeClass(log.status ?? '')}`}>
                                            {statusLabel(log.status)}
                                        </span>

                                        {/* 로그 메시지 (없으면 '-') */}
                                        <span className="log-message">
                                            {log.message ?? detailsText(log) ?? '-'}
                                        </span>

                                        {/* 사용자 정보 */}
                                        <span className={`log-user ${log.phone ? '' : 'guest'}`}>
                                            {formatPhone(log.phone) ?? '비회원'}
                                        </span>

                                        {/* 로그 상세 정보
                                        <span className="log-details">
                                            {detailsText(log)}
                                        </span> */}
                                    </div>
                                );
                            })
                        ) : (
                            // 로그가 없을 때 빈 상태 표시
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