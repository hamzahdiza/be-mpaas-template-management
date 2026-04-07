import { useState, useEffect } from 'react';

function ImageSlider({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
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
        <div className="overflow-hidden relative w-full h-full cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
            onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}>

            <div className={`flex h-full ${!isDragging ? 'transition-transform duration-500' : ''}`}
                style={{ transform: `translateX(calc(-${current * 100}% + ${translateX}px))` }}>
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img || 'https://via.placeholder.com/400x300?text=No+Image'}
                        onDragStart={(e) => e.preventDefault()}
                        className="object-cover min-w-full h-full pointer-events-none select-none"
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

            <div className="absolute top-0 left-1/2 z-50 w-32 h-7 rounded-b-3xl -translate-x-1/2 bg-slate-900" />

            <div className="overflow-y-auto h-full bg-white scrollbar-hide">
                {activeScreen === 'index' ? renderGeneral() : renderDetail()}
            </div>
        </div>
    );
}

function DefaultGeneral({ data, onScreenChange }: any) {
    return (
        <div className="flex flex-col min-h-full duration-500 animate-in fade-in bg-slate-50">
            <div className="h-[300px] w-full relative flex-shrink-0 shadow-lg">
                <ImageSlider images={data.bannerUrl} />
                <div className="absolute inset-0 z-10 bg-gradient-to-t to-transparent from-black/90 via-black/20" />

                <div className="flex absolute right-6 left-6 top-12 z-20 justify-between items-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                        {[...Array(data.starRating)].map((_, i) => (
                            <span key={i} className="text-xs text-amber-400">⭐</span>
                        ))}
                    </div>
                    <p className="text-white/80 text-[10px] uppercase tracking-widest font-bold">
                        {data.location}
                    </p>
                </div>

                <div className="absolute right-6 left-6 bottom-8 z-20">
                    <h2 className="text-3xl font-black tracking-tight leading-tight text-white">
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
                    <p className="text-sm font-medium leading-relaxed text-slate-600">
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
                            <div className="overflow-hidden flex-shrink-0 w-24 h-24 rounded-2xl shadow-inner">
                                <img
                                    src={c.images[0]}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    alt={c.name}
                                />
                            </div>
                            <div className="flex flex-col flex-1 justify-between py-1">
                                <div>
                                    <h5 className="text-base font-extrabold tracking-tight text-slate-800">{c.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                        {c.roomType} • Max {c.capacity} Guests
                                    </p>
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <p className="text-[14px] font-black text-blue-400 leading-none">
                                        Rp {c.pricePerNight?.toLocaleString()}
                                        <span className="text-[10px] text-slate-400 font-normal"> /night</span>
                                    </p>
                                    <div className="flex justify-center items-center w-8 h-8 text-xs leading-none text-white rounded-full shadow-md bg-slate-900">→</div>
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
        <div className="flex flex-col min-h-full bg-white duration-500 animate-in slide-in-from-right">
            {/* 1. Header Navigation & Gallery */}
            <div className="relative flex-shrink-0 w-full h-80">
                <button
                    onClick={() => onScreenChange('index')}
                    className="flex absolute left-6 top-12 z-50 justify-center items-center w-12 h-12 text-white rounded-2xl border backdrop-blur-xl transition-all bg-white/20 border-white/20 hover:bg-white hover:text-black"
                >
                    ←
                </button>
                <ImageSlider images={room?.images || []} />
                <div className="absolute inset-0 z-10 bg-gradient-to-b via-transparent to-transparent from-black/50" />
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
                    <div className="flex flex-col items-center p-5 text-center rounded-2xl border bg-slate-50 border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Bed</p>
                        <p className="text-[14px] font-bold text-slate-800 leading-none">{room?.bedConfig?.count} {room?.bedConfig?.type}</p>
                    </div>
                    <div className="flex flex-col items-center p-5 text-center rounded-2xl border bg-slate-50 border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Max Guests</p>
                        <p className="text-[14px] font-bold text-slate-800 leading-none">{room?.capacity} Persons</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h4 className="text-[10px] font-black uppercase text-slate-300 mb-3 tracking-widest">Description</h4>
                    <p className="text-sm font-medium leading-relaxed text-slate-600">
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
        <div className="p-6 pt-12 duration-500 animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[26px] font-black text-slate-800 tracking-tight leading-none mb-2">{data.name}</h2>
                    <p className="flex gap-1 items-center text-xs text-slate-400">📍 {data.location}</p>
                </div>
                <div className="flex justify-center items-center w-10 h-10 text-lg rounded-full bg-slate-100">👤</div>
            </div>

            <div className="relative h-48 rounded-[2.5rem] overflow-hidden mb-8 shadow-lg">
                <ImageSlider images={data.bannerUrl} />
            </div>

            <div className="space-y-6">
                <div className="flex overflow-x-auto gap-4 py-1 scrollbar-hide">
                    {['All Rooms', 'Recommended', 'Popular'].map((tab, i) => (
                        <span key={i} className={`text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap ${i === 0 ? 'bg-black text-white' : 'bg-slate-50 text-slate-400'}`}>
                            {tab}
                        </span>
                    ))}
                </div>

                {data.categories.map((c: any) => (
                    <div key={c.id} onClick={() => onScreenChange('detail')} className="relative group">
                        <div className="w-full h-56 rounded-[2.5rem] overflow-hidden">
                            <img src={c.images[0]} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-[1.5rem] shadow-xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h5 className="text-sm font-bold text-slate-800">{c.name}</h5>
                                    <p className="text-[10px] text-slate-500 font-medium">Starting from <span className="font-bold text-black">Rp {c.pricePerNight?.toLocaleString()}</span></p>
                                </div>
                                <div className="flex justify-center items-center w-8 h-8 text-xs text-white bg-black rounded-full">→</div>
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
        <div className="flex flex-col h-full bg-white duration-500 animate-in slide-in-from-bottom">
            <div className="relative flex-shrink-0 h-80">
                <ImageSlider images={room?.images || []} />
                <button
                    onClick={() => onScreenChange('index')}
                    className="absolute left-6 top-12 z-50 p-3 text-black rounded-2xl shadow-xl backdrop-blur-md transition-transform bg-white/90 active:scale-90"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
            </div>

            <div className="overflow-y-auto flex-1 p-8 scrollbar-hide">
                <div className="flex justify-between items-start mb-6">
                    <div className="max-w-[70%]">
                        <h2 className="text-2xl font-black tracking-tighter leading-tight text-slate-900">{room?.name}</h2>
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

                <p className="mb-10 text-xs font-medium leading-relaxed text-slate-500">{room?.description}</p>

                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Core Amenities</h4>
                <div className="grid grid-cols-4 gap-6 mb-10">
                    {room?.roomAmenities?.slice(0, 4).map((item: string) => (
                        <div key={item} className="flex flex-col gap-2 items-center text-center">
                            <div className="flex justify-center items-center w-12 h-12 text-lg rounded-2xl border bg-slate-50 border-slate-100">
                                {item.toLowerCase().includes('wifi') ? '📶' :
                                    item.toLowerCase().includes('ac') ? '❄️' :
                                        item.toLowerCase().includes('tv') ? '📺' : '✨'}
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{item.split(' ')[0]}</span>
                        </div>
                    ))}
                </div>

                <div className="pb-10 space-y-6">
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

            <div className="flex z-20 justify-between items-center p-6 bg-white border-t border-slate-50">
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Price /Night</p>
                    <p className="text-xl font-black tracking-tighter text-blue-600">Rp {room?.pricePerNight?.toLocaleString()}</p>
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
        <div className="duration-700 animate-in fade-in">
            <div className="h-[450px] relative">
                <ImageSlider images={data.bannerUrl} />
                <div className="absolute inset-0 bg-gradient-to-b via-transparent to-white from-black/40" />
                <div className="absolute top-20 px-6 w-full text-center">
                    <p className="text-white/80 text-[10px] uppercase tracking-[0.3em] font-light mb-2">Luxury Experience</p>
                    <h2 className="font-serif text-4xl italic text-white">{data.name}</h2>
                </div>
            </div>

            <div className="relative z-10 p-8 -mt-20">
                <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-50">
                    <h3 className="mb-6 text-lg font-bold text-center text-slate-900">Select Your Suite</h3>
                    <div className="space-y-10">
                        {data.categories.map((c: any) => (
                            <div key={c.id} onClick={() => onScreenChange('detail')} className="text-center cursor-pointer">
                                <img src={c.images[0]} className="w-full h-48 object-cover rounded-[2rem] mb-4" />
                                <h4 className="text-sm font-black tracking-widest uppercase text-slate-800">{c.name}</h4>
                                <p className="mt-1 font-serif text-sm italic text-amber-600">Explore this room — Rp {c.pricePerNight?.toLocaleString()}</p>
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
        <div className="flex overflow-hidden flex-col h-full text-white duration-700 animate-in slide-in-from-right bg-slate-950">
            <div className="h-[50vh] relative flex-shrink-0 group">
                <ImageSlider images={room?.images || []} />
                
                <div className="absolute inset-0 z-10 bg-gradient-to-b via-transparent from-black/60 to-slate-950" />
                
                <button 
                    onClick={() => onScreenChange('index')} 
                    className="flex absolute left-6 top-12 z-50 justify-center items-center w-10 h-10 rounded-full border backdrop-blur-md transition-all duration-500 border-white/20 hover:bg-white hover:text-black"
                >
                    <span className="text-xl font-light">✕</span>
                </button>

                <div className="absolute left-8 bottom-12 z-20">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-amber-200/80 font-medium mb-2 block">
                        Premium {room?.roomType} Selection
                    </span>
                    <h2 className="font-serif text-4xl italic tracking-tight leading-none text-white">
                        {room?.name}
                    </h2>
                </div>
            </div>

            <div className="overflow-y-auto relative z-20 flex-1 px-8 pb-32 -mt-4 scrollbar-hide">
                <div className="h-[1px] w-full bg-gradient-to-r from-amber-200/50 to-transparent mb-10" />

                <p className="text-slate-400 text-sm leading-[1.8] font-light italic mb-12 tracking-wide">
                    {room?.description}
                </p>

                <div className="grid grid-cols-2 gap-y-10 pb-10 mb-12 border-b border-white/5">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-bold">The Space</p>
                        <p className="font-serif text-sm italic text-amber-100">{room?.capacity} Distinguished Guests</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-bold">Resting</p>
                        <p className="font-serif text-sm italic text-amber-100">{room?.bedConfig?.count} {room?.bedConfig?.type}</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-bold">Availability</p>
                        <p className="font-serif text-sm italic text-amber-100">{room?.stock} Suites Remaining</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2 font-bold">Atmosphere</p>
                        <p className="font-serif text-sm italic text-amber-100">Signature View</p>
                    </div>
                </div>

                <div className="space-y-10">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.4em] text-amber-200/60 font-black mb-6">In-Suite Experience</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {room?.roomAmenities?.map((item: string) => (
                                <div key={item} className="flex gap-3 items-center group">
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

            <div className="absolute right-0 bottom-0 left-0 z-50 p-8 bg-gradient-to-t to-transparent from-slate-950 via-slate-950/95">
                <div className="flex gap-6 justify-between items-end">
                    <div className="mb-1">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-1">Nightly Rate</p>
                        <p className="font-serif text-2xl italic text-amber-200">
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
