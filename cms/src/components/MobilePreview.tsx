import React from 'react';

// Icons as SVG components for exact matching
const Icons = {
    Calendar: ({ color = "#0E0E0E" }: { color?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Location: ({ color = "#0E0E0E" }: { color?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16 17 20 13 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 13 8 17 12 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    ChevronRight: ({ color = "#0E0E0E" }: { color?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    ChevronDownOrange: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="#FF8736" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    BackArrow: ({ color = "#0E0E0E" }: { color?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Minus: ({ color = "#C6C6C6" }: { color?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Plus: ({ color = "#0E0E0E" }: { color?: string }) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Wifi: () => (
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.00039 12.6667C9.36858 12.6667 9.66706 12.3682 9.66706 12C9.66706 11.6318 9.36858 11.3333 9.00039 11.3333C8.6322 11.3333 8.33372 11.6318 8.33372 12C8.33372 12.3682 8.6322 12.6667 9.00039 12.6667Z" fill="#0E0E0E" />
            <path d="M13.6062 8.27301C12.3275 7.15276 10.7107 6.5332 9.00035 6.5332C7.29003 6.5332 5.6732 7.15276 4.39453 8.27301L3.45209 7.33056C4.96225 6.00762 6.91428 5.20054 8.99986 5.19987C11.0864 5.20054 13.0385 6.00762 14.5486 7.33056L13.6062 8.27301Z" fill="#0E0E0E" />
            <path d="M16.4344 5.44474C14.4172 3.67784 11.7891 2.66654 9.00035 2.66654C6.21157 2.66654 3.58352 3.67784 1.56625 5.44474L0.62381 4.50229C2.87272 2.53235 5.85041 1.3332 9.00035 1.3332C12.1503 1.3332 15.128 2.53235 17.3769 4.50229L16.4344 5.44474Z" fill="#0E0E0E" />
        </svg>
    ),
    Battery: () => (
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="18" height="10" rx="2" stroke="#0E0E0E" strokeWidth="1.5" />
            <path d="M21 4V8" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="3" y="3" width="14" height="6" rx="1" fill="#0E0E0E" />
        </svg>
    ),
    Signal: () => (
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 1.5V10.5" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M13 3.5V10.5" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9 5.5V10.5" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 7.5V10.5" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M1 9.5V10.5" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    Instagram: ({ color = "#FF8736" }: { color?: string }) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
    ),
    Browser: ({ color = "#FF8736" }: { color?: string }) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    )
};

const StatusBar = () => (
    <div className="h-[44px] w-full flex justify-between items-center px-6 text-[#0E0E0E] z-50 absolute top-0 left-0">
        <div className="text-[15px] font-semibold tracking-wide pl-2">9:41</div>
        <div className="flex items-center gap-1.5 pr-1">
            <Icons.Signal />
            <Icons.Wifi />
            <Icons.Battery />
        </div>
    </div>
);

const TopBar = ({ title }: { title: string }) => (
    <div className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
        <div className="h-[44px]"></div>
        <div className="h-[56px] w-full flex items-center justify-between px-4">
            <div className="flex items-center justify-center w-10 h-10 -ml-2">
                <Icons.BackArrow />
            </div>
            <div className="text-[16px] font-semibold text-[#0E0E0E] line-clamp-1 flex-1 text-center px-2">
                {title}
            </div>
            <div className="w-10 h-10"></div> {/* Spacer for centering */}
        </div>
    </div>
);


interface TicketCategory {
    id: string | number;
    name: string;
    price: number;
    maxPrice?: number;
    description?: string;
    status?: string;
}

interface Ticket {
    ticketId: string | number;
    ticketName: string;
    category: string;
    type?: 'normal' | 'b1g1' | 'discount';
    price: number;
    normalPrice?: number;
    description?: string;
    isAvailable?: number;
}

interface MobilePreviewProps {
    templates: {
        index: { id: number; title?: string; bannerUrl?: string };
        bookTicket: { id: number; title?: string; bannerUrl?: string };
        visitorList: { id: number; title?: string; bannerUrl?: string };
        visitorInput: { id: number; title?: string; bannerUrl?: string };
    };
    activeScreen: 'index' | 'bookTicket' | 'visitorList' | 'visitorInput';
    data: {
        name: string;
        description?: string;
        startDate: string;
        endDate: string;
        price: number;
        location?: string;
        locationAddress?: string;
        locationUrl?: string;
        seatingPlanUrl?: string;
        termsAndConditions?: string;
        bannerUrl?: string;
        bannerUrls?: string[];
        socials?: {
            instagram?: { url: string; visible: boolean };
            website?: { url: string; visible: boolean };
        };
        ticketCategories?: TicketCategory[];
        tickets?: Ticket[];
        vendorConfig?: {
            purchaseMode?: 'single' | 'multiple';
        };
    };
    onScreenChange?: (screen: 'index' | 'bookTicket' | 'visitorList' | 'visitorInput') => void;
    eventType?: 'internal' | 'external';
    externalUrl?: string;
}

const ImageCarousel = ({ images }: { images: string[] }) => {
    const validImages = images.filter(img => img && img.trim().length > 0);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        if (validImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [validImages.length]);

    if (!validImages || validImages.length === 0) return (
        <div className="w-full h-full flex items-center justify-center text-xs text-[#C6C6C6] bg-gray-100">
            No Banner
        </div>
    );

    if (validImages.length === 1) return (
        <img src={validImages[0]} alt="Banner" className="object-cover w-full h-full" />
    );

    return (
        <div className="relative w-full h-full">
            {validImages.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={img} alt={`Banner ${idx + 1}`} className="object-cover w-full h-full" />
                </div>
            ))}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                {validImages.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export function MobilePreview({ templates, activeScreen, data, onScreenChange, eventType = 'internal', externalUrl }: MobilePreviewProps) {
    const templateConfig = templates[activeScreen];
    const templateId = templateConfig.id;
    const screenTitle = templateConfig.title || data.name || 'Event Name';

    // Date Formatting Logic
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    };

    const formatDateRange = (startStr: string, endStr: string) => {
        if (!startStr) return '';
        if (!endStr || startStr === endStr) return formatDate(startStr);

        const start = new Date(startStr);
        const end = new Date(endStr);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return formatDate(startStr);

        // Same Month and Year
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            const endFormatted = formatDate(endStr);
            return `${start.getDate()} - ${endFormatted}`;
        }

        // Same Year, Different Month
        if (start.getFullYear() === end.getFullYear()) {
            const startFormatted = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(start);
            const endFormatted = formatDate(endStr);
            return `${startFormatted} - ${endFormatted}`;
        }

        // Different Year
        return `${formatDate(startStr)} - ${formatDate(endStr)}`;
    };

    const displayDate = formatDateRange(data.startDate, data.endDate);

    // Resolve banners: prefer template specific banner, then data.bannerUrls, then data.bannerUrl
    const validBannerUrls = data.bannerUrls?.filter(url => url && url.trim().length > 0) || [];
    const templateBanner = templateConfig.bannerUrl && templateConfig.bannerUrl.trim().length > 0
        ? templateConfig.bannerUrl
        : undefined;

    const bannerImages = templateBanner
        ? [templateBanner]
        : (validBannerUrls.length > 0 ? validBannerUrls : (data.bannerUrl ? [data.bannerUrl] : []));

    const screenBanner = bannerImages.length > 0 ? bannerImages[0] : undefined;

    // State for description expansion
    const [isDescExpanded, setIsDescExpanded] = React.useState(false);
    const [showReadMore, setShowReadMore] = React.useState(false);
    const descClampRef = React.useRef<HTMLParagraphElement | HTMLDivElement>(null);
    const descFullRef = React.useRef<HTMLParagraphElement | HTMLDivElement>(null);

    // Reset expansion when screen or template changes
    React.useEffect(() => {
        setIsDescExpanded(false);
    }, [activeScreen, templateId]);
    React.useEffect(() => {
        const clampEl = descClampRef.current as HTMLElement | null;
        const fullEl = descFullRef.current as HTMLElement | null;
        if (!clampEl || !fullEl) {
            setShowReadMore(false);
            return;
        }
        const clampH = clampEl.getBoundingClientRect().height;
        const fullH = fullEl.getBoundingClientRect().height;
        setShowReadMore(fullH > clampH + 1);
    }, [data.description, activeScreen, templateId]);

    // External Event Preview Logic
    if (eventType === 'external') {
        return (
            <div className="w-[375px] h-[calc(100vh-2rem)] bg-white border-8 border-gray-800 rounded-[3rem] overflow-hidden shadow-xl relative mx-auto sticky top-4">
                {/* Notch */}
                <div className="absolute top-0 z-20 w-32 h-6 transform -translate-x-1/2 bg-gray-800 left-1/2 rounded-b-xl"></div>

                <StatusBar />
                <TopBar title={screenTitle} />

                <div className="w-full h-[calc(100%-88px)] bg-gray-50 flex items-center justify-center relative">
                    {externalUrl ? (
                        <iframe
                            src={externalUrl}
                            className="w-full h-full border-0"
                            title="External Event Preview"
                            sandbox="allow-same-origin allow-scripts allow-forms"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center text-gray-400">
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                            </div>
                            <p className="text-sm">Enter an external URL to see the preview</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Font family simulation (TT Interphases Pro -> sans-serif/Inter)
    const fontMain = "font-sans";

    // --- Render Functions for Template 1 (Classic / Standard) ---
    const renderIndexT1 = () => (
        <div className={`flex flex-col bg-white text-[#0E0E0E] ${fontMain}`}>
            <TopBar title={data.name} />
            {/* Hero Banner - Aspect Ratio approx 343:264 */}
            <div className="px-6 pt-4 pb-4">
                <div className="relative w-full aspect-[343/264] rounded-lg overflow-hidden bg-gray-100">
                    <ImageCarousel images={bannerImages} />
                </div>
            </div>

            <div className="px-6 pb-8">
                {/* Title - txt-h2 (24px Bold) */}
                <h1 className="text-[24px] font-bold mb-2 leading-[28.5px] text-[#0E0E0E]">
                    {data.name}
                </h1>

                {/* Date & Location - txt-body2-px (14px) */}
                <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-[14px]">
                        <div className="flex items-center justify-center w-6 h-6"><Icons.Calendar /></div>
                        <span className="text-[#0E0E0E]">{displayDate}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[14px]">
                        <div className="w-6 h-6 flex items-center justify-center mt-0.5"><Icons.Location /></div>
                        <div className="flex-1">
                            <a href={data.locationUrl || '#'} target={data.locationUrl ? "_blank" : undefined} className={data.locationUrl ? "hover:underline hover:text-orange-500" : ""}>
                                <div className="font-semibold text-[#0E0E0E]">{data.location || 'Location'}</div>
                            </a>
                            {data.locationAddress && (
                                <div className="text-[12px] text-[#4E4E4E] mt-1 line-clamp-1 leading-[16px]">{data.locationAddress}</div>
                            )}
                        </div>
                        <div className="w-6 h-6"><Icons.ChevronRight /></div>
                    </div>
                </div>

                {/* Description Mock - Collapsible */}
                <div className="mb-6">
                    <p ref={descClampRef} className={`text-[14px] text-[#7A7A7A] leading-[20px] mb-2 ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                        {data.description || 'This is a preview of the event description. It will appear here on the actual device.'}
                    </p>
                    <div ref={descFullRef} aria-hidden className="text-[14px] text-[#7A7A7A] leading-[20px] mb-0 absolute -left-[9999px] top-0 w-[343px]">
                        {data.description || ''}
                    </div>
                    {isDescExpanded && data.socials && (data.socials.instagram?.visible || data.socials.website?.visible) && (
                        <div className="flex flex-col items-start mt-4 rounded-lg shadow-sm w-fit">
                            {data.socials.instagram?.visible && data.socials.instagram.url && (
                                <div className="flex items-start gap-2">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-50">
                                        <Icons.Instagram />
                                    </div>
                                    <span className="text-[12px] font-medium text-[#0E0E0E]">{data.socials.instagram.url}</span>
                                </div>
                            )}
                            {data.socials.instagram?.visible && data.socials.instagram.url && data.socials.website?.visible && data.socials.website.url && (
                                <div className="w-[1px] h-3 bg-[#DADADA]"></div>
                            )}
                            {data.socials.website?.visible && data.socials.website.url && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-50">
                                        <Icons.Browser />
                                    </div>
                                    <span className="text-[12px] font-medium text-[#0E0E0E]">{data.socials.website.url}</span>
                                </div>
                            )}
                        </div>
                    )}
                    {showReadMore && (
                        <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={() => setIsDescExpanded(!isDescExpanded)}>
                            <span className="text-[#FF8736] text-[12px] font-bold border-b-2 border-[#FF8736] leading-[16.8px]">
                                {isDescExpanded ? 'Tutup' : 'Lihat Detail'}
                            </span>
                            <div className={`transform transition-transform ${isDescExpanded ? 'rotate-180' : ''}`}>
                                <Icons.ChevronDownOrange />
                            </div>
                        </div>
                    )}

                    {/* Seating Plan - Template 1 */}
                    {data.seatingPlanUrl && (
                        <div className="pt-4 mt-6 border-t border-gray-200">
                            <h3 className="font-bold mb-3 text-[16px]">Seating Plan</h3>
                            <div className="overflow-hidden bg-gray-100 border border-gray-200 rounded-lg">
                                <img src={data.seatingPlanUrl} alt="Seating Plan" className="object-cover w-full h-auto" />
                            </div>
                        </div>
                    )}

                    {/* Terms & Conditions - Template 1 */}
                    {data.termsAndConditions && (
                        <div className="pt-4 mt-6 border-t border-gray-200">
                            <h3 className="font-bold mb-2 text-[16px]">Important Info</h3>
                            <div className="p-4 border border-orange-100 rounded-lg bg-orange-50">
                                <div className="text-[12px] text-[#4E4E4E] whitespace-pre-line leading-relaxed">
                                    {data.termsAndConditions}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ticket Categories List (Index Screen uses Categories) */}
                <div>
                    <h3 className="font-bold mb-4 text-[16px] leading-[19px]">Pilih Tiket</h3>
                    <div className="pb-6 space-y-4">
                        {data.ticketCategories && data.ticketCategories.length > 0 ? (
                            data.ticketCategories.map((cat, idx) => (
                                <div key={idx} onClick={() => onScreenChange?.('bookTicket')} className="bg-white rounded-lg border border-[#C6C6C6] overflow-hidden flex flex-col min-h-[108px] cursor-pointer hover:border-[#FF8736] transition-colors">
                                    <div className="p-[15px] flex gap-2 items-center flex-1">
                                        <div className="flex-1 space-y-1">
                                            <div className="text-[18px] font-bold leading-[120%] text-[#0E0E0E] line-clamp-2">{cat.name}</div>
                                            <div className="text-[12px] text-[#4E4E4E] leading-[140%] line-clamp-2">{cat.description}</div>
                                        </div>
                                        <div className="w-[80px] h-[80px] bg-[#F9F9F9] rounded-full -mr-6 opacity-50"></div>
                                    </div>
                                    <div className="h-[1px] bg-[#DADADA] w-full"></div>
                                    <div className="p-[15px] pt-4 pb-4 flex justify-between items-center">
                                        <div>
                                            <div className="text-[10px] text-[#4E4E4E] leading-[7px] mb-1">Mulai dari</div>
                                            <div className="text-[16px] font-semibold text-[#0E0E0E]">
                                                {cat.maxPrice && cat.maxPrice > cat.price
                                                    ? `Rp ${Number(cat.price).toLocaleString('id-ID')} - ${Number(cat.maxPrice).toLocaleString('id-ID')}`
                                                    : `Rp ${Number(cat.price).toLocaleString('id-ID')}`
                                                }
                                            </div>
                                        </div>
                                        <div className="w-6 h-6"><Icons.ChevronRight /></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-[#C6C6C6] italic text-center py-4">No categories added</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Render Functions for Template 2 (Modern / Visual) ---
    const renderIndexT2 = () => (
        <div className={`flex flex-col bg-white text-[#0E0E0E] ${fontMain}`}>
            <TopBar title={data.name} />
            {/* Full Width Hero Image with Overlay Title */}
            <div className="sticky top-0 w-full aspect-[4/3] bg-gray-100 z-0">
                <ImageCarousel images={bannerImages} />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h1 className="text-[28px] font-bold text-white leading-tight mb-2 drop-shadow-md">
                        {data.name}
                    </h1>
                    <div className="flex items-center gap-2 text-white/90 text-[12px]">
                        <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm">{displayDate}</span>
                        <a href={data.locationUrl || '#'} target={data.locationUrl ? "_blank" : undefined} className={`bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md line-clamp-1 ${data.locationUrl ? "hover:bg-white/30 cursor-pointer" : ""}`}>
                            {data.location || 'Location'}
                        </a>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-4 relative z-10 bg-white rounded-t-3xl pt-6 pb-8 min-h-[500px]">
                {/* Description */}
                <div className="mb-8">
                    <h3 className="font-bold text-[16px] mb-2">About Event</h3>
                    <p ref={descClampRef} className={`text-[14px] text-[#4E4E4E] leading-[22px] ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                        {data.description || 'This is a preview of the event description. Modern layout focuses on visuals and clean typography.'}
                    </p>
                    <div ref={descFullRef} aria-hidden className="text-[14px] text-[#4E4E4E] leading-[22px] absolute -left-[9999px] top-0 w-[343px]">
                        {data.description || ''}
                    </div>
                    {showReadMore && (
                        <div className="flex items-center gap-1 mt-2 cursor-pointer" onClick={() => setIsDescExpanded(!isDescExpanded)}>
                            <span className="text-[#FF8736] text-[12px] font-bold border-b-2 border-[#FF8736] leading-[16.8px]">
                                {isDescExpanded ? 'Tutup' : 'Lihat Detail'}
                            </span>
                            <div className={`transform transition-transform ${isDescExpanded ? 'rotate-180' : ''}`}>
                                <Icons.ChevronDownOrange />
                            </div>
                        </div>
                    )}
                </div>
                {/* Socials */}
                {data.socials && (data.socials.instagram?.visible || data.socials.website?.visible) && (
                    <div className="flex items-center gap-4 mt-4 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-fit">
                        {data.socials.instagram?.visible && data.socials.instagram.url && (
                            <div className="flex items-center gap-2">
                                <Icons.Instagram color="#0E0E0E" />
                                <span className="text-xs font-bold text-[#0E0E0E]">{data.socials.instagram.url}</span>
                            </div>
                        )}
                        {data.socials.instagram?.visible && data.socials.instagram.url && data.socials.website?.visible && data.socials.website.url && (
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        )}
                        {data.socials.website?.visible && data.socials.website.url && (
                            <div className="flex items-center gap-2">
                                <Icons.Browser color="#0E0E0E" />
                                <span className="text-xs font-bold text-[#0E0E0E]">{data.socials.website.url}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Ticket Categories - Grid Layout */}
                <div>
                    <h3 className="font-bold mb-4 text-[16px]">Tickets</h3>
                    <div className="grid grid-cols-2 gap-3 pb-6">
                        {data.ticketCategories && data.ticketCategories.length > 0 ? (
                            data.ticketCategories.map((cat, idx) => (
                                <div key={idx} onClick={() => onScreenChange?.('bookTicket')} className="bg-white rounded-xl border border-[#E0E0E0] p-3 flex flex-col justify-between shadow-sm h-[140px] cursor-pointer hover:border-[#0E0E0E] transition-colors">
                                    <div>
                                        <div className="text-[14px] font-bold leading-tight mb-1 line-clamp-2">{cat.name}</div>
                                        <div className="text-[10px] text-[#7A7A7A] line-clamp-2">{cat.description}</div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-[10px] text-[#7A7A7A]">Starts from</div>
                                        <div className="text-[14px] font-bold text-[#FF8736]">
                                            {cat.maxPrice && cat.maxPrice > cat.price
                                                ? `Rp ${Number(cat.price).toLocaleString('id-ID')} - ${Number(cat.maxPrice).toLocaleString('id-ID')}`
                                                : `Rp ${Number(cat.price).toLocaleString('id-ID')}`
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-xs text-[#C6C6C6] italic text-center py-4">No categories</div>
                        )}
                    </div>
                </div>

                {/* Seating Plan - Template 2 */}
                {data.seatingPlanUrl && (
                    <div className="mb-6">
                        <h3 className="font-bold text-[16px] mb-3">Venue Layout</h3>
                        <div className="relative overflow-hidden border-2 border-white shadow-lg rounded-xl">
                            <div className="absolute inset-0 z-10 pointer-events-none bg-black/10"></div>
                            <img src={data.seatingPlanUrl} alt="Seating Plan" className="object-cover w-full h-auto transition-transform duration-500 transform hover:scale-105" />
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full z-20">Tap to Zoom</div>
                        </div>
                    </div>
                )}

                {/* Terms & Conditions - Template 2 (Moved to bottom) */}
                {data.termsAndConditions && (
                    <div className="mt-6 mb-8">
                        <h3 className="font-bold text-[16px] mb-3">Terms & Conditions</h3>
                        <div className="bg-[#1A1A1A] text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 rounded-bl-full bg-white/10"></div>
                            <div className="text-[12px] text-gray-300 whitespace-pre-line leading-relaxed relative z-10 font-light">
                                {data.termsAndConditions}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // --- Render Functions for Template 3 (Minimal / Professional) ---
    const renderIndexT3 = () => (
        <div className={`flex flex-col bg-[#F8F9FA] text-[#0E0E0E] ${fontMain}`}>
            <TopBar title={data.name} />
            {/* Header Area - Split Layout */}
            <div className="p-6 pb-0 bg-white">
                <div className="flex gap-4 mb-6">
                    <div className="w-[100px] h-[100px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                        <ImageCarousel images={bannerImages} />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                        <div className="inline-block px-2 py-0.5 bg-[#F0F0F0] rounded text-[10px] font-semibold text-[#4E4E4E] mb-2">EVENT</div>
                        <h1 className="text-[20px] font-bold leading-tight mb-1">{data.name}</h1>
                        <a href={data.locationUrl || '#'} target={data.locationUrl ? "_blank" : undefined} className={`text-[12px] text-[#7A7A7A] ${data.locationUrl ? "hover:underline hover:text-orange-500" : ""}`}>
                            {data.location || 'Location'}
                        </a>
                    </div>
                </div>

                {/* Date Strip */}
                <div className="flex border-t border-b border-[#F0F0F0] py-4 mb-4">
                    <div className="flex-1 border-r border-[#F0F0F0] pr-4">
                        <div className="text-[10px] text-[#7A7A7A] uppercase tracking-wider mb-1">Date</div>
                        <div className="text-[14px] font-semibold">{displayDate}</div>
                    </div>
                    <div className="flex-1 pl-4">
                        <div className="text-[10px] text-[#7A7A7A] uppercase tracking-wider mb-1">Time</div>
                        <div className="text-[14px] font-semibold">10:00 - 22:00</div>
                    </div>
                </div>
            </div>

            <div className="px-6 pt-6 pb-8">
                {/* Description */}
                <div className="mb-8">
                    <h3 className="font-bold text-[14px] uppercase tracking-wide mb-3">Details</h3>
                    <p ref={descClampRef} className={`text-[13px] text-[#4E4E4E] leading-[20px] ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                        {data.description || 'Minimal layout focuses on structured information and clarity. Ideal for workshops and conferences.'}
                    </p>
                    <div ref={descFullRef} aria-hidden className="text-[13px] text-[#4E4E4E] leading-[20px] absolute -left-[9999px] top-0 w-[343px]">
                        {data.description || ''}
                    </div>
                    {showReadMore && (
                        <div className="flex items-center gap-1 mt-2 cursor-pointer" onClick={() => setIsDescExpanded(!isDescExpanded)}>
                            <span className="text-[#FF8736] text-[12px] font-bold border-b-2 border-[#FF8736] leading-[16.8px]">
                                {isDescExpanded ? 'Tutup' : 'Lihat Detail'}
                            </span>
                            <div className={`transform transition-transform ${isDescExpanded ? 'rotate-180' : ''}`}>
                                <Icons.ChevronDownOrange />
                            </div>
                        </div>
                    )}

                    {/* Socials */}
                    {data.socials && (data.socials.instagram?.visible || data.socials.website?.visible) && (
                        <div className="flex items-center gap-5 mt-4 py-2 border-b border-[#F0F0F0] w-fit">
                            {data.socials.instagram?.visible && data.socials.instagram.url && (
                                <div className="flex items-center gap-2">
                                    <Icons.Instagram color="#7A7A7A" />
                                    <span className="text-[11px] font-semibold text-[#0E0E0E]">{data.socials.instagram.url}</span>
                                </div>
                            )}
                            {data.socials.website?.visible && data.socials.website.url && (
                                <div className="flex items-center gap-2">
                                    <Icons.Browser color="#7A7A7A" />
                                    <span className="text-[11px] font-semibold text-[#0E0E0E]">{data.socials.website.url}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Ticket Categories - List Layout */}
                <div>
                    <h3 className="font-bold text-[14px] uppercase tracking-wide mb-3">Packages</h3>
                    <div className="pb-6 space-y-3">
                        {data.ticketCategories && data.ticketCategories.length > 0 ? (
                            data.ticketCategories.map((cat, idx) => (
                                <div key={idx} onClick={() => onScreenChange?.('bookTicket')} className="bg-white p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow">
                                    <div className="flex-1">
                                        <div className="text-[15px] font-bold text-[#0E0E0E]">{cat.name}</div>
                                        <div className="text-[12px] text-[#7A7A7A] mt-0.5">{cat.description}</div>
                                    </div>
                                    <div className="pl-4 text-right">
                                        <div className="text-[14px] font-semibold text-[#0E0E0E]">
                                            {cat.maxPrice && cat.maxPrice > cat.price
                                                ? `Rp ${Number(cat.price).toLocaleString('id-ID')} - ${Number(cat.maxPrice).toLocaleString('id-ID')}`
                                                : `Rp ${Number(cat.price).toLocaleString('id-ID')}`
                                            }
                                        </div>
                                        <div className="text-[10px] text-[#7A7A7A] mt-1">/pax</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-[#C6C6C6] italic text-center py-4">No packages available</div>
                        )}
                    </div>
                </div>

                {/* Terms & Conditions - Template 3 (Moved after tickets) */}
                {data.termsAndConditions && (
                    <div className="mt-6 border-t border-[#F0F0F0] pt-6">
                        <h3 className="font-bold text-[14px] uppercase tracking-wide mb-3">Event Policy</h3>
                        <div className="text-[12px] text-[#4E4E4E] whitespace-pre-line leading-relaxed pl-3 border-l-2 border-[#0E0E0E]">
                            {data.termsAndConditions}
                        </div>
                    </div>
                )}

                {/* Seating Plan - Template 3 (Moved after T&C) */}
                {data.seatingPlanUrl && (
                    <div className="mt-6 border-t border-[#F0F0F0] pt-6">
                        <h3 className="font-bold text-[14px] uppercase tracking-wide mb-3">Seating Map</h3>
                        <div className="border border-[#E0E0E0] p-1 bg-white">
                            <img src={data.seatingPlanUrl} alt="Seating Plan" className="w-full h-auto transition-all grayscale hover:grayscale-0" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // --- Render Functions for Index (Template 4 - Swiss Minimalist) ---
    const renderIndexT4 = () => (
        <div className={`flex flex-col h-full bg-[#FFFFFF] ${fontMain} text-[#1A1A1A] relative`}>
            {/* Back Arrow - Floating/Sticky */}
            <div className="absolute top-[50px] left-4 z-40">
                <div className="flex items-center justify-center w-10 h-10 transition-opacity cursor-pointer hover:opacity-70">
                    <Icons.BackArrow color="#1A1A1A" />
                </div>
            </div>

            <div className="sticky top-0 z-30 pointer-events-none">
                <div className="h-[44px]"></div> {/* Status Bar Spacer */}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {/* Hero Section */}
                <div className="relative w-full aspect-[4/3] bg-[#F5F5F7] overflow-hidden">
                    <ImageCarousel images={bannerImages} />
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 to-transparent">
                        <h1 className="text-white text-[32px] font-bold leading-tight tracking-tight">
                            {data.name}
                        </h1>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col gap-8">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-8 border-b border-[#E5E5E5] pb-8">
                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Date</div>
                                <div className="text-[16px] font-medium">{data.startDate}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Location</div>
                                <a href={data.locationUrl || '#'} target={data.locationUrl ? "_blank" : undefined} className={data.locationUrl ? "hover:underline" : ""}>
                                    <div className="text-[16px] font-medium">{data.location || 'TBA'}</div>
                                </a>
                                {data.locationAddress && <div className="text-[12px] text-[#636366] mt-1">{data.locationAddress}</div>}
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <h3 className="text-[20px] font-bold mb-3 text-[#1A1A1A] tracking-tight">About Event</h3>
                            <p ref={descClampRef} className={`text-[15px] leading-relaxed text-[#4A4A4A] font-normal ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                                {data.description || 'Join us for an unforgettable experience. This event brings together the best minds and talents for a unique showcase.'}
                            </p>
                            <div ref={descFullRef} aria-hidden className="text-[15px] leading-relaxed text-[#4A4A4A] absolute -left-[9999px] top-0 w-[343px]">
                                {data.description || ''}
                            </div>
                            {showReadMore && (
                                <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="mt-3 text-[#007AFF] text-[14px] font-medium hover:underline">
                                    {isDescExpanded ? 'Tutup' : 'Lihat Detail'}
                                </button>
                            )}
                            {data.socials && (data.socials.instagram?.visible || data.socials.website?.visible) && (
                                <div className="flex items-center gap-6 mt-5 pt-5 border-t border-[#E5E5E5]">
                                    {data.socials.instagram?.visible && data.socials.instagram.url && (
                                        <div className="flex items-center gap-2">
                                            <Icons.Instagram color="#1A1A1A" />
                                            <span className="text-[12px] font-medium text-[#1A1A1A]">{data.socials.instagram.url}</span>
                                        </div>
                                    )}
                                    {data.socials.website?.visible && data.socials.website.url && (
                                        <div className="flex items-center gap-2">
                                            <Icons.Browser color="#1A1A1A" />
                                            <span className="text-[12px] font-medium text-[#1A1A1A]">{data.socials.website.url}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tickets */}
                        <div>
                            <h3 className="text-[20px] font-bold mb-4 text-[#1A1A1A] tracking-tight">Select Ticket</h3>
                            <div className="space-y-4">
                                {data.ticketCategories && data.ticketCategories.length > 0 ? (
                                    data.ticketCategories.map((cat, idx) => (
                                        <div key={idx} onClick={() => onScreenChange?.('bookTicket')} className="group flex flex-col justify-between p-5 bg-[#F5F5F7] hover:bg-[#EBEBF0] transition-all cursor-pointer border-l-4 border-[#1A1A1A]">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="font-bold text-[18px] text-[#1A1A1A]">{cat.name}</div>
                                                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Icons.ChevronRight color="white" />
                                                </div>
                                            </div>
                                            <div className="text-[13px] text-[#636366] mb-3">{cat.description}</div>
                                            <div className="text-right border-t border-[#E5E5E5] pt-3 w-full">
                                                <div className="text-[11px] text-[#8E8E93] uppercase tracking-wide mb-1">Starting from</div>
                                                <div className="font-bold text-[20px] text-[#1A1A1A]">
                                                    {cat.maxPrice && cat.maxPrice > cat.price
                                                        ? `Rp ${Number(cat.price).toLocaleString('id-ID')} - ${Number(cat.maxPrice).toLocaleString('id-ID')}`
                                                        : `Rp ${Number(cat.price).toLocaleString('id-ID')}`
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center bg-[#F5F5F7] text-[#8E8E93] italic">No tickets available</div>
                                )}
                            </div>
                        </div>

                        {/* Seating Plan - Template 4 (Moved after tickets) */}
                        {data.seatingPlanUrl && (
                            <div className="mt-4 border-t border-[#E5E5E5] pt-8">
                                <h3 className="text-[20px] font-bold mb-4 text-[#1A1A1A] tracking-tight">Floor Plan</h3>
                                <div className="rounded-[12px] overflow-hidden bg-gray-50 border border-[#E5E5E5]">
                                    <img src={data.seatingPlanUrl} alt="Seating Plan" className="w-full h-auto" />
                                </div>
                            </div>
                        )}

                        {/* Terms & Conditions - Template 4 (Moved after Seating) */}
                        {data.termsAndConditions && (
                            <div className="mt-8">
                                <h3 className="text-[20px] font-bold mb-4 text-[#1A1A1A] tracking-tight">Good to Know</h3>
                                <div className="bg-[#F5F5F7] p-5 rounded-[12px]">
                                    <div className="text-[14px] text-[#4A4A4A] whitespace-pre-line leading-relaxed font-normal">
                                        {data.termsAndConditions}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Render Functions for Index (Template 5 - Professional Light) ---
    const renderIndexT5 = () => (
        <div className={`flex flex-col h-full bg-[#F9FAFB] text-[#111827] relative overflow-hidden ${fontMain}`}>
            {/* TopBar Replacement */}
            <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-sm border-b border-gray-200">
                <div className="h-[44px]"></div>
                <div className="h-[56px] w-full flex items-center justify-between px-4">
                    <div className="flex items-center justify-center w-10 h-10 -ml-2">
                        <Icons.BackArrow color="#111827" />
                    </div>
                    <div className="text-[16px] font-semibold text-[#111827] line-clamp-1 flex-1 text-center px-2">
                        {data.name}
                    </div>
                    <div className="w-10 h-10"></div>
                </div>
            </div>

            <div className="relative z-10 flex-1 px-5 pt-6 pb-8 overflow-y-auto scrollbar-hide">
                {/* Header / Banner */}
                <div className="mb-8">
                    <div className="w-full h-[220px] rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-200 bg-gray-100">
                        <ImageCarousel images={bannerImages} />
                    </div>
                    <h1 className="text-[26px] font-bold text-[#111827] leading-tight mb-3 tracking-tight">
                        {data.name}
                    </h1>

                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                            <Icons.Calendar color="#4B5563" />
                            <span className="text-[13px] font-medium text-gray-600">{displayDate}</span>
                        </div>
                        <a
                            href={data.locationUrl || '#'}
                            target={data.locationUrl ? "_blank" : undefined}
                            className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm ${data.locationUrl ? 'hover:border-blue-400 cursor-pointer transition-colors' : ''}`}
                        >
                            <div className="scale-75">📍</div>
                            <span className="text-[13px] font-medium text-gray-600 line-clamp-1 max-w-[150px]">{data.location || 'Location'}</span>
                        </a>
                    </div>

                    {/* Socials */}
                    {data.socials && (data.socials.instagram?.visible || data.socials.website?.visible) && (
                        <div className="flex items-center gap-4 px-4 py-2 mb-6 shadow-sm rounded-xl w-fit">
                            {data.socials.instagram?.visible && data.socials.instagram.url && (
                                <div className="flex items-center gap-2">
                                    <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                        <Icons.Instagram color="#4B5563" />
                                    </div>
                                    <span className="text-[13px] font-medium text-gray-600">{data.socials.instagram.url}</span>
                                </div>
                            )}
                            {data.socials.instagram?.visible && data.socials.instagram.url && data.socials.website?.visible && data.socials.website.url && (
                                <div className="w-[1px] h-4 bg-gray-200"></div>
                            )}
                            {data.socials.website?.visible && data.socials.website.url && (
                                <div className="flex items-center gap-2">
                                    <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                        <Icons.Browser color="#4B5563" />
                                    </div>
                                    <span className="text-[13px] font-medium text-gray-600">{data.socials.website.url}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <p ref={descClampRef} className={`text-[15px] leading-relaxed text-gray-600 ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                            {data.description || 'Join us for an unforgettable experience. Secure your tickets now.'}
                        </p>
                        <div ref={descFullRef} aria-hidden className="text-[15px] leading-relaxed text-gray-600 absolute -left-[9999px] top-0 w-[343px]">
                            {data.description || ''}
                        </div>
                        {showReadMore && (
                            <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="mt-3 text-[#111827] text-xs font-bold uppercase tracking-wide hover:underline">
                                {isDescExpanded ? 'Tutup' : 'Lihat Detail'}
                            </button>
                        )}
                    </div>

                    {/* Seating Plan - Template 5 */}
                    {data.seatingPlanUrl && (
                        <div className="mt-6">
                            <h3 className="text-[16px] font-bold text-[#111827] mb-3">Seating & Venue</h3>
                            <div className="p-2 bg-white border border-gray-200 shadow-sm rounded-xl">
                                <div className="relative overflow-hidden rounded-lg">
                                    <img src={data.seatingPlanUrl} alt="Seating Plan" className="object-cover w-full h-auto" />
                                    <div className="absolute inset-0 flex items-end justify-center pb-4 transition-opacity opacity-0 bg-gradient-to-t from-black/50 to-transparent hover:opacity-100">
                                        <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-black/50 backdrop-blur-sm">View Full Map</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ticket Packages */}
                <div>
                    <h3 className="text-[18px] font-bold text-[#111827] mb-4 flex items-center gap-2">
                        Select Ticket
                    </h3>
                    <div className="space-y-4">
                        {data.ticketCategories && data.ticketCategories.length > 0 ? (
                            data.ticketCategories.map((cat, idx) => (
                                <div key={idx} onClick={() => onScreenChange?.('bookTicket')} className="relative p-5 overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm cursor-pointer group rounded-xl hover:border-gray-400 hover:shadow-md">
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-[16px] font-bold text-[#111827]">{cat.name}</h4>
                                        </div>
                                        <p className="text-[13px] text-gray-500 mb-4 line-clamp-2">{cat.description}</p>

                                        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Price</div>
                                                <div className="text-[16px] font-bold text-[#111827]">
                                                    {cat.maxPrice && cat.maxPrice > cat.price
                                                        ? `Rp ${Number(cat.price).toLocaleString('id-ID')} - ${Number(cat.maxPrice).toLocaleString('id-ID')}`
                                                        : `Rp ${Number(cat.price).toLocaleString('id-ID')}`
                                                    }
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-[#111827] group-hover:text-white transition-colors">
                                                <Icons.ChevronRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-sm text-center text-gray-400 bg-white border border-gray-200 border-dashed rounded-xl">No packages available</div>
                        )}
                    </div>
                </div>

                {/* Terms & Conditions - Template 5 (Moved after Tickets) */}
                {data.termsAndConditions && (
                    <div className="mt-8">
                        <h3 className="text-[16px] font-bold text-[#111827] mb-3">Rules & Regulations</h3>
                        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold ml-1">Important Info</span>
                            </div>
                            <div className="p-4 text-[13px] text-gray-600 whitespace-pre-line leading-relaxed font-mono bg-white">
                                {data.termsAndConditions}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Dispatcher for Index
    const renderIndex = () => {
        if (templateId === 2) return renderIndexT2();
        if (templateId === 3) return renderIndexT3();
        if (templateId === 4) return renderIndexT4();
        if (templateId === 5) return renderIndexT5();
        return renderIndexT1();
    };


    // --- Render Functions for BookTicket (Template 1 - Standard) ---
    const renderBookTicketT1 = () => (
        <div className={`flex flex-col h-full bg-white ${fontMain} text-[#0E0E0E]`}>
            {/* Sticky Top Bar */}
            <div className="sticky top-0 bg-white z-10 border-b border-[#F0F0F0]">
                <div className="h-[44px]"></div>
                <div className="flex items-center gap-4 p-4">
                    <div className="w-6 h-6 cursor-pointer" onClick={() => onScreenChange?.('index')}><Icons.BackArrow /></div>
                    <h2 className="text-[16px] font-bold">Daftar Tiket</h2>
                </div>
            </div>

            <div className="p-6 pb-24 overflow-y-auto scrollbar-hide">
                <div className="mb-4">
                    <h2 className="text-[18px] font-bold mb-2 leading-[21.6px]">{screenTitle}</h2>
                    <p className="text-[12px] text-[#7A7A7A] leading-[16px]">{data.description}</p>
                </div>

                {/* Filter Tabs - Premium Segmented Control */}
                <div className="flex bg-[#F0F0F0] p-1 rounded-xl mb-6 mt-4">
                    <button className="flex-1 py-2 rounded-lg bg-white text-[#017A71] font-bold text-[13px] shadow-sm">Reguler</button>
                    <button className="flex-1 py-2 rounded-lg text-[#7A7A7A] text-[13px] font-medium">Promo</button>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    {data.tickets && data.tickets.length > 0 ? (
                        data.tickets.map((ticket, idx) => (
                            <div key={idx} className="relative bg-white rounded-[8px] border border-[#9B7EDC] p-0 overflow-hidden">
                                {/* Notch Effect */}
                                <div className="absolute top-[calc(100%-56px)] -left-[6px] w-[10px] h-[15px] bg-white border-r border-[#9B7EDC] rounded-r-full z-10 border-t border-b"></div>
                                <div className="absolute top-[calc(100%-56px)] -right-[6px] w-[10px] h-[15px] bg-white border-l border-[#9B7EDC] rounded-l-full z-10 border-t border-b"></div>

                                <div className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="text-[16px] font-semibold">{ticket.ticketName}</div>
                                        <div className="bg-[#C2F0EC] text-[#017A71] text-[10px] px-2 py-1 rounded-[16px] font-semibold">Buy 1 Get 1</div>
                                    </div>
                                    <div className="text-[10px] text-[#7A7A7A]">23 - 25 May 2025</div>

                                    <div className="text-[10px] text-[#7A7A7A] space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-[#7A7A7A] rounded-full"></div>
                                            <span>{ticket.category}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-[#7A7A7A] rounded-full"></div>
                                            <span>Include Tax & Service</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dashed Divider */}
                                <div className="w-full h-[1px] border-b-[2px] border-dashed border-[#DADADA] relative z-0"></div>

                                <div className="flex items-center justify-between p-4">
                                    <div>
                                        {ticket.normalPrice && ticket.normalPrice > ticket.price && (
                                            <div className="text-[10px] text-gray-400 line-through">Rp {Number(ticket.normalPrice).toLocaleString('id-ID')}</div>
                                        )}
                                        <div className="text-[16px] font-bold">Rp {Number(ticket.price).toLocaleString('id-ID')}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="w-6 h-6 rounded-full border border-[#C6C6C6] flex items-center justify-center text-[#C6C6C6]"><Icons.Minus /></button>
                                        <span className="text-[14px] font-semibold w-4 text-center">0</span>
                                        <button className="w-6 h-6 rounded-full border border-[#0E0E0E] flex items-center justify-center text-[#0E0E0E]"><Icons.Plus /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-[#C6C6C6] text-xs">
                            No tickets available
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F0] p-6 pb-8 shadow-[0_-3px_10px_0px_rgba(78,78,78,0.15)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-[14px] text-[#0E0E0E]">Total Harga</div>
                        <div className="text-[18px] font-bold text-[#FF8736]">Rp 0</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[12px] text-[#7A7A7A]">Jumlah</div>
                        <div className="text-[14px] font-semibold">0 Tiket</div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (data.vendorConfig?.purchaseMode === 'single') {
                            onScreenChange?.('visitorInput');
                        } else {
                            onScreenChange?.('visitorList');
                        }
                    }}
                    className="w-full h-[48px] rounded-[32px] font-bold text-[#A0A0A0] bg-[#F0F0F0] text-[14px] hover:bg-orange-500 hover:text-white transition-colors">
                    Lanjut
                </button>
            </div>
        </div>
    );

    // --- Render Functions for BookTicket (Template 2 - Minimalist) ---
    const renderBookTicketT2 = () => (
        <div className={`flex flex-col h-full bg-white ${fontMain} text-[#0E0E0E]`}>
            <div className="sticky top-0 z-10 bg-white">
                <div className="h-[44px]"></div>
                <div className="flex items-center gap-4 p-4">
                    <div className="w-6 h-6 cursor-pointer" onClick={() => onScreenChange?.('index')}><Icons.BackArrow /></div>
                    <h2 className="text-[16px] font-bold">Daftar Tiket</h2>
                </div>
            </div>

            <div className="p-6 pb-24 overflow-y-auto scrollbar-hide">
                <div className="mb-4">
                    <h2 className="text-[20px] font-bold mb-2 leading-tight">{screenTitle}</h2>
                    <p className="text-[12px] text-[#7A7A7A]">{data.description}</p>
                </div>

                <div className="flex bg-[#F5F5F7] p-1 rounded-xl mb-6">
                    <button className="flex-1 py-2 rounded-lg bg-white text-[#0E0E0E] font-bold text-[13px] shadow-sm">Reguler</button>
                    <button className="flex-1 py-2 rounded-lg text-[#8E8E93] text-[13px] font-medium">Promo</button>
                </div>

                <div className="space-y-4">
                    {data.tickets && data.tickets.length > 0 ? (
                        data.tickets.map((ticket, idx) => (
                            <div key={idx} className="bg-white rounded-[12px] border border-[#E0E0E0] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[108px]">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 pr-2">
                                            <div className="text-[16px] font-semibold mb-1">{ticket.ticketName}</div>
                                            <div className="text-[10px] text-[#7A7A7A]">23 - 25 May 2025</div>
                                        </div>
                                        <div className="bg-[#C2F0EC] text-[#017A71] text-[10px] px-2 py-1 rounded-[4px] font-semibold">B1G1</div>
                                    </div>

                                    <div className="text-[10px] text-[#7A7A7A] mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1 h-1 bg-[#7A7A7A] rounded-full"></div>
                                            <span>{ticket.category}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#F5F5F5]">
                                    <div>
                                        {ticket.normalPrice && ticket.normalPrice > ticket.price && (
                                            <div className="text-[10px] text-gray-400 line-through">Rp {Number(ticket.normalPrice).toLocaleString('id-ID')}</div>
                                        )}
                                        <div className="text-[16px] font-bold text-[#0E0E0E]">Rp {Number(ticket.price).toLocaleString('id-ID')}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="w-6 h-6 rounded-full border border-[#C6C6C6] flex items-center justify-center text-[#C6C6C6]"><Icons.Minus /></button>
                                        <span className="text-[14px] font-semibold w-4 text-center">0</span>
                                        <button className="w-6 h-6 rounded-full border border-[#0E0E0E] flex items-center justify-center text-[#0E0E0E]"><Icons.Plus /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-[#C6C6C6] text-xs">No tickets</div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F0] p-6 pb-8 shadow-[0_-3px_10px_0px_rgba(78,78,78,0.15)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-[12px] text-[#7A7A7A]">Total Payment</div>
                        <div className="text-[20px] font-bold text-[#0E0E0E]">Rp 0</div>
                    </div>
                    <button
                        onClick={() => {
                            if (data.vendorConfig?.purchaseMode === 'single') {
                                onScreenChange?.('visitorInput');
                            } else {
                                onScreenChange?.('visitorList');
                            }
                        }}
                        className="w-[140px] h-[48px] rounded-[32px] font-bold text-white bg-[#0E0E0E] text-[14px] hover:bg-gray-800 transition-colors">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Render Functions for BookTicket (Template 3 - Professional) ---
    const renderBookTicketT3 = () => (
        <div className={`flex flex-col h-full bg-[#F8F9FA] ${fontMain} text-[#0E0E0E]`}>
            <div className="sticky top-0 bg-white z-10 border-b border-[#EDEDED]">
                <div className="h-[44px]"></div>
                <div className="flex items-center gap-4 p-4">
                    <div className="w-6 h-6 cursor-pointer" onClick={() => onScreenChange?.('index')}><Icons.BackArrow /></div>
                    <h2 className="text-[16px] font-bold">Daftar Tiket</h2>
                </div>
            </div>

            <div className="p-6 pb-24 overflow-y-auto scrollbar-hide">
                <div className="mb-4">
                    <h2 className="text-[18px] font-bold mb-2 uppercase tracking-wide">{screenTitle}</h2>
                    <p className="text-[12px] text-[#7A7A7A]">{data.description}</p>
                </div>

                <div className="bg-[#E9ECEF] rounded-xl p-1 flex mb-6">
                    <button className="flex-1 py-2 rounded-lg bg-white text-[#0E0E0E] font-bold text-[13px] shadow-sm">Reguler</button>
                    <button className="flex-1 py-2 rounded-lg text-[#6C757D] text-[13px] font-medium">Promo</button>
                </div>

                <div className="space-y-3">
                    {data.tickets && data.tickets.length > 0 ? (
                        data.tickets.map((ticket, idx) => (
                            <div key={idx} className="bg-white rounded-[8px] border border-[#EDEDED] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 pr-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-[16px] font-semibold text-[#0E0E0E]">{ticket.ticketName}</div>
                                            <div className="bg-[#C2F0EC] text-[#017A71] text-[10px] px-1.5 py-0.5 rounded font-semibold">B1G1</div>
                                        </div>
                                        <div className="text-[10px] text-[#7A7A7A] mb-2">23 - 25 May 2025</div>
                                        <div className="text-[11px] text-[#7A7A7A]">• {ticket.category}</div>
                                    </div>

                                    <div className="flex flex-col items-end min-w-[100px]">
                                        {ticket.normalPrice && ticket.normalPrice > ticket.price && (
                                            <div className="text-[11px] text-gray-400 line-through mb-0.5">Rp {Number(ticket.normalPrice).toLocaleString('id-ID')}</div>
                                        )}
                                        <div className="text-[16px] font-bold text-[#0E0E0E] mb-3">Rp {Number(ticket.price).toLocaleString('id-ID')}</div>
                                        <div className="flex items-center gap-3">
                                            <button className="w-6 h-6 rounded-full border border-[#C6C6C6] flex items-center justify-center text-[#C6C6C6]"><Icons.Minus /></button>
                                            <span className="text-[16px] font-semibold w-4 text-center">0</span>
                                            <button className="w-6 h-6 rounded-full border border-[#0E0E0E] flex items-center justify-center text-[#0E0E0E]"><Icons.Plus /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-[#C6C6C6] text-xs">No tickets</div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#EDEDED] p-6 pb-8 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[12px] text-[#7A7A7A]">Total Payment</div>
                        <div className="text-[20px] font-bold text-[#0E0E0E]">Rp 0</div>
                    </div>
                    <button
                        onClick={() => {
                            if (data.vendorConfig?.purchaseMode === 'single') {
                                onScreenChange?.('visitorInput');
                            } else {
                                onScreenChange?.('visitorList');
                            }
                        }}
                        className="w-[140px] h-[48px] rounded-[32px] font-bold text-white bg-[#0E0E0E] text-[14px] hover:bg-gray-800 transition-colors">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Render Functions for BookTicket (Template 4 - Swiss Minimalist) ---
    const renderBookTicketT4 = () => (
        <div className={`flex flex-col h-full bg-[#FFFFFF] ${fontMain} text-[#1A1A1A]`}>
            <div className="sticky top-0 z-30">
                <div className="h-[44px]"></div>
                <div className="px-4 py-2">
                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer hover:bg-gray-100" onClick={() => onScreenChange?.('index')}>
                        <Icons.BackArrow color="#1A1A1A" />
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
                <div className="mb-8">
                    <h2 className="text-[24px] font-bold mb-2 leading-tight tracking-tight text-[#1A1A1A]">{screenTitle}</h2>
                    <p className="text-[15px] text-[#636366] leading-relaxed">{data.description}</p>
                </div>

                <div className="flex bg-[#F2F2F7] p-1 rounded-xl mb-8">
                    <button className="flex-1 py-2 rounded-lg bg-white text-[#1A1A1A] font-bold text-[13px] shadow-sm">Regular</button>
                    <button className="flex-1 py-2 rounded-lg text-[#8E8E93] text-[13px] font-medium">Promo</button>
                </div>

                <div className="space-y-4">
                    {data.tickets && data.tickets.length > 0 ? (
                        data.tickets.map((ticket, idx) => (
                            <div key={idx} className="group bg-[#F5F5F7] p-5 rounded-none border-l-4 border-transparent hover:border-[#1A1A1A] transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="font-bold text-[18px] text-[#1A1A1A] mb-1">{ticket.ticketName}</div>
                                        <div className="text-[13px] text-[#636366]">{ticket.category}</div>
                                    </div>
                                    <div className="bg-[#E5E5E5] text-[#1A1A1A] text-[11px] font-medium px-2 py-1 uppercase tracking-wide">B1G1</div>
                                </div>

                                <div className="flex justify-between items-end border-t border-[#E5E5E5] pt-4">
                                    <div>
                                        {ticket.normalPrice && ticket.normalPrice > ticket.price && (
                                            <div className="text-[13px] text-gray-400 line-through mb-1">Rp {Number(ticket.normalPrice).toLocaleString('id-ID')}</div>
                                        )}
                                        <div className="text-[20px] font-bold text-[#1A1A1A]">Rp {Number(ticket.price).toLocaleString('id-ID')}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="w-8 h-8 bg-white border border-[#D1D1D6] flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"><Icons.Minus color="#1A1A1A" /></button>
                                        <span className="text-[16px] font-medium w-6 text-center">0</span>
                                        <button className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#3A3A3C] transition-colors"><Icons.Plus color="white" /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-[#F5F5F7] text-[#8E8E93] text-sm">No tickets available</div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-[#E5E5E5] p-6">
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <div className="text-[11px] text-[#8E8E93] uppercase tracking-wide mb-1">Total</div>
                        <div className="text-[20px] font-bold text-[#1A1A1A]">Rp 0</div>
                    </div>
                    <button
                        onClick={() => {
                            if (data.vendorConfig?.purchaseMode === 'single') {
                                onScreenChange?.('visitorInput');
                            } else {
                                onScreenChange?.('visitorList');
                            }
                        }}
                        className="flex-1 h-[50px] bg-[#007AFF] text-white font-medium text-[16px] hover:bg-[#0062CC] transition-colors shadow-sm">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Render Functions for BookTicket (Template 5 - Professional Light) ---
    const renderBookTicketT5 = () => (
        <div className={`flex flex-col h-full bg-[#F9FAFB] text-[#111827] relative overflow-hidden ${fontMain}`}>
            <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-sm border-b border-gray-200">
                <div className="h-[44px]"></div>
                <div className="flex items-center gap-4 px-5 py-3">
                    <div className="flex items-center justify-center w-8 h-8 transition-colors bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:bg-gray-100" onClick={() => onScreenChange?.('index')}>
                        <Icons.BackArrow color="#111827" />
                    </div>
                    <h2 className="text-[14px] font-bold tracking-tight text-[#111827] uppercase">Select Tickets</h2>
                </div>
            </div>

            <div className="relative z-10 flex-1 p-5 overflow-y-auto scrollbar-hide">
                <div className="mb-8">
                    <h2 className="text-[24px] font-bold mb-2 text-[#111827] leading-tight tracking-tight">{screenTitle}</h2>
                    <p className="text-[14px] text-gray-500 font-normal leading-relaxed">{data.description}</p>
                </div>

                <div className="flex p-1 mb-8 bg-gray-200 rounded-xl">
                    <button className="flex-1 py-2 rounded-lg bg-white text-[#111827] font-bold text-[13px] shadow-sm">Regular</button>
                    <button className="flex-1 py-2 rounded-lg text-gray-500 text-[13px] font-medium">Promo</button>
                </div>

                <div className="space-y-4">
                    {data.tickets && data.tickets.length > 0 ? (
                        data.tickets.map((ticket, idx) => (
                            <div key={idx} className="relative p-5 transition-all duration-300 bg-white border border-gray-200 group rounded-xl hover:border-gray-400 hover:shadow-md">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-[16px] font-bold text-[#111827] mb-1">{ticket.ticketName}</div>
                                        <div className="text-[12px] text-gray-500">{ticket.category}</div>
                                    </div>
                                    {ticket.type === 'b1g1' && (
                                        <div className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-gray-200">B1G1</div>
                                    )}
                                </div>

                                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        {ticket.normalPrice && ticket.normalPrice > 0 && ticket.normalPrice > ticket.price && ticket.type !== 'normal' && (
                                            <div className="text-xs text-gray-400 line-through mb-0.5">Rp {Number(ticket.normalPrice).toLocaleString('id-ID')}</div>
                                        )}
                                        <div className="text-[20px] font-bold text-[#111827]">Rp {Number(ticket.price).toLocaleString('id-ID')}</div>
                                    </div>
                                    <div className="flex items-center gap-3 p-1 border border-gray-200 rounded-lg bg-gray-50">
                                        <button className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100"><Icons.Minus /></button>
                                        <span className="text-[15px] font-bold w-6 text-center text-[#111827]">0</span>
                                        <button className="w-8 h-8 rounded-md bg-[#111827] flex items-center justify-center shadow-md hover:bg-black text-white transition-colors"><Icons.Plus color="white" /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-sm text-center text-gray-400 bg-white border border-gray-200 border-dashed rounded-xl">No tickets available</div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 z-40 p-6 border-t border-gray-200 bg-white/95 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total Payment</div>
                        <div className="text-[20px] font-bold text-[#111827]">Rp 0</div>
                    </div>
                    <button
                        onClick={() => {
                            if (data.vendorConfig?.purchaseMode === 'single') {
                                onScreenChange?.('visitorInput');
                            } else {
                                onScreenChange?.('visitorList');
                            }
                        }}
                        className="flex-1 h-[50px] rounded-lg font-bold text-white bg-[#111827] text-[15px] hover:bg-black hover:scale-[1.01] transition-all duration-300 shadow-md">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );

    const renderBookTicket = () => {
        if (templateId === 2) return renderBookTicketT2();
        if (templateId === 3) return renderBookTicketT3();
        if (templateId === 4) return renderBookTicketT4();
        if (templateId === 5) return renderBookTicketT5();
        return renderBookTicketT1();
    };

    // --- Render Functions for VisitorList ---

    // Template 1 (Standard/Default)
    const renderVisitorListT1 = () => (
        <div className={`flex flex-col h-full bg-[#F9F9F9] ${fontMain} text-[#0E0E0E]`}>
            <div className="sticky top-0 bg-white z-10 border-b border-[#F0F0F0] shadow-sm">
                <div className="h-[44px]"></div>
                <div className="flex items-center justify-between p-4">
                    <div className="w-6 h-6 cursor-pointer" onClick={() => onScreenChange?.('bookTicket')}><Icons.BackArrow /></div>
                    <h2 className="text-[16px] font-bold">Isi Data Pemesan</h2>
                    <div className="w-6"></div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
                {/* Ticket Header Card */}
                <div className="bg-white rounded-lg border border-[#DADADA] p-4 mb-6 flex items-center gap-4 relative overflow-hidden">
                    <div className="flex-shrink-0 bg-gray-200 rounded-lg w-14 h-14">
                        {screenBanner && <img src={screenBanner} className="object-cover w-full h-full rounded-lg" />}
                    </div>
                    <div className="z-10 flex-1 min-w-0">
                        <div className="text-[12px] font-semibold mb-1">Tiket Event</div>
                        <div className="text-[10px] flex items-center gap-1 mb-1">
                            <span>💳</span>
                            <span>Non-Refundable</span>
                        </div>
                        <div className="text-[10px] text-[#7A7A7A]">john.doe@email.com</div>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-[10px] border-[#F0F0F0] opacity-50"></div>
                </div>

                {/* Visitor List Container */}
                <div>
                    <h3 className="font-bold text-[16px] mb-4">Detail Pengunjung</h3>
                    <div className="bg-white rounded-lg border border-[#DADADA] overflow-hidden">
                        <div className="p-4 bg-[#F9F9F9] border-b border-[#DADADA]">
                            <div className="font-semibold text-[14px] mb-1">General Admission</div>
                            <div className="text-[10px] text-[#7A7A7A]">23 May 2025 • 1 Tiket</div>
                        </div>

                        {/* Visitor Item */}
                        <div onClick={() => onScreenChange?.('visitorInput')} className="p-4 flex justify-between items-center border-b border-[#F0F0F0] last:border-0 cursor-pointer hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="text-[14px] font-semibold text-[#0E0E0E]">John Doe</div>
                                <div className="text-[12px] text-[#7A7A7A] mt-1">3175123456789000</div>
                            </div>
                            <div className="w-6 h-6"><Icons.ChevronRight /></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 pb-8 bg-white border-t border-[#F0F0F0] shadow-[0_-3px_10px_0px_rgba(78,78,78,0.15)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[14px]">Total Bayar</div>
                    <div className="text-[18px] font-bold">Rp 150.000</div>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="text-[12px] text-[#7A7A7A]">Jumlah</div>
                    <div className="text-[14px] font-semibold">1 Tiket</div>
                </div>
                <button
                    onClick={() => onScreenChange?.('visitorInput')}
                    className="w-full h-[48px] rounded-[32px] font-bold text-[#0E0E0E] bg-[#71DBD3] text-[14px] hover:bg-[#5EC7BF] transition-colors"
                >
                    Lanjut Pembayaran
                </button>
            </div>
        </div>
    );

    // Template 4 (Swiss Minimalist)
    const renderVisitorListT4 = () => (
        <div className={`flex flex-col h-full bg-[#FFFFFF] ${fontMain} text-[#1A1A1A]`}>
            <div className="sticky top-0 z-30">
                <div className="h-[44px]"></div>
                <div className="px-4 py-2">
                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer hover:bg-gray-100" onClick={() => onScreenChange?.('bookTicket')}>
                        <Icons.BackArrow color="#1A1A1A" />
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
                {/* Summary Header */}
                <div className="pb-6 mb-8 border-b border-black">
                    <div className="text-[12px] uppercase tracking-widest text-gray-500 mb-2">Event Ticket</div>
                    <h3 className="text-[20px] font-bold leading-tight mb-1">{screenTitle}</h3>
                    <div className="text-[14px] text-gray-600">23 May 2025 • 19:00 WIB</div>
                </div>

                {/* Visitor List */}
                <div>
                    <div className="flex items-baseline justify-between mb-6">
                        <h3 className="text-[15px] font-bold uppercase tracking-wide">Visitors</h3>
                        <span className="text-[12px] text-gray-500">1 Ticket</span>
                    </div>

                    <div className="space-y-4">
                        <div onClick={() => onScreenChange?.('visitorInput')} className="cursor-pointer group">
                            <div className="border border-[#E5E5E5] p-5 hover:border-black transition-colors duration-300">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider bg-gray-100 px-2 py-1">General Admission</span>
                                    <Icons.ChevronRight color="#1A1A1A" />
                                </div>
                                <div className="text-[16px] font-bold mb-1 group-hover:text-orange-600 transition-colors">John Doe</div>
                                <div className="text-[13px] text-gray-500 font-mono">ID: 3175123456789000</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 pb-8 border-t border-[#E5E5E5] bg-white">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Total Payment</div>
                        <div className="text-[24px] font-bold tracking-tight">Rp 150.000</div>
                    </div>
                </div>
                <button
                    onClick={() => onScreenChange?.('visitorInput')}
                    className="w-full h-[52px] bg-[#1A1A1A] text-white font-bold text-[15px] hover:bg-orange-600 transition-colors duration-300 flex items-center justify-between px-6"
                >
                    <span>Proceed to Payment</span>
                    <span>→</span>
                </button>
            </div>
        </div>
    );

    // Template 5 (Professional Light)
    const renderVisitorListT5 = () => (
        <div className={`flex flex-col h-full bg-[#F9FAFB] text-[#111827] relative overflow-hidden ${fontMain}`}>
            <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-sm border-b border-gray-200">
                <div className="h-[44px]"></div>
                <div className="flex items-center gap-4 px-5 py-3">
                    <div className="flex items-center justify-center w-8 h-8 transition-colors bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:bg-gray-100" onClick={() => onScreenChange?.('bookTicket')}>
                        <Icons.BackArrow color="#111827" />
                    </div>
                    <h2 className="text-[14px] font-bold tracking-tight text-[#111827] uppercase">Visitor Details</h2>
                </div>
            </div>

            <div className="relative z-10 flex-1 p-5 overflow-y-auto scrollbar-hide">
                {/* Event Summary Card */}
                <div className="flex items-center gap-4 p-4 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden border border-gray-200 rounded-lg bg-gray-50">
                        {screenBanner ? <img src={screenBanner} className="object-cover w-full h-full" /> : <div className="flex items-center justify-center w-full h-full text-2xl">🎟️</div>}
                    </div>
                    <div>
                        <h3 className="font-bold text-[16px] leading-tight mb-1 text-[#111827]">{screenTitle}</h3>
                        <div className="text-[13px] text-gray-500 font-medium">{data.startDate} • 19:00 WIB</div>
                    </div>
                </div>

                {/* Visitors */}
                <div>
                    <h3 className="font-bold text-[18px] mb-4 text-[#111827] flex items-center gap-2">
                        Who is attending?
                    </h3>
                    <p className="text-[14px] text-gray-500 mb-6">Please fill in the details for each visitor.</p>

                    <div className="space-y-4">
                        {[1, 2].map((item) => (
                            <div key={item} className="relative p-5 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-xl hover:border-gray-400 hover:shadow-md">
                                <div className="flex items-start justify-between pb-3 mb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#111827] text-white text-[12px] font-bold">{item}</span>
                                        <span className="text-[14px] font-bold text-[#111827]">Visitor {item}</span>
                                    </div>
                                    <button onClick={() => onScreenChange?.('visitorInput')} className="text-[12px] font-medium text-gray-500 hover:text-[#111827] hover:underline transition-colors">
                                        Edit
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Full Name</div>
                                        <div className="text-[15px] font-medium text-[#111827]">{item === 1 ? 'Syamsul Bahri' : 'Not Set'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Ticket Type</div>
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-600 text-[12px] font-medium">
                                            General Admission
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 z-40 p-6 border-t border-gray-200 bg-white/95 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total Payment</div>
                        <div className="text-[20px] font-bold text-[#111827]">Rp 150.000</div>
                    </div>
                    <button onClick={() => onScreenChange?.('visitorInput')} className="flex-1 h-[50px] rounded-lg font-bold text-white bg-[#111827] text-[15px] hover:bg-black hover:scale-[1.01] transition-all duration-300 shadow-md">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );

    const renderVisitorList = () => {
        if (templateId === 4) return renderVisitorListT4();
        if (templateId === 5) return renderVisitorListT5();
        return renderVisitorListT1();
    };

    // --- Render Functions for VisitorInput ---

    // Template 1 (Standard/Default)
    const renderVisitorInputT1 = () => (
        <div className={`flex flex-col h-full bg-white ${fontMain} text-[#0E0E0E]`}>
            <div className="sticky top-0 bg-white z-10 border-b border-[#F0F0F0]">
                <div className="h-[44px]"></div>
                <div className="flex items-center justify-between p-4">
                    <div className="w-6 h-6 cursor-pointer" onClick={() => {
                        if (data.vendorConfig?.purchaseMode === 'single') {
                            onScreenChange?.('bookTicket');
                        } else {
                            onScreenChange?.('visitorList');
                        }
                    }}><Icons.BackArrow /></div>
                    <h3 className="font-bold text-[14px]">Data Pengunjung 1</h3>
                    <div className="w-6"></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {/* Ticket Info Header */}
                <div className="px-6 py-4 flex items-center gap-3 border-b border-[#F0F0F0]">
                    <div className="w-10 h-10 bg-[#DACFF2] rounded-full flex items-center justify-center text-[20px]">
                        🎟️
                    </div>
                    <div>
                        <div className="font-bold text-[14px]">General Admission</div>
                        <div className="text-[10px] text-[#7A7A7A]">23 May 2025 • 1 Tiket</div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                    {/* Toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[#7A7A7A] text-[20px]">👥</span>
                            <span className="text-[14px]">Sama dengan Pemesan</span>
                        </div>
                        <div className="w-10 h-6 bg-[#DADADA] rounded-full relative transition-colors">
                            <div className="absolute w-4 h-4 transition-transform bg-white rounded-full left-1 top-1"></div>
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        <div className="border-b border-[#DADADA] py-2">
                            <label className="block text-[12px] text-[#7A7A7A] mb-1">Nama Lengkap</label>
                            <input type="text" className="w-full text-[14px] outline-none placeholder-[#C6C6C6]" placeholder="Masukkan nama sesuai KTP" />
                        </div>

                        <div className="border-b border-[#DADADA] py-2 flex justify-between items-center">
                            <div>
                                <label className="block text-[12px] text-[#7A7A7A] mb-1">Jenis Kelamin</label>
                                <div className="text-[14px] text-[#0E0E0E]">Pilih Jenis Kelamin</div>
                            </div>
                            <div className="w-6 h-6 rotate-90"><Icons.ChevronRight /></div>
                        </div>

                        <div className="border-b border-[#DADADA] py-2">
                            <label className="block text-[12px] text-[#7A7A7A] mb-1">Tanggal Lahir</label>
                            <input type="text" className="w-full text-[14px] outline-none placeholder-[#C6C6C6]" placeholder="DD/MM/YYYY" />
                        </div>

                        <div className="border-b border-[#DADADA] py-2 flex justify-between items-center">
                            <div>
                                <label className="block text-[12px] text-[#7A7A7A] mb-1">Kewarganegaraan</label>
                                <div className="text-[14px] text-[#0E0E0E]">Indonesia</div>
                            </div>
                            <div className="w-6 h-6 rotate-90"><Icons.ChevronRight /></div>
                        </div>

                        <div className="border-b border-[#DADADA] py-2">
                            <label className="block text-[12px] text-[#7A7A7A] mb-1">Nomor KTP (NIK)</label>
                            <input type="text" className="w-full text-[14px] outline-none placeholder-[#C6C6C6]" placeholder="Masukkan 16 digit NIK" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 pb-8 border-t border-[#F0F0F0]">
                <button
                    onClick={() => {
                        if (data.vendorConfig?.purchaseMode === 'single') {
                            onScreenChange?.('bookTicket');
                        } else {
                            onScreenChange?.('visitorList');
                        }
                    }}
                    className="w-full h-[48px] rounded-[32px] font-bold text-[#0E0E0E] bg-[#71DBD3] text-[14px] hover:bg-[#5EC7BF] transition-colors"
                >
                    Simpan Data
                </button>
            </div>
        </div>
    );

    // Template 4 (Swiss Minimalist)
    const renderVisitorInputT4 = () => (
        <div className={`flex flex-col h-full bg-[#FFFFFF] ${fontMain} text-[#1A1A1A]`}>
            <div className="sticky top-0 z-30">
                <div className="h-[44px]"></div>
                <div className="px-4 py-2">
                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer hover:bg-gray-100" onClick={() => {
                        if (data.vendorConfig?.purchaseMode === 'single') {
                            onScreenChange?.('bookTicket');
                        } else {
                            onScreenChange?.('visitorList');
                        }
                    }}>
                        <Icons.BackArrow color="#1A1A1A" />
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
                <div className="mb-8">
                    <div className="text-[11px] font-bold uppercase tracking-wider bg-black text-white px-2 py-1 inline-block mb-2">Ticket 1</div>
                    <h3 className="text-[20px] font-bold leading-tight">General Admission</h3>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
                        <span className="text-[14px] font-medium">Same as Buyer</span>
                        <div className="relative w-12 h-6 bg-gray-200 rounded-full cursor-pointer">
                            <div className="absolute w-4 h-4 transition-transform bg-white rounded-full shadow-sm left-1 top-1"></div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                            <input type="text" className="w-full text-[16px] font-bold border-b-2 border-[#E5E5E5] focus:border-black py-2 outline-none transition-colors rounded-none bg-transparent placeholder-gray-300" placeholder="AS ON ID CARD" />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Gender</label>
                            <div className="w-full text-[16px] font-medium border-b-2 border-[#E5E5E5] py-2 flex justify-between items-center cursor-pointer hover:border-gray-400 transition-colors">
                                <span>Select Gender</span>
                                <Icons.ChevronRight color="#1A1A1A" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Date of Birth</label>
                            <input type="text" className="w-full text-[16px] font-medium border-b-2 border-[#E5E5E5] focus:border-black py-2 outline-none transition-colors rounded-none bg-transparent placeholder-gray-300" placeholder="DD / MM / YYYY" />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Nationality</label>
                            <div className="w-full text-[16px] font-medium border-b-2 border-[#E5E5E5] py-2 flex justify-between items-center cursor-pointer hover:border-gray-400 transition-colors">
                                <span>Indonesia</span>
                                <Icons.ChevronRight color="#1A1A1A" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">ID Number (NIK)</label>
                            <input type="text" className="w-full text-[16px] font-medium border-b-2 border-[#E5E5E5] focus:border-black py-2 outline-none transition-colors rounded-none bg-transparent placeholder-gray-300" placeholder="16 DIGIT NUMBER" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 pb-8 border-t border-[#E5E5E5] bg-white">
                <button
                    onClick={() => {
                        if (data.vendorConfig?.purchaseMode === 'single') {
                            onScreenChange?.('bookTicket');
                        } else {
                            onScreenChange?.('visitorList');
                        }
                    }}
                    className="w-full h-[52px] bg-[#1A1A1A] text-white font-bold text-[15px] hover:bg-orange-600 transition-colors duration-300"
                >
                    Save Details
                </button>
            </div>
        </div>
    );

    // Template 5 (Professional Light)
    const renderVisitorInputT5 = () => (
        <div className={`flex flex-col h-full bg-[#F9FAFB] text-[#111827] relative overflow-hidden ${fontMain}`}>
            <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-sm border-b border-gray-200">
                <div className="h-[44px]"></div>
                <div className="flex items-center gap-4 px-5 py-3">
                    <div className="flex items-center justify-center w-8 h-8 transition-colors bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:bg-gray-100" onClick={() => {
                        if (data.vendorConfig?.purchaseMode === 'single') {
                            onScreenChange?.('bookTicket');
                        } else {
                            onScreenChange?.('visitorList');
                        }
                    }}>
                        <Icons.BackArrow color="#111827" />
                    </div>
                    <h2 className="text-[14px] font-bold tracking-tight text-[#111827] uppercase">Edit Visitor</h2>
                </div>
            </div>

            <div className="relative z-10 flex-1 p-5 overflow-y-auto scrollbar-hide">
                <div className="flex items-center gap-4 p-4 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex items-center justify-center w-12 h-12 text-xl border border-gray-200 rounded-lg bg-gray-50">
                        🎟️
                    </div>
                    <div>
                        <div className="font-bold text-[16px] text-[#111827]">General Admission</div>
                        <div className="text-[12px] text-gray-500">Ticket #1</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className="text-[14px] font-medium text-[#111827]">Same as Buyer</span>
                        </div>
                        <div className="relative w-12 h-6 transition-colors bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
                            <div className="absolute w-4 h-4 transition-transform bg-white rounded-full shadow-sm left-1 top-1"></div>
                        </div>
                    </div>

                    <div className="p-6 space-y-5 bg-white border border-gray-200 shadow-sm rounded-xl">
                        <div className="group">
                            <label className="block text-[12px] font-bold text-[#111827] mb-2 ml-1 uppercase tracking-wide">Full Name</label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#111827] outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all placeholder-gray-400" placeholder="As on ID Card" />
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-[#111827] mb-2 ml-1 uppercase tracking-wide">Gender</label>
                            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#111827] flex justify-between items-center cursor-pointer hover:bg-white hover:border-gray-400 transition-all">
                                <span className="text-gray-500">Select Gender</span>
                                <Icons.ChevronRight />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-[#111827] mb-2 ml-1 uppercase tracking-wide">Date of Birth</label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#111827] outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all placeholder-gray-400" placeholder="DD / MM / YYYY" />
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-[#111827] mb-2 ml-1 uppercase tracking-wide">Nationality</label>
                            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#111827] flex justify-between items-center cursor-pointer hover:bg-white hover:border-gray-400 transition-all">
                                <span className="text-[#111827]">Indonesia</span>
                                <Icons.ChevronRight />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-[#111827] mb-2 ml-1 uppercase tracking-wide">ID Number (NIK)</label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#111827] outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all placeholder-gray-400" placeholder="16 Digit Number" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 z-40 p-6 border-t border-gray-200 bg-white/95 backdrop-blur-xl">
                <button
                    onClick={() => {
                        if (data.vendorConfig?.purchaseMode === 'single') {
                            onScreenChange?.('bookTicket');
                        } else {
                            onScreenChange?.('visitorList');
                        }
                    }}
                    className="w-full h-[50px] rounded-lg font-bold text-white bg-[#111827] text-[15px] hover:bg-black hover:scale-[1.01] transition-all duration-300 shadow-md"
                >
                    Save Details
                </button>
            </div>
        </div>
    );

    const renderVisitorInput = () => {
        if (templateId === 4) return renderVisitorInputT4();
        if (templateId === 5) return renderVisitorInputT5();
        return renderVisitorInputT1();
    };

    return (
        <div className="w-[375px] h-[calc(100vh-2rem)] bg-white border-8 border-gray-800 rounded-[3rem] overflow-hidden shadow-xl relative mx-auto sticky top-4">
            {/* Notch */}
            <div className="absolute top-0 z-20 w-32 h-6 transform -translate-x-1/2 bg-gray-800 left-1/2 rounded-b-xl"></div>

            <StatusBar />
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

            {/* Screen Content */}
            <div className="relative z-0 flex flex-col h-full overflow-y-auto bg-white scrollbar-hide">
                {activeScreen === 'index' && renderIndex()}
                {activeScreen === 'bookTicket' && renderBookTicket()}
                {activeScreen === 'visitorList' && renderVisitorList()}
                {activeScreen === 'visitorInput' && renderVisitorInput()}
            </div>
        </div>
    );
}
