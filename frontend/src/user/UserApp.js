// UserApp.js
import React, { useState, useEffect } from 'react';
import UserMyPage from './components/UserMyPage';
import '../App.css';
import PointHistoryList from "./components/PointHistoryList";
//import RefundButton from "./components/RefundButton";

function useCoupon() {
    const [userPoints, setUserPoints] = useState(890); // 초기 포인트
    
    const applyCoupon = (couponId, requiredPoints) => {
        if (userPoints >= requiredPoints) {
            setUserPoints(prev => prev - requiredPoints);
            alert('쿠폰이 발급되었습니다!');
            return true;
        } else {
            alert('포인트가 부족합니다.');
            return false;
        }
    };
    
    return { userPoints, applyCoupon };
}

function UserApp() {
        const { userPoints, applyCoupon } = useCoupon();
    
    // 나중에 IntelliJ와 연결할 데이터들
    const [totalBottles, setTotalBottles] = useState(247); // API에서 받아올 총 페트병 수
    const [pointHistory, setPointHistory] = useState([
        // 나중에 API에서 받아올 포인트 내역
        { id: 1, date: '2024-12-20', type: 'earn', amount: 75, detail: '페트병 15개 투입', location: '강남역점' },
        { id: 2, date: '2024-12-19', type: 'use', amount: -50, detail: '스타벅스 아메리카노', location: '온라인' },
        { id: 3, date: '2024-12-18', type: 'earn', amount: 35, detail: '페트병 7개 투입', location: '홍대점' },
        { id: 4, date: '2024-12-17', type: 'bonus', amount: 20, detail: '첫 이용 보너스', location: '이벤트' },
        { id: 5, date: '2024-12-16', type: 'earn', amount: 60, detail: '페트병 12개 투입', location: '강남역점' }
    ]);
    
    // 나중에 IntelliJ와 연결할 함수들
    const fetchUserData = async () => {
        try {
            // 나중에 실제 API 호출로 변경
            // const response = await fetch('/api/user/bottles');
            // const data = await response.json();
            // setTotalBottles(data.totalBottles);
            
            // const pointResponse = await fetch('/api/user/points/history');
            // const pointData = await pointResponse.json();
            // setPointHistory(pointData);
            
            console.log('API 연결 준비됨 - 총 페트병 수와 포인트 내역');
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        }
    };
    
    useEffect(() => {
        fetchUserData();
    }, []);
    
    const handleBackToMain = () => {
        console.log('메인으로 돌아가기');
        alert('메인 화면으로 돌아갑니다.');
    };

    return (
        <div className="App">
            <UserMyPage 
                phoneNumber="010-1234-5678"
                onBackToMain={handleBackToMain}
                userPoints={userPoints}
                onUseCoupon={applyCoupon}
                totalBottles={totalBottles}
                pointHistory={pointHistory}
            />
        </div>
    );
}
export default UserApp;
