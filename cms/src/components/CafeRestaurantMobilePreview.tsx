interface CafeRestaurantMobilePreviewProps {
  data: {
    category: 'cafe' | 'restaurant';
    name: string;
    description?: string;
    location?: string;
    halalStatus?: string;
    openTime?: string;
    closeTime?: string;
    priceRangeMin?: number;
    priceRangeMax?: number;
    bannerUrl?: string[];
    menuItems?: { id?: string; name: string; description?: string; price: number; imageUrl?: string }[];
    templates?: {
      index: { id: number };
      detail: { id: number };
    };
  };
  activeScreen: 'index' | 'detail';
  onScreenChange: (screen: 'index' | 'detail') => void;
}

function toRupiah(value?: number) {
  return `Rp ${(value || 0).toLocaleString('id-ID')}`;
}

export function CafeRestaurantMobilePreview({ data, activeScreen, onScreenChange }: CafeRestaurantMobilePreviewProps) {
  const banner = data.bannerUrl?.[0] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085';
  const menu = data.menuItems || [];
  const templateId = activeScreen === 'index' ? data.templates?.index?.id || 1 : data.templates?.detail?.id || 1;

  const shellClass =
    templateId === 2
      ? 'bg-slate-50'
      : templateId === 3
        ? 'bg-neutral-900 text-white'
        : templateId === 4
          ? 'bg-amber-50'
          : templateId === 5
            ? 'bg-emerald-50'
            : 'bg-white';

  return (
    <div className="w-[375px] h-[780px] bg-white border-[12px] border-slate-900 rounded-[3.5rem] relative shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-1/2 z-20 w-32 h-7 rounded-b-3xl -translate-x-1/2 bg-slate-900" />
      <div className={`h-full overflow-y-auto pt-10 ${shellClass}`}>
        {activeScreen === 'index' ? (
          <div>
            <img src={banner} className="w-full h-52 object-cover" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight">{data.name || `${data.category === 'cafe' ? 'Cafe' : 'Restoran'} Anda`}</h3>
                <button
                  onClick={() => onScreenChange('detail')}
                  className="text-xs px-3 py-1.5 rounded-full bg-black text-white"
                >
                  Lihat Detail
                </button>
              </div>
              <p className="text-xs opacity-80">{data.description || 'Deskripsi usaha akan tampil di sini.'}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/70 p-2 border border-black/5">
                  <p className="opacity-60">Jam Operasional</p>
                  <p className="font-semibold">{data.openTime || '09:00'} - {data.closeTime || '22:00'}</p>
                </div>
                <div className="rounded-lg bg-white/70 p-2 border border-black/5">
                  <p className="opacity-60">Kisaran Harga</p>
                  <p className="font-semibold">{toRupiah(data.priceRangeMin)} - {toRupiah(data.priceRangeMax)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <button onClick={() => onScreenChange('index')} className="text-sm font-semibold mb-3">
              ← Kembali
            </button>
            <h4 className="text-lg font-black mb-1">Menu {data.name || 'Unggulan'}</h4>
            <p className="text-xs opacity-70 mb-4">{data.location || 'Lokasi belum diisi'} • {data.halalStatus || 'halal-certified'}</p>
            <div className="space-y-3">
              {menu.length > 0 ? (
                menu.slice(0, 4).map((item, idx) => (
                  <div key={item.id || idx} className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{item.name || 'Menu'}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{item.description || 'Deskripsi menu'}</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">{toRupiah(item.price)}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">Belum ada menu ditambahkan.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
