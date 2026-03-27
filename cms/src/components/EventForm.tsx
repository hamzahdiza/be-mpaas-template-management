import React, { useState } from 'react'
import { MobilePreview } from './MobilePreview'
import { ConfirmModal } from './ConfirmModal'

export interface EventFormState {
    name: string;
    eventType: 'internal' | 'external';
    externalUrl: string;
    description: string;
    templates: {
        index: { id: number; title: string; bannerUrl: string };
        bookTicket: { id: number; title: string; bannerUrl: string };
        visitorList: { id: number; title: string; bannerUrl: string };
        visitorInput: { id: number; title: string; bannerUrl: string };
    };
    startDate: string;
    endDate: string;
    price: number;
    location: string;
    locationAddress: string;
    locationUrl: string;
    seatingPlanUrl: string;
    termsAndConditions: string;
    socials: {
        instagram: { url: string; visible: boolean };
        website: { url: string; visible: boolean };
    };
    bannerUrls: string[];
    templateId: number;
    vendorConfig?: {
        purchaseMode?: 'single' | 'multiple';
    };
    ticketCategories: {
        id: string;
        name: string;
        price: number;
        maxPrice: number;
        description: string;
        status: string;
    }[];
    tickets: {
        ticketId: string;
        ticketName: string;
        category: string;
        type: 'normal' | 'b1g1' | 'discount';
        price: number;
        normalPrice: number;
        description: string;
        isAvailable: number;
    }[];
}

interface EventFormProps {
    initialData?: Partial<EventFormState>;
    onSubmit?: (data: EventFormState) => void;
    isViewMode?: boolean;
    title: string;
    submitLabel?: string;
    isSubmitting?: boolean;
}

export function EventForm({ initialData, onSubmit, isViewMode = false, title, submitLabel = 'Save Event', isSubmitting = false }: EventFormProps) {
    const defaultState: EventFormState = {
        name: '',
        eventType: 'internal',
        externalUrl: '',
        description: '',
        templates: {
            index: { id: 1, title: '', bannerUrl: '' },
            bookTicket: { id: 1, title: '', bannerUrl: '' },
            visitorList: { id: 1, title: '', bannerUrl: '' },
            visitorInput: { id: 1, title: '', bannerUrl: '' }
        },
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        price: 0,
        location: '',
        locationAddress: '',
        locationUrl: '',
        seatingPlanUrl: '',
        termsAndConditions: '',
        socials: {
            instagram: { url: '', visible: true },
            website: { url: '', visible: true }
        },
        bannerUrls: [] as string[],
        templateId: 1,
        vendorConfig: {
            purchaseMode: 'multiple'
        },
        ticketCategories: [
            { id: 'cat1', name: 'General Admission', price: 150000, maxPrice: 0, description: 'Standard entry ticket', status: 'available' }
        ],
        tickets: [
            { ticketId: 't1', ticketName: 'Early Bird', category: 'cat1', type: 'normal', price: 125000, normalPrice: 150000, description: 'Limited offer', isAvailable: 1 }
        ]
    };

    const [formData, setFormData] = useState<EventFormState>({ ...defaultState, ...initialData });
    const [activeScreen, setActiveScreen] = useState<'index' | 'bookTicket' | 'visitorList' | 'visitorInput'>('index');
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [dateMode, setDateMode] = useState<'single' | 'range'>(initialData?.endDate && initialData.endDate !== initialData.startDate ? 'range' : 'single');

    const steps = formData.eventType === 'external'
        ? [{ id: 'general', title: 'External Event Info' }]
        : [
            { id: 'general', title: 'General Info' },
            { id: 'categories', title: 'Ticket Categories' },
            { id: 'tickets', title: 'Tickets & Promos' },
            { id: 'templates', title: 'Template Selection' }
        ];

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleStepChange = (newStep: number) => {
        setCurrentStep(newStep);
        if (newStep === 3) {
            setActiveScreen('index');
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = () => {
        if (onSubmit) {
            onSubmit(formData);
        }
        setShowConfirmModal(false);
    };

    const addCategory = () => {
        setFormData(prev => ({
            ...prev,
            ticketCategories: [
                ...prev.ticketCategories,
                { id: `cat${Date.now()}`, name: '', price: 0, maxPrice: 0, description: '', status: 'available' }
            ]
        }));
    };

    const updateCategory = (index: number, field: string, value: string | number) => {
        setFormData(prev => {
            const newCats = [...prev.ticketCategories];
            // Handle empty string for numbers to avoid sticking to 0
            if ((field === 'price' || field === 'maxPrice') && value === '') {
                newCats[index] = { ...newCats[index], [field]: 0 }; // or handle as string temporarily
            } else {
                newCats[index] = { ...newCats[index], [field]: value };
            }
            return { ...prev, ticketCategories: newCats };
        });
    };

    const removeCategory = (index: number) => {
        setFormData(prev => ({
            ...prev,
            ticketCategories: prev.ticketCategories.filter((_, i) => i !== index)
        }));
    };

    const addTicket = () => {
        setFormData(prev => ({
            ...prev,
            tickets: [
                ...prev.tickets,
                {
                    ticketId: `t${Date.now()}`,
                    ticketName: '',
                    category: '',
                    type: 'normal',
                    price: 0,
                    normalPrice: 0,
                    description: '',
                    isAvailable: 1
                }
            ]
        }));
    };

    const updateTicket = (index: number, field: string, value: string | number) => {
        setFormData(prev => {
            const newTickets = [...prev.tickets];
            if ((field === 'price' || field === 'normalPrice') && value === '') {
                newTickets[index] = { ...newTickets[index], [field]: 0 };
            } else {
                newTickets[index] = { ...newTickets[index], [field]: value };
            }
            return { ...prev, tickets: newTickets };
        });
    };

    const removeTicket = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tickets: prev.tickets.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // For price and numbers, allow empty string to clear input, but convert to number on valid input
        if (name === 'price') {
            if (value === '') {
                setFormData(prev => ({ ...prev, [name]: 0 })); // Or handle as string if you want to allow empty
            } else {
                setFormData(prev => ({ ...prev, [name]: Number(value) }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTemplateChange = (screen: 'index' | 'bookTicket' | 'visitorList' | 'visitorInput', value: number) => {
        setFormData(prev => ({
            ...prev,
            templateId: value, // Update the top-level templateId
            templates: {
                ...prev.templates,
                [screen]: {
                    ...prev.templates[screen],
                    id: value
                }
            }
        }));
    };

    return (
        <div className="relative flex flex-col min-h-screen gap-8 lg:flex-row">
            {/* Form Section */}
            <div className="flex-1 p-6 bg-white shadow sm:rounded-lg">
                <h2 className="mb-6 text-xl font-bold">{title}</h2>

                {/* Event Type Toggle */}
                <div className="inline-flex p-1 mb-8 border border-gray-200 rounded-lg bg-gray-50">
                    <button
                        type="button"
                        disabled={isViewMode}
                        onClick={() => {
                            setFormData(prev => ({ ...prev, eventType: 'internal' }));
                            handleStepChange(0);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${formData.eventType === 'internal'
                                ? 'bg-white text-orange-600 shadow-sm border border-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Manual Entry
                    </button>
                    <button
                        type="button"
                        disabled={isViewMode}
                        onClick={() => {
                            setFormData(prev => ({ ...prev, eventType: 'external' }));
                            setCurrentStep(0);
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${formData.eventType === 'external'
                                ? 'bg-white text-orange-600 shadow-sm border border-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        External Link
                    </button>
                </div>

                {/* Stepper */}
                <div className="px-12 mb-12">
                    <div className="flex items-start justify-between w-full">
                        {steps.map((step, index) => {
                            const isLast = index === steps.length - 1;

                            return (
                                <div key={step.id} className={`flex items-start ${isLast ? 'flex-none' : 'flex-1'}`}>
                                    {/* Step Node */}
                                    <div className="relative flex flex-col items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleStepChange(index)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-300 ${index <= currentStep
                                                    ? 'bg-orange-600 text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                        <div className={`absolute top-10 w-32 left-1/2 transform -translate-x-1/2 text-center text-xs ${index === currentStep ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
                                            {step.title}
                                        </div>
                                    </div>

                                    {/* Connecting Line */}
                                    {!isLast && (
                                        <div className={`flex-1 h-1 mt-3.5 mx-2 rounded transition-colors duration-300 ${index < currentStep ? 'bg-orange-600' : 'bg-gray-200'
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
                                    <label className="block text-sm font-medium text-gray-700">Event Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter event name"
                                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Purchase Mode</label>
                                    <div className="flex gap-4 p-3 mb-4 border border-gray-100 rounded-lg bg-gray-50">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="purchaseMode"
                                                value="multiple"
                                                checked={formData.vendorConfig?.purchaseMode === 'multiple'}
                                                onChange={() => setFormData(prev => ({
                                                    ...prev,
                                                    vendorConfig: { ...prev.vendorConfig, purchaseMode: 'multiple' }
                                                }))}
                                                className="text-orange-600 form-radio focus:ring-orange-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Multiple Tickets</span>
                                        </label>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="purchaseMode"
                                                value="single"
                                                checked={formData.vendorConfig?.purchaseMode === 'single'}
                                                onChange={() => setFormData(prev => ({
                                                    ...prev,
                                                    vendorConfig: { ...prev.vendorConfig, purchaseMode: 'single' }
                                                }))}
                                                className="text-orange-600 form-radio focus:ring-orange-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Single Ticket Only</span>
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Determine if users can buy multiple tickets or just one per transaction.</p>
                                </div>

                                {formData.eventType === 'external' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">External URL</label>
                                        <input
                                            type="url"
                                            name="externalUrl"
                                            required
                                            value={formData.externalUrl}
                                            onChange={handleChange}
                                            placeholder="https://example.com/event-details"
                                            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Users will be redirected to this URL when clicking the event.</p>
                                    </div>
                                )}

                                {formData.eventType === 'internal' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            value={formData.description}
                                            placeholder="Enter event description"
                                            onChange={handleChange}
                                            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Event Date Type</label>
                                    <div className="flex gap-4 mb-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="dateMode"
                                                value="single"
                                                checked={dateMode === 'single'}
                                                onChange={() => {
                                                    setDateMode('single');
                                                    setFormData(prev => ({ ...prev, endDate: prev.startDate }));
                                                }}
                                                className="text-orange-600 form-radio"
                                            />
                                            <span className="ml-2">Single Date</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="dateMode"
                                                value="range"
                                                checked={dateMode === 'range'}
                                                onChange={() => setDateMode('range')}
                                                className="text-orange-600 form-radio"
                                            />
                                            <span className="ml-2">Date Range</span>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                {dateMode === 'single' ? 'Event Date' : 'Start Date'}
                                            </label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                required
                                                value={formData.startDate}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        startDate: val,
                                                        endDate: dateMode === 'single' ? val : prev.endDate
                                                    }));
                                                }}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            />
                                        </div>

                                        {dateMode === 'range' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    required
                                                    value={formData.endDate}
                                                    onChange={handleChange}
                                                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                                                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location Name</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter location name"
                                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                </div>

                                {formData.eventType === 'internal' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location Address</label>
                                            <textarea
                                                name="locationAddress"
                                                rows={2}
                                                value={formData.locationAddress}
                                                onChange={handleChange}
                                                placeholder="Enter full address"
                                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location URL (Maps)</label>
                                            <input
                                                type="url"
                                                name="locationUrl"
                                                value={formData.locationUrl}
                                                onChange={handleChange}
                                                placeholder="https://goo.gl/maps/..."
                                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.eventType === 'internal' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={formData.socials.instagram.visible}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            socials: {
                                                                ...prev.socials,
                                                                instagram: { ...prev.socials.instagram, visible: e.target.checked }
                                                            }
                                                        }))}
                                                    />
                                                    <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.socials.instagram.url}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    socials: {
                                                        ...prev.socials,
                                                        instagram: { ...prev.socials.instagram, url: e.target.value }
                                                    }
                                                }))}
                                                placeholder="@username"
                                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium text-gray-700">Website</label>
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={formData.socials.website.visible}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            socials: {
                                                                ...prev.socials,
                                                                website: { ...prev.socials.website, visible: e.target.checked }
                                                            }
                                                        }))}
                                                    />
                                                    <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.socials.website.url}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    socials: {
                                                        ...prev.socials,
                                                        website: { ...prev.socials.website, url: e.target.value }
                                                    }
                                                }))}
                                                placeholder="example.com"
                                                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Seating Plan (Optional)</label>
                                        {formData.seatingPlanUrl && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, seatingPlanUrl: '' }))}
                                                className="text-xs font-medium text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        name="seatingPlanUrl"
                                        value={formData.seatingPlanUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/seating-plan.jpg"
                                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Image URL for the venue seating layout.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Terms & Conditions / Important Info (Optional)</label>
                                    <textarea
                                        name="termsAndConditions"
                                        rows={4}
                                        value={formData.termsAndConditions}
                                        onChange={handleChange}
                                        placeholder="• No outside food and drinks&#10;• Age limit 18+&#10;• No refund policy"
                                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Use bullet points or new lines for better readability.</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Banner URLs</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                bannerUrls: [...prev.bannerUrls, '']
                                            }))}
                                            className="text-xs font-medium text-orange-600 hover:text-orange-700"
                                        >
                                            + Add Banner
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.bannerUrls.map((url, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => {
                                                        const newUrls = [...formData.bannerUrls];
                                                        newUrls[idx] = e.target.value;
                                                        setFormData(prev => ({ ...prev, bannerUrls: newUrls }));
                                                    }}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                                />
                                                {formData.bannerUrls.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            bannerUrls: prev.bannerUrls.filter((_, i) => i !== idx)
                                                        }))}
                                                        className="p-2 text-red-500 rounded hover:bg-red-50"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {formData.bannerUrls.length === 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    bannerUrls: ['']
                                                }))}
                                                className="flex items-center justify-center w-full gap-2 py-3 text-sm text-gray-500 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 hover:text-orange-500"
                                            >
                                                <span>Add Banner Image</span>
                                            </button>
                                        )}
                                        <p className="text-xs text-gray-500">First image will be the main banner. Multiple images will create a carousel.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Ticket Categories */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Ticket Categories</h3>
                                    <button
                                        type="button"
                                        onClick={addCategory}
                                        className="px-3 py-1 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700"
                                    >
                                        + Add Category
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.ticketCategories.map((cat, index) => (
                                        <div key={index} className="relative p-4 border rounded-lg bg-gray-50">
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(index)}
                                                className="absolute text-sm text-red-500 top-2 right-2 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">ID</label>
                                                    <input
                                                        type="text"
                                                        value={cat.id}
                                                        onChange={(e) => updateCategory(index, 'id', e.target.value)}
                                                        placeholder="cat1"
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Name</label>
                                                    <input
                                                        type="text"
                                                        value={cat.name}
                                                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                                                        placeholder="e.g. VIP, General"
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Price</label>
                                                    <input
                                                        type="number"
                                                        value={cat.price || ''}
                                                        onChange={(e) => updateCategory(index, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                                                        placeholder="0"
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Max Price (Optional)</label>
                                                    <input
                                                        type="number"
                                                        value={cat.maxPrice || ''}
                                                        onChange={(e) => updateCategory(index, 'maxPrice', e.target.value === '' ? '' : Number(e.target.value))}
                                                        placeholder="For price range"
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Description</label>
                                                    <textarea
                                                        value={cat.description}
                                                        rows={2}
                                                        placeholder="Enter ticket category description"
                                                        onChange={(e) => updateCategory(index, 'description', e.target.value)}
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Tickets & Promos */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Tickets & Promos</h3>
                                    <button
                                        type="button"
                                        onClick={addTicket}
                                        className="px-3 py-1 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700"
                                    >
                                        + Add Ticket
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.tickets.map((ticket, index) => (
                                        <div key={index} className="relative p-4 border rounded-lg bg-gray-50">
                                            <button
                                                type="button"
                                                onClick={() => removeTicket(index)}
                                                className="absolute text-sm text-red-500 top-2 right-2 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Ticket ID</label>
                                                    <input
                                                        type="text"
                                                        value={ticket.ticketId}
                                                        onChange={(e) => updateTicket(index, 'ticketId', e.target.value)}
                                                        placeholder="t1"
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Ticket Name</label>
                                                    <input
                                                        type="text"
                                                        value={ticket.ticketName}
                                                        onChange={(e) => updateTicket(index, 'ticketName', e.target.value)}
                                                        placeholder="e.g. Early Bird"
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Ticket Type</label>
                                                    <select
                                                        value={ticket.type || 'normal'}
                                                        onChange={(e) => updateTicket(index, 'type', e.target.value)}
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    >
                                                        <option value="normal">Normal</option>
                                                        <option value="b1g1">Buy 1 Get 1</option>
                                                        <option value="discount">Discount</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Category ID (Ref)</label>
                                                    <select
                                                        value={ticket.category}
                                                        onChange={(e) => updateTicket(index, 'category', e.target.value)}
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    >
                                                        <option value="">Select Category</option>
                                                        {formData.ticketCategories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500">Description</label>
                                                    <textarea
                                                        value={ticket.description}
                                                        rows={2}
                                                        placeholder="Enter ticket description"
                                                        onChange={(e) => updateTicket(index, 'description', e.target.value)}
                                                        className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                    />
                                                </div>
                                                <div className="col-span-2 pt-2 mt-2 space-y-2 border-t">
                                                    {ticket.normalPrice && ticket.normalPrice > 0 ? (
                                                        <div className="p-3 space-y-4 border border-orange-100 rounded-md bg-orange-50">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-semibold tracking-wider text-orange-800 uppercase">Promo Price</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateTicket(index, 'normalPrice', 0)}
                                                                    className="text-xs text-red-600 underline hover:text-red-800"
                                                                >
                                                                    Remove Discount
                                                                </button>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700">Normal Price (Original)</label>
                                                                <input
                                                                    type="number"
                                                                    value={ticket.normalPrice || ''}
                                                                    onChange={(e) => updateTicket(index, 'normalPrice', e.target.value === '' ? '' : Number(e.target.value))}
                                                                    placeholder="0"
                                                                    className="block w-full p-1 mt-1 border border-orange-300 rounded-md shadow-sm sm:text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700">Discounted Price (Selling)</label>
                                                                <input
                                                                    type="number"
                                                                    value={ticket.price || ''}
                                                                    onChange={(e) => updateTicket(index, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                                                                    placeholder="0"
                                                                    className="block w-full p-1 mt-1 font-bold text-orange-600 border border-orange-300 rounded-md shadow-sm sm:text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-500">Price</label>
                                                                <input
                                                                    type="number"
                                                                    value={ticket.price || ''}
                                                                    onChange={(e) => updateTicket(index, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                                                                    placeholder="0"
                                                                    className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateTicket(index, 'normalPrice', ticket.price || 0)}
                                                                className="flex items-center space-x-1 text-xs text-orange-600 hover:text-orange-800"
                                                            >
                                                                <span>+ Add Discount / Promo Price</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Template Selection */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-lg font-medium text-gray-900">Template Selection</h3>
                                <p className="mb-4 text-sm text-gray-500">Choose a visual style for your event page.</p>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {[1, 2, 3, 4, 5].map((id) => (
                                        <div
                                            key={id}
                                            onClick={() => handleTemplateChange('index', id)}
                                            className={`cursor-pointer border rounded-xl p-4 transition-all relative overflow-hidden ${formData.templates.index.id === id
                                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500 ring-opacity-50'
                                                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`font-bold text-lg ${formData.templates.index.id === id ? 'text-orange-700' : 'text-gray-800'}`}>
                                                    Template {id}
                                                </span>
                                                {formData.templates.index.id === id && (
                                                    <span className="px-2 py-1 text-xs font-bold text-orange-600 bg-orange-100 rounded-full">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                            {/* <div className="text-sm text-gray-500">
                                                {id === 1 && 'Standard Layout'}
                                                {id === 2 && 'Modern Gradient'}
                                                {id === 3 && 'Minimal Dark'}
                                                {id === 4 && 'Swiss Minimalist'}
                                                {id === 5 && 'Professional Light'}
                                            </div> */}
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
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent form submission
                                    handleStepChange(Math.min(steps.length - 1, currentStep + 1));
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700"
                            >
                                Next
                            </button>
                        ) : (
                            !isViewMode && (
                                <button
                                    type="button" // Change from submit to button
                                    onClick={handleSubmit} // Trigger submit logic manually
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
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
                title="Save Event"
                message="Are you sure you want to save this event?"
                confirmLabel="Save Event"
            />

            {/* Preview Section */}
            <div className="hidden lg:block w-[375px] flex-shrink-0 sticky top-4 h-[calc(100vh-2rem)]">
                {/* Template Menu Overlay */}
                <div className={`absolute -top-2 left-0 right-0 z-[60] px-6 flex justify-center transition-all duration-300 transform opacity-100 translate-y-0`}>
                    <div className="flex items-center justify-between w-full max-w-sm px-4 py-2 border border-gray-100 rounded-full shadow-lg bg-white/90 backdrop-blur-md">
                        <div className="w-8"></div> {/* Spacer */}
                        <h3 className="text-sm font-semibold text-center text-gray-700">Mobile Preview</h3>
                        <div className="relative flex justify-end w-8">
                            <button
                                onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                                className={`p-1.5 rounded-full transition-colors ${isTemplateMenuOpen ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-500'}`}
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
                                <div className="absolute right-0 z-50 w-56 py-2 mt-3 overflow-hidden origin-top-right bg-white border border-gray-100 shadow-xl top-full rounded-xl ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase border-b border-gray-50">
                                        Template for {activeScreen}
                                    </div>
                                    {[1, 2, 3, 4, 5].map(id => (
                                        <button
                                            key={id}
                                            onClick={() => {
                                                handleTemplateChange(activeScreen, id);
                                                setIsTemplateMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors group ${formData.templates[activeScreen].id === id
                                                    ? 'bg-orange-50/50'
                                                    : ''
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${formData.templates[activeScreen].id === id ? 'text-orange-700' : 'text-gray-700'}`}>
                                                    Template {id}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {id === 1 ? 'Standard Layout' : id === 2 ? 'Modern Visual' : id === 3 ? 'Professional Minimal' : id === 4 ? 'Swiss Minimalist' : 'Professional Light'}
                                                </span>
                                            </div>
                                            {formData.templates[activeScreen].id === id && (
                                                <div className="text-orange-600 bg-white rounded-full p-0.5 shadow-sm">
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

                <div className="flex items-center justify-center h-full pb-8 pt-14">
                    <div className="scale-[0.85] origin-top h-full">
                        <MobilePreview
                            templates={formData.templates}
                            activeScreen={activeScreen}
                            data={formData}
                            onScreenChange={setActiveScreen}
                            eventType={formData.eventType}
                            externalUrl={formData.externalUrl}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
