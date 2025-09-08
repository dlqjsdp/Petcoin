import React from 'react';

function PointsTab({ refundRequests, handleRefundProcess }) {
    return (
        <div className="points-section">
            <h2>포인트 환급 관리</h2>
            
            {/* 환급 요청 통계 */}
            <div className="refund-summary-board">
                <div className="summary-item-board">
                    <span className="summary-label">대기중</span>
                    <span className="summary-value pending">{refundRequests.filter(r => r.status === 'pending').length}건</span>
                </div>
                <div className="summary-item-board">
                    <span className="summary-label">승인됨</span>
                    <span className="summary-value approved">{refundRequests.filter(r => r.status === 'approved').length}건</span>
                </div>
                <div className="summary-item-board">
                    <span className="summary-label">거부됨</span>
                    <span className="summary-value rejected">{refundRequests.filter(r => r.status === 'rejected').length}건</span>
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
                            <div key={request.id} className={`board-row ${request.status}`}>
                                <span className="col-no">{refundRequests.length - index}</span>
                                <span className="col-member">
                                    <div className="member-info">
                                        <strong>{request.memberName}</strong>
                                        <small>({request.memberId})</small>
                                    </div>
                                </span>
                                <span className="col-amount">
                                    <div className="amount-display">
                                        <strong>{request.requestedPoints.toLocaleString()}P</strong>
                                    </div>
                                </span>
                                <span className="col-account">
                                    <div className="account-info">
                                        {request.accountInfo}
                                    </div>
                                </span>
                                <span className="col-date">
                                    <div className="date-info">
                                        {new Date(request.requestDate).toLocaleString('ko-KR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </span>
                                <span className="col-status">
                                    <span className={`status-badge-board ${request.status}`}>
                                        {request.status === 'pending' && '대기중'}
                                        {request.status === 'approved' && '승인됨'}
                                        {request.status === 'rejected' && '거부됨'}
                                    </span>
                                </span>
                                <span className="col-action">
                                    {request.status === 'pending' ? (
                                        <div className="action-buttons">
                                            <button 
                                                className="approve-btn-small"
                                                onClick={() => handleRefundProcess(request.id, 'approved', '환급 승인 처리')}
                                            >
                                                승인
                                            </button>
                                            <button 
                                                className="reject-btn-small"
                                                onClick={() => handleRefundProcess(request.id, 'rejected', '환급 거부 처리')}
                                            >
                                                거부
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="processed-info">
                                            <small>
                                                {request.processedDate && 
                                                    new Date(request.processedDate).toLocaleDateString('ko-KR')
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
                        .filter(r => r.status !== 'pending')
                        .slice(0, 5)
                        .map(request => (
                            <div key={request.id} className="history-item">
                                <div className="history-main">
                                    <span className="history-member">{request.memberName}</span>
                                    <span className="history-amount">{request.requestedPoints.toLocaleString()}P</span>
                                    <span className={`history-status ${request.status}`}>
                                        {request.status === 'approved' ? '승인' : '거부'}
                                    </span>
                                </div>
                                <div className="history-sub">
                                    <span className="history-date">
                                        {request.processedDate && 
                                            new Date(request.processedDate).toLocaleDateString('ko-KR')
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