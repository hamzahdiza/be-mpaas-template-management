import { useState } from "react";
import type { RentalFormState, Vehicle } from "../lib/api";
import { RentalMobilePreview } from "./RentalMobilePreview";
import { ConfirmModal } from './ConfirmModal';

interface RentalFormProps {
    title: string;
    onSubmit?: (data: RentalFormState) => void;
    isSubmitting?: boolean;
    submitLabel: string;
    initialData?: RentalFormState;
    isViewMode?: boolean;
}

export function RentalForm({ title, onSubmit, isSubmitting, submitLabel, initialData, isViewMode = false }: RentalFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [activeScreen, setActiveScreen] = useState<'index' | 'detail'>('index');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

    const [formData, setFormData] = useState<RentalFormState>(initialData || {
        category: 'car',
        name: '',
        description: '',
        location: '',
        locationAddress: '',
        locationUrl: '',
        bannerUrl: [],
        templates: {
            index: { id: 1, title: '', bannerUrl: "" },
            detail: { id: 1, title: "", bannerUrl: "" }
        },
        vehicles: [
            {
                id: crypto.randomUUID(),
                name: "Toyota Avanza",
                type: "MPV",
                transmission: "automatic",
                capacity: 7,
                pricePerDay: 500000,
                imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1169&auto=format&fit=crop",
                isAvailable: true
            }
        ]
    });

    const steps = [
        { id: 'general', title: 'General Info' },
        { id: 'vehicles', title: 'Vehicle Fleet' },
        { id: 'templates', title: 'Template Selection' },
    ];

    const handleStepChange = (newStep: number) => {
        setCurrentStep(newStep);
        if (newStep === 2) {
            setActiveScreen('index');
        }
    };

    const updateVehicleField = (idx: number, field: keyof Vehicle, value: any) => {
        const newVehicles = [...formData.vehicles];
        newVehicles[idx] = { ...newVehicles[idx], [field]: value };
        setFormData({ ...formData, vehicles: newVehicles });
    };

    const handleTemplateChange = (type: 'index' | 'detail', id: number) => {
        setFormData(prev => ({
            ...prev,
            templates: {
                ...prev.templates,
                [type]: { ...prev.templates[type], id }
            }
        }));
        setActiveScreen(type === 'index' ? 'index' : 'detail');
    };

    const addNewVehicle = () => {
        const newVehicle: Vehicle = {
            id: crypto.randomUUID(),
            name: "",
            type: "Sedan",
            transmission: "automatic",
            capacity: 5,
            pricePerDay: 0,
            imageUrl: "",
            isAvailable: true
        };
        setFormData(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, newVehicle]
        }));
    };

    const removeVehicle = (index: number) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = () => {
        if (onSubmit) {
            const cleanedBannerUrls = (formData.bannerUrl || []).filter(url => url && typeof url === 'string' && url.trim() !== "");
            const bannerUrl = cleanedBannerUrls.length > 0 ? cleanedBannerUrls : ["https://images.unsplash.com/photo-1503376780353-7e6692767b70"];

            const finalData = {
                ...formData,
                bannerUrl,
                vehicles: (formData.vehicles || []).map(v => ({
                    ...v,
                    imageUrl: v.imageUrl?.trim() === "" ? "https://images.unsplash.com/photo-1542281286-9e0a16bb7366" : v.imageUrl
                }))
            };
            onSubmit(finalData);
        }
        setShowConfirmModal(false);
    };

    return (
        <div className="flex relative flex-col gap-8 min-h-screen lg:flex-row">
            <div className="flex-1 p-6 bg-white shadow sm:rounded-lg">
                <h2 className="mb-6 text-xl font-bold">{title}</h2>

                <div className="inline-flex p-1 mb-8 bg-gray-50 rounded-lg border border-gray-200">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-md border border-gray-200 shadow-sm">Manual Entry</button>
                    <button type="button" disabled className="px-4 py-2 text-sm font-medium text-gray-400 rounded-md cursor-not-allowed">External Link</button>
                </div>

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
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-300 ${index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                                        >
                                            {index + 1}
                                        </button>
                                        <div className={`absolute top-10 w-32 left-1/2 transform -translate-x-1/2 text-center text-xs ${index === currentStep ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}>{step.title}</div>
                                    </div>
                                    {!isLast && <div className={`flex-1 h-1 mt-3.5 mx-2 rounded transition-colors duration-300 ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset disabled={isViewMode}>
                        {currentStep === 0 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value as 'car' | 'motor' })}
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="car">Car Rental</option>
                                            <option value="motor">Motorcycle Rental</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Blue Bird Rental"
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="About your rental service..."
                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Bali"
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Address</label>
                                        <input
                                            type="text"
                                            value={formData.locationAddress}
                                            onChange={e => setFormData({ ...formData, locationAddress: e.target.value })}
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Banner Images</label>
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, bannerUrl: [...prev.bannerUrl, ''] }))} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">+ Add Banner</button>
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
                                                    placeholder="https://example.com/banner.jpg"
                                                    className="block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, bannerUrl: prev.bannerUrl.filter((_, i) => i !== idx) }))} className="p-2 text-red-500 hover:bg-red-50">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">Vehicle Fleet</h3>
                                    <button type="button" onClick={addNewVehicle} className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">+ Add Vehicle</button>
                                </div>

                                <div className="space-y-4">
                                    {formData.vehicles.map((v, index) => (
                                        <div key={v.id} className="relative p-6 space-y-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <button type="button" onClick={() => removeVehicle(index)} className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700">Remove</button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Vehicle Name</label>
                                                    <input type="text" value={v.name} onChange={e => updateVehicleField(index, 'name', e.target.value)} placeholder="e.g. Honda CR-V" className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Type</label>
                                                    <input type="text" value={v.type} onChange={e => updateVehicleField(index, 'type', e.target.value)} placeholder="SUV, Sedan, etc" className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Transmission</label>
                                                    <select value={v.transmission} onChange={e => updateVehicleField(index, 'transmission', e.target.value)} className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm">
                                                        <option value="automatic">Automatic</option>
                                                        <option value="manual">Manual</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Capacity</label>
                                                    <input type="number" value={v.capacity} onChange={e => updateVehicleField(index, 'capacity', Number(e.target.value))} className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Price / Day</label>
                                                    <input type="number" value={v.pricePerDay} onChange={e => updateVehicleField(index, 'pricePerDay', Number(e.target.value))} className="block p-2 mt-1 w-full font-bold text-indigo-600 rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Image URL</label>
                                                    <input type="url" value={v.imageUrl} onChange={e => updateVehicleField(index, 'imageUrl', e.target.value)} placeholder="https://..." className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-lg font-medium text-gray-900">Template Selection</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {[1, 2, 3, 4, 5].map((id) => (
                                        <div
                                            key={id}
                                            onClick={() => handleTemplateChange('index', id)}
                                            className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.templates.index.id === id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}
                                        >
                                            <span className="font-bold text-lg">Template {id}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </fieldset>

                    <div className="flex justify-between pt-6 border-t border-gray-200">
                        <button type="button" onClick={() => handleStepChange(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 disabled:opacity-50">Back</button>
                        {currentStep < steps.length - 1 ? (
                            <button type="button" onClick={() => handleStepChange(Math.min(steps.length - 1, currentStep + 1))} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Next</button>
                        ) : (
                            !isViewMode && <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">{isSubmitting ? 'Saving...' : submitLabel}</button>
                        )}
                    </div>
                </form>
            </div>

            <ConfirmModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleConfirmSubmit} title="Save Rental" message="Are you sure you want to save this rental service?" confirmLabel="Save" />

            <div className="hidden lg:block w-[375px] flex-shrink-0 sticky top-4 h-[calc(100vh-2rem)]">
                <div className="flex absolute right-0 left-0 -top-2 justify-center px-6 z-[60]">
                    <div className="flex justify-between items-center px-4 py-2 w-full rounded-full border border-gray-100 shadow-lg bg-white/90">
                        <h3 className="text-sm font-semibold text-gray-700">Mobile Preview</h3>
                        <div className="relative">
                            <button onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line></svg>
                            </button>
                            {isTemplateMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                                    {[1, 2, 3, 4, 5].map(id => (
                                        <button key={id} onClick={() => { handleTemplateChange(activeScreen === 'index' ? 'index' : 'detail', id); setIsTemplateMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Template {id}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center pt-14 h-full">
                    <div className="scale-[0.85] origin-top h-full">
                        <RentalMobilePreview data={formData} activeScreen={activeScreen} onScreenChange={setActiveScreen} />
                    </div>
                </div>
            </div>
        </div>
    );
}
