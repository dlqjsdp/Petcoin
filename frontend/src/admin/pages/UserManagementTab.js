import React from 'react';

/*
 * 회원 관리 페이지
 *
 * @author  : sehui
 * @fileName: UserManagementTab.js
 * @since   : 250909
 * @history
 *   - 250909 | sehui | Controller에서 넘겨주는 DTO 값에 맞게 <span> 값 변경
 */


function UserManagementTab({ memberData, pageInfo, handleMemberStatusChange }) {

    return (
        <div className="members-section">
            <h2>회원 관리</h2>
            
            <div className="members-summary">
                <div className="summary-item">
                    <span className="summary-label">전체 회원</span>
                    <span className="summary-value totalMember">{memberData.length}명</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">활성 회원</span>
                    <span className="summary-value activeMember">{memberData.filter(m => m.status === 'active').length}명</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">총 보유 포인트</span>
                    <span className="summary-value totalPoints">{memberData.reduce((sum, m) => sum + m.currentPoint, 0)}P</span>
                </div>
            </div>

            <div className="members-table">
                <div className="table-header">
                    <span>회원ID</span>
                    <span>권한</span>
                    <span>휴대폰 번호</span>
                    <span>가입일</span>
                    <span>총 수거량</span>
                    <span>보유 포인트</span>
                    <span>누적 포인트</span>
                    <span>상태</span>
                    <span>관리</span>
                </div>
                {memberData.map(member => (
                    <div key={member.memberId} className="table-row">
                        <span className="member-id">{member.memberId}</span>
                        <span className="member-name">{member.role}</span>
                        <span className="member-email">{member.phone}</span>
                        <span className="member-date">{member.createdAt ? member.createdAt.split('T')[0] : ''}</span>
                        <span className="member-bottles">{member.totalCollections}개</span>
                        <span className="member-points">{member.currentPoint}P</span>
                        <span className="member-total-points">{member.totalPoints}P</span>
                        <span className={`member-status ${member.status}`}>
                            {member.status === 'active' ? '활성' : '비활성'}
                        </span>
                        <div className="member-actions">
                            <button 
                                className="action-btn"
                                onClick={() => handleMemberStatusChange(
                                    member.memberId, 
                                    member.status === 'active' ? 'inactive' : 'active'
                                )}
                            >
                                {member.status === 'active' ? '비활성화' : '활성화'}
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* 페이지네이션 */}
                <div className="board-pagination">
                    <button className="page-btn" disabled={!pageInfo?.prev}>이전</button>
                        <span className="page-info">
                            {pageInfo 
                            ? `${pageInfo.pageNum} / ${Math.ceil(pageInfo.total / pageInfo.amount)}`
                            : "1 / 1"}
                        </span>
                    <button className="page-btn" disabled={!pageInfo?.next}>다음</button>
                </div>
            </div>
        </div>
    );
}

export default UserManagementTab;