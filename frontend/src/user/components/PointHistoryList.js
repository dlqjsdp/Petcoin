import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PointHistoryList() {
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [availablePoints, setAvailablePoints] = useState(0);
    const [refundAmount, setRefundAmount] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountHolder, setAccountHolder] = useState("");

    const refundAmountNum = Number(refundAmount);
    const isValidAmount =
        refundAmountNum >= 2000 &&
        refundAmountNum <= availablePoints &&
        bankName.trim() !== "" &&
        accountNumber.trim() !== "" &&
        accountHolder.trim() !== "";

    const handleRefundClick = () => {
        setAvailablePoints(lastPointBalance);
        setShowRefundModal(true);
    };
    const handleModalClose = () => {
        setShowRefundModal(false);
        setRefundAmount("");
    };
    const handleRefundSubmit = () => {
        if (!isValidAmount) return;

        const token = localStorage.getItem("accessToken");

        const requestData = {
            requestAmount: refundAmountNum,
            bankName: bankName.trim(),
            accountNumber: accountNumber.trim(),
            accountHolder: accountHolder.trim()
        };

        axios.post(
            "http://localhost:8080/api/mypage/pointrefund",
            requestData,
            { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        )
            .then(res => {
                alert("환급 요청이 완료되었습니다!");
                setShowRefundModal(false);

                
                /* 환급 요청 후 UI 상태 */
                //전체 포인트(lastPointBalance)는 환급 승인 전이기 때문에 그대로 유지
                setAvailablePoints(prev => prev - refundAmountNum);         //사용 가능한 포인트 감소
                setPendingRefundPoints(prev => prev + refundAmountNum);     //환급 요청한 포인트 증가

                //입력창 초기화
                setRefundAmount("");
                setBankName("");
                setAccountNumber("");
                setAccountHolder("");
            })
            .catch(err => {
                console.error("환급 요청 실패:", err);
                alert("환급 요청 실패, 다시 시도해주세요.");
            });
    };

    const [pointHistory, setPointHistory] = useState([]);
    const [lastPointBalance, setLastPointBalance] = useState(0);
    const [pendingRefundPoints, setPendingRefundPoints] = useState(0);

    // 페이지 관련 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10); // 한 페이지에 표시할 항목 수

    // 전체 데이터 가져오기
    useEffect(() => {
        fetchPointHistory();
    }, []);

    const fetchPointHistory = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        axios.get(`http://localhost:8080/api/mypage/pointhistory`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
            .then(res => {
                // 최신순 정렬
                const sorted = (res.data.pointHistory || []).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setPointHistory(sorted);
                setLastPointBalance(res.data.lastPointBalance || 0);
                setPendingRefundPoints(res.data.pendingRefund || 0);
                setAvailablePoints(res.data.availablePoint || 0);
            })
            .catch(err => {
                console.error("마이페이지 호출 에러:", err);
            });
    };

    // 현재 페이지 데이터 계산
    const startIdx = currentPage * pageSize;
    const endIdx = startIdx + pageSize;
    const currentPageData = pointHistory.slice(startIdx, endIdx);

    const totalPages = Math.ceil(pointHistory.length / pageSize);

    return (
        <div className="points-content">

            {/* 포인트 요약 카드 */}
            <section className="points-summary">
                <div className="points-overview-card">
                    <div className="points-main">
                        <div className="point-item">
                            <h3>전체 포인트</h3>
                            <div className="points-amount">{lastPointBalance}</div>
                        </div>
                        <div className="point-item">
                            <h3>환급 요청한 포인트</h3>
                            <div className="points-amount">{pendingRefundPoints}</div>
                        </div>
                        <div className="point-item">
                            <h3>사용 가능한 포인트</h3>
                            <div className="points-amount">{availablePoints}</div>
                        </div>
                    </div>
                    <div className="points-actions">
                        <button className="refund-button" onClick={handleRefundClick}>
                            <span className="refund-icon">💳</span>
                            환급받기
                        </button>
                    </div>
                </div>
            </section>

            {/* 포인트 내역 */}
            <section className="point-history">
                <h2 className="section-title">📋 포인트 내역</h2>
                <div className="history-card">
                    <div className="history-list">
                        {currentPageData.map(pHistory => (
                            <div key={pHistory.historyId} className={`history-item ${pHistory.actionType.toLowerCase()}`}>
                                <div className="history-info">
                                    <div className="history-detail">{pHistory.description}</div>
                                    <div className="history-meta">{pHistory.createdAt} • {pHistory.location}</div>
                                </div>
                                <div className={`history-amount ${pHistory.actionType.toLowerCase()}`}>
                                    {pHistory.type === 'EARN'? '+' : ''}{pHistory.pointChange}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 페이지 버튼 */}
            <div className="d-flex justify-content-center mt-3">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`page-btn ${i === currentPage ? "active" : ""}`}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* 환급 모달 */}
            {showRefundModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>포인트 환급</h3>
                            <button className="modal-close-btn" onClick={handleModalClose}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="refund-info-section">
                                <div className="current-points">
                                    <div className="points-display">
                                        <span className="points-label">보유 포인트</span>
                                        <span className="points-value-large">{availablePoints.toLocaleString()}P</span>
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
                                            <span className="min-amount">최소 2000P부터 환급 가능</span>
                                            <button type="button" className="max-button"
                                                onClick={() => setRefundAmount(availablePoints.toString())}>
                                                전체
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">은행명</label>
                                        <input type="text" className="refund-input" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="은행명을 입력하세요"/>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">계좌번호</label>
                                        <input type="text" className="refund-input" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="계좌번호를 입력하세요"/>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">예금주명</label>
                                        <input type="text" className="refund-input" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="예금주명을 입력하세요"/>
                                    </div>

                                    {refundAmount && refundAmountNum > 0 && (
                                        <div className="refund-preview">
                                            <div className="preview-row">
                                                <span className="preview-label">환급 포인트</span>
                                                <span className="preview-value">{refundAmountNum.toLocaleString()}P</span>
                                            </div>
                                            <div className="preview-row highlight">
                                                <span className="preview-label">환급 금액</span>
                                                <span className="preview-value">{refundAmountNum.toLocaleString()}원</span>
                                            </div>
                                            <div className="preview-row remaining">
                                                <span className="preview-label">남은 포인트</span>
                                                <span className="preview-value">{(availablePoints - refundAmountNum).toLocaleString()}P</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="refund-notice">
                                        <div className="notice-item">📌 환급은 1P = 1원으로 계산됩니다</div>
                                        <div className="notice-item">⏰ 환급 처리까지 2-3일 소요됩니다</div>
                                        <div className="notice-item">💳 등록된 계좌로 입금됩니다</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="modal-cancel-btn" onClick={handleModalClose}>취소</button>
                            <button className={`modal-confirm-btn ${!isValidAmount ? 'disabled' : ''}`}
                                onClick={handleRefundSubmit} disabled={!isValidAmount}>
                                환급 요청
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PointHistoryList;
