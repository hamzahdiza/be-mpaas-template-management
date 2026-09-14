export interface SduiHeaderConfig {
  showBackButton?: boolean;
  titleKey?: string;
  fallbackTitle?: string;
  background?: string;
  color?: string;
  height?: string;
}

export interface SduiExpandConfig {
  collapsedLines?: number;
  expandLabel?: string;
  collapseLabel?: string;
  'justify-content'?: string;
  color?: string;
}

export interface SduiTicketConfig {
  index?: number;
  cardConfig?: {
    background?: string;
    border?: string;
    'border-radius'?: string;
    padding?: string;
  };
  title?: {
    key?: string;
    class?: string;
    color?: string;
    'font-size'?: string;
  };
  description?: {
    key?: string;
    class?: string;
    color?: string;
  };
  dividerConfig?: {
    background?: string;
    margin?: string;
    borderStyle?: string;
  };
  priceLabel?: {
    value?: string;
    class?: string;
    color?: string;
  };
  price?: {
    key?: string;
    class?: string;
    color?: string;
  };
  icon?: {
    name?: string;
    color?: string;
    'font-size'?: string;
  };
}

export interface SduiField {
  key: string;
  type?: 'banner' | 'title-card' | 'location-card' | 'date-card' | 'divider' | 'termsConditions' | 'ticket-card' | 'description' | 'hero-card' | 'header-banner';
  label?: string;
  labelConfig?: Record<string, any>;
  background?: string;
  color?: string;
  'border-radius'?: string;
  border?: string;
  height?: string;
  margin?: string;
  'margin-top'?: string;
  'margin-bottom'?: string;
  padding?: string;
  'padding-left'?: string;
  'padding-right'?: string;
  'font-size'?: string;
  'font-weight'?: string;
  icons?: string;
  iconColor?: string;
  float?: string;
  expand?: boolean;
  expandConfig?: SduiExpandConfig;
  ticketConfig?: SduiTicketConfig;
  badge?: {
    textKey?: string;
    fallbackText?: string;
    background?: string;
    color?: string;
  };
  customStyles?: Record<string, string>;
}

export interface SduiSection {
  headerConfig?: SduiHeaderConfig;
  fields: SduiField[];
  footer?: Record<string, any>;
}

export interface SduiCtaConfig {
  label: string;
  background: string;
  color: string;
  'border-radius': string;
  height: string;
  shadow?: string;
}

export interface SduiTemplateSchema {
  schemaVersion: string;
  templateId: string;
  templateName: string;
  category: string;
  pageBackground?: string;
  headerSection: SduiSection;
  contentSection: SduiSection;
  ctaConfig: SduiCtaConfig;
  ticketDetailSection?: SduiSection;
}

// ======================================================================
// 1. TEMPLATE 1: Clean Card Theme (Light Gray & Teal CTA)
// ======================================================================
export const template1Schema: SduiTemplateSchema = {
  schemaVersion: "1.0",
  templateId: "template-1",
  templateName: "Clean Card Theme",
  category: "events",
  pageBackground: "#F5F5F5",

  headerSection: {
    headerConfig: {
      showBackButton: true,
      titleKey: "name",
      fallbackTitle: "Running Event Detail",
      background: "#ffffff",
      color: "#0E0E0E",
    },
    fields: [
      {
        key: "bannerUrl",
        type: "banner",
        background: "#fafafa",
        "border-radius": "16px",
        height: "210px",
        margin: "16px 20px 0 20px"
      }
    ]
  },

  contentSection: {
    fields: [
      {
        key: "name",
        type: "title-card",
        "font-weight": "700",
        "font-size": "18px",
        color: "#0E0E0E",
        background: "#ffffff",
        "border-radius": "16px",
        padding: "18px 20px",
        margin: "14px 20px 0 20px"
      },
      {
        key: "location",
        type: "location-card",
        icons: "location_on",
        iconColor: "#9B7EDC",
        background: "#ffffff",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "12px 20px 0 20px"
      },
      {
        key: "eventDate",
        type: "date-card",
        icons: "calendar_today",
        iconColor: "#9B7EDC",
        background: "#ffffff",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "12px 20px 0 20px"
      },
      {
        key: "description",
        type: "description",
        label: "Description",
        color: "#4E4E4E",
        background: "#ffffff",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "14px 20px 0 20px",
        expand: true,
        expandConfig: {
          collapsedLines: 4,
          expandLabel: "Lihat Detail",
          collapseLabel: "Tutup",
          "justify-content": "center",
          color: "#FF8736"
        }
      },
      {
        key: "divider-1",
        type: "divider",
        height: "1px",
        background: "#E5E7EB",
        margin: "14px 20px"
      },
      {
        key: "termsConditions",
        type: "termsConditions",
        label: "Terms & Conditions",
        background: "#ffffff",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 20px 16px 20px",
        color: "#4E4E4E",
        labelConfig: {
          class: "text-[16px] font-bold text-[#0E0E0E]",
          "margin-bottom": "10px"
        }
      },
      {
        key: "ticketCategories",
        type: "ticket-card",
        label: "Pilihan Tiket",
        labelConfig: {
          class: "text-[16px] font-bold text-[#0E0E0E]",
          padding: "10px 20px 0 20px",
          "margin-bottom": "8px"
        },
        "padding-left": "20px",
        "padding-right": "20px",
        ticketConfig: {
          index: 0,
          cardConfig: {
            background: "#ffffff",
            border: "1px solid #ECECEC",
            "border-radius": "16px",
            padding: "16px 20px"
          },
          title: {
            key: "name",
            class: "text-[15px] font-bold",
            color: "#0E0E0E",
            "font-size": "15px"
          },
          description: {
            key: "description",
            class: "text-[13px]",
            color: "#64748b"
          },
          dividerConfig: {
            background: "#eeeeee",
            margin: "12px 0"
          },
          priceLabel: {
            value: "Mulai dari",
            class: "text-[12px] font-medium",
            color: "#FF8736"
          },
          price: {
            key: "price",
            class: "text-[15px] font-bold",
            color: "#0E0E0E"
          },
          icon: {
            name: "chevron_right",
            color: "#111111",
            "font-size": "20px"
          }
        }
      }
    ]
  },

  ctaConfig: {
    label: "Beli Tiket",
    background: "#75D7D0",
    color: "#0E0E0E",
    "border-radius": "9999px",
    height: "56px"
  },

  ticketDetailSection: {
    headerConfig: {
      title: "Daftar Tiket",
      showBackButton: true
    },
    fields: [],
    footer: {
      label: { value: "Total Harga" },
      value: { value: 0, format: "currency" },
      button: { label: "Lanjut", action: "continue", disabled: true }
    }
  }
};

// ======================================================================
// 2. TEMPLATE 2: Navy Blue Overlapping Header Theme
// ======================================================================
export const template2Schema: SduiTemplateSchema = {
  schemaVersion: "1.0",
  templateId: "template-2",
  templateName: "Navy Blue Overlapping Header Theme",
  category: "events",
  pageBackground: "#F5F5F5",

  headerSection: {
    headerConfig: {
      showBackButton: true,
      titleKey: "name",
      fallbackTitle: "Preview",
      background: "#ffffff",
      color: "#0E0E0E"
    },
    fields: [
      {
        key: "bannerUrl",
        type: "banner",
        background: "#000000",
        "border-radius": "0px",
        height: "230px",
        margin: "0"
      }
    ]
  },

  contentSection: {
    fields: [
      {
        key: "headerBanner",
        type: "header-banner",
        background: "#0E3453",
        color: "#ffffff",
        padding: "18px 20px",
        margin: "-32px 16px 0 16px",
        "border-radius": "16px 16px 0 0",
        "font-size": "18px",
        "font-weight": "700"
      },
      {
        key: "location",
        type: "location-card",
        icons: "location_on",
        iconColor: "#9B7EDC",
        background: "#ffffff",
        "border-radius": "0 0 16px 16px",
        padding: "16px 20px",
        margin: "0 16px 14px 16px"
      },
      {
        key: "eventDate",
        type: "date-card",
        icons: "calendar_today",
        iconColor: "#9B7EDC",
        background: "#ffffff",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 16px 14px 16px"
      },
      {
        key: "description",
        type: "description",
        label: "Description",
        color: "#4E4E4E",
        background: "#ffffff",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 16px 14px 16px",
        expand: true,
        expandConfig: {
          collapsedLines: 4,
          expandLabel: "Lihat Detail",
          collapseLabel: "Tutup",
          "justify-content": "center",
          color: "#0E3453"
        }
      },
      {
        key: "termsConditions",
        type: "termsConditions",
        label: "Terms & Conditions",
        background: "#ffffff",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 16px 16px 16px",
        color: "#4E4E4E"
      },
      {
        key: "ticketCategories",
        type: "ticket-card",
        label: "Pilih Tiket",
        labelConfig: {
          class: "text-[16px] font-bold text-[#0E0E0E]",
          padding: "0 16px",
          "margin-bottom": "8px"
        },
        "padding-left": "16px",
        "padding-right": "16px",
        ticketConfig: {
          index: 0,
          cardConfig: {
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            "border-radius": "14px",
            padding: "16px"
          },
          title: {
            key: "name",
            class: "text-[15px] font-bold",
            color: "#0E3453"
          },
          priceLabel: {
            value: "Mulai dari",
            color: "#FF8736"
          },
          price: {
            key: "price",
            color: "#0E0E0E"
          }
        }
      }
    ]
  },

  ctaConfig: {
    label: "Beli Tiket",
    background: "#FF8736",
    color: "#FFFFFF",
    "border-radius": "9999px",
    height: "56px"
  },

  ticketDetailSection: {
    headerConfig: {
      title: "Daftar Tiket",
      showBackButton: true
    },
    fields: [],
    footer: {
      label: { value: "Total Harga" },
      value: { value: 0, format: "currency" },
      button: { label: "Lanjut", action: "continue", disabled: true }
    }
  }
};

// ======================================================================
// 3. TEMPLATE 3: Dark Slate Hero Theme (Badge & Highlight Mulai Dari)
// ======================================================================
export const template3Schema: SduiTemplateSchema = {
  schemaVersion: "1.0",
  templateId: "template-3",
  templateName: "Dark Slate Hero Theme",
  category: "events",
  pageBackground: "#F8FAFC",

  headerSection: {
    headerConfig: {
      showBackButton: true,
      titleKey: "name",
      fallbackTitle: "Event Details",
      background: "#ffffff",
      color: "#0F172A"
    },
    fields: [
      {
        key: "bannerUrl",
        type: "banner",
        background: "#0F172A",
        "border-radius": "0px",
        height: "250px",
        margin: "0",
        badge: {
          textKey: "category",
          fallbackText: "RUNNING EVENT",
          background: "#F97316",
          color: "#FFFFFF"
        }
      }
    ]
  },

  contentSection: {
    fields: [
      {
        key: "heroCard",
        type: "hero-card",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "20px",
        padding: "20px",
        margin: "-60px 16px 16px 16px",
        customStyles: {
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
        },
        ticketConfig: {
          priceLabel: {
            value: "MULAI DARI",
            class: "text-[11px] font-black uppercase text-slate-400",
            color: "#94A3B8"
          },
          price: {
            key: "price",
            class: "text-[20px] font-black text-orange-600",
            color: "#EA580C"
          }
        }
      },
      {
        key: "location",
        type: "location-card",
        icons: "location_on",
        iconColor: "#EA580C",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 16px 14px 16px"
      },
      {
        key: "eventDate",
        type: "date-card",
        icons: "calendar_today",
        iconColor: "#EA580C",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 16px 14px 16px"
      },
      {
        key: "description",
        type: "description",
        label: "About This Event",
        color: "#334155",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 16px 14px 16px",
        expand: true,
        expandConfig: {
          collapsedLines: 4,
          expandLabel: "Lihat Selengkapnya",
          collapseLabel: "Tutup",
          color: "#EA580C"
        }
      },
      {
        key: "termsConditions",
        type: "termsConditions",
        label: "Syarat & Ketentuan",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 16px 16px 16px",
        color: "#334155"
      },
      {
        key: "ticketCategories",
        type: "ticket-card",
        label: "Pilihan Kategori Tiket",
        labelConfig: {
          class: "text-[16px] font-bold text-slate-900",
          padding: "0 16px",
          "margin-bottom": "8px"
        },
        "padding-left": "16px",
        "padding-right": "16px",
        ticketConfig: {
          index: 0,
          cardConfig: {
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            "border-radius": "16px",
            padding: "18px"
          },
          title: {
            key: "name",
            class: "text-[16px] font-bold",
            color: "#0F172A"
          },
          priceLabel: {
            value: "Mulai dari",
            color: "#EA580C"
          },
          price: {
            key: "price",
            color: "#0F172A"
          }
        }
      }
    ]
  },

  ctaConfig: {
    label: "Beli Tiket Sekarang",
    background: "#0F172A",
    color: "#FFFFFF",
    "border-radius": "9999px",
    height: "56px"
  },

  ticketDetailSection: {
    headerConfig: {
      title: "Pilih Tiket",
      showBackButton: true
    },
    fields: [],
    footer: {
      label: { value: "Total Bayar" },
      value: { value: 0, format: "currency" },
      button: { label: "Checkout", action: "continue", disabled: true }
    }
  }
};

// ======================================================================
// 4. TEMPLATE 4: Crimson Maroon Theme
// ======================================================================
export const template4Schema: SduiTemplateSchema = {
  schemaVersion: "1.0",
  templateId: "template-4",
  templateName: "Crimson Maroon Theme",
  category: "events",
  pageBackground: "#FFFFFF",

  headerSection: {
    headerConfig: {
      showBackButton: true,
      titleKey: "name",
      fallbackTitle: "Event Info",
      background: "#ffffff",
      color: "#0E0E0E"
    },
    fields: [
      {
        key: "crimsonHeader",
        type: "header-banner",
        background: "linear-gradient(135deg, #9C0621 0%, #7A0419 100%)",
        color: "#ffffff",
        padding: "20px 20px 65px 20px",
        margin: "0",
        "font-size": "18px",
        "font-weight": "700"
      },
      {
        key: "bannerUrl",
        type: "banner",
        background: "#F5F5F5",
        "border-radius": "16px",
        height: "200px",
        margin: "-48px 20px 16px 20px",
        customStyles: {
          boxShadow: "0 12px 28px rgba(156, 6, 33, 0.18)"
        }
      }
    ]
  },

  contentSection: {
    fields: [
      {
        key: "location",
        type: "location-card",
        label: "Informasi Lokasi",
        icons: "location_on",
        iconColor: "#9C0621",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 20px 14px 20px"
      },
      {
        key: "eventDate",
        type: "date-card",
        label: "Jadwal Acara",
        icons: "calendar_today",
        iconColor: "#9C0621",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 20px 14px 20px"
      },
      {
        key: "description",
        type: "description",
        label: "Deskripsi Acara",
        color: "#334155",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 20px 14px 20px",
        expand: true,
        expandConfig: {
          collapsedLines: 4,
          expandLabel: "Lihat Detail",
          collapseLabel: "Tutup",
          color: "#9C0621"
        }
      },
      {
        key: "termsConditions",
        type: "termsConditions",
        label: "Ketentuan Acara",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        "border-radius": "16px",
        padding: "16px 20px",
        margin: "0 20px 16px 20px",
        color: "#334155"
      },
      {
        key: "ticketCategories",
        type: "ticket-card",
        label: "Pilihan Tiket",
        labelConfig: {
          class: "text-[16px] font-bold text-[#9C0621]",
          padding: "0 20px",
          "margin-bottom": "8px"
        },
        "padding-left": "20px",
        "padding-right": "20px",
        ticketConfig: {
          index: 0,
          cardConfig: {
            background: "#ffffff",
            border: "1px solid #fee2e2",
            "border-radius": "16px",
            padding: "18px"
          },
          title: {
            key: "name",
            class: "text-[16px] font-bold",
            color: "#9C0621"
          },
          priceLabel: {
            value: "Mulai dari",
            color: "#9C0621"
          },
          price: {
            key: "price",
            color: "#111827"
          }
        }
      }
    ]
  },

  ctaConfig: {
    label: "Beli Tiket",
    background: "#9C0621",
    color: "#FFFFFF",
    "border-radius": "9999px",
    height: "56px"
  },

  ticketDetailSection: {
    headerConfig: {
      title: "Daftar Tiket",
      showBackButton: true
    },
    fields: [],
    footer: {
      label: { value: "Total Harga" },
      value: { value: 0, format: "currency" },
      button: { label: "Lanjut", action: "continue", disabled: true }
    }
  }
};

export const eventTemplatesMap: Record<string, SduiTemplateSchema> = {
  'template-1': template1Schema,
  'template-2': template2Schema,
  'template-3': template3Schema,
  'template-4': template4Schema,
  '1': template1Schema,
  '2': template2Schema,
  '3': template3Schema,
  '4': template4Schema,
};

export const allEventTemplates = [
  template1Schema,
  template2Schema,
  template3Schema,
  template4Schema,
];
