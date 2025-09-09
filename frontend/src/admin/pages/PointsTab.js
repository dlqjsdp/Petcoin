import React from 'react';

/*
 * 포인트 페이지
 *
 * @author  : sehui
 * @fileName: PointsTab.js
 * @since   : 250909
 * @history
 *   - 250909 | sehui | Controller에서 넘겨주는 DTO 값에 맞게 <span> 값 변경
 */

function PointsTab({ refundRequests, handleRefundProcess }) {
    return (
        <div className="points-section">
            <h2>포인트 환급 관리</h2>
            
            {/* 환급 요청 통계 */}
            <div className="refund-summary-board">
                <div className="summary-item-board">
                    <span className="summary-label">대기중</span>
                    <span className="summary-value pending">{refundRequests.filter(r => r.requestStatus === 'pending').length}건</span>
                </div>
                <div className="summary-item-board">
                    <span className="summary-label">승인됨</span>
                    <span className="summary-value approved">{refundRequests.filter(r => r.requestStatus === 'approved').length}건</span>
                </div>
                <div className="summary-item-board">
                    <span className="summary-label">거부됨</span>
                    <span className="summary-value rejected">{refundRequests.filter(r => r.requestStatus === 'rejected').length}건</span>
                </div>
            </div>

            {/* 환급 요청 게시판 */}
            <div className="refund-board">
                <div className="board-header">
                    <h3>환급 요청 목록</h3>
                    <div className="board-controls">
                        <select className="status-filter">
                            <option value="all">전체</option>
                            <option value="pending">대기중</option>
                            <option value="approved">승인됨</option>
                            <option value="rejected">거부됨</option>
                        </select>
                        <button className="refresh-btn">새로고침</button>
                    </div>
                </div>

                <div className="board-table">
                    <div className="board-table-header">
                        <span className="col-no">번호</span>
                        <span className="col-member">회원정보</span>
                        <span className="col-amount">환급금액</span>
                        <span className="col-account">계좌정보</span>
                        <span className="col-date">요청일시</span>
                        <span className="col-status">상태</span>
                        <span className="col-action">관리</span>
                    </div>

                    <div className="board-table-body">
                        {refundRequests.map((request, index) => (
                            <div key={request.requestId} className={`board-row ${request.requestStatus}`}>
                                <span className="col-no">{refundRequests.length - index}</span>
                                <span className="col-member">
                                    <div className="member-info">
                                        <strong>{request.phone}</strong>
                                        <small>({request.memberId})</small>
                                    </div>
                                </span>
                                <span className="col-amount">
                                    <div className="amount-display">
                                        <strong>{request.requestAmount}P</strong>
                                    </div>
                                </span>
                                <span className="col-account">
                                    <div className="account-info">
                                        {request.accountNumber}
                                    </div>
                                </span>
                                <span className="col-date">
                                    <div className="date-info">
                                        {new Date(request.requestAt).toLocaleString('ko-KR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </span>
                                <span className="col-status">
                                    <span className={`status-badge-board ${request.requestStatus}`}>
                                        {request.requestStatus === 'pending' && '대기중'}
                                        {request.requestStatus === 'approved' && '승인됨'}
                                        {request.requestStatus === 'rejected' && '거부됨'}
                                    </span>
                                </span>
                                <span className="col-action">
                                    {request.requestStatus === 'pending' ? (
                                        <div className="action-buttons">
                                            <button 
                                                className="approve-btn-small"
                                                onClick={() => handleRefundProcess(request.requestId, 'approved', '환급 승인 처리')}
                                            >
                                                승인
                                            </button>
                                            <button 
                                                className="reject-btn-small"
                                                onClick={() => handleRefundProcess(request.requestId, 'rejected', '환급 거부 처리')}
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
                    </div>
                </div>

                {/* 페이지네이션 */}
                <div className="board-pagination">
                    <button className="page-btn">이전</button>
                    <span className="page-info">1 / 1</span>
                    <button className="page-btn">다음</button>
                </div>
            </div>

            {/* 환급 처리 내역 */}
            <div className="refund-history">
                <h3>최근 처리 내역</h3>
                <div className="history-list">
                    {refundRequests
                        .filter(r => r.requestStatus !== 'pending')
                        .slice(0, 5)
                        .map(request => (
                            <div key={request.requestId} className="history-item">
                                <div className="history-main">
                                    <span className="history-member">{request.phone}</span>
                                    <span className="history-amount">{request.requestAmount}P</span>
                                    <span className={`history-status ${request.requestStatus}`}>
                                        {request.requestStatus === 'approved' ? '승인' : '거부'}
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