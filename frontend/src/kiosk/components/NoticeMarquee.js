import React, { useState, useEffect } from 'react';

function NoticeMarquee({ notices = [], isVisible = true, speed = 50 }) {
    const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
    const [displayedNotices, setDisplayedNotices] = useState([]);

    // 게시중이고 중요한 공지사항만 필터링
    useEffect(() => {
        const activeNotices = notices.filter(notice => 
            notice.status === 'published' && notice.isImportant
        );
        setDisplayedNotices(activeNotices);
        setCurrentNoticeIndex(0);
    }, [notices]);

    // 공지사항 자동 순환
    useEffect(() => {
        if (displayedNotices.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentNoticeIndex(prev => 
                prev >= displayedNotices.length - 1 ? 0 : prev + 1
            );
        }, 8000); // 8초마다 다음 공지사항으로 변경

        return () => clearInterval(interval);
    }, [displayedNotices.length]);

    if (!isVisible || displayedNotices.length === 0) {
        return null;
    }

    const currentNotice = displayedNotices[currentNoticeIndex];

    return (
        <div className="notice-marquee">
            <div className="marquee-container">
                <div className="notice-icon">
                    <span className="icon">📢</span>
                    <span className="label">공지</span>
                </div>
                <div className="marquee-content">
                    <div 
                        className="marquee-text"
                        style={{
                            animationDuration: `${Math.max(currentNotice?.title.length * 0.3, 10)}s`
                        }}
                    >
                        {currentNotice?.title}
                    </div>
                </div>
                {displayedNotices.length > 1 && (
                    <div className="notice-indicator">
                        <span>{currentNoticeIndex + 1}/{displayedNotices.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NoticeMarquee;