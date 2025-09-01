/*
 * App.js
 * - 프로젝트 최상위 라우팅 설정
 * - React Router v6 기준으로 작성
 *
 * 주요 기능:
 *   - "/" → 사용자용 메인 홈페이지(UserApp)
 *   - "/admin/*" → 관리자 전용(AdminApp)
 *   - "/kiosk/*" → 키오스크 전용(KioskApp, iPad 접속용)
 *
 * @fileName : App.js
 * @author : yukyeong
 * @since : 250901
 * @history
 *   - 250901 | yukyeong | 최초 생성 및 라우팅 구조 설정 - UserApp, AdminApp, KioskApp 경로 분리
 *   - 250901 | yukyeong | 관리자 경로에 path="/admin/*" 와일드카드 추가 - 하위 라우트 처리 가능하도록 수정
 *   - 250901 | yukyeong | 키오스크 전용 경로(/kiosk/*) 추가 - iPad 접속 시 별도 화면 렌더링 지원
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 영역별 App (각 하위 라우트를 내부에서 관리)
import UserApp from "./user/UserApp";
import AdminApp from "./admin/AdminApp";
import KioskApp from "./kiosk/KioskApp";

function App() {

  return (
    <Routes>
      <Route path="/" element={<UserApp />} /> {/* "/" → 사용자용 메인 홈페이지 */}
      <Route path="/admin/*" element={<AdminApp />} /> {/* "/admin/*" → 관리자 페이지 */}
      <Route path="/kiosk/*" element={<KioskApp />} /> {/* "/kiosk/*" → 키오스크 전용 영역 */}
    </Routes>
  );
}

export default App;
