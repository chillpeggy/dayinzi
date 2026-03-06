import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';

export default function Scanner({ onScan }: { onScan: (decodedText: string) => void }) {
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    const startScanning = async () => {
        setIsScanning(true);
        try {
            scannerRef.current = new Html5Qrcode("reader");
            await scannerRef.current.start(
                { facingMode: "environment" }, // always back camera
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    onScan(decodedText);
                    stopScanning(); // auto stop after successful scan
                },
                (error) => { /* ignore normal scanning errors */ }
            );
        } catch (err) {
            console.error("Camera start error", err);
            setIsScanning(false);
        }
    };

    const stopScanning = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                setIsScanning(false);
            }).catch(err => console.error(err));
        } else {
            setIsScanning(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current && isScanning) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, [isScanning]);

    return (
        <div className="w-full max-w-md mx-auto relative rounded-3xl overflow-hidden shadow-2xl bg-black">
            {!isScanning ? (
                <div className="p-12 flex flex-col items-center justify-center bg-gray-900 text-white min-h-[350px]">
                    <Camera size={64} className="mb-6 opacity-80 text-indigo-400" />
                    <p className="text-center text-gray-300 font-medium mb-8">对准商品标签上的二维码即可自动加入购物车</p>
                    <button
                        onClick={startScanning}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 active:scale-95 smooth-transition"
                    >
                        开启摄像头扫码
                    </button>
                </div>
            ) : (
                <div className="relative min-h-[400px]">
                    <div id="reader" className="w-full h-full object-cover rounded-3xl overflow-hidden"></div>
                    <button
                        onClick={stopScanning}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>

                    {/* Scanning frame overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-indigo-500 rounded-3xl relative">
                            {/* Corner indicators */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl -mt-1 -ml-1"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl -mt-1 -mr-1"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl -mb-1 -ml-1"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl -mb-1 -mr-1"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
