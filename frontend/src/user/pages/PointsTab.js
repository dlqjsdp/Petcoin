import React, { useState } from 'react';

function PointsTab({ userData, userPoints, currentPointHistory }) {
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    
    const availablePoints = userPoints || userData.usablePoints;
    
    const handleRefundClick = () => {
        setShowRefundModal(true);
    };
    
    const handleRefundSubmit = () => {
        // 환급 처리 로직
        console.log(`${refundAmount}P 환급 요청`);
        setShowRefundModal(false);
        setRefundAmount('');
    };
    
    const handleModalClose = () => {
        setShowRefundModal(false);
        setRefundAmount('');
    };
    
    // 환급 버튼 활성화 조건 체크
    const refundAmountNum = parseInt(refundAmount) || 0;
    const isValidAmount = refundAmountNum >= 100 && refundAmountNum <= availablePoints;
    
    return (
        <div className="points-content">
            
            {/* 포인트 요약 카드 */}
            <section className="points-summary">
                <div className="points-overview-card">
                    <div className="points-main">
                        <h3>사용 가능한 포인트</h3>
                        <div className="points-amount">
                            {(userPoints || userData.usablePoints).toLocaleString()}P
                        </div>
                        <p>총 적립: {userData.totalPoints.toLocaleString()}P</p>
                    </div>
                    <div className="points-actions">
                        <button className="refund-button" onClick={handleRefundClick}>
                            <span className="refund-icon">💳</span>
                            환급받기
                        </button>
                    </div>
                </div>
            </section>

            {/* 포인트 사용 내역 */}
            <section className="point-history">
                <h2 className="section-title">📋 포인트 내역</h2>
                <div className="history-card">
                    <div className="history-list">
                        {currentPointHistory.map(item => (
                            <div key={item.id} className={`history-item ${item.type.toLowerCase()}`}>
                                <div className="history-info">
                                    <div className="history-detail">{item.detail}</div>
                                    <div className="history-meta">
                                        {item.date} • {item.location}
                                    </div>
                                </div>
                                <div className={`history-amount ${item.type.toLowerCase()}`}>
                                    {item.type === 'EARN' || item.type === 'BONUS' ? '+' : ''}{item.amount}P
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 환급 모달 */}
            {showRefundModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>포인트 환급</h3>
                            <button className="modal-close-btn" onClick={handleModalClose}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="refund-info-section">
                                <div className="current-points">
                                    <div className="points-display">
                                        <span className="points-label">보유 포인트</span>
                                        <span className="points-value-large">
                                            {availablePoints.toLocaleString()}P
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="refund-form">
                                    <div className="form-group">
                                        <label className="form-label">환급할 포인트</label>
                                        <div className="input-container">
                                            <input
                                                type="number"
                                                className="refund-input"
                                                placeholder="환급받을 포인트를 입력하세요"
                                                value={refundAmount}
                                                onChange={(e) => setRefundAmount(e.target.value)}
                                                max={availablePoints}
                                                min="100"
                                            />
                                            <span className="input-suffix">P</span>
                                        </div>
                                        <div className="input-info">
                                            <span className="min-amount">최소 100P부터 환급 가능</span>
                                            <button 
                                                type="button" 
                                                className="max-button"
                                                onClick={() => setRefundAmount(availablePoints.toString())}
                                            >
                                                전체
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {refundAmount && refundAmountNum > 0 && (
                                        <div className="refund-preview">
                                            <div className="preview-row">
                                                <span className="preview-label">환급 포인트</span>
                                                <span className="preview-value">
                                                    {refundAmountNum.toLocaleString()}P
                                                </span>
                                            </div>
                                            <div className="preview-row highlight">
                                                <span className="preview-label">환급 금액</span>
                                                <span className="preview-value">
                                                    {refundAmountNum.toLocaleString()}원
                                                </span>
                                            </div>
                                            <div className="preview-row remaining">
                                                <span className="preview-label">남은 포인트</span>
                                                <span className="preview-value">
                                                    {(availablePoints - refundAmountNum).toLocaleString()}P
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="refund-notice">
                                        <div className="notice-item">
                                            📌 환급은 1P = 1원으로 계산됩니다
                                        </div>
                                        <div className="notice-item">
                                            ⏰ 환급 처리까지 2-3일 소요됩니다
                                        </div>
                                        <div className="notice-item">
                                            💳 등록된 계좌로 입금됩니다
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-cancel-btn" onClick={handleModalClose}>
                                취소
                            </button>
                            <button 
                                className={`modal-confirm-btn ${!isValidAmount ? 'disabled' : ''}`}
                                onClick={handleRefundSubmit}
                                disabled={!isValidAmount}
                            >
                                환급 요청
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PointsTab;