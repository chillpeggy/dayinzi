import React, { useState } from 'react';
import { PlusCircle, Printer } from 'lucide-react';

export default function ProductForm({ onAddProduct }: { onAddProduct: (p: any) => void }) {
    const [formData, setFormData] = useState({ style: '', color: '', size: 'M', price: '', stock: '10' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.style || !formData.price) return;

        // Generate a unique ID for the QR code
        const id = `ITM-${Date.now().toString().slice(-6)}`;
        onAddProduct({ ...formData, id, price: Number(formData.price), stock: Number(formData.stock) });
        setFormData({ ...formData, style: '', price: '' });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <PlusCircle className="text-indigo-500" /> 快速录入商品
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">款式名称</label>
                        <input
                            type="text" required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none smooth-transition"
                            placeholder="e.g. 2023秋季风衣"
                            value={formData.style} onChange={e => setFormData({ ...formData, style: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">颜色</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none smooth-transition"
                            placeholder="e.g. 卡其色"
                            value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">尺码</label>
                        <select
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                            value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })}
                        >
                            <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>均码</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">价格 (¥)</label>
                        <input
                            type="number" required min="0" step="0.01"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="0.00"
                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1 col-span-2">
                        <label className="text-sm font-medium text-gray-600">初始库存</label>
                        <input
                            type="number" required min="1"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })}
                        />
                    </div>
                </div>
                <button type="submit" className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 smooth-transition flex justify-center items-center gap-2">
                    <PlusCircle size={20} /> 添加商品并生成二维码
                </button>
            </form>
        </div>
    );
}
