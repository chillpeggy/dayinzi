import React, { useState, useEffect } from 'react';
import { fetchPendingPrintJobs, completePrintJob } from '../../github';
import Scanner from './Scanner';
import Cart from './Cart';
import { ChevronLeft, BarChart3, Printer } from 'lucide-react';

type ViewMode = 'menu' | 'scan' | 'cart' | 'dashboard' | 'print';

// Decorative sakura petal positions (fixed in background)
const Petals = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top-left cluster */}
        <div className="absolute top-8 left-6 text-4xl opacity-20 rotate-[-20deg] select-none">🌸</div>
        <div className="absolute top-20 left-2 text-2xl opacity-15 rotate-[10deg] select-none">✿</div>
        <div className="absolute top-4 left-20 text-xl opacity-10 rotate-[30deg] select-none">🌺</div>
        {/* Top-right cluster */}
        <div className="absolute top-10 right-6 text-3xl opacity-15 rotate-[20deg] select-none">🌸</div>
        <div className="absolute top-28 right-2 text-2xl opacity-10 rotate-[-15deg] select-none">✿</div>
        {/* Mid scattered */}
        <div className="absolute top-[38%] left-3 text-2xl opacity-10 rotate-[5deg] select-none">🌸</div>
        <div className="absolute top-[45%] right-4 text-xl opacity-10 rotate-[-25deg] select-none">✿</div>
        {/* Bottom cluster */}
        <div className="absolute bottom-20 left-8 text-3xl opacity-15 rotate-[12deg] select-none">🌸</div>
        <div className="absolute bottom-12 right-10 text-2xl opacity-10 rotate-[-8deg] select-none">🌺</div>
        <div className="absolute bottom-4 left-1/2 text-xl opacity-10 rotate-[20deg] select-none">✿</div>

        {/* Soft blob glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-rose-200/30 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-56 h-56 rounded-full bg-purple-200/20 blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-pink-100/30 blur-3xl"></div>
    </div>
);

// Rich icon components with gradient backgrounds
const CheckoutIcon = () => (
    <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center relative flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #FFE0EC 0%, #FFAEC9 100%)', boxShadow: '0 6px 16px rgba(255,150,180,0.45), inset 0 1px 2px rgba(255,255,255,0.85)' }}>
        <div className="absolute inset-1.5 rounded-[0.8rem] border-[1.5px] border-dashed border-white/60"></div>
        {/* Custom scan frame icon */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M4 10V6a2 2 0 012-2h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M26 4h4a2 2 0 012 2v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 26v4a2 2 0 01-2 2h-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M10 32H6a2 2 0 01-2-2v-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="4" y1="18" x2="32" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="13" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="11" x2="18" y2="25" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="14" x2="24" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </div>
);

const ReportIcon = () => (
    <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center relative flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #FFF3D0 0%, #FFD980 100%)', boxShadow: '0 6px 16px rgba(255,200,80,0.45), inset 0 1px 2px rgba(255,255,255,0.85)' }}>
        {/* Bar chart with gold sparkle */}
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <rect x="4" y="20" width="8" height="14" rx="2" fill="white" fillOpacity="0.9" />
            <rect x="15" y="12" width="8" height="22" rx="2" fill="white" fillOpacity="0.9" />
            <rect x="26" y="6" width="8" height="28" rx="2" fill="white" fillOpacity="0.9" />
            <path d="M7 14 L15 8 L23 13 L31 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="31" cy="5" r="2.5" fill="white" />
            {/* Sparkle */}
            <text x="28" y="3" fontSize="8" fill="white" opacity="0.9">✦</text>
        </svg>
    </div>
);

const PrintIcon = () => (
    <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center relative flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #D0FFF3 0%, #6EE7CB 100%)', boxShadow: '0 6px 16px rgba(80,210,180,0.45), inset 0 1px 2px rgba(255,255,255,0.85)' }}>
        {/* Printer icon */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="6" y="14" width="24" height="16" rx="3" fill="white" fillOpacity="0.9" />
            <path d="M10 14V8a2 2 0 012-2h12a2 2 0 012 2v6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="10" y="22" width="16" height="10" rx="1.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="26" cy="20" r="1.5" fill="rgba(110,231,203,0.8)" />
        </svg>
        {/* Wifi signal indicating cloud */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="text-[10px]">☁️</span>
        </div>
    </div>
);

export default function MobileScene() {
    const [view, setView] = useState<ViewMode>('menu');
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [printerConnected, setPrinterConnected] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [pendingJobs, setPendingJobs] = useState(0);       // cloud print jobs waiting
    const [printQueue, setPrintQueue] = useState<any[]>([]); // active queue

    // 1. Poll GitHub Issues for pending print jobs every 5 seconds if connected
    useEffect(() => {
        if (!printerConnected) return;

        let intervalId: any;

        const checkJobs = async () => {
            try {
                const jobs = await fetchPendingPrintJobs();
                setPrintQueue(jobs);
                setPendingJobs(jobs.length);
            } catch (error) {
                console.error("Error polling GitHub:", error);
            }
        };

        // Initial check
        checkJobs();
        // Set polling interval
        intervalId = setInterval(checkJobs, 5000);

        return () => clearInterval(intervalId);
    }, [printerConnected]);

    // 2. Process the print queue when a printer is "connected"
    useEffect(() => {
        if (!printerConnected || printQueue.length === 0 || isPrinting) return;

        const processQueue = async () => {
            setIsPrinting(true);
            const job = printQueue[0]; // Process oldest job first

            try {
                // Simulate Bluetooth WebBLE data transfer and mechanical printing delay
                await new Promise(resolve => setTimeout(resolve, 2500));

                // Job done: Mark as completed by closing the GitHub Issue
                await completePrintJob(job.id);

                // Success beep sound
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                    audio.play().catch(() => { });
                } catch (e) { }

            } catch (err) {
                console.error("Print failed:", err);
            } finally {
                setIsPrinting(false);
            }
        };

        processQueue();
    }, [printerConnected, printQueue, isPrinting]);

    const handleScan = (decodedText: string) => {
        const mockProduct = {
            id: decodedText,
            style: `扫码商品 (${decodedText.slice(-4)})`,
            color: '随机色',
            size: 'M',
            price: 199.00
        };
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => { });
        } catch (e) { }
        setCartItems(prev => [...prev, mockProduct]);
        setView('cart');
    };

    const handleRemove = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        alert(`结账成功！共收 ¥${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`);
        setCartItems([]);
        setView('menu');
    };

    const SubHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
        <header className="bg-white/60 backdrop-blur-xl px-4 pt-12 pb-4 flex items-center sticky top-0 z-20 border-b border-rose-50/50">
            <button onClick={onBack} className="p-2 -ml-2 text-rose-400 smooth-transition">
                <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 flex-1 text-center pr-8 font-art">{title}</h1>
        </header>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-rose-200"
            style={{ background: 'linear-gradient(160deg, #FFE8EE 0%, #FFF5F7 40%, #F5EEFF 70%, #E8F5FF 100%)' }}>

            {/* Background sakura decorations */}
            <Petals />

            {/* Main Menu View */}
            {view === 'menu' && (
                <div className="flex-1 flex flex-col px-6 pb-10 max-w-sm mx-auto w-full relative z-10 animate-in fade-in duration-500">

                    {/* Header: Logo + Name */}
                    <header className="pt-14 pb-8 flex flex-col items-center">
                        {/* Logo ring with gradient border */}
                        <div className="relative w-24 h-24 mb-4">
                            <div className="absolute inset-0 rounded-full"
                                style={{ background: 'linear-gradient(135deg, #FFB7C5, #D4A5F5, #87CEEB)', padding: '3px' }}>
                                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            {/* Sparkle badge */}
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-rose-100">
                                <span className="text-sm">✨</span>
                            </div>
                        </div>
                        <h1 className="font-art text-[28px] text-gray-800 tracking-wider mb-1">大茵子</h1>
                        <p className="text-[12px] tracking-[0.3em] uppercase text-rose-300 font-medium">店务管家</p>
                    </header>

                    {/* Menu Cards */}
                    <div className="flex flex-col space-y-5 items-center w-full">

                        {/* Card 1: Checkout */}
                        <button onClick={() => setView('scan')}
                            className="w-full relative overflow-hidden active:scale-[0.97] smooth-transition"
                            style={{ borderRadius: '1.8rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1.5px solid rgba(255,255,255,0.9)', boxShadow: 'inset 0 3px 10px rgba(255,255,255,1), inset 0 -2px 6px rgba(230,180,190,0.15), 0 10px 36px rgba(255,160,190,0.3)' }}>
                            <div className="flex items-center gap-5 px-6 py-5">
                                <CheckoutIcon />
                                <div className="text-left">
                                    <h2 className="font-art text-[22px] text-[#4A3A40] mb-0.5">结账收款</h2>
                                    <p className="text-[12px] text-[#B89FA5] tracking-wider">(扫码 + 购物车结算)</p>
                                </div>
                            </div>
                            {cartItems.length > 0 && (
                                <div className="absolute top-4 right-5 w-7 h-7 flex items-center justify-center rounded-full text-white text-[12px] font-bold shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF9A9E)' }}>
                                    {cartItems.length}
                                </div>
                            )}
                        </button>

                        {/* Card 2: Report */}
                        <button onClick={() => setView('dashboard')}
                            className="w-full relative overflow-hidden active:scale-[0.97] smooth-transition"
                            style={{ borderRadius: '1.8rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1.5px solid rgba(255,255,255,0.9)', boxShadow: 'inset 0 3px 10px rgba(255,255,255,1), inset 0 -2px 6px rgba(220,190,120,0.15), 0 10px 36px rgba(255,200,80,0.2)' }}>
                            <div className="flex items-center gap-5 px-6 py-5">
                                <ReportIcon />
                                <div className="text-left">
                                    <h2 className="font-art text-[22px] text-[#4A3A40] mb-0.5">销售报表</h2>
                                    <p className="text-[12px] text-[#B89FA5] tracking-wider">查看今日业绩与明细</p>
                                </div>
                            </div>
                        </button>

                        {/* Card 3: Cloud Print — with visible status indicator stripe at bottom */}
                        <button onClick={() => setView('print')}
                            className="w-full relative overflow-hidden active:scale-[0.97] smooth-transition"
                            style={{ borderRadius: '1.8rem', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1.5px solid rgba(255,255,255,0.9)', boxShadow: 'inset 0 3px 10px rgba(255,255,255,1), inset 0 -2px 6px rgba(100,220,200,0.15), 0 10px 36px rgba(80,220,190,0.2)' }}>
                            <div className="flex items-center gap-5 px-6 py-5 relative z-10">
                                <PrintIcon />
                                <div className="text-left">
                                    <h2 className="font-art text-[22px] text-[#4A3A40] mb-0.5">云打印中心</h2>
                                    <p className="text-[12px] text-[#B89FA5] tracking-wider">(蓝牙连接打单)</p>
                                </div>
                            </div>
                            {/* 4-state indicator: red=off, green=on+idle, blue+pulse=on+pending, green+pulse=printing */}
                            <div className="absolute bottom-0 left-0 right-0 h-[4px]" style={{ background: 'rgba(220,215,225,0.3)' }}>
                                <div
                                    className={`h-full w-full smooth-transition rounded-sm ${(printerConnected && pendingJobs > 0) || isPrinting ? 'animate-pulse' : ''}`}
                                    style={{
                                        background: isPrinting
                                            ? 'linear-gradient(90deg, #1DD1A1, #55EFC4)'       // green pulsing = printing
                                            : printerConnected && pendingJobs > 0
                                                ? 'linear-gradient(90deg, #4B9FFF, #74B9FF)'  // blue pulsing = connected + pending
                                                : printerConnected
                                                    ? 'linear-gradient(90deg, #1DD1A1, #55EFC4)' // green = connected idle
                                                    : 'linear-gradient(90deg, #FF6B81, #FF9A9E)', // red = disconnected
                                        boxShadow: isPrinting
                                            ? '0 0 10px #1DD1A1'
                                            : printerConnected && pendingJobs > 0
                                                ? '0 0 10px #4B9FFF'
                                                : printerConnected
                                                    ? '0 0 8px #1DD1A1'
                                                    : '0 0 8px #FF6B81'
                                    }}>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Sub Views */}
            {view !== 'menu' && (
                <div className="flex-1 flex flex-col relative z-10 bg-white/60 backdrop-blur-sm animate-in slide-in-from-right-8 duration-300">

                    {/* Scan Mode */}
                    {view === 'scan' && (
                        <>
                            <SubHeader title="智能收银台" onBack={() => setView('menu')} />
                            <main className="flex-1 p-4 pb-24">
                                <Scanner onScan={handleScan} />
                                <button onClick={() => setView('cart')}
                                    className="mt-6 w-full py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 smooth-transition"
                                    style={{ background: 'linear-gradient(135deg, #FF9FB2, #FFB8C6)' }}>
                                    查看购物车 ({cartItems.length})
                                </button>
                            </main>
                        </>
                    )}

                    {/* Cart Mode */}
                    {view === 'cart' && (
                        <>
                            <SubHeader title="待结账清单" onBack={() => setView('scan')} />
                            <main className="flex-1 p-4 pb-24">
                                <Cart items={cartItems} onRemove={handleRemove} onCheckout={handleCheckout} />
                            </main>
                        </>
                    )}

                    {/* Dashboard Mode */}
                    {view === 'dashboard' && (
                        <>
                            <SubHeader title="今日销售报表" onBack={() => setView('menu')} />
                            <main className="flex-1 p-6 flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <BarChart3 size={48} className="mx-auto mb-4 opacity-30" style={{ color: '#FFD980' }} />
                                    <p className="font-art text-lg text-gray-500">报表数据即将上线</p>
                                    <p className="text-xs mt-2 text-gray-400">(即将对接 Firebase 云端数据)</p>
                                </div>
                            </main>
                        </>
                    )}

                    {/* Print Center Mode */}
                    {view === 'print' && (
                        <>
                            <SubHeader title="蓝牙打印终端" onBack={() => setView('menu')} />
                            <main className="flex-1 p-6 space-y-5">
                                <div className="bg-white/80 rounded-[2rem] p-6 shadow-sm border border-white text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full mb-4 flex items-center justify-center"
                                        style={{ background: printerConnected ? 'linear-gradient(135deg,#D0FFF3,#6EE7CB)' : '#F5F5F5' }}>
                                        <Printer size={36} color={printerConnected ? '#1DD1A1' : '#AAAAAA'} />
                                    </div>
                                    <h2 className="font-art text-xl text-gray-800 mb-2">
                                        {printerConnected ? '✅ 已连接热敏打印机' : '未连接热敏打印机'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        {printerConnected ? '正在监听云端打印任务...' : '请使用支持 WebBLE 的 Bluefy 浏览器连接蓝牙打印机。'}
                                    </p>
                                    <button onClick={() => setPrinterConnected(!printerConnected)}
                                        className="w-full py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 smooth-transition"
                                        style={{ background: printerConnected ? 'linear-gradient(135deg,#FF9A9E,#FFB36B)' : 'linear-gradient(135deg,#A29BFE,#6C5CE7)' }}>
                                        {printerConnected ? '断开连接' : '🔍 搜索蓝牙打印机'}
                                    </button>
                                </div>

                                <div className="bg-white/80 rounded-[2rem] p-6 shadow-sm border border-white">
                                    <h3 className="font-art text-lg text-gray-800 mb-4 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${printQueue.length > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'}`}></div>
                                        云端打印队列 ({printQueue.length})
                                    </h3>

                                    {printQueue.length === 0 ? (
                                        <div className="text-center py-6 text-gray-400 text-sm">
                                            当前无等待打印的任务
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                            {printQueue.map((job, index) => (
                                                <div key={job.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between shadow-sm">
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm mb-1">{job.productData.style}</p>
                                                        <p className="text-xs text-gray-400">{job.productData.color} | {job.productData.size} (x{job.copies})</p>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {index === 0 && isPrinting ? (
                                                            <div className="text-emerald-500 text-xs font-bold animate-pulse flex items-center gap-1">
                                                                <Printer size={14} /> 打印中
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-400 text-xs shadow-sm bg-white px-2 py-1 rounded border border-gray-100">
                                                                排队中
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </main>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
