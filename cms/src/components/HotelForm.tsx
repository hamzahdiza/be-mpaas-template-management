import { useEffect, useState } from "react";
import type { HotelFormState } from "../lib/api";
import { HotelMobilePreview } from "./HotelMobilePreview";

interface HotelFormProps {
    title: string;
    onSubmit?: (data: HotelFormState) => void;
    isSubmitting?: boolean;
    submitLabel: string;
    initialData?: HotelFormState;
    isViewMode?: boolean;
}
export function HotelForm({ title, onSubmit, isSubmitting, submitLabel, initialData, isViewMode = false }: HotelFormProps) {
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
        if (!onSubmit) return;
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
        <div className="flex h-screen font-sans bg-slate-50 text-slate-900">
            <div className="w-[60%] flex flex-col bg-white border-r border-slate-200 overflow-hidden shadow-xl">
                {/* Header */}
                <div className="flex sticky top-0 z-20 justify-between items-center px-8 py-6 bg-white border-b">
                    <h1 className="text-2xl font-black tracking-tight">{title}</h1>
                    {!isViewMode && (
                        <button
                            onClick={handleFinalSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 font-bold text-white bg-blue-600 rounded-2xl transition-all hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                        >
                            {isSubmitting ? 'Menyimpan...' : submitLabel}
                        </button>
                    )}
                </div>

                <div className="overflow-y-auto flex-1 p-8 space-y-10 scrollbar-hide">
                    <div className="px-6 mb-4">
                        <div className="flex justify-between items-start w-full">
                            {[
                                { key: 'general', label: 'General Info' },
                                { key: 'rooms', label: 'Room Setup' },
                                { key: 'templates', label: 'Template Selection' },
                            ].map((step, idx, arr) => {
                                const currentIndex = ['general', 'rooms', 'templates'].indexOf(activeTab);
                                const isLast = idx === arr.length - 1;
                                return (
                                    <div key={step.key} className={`flex items-start ${isLast ? 'flex-none' : 'flex-1'}`}>
                                        <div className="flex relative flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab(step.key as any)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors ${idx <= currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                                            >
                                                {idx + 1}
                                            </button>
                                            <div className={`absolute top-10 w-32 left-1/2 -translate-x-1/2 text-center text-xs ${idx === currentIndex ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                                                {step.label}
                                            </div>
                                        </div>
                                        {!isLast && (
                                            <div className={`flex-1 h-1 mt-3.5 mx-2 rounded transition-colors ${idx < currentIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* TAB GENERAL */}
                    {activeTab === 'general' && (
                        <fieldset disabled={isViewMode}>
                            <div className="space-y-6 duration-500 animate-in fade-in">
                                <section className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Hotel Name</label>
                                    <input className="p-3 mt-1 w-full font-bold rounded-xl border outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Hotel Description</label>
                                    <textarea rows={3} className="p-3 mt-1 w-full rounded-xl border outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400">Location (City)</label>
                                    <input className="p-3 mt-1 w-full rounded-xl border outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500"
                                        value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400">Location Address</label>
                                    <input className="p-3 mt-1 w-full rounded-xl border outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500"
                                        value={formData.locationAddress} onChange={e => setFormData({ ...formData, locationAddress: e.target.value })} />
                                </div>
                            </section>

                                <section>
                                    <label className="text-[10px] font-black uppercase text-slate-400">Hotel Banners (Array)</label>
                                    {formData.bannerUrl.map((url, i) => (
                                        <div key={i} className="flex gap-2 mt-2">
                                            <input className="flex-1 p-3 text-sm rounded-xl border bg-slate-50" value={url} placeholder="Banner URL..."
                                                onChange={e => {
                                                    const newUrls = [...formData.bannerUrl];
                                                    newUrls[i] = e.target.value;
                                                    setFormData({ ...formData, bannerUrl: newUrls });
                                                }} />
                                            <button onClick={() => setFormData({ ...formData, bannerUrl: formData.bannerUrl.filter((_, idx) => idx !== i) })} className="px-2 font-bold text-red-500">&times;</button>
                                        </div>
                                    ))}
                                    <button onClick={() => setFormData({ ...formData, bannerUrl: [...formData.bannerUrl, ''] })} className="mt-2 text-xs font-bold text-blue-600">+ Add Banner</button>
                                </section>
                            </div>
                        </fieldset>
                    )}

                    {/* TAB ROOMS */}
                    {activeTab === 'rooms' && (
                        <fieldset disabled={isViewMode}>
                            <div className="space-y-8 duration-500 animate-in fade-in">
                                {formData.categories.map((cat, idx) => (
                                    <div key={cat.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400">Room Name</label>
                                            <input className="p-3 mt-1 w-full font-bold bg-white rounded-xl border" value={cat.name} onChange={e => updateCatField(idx, 'name', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400">Room Description</label>
                                            <textarea rows={2} className="p-3 mt-1 w-full bg-white rounded-xl border" value={cat.description} onChange={e => updateCatField(idx, 'description', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Price Per Night</label>
                                            <input type="number" className="p-3 mt-1 w-full font-black text-blue-600 bg-white rounded-xl border" value={cat.pricePerNight} onChange={e => updateCatField(idx, 'pricePerNight', Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Room Type</label>
                                            <input className="p-3 mt-1 w-full bg-white rounded-xl border" value={cat.roomType} onChange={e => updateCatField(idx, 'roomType', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Capacity (Person)</label>
                                            <input type="number" className="p-3 mt-1 w-full bg-white rounded-xl border" value={cat.capacity} onChange={e => updateCatField(idx, 'capacity', Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Stock Room</label>
                                            <input type="number" className="p-3 mt-1 w-full bg-white rounded-xl border" value={cat.stock} onChange={e => updateCatField(idx, 'stock', Number(e.target.value))} />
                                        </div>
                                        <div className="grid grid-cols-2 col-span-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400">Bed Type</label>
                                                <input className="p-3 mt-1 w-full bg-white rounded-xl border" value={cat.bedConfig.type} onChange={e => updateCatField(idx, 'bedConfig', { ...cat.bedConfig, type: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-slate-400">Bed Count</label>
                                                <input type="number" className="p-3 mt-1 w-full bg-white rounded-xl border" value={cat.bedConfig.count} onChange={e => updateCatField(idx, 'bedConfig', { ...cat.bedConfig, count: Number(e.target.value) })} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amenities Section */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Room Amenities (WiFi, AC, etc)</label>
                                            <input className="p-3 mt-1 w-full text-xs bg-white rounded-xl border" placeholder="Separate with comma (e.g WiFi, AC)"
                                                value={cat.roomAmenities.join(', ')}
                                                onChange={e => updateCatField(idx, 'roomAmenities', e.target.value.split(',').map(s => s.trim()))} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Bath Amenities (Shower, etc)</label>
                                            <input className="p-3 mt-1 w-full text-xs bg-white rounded-xl border" placeholder="Separate with comma"
                                                value={cat.bathAmenities.join(', ')}
                                                onChange={e => updateCatField(idx, 'bathAmenities', e.target.value.split(',').map(s => s.trim()))} />
                                        </div>
                                    </div>

                                    {/* Room Images */}
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400">Room Detail Images (URL)</label>
                                        {cat.images.map((img, imgIdx) => (
                                            <div key={imgIdx} className="flex gap-2 mt-2">
                                                <input className="flex-1 p-3 text-sm bg-white rounded-xl border" value={img} placeholder="Image URL..."
                                                    onChange={e => {
                                                        const newImgs = [...cat.images];
                                                        newImgs[imgIdx] = e.target.value;
                                                        updateCatField(idx, 'images', newImgs);
                                                    }} />
                                                <button onClick={() => {
                                                    const newImgs = cat.images.filter((_, i) => i !== imgIdx);
                                                    updateCatField(idx, 'images', newImgs);
                                                }} className="font-bold text-red-500">&times;</button>
                                            </div>
                                        ))}
                                        <button onClick={() => updateCatField(idx, 'images', [...cat.images, ''])} className="mt-2 text-xs font-bold text-blue-600">+ Add Room Image</button>
                                    </div>
                                    </div>
                                ))}
                                <button onClick={addNewCategory} className="py-4 w-full font-bold rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:bg-slate-50">+ Add Another Category</button>
                            </div>
                        </fieldset>
                    )}

                    {activeTab === 'templates' && (
                        <fieldset disabled={isViewMode}>
                            <div className="space-y-10 duration-500 animate-in fade-in">
                                <section>
                                    <h3 className="mb-4 font-bold">Landing Page Template</h3>
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
                                    <h3 className="mb-4 font-bold">Detail Page Template</h3>
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
                        </fieldset>
                    )}
                </div>
            </div>

            {/* Preview Mobile */}
            <div className="flex flex-1 justify-center items-center p-12 bg-slate-100">
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
