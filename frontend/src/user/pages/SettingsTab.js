import React, { useState } from 'react';

function SettingsTab({ userData, phoneNumber, notifications, handleNotificationChange }) {
    // 개인정보 상태 관리
    const [personalInfo, setPersonalInfo] = useState({
        name: userData.name,
        phone: phoneNumber,
        email: userData.email,
        accountNumber: '',
        bank: '',
        recipientName: ''
    });

    // 저장 상태 관리
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // 개인정보 입력 핸들러
    const handlePersonalInfoChange = (field, value) => {
        setPersonalInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 저장 버튼 핸들러
    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            // 실제 API 호출 시뮬레이션 (2초 지연)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 여기에 실제 API 호출 로직 추가
            console.log('저장할 개인정보:', personalInfo);
            
            setSaveMessage('개인정보가 성공적으로 저장되었습니다.');
            
            // 3초 후 메시지 제거
            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
            
        } catch (error) {
            setSaveMessage('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSaving(false);
        }
    };

    // 필수 필드 검증
    const isFormValid = personalInfo.name && personalInfo.phone && personalInfo.email;

    return (
        <div className="settings-content">
            <div className="settings-grid">
                {/* 개인 정보 설정 */}
                <section className="personal-info">
                    <h2 className="section-title">👤 개인 정보</h2>
                    <div className="settings-card">
                        <div className="info-items">
                            <div className="info-item">
                                <label className="info-label">이름 *</label>
                                <input 
                                    type="text" 
                                    className="info-input" 
                                    value={personalInfo.name}
                                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                                />
                            </div>
                            
                            <div className="info-item">
                                <label className="info-label">전화번호 *</label>
                                <input 
                                    type="text" 
                                    className="info-input" 
                                    value={personalInfo.phone}
                                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                                />
                            </div>
                            
                            <div className="info-item">
                                <label className="info-label">이메일 *</label>
                                <input 
                                    type="email" 
                                    className="info-input" 
                                    value={personalInfo.email}
                                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                                />
                            </div>

                            <div className="info-row">
                                <div className="info-item">
                                    <label className="info-label">계좌번호</label>
                                    <input 
                                        type="text" 
                                        className="info-input" 
                                        placeholder="계좌번호를 입력하세요"
                                        value={personalInfo.accountNumber}
                                        onChange={(e) => handlePersonalInfoChange('accountNumber', e.target.value)}
                                    />
                                </div>

                                <div className="info-item">
                                    <label className="info-label">은행</label>
                                    <select 
                                        className="info-input"
                                        value={personalInfo.bank}
                                        onChange={(e) => handlePersonalInfoChange('bank', e.target.value)}
                                    >
                                        <option value="">은행 선택</option>
                                        <option value="국민은행">국민은행</option>
                                        <option value="신한은행">신한은행</option>
                                        <option value="우리은행">우리은행</option>
                                        <option value="하나은행">하나은행</option>
                                        <option value="기업은행">기업은행</option>
                                        <option value="농협은행">농협은행</option>
                                        <option value="카카오뱅크">카카오뱅크</option>
                                        <option value="토스뱅크">토스뱅크</option>
                                    </select>
                                </div>
                            </div>

                            <div className="info-item">
                                <label className="info-label">수령자명</label>
                                <input 
                                    type="text" 
                                    className="info-input" 
                                    placeholder="수령자명을 입력하세요"
                                    value={personalInfo.recipientName}
                                    onChange={(e) => handlePersonalInfoChange('recipientName', e.target.value)}
                                />
                            </div>



                            {/* 저장 메시지 */}
                            {saveMessage && (
                                <div className={`save-message ${saveMessage.includes('성공') ? 'success' : 'error'}`}>
                                    {saveMessage}
                                </div>
                            )}

                            {/* 저장 버튼 */}
                            <div className="save-button-container">
                                <button 
                                    className={`save-button ${!isFormValid ? 'disabled' : ''}`}
                                    onClick={handleSave}
                                    disabled={!isFormValid || isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            저장 중...
                                        </>
                                    ) : (
                                        <>
                                            💾 개인정보 저장
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 알림 설정 */}
                <section className="notification-settings">
                    <h2 className="section-title">🔔 알림 설정</h2>
                    <div className="settings-card">
                        <div className="notification-items">
                            <div className="notification-item">
                                <div className="notification-info">
                                    <label className="notification-label">새 키오스크 알림</label>
                                    <p className="notification-desc">근처에 새로운 키오스크가 생기면 알려드려요</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={notifications.newKiosk}
                                        onChange={(e) => handleNotificationChange('newKiosk', e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div className="notification-item">
                                <div className="notification-info">
                                    <label className="notification-label">포인트 만료 알림</label>
                                    <p className="notification-desc">포인트 만료 전에 미리 알려드려요</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={notifications.pointExpiry}
                                        onChange={(e) => handleNotificationChange('pointExpiry', e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div className="notification-item">
                                <div className="notification-info">
                                    <label className="notification-label">포인트 임계치 알림 (MYP_003)</label>
                                    <p className="notification-desc">일정 포인트 이상이 되면 알려드려요</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={notifications.pointThreshold}
                                        onChange={(e) => handleNotificationChange('pointThreshold', e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div className="notification-item">
                                <div className="notification-info">
                                    <label className="notification-label">친구 활동 알림</label>
                                    <p className="notification-desc">친구들의 환경 활동을 알려드려요</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={notifications.friendActivity}
                                        onChange={(e) => handleNotificationChange('friendActivity', e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            
                            <div className="notification-item">
                                <div className="notification-info">
                                    <label className="notification-label">이벤트 소식</label>
                                    <p className="notification-desc">새로운 이벤트와 혜택 소식을 받아보세요</p>
                                </div>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={notifications.eventNews}
                                        onChange={(e) => handleNotificationChange('eventNews', e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SettingsTab;