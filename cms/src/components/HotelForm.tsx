import { useState } from "react";
import type { HotelFormState } from "../lib/api";
import { HotelMobilePreview } from "./HotelMobilePreview";
import { ConfirmModal } from './ConfirmModal';

interface HotelFormProps {
    title: string;
    onSubmit?: (data: HotelFormState) => void;
    isSubmitting?: boolean;
    submitLabel: string;
    initialData?: HotelFormState;
    isViewMode?: boolean;
}

export function HotelForm({ title, onSubmit, isSubmitting, submitLabel, initialData, isViewMode = false }: HotelFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [activeScreen, setActiveScreen] = useState<'index' | 'detail'>('index');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

    const [formData, setFormData] = useState<HotelFormState>(initialData || {
        name: '',
        description: '',
        location: '',
        locationAddress: '',
        starRating: 3,
        bannerUrl: [],
        templates: {
            index: { id: 1, title: '', bannerUrl: "" },
            hotelDetail: { id: 1, title: "" }
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

    const steps = [
        { id: 'general', title: 'General Info' },
        { id: 'rooms', title: 'Room Setup' },
        { id: 'templates', title: 'Template Selection' },
    ];

    const handleStepChange = (newStep: number) => {
        setCurrentStep(newStep);
        if (newStep === 2) {
            setActiveScreen('index');
        }
    };

    const updateCatField = (idx: number, field: string, value: string | number | string[] | boolean | { type: string; count: number }) => {
        const newCats = [...formData.categories];
        // @ts-expect-error: dynamic field access
        newCats[idx][field as keyof (typeof newCats)[0]] = value;
        setFormData({ ...formData, categories: newCats });
    };

    const handleTemplateChange = (type: 'index' | 'hotelDetail', id: number) => {
        setFormData(prev => ({
            ...prev,
            templates: {
                ...prev.templates,
                [type]: { ...prev.templates[type as keyof typeof prev.templates], id }
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
    }

    const removeCategory = (index: number) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = () => {
        if (onSubmit) {
            // Clean up URLs and ensure we have at least one valid URL for required arrays
            const cleanedBannerUrls = (formData.bannerUrl || []).filter(url => url && typeof url === 'string' && url.trim() !== "");
            const bannerUrl = cleanedBannerUrls.length > 0 ? cleanedBannerUrls : ["https://images.unsplash.com/photo-1566073771259-6a8506099945"];

            const finalData = {
                ...formData,
                bannerUrl,
                categories: (formData.categories || []).map(cat => {
                    const cleanedImages = (cat.images || []).filter(img => img && typeof img === 'string' && img.trim() !== "");
                    const images = cleanedImages.length > 0 ? cleanedImages : ["https://images.unsplash.com/photo-1590490360182-c33d57733427"];
                    
                    return {
                        ...cat,
                        images,
                        roomAmenities: Array.isArray(cat.roomAmenities)
                            ? cat.roomAmenities.filter(a => a && a !== "")
                            : (typeof (cat.roomAmenities as any) === 'string' ? (cat.roomAmenities as any).split(',').map((s: string) => s.trim()).filter((s: string) => s !== "") : []),
                        bathAmenities: Array.isArray(cat.bathAmenities)
                            ? cat.bathAmenities.filter(a => a && a !== "")
                            : (typeof (cat.bathAmenities as any) === 'string' ? (cat.bathAmenities as any).split(',').map((s: string) => s.trim()).filter((s: string) => s !== "") : []),
                    };
                })
            };
            onSubmit(finalData);
        }
        setShowConfirmModal(false);
    };

    return (
        <div className="flex relative flex-col gap-8 min-h-screen lg:flex-row">
            {/* Form Section */}
            <div className="flex-1 p-6 bg-white shadow sm:rounded-lg">
                <h2 className="mb-6 text-xl font-bold">{title}</h2>

                {/* Manual Entry / External Toggle (Identical to Event) */}
                <div className="inline-flex p-1 mb-8 bg-gray-50 rounded-lg border border-gray-200">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-md border border-gray-200 shadow-sm transition-all"
                    >
                        Manual Entry
                    </button>
                    <button
                        type="button"
                        disabled
                        className="px-4 py-2 text-sm font-medium text-gray-400 rounded-md transition-all cursor-not-allowed"
                    >
                        External Link
                    </button>
                </div>

                {/* Stepper (Blue for Hotel) */}
                <div className="px-12 mb-12">
                    <div className="flex justify-between items-start w-full">
                        {steps.map((step, index) => {
                            const isLast = index === steps.length - 1;
                            return (
                                <div key={step.id} className={`flex items-start ${isLast ? 'flex-none' : 'flex-1'}`}>
                                    <div className="flex relative flex-col items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleStepChange(index)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-300 ${index <= currentStep
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                        <div className={`absolute top-10 w-32 left-1/2 transform -translate-x-1/2 text-center text-xs ${index === currentStep ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                                            {step.title}
                                        </div>
                                    </div>
                                    {!isLast && (
                                        <div className={`flex-1 h-1 mt-3.5 mx-2 rounded transition-colors duration-300 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
                    <fieldset disabled={isViewMode}>
                        {/* Step 0: General Info */}
                        {currentStep === 0 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter hotel name"
                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        placeholder="Enter hotel description"
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location (City)</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Jakarta"
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Star Rating</label>
                                        <select
                                            value={formData.starRating}
                                            onChange={e => setFormData({ ...formData, starRating: Number(e.target.value) })}
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location Address</label>
                                    <textarea
                                        rows={2}
                                        value={formData.locationAddress}
                                        onChange={e => setFormData({ ...formData, locationAddress: e.target.value })}
                                        placeholder="Enter full address"
                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Banner URLs</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, bannerUrl: [...prev.bannerUrl, ''] }))}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            + Add Banner
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.bannerUrl.map((url, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={e => {
                                                        const newUrls = [...formData.bannerUrl];
                                                        newUrls[idx] = e.target.value;
                                                        setFormData({ ...formData, bannerUrl: newUrls });
                                                    }}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, bannerUrl: prev.bannerUrl.filter((_, i) => i !== idx) }))}
                                                    className="p-2 text-red-500 rounded hover:bg-red-50"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                            </div>
                                        ))}
                                        {formData.bannerUrl.length === 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, bannerUrl: [''] }))}
                                                className="flex gap-2 justify-center items-center py-3 w-full text-sm text-gray-500 rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-blue-500 hover:text-blue-500"
                                            >
                                                <span>Add Banner Image</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Room Setup */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">Room Categories</h3>
                                    <button
                                        type="button"
                                        onClick={addNewCategory}
                                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent hover:bg-blue-700"
                                    >
                                        + Add Category
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.categories.map((cat, index) => (
                                        <div key={cat.id} className="relative p-6 space-y-4 bg-gray-50 rounded-lg border">
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(index)}
                                                className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Room Name</label>
                                                    <input
                                                        type="text"
                                                        value={cat.name}
                                                        onChange={e => updateCatField(index, 'name', e.target.value)}
                                                        placeholder="e.g. Deluxe Room"
                                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Description</label>
                                                    <textarea
                                                        value={cat.description}
                                                        rows={2}
                                                        onChange={e => updateCatField(index, 'description', e.target.value)}
                                                        placeholder="Room description..."
                                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Price Per Night</label>
                                                    <input
                                                        type="number"
                                                        value={cat.pricePerNight}
                                                        onChange={e => updateCatField(index, 'pricePerNight', Number(e.target.value))}
                                                        className="block p-2 mt-1 w-full font-bold text-blue-600 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Room Type</label>
                                                    <input
                                                        type="text"
                                                        value={cat.roomType}
                                                        onChange={e => updateCatField(index, 'roomType', e.target.value)}
                                                        placeholder="Standard/Deluxe"
                                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Capacity (Persons)</label>
                                                    <input
                                                        type="number"
                                                        value={cat.capacity}
                                                        onChange={e => updateCatField(index, 'capacity', Number(e.target.value))}
                                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Stock</label>
                                                    <input
                                                        type="number"
                                                        value={cat.stock}
                                                        onChange={e => updateCatField(index, 'stock', Number(e.target.value))}
                                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Room Amenities</label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(cat.roomAmenities) ? cat.roomAmenities.join(', ') : cat.roomAmenities}
                                                        onChange={e => updateCatField(index, 'roomAmenities', e.target.value.split(',').map(s => s.trim()))}
                                                        placeholder="WiFi, AC, TV..."
                                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Bath Amenities</label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(cat.bathAmenities) ? cat.bathAmenities.join(', ') : cat.bathAmenities}
                                                        onChange={e => updateCatField(index, 'bathAmenities', e.target.value.split(',').map(s => s.trim()))}
                                                        placeholder="Shower, Towels..."
                                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-xs font-medium text-gray-500">Room Images</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateCatField(index, 'images', [...cat.images, ''])}
                                                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                                    >
                                                        + Add Image
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {cat.images.map((img, imgIdx) => (
                                                        <div key={imgIdx} className="flex gap-2">
                                                            <input
                                                                type="url"
                                                                value={img}
                                                                onChange={e => {
                                                                    const newImgs = [...cat.images];
                                                                    newImgs[imgIdx] = e.target.value;
                                                                    updateCatField(index, 'images', newImgs);
                                                                }}
                                                                placeholder="Image URL..."
                                                                className="block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => updateCatField(index, 'images', cat.images.filter((_, i) => i !== imgIdx))}
                                                                className="p-2 text-red-500"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Template Selection (Identical to Event) */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-lg font-medium text-gray-900">Template Selection</h3>
                                <p className="mb-4 text-sm text-gray-500">Choose a visual style for your hotel page.</p>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {[1, 2, 3, 4, 5].map((id) => (
                                        <div
                                            key={id}
                                            onClick={() => handleTemplateChange('index', id)}
                                            className={`cursor-pointer border rounded-xl p-4 transition-all relative overflow-hidden ${formData.templates.index.id === id
                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`font-bold text-lg ${formData.templates.index.id === id ? 'text-blue-700' : 'text-gray-800'}`}>
                                                    Template {id}
                                                </span>
                                                {formData.templates.index.id === id && (
                                                    <span className="px-2 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </fieldset>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => handleStepChange(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => handleStepChange(Math.min(steps.length - 1, currentStep + 1))}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent hover:bg-blue-700"
                            >
                                Next
                            </button>
                        ) : (
                            !isViewMode && (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md border border-transparent hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : submitLabel}
                                </button>
                            )
                        )}
                    </div>
                </form>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSubmit}
                title="Save Hotel"
                message="Are you sure you want to save this hotel?"
                confirmLabel="Save Hotel"
            />

            {/* Preview Section (Identical to Event) */}
            <div className="hidden lg:block w-[375px] flex-shrink-0 sticky top-4 h-[calc(100vh-2rem)]">
                {/* Mobile Preview Header */}
                <div className={`flex absolute right-0 left-0 -top-2 justify-center px-6 opacity-100 transition-all duration-300 transform translate-y-0 z-[60]`}>
                    <div className="flex justify-between items-center px-4 py-2 w-full max-w-sm rounded-full border border-gray-100 shadow-lg backdrop-blur-md bg-white/90">
                        <div className="w-8"></div>
                        <h3 className="text-sm font-semibold text-center text-gray-700">Mobile Preview</h3>
                        <div className="flex relative justify-end w-8">
                            <button
                                onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                                className={`p-1.5 rounded-full transition-colors ${isTemplateMenuOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
                                title="Change Template"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" y1="21" x2="4" y2="14"></line>
                                    <line x1="4" y1="10" x2="4" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12" y2="3"></line>
                                    <line x1="20" y1="21" x2="20" y2="16"></line>
                                    <line x1="20" y1="12" x2="20" y2="3"></line>
                                    <line x1="1" y1="14" x2="7" y2="14"></line>
                                    <line x1="9" y1="8" x2="15" y2="8"></line>
                                    <line x1="17" y1="16" x2="23" y2="16"></line>
                                </svg>
                            </button>

                            {isTemplateMenuOpen && (
                                <div className="overflow-hidden absolute right-0 top-full z-50 py-2 mt-3 w-56 bg-white rounded-xl border border-gray-100 ring-1 ring-black ring-opacity-5 shadow-xl origin-top-right">
                                    <div className="px-4 py-2 mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase border-b border-gray-50">
                                        Template Selection
                                    </div>
                                    {[1, 2, 3, 4, 5].map(id => (
                                        <button
                                            key={id}
                                            onClick={() => {
                                                handleTemplateChange(activeScreen === 'index' ? 'index' : 'hotelDetail', id);
                                                setIsTemplateMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors group ${formData.templates[activeScreen === 'index' ? 'index' : 'hotelDetail'].id === id
                                                    ? 'bg-blue-50/50'
                                                    : ''
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${formData.templates[activeScreen === 'index' ? 'index' : 'hotelDetail'].id === id ? 'text-blue-700' : 'text-gray-700'}`}>
                                                    Template {id}
                                                </span>
                                            </div>
                                            {formData.templates[activeScreen === 'index' ? 'index' : 'hotelDetail'].id === id && (
                                                <div className="text-blue-600 bg-white rounded-full p-0.5 shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center pt-14 pb-8 h-full">
                    <div className="scale-[0.85] origin-top h-full">
                        <HotelMobilePreview
                            data={formData}
                            activeScreen={activeScreen}
                            onScreenChange={setActiveScreen}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
