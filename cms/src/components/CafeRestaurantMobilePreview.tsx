import type { CafeRestaurantFormState } from '../lib/api';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';

export function CafeRestaurantMobilePreview({ data, activeScreen, onScreenChange }: {
  data: CafeRestaurantFormState;
  activeScreen: 'index' | 'detail';
  onScreenChange: (screen: 'index' | 'detail') => void;
}) {
  const indexId = data.templates?.index?.id?.toString() || '1';
  const detailId = data.templates?.detail?.id?.toString() || '1';

  const renderIndex = () => {
    switch (indexId) {
      case '2': return <PremiumDarkModeIndex data={data} onScreenChange={onScreenChange} />;
      case '3': return <PlayfulColorfulIndex data={data} onScreenChange={onScreenChange} />;
      case '4': return <ElegantFineDiningIndex data={data} onScreenChange={onScreenChange} />;
      case '5': return <ModernGridIndex data={data} onScreenChange={onScreenChange} />;
      default: return <MinimalistCleanIndex data={data} onScreenChange={onScreenChange} />;
    }
  };

  const renderDetail = () => {
    switch (detailId) {
      case '2': return <PremiumDarkModeDetail data={data} onScreenChange={onScreenChange} />;
      case '3': return <PlayfulColorfulDetail data={data} onScreenChange={onScreenChange} />;
      case '4': return <ElegantFineDiningDetail data={data} onScreenChange={onScreenChange} />;
      case '5': return <ModernGridDetail data={data} onScreenChange={onScreenChange} />;
      default: return <MinimalistCleanDetail data={data} onScreenChange={onScreenChange} />;
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
/*                          TEMPLATE 1: MINIMALIST CLEAN (GoFood Style)       */
/* -------------------------------------------------------------------------- */

function MinimalistCleanIndex({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  return (
    <div className="bg-white min-h-full pb-24 animate-in fade-in duration-500">
      {/* Header with Search Bar Dummy */}
      <div className="px-5 pt-12 pb-4 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-full border border-slate-200">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-sm text-slate-400 font-medium">Cari menu di {data.name || 'Resto'}...</span>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Banner Card */}
        <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg group">
          <img src={data.bannerUrl?.[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">PROMO</span>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{data.category}</span>
            </div>
            <h2 className="text-2xl font-black leading-tight tracking-tight">{data.name || 'Restaurant Name'}</h2>
          </div>
        </div>

        {/* Info Strip */}
        <div className="flex justify-between items-center py-4 border-y border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[1,2,3,4].map(i => <span key={i} className="text-xs">★</span>)}
              <span className="text-slate-300 text-xs">★</span>
            </div>
            <span className="text-xs font-bold text-slate-900">4.8</span>
            <span className="text-[10px] text-slate-400 font-medium">(1rb+ Rating)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md">
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
               {data.halalStatus === 'halal-certified' ? 'Halal' : 'Muslim Friendly'}
             </span>
          </div>
        </div>

        {/* Category Filter Dummy */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {['Terlaris', 'Promo', 'Minuman', 'Paket Hemat'].map((cat, i) => (
            <button key={i} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-500'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-black text-slate-900 tracking-tight">Menu Terlaris</h3>
          <div className="grid gap-4">
            {data.menuItems?.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onScreenChange('detail')}
                className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-sm">
                    <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-emerald-600 font-black text-sm">Rp {item.price?.toLocaleString()}</p>
                    <button className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-emerald-100 transition-colors">
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Cart Bar Dummy */}
      <div className="fixed bottom-[3.5rem] left-1/2 -translate-x-1/2 w-[343px] z-30">
        <div className="bg-emerald-600 p-4 rounded-2xl shadow-xl shadow-emerald-200 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="absolute -top-1 -right-1 bg-rose-500 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">1</span>
            </div>
            <div>
              <p className="text-xs font-black leading-none mb-0.5">1 Item</p>
              <p className="text-[10px] opacity-80 leading-none">{data.name}</p>
            </div>
          </div>
          <p className="text-sm font-black">Rp {data.menuItems?.[0]?.price?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function MinimalistCleanDetail({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  const item = data.menuItems?.[0];
  return (
    <div className="bg-white min-h-full pb-32 animate-in slide-in-from-bottom duration-500">
      <div className="relative h-96">
        <img src={item?.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <button 
          onClick={() => onScreenChange('index')}
          className="absolute top-12 left-6 bg-white/90 p-2.5 rounded-full shadow-lg active:scale-90 transition-transform"
        >
          <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>
      <div className="px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-black text-slate-900 leading-tight pr-4">{item?.name || 'Menu Name'}</h2>
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
              <span className="text-emerald-600 text-xs">★</span>
              <span className="text-xs font-bold text-emerald-700">4.9</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">{item?.description || 'No description available for this item.'}</p>
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
               <p className="text-xl font-black text-emerald-600">Rp {item?.price?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl">
              <button className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-slate-400">-</button>
              <span className="font-black text-slate-900 text-sm">1</span>
              <button className="w-8 h-8 flex items-center justify-center bg-emerald-600 rounded-xl shadow-sm font-black text-white">+</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[343px] z-30 px-4">
        <button className="w-full bg-emerald-600 text-white py-4.5 rounded-2xl font-black shadow-xl shadow-emerald-200 active:scale-95 transition-all text-base">
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 2: PREMIUM DARK MODE (GrabFood Signature)*/
/* -------------------------------------------------------------------------- */

function PremiumDarkModeIndex({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  return (
    <div className="bg-slate-950 min-h-full pb-24 animate-in fade-in duration-700 text-slate-200">
      {/* Dynamic Header */}
      <div className="px-6 pt-16 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">Signature Series</p>
            <h2 className="text-4xl font-black italic tracking-tighter text-white mb-2 leading-none uppercase">{data.name}</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Open Now</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl">
            <img src={data.bannerUrl?.[0] || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="px-6 space-y-12">
        {/* Horizontal Menu Scroll */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">The Collection</h3>
            <span className="text-[10px] text-emerald-400 font-bold tracking-widest border-b border-emerald-400/30 pb-0.5">DISCOVER ALL</span>
          </div>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {data.menuItems?.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onScreenChange('detail')}
                className="min-w-[260px] group cursor-pointer"
              >
                <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-sm bg-slate-900">
                  <img src={item.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-black text-emerald-400 mb-1 tracking-tighter">PREMIUM</p>
                    <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none mb-3">{item.name}</h4>
                    <p className="text-lg font-black text-white italic">Rp {item.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusive Badge */}
        <div className="bg-emerald-600/10 border border-emerald-600/20 p-8 rounded-sm text-center">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-4">Limited Availability</p>
          <h4 className="text-xl font-black text-white italic tracking-tighter uppercase mb-6">Enjoy 30% Off Signature Items</h4>
          <button className="px-10 py-4 bg-emerald-600 text-black text-[10px] font-black tracking-[0.4em] uppercase hover:bg-emerald-500 transition-colors">
            Claim Offer
          </button>
        </div>
      </div>
    </div>
  );
}

function PremiumDarkModeDetail({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  const item = data.menuItems?.[0];
  return (
    <div className="bg-slate-950 min-h-full pb-24 animate-in slide-in-from-right duration-500 text-slate-200">
      <div className="relative h-[60vh]">
        <img src={item?.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover grayscale-[0.1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/40" />
        <button 
          onClick={() => onScreenChange('index')}
          className="absolute top-12 left-6 text-white p-3 bg-black/20 backdrop-blur-md rounded-full border border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      </div>
      <div className="px-10 -mt-32 relative z-10">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-4">Dish Overview</p>
        <h2 className="text-6xl font-black italic tracking-tighter text-white mb-8 leading-[0.8] uppercase">{item?.name}</h2>
        <p className="text-slate-400 leading-relaxed font-serif italic mb-12 text-lg border-l-2 border-emerald-600/30 pl-6">{item?.description}</p>
        <div className="grid grid-cols-2 gap-10 mb-16">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Price Value</p>
            <p className="text-3xl font-black text-emerald-400 tracking-tighter italic">Rp {item?.price?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Chef Note</p>
            <p className="text-sm font-bold text-white tracking-widest uppercase">Signature</p>
          </div>
        </div>
        <button className="w-full py-6 text-[10px] font-black tracking-[0.5em] uppercase border border-emerald-400/40 text-emerald-400 rounded-none hover:bg-emerald-400 hover:text-black transition-all duration-700 active:scale-95">
          ADD TO SIGNATURE BOX
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 3: PLAYFUL & COLORFUL (Promo Style)      */
/* -------------------------------------------------------------------------- */

function PlayfulColorfulIndex({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  return (
    <div className="bg-[#FFF4E0] min-h-full pb-24 animate-in zoom-in-95 duration-500">
      <div className="bg-rose-500 rounded-b-[4rem] px-8 pt-16 pb-14 shadow-2xl relative overflow-hidden">
        {/* Abstract Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-rose-400 rounded-full opacity-50 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-amber-400 rounded-full opacity-30 blur-3xl" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="p-4 bg-white rounded-[1.5rem] rotate-3 shadow-2xl">
            <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
          </div>
          <div className="text-right">
            <span className="bg-amber-400 text-rose-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">PROMO GILA!</span>
          </div>
        </div>
        <h2 className="text-5xl font-black text-white leading-[0.85] tracking-tighter uppercase relative z-10 drop-shadow-lg">{data.name}</h2>
      </div>

      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-rose-900/10 border-4 border-rose-50">
           <div className="flex justify-around text-center divide-x divide-slate-100">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Jarak</p>
                <p className="text-sm font-black text-slate-900">1.2 KM</p>
              </div>
              <div className="pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Rating</p>
                <p className="text-sm font-black text-rose-500">Γÿà 4.9</p>
              </div>
              <div className="pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Waktu</p>
                <p className="text-sm font-black text-slate-900">20 Mnt</p>
              </div>
           </div>
        </div>
      </div>

      <div className="px-6 mt-12 space-y-10">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Paling Laku! ΓÜí</h3>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-rose-500 font-black">ΓåÆ</div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2">
          {data.menuItems?.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onScreenChange('detail')}
              className="bg-white p-5 rounded-[3rem] min-w-[240px] shadow-2xl shadow-rose-900/5 cursor-pointer border-2 border-transparent hover:border-amber-400 transition-all active:scale-95 group"
            >
              <div className="relative mb-6">
                <img src={item.imageUrl || PLACEHOLDER_IMAGE} className="w-full aspect-square object-cover rounded-[2.5rem] shadow-xl transition-transform group-hover:rotate-2" />
                <div className="absolute -top-3 -right-3 bg-amber-400 text-rose-900 text-xs font-black px-4 py-2 rounded-2xl shadow-lg rotate-12">-50%</div>
              </div>
              <h4 className="font-black text-slate-900 text-lg mb-2 tracking-tight line-clamp-1">{item.name}</h4>
              <div className="flex items-center gap-3">
                 <p className="text-rose-500 font-black text-2xl tracking-tighter">Rp {(item.price/2).toLocaleString()}</p>
                 <p className="text-slate-300 font-bold text-xs line-through italic">Rp {item.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayfulColorfulDetail({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  const item = data.menuItems?.[0];
  return (
    <div className="bg-white min-h-full pb-24 animate-in fade-in duration-500">
      <div className="p-8">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => onScreenChange('index')}
            className="p-5 bg-[#FFF4E0] rounded-[2rem] active:scale-90 transition-all text-rose-500 shadow-lg shadow-rose-900/5"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="p-5 bg-rose-500 rounded-[2rem] text-white shadow-xl shadow-rose-500/30">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>
        </div>
        <div className="relative mb-14 group">
          <div className="absolute inset-0 bg-amber-400 rounded-[5rem] rotate-12 scale-95 opacity-20 transition-transform group-hover:rotate-[15deg]" />
          <div className="absolute inset-0 bg-rose-500 rounded-[5rem] -rotate-6 scale-95 opacity-10" />
          <img src={item?.imageUrl || PLACEHOLDER_IMAGE} className="relative w-full aspect-square object-cover rounded-[5rem] shadow-2xl" />
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-end">
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.8] uppercase">{item?.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-rose-500 px-6 py-3 rounded-[1.5rem] shadow-xl shadow-rose-500/20">
              <p className="text-white font-black text-2xl tracking-tighter italic">Rp {item?.price?.toLocaleString()}</p>
            </div>
            <div className="bg-amber-100 px-4 py-3 rounded-[1.5rem] flex items-center gap-2">
              <span className="text-rose-500 text-lg font-black">Γÿà 4.9</span>
            </div>
          </div>
          <p className="text-slate-500 font-bold leading-relaxed mb-12 text-lg italic">{item?.description}</p>
          <button className="w-full py-6 bg-rose-500 text-white rounded-[3rem] font-black text-xl shadow-2xl shadow-rose-500/40 active:scale-95 transition-all uppercase tracking-tighter">
            BELI SEKARANG! ≡ƒî┤
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 4: ELEGANT FINE DINING (Gourmet)         */
/* -------------------------------------------------------------------------- */

function ElegantFineDiningIndex({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  return (
    <div className="bg-[#FAF9F6] min-h-full pb-24 animate-in fade-in duration-1000 font-serif">
      {/* Refined Header */}
      <div className="px-12 pt-24 pb-20 text-center relative">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-slate-200" />
        <p className="text-[10px] tracking-[0.5em] uppercase text-slate-400 font-sans font-black mb-6">Experience Excellence</p>
        <h2 className="text-5xl font-medium text-slate-900 italic tracking-tight mb-6 leading-none">{data.name}</h2>
        <div className="flex justify-center items-center gap-4 mb-10">
           <div className="w-8 h-[1px] bg-slate-300" />
           <span className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-sans font-black">{data.location}</span>
           <div className="w-8 h-[1px] bg-slate-300" />
        </div>
      </div>

      <div className="px-10 space-y-32">
        {data.menuItems?.map((item, i) => (
          <div 
            key={item.id} 
            onClick={() => onScreenChange('detail')}
            className={`flex flex-col cursor-pointer group ${i % 2 === 1 ? 'items-end text-right' : 'items-start text-left'}`}
          >
            <div className="relative w-full aspect-[4/5] mb-12 overflow-hidden shadow-2xl">
              <img src={item.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
              <div className="absolute inset-0 border-[20px] border-[#FAF9F6]/5" />
            </div>
            <div className="space-y-4 max-w-[85%]">
               <h4 className="text-3xl italic text-slate-900 leading-none group-hover:text-emerald-800 transition-colors">{item.name}</h4>
               <p className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-sans font-black">CURATED SELECTION</p>
               <div className={`w-12 h-[1px] bg-slate-900 transition-all duration-700 group-hover:w-full ${i % 2 === 1 ? 'ml-auto' : 'mr-auto'}`} />
               <p className="text-sm text-slate-500 font-sans italic leading-relaxed line-clamp-3">{item.description}</p>
               <p className="text-xl text-slate-900 italic pt-2">Rp {item.price?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Elegant Footer Dummy */}
      <div className="mt-40 px-12 pb-24 text-center border-t border-slate-100 pt-20">
         <p className="text-[10px] tracking-[0.5em] uppercase text-slate-400 font-sans font-black mb-8">Table Reservation Required</p>
         <button className="px-12 py-5 border border-slate-900 text-[10px] tracking-[0.4em] uppercase font-sans font-black hover:bg-slate-900 hover:text-white transition-all">
            Book an Experience
         </button>
      </div>
    </div>
  );
}

function ElegantFineDiningDetail({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  const item = data.menuItems?.[0];
  return (
    <div className="bg-[#FAF9F6] min-h-full pb-32 animate-in fade-in duration-1000 font-serif">
      <div className="p-10">
        <button 
          onClick={() => onScreenChange('index')}
          className="mb-16 text-[10px] font-sans font-black tracking-[0.4em] uppercase text-slate-400 flex items-center gap-3 active:translate-x-[-4px] transition-transform"
        >
          <span className="text-xl leading-none font-light">ΓåÉ</span> Return to Menu
        </button>
        
        <div className="relative aspect-[3/4] mb-16 shadow-2xl group overflow-hidden">
          <img src={item?.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[5000ms]" />
          <div className="absolute inset-0 bg-black/5" />
        </div>
        
        <div className="space-y-10">
          <div className="text-center">
             <p className="text-[10px] font-sans font-black tracking-[0.5em] uppercase text-slate-300 mb-6">Signature Dish</p>
             <h2 className="text-6xl italic text-slate-900 mb-8 leading-[0.8] tracking-tighter">{item?.name}</h2>
             <div className="w-12 h-[1px] bg-slate-900 mx-auto" />
          </div>
          
          <p className="text-base leading-relaxed text-slate-600 text-center font-sans italic max-w-sm mx-auto">{item?.description}</p>
          
          <div className="flex flex-col items-center pt-16 space-y-12">
            <div className="text-center">
              <p className="text-[10px] font-sans font-black tracking-[0.4em] uppercase text-slate-400 mb-2">Investment</p>
              <p className="text-3xl text-slate-900 italic">Rp {item?.price?.toLocaleString()}</p>
            </div>
            <button className="w-full py-6 bg-slate-900 text-white text-[10px] font-sans font-black tracking-[0.5em] uppercase hover:bg-slate-800 transition-all active:scale-95 shadow-2xl">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          TEMPLATE 5: MODERN GRID (Catalog)                */
/* -------------------------------------------------------------------------- */

function ModernGridIndex({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  return (
    <div className="bg-white min-h-full pb-24 animate-in slide-in-from-left duration-500">
      {/* Search Header */}
      <div className="px-6 pt-14 pb-6 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">{data.name}</h2>
           <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
           </div>
        </div>
        <div className="relative group">
           <input type="text" placeholder="Find your cravings..." className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all" />
           <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="px-6 space-y-10 mt-4">
        {/* Horizontal Chips */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
           {['All', 'Popular', 'Deals', 'New Arrival'].map((c, i) => (
             <span key={i} className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-tighter uppercase transition-all ${i === 0 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
               {c}
             </span>
           ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 gap-5">
          {data.menuItems?.map((item, i) => (
            <div 
              key={item.id} 
              onClick={() => onScreenChange('detail')}
              className={`group cursor-pointer ${i % 3 === 0 ? 'col-span-2' : ''}`}
            >
              <div className={`relative overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-sm transition-all group-hover:shadow-xl ${i % 3 === 0 ? 'h-56' : 'h-48'}`}>
                <img src={item.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
                   <p className="text-xs font-black text-emerald-600 tracking-tighter">Rp {item.price?.toLocaleString()}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <p className="text-white text-xs font-bold leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </div>
              <div className="mt-3 px-2 flex justify-between items-center">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-tighter">{item.name}</h4>
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModernGridDetail({ data, onScreenChange }: { data: CafeRestaurantFormState; onScreenChange: (screen: 'index' | 'detail') => void }) {
  const item = data.menuItems?.[0];
  return (
    <div className="bg-white min-h-full pb-24 animate-in fade-in duration-500">
      <div className="p-6">
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => onScreenChange('index')} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 active:scale-90 transition-transform shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Product Essence</span>
          <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-rose-500 shadow-sm">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </button>
        </div>
        
        <div className="bg-slate-50 rounded-[4rem] p-10 mb-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <img src={item?.imageUrl || PLACEHOLDER_IMAGE} className="w-64 h-64 object-cover rounded-full mx-auto shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border-8 border-white mb-10 transition-transform duration-700 group-hover:scale-110" />
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2 uppercase italic leading-none">{item?.name}</h2>
          <p className="text-emerald-600 font-black text-2xl tracking-tighter">Rp {item?.price?.toLocaleString()}</p>
        </div>
        
        <div className="space-y-10 px-4">
          <div className="flex gap-10">
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Calories</p>
               <p className="text-sm font-black text-slate-900 tracking-tighter">450 kcal</p>
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Prep Time</p>
               <p className="text-sm font-black text-slate-900 tracking-tighter">15 mins</p>
             </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-3">Product Story</h4>
            <p className="text-base font-bold leading-relaxed text-slate-500 italic">{item?.description}</p>
          </div>
          <div className="pt-8">
            <button className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-xs">
              ADD TO BASKET ΓåÆ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
