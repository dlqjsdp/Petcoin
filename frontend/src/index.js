/*
 * index.js
 * - React 애플리케이션의 진입점(entry point)
 * - index.html의 <div id="root"></div>를 ReactDOM이 찾아서 App 컴포넌트를 마운트
 *
 * 주요 기능:
 *   - ReactDOM.createRoot()로 루트 컨테이너 생성
 *   - BrowserRouter로 <App/>을 감싸 라우팅 기능 활성화
 *
 * @fileName: index.js
 * @author  : yukyeong
 * @since   : 250901
 * @history
 *   - 250901 | yukyeong | App 컴포넌트를 BrowserRouter로 감싸 라우팅 기능 활성화
 * 
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

// React 애플리케이션 렌더링
// BrowserRouter로 App을 감싸서, App 내부에서 라우팅 기능을 사용할 수 있게 함
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);