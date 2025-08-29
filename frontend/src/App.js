import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './mainpages/components/MainPage';
import NoticePage from './mainpages/components/NoticePage';
import LoginPage from './mainpages/components/LoginPage';  // Login.js 파일
import SignupPage from './mainpages/components/SignupPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;