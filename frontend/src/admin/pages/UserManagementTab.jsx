import React from 'react';

function UserManagementTab({ memberData, handleMemberStatusChange }) {
    return (
        <div className="members-section">
            <h2>회원 관리</h2>
            
            <div className="members-summary">
                <div className="summary-item">
                    <span className="summary-label">전체 회원</span>
                    <span className="summary-value">{memberData.length}명</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">활성 회원</span>
                    <span className="summary-value">{memberData.filter(m => m.status === 'active').length}명</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">총 보유 포인트</span>
                    <span className="summary-value">{memberData.reduce((sum, m) => sum + m.currentPoints, 0).toLocaleString()}P</span>
                </div>
            </div>

            <div className="members-table">
                <div className="table-header">
                    <span>회원ID</span>
                    <span>이름</span>
                    <span>이메일</span>
                    <span>가입일</span>
                    <span>총 수거량</span>
                    <span>보유 포인트</span>
                    <span>누적 포인트</span>
                    <span>상태</span>
                    <span>관리</span>
                </div>
                {memberData.map(member => (
                    <div key={member.id} className="table-row">
                        <span className="member-id">{member.id}</span>
                        <span className="member-name">{member.name}</span>
                        <span className="member-email">{member.email}</span>
                        <span className="member-date">{member.joinDate}</span>
                        <span className="member-bottles">{member.totalBottles}개</span>
                        <span className="member-points">{member.currentPoints.toLocaleString()}P</span>
                        <span className="member-total-points">{member.totalPoints.toLocaleString()}P</span>
                        <span className={`member-status ${member.status}`}>
                            {member.status === 'active' ? '활성' : '비활성'}
                        </span>
                        <div className="member-actions">
                            <button 
                                className="action-btn"
                                onClick={() => handleMemberStatusChange(
                                    member.id, 
                                    member.status === 'active' ? 'inactive' : 'active'
                                )}
                            >
                                {member.status === 'active' ? '비활성화' : '활성화'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserManagementTab;