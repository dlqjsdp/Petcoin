import React, { useState } from 'react';

function DisposalHistoryTab({ disposalHistoryData }) {
    // 모달 상태 관리
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // 모달 관련 핸들러
    const openDetailModal = (record) => {
        setSelectedRecord(record);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedRecord(null);
    };

    return (
        <div className="cupholder-content">
            <section className="cupholder-history">
                <h2 className="section-title">분리배출 내역</h2>
                <div className="board-container">
                    <div className="board-table">
                        <div className="board-header">
                            <div className="board-col col-no">번호</div>
                            <div className="board-col col-location">키오스크명</div>
                            <div className="board-col col-date">날짜</div>
                            <div className="board-col col-items">투입 품목</div>
                            <div className="board-col col-points">획득 포인트</div>
                        </div>
                        <div className="board-body">
                            {disposalHistoryData.map((record, index) => (
                                <div key={record.id} className="board-row" onClick={() => openDetailModal(record)}>
                                    <div className="board-col col-no">{disposalHistoryData.length - index}</div>
                                    <div className="board-col col-location">
                                        <span className="location-name">{record.kioskName}</span>
                                    </div>
                                    <div className="board-col col-date">{record.date}</div>
                                    <div className="board-col col-items">
                                        <div className="items-summary">
                                            {record.items.map((item, itemIndex) => (
                                                <span key={itemIndex} className="item-tag">
                                                    {item.type} {item.count}개
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="board-col col-points">
                                        <span className="points-value">+{record.totalPoints}P</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 분리배출 상세보기 모달 */}
            {isDetailModalOpen && selectedRecord && (
                <div className="modal-overlay" onClick={closeDetailModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>분리배출 상세 내역</h3>
                            <button className="modal-close-btn" onClick={closeDetailModal}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="detail-info-section">
                                <div className="detail-row">
                                    <span className="detail-label">키오스크명:</span>
                                    <span className="detail-value">{selectedRecord.kioskName}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">날짜:</span>
                                    <span className="detail-value">{selectedRecord.date}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">주소:</span>
                                    <span className="detail-value">{selectedRecord.location}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">총 획득 포인트:</span>
                                    <span className="detail-value highlight">+{selectedRecord.totalPoints}P</span>
                                </div>
                            </div>
                            
                            <div className="detail-items-section">
                                <h4>투입 품목 상세</h4>
                                <div className="detail-items-list">
                                    {selectedRecord.items.map((item, index) => (
                                        <div key={index} className="detail-item-row">
                                            <div className="item-info">
                                                <span className="item-name">{item.type}</span>
                                                <span className="item-quantity">{item.count}개</span>
                                            </div>
                                            <span className="item-points">+{item.points}P</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button className="modal-confirm-btn" onClick={closeDetailModal}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DisposalHistoryTab;