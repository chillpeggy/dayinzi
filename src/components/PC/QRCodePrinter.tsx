import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, CloudUpload } from 'lucide-react';
import { addPrintJob } from '../../firebase';

export default function QRCodePrinter({ product }: { product: any }) {
    const [isSending, setIsSending] = useState(false);

    if (!product) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleCloudPrint = async () => {
        setIsSending(true);
        try {
            await addPrintJob(product, 1);
            // Add a tiny delay for better UX
            setTimeout(() => {
                alert('已发送到云端打印队列！手机端将自动出纸');
            }, 500);
        } catch (error) {
            alert('发送打印任务失败，请检查网络');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800 mb-6 w-full text-left">标签预览</h2>

            {/* Label Preview (50mm x 30mm ratio approx) */}
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-col items-center print-area" style={{ width: '200px' }}>
                <p className="font-bold text-sm text-center mb-1 truncate w-full">{product.style}</p>
                <p className="text-xs text-gray-500 mb-2">{product.color} | {product.size}</p>
                <div className="bg-white p-2 rounded shadow-sm">
                    <QRCodeSVG value={product.id} size={100} level="H" />
                </div>
                <p className="mt-2 font-bold text-lg text-indigo-600">¥ {Number(product.price).toFixed(2)}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-1">{product.id}</p>
            </div>



            <button onClick={handlePrint} className="mt-6 w-full py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl shadow-lg smooth-transition flex justify-center items-center gap-2">
                <Printer size={20} /> 本地直接打印
            </button>
            <button onClick={handleCloudPrint} disabled={isSending} className={`mt-3 w-full py-3 font-medium rounded-xl shadow-md smooth-transition flex justify-center items-center gap-2 ${isSending ? 'bg-gray-200 text-gray-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:opacity-90'}`}>
                <CloudUpload size={20} /> {isSending ? '发送中...' : '发送云打印 (手机端出纸)'}
            </button>

            <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; border: none; background: white; width: 50mm; height: 30mm; padding: 2mm; overflow: hidden; display: flex; justify-content: center; transform: scale(1.5); transform-origin: top left;}
        }
      `}</style>
        </div>
    );
}
