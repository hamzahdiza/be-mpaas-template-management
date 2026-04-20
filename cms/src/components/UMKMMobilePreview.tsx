import { useState, useEffect } from 'react';
import type { UMKMFormState } from '../lib/api';

const PLACEHOLDER_PRODUCT = "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

function ImageSlider({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);
    const validImages = (images || []).filter(img => img && typeof img === 'string' && img.trim() !== "");

    useEffect(() => {
        if (validImages.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % validImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [validImages.length]);

    if (validImages.length === 0) {
        return (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <img src={PLACEHOLDER_PRODUCT} className="w-full h-full object-cover opacity-50" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            {validImages.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                />
            ))}
        </div>
    );
}

export function UMKMMobilePreview({ data, activeScreen, onScreenChange }: { 
    data: UMKMFormState; 
    activeScreen: 'index' | 'detail'; 
    onScreenChange: (screen: 'index' | 'detail') => void; 
}) {
    const templateId = data.templates?.index?.id || 1;

    const renderIndex = () => {
        switch (templateId) {
            case 2: return <MarketplaceIndex data={data} onScreenChange={onScreenChange} />;
            case 3: return <BoutiqueIndex data={data} onScreenChange={onScreenChange} />;
            case 4: return <BentoGridIndex data={data} onScreenChange={onScreenChange} />;
            case 5: return <ElegantScrollIndex data={data} onScreenChange={onScreenChange} />;
            default: return <ProductGridIndex data={data} onScreenChange={onScreenChange} />;
        }
    };

    return (
        <div className="w-[375px] h-[780px] bg-white border-[12px] border-slate-900 rounded-[3.5rem] relative shadow-2xl overflow-hidden font-sans">
            <div className="absolute top-0 left-1/2 z-50 w-32 h-7 rounded-b-3xl -translate-x-1/2 bg-slate-900" />
            <div className="h-full overflow-y-auto scrollbar-hide bg-white">
                {activeScreen === 'index' ? renderIndex() : <UMKMDetail data={data} onScreenChange={onScreenChange} />}
            </div>
        </div>
    );
}

function ProductGridIndex({ data, onScreenChange }: { data: UMKMFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-white min-h-full pb-32 animate-in fade-in duration-500">
            <div className="relative h-[35vh] overflow-hidden">
                <ImageSlider images={data.bannerUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-1">{data.name}</h2>
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">{data.location}</p>
                </div>
            </div>

            <div className="px-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Our Products</h3>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {data.products.map((p) => (
                        <div key={p.id} onClick={() => onScreenChange('detail')} className="group cursor-pointer active:scale-95 transition-all">
                            <div className="relative aspect-square mb-4 overflow-hidden rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] group-hover:shadow-rose-600/10 transition-all border border-slate-50">
                                <img src={p.imageUrl || PLACEHOLDER_PRODUCT} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl">
                                    <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                                </div>
                            </div>
                            <div className="px-2">
                                <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-rose-600 transition-colors leading-tight mb-1">{p.name}</h4>
                                <p className="text-xs font-black text-rose-600 tracking-tighter">Rp {p.price?.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Float Cart Bar */}
            <div className="fixed bottom-10 left-6 right-6 bg-slate-900 p-5 rounded-[2.5rem] flex justify-between items-center shadow-2xl border border-slate-800 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg shadow-rose-600/20">2</div>
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Items Selected</p>
                        <p className="text-sm font-black text-white tracking-tighter leading-none">Rp 300,000</p>
                    </div>
                </div>
                <div className="text-rose-500 font-black text-xs uppercase tracking-[0.2em]">View Cart ΓåÆ</div>
            </div>
        </div>
    );
}

function UMKMDetail({ data, onScreenChange }: { data: UMKMFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    const p = data.products[0];
    return (
        <div className="bg-white min-h-full pb-32 animate-in slide-in-from-right duration-500">
            <div className="relative aspect-square">
                <img src={p?.imageUrl || PLACEHOLDER_PRODUCT} className="w-full h-full object-cover" />
                <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
                    <button onClick={() => onScreenChange('index')} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
                        <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl">
                        <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </div>
                </div>
            </div>

            <div className="px-8 pt-10 space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] mb-2 block italic">Handcrafted Quality</span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase italic">{p?.name}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Rp {p?.price?.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Best Price</p>
                    </div>
                </div>

                <div className="space-y-4 border-y border-slate-50 py-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Product Story</h4>
                    <p className="text-base leading-relaxed text-slate-500 font-medium italic">{p?.description}</p>
                </div>

                <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-6">
                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-lg">-</div>
                        <span className="text-xl font-black text-slate-900 italic">1</span>
                        <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-rose-600/20">+</div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
                        <p className="text-xl font-black text-slate-900 tracking-tighter italic leading-none">Rp {p?.price?.toLocaleString()}</p>
                    </div>
                </div>

                <div className="pt-4 pb-12">
                    <button className="w-full py-7 bg-rose-600 text-white rounded-[2.5rem] font-black text-xs tracking-[0.5em] uppercase shadow-2xl shadow-rose-600/30 active:scale-95 transition-all">
                        Add to Selection ΓåÆ
                    </button>
                </div>
            </div>
        </div>
    );
}

// Fallback components for other templates
function MarketplaceIndex({ data, onScreenChange }: { data: UMKMFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-slate-50 min-h-full pb-32 animate-in fade-in duration-500">
            <div className="bg-white p-6 sticky top-0 z-40 border-b border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{data.name}</h2>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {['All Products', 'Best Sellers', 'New Arrival', 'Sale'].map((cat, i) => (
                        <div key={i} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${i === 0 ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 mt-8 grid grid-cols-2 gap-4">
                {data.products.map((p) => (
                    <div key={p.id} onClick={() => onScreenChange('detail')} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm active:scale-95 transition-all">
                        <div className="aspect-square overflow-hidden relative">
                            <img src={p.imageUrl || PLACEHOLDER_PRODUCT} className="w-full h-full object-cover" />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                                <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest">New</p>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-tight mb-1 line-clamp-1">{p.name}</h4>
                            <p className="text-xs font-black text-rose-600 tracking-tighter">Rp {p.price?.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BoutiqueIndex({ data, onScreenChange }: { data: UMKMFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-white min-h-full pb-32 animate-in fade-in duration-500">
            <div className="px-10 pt-20 mb-16">
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.5em] mb-4 block italic text-center">Curated Boutique</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase italic text-center">{data.name}</h2>
            </div>

            <div className="space-y-20 px-10">
                {data.products.map((p, i) => (
                    <div key={p.id} onClick={() => onScreenChange('detail')} className={`flex flex-col ${i % 2 === 1 ? 'items-end' : 'items-start'} group cursor-pointer`}>
                        <div className="relative w-[80%] aspect-[3/4] mb-8">
                            <div className={`absolute inset-0 bg-slate-50 translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500`} />
                            <img src={p.imageUrl || PLACEHOLDER_PRODUCT} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className={i % 2 === 1 ? 'text-right' : 'text-left'}>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-2">{p.name}</h4>
                            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-[0.3em]">Exclusive ΓÇó Rp {p.price?.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BentoGridIndex({ data, onScreenChange }: { data: UMKMFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-slate-50 min-h-full pb-32 animate-in fade-in duration-500">
            <div className="p-8">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-rose-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-rose-600/30">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-1">{data.name}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.location}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 auto-rows-[200px]">
                    {data.products.map((p, i) => (
                        <div 
                            key={p.id} 
                            onClick={() => onScreenChange('detail')}
                            className={`bg-white rounded-[2.5rem] overflow-hidden relative group active:scale-95 transition-all shadow-sm border border-slate-100 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                        >
                            <img src={p.imageUrl || PLACEHOLDER_PRODUCT} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                                <h4 className="text-sm font-black text-white tracking-tight uppercase mb-1">{p.name}</h4>
                                <p className="text-xs font-black text-rose-400">Rp {p.price?.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ElegantScrollIndex({ data, onScreenChange }: { data: UMKMFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-white min-h-full pb-32 animate-in fade-in duration-500">
            <div className="px-8 pt-16 mb-12">
                <div className="w-12 h-1.5 bg-rose-600 mb-6 rounded-full" />
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">{data.name}</h2>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em] mt-4">Selected Goods</p>
            </div>

            <div className="space-y-4">
                {data.products.map((p) => (
                    <div key={p.id} onClick={() => onScreenChange('detail')} className="flex items-center gap-6 px-8 py-6 hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-lg border border-slate-100">
                            <img src={p.imageUrl || PLACEHOLDER_PRODUCT} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-1">{p.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 line-clamp-1">{p.description}</p>
                            <p className="text-sm font-black text-rose-600 tracking-tighter">Rp {p.price?.toLocaleString()}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
