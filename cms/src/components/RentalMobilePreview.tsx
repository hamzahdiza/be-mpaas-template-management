import { useState, useEffect } from 'react';
import type { RentalFormState } from '../lib/api';

const PLACEHOLDER_CAR = "https://images.unsplash.com/photo-1503376780353-7e6692767b70";

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
                <img src={PLACEHOLDER_CAR} className="w-full h-full object-cover opacity-50" />
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

function RentalDetail({ data, onScreenChange }: { data: RentalFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    const v = data.vehicles[0];
    return (
        <div className="bg-white min-h-full pb-32 animate-in slide-in-from-bottom duration-500">
            <div className="relative h-[45vh] bg-slate-900 overflow-hidden rounded-b-[4rem]">
                <img src={v?.imageUrl || PLACEHOLDER_CAR} className="w-full h-full object-cover opacity-80" />
                <button onClick={() => onScreenChange('index')} className="absolute top-12 left-6 bg-white/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30 active:scale-90 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                </button>
            </div>

            <div className="px-8 pt-10 space-y-10">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 block italic">{v?.type} Series</span>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase italic">{v?.name}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Rp {v?.pricePerDay?.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daily Rate</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Transmission', value: v?.transmission },
                        { label: 'Capacity', value: `${v?.capacity} Persons` },
                        { label: 'Fuel', value: 'Petrol' }
                    ].map((spec, i) => (
                        <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{spec.value}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Vehicle Terms</h4>
                    <p className="text-sm font-medium leading-relaxed text-slate-500 italic">Includes insurance, 24/7 support, and free cancellation up to 24 hours before pickup.</p>
                </div>

                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[343px] z-50">
                    <button className="w-full py-7 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs tracking-[0.5em] uppercase shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">
                        Reserve Vehicle ΓåÆ
                    </button>
                </div>
            </div>
        </div>
    );
}

export function RentalMobilePreview({ data, activeScreen, onScreenChange }: { 
    data: RentalFormState; 
    activeScreen: 'index' | 'detail'; 
    onScreenChange: (screen: 'index' | 'detail') => void; 
}) {
    const templateId = data.templates?.index?.id || 1;

    const renderIndex = () => {
        switch (templateId) {
            case 2: return <CompactGridIndex data={data} onScreenChange={onScreenChange} />;
            case 3: return <HorizontalScrollIndex data={data} onScreenChange={onScreenChange} />;
            case 4: return <DarkModePremiumIndex data={data} onScreenChange={onScreenChange} />;
            case 5: return <MinimalistWhiteIndex data={data} onScreenChange={onScreenChange} />;
            default: return <ModernLuxuryIndex data={data} onScreenChange={onScreenChange} />;
        }
    };

    return (
        <div className="w-[375px] h-[780px] bg-white border-[12px] border-slate-900 rounded-[3.5rem] relative shadow-2xl overflow-hidden font-sans">
            <div className="absolute top-0 left-1/2 z-50 w-32 h-7 rounded-b-3xl -translate-x-1/2 bg-slate-900" />
            <div className="h-full overflow-y-auto scrollbar-hide bg-slate-50">
                {activeScreen === 'index' ? renderIndex() : <RentalDetail data={data} onScreenChange={onScreenChange} />}
            </div>
        </div>
    );
}

function ModernLuxuryIndex({ data, onScreenChange }: { data: RentalFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-white min-h-full pb-24 animate-in fade-in duration-500">
            <div className="relative h-[45vh] overflow-hidden">
                <ImageSlider images={data.bannerUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">Premium Rental</span>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase italic">{data.name}</h2>
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                        {data.location}
                    </p>
                </div>
            </div>

            <div className="px-8 mt-8 space-y-10">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                    {['SUV', 'Sedan', 'Luxury', 'Electric'].map(type => (
                        <div key={type} className="px-6 py-3 bg-slate-100 rounded-2xl whitespace-nowrap text-xs font-black text-slate-600 uppercase tracking-tighter hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                            {type}
                        </div>
                    ))}
                </div>

                <div className="grid gap-8">
                    {data.vehicles.map((v) => (
                        <div key={v.id} onClick={() => onScreenChange('detail')} className="bg-white rounded-[2.5rem] p-6 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-slate-50 group active:scale-95 transition-all">
                            <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-[2rem]">
                                <img src={v.imageUrl || PLACEHOLDER_CAR} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Available</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">{v.name}</h4>
                                    <div className="flex gap-4 mt-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.transmission}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.capacity} Seats</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-indigo-600 tracking-tighter leading-none">Rp {v.pricePerDay?.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">/ day</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CompactGridIndex({ data, onScreenChange }: { data: RentalFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-slate-50 min-h-full pb-24 animate-in fade-in duration-500">
            <div className="p-6 bg-indigo-600 rounded-b-[3rem] shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-2xl overflow-hidden shadow-lg">
                        <img src="https://i.pravatar.cc/100" className="w-full h-full object-cover" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">{data.name}</h2>
                <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mt-2">{data.location}</p>
                <div className="mt-8 relative">
                    <input type="text" placeholder="Search vehicle..." className="w-full py-4 px-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder:text-white/50 text-xs font-bold outline-none" />
                </div>
            </div>

            <div className="px-6 mt-8 grid grid-cols-2 gap-4">
                {data.vehicles.map((v) => (
                    <div key={v.id} onClick={() => onScreenChange('detail')} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 active:scale-95 transition-all">
                        <img src={v.imageUrl || PLACEHOLDER_CAR} className="w-full aspect-square object-contain mb-4" />
                        <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-tight mb-1">{v.name}</h4>
                        <p className="text-[10px] font-black text-indigo-600 tracking-tighter">Rp {v.pricePerDay?.toLocaleString()}<span className="text-slate-300 font-bold ml-1">/d</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HorizontalScrollIndex({ data, onScreenChange }: { data: RentalFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-white min-h-full pb-24 animate-in fade-in duration-500">
            <div className="px-8 pt-12">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-2 block italic">Featured Fleet</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase italic mb-8">{data.name}</h2>
                
                <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide -mx-8 px-8">
                    {data.vehicles.map((v) => (
                        <div key={v.id} onClick={() => onScreenChange('detail')} className="min-w-[300px] bg-slate-900 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-bl-full -mr-10 -mt-10" />
                            <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">{v.name}</h4>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">{v.transmission} ΓÇó {v.capacity} Seats</p>
                            <img src={v.imageUrl || PLACEHOLDER_CAR} className="w-full aspect-[16/9] object-contain group-hover:scale-110 transition-transform duration-700" />
                            <div className="mt-8 flex justify-between items-center">
                                <p className="text-xl font-black text-white tracking-tighter leading-none">Rp {v.pricePerDay?.toLocaleString()}</p>
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">ΓåÆ</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Browse by Category</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {['Standard', 'Luxury', 'SUV', 'Electric'].map(cat => (
                            <div key={cat} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-600 transition-all">
                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 group-hover:text-white">{cat}</span>
                                <span className="text-indigo-600 group-hover:text-white">ΓåÆ</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DarkModePremiumIndex({ data, onScreenChange }: { data: RentalFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-slate-950 min-h-full pb-24 animate-in fade-in duration-500">
            <div className="relative h-[50vh] overflow-hidden">
                <ImageSlider images={data.bannerUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-12 left-8 right-8 flex justify-between items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] italic">Elite Status</span>
                </div>
                <div className="absolute bottom-10 left-8 right-8">
                    <h2 className="text-6xl font-black text-white tracking-tighter leading-[0.8] uppercase italic mb-4">{data.name}</h2>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                        <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                        {data.location}
                    </p>
                </div>
            </div>

            <div className="px-8 mt-12 space-y-12">
                {data.vehicles.map((v) => (
                    <div key={v.id} onClick={() => onScreenChange('detail')} className="relative group cursor-pointer active:scale-95 transition-all">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h4 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none mb-1">{v.name}</h4>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">{v.type} Collection</span>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-white tracking-tighter leading-none">Rp {v.pricePerDay?.toLocaleString()}</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Per 24 Hours</p>
                            </div>
                        </div>
                        <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
                            <img src={v.imageUrl || PLACEHOLDER_CAR} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MinimalistWhiteIndex({ data, onScreenChange }: { data: RentalFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-white min-h-full pb-24 animate-in fade-in duration-500">
            <div className="px-10 pt-20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-2 h-16 bg-indigo-600 rounded-full" />
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase italic">{data.name}</h2>
                </div>

                <div className="space-y-16">
                    {data.vehicles.map((v) => (
                        <div key={v.id} onClick={() => onScreenChange('detail')} className="group cursor-pointer">
                            <div className="relative aspect-[4/3] mb-8">
                                <div className="absolute inset-0 bg-slate-100 rounded-[4rem] group-hover:bg-indigo-50 transition-colors duration-500" />
                                <img src={v.imageUrl || PLACEHOLDER_CAR} className="absolute inset-0 w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex justify-between items-center px-4">
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-1">{v.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.capacity} SEATER ΓÇó {v.transmission}</p>
                                </div>
                                <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all">
                                    <svg className="w-6 h-6 text-slate-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
