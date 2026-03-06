import React from 'react';
import { ShoppingBag, CheckCircle, Trash2 } from 'lucide-react';

export default function Cart({ items, onRemove, onCheckout }: { items: any[], onRemove: (id: string) => void, onCheckout: () => void }) {
    const total = items.reduce((sum, item) => sum + item.price, 0);

    if (items.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-400 mt-4 shadow-sm border border-gray-100">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                <p>购物车为空，快去扫码吧</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 mt-4 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingBag size={18} /> 当前购物车 ({items.length} 件)
                </h3>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
                {items.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-xl smooth-transition">
                        <div>
                            <p className="font-medium text-gray-900">{item.style}</p>
                            <p className="text-xs text-gray-500">{item.color} - {item.size}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-indigo-600">¥{item.price.toFixed(2)}</span>
                            <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-500 p-1">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-gray-900 text-white mt-auto">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">总计金额</span>
                    <span className="text-2xl font-bold">¥{total.toFixed(2)}</span>
                </div>
                <button
                    onClick={onCheckout}
                    className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg active:scale-95 smooth-transition flex justify-center items-center gap-2"
                >
                    <CheckCircle size={20} /> 确认结账
                </button>
            </div>
        </div>
    );
}
