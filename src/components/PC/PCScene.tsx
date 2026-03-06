import React, { useState } from 'react';
import ProductForm from './ProductForm';
import QRCodePrinter from './QRCodePrinter';
import { Package, Search } from 'lucide-react';

export default function PCScene() {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const handleAddProduct = (product: any) => {
        setProducts([product, ...products]);
        setSelectedProduct(product); // auto-select for printing
    };

    return (
        <div className="min-h-screen bg-[#fff0f5] flex flex-col font-sans selection:bg-rose-200">
            <header className="bg-white/70 backdrop-blur-xl border-b border-white/50 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3 text-rose-500">
                    <Package size={28} strokeWidth={2.5} />
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight" style={{ fontFamily: 'serif' }}>大茵子店务中枢</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
                        <input type="text" placeholder="搜索商品..." className="pl-10 pr-4 py-2 bg-white/50 border-white focus:border-rose-300 focus:bg-white rounded-full focus:ring-2 ring-rose-100 smooth-transition text-sm shadow-inner shadow-rose-50" />
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 shadow-sm rounded-full flex items-center justify-center text-rose-600 font-bold border border-white">茵</div>
                </div>
            </header>

            <main className="flex-1 p-8 grid grid-cols-12 gap-8 max-w-7xl mx-auto w-full">
                {/* Left Column: Entry Form */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    <ProductForm onAddProduct={handleAddProduct} />

                    {/* Product List */}
                    <div className="bg-white/60 backdrop-blur-md rounded-[2rem] shadow-xl shadow-rose-100/50 border border-white overflow-hidden">
                        <div className="p-6 border-b border-white/50 bg-white/40">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">{products.length}</span>
                                最新录入记录
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">商品 ID</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">款式</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">颜色/尺码</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">价格</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-400">暂无商品数据，请在上方录入</td>
                                        </tr>
                                    ) : (
                                        products.map(p => (
                                            <tr key={p.id} className="border-b border-gray-50 hover:bg-indigo-50/30 smooth-transition group cursor-pointer" onClick={() => setSelectedProduct(p)}>
                                                <td className="py-4 px-6 text-sm text-gray-500 font-mono">{p.id}</td>
                                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{p.style}</td>
                                                <td className="py-4 px-6 text-sm text-gray-500">{p.color} - {p.size}</td>
                                                <td className="py-4 px-6 text-sm text-gray-900 font-medium">¥{p.price.toFixed(2)}</td>
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}
                                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1 rounded-full bg-indigo-50 opacity-0 group-hover:opacity-100 smooth-transition"
                                                    >
                                                        打印标签
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Printer & Dashboard widgets */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <QRCodePrinter product={selectedProduct} />

                    <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-[2rem] shadow-xl shadow-rose-200/50 p-6 text-white relative overflow-hidden border border-white/20">
                        <div className="relative z-10">
                            <h3 className="text-white/90 font-medium mb-1">今日新增商品</h3>
                            <p className="text-4xl font-extrabold">{products.length} <span className="text-lg font-medium opacity-80">款</span></p>
                        </div>
                        <Package className="absolute right-[-20px] bottom-[-20px] text-white/10" size={140} />
                    </div>
                </div>
            </main>
        </div>
    );
}
