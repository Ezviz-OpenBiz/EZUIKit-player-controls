import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import './index.css';

import Home from './pages/Home';
import DatePickerDemo from './pages/DatePickerDemo';
import PtzDemo from './pages/PtzDemo';
import AIChatDemo from './pages/AIChatDemo';
import TalkDemo from './pages/TalkDemo';
import TimeLineDemo from './pages/TimeLineDemo';
import ZoomDemo from './pages/ZoomDemo';
import BroadcastDemo from './pages/BroadcastDemo';

function App() {
  return (
    <HashRouter>
      <div className="app">
        <nav className="sidebar">
          <h3>EZUIKit Controls</h3>
          <NavLink to="/">首页</NavLink>
          <NavLink to="/date-picker">DatePicker 日期选择</NavLink>
          <NavLink to="/ptz">Ptz 云台控制</NavLink>
          <NavLink to="/aichat">AIChat AI对话</NavLink>
          <NavLink to="/talk">Talk 对讲</NavLink>
          <NavLink to="/time-line">TimeLine 时间轴</NavLink>
          <NavLink to="/zoom">Zoom 缩放</NavLink>
          <NavLink to="/broadcast">Broadcast 云广播</NavLink>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/date-picker" element={<DatePickerDemo />} />
            <Route path="/ptz" element={<PtzDemo />} />
            <Route path="/aichat" element={<AIChatDemo />} />
            <Route path="/talk" element={<TalkDemo />} />
            <Route path="/time-line" element={<TimeLineDemo />} />
            <Route path="/zoom" element={<ZoomDemo />} />
            <Route path="/broadcast" element={<BroadcastDemo />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
