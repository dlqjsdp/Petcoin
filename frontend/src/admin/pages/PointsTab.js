import React from 'react';

/*
 * 포인트 페이지
 *
 * @author  : sehui
 * @fileName: PointsTab.js
 * @since   : 250909
 * @history
 *   - 250909 | sehui | Controller에서 넘겨주는 DTO 값에 맞게 <span> 값 변경
 *   - 250910 | sehui | 환급 요청 목록에서 보여줄 값 <span> 추가
 *   - 250910 | sehui | 요청 일시 정렬 변경(요일, 시간 다른 줄로 표시)
 *   - 250910 | sehui | 환급 요청 통계 css를 위해 <span> 클래스명 구분
 *   - 250912 | sehui | 환급 요청 상태에 따라 필터링된 목록 표시 추가
 *   - 250915 | sehui | 페이지네이션 코드 수정
 *   - 250915 | sehui | 환급 요청 통계 전체 데이터(allRefundRequests)으로 변경
 */

function PointsTab({ refundRequests, allRefundRequests, pageInfo, handleRefundProcess, selectedStatus, setSelectedStatus, getFilteredRequests, onPageChange }) {
    return (
        <div className="points-section">
            <h2>포인트 환급 관리</h2>
            
            {/* 환급 요청 통계 */}
            <div className="refund-summary-board">
                <div className="summary-item-board">
                    <span className="summary-label">대기중</span>
                    <span className="summary-value pending">{allRefundRequests.filter(r => r.requestStatus === 'PENDING').length}건</span>
                </div>
                <div className="summary-item-board">
                    <span className="summary-label">승인 완료</span>
                    <span className="summary-value approved">{allRefundRequests.filter(r => r.requestStatus === 'APPROVED').length}건</span>
                </div>
                <div className="summary-item-board">
                    <span className="summary-label">환급 완료</span>
                    <span className="summary-value completed">{allRefundRequests.filter(r => r.requestStatus === 'COMPLETED').length}건</span>
                </div>
                <div className="summary-item-board">
                    <span className="summary-label">거부</span>
                    <span className="summary-value rejected">{allRefundRequests.filter(r => r.requestStatus === 'REJECTED').length}건</span>
                </div>
            </div>

            {/* 환급 요청 게시판 */}
            <div className="refund-board">
                <div className="board-header">
                    <h3>환급 요청 목록</h3>
                    <div className="board-controls">
                        <select className="status-filter"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="PENDING">대기중</option>
                            <option value="APPROVED">승인 완료</option>
                            <option value="COMPLETED">환급 완료</option>
                            <option value="REJECTED">거부</option>
                        </select>
                        <button className="refresh-btn"
                                onClick={() => setSelectedStatus('all')}
                        >
                            새로고침
                        </button>
                    </div>
                </div>

                <div className="board-table">
                    <div className="board-table-header point-request">
                        <span className="col-no">번호</span>
                        <span className="col-member">회원정보</span>
                        <span className="col-amount">환급금액</span>
                        <span className="col-bank">은행사</span>
                        <span className="col-account">계좌번호</span>
                        <span className="col-account-holder">예금주</span>
                        <span className="col-date">요청일시</span>
                        <span className="col-status">상태</span>
                        <span className="col-action">관리</span>
                    </div>

                    <div className="board-table-body">
                        {getFilteredRequests().map((request, index) => (
                            <div key={request.requestId} className={`board-row point-request ${request.requestStatus}`}>
                                <span className="col-no">{refundRequests.length - index}</span>
                                <span className="col-member">
                                    <div className="member-info">
                                        <strong>{request.phone}</strong>
                                    </div>
                                </span>
                                <span className="col-amount">
                                    <div className="amount-display">
                                        <strong>{request.requestAmount}P</strong>
                                    </div>
                                </span>
                                <span className="col-bank">
                                    <div className="account-info">
                                        <strong>{request.bankName}</strong>
                                    </div>
                                </span>
                                <span className="col-account">
                                    <div className="account-info">
                                        {request.accountNumber}
                                    </div>
                                </span>
                                <span className="col-account-holder">
                                    <div className="account-info">
                                        <strong>{request.accountHolder}</strong>
                                    </div>
                                </span>
                                <span className="col-date">
                                    <div className="date-info">
                                        {(() => {
                                            const date = new Date(request.requestAt);
                                            const day = date.toLocaleDateString('ko-KR');
                                            const time = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
                                            
                                            return (
                                                <>
                                                    {day}<br/>
                                                    {time}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </span>
                                <span className="col-status">
                                    <span className={`status-badge-board ${request.requestStatus}`}>
                                        {request.requestStatus === 'PENDING' && '⏳ 처리 대기'}
                                        {request.requestStatus === 'APPROVED' && '✔️ 승인 완료'}
                                        {request.requestStatus === 'COMPLETED' && '💰 환급 완료'}
                                        {request.requestStatus === 'REJECTED' && '❌ 거부'}
                                    </span>
                                </span>
                                <span className="col-action">
                                    {request.requestStatus === 'PENDING' ? (
                                        <div className="action-buttons">
                                            <button 
                                                className="approve-btn-small"
                                                onClick={() => handleRefundProcess(request.requestId, 'APPROVED', '환급 승인 처리')}
                                            >
                                                승인
                                            </button>
                                            <button 
                                                className="reject-btn-small"
                                                onClick={() => handleRefundProcess(request.requestId, 'REJECTED', '환급 거부 처리')}
                                            >
                                                거부
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="processed-info">
                                            <small>
                                                {request.processedAt && 
                                                    new Date(request.processedAt).toLocaleDateString('ko-KR')
                                                }
                                            </small>
                                            <br />
                                            <small>by {request.processedBy || 'admin'}</small>
                                        </div>
                                    )}
                                </span>
                            </div>
                        ))}
                        {/* 페이지네이션 */}
                        <div className="board-pagination">
                            <button className="page-btn" 
                                    disabled={!pageInfo?.prevPage}
                                    onClick={() => onPageChange('prev')}
                            >
                                이전
                            </button>
                                <span className="page-info">
                                    {`${pageInfo?.cri?.pageNum || 1} / ${Math.ceil((pageInfo?.total || 1) / (pageInfo?.cri?.amount || 10))}`}
                                </span>
                            <button className="page-btn" 
                                    disabled={!pageInfo?.nextPage}
                                    onClick={() => onPageChange('next')}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>

                
            </div>

            {/* 환급 처리 내역 */}
            <div className="refund-history">
                <h3>최근 처리 내역</h3>
                <div className="history-list">
                    {refundRequests
                        .filter(r => r.requestStatus !== 'PENDING')
                        .slice(0, 5)
                        .map(request => (
                            <div key={request.requestId} className="history-item">
                                <div className="history-main">
                                    <span className="history-member">{request.phone}</span>
                                    <span className="history-amount">{request.requestAmount}P</span>
                                    <span className={`history-status ${request.requestStatus}`}>
                                        {request.requestStatus === 'APPROVED' ? '승인' 
                                            : request.requestStatus === 'COMPLETED' ? '완료' : '거부'}
                                    </span>
                                </div>
                                <div className="history-sub">
                                    <span className="history-date">
                                        {request.processedAt && 
                                            new Date(request.processedAt).toLocaleDateString('ko-KR')
                                        }
                                    </span>
                                    {request.note && (
                                        <span className="history-note">
                                            📝 {request.note}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default PointsTab;