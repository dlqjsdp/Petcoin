import React, { useState } from 'react';

function NoticeTab({
    noticeData,
    onNoticeCreate,
    onNoticeUpdate,
    onNoticeDelete,
    onNoticeStatusChange,
    onNoticeViewIncrease
}) {
    // ========== 상태 관리 ==========
    const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'detail'
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [noticesPerPage] = useState(10);

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '시스템',
        isImportant: false
    });

    // ========== 필터링 및 검색 ==========
    const getFilteredNotices = () => {
        let filtered = noticeData;

        // 검색어 필터링
        if (searchTerm) {
            filtered = filtered.filter(notice =>
                notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notice.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 카테고리 필터링
        if (filterCategory !== 'all') {
            filtered = filtered.filter(notice => notice.category === filterCategory);
        }

        // 상태 필터링
        if (filterStatus !== 'all') {
            filtered = filtered.filter(notice => notice.status === filterStatus);
        }

        return filtered.sort((a, b) => {
            // 중요 공지를 먼저 정렬, 그 다음 생성일자 순
            if (a.isImportant && !b.isImportant) return -1;
            if (!a.isImportant && b.isImportant) return 1;
            return new Date(b.createdDate) - new Date(a.createdDate);
        });
    };

    // 페이지네이션
    const filteredNotices = getFilteredNotices();
    const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);
    const currentNotices = filteredNotices.slice(
        (currentPage - 1) * noticesPerPage,
        currentPage * noticesPerPage
    );

    // ========== 이벤트 핸들러 ==========
    const handleCreateNotice = () => {
        setCurrentView('create');
        setFormData({
            title: '',
            content: '',
            category: '시스템',
            isImportant: false
        });
    };

    const handleEditNotice = (notice) => {
        setSelectedNotice(notice);
        setFormData({
            title: notice.title,
            content: notice.content,
            category: notice.category,
            isImportant: notice.isImportant
        });
        setCurrentView('edit');
    };

    const handleViewNotice = (notice) => {
        setSelectedNotice(notice);
        onNoticeViewIncrease(notice.id);
        setCurrentView('detail');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        if (currentView === 'create') {
            onNoticeCreate(formData);
            alert('공지사항이 등록되었습니다.');
        } else if (currentView === 'edit') {
            onNoticeUpdate(selectedNotice.id, formData);
            alert('공지사항이 수정되었습니다.');
        }

        setCurrentView('list');
        setFormData({
            title: '',
            content: '',
            category: '시스템',
            isImportant: false
        });
        setSelectedNotice(null);
    };

    const handleDeleteNotice = (noticeId) => {
        if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
            onNoticeDelete(noticeId);
            alert('공지사항이 삭제되었습니다.');
            if (currentView === 'detail' || currentView === 'edit') {
                setCurrentView('list');
            }
        }
    };

    const handleStatusChange = (noticeId, newStatus) => {
        onNoticeStatusChange(noticeId, newStatus);
        alert(`공지사항 상태가 ${newStatus === 'published' ? '게시' : '숨김'}로 변경되었습니다.`);
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedNotice(null);
        setFormData({
            title: '',
            content: '',
            category: '시스템',
            isImportant: false
        });
    };

    // ========== 렌더링 함수들 ==========
    
    // 공지사항 목록 보기
    const renderNoticeList = () => (
        <div className="notice-section">
            <div className="notice-header">
                <div className="notice-title-section">
                    <h2>공지사항 관리</h2>
                    <p>시스템 공지사항을 등록, 수정, 삭제할 수 있습니다.</p>
                </div>
                <button className="create-notice-btn" onClick={handleCreateNotice}>
                    ✏️ 공지사항 등록
                </button>
            </div>

            {/* 통계 요약 */}
            <div className="notice-summary">
                <div className="summary-item-notice">
                    <span className="summary-label">전체 공지</span>
                    <span className="summary-value total">{noticeData.length}</span>
                </div>
                <div className="summary-item-notice">
                    <span className="summary-label">게시중</span>
                    <span className="summary-value published">
                        {noticeData.filter(n => n.status === 'published').length}
                    </span>
                </div>
                <div className="summary-item-notice">
                    <span className="summary-label">중요 공지</span>
                    <span className="summary-value important">
                        {noticeData.filter(n => n.isImportant).length}
                    </span>
                </div>
                <div className="summary-item-notice">
                    <span className="summary-label">총 조회수</span>
                    <span className="summary-value views">
                        {noticeData.reduce((sum, n) => sum + n.views, 0)}
                    </span>
                </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="notice-controls">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="제목, 내용으로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-section">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">전체 카테고리</option>
                        <option value="시스템">시스템</option>
                        <option value="서비스">서비스</option>
                        <option value="정책">정책</option>
                        <option value="기타">기타</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">전체 상태</option>
                        <option value="published">게시중</option>
                        <option value="draft">임시저장</option>
                        <option value="hidden">숨김</option>
                    </select>
                </div>
            </div>

            {/* 공지사항 테이블 */}
            <div className="notice-table">
                <div className="notice-table-header">
                    <span>번호</span>
                    <span>카테고리</span>
                    <span>제목</span>
                    <span>작성일</span>
                    <span>조회수</span>
                    <span>상태</span>
                    <span>관리</span>
                </div>
                <div className="notice-table-body">
                    {currentNotices.length > 0 ? (
                        currentNotices.map((notice, index) => (
                            <div key={notice.id} className={`notice-row ${notice.isImportant ? 'important' : ''}`}>
                                <span className="notice-no">
                                    {filteredNotices.length - ((currentPage - 1) * noticesPerPage + index)}
                                </span>
                                <span className="notice-category">
                                    <span className={`category-badge ${notice.category}`}>
                                        {notice.category}
                                    </span>
                                </span>
                                <span className="notice-title-cell" onClick={() => handleViewNotice(notice)}>
                                    {notice.isImportant && <span className="important-icon">📌</span>}
                                    <span className="title-text">{notice.title}</span>
                                </span>
                                <span className="notice-date">
                                    {new Date(notice.createdDate).toLocaleDateString('ko-KR')}
                                </span>
                                <span className="notice-views">{notice.views}</span>
                                <span className="notice-status-cell">
                                    <span className={`status-badge-notice ${notice.status}`}>
                                        {notice.status === 'published' ? '게시중' : notice.status === 'draft' ? '임시저장' : '숨김'}
                                    </span>
                                </span>
                                <span className="notice-actions">
                                    <button 
                                        className="action-btn-small edit" 
                                        onClick={() => handleEditNotice(notice)}
                                    >
                                        수정
                                    </button>
                                    <button 
                                        className={`action-btn-small ${notice.status === 'published' ? 'hide' : 'show'}`}
                                        onClick={() => handleStatusChange(notice.id, notice.status === 'published' ? 'hidden' : 'published')}
                                    >
                                        {notice.status === 'published' ? '숨김' : '게시'}
                                    </button>
                                    <button 
                                        className="action-btn-small delete" 
                                        onClick={() => handleDeleteNotice(notice.id)}
                                    >
                                        삭제
                                    </button>
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <p>공지사항이 없습니다</p>
                            <small>새로운 공지사항을 등록해보세요</small>
                        </div>
                    )}
                </div>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="notice-pagination">
                    <button 
                        className="page-btn" 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        이전
                    </button>
                    <span className="page-info">
                        {currentPage} / {totalPages}
                    </span>
                    <button 
                        className="page-btn" 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );

    // 공지사항 상세 보기
    const renderNoticeDetail = () => (
        <div className="notice-detail-section">
            <div className="notice-detail-header">
                <button className="back-btn" onClick={handleBackToList}>
                    ← 목록으로
                </button>
                <div className="detail-actions">
                    <button 
                        className="action-btn edit" 
                        onClick={() => handleEditNotice(selectedNotice)}
                    >
                        수정
                    </button>
                    <button 
                        className="action-btn delete" 
                        onClick={() => handleDeleteNotice(selectedNotice.id)}
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="notice-detail-content">
                <div className="detail-title-section">
                    <div className="title-row">
                        {selectedNotice.isImportant && <span className="important-badge">중요</span>}
                        <h2 className="detail-title">{selectedNotice.title}</h2>
                    </div>
                    <div className="detail-meta">
                        <span className="meta-item">
                            <span className="meta-label">카테고리:</span>
                            <span className={`category-badge ${selectedNotice.category}`}>
                                {selectedNotice.category}
                            </span>
                        </span>
                        <span className="meta-item">
                            <span className="meta-label">작성일:</span>
                            <span>{selectedNotice.createdDate}</span>
                        </span>
                        <span className="meta-item">
                            <span className="meta-label">수정일:</span>
                            <span>{selectedNotice.updatedDate}</span>
                        </span>
                        <span className="meta-item">
                            <span className="meta-label">조회수:</span>
                            <span>{selectedNotice.views}</span>
                        </span>
                        <span className="meta-item">
                            <span className="meta-label">상태:</span>
                            <span className={`status-badge-notice ${selectedNotice.status}`}>
                                {selectedNotice.status === 'published' ? '게시중' : selectedNotice.status === 'draft' ? '임시저장' : '숨김'}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="detail-content">
                    <div className="content-body">
                        {selectedNotice.content.split('\n').map((line, index) => (
                            <p key={index}>{line || <br />}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // 공지사항 등록/수정 폼
    const renderNoticeForm = () => (
        <div className="notice-form-section">
            <div className="notice-form-header">
                <button className="back-btn" onClick={handleBackToList}>
                    ← 목록으로
                </button>
                <h2>{currentView === 'create' ? '공지사항 등록' : '공지사항 수정'}</h2>
            </div>

            <form className="notice-form" onSubmit={handleFormSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category">카테고리</label>
                        <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="form-select"
                        >
                            <option value="시스템">시스템</option>
                            <option value="서비스">서비스</option>
                            <option value="정책">정책</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.isImportant}
                                onChange={(e) => setFormData({...formData, isImportant: e.target.checked})}
                            />
                            <span className="checkbox-text">중요 공지</span>
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="title">제목 *</label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="form-input"
                        placeholder="공지사항 제목을 입력하세요"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">내용 *</label>
                    <textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="form-textarea"
                        placeholder="공지사항 내용을 입력하세요"
                        rows={15}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleBackToList}>
                        취소
                    </button>
                    <button type="submit" className="btn-submit">
                        {currentView === 'create' ? '등록' : '수정'} 완료
                    </button>
                </div>
            </form>
        </div>
    );

    // ========== 메인 렌더링 ==========
    return (
        <div className="notice-tab">
            {currentView === 'list' && renderNoticeList()}
            {currentView === 'detail' && renderNoticeDetail()}
            {(currentView === 'create' || currentView === 'edit') && renderNoticeForm()}
        </div>
    );
}

export default NoticeTab;