import { useEffect, useState } from "react";
import type { HotelFormState } from "../lib/api";
import { HotelMobilePreview } from "./HotelMobilePreview";

interface HotelFormProps {
    title: string;
    onSubmit: (data: HotelFormState) => void;
    isSubmitting?: boolean;
    submitLabel: string;
    initialData?: HotelFormState; 
}
export function HotelForm({ title, onSubmit, isSubmitting, submitLabel, initialData }: HotelFormProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'rooms' | 'templates'>('general');
    const [activeScreen, setActiveScreen] = useState<'index' | 'detail'>('index');

    const [formData, setFormData] = useState<HotelFormState>(initialData || {
        name: 'Wondr Stay Sudirman 2',
        description: 'Hotel praktis dan modern untuk pelancong bisnis.',
        location: 'Jakarta Pusat',
        locationAddress: 'Jl. Jendral Sudirman Kav. 10',
        starRating: 3,
        bannerUrl: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
        templates: {
            index: {
                id: 1, title: 'Affordable Comfort',
                bannerUrl: ""
            },
            hotelDetail: {
                id: 1,
                title: ""
            }
        },
        categories: [
            {
                id: crypto.randomUUID(),
                name: "Smart Studio",
                roomType: "Standard",
                description: "Kamar efisien dengan desain compact.",
                pricePerNight: 450000,
                capacity: 2,
                stock: 25,
                bedConfig: { type: "Double Bed", count: 1 },
                roomAmenities: ["High-Speed WiFi", "Work Desk", "AC", "Cable TV"],
                bathAmenities: ["Shower", "Towels", "Soap & Shampoo"],
                images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
            }
        ]
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const updateCatField = (idx: number, field: string, value: any) => {
        const newCats = [...formData.categories];
        (newCats[idx] as any)[field] = value;
        setFormData({ ...formData, categories: newCats });
    };

    const handleTemplateChange = (type: 'index' | 'hotelDetail', id: number) => {
        setFormData(prev => ({
            ...prev,
            templates: {
                ...prev.templates,
                [type]: { ...prev.templates[type], id }
            }
        }));
        setActiveScreen(type === 'index' ? 'index' : 'detail');
    };

    const addNewCategory = () => {
        const newCat = {
            id: crypto.randomUUID(),
            name: "New Room Type",
            roomType: "Standard",
            description: "",
            pricePerNight: 0,
            capacity: 2,
            stock: 10,
            bedConfig: { type: "Single Bed", count: 1 },
            roomAmenities: [],
            bathAmenities: [],
            images: [""],
            isAvailable: true
        };
        setFormData(prev => ({
            ...prev,
            categories: [...prev.categories, newCat]
        }));
        setActiveTab('rooms');
    }

    const handleFinalSubmit = () => {
        const finalData = {
            ...formData,
            categories: formData.categories.map(cat => ({
                ...cat,
                roomAmenities: Array.isArray(cat.roomAmenities)
                    ? cat.roomAmenities.filter(a => a !== "")
                    : (cat.roomAmenities as string).split(',').map(s => s.trim()).filter(s => s !== ""),
                bathAmenities: Array.isArray(cat.bathAmenities)
                    ? cat.bathAmenities.filter(a => a !== "")
                    : (cat.bathAmenities as string).split(',').map(s => s.trim()).filter(s => s !== ""),
            }))
        };
        onSubmit(finalData);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <div className="w-[60%] flex flex-col bg-white border-r border-slate-200 overflow-hidden shadow-xl">
                {/* Header */}
                <div className="px-8 py-6 border-b flex justify-between items-center bg-white sticky top-0 z-20">
                    <h1 className="text-2xl font-black tracking-tight">{title}</h1>
                    <button onClick={handleFinalSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95">
                        {submitLabel}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-10">
                    <div className="flex gap-8 border-b">
                        {['general', 'rooms', 'templates'].map(t => (
                            <button key={t} onClick={() => setActiveTab(t as any)}
                                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* TAB GENERAL */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <section className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Hotel Name</label>
                                    <input className="w-full p-3 mt-1 bg-slate-50 border rounded-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Hotel Description</label>
                                    <textarea rows={3} className="w-full p-3 mt-1 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400">Location (City)</label>
                                    <input className="w-full p-3 mt-1 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400">Location Address</label>
                                    <input className="w-full p-3 mt-1 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.locationAddress} onChange={e => setFormData({ ...formData, locationAddress: e.target.value })} />
                                </div>
                            </section>

                            <section>
                                <label className="text-[10px] font-black uppercase text-slate-400">Hotel Banners (Array)</label>
                                {formData.bannerUrl.map((url, i) => (
                                    <div key={i} className="flex gap-2 mt-2">
                                        <input className="flex-1 p-3 bg-slate-50 border rounded-xl text-sm" value={url} placeholder="Banner URL..."
                                            onChange={e => {
                                                const newUrls = [...formData.bannerUrl];
                                                newUrls[i] = e.target.value;
                                                setFormData({ ...formData, bannerUrl: newUrls });
                                            }} />
                                        <button onClick={() => setFormData({ ...formData, bannerUrl: formData.bannerUrl.filter((_, idx) => idx !== i) })} className="text-red-500 px-2 font-bold">&times;</button>
                                    </div>
                                ))}
                                <button onClick={() => setFormData({ ...formData, bannerUrl: [...formData.bannerUrl, ''] })} className="mt-2 text-blue-600 text-xs font-bold">+ Add Banner</button>
                            </section>
                        </div>
                    )}

                    {/* TAB ROOMS */}
                    {activeTab === 'rooms' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {formData.categories.map((cat, idx) => (
                                <div key={cat.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400">Room Name</label>
                                            <input className="w-full p-3 mt-1 bg-white border rounded-xl font-bold" value={cat.name} onChange={e => updateCatField(idx, 'name', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400">Room Description</label>
                                            <textarea rows={2} className="w-full p-3 mt-1 bg-white border rounded-xl" value={cat.description} onChange={e => updateCatField(idx, 'description', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Price Per Night</label>
                                            <input type="number" className="w-full p-3 mt-1 bg-white border rounded-xl font-black text-blue-600" value={cat.pricePerNight} onChange={e => updateCatField(idx, 'pricePerNight', Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Room Type</label>
                                            <input className="w-full p-3 mt-1 bg-white border rounded-xl" value={cat.roomType} onChange={e => updateCatField(idx, 'roomType', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Capacity (Person)</label>
                                            <input type="number" className="w-full p-3 mt-1 bg-white border rounded-xl" value={cat.capacity} onChange={e => updateCatField(idx, 'capacity', Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Stock Room</label>
                                            <input type="number" className="w-full p-3 mt-1 bg-white border rounded-xl" value={cat.stock} onChange={e => updateCatField(idx, 'stock', Number(e.target.value))} />
                                        </div>
                                        <div className="col-span-2 grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400">Bed Type</label>
                                                <input className="w-full p-3 mt-1 bg-white border rounded-xl" value={cat.bedConfig.type} onChange={e => updateCatField(idx, 'bedConfig', { ...cat.bedConfig, type: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400">Bed Count</label>
                                                <input type="number" className="w-full p-3 mt-1 bg-white border rounded-xl" value={cat.bedConfig.count} onChange={e => updateCatField(idx, 'bedConfig', { ...cat.bedConfig, count: Number(e.target.value) })} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amenities Section */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Room Amenities (WiFi, AC, etc)</label>
                                            <input className="w-full p-3 mt-1 bg-white border rounded-xl text-xs" placeholder="Separate with comma (e.g WiFi, AC)"
                                                value={cat.roomAmenities.join(', ')}
                                                onChange={e => updateCatField(idx, 'roomAmenities', e.target.value.split(',').map(s => s.trim()))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Bath Amenities (Shower, etc)</label>
                                            <input className="w-full p-3 mt-1 bg-white border rounded-xl text-xs" placeholder="Separate with comma"
                                                value={cat.bathAmenities.join(', ')}
                                                onChange={e => updateCatField(idx, 'bathAmenities', e.target.value.split(',').map(s => s.trim()))} />
                                        </div>
                                    </div>

                                    {/* Room Images */}
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400">Room Detail Images (URL)</label>
                                        {cat.images.map((img, imgIdx) => (
                                            <div key={imgIdx} className="flex gap-2 mt-2">
                                                <input className="flex-1 p-3 bg-white border rounded-xl text-sm" value={img} placeholder="Image URL..."
                                                    onChange={e => {
                                                        const newImgs = [...cat.images];
                                                        newImgs[imgIdx] = e.target.value;
                                                        updateCatField(idx, 'images', newImgs);
                                                    }} />
                                                <button onClick={() => {
                                                    const newImgs = cat.images.filter((_, i) => i !== imgIdx);
                                                    updateCatField(idx, 'images', newImgs);
                                                }} className="text-red-500 font-bold">&times;</button>
                                            </div>
                                        ))}
                                        <button onClick={() => updateCatField(idx, 'images', [...cat.images, ''])} className="text-blue-600 text-xs font-bold mt-2">+ Add Room Image</button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addNewCategory} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50">+ Add Another Category</button>
                        </div>
                    )}

                    {activeTab === 'templates' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <section>
                                <h3 className="font-bold mb-4">Landing Page Template</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(id => (
                                        <button key={id} onClick={() => handleTemplateChange('index', id)}
                                            className={`p-10 rounded-3xl border-4 transition-all ${formData.templates.index.id === id ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                                            Layout {id}
                                        </button>
                                    ))}
                                </div>
                            </section>
                            <section>
                                <h3 className="font-bold mb-4">Detail Page Template</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(id => (
                                        <button key={id} onClick={() => handleTemplateChange('hotelDetail', id)}
                                            className={`p-10 rounded-3xl border-4 transition-all ${formData.templates.hotelDetail.id === id ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                                            Detail {id}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Mobile */}
            <div className="flex-1 flex items-center justify-center p-12 bg-slate-100">
                <div className="scale-[0.85] origin-center drop-shadow-2xl shadow-blue-900/10">
                    <HotelMobilePreview
                        data={formData}
                        activeScreen={activeScreen}
                        onScreenChange={setActiveScreen}
                    />
                </div>
            </div>
        </div>
    );
}