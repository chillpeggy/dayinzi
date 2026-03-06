import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import PCScene from './components/PC/PCScene';
import MobileScene from './components/Mobile/MobileScene';

function Home() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#ffe4e1] via-[#fff0f5] to-[#e0ffff]">
            <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-10 max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-700 shadow-2xl shadow-rose-200/50">
                <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto shadow-xl shadow-rose-200/60 rounded-full overflow-hidden mb-6 flex items-center justify-center border-4 border-white">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-800" style={{ fontFamily: 'serif' }}>大茵子</h1>
                    <p className="text-rose-400 font-medium">✨ 欢迎使用店务管家 ✨</p>
                </div>

                <div className="space-y-4 mt-8">
                    <button onClick={() => navigate('/pc')} className="w-full relative group overflow-hidden rounded-[2rem] p-1 bg-white/60 shadow-xl shadow-rose-100/50 hover:shadow-2xl hover:shadow-rose-200 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative bg-white/80 backdrop-blur-md border border-white group-hover:border-transparent rounded-[1.8rem] p-5 flex items-center gap-4 transition-all duration-300">
                            <div className="bg-rose-50 text-rose-400 group-hover:bg-white/30 p-3 rounded-2xl transition-colors duration-300">💻</div>
                            <div className="text-left">
                                <p className="font-bold text-gray-800 transition-colors duration-300">电脑端管理中心</p>
                                <p className="text-xs text-gray-500 transition-colors duration-300">录入、打码、看报表</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={() => navigate('/mobile')} className="w-full relative group overflow-hidden rounded-[2rem] p-1 bg-white/60 shadow-xl shadow-rose-100/50 hover:shadow-2xl hover:shadow-rose-200 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative bg-white/80 backdrop-blur-md border border-white group-hover:border-transparent rounded-[1.8rem] p-5 flex items-center gap-4 transition-all duration-300">
                            <div className="bg-teal-50 text-teal-500 group-hover:bg-white/30 p-3 rounded-2xl transition-colors duration-300">📱</div>
                            <div className="text-left">
                                <p className="font-bold text-gray-800 transition-colors duration-300">手机端收银台 (iPhone)</p>
                                <p className="text-xs text-gray-500 transition-colors duration-300">扫码、购物车、结账</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div >
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pc/*" element={<PCScene />} />
                <Route path="/mobile/*" element={<MobileScene />} />
            </Routes>
        </Router>
    );
}

export default App;
