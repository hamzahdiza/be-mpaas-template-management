import { useState, useEffect, useRef } from 'react';

function ImageSlider({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (images.length <= 1 || isDragging) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
    }, [images, isDragging]);

    const handleStart = (e: any) => {
        setIsDragging(true);
        setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    };

    const handleMove = (e: any) => {
        if (!isDragging) return;
        const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const walk = x - startX;
        setTranslateX(walk);
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (translateX < -50 && current < images.length - 1) setCurrent(current + 1);
        if (translateX > 50 && current > 0) setCurrent(current - 1);
        setTranslateX(0);
    };

    return (
        <div className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
            onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}>

            <div className={`flex h-full ${!isDragging ? 'transition-transform duration-500' : ''}`}
                style={{ transform: `translateX(calc(-${current * 100}% + ${translateX}px))` }}>
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img || 'https://via.placeholder.com/400x300?text=No+Image'}
                        onDragStart={(e) => e.preventDefault()}
                        className="min-w-full h-full object-cover pointer-events-none select-none"
                    />
                ))}
            </div>

            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${current === i ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function HotelMobilePreview({ data, activeScreen, onScreenChange }: any) {
    const indexId = data.templates?.index?.id?.toString() || '1';
    const detailId = data.templates?.hotelDetail?.id?.toString() || '1';

    const renderGeneral = () => {
        switch (indexId) { 
            case '2': return <UrbanMinimalistGeneral data={data} onScreenChange={onScreenChange} />;
            case '3': return <LuxuryImmersiveGeneral data={data} onScreenChange={onScreenChange} />;
            default: return <DefaultGeneral data={data} onScreenChange={onScreenChange} />;
        }
    };

    const renderDetail = () => {
        switch (detailId) { 
            case '2': return <UrbanMinimalistDetail data={data} onScreenChange={onScreenChange} />;
            case '3': return <LuxuryImmersiveDetail data={data} onScreenChange={onScreenChange} />;
            default: return <DefaultDetail data={data} onScreenChange={onScreenChange} />;
        }
    };

    return (
        <div className="w-[375px] h-[780px] bg-white border-[12px] border-slate-900 rounded-[3.5rem] relative shadow-2xl overflow-hidden">
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />

            <div className="h-full overflow-y-auto scrollbar-hide bg-white">
                {activeScreen === 'index' ? renderGeneral() : renderDetail()}
            </div>
        </div>
    );
}

function DefaultGeneral({ data, onScreenChange }: any) {
    return (
        <div className="animate-in fade-in duration-500 flex flex-col min-h-full bg-slate-50">
            <div className="h-[300px] w-full relative flex-shrink-0 shadow-lg">
                <ImageSlider images={data.bannerUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                <div className="absolute top-12 left-6 right-6 z-20 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                        {[...Array(data.starRating)].map((_, i) => (
                            <span key={i} className="text-amber-400 text-xs">⭐</span>
                        ))}
                    </div>
                    <p className="text-white/80 text-[10px] uppercase tracking-widest font-bold">
                        {data.location}
                    </p>
                </div>

                <div className="absolute bottom-8 left-6 right-6 z-20">
                    <h2 className="text-white text-3xl font-black leading-tight tracking-tight">
                        {data.name}
                    </h2>
                    <p className="text-white/70 text-xs mt-2 mb-3 flex items-center gap-1.5 font-medium">
                        📍 {data.locationAddress}
                    </p>
                </div>
            </div>

            <div className="p-6 -mt-6 bg-slate-50 rounded-t-[2.5rem] relative z-20 flex-1">
                <div className='h-[100%] mb-4'>
                    <h4 className="text-[10px] font-black uppercase text-slate-300 mb-3 tracking-widest">
                        Overview
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {data.description}
                    </p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-300 mb-5 tracking-widest">
                        Our Rooms
                    </h4>
                    {data.categories.map((c: any) => (
                        <div
                            key={c.id}
                            onClick={() => onScreenChange('detail')}
                            className="group flex gap-5 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer"
                        >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                                <img
                                    src={c.images[0]}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    alt={c.name}
                                />
                            </div>
                            <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                    <h5 className="font-extrabold text-slate-800 text-base tracking-tight">{c.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                        {c.roomType} • Max {c.capacity} Guests
                                    </p>
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <p className="text-[14px] font-black text-blue-400 leading-none">
                                        Rp {c.pricePerNight?.toLocaleString()}
                                        <span className="text-[10px] text-slate-400 font-normal"> /night</span>
                                    </p>
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-md leading-none">→</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
function DefaultDetail({ data, onScreenChange }: any) {
    // Mengambil kategori pertama untuk preview
    const room = data.categories[0];

    return (
        <div className="animate-in slide-in-from-right duration-500 bg-white min-h-full flex flex-col">
            {/* 1. Header Navigation & Gallery */}
            <div className="h-80 w-full relative flex-shrink-0">
                <button
                    onClick={() => onScreenChange('index')}
                    className="absolute top-12 left-6 z-50 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-black transition-all"
                >
                    ←
                </button>
                <ImageSlider images={room?.images || []} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10" />
            </div>

            <div className="p-8 -mt-10 bg-white rounded-t-[3rem] relative z-20 flex-1 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest leading-none bg-blue-50 px-3 py-1.5 rounded-lg">
                            {room?.roomType}
                        </span>
                        <h2 className="text-[20px] font-black text-slate-600 mt-4 tracking-tighter leading-tight">{room?.name}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-[16px] border-y border-slate-100 mb-6">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Bed</p>
                        <p className="text-[14px] font-bold text-slate-800 leading-none">{room?.bedConfig?.count} {room?.bedConfig?.type}</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Max Guests</p>
                        <p className="text-[14px] font-bold text-slate-800 leading-none">{room?.capacity} Persons</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h4 className="text-[10px] font-black uppercase text-slate-300 mb-3 tracking-widest">Description</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {room?.description}
                    </p>
                </div>

                <div className="space-y-8">
                    {room?.roomAmenities?.length > 0 && (
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-slate-300 mb-4 tracking-widest">Room Features</h4>
                            <div className="flex flex-wrap gap-2.5">
                                {room.roomAmenities.map((item: string) => (
                                    <span key={item} className="text-[11px] bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold">
                                        ✓ {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {room?.bathAmenities?.length > 0 && (
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-slate-300 mb-4 tracking-widest">Bathroom</h4>
                            <div className="flex flex-wrap gap-2.5">
                                {room.bathAmenities.map((item: string) => (
                                    <span key={item} className="text-[11px] bg-slate-50 text-slate-500 px-4 py-2 rounded-full font-bold border border-slate-100">
                                        • {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 bg-white p-6 border-t border-slate-100 flex items-center justify-between z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Total Price</p>
                    <p className="text-[16px] font-black text-slate-900 tracking-tight">Rp {room?.pricePerNight?.toLocaleString()}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[2rem] font-black text-sm transition-all active:scale-95 shadow-xl shadow-blue-200">
                    Book This Room
                </button>
            </div>
        </div>
    );
}

function UrbanMinimalistGeneral({ data, onScreenChange }: any) {
    return (
        <div className="animate-in fade-in duration-500 p-6 pt-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[26px] font-black text-slate-800 tracking-tight leading-none mb-2">{data.name}</h2>
                    <p className="text-slate-400 text-xs flex items-center gap-1">📍 {data.location}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">👤</div>
            </div>

            <div className="relative h-48 rounded-[2.5rem] overflow-hidden mb-8 shadow-lg">
                <ImageSlider images={data.bannerUrl} />
            </div>

            <div className="space-y-6">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1">
                    {['All Rooms', 'Recommended', 'Popular'].map((tab, i) => (
                        <span key={i} className={`text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap ${i === 0 ? 'bg-black text-white' : 'bg-slate-50 text-slate-400'}`}>
                            {tab}
                        </span>
                    ))}
                </div>

                {data.categories.map((c: any) => (
                    <div key={c.id} onClick={() => onScreenChange('detail')} className="group relative">
                        <div className="w-full h-56 rounded-[2.5rem] overflow-hidden">
                            <img src={c.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-[1.5rem] shadow-xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm">{c.name}</h5>
                                    <p className="text-[10px] text-slate-500 font-medium">Starting from <span className="text-black font-bold">Rp {c.pricePerNight?.toLocaleString()}</span></p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">→</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UrbanMinimalistDetail({ data, onScreenChange }: any) {
    const room = data.categories[0];

    return (
        <div className="animate-in slide-in-from-bottom duration-500 h-full flex flex-col bg-white">
            <div className="h-80 relative flex-shrink-0">
                <ImageSlider images={room?.images || []} />
                <button
                    onClick={() => onScreenChange('index')}
                    className="absolute top-12 left-6 bg-white/90 backdrop-blur-md shadow-xl p-3 rounded-2xl text-black active:scale-90 transition-transform z-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="max-w-[70%]">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter">{room?.name}</h2>
                        <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">{room?.roomType} Suite</p>
                    </div>
                    <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                        {room?.stock} Left
                    </span>
                </div>

                <div className="flex gap-8 mb-8">
                    <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Capacity</p>
                        <p className="text-sm font-bold text-slate-700">{room?.capacity} Persons</p>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-100" />
                    <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Bed</p>
                        <p className="text-sm font-bold text-slate-700">{room?.bedConfig?.count} {room?.bedConfig?.type}</p>
                    </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed mb-10 font-medium">{room?.description}</p>

                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Core Amenities</h4>
                <div className="grid grid-cols-4 gap-6 mb-10">
                    {room?.roomAmenities?.slice(0, 4).map((item: string) => (
                        <div key={item} className="flex flex-col items-center gap-2 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-lg border border-slate-100">
                                {item.toLowerCase().includes('wifi') ? '📶' :
                                    item.toLowerCase().includes('ac') ? '❄️' :
                                        item.toLowerCase().includes('tv') ? '📺' : '✨'}
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{item.split(' ')[0]}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-6 pb-10">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Room Features</h4>
                        <div className="flex flex-wrap gap-2">
                            {room?.roomAmenities?.map((item: string) => (
                                <span key={item} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg italic">
                                    #{item.replace(/\s+/g, '')}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-50 flex items-center justify-between z-20">
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Price /Night</p>
                    <p className="text-xl font-black text-blue-600 tracking-tighter">Rp {room?.pricePerNight?.toLocaleString()}</p>
                </div>
                <button className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.15em] shadow-xl active:scale-95 transition-transform">
                    Reserve
                </button>
            </div>
        </div>
    );
}

function LuxuryImmersiveGeneral({ data, onScreenChange }: any) {
    return (
        <div className="animate-in fade-in duration-700">
            <div className="h-[450px] relative">
                <ImageSlider images={data.bannerUrl} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
                <div className="absolute top-20 w-full text-center px-6">
                    <p className="text-white/80 text-[10px] uppercase tracking-[0.3em] font-light mb-2">Luxury Experience</p>
                    <h2 className="text-white text-4xl font-serif italic">{data.name}</h2>
                </div>
            </div>

            <div className="p-8 -mt-20 relative z-10">
                <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-50">
                    <h3 className="text-slate-900 font-bold text-lg mb-6 text-center">Select Your Suite</h3>
                    <div className="space-y-10">
                        {data.categories.map((c: any) => (
                            <div key={c.id} onClick={() => onScreenChange('detail')} className="text-center cursor-pointer">
                                <img src={c.images[0]} className="w-full h-48 object-cover rounded-[2rem] mb-4" />
                                <h4 className="text-slate-800 font-black text-sm uppercase tracking-widest">{c.name}</h4>
                                <p className="text-amber-600 font-serif text-sm mt-1 italic">Explore this room — Rp {c.pricePerNight?.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LuxuryImmersiveDetail({ data, onScreenChange }: any) {
    const room = data.categories[0];

    return (
        <div className="animate-in slide-in-from-right duration-700 bg-slate-950 h-full text-white flex flex-col overflow-hidden">
            <div className="h-[50vh] relative flex-shrink-0 group">
                <ImageSlider images={room?.images || []} />
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-950 z-10" />
                
                <button 
                    onClick={() => onScreenChange('index')} 
                    className="absolute top-12 left-6 z-50 w-10 h-10 flex items-center justify-center border border-white/20 rounded-full backdrop-blur-md hover:bg-white hover:text-black transition-all duration-500"
                >
                    <span className="text-xl font-light">✕</span>
                </button>

                <div className="absolute bottom-12 left-8 z-20">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-amber-200/80 font-medium mb-2 block">
                        Premium {room?.roomType} Selection
                    </span>
                    <h2 className="text-4xl font-serif italic text-white leading-none tracking-tight">
                        {room?.name}
                    </h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-8 pb-32 -mt-4 relative z-20">
                <div className="h-[1px] w-full bg-gradient-to-r from-amber-200/50 to-transparent mb-10" />

                <p className="text-slate-400 text-sm leading-[1.8] font-light italic mb-12 tracking-wide">
                    {room?.description}
                </p>

                <div className="grid grid-cols-2 gap-y-10 mb-12 border-b border-white/5 pb-10">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-bold">The Space</p>
                        <p className="text-sm font-serif text-amber-100 italic">{room?.capacity} Distinguished Guests</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-bold">Resting</p>
                        <p className="text-sm font-serif text-amber-100 italic">{room?.bedConfig?.count} {room?.bedConfig?.type}</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-bold">Availability</p>
                        <p className="text-sm font-serif text-amber-100 italic">{room?.stock} Suites Remaining</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-bold">Atmosphere</p>
                        <p className="text-sm font-serif text-amber-100 italic">Signature View</p>
                    </div>
                </div>

                <div className="space-y-10">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.4em] text-amber-200/60 font-black mb-6">In-Suite Experience</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {room?.roomAmenities?.map((item: string) => (
                                <div key={item} className="flex items-center gap-3 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-200/30 group-hover:bg-amber-200 transition-colors" />
                                    <span className="text-[11px] text-slate-300 font-light tracking-wider">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.4em] text-amber-200/60 font-black mb-6">Bath & Wellness</h4>
                        <div className="flex flex-wrap gap-4">
                            {room?.bathAmenities?.map((item: string) => (
                                <span key={item} className="text-[10px] text-slate-400 font-light italic border-b border-white/5 pb-1">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-50">
                <div className="flex items-end justify-between gap-6">
                    <div className="mb-1">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-1">Nightly Rate</p>
                        <p className="text-2xl font-serif italic text-amber-200">
                            Rp {room?.pricePerNight?.toLocaleString()}
                        </p>
                    </div>
                    <button className="flex-1 max-w-[200px] py-5 bg-amber-200 text-slate-950 rounded-full font-bold tracking-[0.2em] text-[10px] hover:bg-amber-100 active:scale-95 transition-all shadow-[0_10px_30px_rgba(251,243,129,0.15)]">
                        RESERVE SUITE
                    </button>
                </div>
            </div>
        </div>
    );
}