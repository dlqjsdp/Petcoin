// Logout.js
import '../styles/Logout.css';
import { useNavigate } from "react-router-dom";
import { logout } from '../../api/auth';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
    logout();          // 토큰 삭제 + axios 헤더 초기화
    navigate('/');      // 홈 화면으로 이동
    };

    return (
        <button onClick={handleLogout} className="logout-btn">
            로그아웃
        </button>
    );
};

export default LogoutButton;
