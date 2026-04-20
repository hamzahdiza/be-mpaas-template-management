import { useState } from 'react';
import type { CafeRestaurantFormState } from '../lib/api';
import { CafeRestaurantMobilePreview } from './CafeRestaurantMobilePreview';
import { ConfirmModal } from './ConfirmModal';

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
  bannerUrl: [],
  amenities: ['Musholla'],
  menuItems: [{ id: crypto.randomUUID(), name: 'Menu Utama', description: '', price: 30000, imageUrl: '', isAvailable: true }],
};

export function CafeRestaurantForm({ title, submitLabel, isSubmitting, initialData, onSubmit, isViewMode = false }: CafeRestaurantFormProps) {
  const [formData, setFormData] = useState<CafeRestaurantFormState>(initialData || defaultState);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeScreen, setActiveScreen] = useState<'index' | 'detail'>('index');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  const steps = [
    { id: 'general', title: 'General Info' },
    { id: 'menu', title: 'Menu Items' },
    { id: 'templates', title: 'Template Selection' },
  ];

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep === 2) {
      setActiveScreen('index');
    }
  };

  const updateMenu = (index: number, field: string, value: string | number) => {
    const next = [...formData.menuItems];
    // @ts-expect-error: dynamic field access
    next[index][field as keyof (typeof next)[0]] = field === 'price' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, menuItems: next }));
  };

  const addMenuItem = () => {
    setFormData((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, { id: crypto.randomUUID(), name: '', description: '', price: 0, imageUrl: '', isAvailable: true }]
    }));
  };

  const removeMenuItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, i) => i !== index)
    }));
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    if (onSubmit) {
        // Clean up URLs and ensure we have at least one valid URL for required arrays
        const cleanedBannerUrls = (formData.bannerUrl || []).filter(url => url && typeof url === 'string' && url.trim() !== "");
        const bannerUrl = cleanedBannerUrls.length > 0 ? cleanedBannerUrls : ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"];

        const finalData = {
          ...formData,
          bannerUrl,
          menuItems: (formData.menuItems || []).length > 0 ? formData.menuItems.map(item => ({
            ...item,
            imageUrl: (!item.imageUrl || (typeof item.imageUrl === 'string' && item.imageUrl.trim() === ""))
              ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" 
              : item.imageUrl
          })) : [{
            name: "Menu Baru",
            price: 0,
            description: "Deskripsi menu",
            imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            isAvailable: true
          }]
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
                className="px-4 py-2 text-sm font-medium text-emerald-600 bg-white rounded-md border border-gray-200 shadow-sm transition-all"
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

        {/* Stepper (Emerald like Event) */}
        <div className="px-12 mb-12">
          <div className="flex justify-between items-start w-full">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <div key={step.id} className={`flex items-start ${index === steps.length - 1 ? 'flex-none' : 'flex-1'}`}>
                  <div className="flex relative flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleStepChange(index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-300 ${index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {index + 1}
                    </button>
                    <div className={`absolute top-10 w-32 left-1/2 transform -translate-x-1/2 text-center text-xs ${index === currentStep ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-1 mt-3.5 mx-2 rounded transition-colors duration-300 ${index < currentStep ? 'bg-emerald-600' : 'bg-gray-200'}`} />
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as 'cafe' | 'restaurant' }))}
                    >
                      <option value="cafe">Cafe</option>
                      <option value="restaurant">Restaurant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Halal Status</label>
                    <select
                      className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={formData.halalStatus}
                      onChange={(e) => setFormData((prev) => ({ ...prev, halalStatus: e.target.value as CafeRestaurantFormState['halalStatus'] }))}
                    >
                      <option value="halal-certified">Halal Certified</option>
                      <option value="muslim-friendly">Muslim Friendly</option>
                      <option value="non-halal">Non Halal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location (City)</label>
                    <input
                      type="text"
                      className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={formData.location}
                      onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location Address</label>
                    <input
                      type="text"
                      className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={formData.locationAddress}
                      onChange={(e) => setFormData((p) => ({ ...p, locationAddress: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Open Time</label>
                    <input
                      type="time"
                      className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={formData.openTime}
                      onChange={(e) => setFormData((p) => ({ ...p, openTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Close Time</label>
                    <input
                      type="time"
                      className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={formData.closeTime}
                      onChange={(e) => setFormData((p) => ({ ...p, closeTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price Min</label>
                    <input
                      type="number"
                      className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={formData.priceRangeMin}
                      onChange={(e) => setFormData((p) => ({ ...p, priceRangeMin: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price Max</label>
                    <input
                      type="number"
                      className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      value={formData.priceRangeMax}
                      onChange={(e) => setFormData((p) => ({ ...p, priceRangeMax: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Banner URLs</label>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, bannerUrl: [...(prev.bannerUrl || []), ''] }))}
                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                        >
                            + Add Banner
                        </button>
                    </div>
                    <div className="space-y-3">
                        {(formData.bannerUrl || []).map((url, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={e => {
                                        const newUrls = [...(formData.bannerUrl || [])];
                                        newUrls[idx] = e.target.value;
                                        setFormData({ ...formData, bannerUrl: newUrls });
                                    }}
                                    placeholder="https://example.com/image.jpg"
                                    className="block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, bannerUrl: (prev.bannerUrl || []).filter((_, i) => i !== idx) }))}
                                    className="p-2 text-red-500 rounded hover:bg-red-50"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        ))}
                        {(formData.bannerUrl || []).length === 0 && (
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, bannerUrl: [''] }))}
                                className="flex gap-2 justify-center items-center py-3 w-full text-sm text-gray-500 rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-emerald-500 hover:text-emerald-500"
                            >
                                <span>Add Banner Image</span>
                            </button>
                        )}
                    </div>
                </div>
              </div>
            )}

            {/* Step 1: Menu Items */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Menu Items</h3>
                  <button
                    type="button"
                    onClick={addMenuItem}
                    className="px-3 py-1 text-sm font-medium text-white bg-emerald-600 rounded-md border border-transparent hover:bg-emerald-700"
                  >
                    + Add Menu
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.menuItems.map((item, idx) => (
                    <div key={item.id || idx} className="relative p-6 space-y-4 bg-gray-50 rounded-lg border">
                      <button
                        type="button"
                        onClick={() => removeMenuItem(idx)}
                        className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500">Menu Name</label>
                          <input
                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                            placeholder="Nama menu"
                            value={item.name}
                            onChange={(e) => updateMenu(idx, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Price</label>
                          <input
                            className="block p-2 mt-1 w-full font-bold text-emerald-600 rounded-md border border-gray-300 shadow-sm sm:text-sm"
                            placeholder="Harga"
                            type="number"
                            value={item.price}
                            onChange={(e) => updateMenu(idx, 'price', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500">Description</label>
                          <textarea
                            rows={2}
                            className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                            placeholder="Deskripsi menu"
                            value={item.description}
                            onChange={(e) => updateMenu(idx, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-500">Image URL</label>
                            <input
                                className="block p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                                placeholder="https://example.com/menu.jpg"
                                value={item.imageUrl}
                                onChange={(e) => updateMenu(idx, 'imageUrl', e.target.value)}
                            />
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
                <p className="mb-4 text-sm text-gray-500">Choose a visual style for your cafe/restaurant page.</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4, 5].map((id) => (
                    <div
                      key={id}
                      onClick={() => handleTemplateChange('index', id)}
                      className={`cursor-pointer border rounded-xl p-4 transition-all relative overflow-hidden ${formData.templates.index.id === id ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 ring-opacity-50' : 'border-gray-200 hover:border-emerald-300 hover:shadow-md bg-white'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-bold text-lg ${formData.templates.index.id === id ? 'text-emerald-700' : 'text-gray-800'}`}>
                          Template {id}
                        </span>
                        {formData.templates.index.id === id && (
                          <span className="px-2 py-1 text-xs font-bold text-emerald-600 bg-emerald-100 rounded-full">
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
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md border border-transparent hover:bg-emerald-700"
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
        title="Save Cafe/Restaurant"
        message="Are you sure you want to save this cafe/restaurant?"
        confirmLabel="Save"
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
                        className={`p-1.5 rounded-full transition-colors ${isTemplateMenuOpen ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100 text-gray-500'}`}
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
                                        handleTemplateChange(activeScreen === 'index' ? 'index' : 'detail', id);
                                        setIsTemplateMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors group ${formData.templates[activeScreen === 'index' ? 'index' : 'detail'].id === id
                                            ? 'bg-emerald-50/50'
                                            : ''
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`font-medium ${formData.templates[activeScreen === 'index' ? 'index' : 'detail'].id === id ? 'text-emerald-700' : 'text-gray-700'}`}>
                                            Template {id}
                                        </span>
                                    </div>
                                    {formData.templates[activeScreen === 'index' ? 'index' : 'detail'].id === id && (
                                        <div className="text-emerald-600 bg-white rounded-full p-0.5 shadow-sm">
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
                <CafeRestaurantMobilePreview
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
