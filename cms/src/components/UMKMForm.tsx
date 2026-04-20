import { useState } from "react";
import type { UMKMFormState, Product } from "../lib/api";
import { UMKMMobilePreview } from "./UMKMMobilePreview";
import { ConfirmModal } from './ConfirmModal';

interface UMKMFormProps {
    title: string;
    onSubmit?: (data: UMKMFormState) => void;
    isSubmitting?: boolean;
    submitLabel: string;
    initialData?: UMKMFormState;
    isViewMode?: boolean;
}

export function UMKMForm({ title, onSubmit, isSubmitting, submitLabel, initialData, isViewMode = false }: UMKMFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [activeScreen, setActiveScreen] = useState<'index' | 'detail'>('index');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

    const [formData, setFormData] = useState<UMKMFormState>(initialData || {
        category: 'product',
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
        products: [
            {
                id: crypto.randomUUID(),
                name: "Handmade Ceramic Vase",
                price: 150000,
                description: "Vase keramik buatan tangan dengan desain minimalis.",
                imageUrl: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1170&auto=format&fit=crop",
                isAvailable: true,
                stock: 10
            }
        ]
    });

    const steps = [
        { id: 'general', title: 'General Info' },
        { id: 'products', title: 'Product Catalog' },
        { id: 'templates', title: 'Template Selection' },
    ];

    const handleStepChange = (newStep: number) => {
        setCurrentStep(newStep);
        if (newStep === 2) {
            setActiveScreen('index');
        }
    };

    const updateProductField = (idx: number, field: keyof Product, value: any) => {
        const newProducts = [...formData.products];
        newProducts[idx] = { ...newProducts[idx], [field]: value };
        setFormData({ ...formData, products: newProducts });
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

    const addNewProduct = () => {
        const newProduct: Product = {
            id: crypto.randomUUID(),
            name: "",
            price: 0,
            description: "",
            imageUrl: "",
            isAvailable: true,
            stock: 10
        };
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, newProduct]
        }));
    };

    const removeProduct = (index: number) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = () => {
        if (onSubmit) {
            const cleanedBannerUrls = (formData.bannerUrl || []).filter(url => url && typeof url === 'string' && url.trim() !== "");
            const bannerUrl = cleanedBannerUrls.length > 0 ? cleanedBannerUrls : ["https://images.unsplash.com/photo-1472851294608-062f824d29cc"];

            const finalData = {
                ...formData,
                bannerUrl,
                products: (formData.products || []).map(p => ({
                    ...p,
                    imageUrl: p.imageUrl?.trim() === "" ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30" : p.imageUrl
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
                    <button type="button" className="px-4 py-2 text-sm font-medium text-rose-600 bg-white rounded-md border border-gray-200 shadow-sm">Manual Entry</button>
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
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-300 ${index <= currentStep ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                                        >
                                            {index + 1}
                                        </button>
                                        <div className={`absolute top-10 w-32 left-1/2 transform -translate-x-1/2 text-center text-xs ${index === currentStep ? 'text-rose-600 font-bold' : 'text-gray-500'}`}>{step.title}</div>
                                    </div>
                                    {!isLast && <div className={`flex-1 h-1 mt-3.5 mx-2 rounded transition-colors duration-300 ${index < currentStep ? 'bg-rose-600' : 'bg-gray-200'}`}></div>}
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
                                            onChange={e => setFormData({ ...formData, category: e.target.value as 'product' | 'food' | 'service' })}
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                                        >
                                            <option value="product">Retail Product</option>
                                            <option value="food">Culinary / UMKM Food</option>
                                            <option value="service">Service</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Toko Berkah"
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="About your UMKM..."
                                        className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Bandung"
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Address</label>
                                        <input
                                            type="text"
                                            value={formData.locationAddress}
                                            onChange={e => setFormData({ ...formData, locationAddress: e.target.value })}
                                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Banner Images</label>
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, bannerUrl: [...prev.bannerUrl, ''] }))} className="text-xs font-medium text-rose-600 hover:text-rose-700">+ Add Banner</button>
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
                                                    className="block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
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
                                    <h3 className="text-lg font-medium text-gray-900">Product Catalog</h3>
                                    <button type="button" onClick={addNewProduct} className="px-3 py-1 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700">+ Add Product</button>
                                </div>

                                <div className="space-y-4">
                                    {formData.products.map((p, index) => (
                                        <div key={p.id} className="relative p-6 space-y-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <button type="button" onClick={() => removeProduct(index)} className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700">Remove</button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Product Name</label>
                                                    <input type="text" value={p.name} onChange={e => updateProductField(index, 'name', e.target.value)} placeholder="e.g. Tas Kulit Lokal" className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Price</label>
                                                    <input type="number" value={p.price} onChange={e => updateProductField(index, 'price', Number(e.target.value))} className="block p-2 mt-1 w-full font-bold text-rose-600 rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Stock</label>
                                                    <input type="number" value={p.stock} onChange={e => updateProductField(index, 'stock', Number(e.target.value))} className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Description</label>
                                                    <textarea rows={2} value={p.description} onChange={e => updateProductField(index, 'description', e.target.value)} placeholder="Product detail..." className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Image URL</label>
                                                    <input type="url" value={p.imageUrl} onChange={e => updateProductField(index, 'imageUrl', e.target.value)} placeholder="https://..." className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm" />
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
                                            className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.templates.index.id === id ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-500' : 'border-gray-200 hover:border-rose-300 bg-white'}`}
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
                            <button type="button" onClick={() => handleStepChange(Math.min(steps.length - 1, currentStep + 1))} className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700">Next</button>
                        ) : (
                            !isViewMode && <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">{isSubmitting ? 'Saving...' : submitLabel}</button>
                        )}
                    </div>
                </form>
            </div>

            <ConfirmModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleConfirmSubmit} title="Save UMKM" message="Are you sure you want to save this UMKM?" confirmLabel="Save" />

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
                        <UMKMMobilePreview data={formData} activeScreen={activeScreen} onScreenChange={setActiveScreen} />
                    </div>
                </div>
            </div>
        </div>
    );
}
