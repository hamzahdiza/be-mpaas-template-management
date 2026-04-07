import { useEffect, useState } from 'react';
import type { CafeRestaurantFormState } from '../lib/api';
import { CafeRestaurantMobilePreview } from './CafeRestaurantMobilePreview';

interface CafeRestaurantFormProps {
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  initialData?: CafeRestaurantFormState;
  onSubmit?: (data: CafeRestaurantFormState) => void;
  isViewMode?: boolean;
}

const defaultState: CafeRestaurantFormState = {
  category: 'cafe',
  name: '',
  description: '',
  templates: {
    index: { id: 1, title: '', bannerUrl: '' },
    detail: { id: 1, title: '', bannerUrl: '' },
  },
  location: '',
  locationAddress: '',
  locationUrl: '',
  halalStatus: 'halal-certified',
  openTime: '09:00',
  closeTime: '22:00',
  priceRangeMin: 25000,
  priceRangeMax: 150000,
  bannerUrl: [''],
  amenities: ['Musholla'],
  menuItems: [{ id: crypto.randomUUID(), name: 'Menu Utama', description: '', price: 30000, imageUrl: '', isAvailable: true }],
};

export function CafeRestaurantForm({ title, submitLabel, isSubmitting, initialData, onSubmit, isViewMode = false }: CafeRestaurantFormProps) {
  const [formData, setFormData] = useState<CafeRestaurantFormState>(initialData || defaultState);
  const [activeStep, setActiveStep] = useState(0);
  const [activeScreen, setActiveScreen] = useState<'index' | 'detail'>('index');

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const steps = [
    { id: 'general', title: 'General Info' },
    { id: 'menu', title: 'Menu Items' },
    { id: 'templates', title: 'Template Selection' },
  ];

  const updateMenu = (index: number, field: 'name' | 'description' | 'price', value: string | number) => {
    const next = [...formData.menuItems];
    next[index] = {
      ...next[index],
      [field]: field === 'price' ? Number(value) : value,
    };
    setFormData((prev) => ({ ...prev, menuItems: next }));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <div className="w-[60%] flex flex-col bg-white border-r border-slate-200 overflow-hidden shadow-xl">
        <div className="px-8 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-20">
          <h1 className="text-2xl font-black tracking-tight">{title}</h1>
          {!isViewMode && (
            <button
              onClick={() => onSubmit?.(formData)}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95"
            >
              {isSubmitting ? 'Menyimpan...' : submitLabel}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="px-6">
            <div className="flex items-start justify-between w-full">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex items-start ${index === steps.length - 1 ? 'flex-none' : 'flex-1'}`}>
                  <div className="relative flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setActiveStep(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors ${index <= activeStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {index + 1}
                    </button>
                    <div className={`absolute top-10 w-32 left-1/2 -translate-x-1/2 text-center text-xs ${index === activeStep ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                  </div>
                  {index !== steps.length - 1 && (
                    <div className={`flex-1 h-1 mt-3.5 mx-2 rounded transition-colors ${index < activeStep ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {activeStep === 0 && (
            <fieldset disabled={isViewMode}>
              <div className="space-y-6 pt-8">
                <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Kategori
                  <select className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as 'cafe' | 'restaurant' }))}>
                    <option value="cafe">Cafe</option>
                    <option value="restaurant">Restoran</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Halal Status
                  <select className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.halalStatus} onChange={(e) => setFormData((prev) => ({ ...prev, halalStatus: e.target.value as CafeRestaurantFormState['halalStatus'] }))}>
                    <option value="halal-certified">Halal Certified</option>
                    <option value="muslim-friendly">Muslim Friendly</option>
                    <option value="non-halal">Non Halal</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-gray-700 col-span-2">
                  Nama
                  <input className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                </label>
                <label className="text-sm font-medium text-gray-700 col-span-2">
                  Deskripsi
                  <textarea rows={3} className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Lokasi
                  <input className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Alamat
                  <input className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.locationAddress} onChange={(e) => setFormData((p) => ({ ...p, locationAddress: e.target.value }))} />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Jam Buka
                  <input type="time" className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.openTime} onChange={(e) => setFormData((p) => ({ ...p, openTime: e.target.value }))} />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Jam Tutup
                  <input type="time" className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.closeTime} onChange={(e) => setFormData((p) => ({ ...p, closeTime: e.target.value }))} />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Harga Min
                  <input type="number" className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.priceRangeMin} onChange={(e) => setFormData((p) => ({ ...p, priceRangeMin: Number(e.target.value) }))} />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Harga Max
                  <input type="number" className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.priceRangeMax} onChange={(e) => setFormData((p) => ({ ...p, priceRangeMax: Number(e.target.value) }))} />
                </label>
                </div>
              </div>
            </fieldset>
          )}

          {activeStep === 1 && (
            <fieldset disabled={isViewMode}>
              <div className="space-y-4 pt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-700">Daftar Menu</h2>
                  <button
                    className="text-xs font-semibold text-emerald-600"
                    onClick={() => setFormData((prev) => ({ ...prev, menuItems: [...prev.menuItems, { id: crypto.randomUUID(), name: '', description: '', price: 0, imageUrl: '', isAvailable: true }] }))}
                  >
                    + Tambah Menu
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.menuItems.map((item, idx) => (
                    <div key={item.id || idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <input className="p-2 border border-gray-300 rounded-lg" placeholder="Nama menu" value={item.name} onChange={(e) => updateMenu(idx, 'name', e.target.value)} />
                      <input className="p-2 border border-gray-300 rounded-lg" placeholder="Harga" type="number" value={item.price} onChange={(e) => updateMenu(idx, 'price', e.target.value)} />
                      <input className="p-2 border border-gray-300 rounded-lg md:col-span-2" placeholder="Deskripsi menu" value={item.description} onChange={(e) => updateMenu(idx, 'description', e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            </fieldset>
          )}

          {activeStep === 2 && (
            <fieldset disabled={isViewMode}>
              <div className="space-y-6 pt-8">
                <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Template Landing
                  <select className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.templates.index.id} onChange={(e) => setFormData((prev) => ({ ...prev, templates: { ...prev.templates, index: { ...prev.templates.index, id: Number(e.target.value) } } }))}>
                    {[1, 2, 3, 4, 5].map((id) => <option key={id} value={id}>Template {id}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Template Detail
                  <select className="w-full p-2 mt-1 border border-gray-300 rounded-lg" value={formData.templates.detail.id} onChange={(e) => setFormData((prev) => ({ ...prev, templates: { ...prev.templates, detail: { ...prev.templates.detail, id: Number(e.target.value) } } }))}>
                    {[1, 2, 3, 4, 5].map((id) => <option key={id} value={id}>Template {id}</option>)}
                  </select>
                </label>
              </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Banner URLs</label>
                  {formData.bannerUrl.map((url, i) => (
                    <div key={i} className="flex gap-2 mt-2">
                      <input
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                        value={url}
                        placeholder="https://..."
                        onChange={(e) => {
                          const next = [...formData.bannerUrl];
                          next[i] = e.target.value;
                          setFormData((prev) => ({ ...prev, bannerUrl: next }));
                        }}
                      />
                      <button className="px-2 text-red-500 font-bold" onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: prev.bannerUrl.filter((_, idx) => idx !== i) }))}>
                        ×
                      </button>
                    </div>
                  ))}
                  <button className="mt-2 text-xs text-emerald-600 font-semibold" onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: [...prev.bannerUrl, ''] }))}>
                    + Tambah Banner
                  </button>
                </div>
              </div>
            </fieldset>
          )}

          <div className="flex justify-between pt-2">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-12 bg-slate-100">
        <div className="mb-4">
          <div className="flex justify-center gap-2 mb-3">
            <button onClick={() => setActiveScreen('index')} className={`px-3 py-1.5 text-xs rounded-full ${activeScreen === 'index' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200'}`}>
              Landing
            </button>
            <button onClick={() => setActiveScreen('detail')} className={`px-3 py-1.5 text-xs rounded-full ${activeScreen === 'detail' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200'}`}>
              Detail
            </button>
          </div>
          <div className="scale-[0.85] origin-center drop-shadow-2xl">
            <CafeRestaurantMobilePreview data={formData} activeScreen={activeScreen} onScreenChange={setActiveScreen} />
          </div>
        </div>
      </div>
    </div>
  );
}
