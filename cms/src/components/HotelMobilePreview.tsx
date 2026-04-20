import { useState, useEffect } from 'react';
import type { HotelFormState } from '../lib/api';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945";

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
                <img src={PLACEHOLDER_IMAGE} className="w-full h-full object-cover opacity-50" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            {validImages.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                        }`}
                />
            ))}
            {validImages.length > 1 && (
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-20">
                    {validImages.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-white shadow-lg' : 'w-1.5 bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function HotelMobilePreview({ data, activeScreen, onScreenChange }: { 
    data: HotelFormState; 
    activeScreen: 'index' | 'detail'; 
    onScreenChange: (screen: 'index' | 'detail') => void; 
}) {
    const templateId = activeScreen === 'index' ? data.templates?.index?.id || 1 : data.templates?.hotelDetail?.id || 1;

    const renderIndex = () => {
        switch (templateId) {
            case 2: return <BoutiqueArtisticIndex data={data} onScreenChange={onScreenChange} />;
            case 3: return <EcoNatureIndex data={data} onScreenChange={onScreenChange} />;
            case 4: return <UrbanMinimalistIndex data={data} onScreenChange={onScreenChange} />;
            case 5: return <VintageHeritageIndex data={data} onScreenChange={onScreenChange} />;
            default: return <ModernLuxuryIndex data={data} onScreenChange={onScreenChange} />;
        }
    };

    const renderDetail = () => {
        switch (templateId) {
            case 2: return <BoutiqueArtisticDetail data={data} onScreenChange={onScreenChange} />;
            case 3: return <EcoNatureDetail data={data} onScreenChange={onScreenChange} />;
            case 4: return <UrbanMinimalistDetail data={data} onScreenChange={onScreenChange} />;
            case 5: return <VintageHeritageDetail data={data} onScreenChange={onScreenChange} />;
            default: return <ModernLuxuryDetail data={data} onScreenChange={onScreenChange} />;
        }
    };

    return (
        <div className="w-[375px] h-[780px] bg-white border-[12px] border-slate-900 rounded-[3.5rem] relative shadow-2xl overflow-hidden font-sans">
            <div className="absolute top-0 left-1/2 z-50 w-32 h-7 rounded-b-3xl -translate-x-1/2 bg-slate-900" />
            <div className="h-full overflow-y-auto scrollbar-hide bg-slate-50">
                {activeScreen === 'index' ? renderIndex() : renderDetail()}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 1: MODERN LUXURY (Marriott Style)        */
/* -------------------------------------------------------------------------- */

function ModernLuxuryIndex({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-white min-h-full pb-24 animate-in fade-in duration-500">
            <div className="relative h-[60vh] overflow-hidden">
                <ImageSlider images={data.bannerUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-12 left-8 right-8 flex justify-between items-center">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </div>
                    <div className="bg-blue-600 px-4 py-2 rounded-full shadow-lg">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Book Now</p>
                    </div>
                </div>
                <div className="absolute bottom-12 left-8 right-8 text-white">
                    <div className="flex gap-1 mb-4">
                        {Array.from({ length: data.starRating }).map((_, i) => (
                            <span key={i} className="text-amber-400 text-lg">ΓÜà</span>
                        ))}
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter leading-[0.85] mb-4 uppercase italic">{data.name}</h2>
                    <p className="text-sm font-medium opacity-80 flex items-center gap-2 tracking-wide">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
                        {data.location}
                    </p>
                </div>
            </div>
            <div className="px-8 mt-12 space-y-12">
                <div className="flex justify-between items-end border-b border-slate-100 pb-8">
                    <div>
                        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-2">Refined Living</h3>
                        <p className="text-base leading-relaxed text-slate-600 font-medium italic">{data.description}</p>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Premium Suites</h3>
                        <span className="text-xs font-bold text-blue-600 border-b border-blue-600/30 pb-0.5">VIEW ALL</span>
                    </div>
                    <div className="grid gap-10">
                        {data.categories.map((c) => (
                            <div 
                                key={c.id} 
                                onClick={() => onScreenChange('detail')}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-[2.5rem] shadow-2xl">
                                    <img src={c.images[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl">
                                        <p className="text-xs font-black text-blue-600 tracking-tighter">Rp {c.pricePerNight?.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="px-2">
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors">{c.name}</h4>
                                    <div className="flex gap-4 mt-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.capacity} Guests</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.roomType}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModernLuxuryDetail({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    const room = data.categories[0];
    return (
        <div className="bg-white min-h-full pb-32 animate-in slide-in-from-bottom duration-500">
            <div className="relative h-[55vh]">
                <img src={room?.images[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
                <button 
                    onClick={() => onScreenChange('index')}
                    className="absolute top-12 left-6 bg-white/90 backdrop-blur-md p-3.5 rounded-full shadow-2xl active:scale-90 transition-transform"
                >
                    <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                </button>
            </div>
            <div className="px-8 pt-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="max-w-[70%]">
                        <span className="text-[10px] font-black tracking-[0.4em] text-blue-600 uppercase mb-2 block italic">Exclusive Sanctuary</span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase italic">{room?.name}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Rp {room?.pricePerNight?.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">per night</p>
                    </div>
                </div>
                <div className="flex gap-4 py-8 border-y border-slate-50 mb-10 overflow-x-auto scrollbar-hide">
                    {['Capacity', 'Size', 'WiFi', 'AC'].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 bg-slate-50 px-6 py-4 rounded-[2rem] flex-shrink-0 min-w-[100px] border border-slate-100 shadow-sm">
                            <span className="text-lg opacity-40">ΓÜò</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{i === 0 ? `${room?.capacity} Guests` : item}</span>
                        </div>
                    ))}
                </div>
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Room Philosophy</h4>
                    <p className="text-base leading-relaxed text-slate-500 font-medium italic">{room?.description}</p>
                </div>
                
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[343px] z-50">
                    <button className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xs tracking-[0.4em] uppercase shadow-2xl shadow-blue-600/30 active:scale-95 transition-all">
                        Reserve Sanctuary
                    </button>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 2: BOUTIQUE ARTISTIC (Tablet Style)      */
/* -------------------------------------------------------------------------- */

function BoutiqueArtisticIndex({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-[#F8F5F2] min-h-full pb-24 animate-in fade-in duration-700 font-serif">
            <div className="px-10 pt-24 pb-16">
                <div className="flex justify-between items-center mb-12">
                    <div className="w-16 h-[1px] bg-slate-900" />
                    <span className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-slate-400">The Art of Stay</span>
                </div>
                <h2 className="text-6xl italic tracking-tighter text-slate-900 leading-[0.8] mb-8">{data.name}</h2>
                <div className="flex items-center gap-3 font-sans">
                   <div className="w-2 h-2 rounded-full bg-blue-600" />
                   <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{data.locationAddress}</p>
                </div>
            </div>
            <div className="px-8 space-y-32">
                {data.categories.map((c, i) => (
                    <div 
                        key={c.id} 
                        onClick={() => onScreenChange('detail')}
                        className={`flex flex-col cursor-pointer group ${i % 2 === 1 ? 'items-end text-right' : 'items-start text-left'}`}
                    >
                        <div className="relative w-[90%] aspect-[3/4] mb-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] overflow-hidden rounded-sm">
                            <img src={c.images[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                            <div className={`absolute bottom-8 ${i % 2 === 1 ? 'left-[-10%]' : 'right-[-10%]'} bg-white px-8 py-4 shadow-2xl transform rotate-[-4deg] group-hover:rotate-0 transition-transform`}>
                                <p className="font-sans text-xs font-black tracking-widest text-slate-900">Rp {c.pricePerNight?.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="space-y-4 max-w-[80%]">
                            <h4 className="text-4xl italic text-slate-900 mb-2 leading-none group-hover:text-blue-800 transition-colors">{c.name}</h4>
                            <p className="font-sans text-[10px] font-black tracking-[0.3em] uppercase text-blue-600">Explore Collection ΓåÆ</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BoutiqueArtisticDetail({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    const room = data.categories[0];
    return (
        <div className="bg-[#F8F5F2] min-h-full pb-24 animate-in fade-in duration-1000 font-serif">
            <div className="p-10">
                <button onClick={() => onScreenChange('index')} className="mb-20 flex items-center gap-4 text-[10px] font-sans font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-colors">
                    <span className="text-2xl font-light">ΓåÉ</span> Return to Gallery
                </button>
                <div className="relative aspect-[4/5] mb-20 shadow-[0_48px_96px_-12px_rgba(0,0,0,0.25)]">
                    <img src={room?.images[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-[24px] border-[#F8F5F2]/5" />
                </div>
                <div className="max-w-xs mx-auto text-center space-y-10">
                   <h2 className="text-6xl italic text-slate-900 mb-8 leading-[0.8] tracking-tighter">{room?.name}</h2>
                   <div className="w-16 h-[1px] bg-slate-900 mx-auto" />
                   <p className="text-base leading-relaxed text-slate-600 font-sans italic">{room?.description}</p>
                   
                   <div className="pt-20 border-t border-slate-200">
                      <div className="flex justify-between items-end mb-12">
                          <div className="text-left">
                              <p className="font-sans text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 mb-2">Curated Rate</p>
                              <p className="text-3xl text-slate-900 italic tracking-tighter">Rp {room?.pricePerNight?.toLocaleString()}</p>
                          </div>
                          <button className="px-12 py-6 bg-slate-900 text-white font-sans text-[10px] font-black tracking-[0.5em] uppercase hover:bg-slate-800 transition-all active:scale-95 shadow-2xl">
                              Reserve
                          </button>
                      </div>
                   </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 3: ECO NATURE (Green Style)              */
/* -------------------------------------------------------------------------- */

function EcoNatureIndex({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-[#FAFDFB] min-h-full pb-24 animate-in fade-in duration-500">
            <div className="relative h-[55vh] rounded-b-[5rem] overflow-hidden shadow-2xl">
                <img src={data.bannerUrl[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFDFB] via-transparent to-black/20" />
                <div className="absolute top-16 left-8 right-8 flex justify-between items-start">
                    <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-[2rem] shadow-sm inline-flex items-center gap-3 border border-white/50">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Eco-Conscious</span>
                    </div>
                </div>
                <div className="absolute bottom-16 left-10 right-10">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-4">{data.name}</h2>
                    <p className="text-sm font-black text-emerald-800 tracking-tighter uppercase italic">{data.location}</p>
                </div>
            </div>

            <div className="px-8 mt-16">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Wild Retreats</h3>
                   <div className="flex gap-2">
                      <div className="w-8 h-1 rounded-full bg-emerald-600" />
                      <div className="w-2 h-1 rounded-full bg-emerald-100" />
                   </div>
                </div>
                <div className="space-y-12">
                    <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide px-2">
                        {data.categories.map((c) => (
                            <div 
                                key={c.id} 
                                onClick={() => onScreenChange('detail')}
                                className="min-w-[300px] bg-white rounded-[4rem] p-5 shadow-[0_32px_64px_-12px_rgba(0,64,32,0.1)] cursor-pointer border border-emerald-50 active:scale-[0.98] transition-all group"
                            >
                                <div className="relative overflow-hidden rounded-[3.5rem] mb-8">
                                    <img src={c.images[0] || PLACEHOLDER_IMAGE} className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-6 left-6 bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg">
                                       Rp {c.pricePerNight?.toLocaleString()}
                                    </div>
                                </div>
                                <div className="px-4 pb-4">
                                    <h4 className="font-black text-slate-900 text-2xl mb-2 tracking-tighter italic">{c.name}</h4>
                                    <p className="text-emerald-600/60 text-xs font-bold uppercase tracking-widest">{c.roomType} Γÿ║ {c.capacity} Guests</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EcoNatureDetail({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    const room = data.categories[0];
    return (
        <div className="bg-[#FAFDFB] min-h-full pb-24 animate-in fade-in duration-500">
            <div className="p-8">
                <div className="flex justify-between items-center mb-16">
                    <button onClick={() => onScreenChange('index')} className="w-14 h-14 bg-emerald-50 rounded-[2rem] text-emerald-600 flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Sanctuary Detail</span>
                    <div className="w-14 h-14 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-600/30">
                        <span className="text-2xl">ΓÜ┐</span>
                    </div>
                </div>
                
                <div className="relative mb-16 group">
                    <div className="absolute inset-0 bg-emerald-600 rounded-[5rem] rotate-3 scale-95 opacity-5 transition-transform group-hover:rotate-6" />
                    <img src={room?.images[0] || PLACEHOLDER_IMAGE} className="relative w-full aspect-square object-cover rounded-[5rem] shadow-2xl" />
                </div>

                <div className="space-y-8 px-4">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.8] italic uppercase">{room?.name}</h2>
                    <div className="flex items-center gap-6">
                        <div className="bg-emerald-600 px-8 py-4 rounded-[2rem] shadow-xl shadow-emerald-600/30">
                            <p className="text-white font-black text-2xl tracking-tighter italic">Rp {room?.pricePerNight?.toLocaleString()}</p>
                        </div>
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-emerald-100 overflow-hidden" />)}
                           <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600">+12</div>
                        </div>
                    </div>
                    <p className="text-lg font-medium leading-relaxed text-slate-500 italic border-l-4 border-emerald-100 pl-6">{room?.description}</p>
                    
                    <div className="pt-12">
                        <button className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all uppercase tracking-tighter italic">
                            Request Sanctuary ΓåÆ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 4: URBAN MINIMALIST (CitizenM Style)    */
/* -------------------------------------------------------------------------- */

function UrbanMinimalistIndex({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-white min-h-full pb-24 animate-in fade-in duration-500">
            <div className="px-10 pt-20 pb-12">
                <div className="flex justify-between items-start mb-20">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Next-Gen Stay</p>
                        <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-[0.75] uppercase">{data.name}</h2>
                    </div>
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/40">
                        <span className="text-[10px] font-black tracking-widest rotate-[-90deg]">STAY</span>
                    </div>
                </div>
                
                <div className="grid gap-20 mt-10">
                    {data.categories.map((c, i) => (
                        <div 
                            key={c.id} 
                            onClick={() => onScreenChange('detail')}
                            className="cursor-pointer group relative"
                        >
                            <div className="relative aspect-[16/11] overflow-hidden mb-8 shadow-xl">
                                <img src={c.images[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute top-0 right-0 bg-blue-600 p-8 text-white group-hover:translate-x-full transition-transform">
                                    <p className="text-3xl font-black tracking-tighter italic">0{i + 1}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-end border-b-4 border-slate-900 pb-8 px-2">
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{c.name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">{c.roomType} Γÿ║ {c.capacity} Guests</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-blue-600 italic tracking-tighter">Rp {c.pricePerNight?.toLocaleString()}</p>
                                    <p className="text-[10px] font-black text-slate-300 uppercase">per night</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function UrbanMinimalistDetail({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    const room = data.categories[0];
    return (
        <div className="bg-white min-h-full pb-24 animate-in slide-in-from-right duration-500">
            <div className="p-10">
                <div className="flex justify-between items-center mb-16">
                    <button onClick={() => onScreenChange('index')} className="text-slate-900 hover:text-blue-600 transition-colors active:scale-90 transform">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Technical Overview</p>
                    <div className="w-12 h-1 w-1 bg-slate-100 rounded-full" />
                </div>
                
                <div className="aspect-[4/5] bg-slate-900 mb-16 overflow-hidden shadow-2xl relative group">
                    <img src={room?.images[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-10 left-10 bg-white p-8 shadow-2xl">
                       <p className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">{room?.roomType}</p>
                    </div>
                </div>
                
                <div className="space-y-12">
                    <div className="flex justify-between items-end border-b-8 border-blue-600 pb-10">
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">{room?.name}</h2>
                        <div className="text-right">
                           <p className="text-2xl font-black text-slate-900 italic tracking-tighter">Rp {room?.pricePerNight?.toLocaleString()}</p>
                           <p className="text-[10px] font-black text-slate-300 uppercase">Selected Rate</p>
                        </div>
                    </div>
                    <p className="text-lg font-bold leading-relaxed text-slate-500 italic pr-10">{room?.description}</p>
                    <button className="w-full py-8 bg-slate-900 text-white font-black uppercase tracking-[0.5em] text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-2xl">
                        Confirm Stay ΓåÆ
                    </button>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 5: VINTAGE HERITAGE (Grand Style)       */
/* -------------------------------------------------------------------------- */

function VintageHeritageIndex({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    return (
        <div className="bg-[#FAF7F2] min-h-full pb-24 animate-in fade-in duration-1000 font-serif">
            <div className="pt-24 px-12 text-center mb-24 relative">
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-[#8C7B6E]" />
                <p className="text-[10px] font-bold text-[#8C7B6E] uppercase tracking-[0.6em] mb-8">Legendary Hospitality</p>
                <h2 className="text-6xl text-[#4A3E37] leading-[0.85] mb-12 italic tracking-tight">{data.name}</h2>
                <div className="flex justify-center gap-2 mb-10">
                   {[1,2,3,4,5].map(i => <span key={i} className="text-[#8C7B6E] text-xs font-serif">ΓÜà</span>)}
                </div>
                <p className="text-sm font-serif italic text-[#6B5E55] leading-relaxed px-6 max-w-sm mx-auto opacity-80">{data.description}</p>
            </div>
            
            <div className="px-10 space-y-32">
                {data.categories.map((c) => (
                    <div 
                        key={c.id} 
                        onClick={() => onScreenChange('detail')}
                        className="cursor-pointer group text-center"
                    >
                        <div className="relative aspect-[4/5] overflow-hidden mb-10 rounded-t-full border-[12px] border-white shadow-[0_48px_80px_-12px_rgba(74,62,55,0.2)]">
                            <img src={c.images[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110" />
                            <div className="absolute inset-0 bg-[#4A3E37]/10" />
                        </div>
                        <h4 className="text-4xl text-[#4A3E37] mb-4 italic leading-none">{c.name}</h4>
                        <div className="w-12 h-[1px] bg-[#8C7B6E]/30 mx-auto mb-4" />
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8C7B6E]">Inquire From Rp {c.pricePerNight?.toLocaleString()}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-40 pb-24 text-center border-t border-[#8C7B6E]/10 pt-20">
                <p className="text-[10px] font-bold text-[#8C7B6E] uppercase tracking-[0.4em] mb-6">Concierge Available 24/7</p>
                <button className="px-12 py-6 bg-[#4A3E37] text-[#FAF7F2] text-[10px] font-bold tracking-[0.5em] uppercase shadow-2xl hover:bg-[#3A312B] transition-all">
                    Inquire Availability
                </button>
            </div>
        </div>
    );
}

function VintageHeritageDetail({ data, onScreenChange }: { data: HotelFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
    const room = data.categories[0];
    return (
        <div className="bg-[#FAF7F2] min-h-full pb-24 animate-in fade-in duration-1000 font-serif">
            <div className="p-10 text-[#4A3E37]">
                <button onClick={() => onScreenChange('index')} className="mb-20 text-[10px] font-bold tracking-[0.4em] uppercase text-[#8C7B6E] flex items-center gap-4 hover:text-[#4A3E37] transition-colors">
                    <span className="text-2xl font-light italic">ΓåÉ</span> The Archives
                </button>
                
                <div className="relative aspect-[3/4] mb-20 rounded-t-full overflow-hidden border-[16px] border-white shadow-[0_64px_96px_-12px_rgba(74,62,55,0.3)]">
                    <img src={room?.images[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
                </div>
                
                <div className="text-center max-w-sm mx-auto space-y-12">
                   <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#8C7B6E] opacity-60">Imperial Collection</p>
                   <h2 className="text-6xl italic leading-[0.85] tracking-tighter mb-10">{room?.name}</h2>
                   <div className="w-20 h-[1px] bg-[#8C7B6E] mx-auto" />
                   <p className="text-base leading-relaxed text-[#6B5E55] italic px-4 opacity-90">{room?.description}</p>
                   
                   <div className="pt-24 border-t border-[#8C7B6E]/10">
                       <div className="space-y-12">
                           <div className="text-center">
                               <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#8C7B6E] mb-4">Daily Contribution</p>
                               <p className="text-4xl italic mb-10">Rp {room?.pricePerNight?.toLocaleString()}</p>
                           </div>
                           <button className="w-full py-7 bg-[#4A3E37] text-[#FAF7F2] text-[10px] font-bold tracking-[0.5em] uppercase shadow-2xl hover:bg-[#3A312B] transition-all active:scale-95">
                               Formal Request ΓåÆ
                           </button>
                       </div>
                   </div>
                </div>
            </div>
        </div>
    );
}
