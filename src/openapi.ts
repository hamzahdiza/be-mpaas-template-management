const idParam = { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } };

const statusPayload = {
  type: "object",
  required: ["status"],
  properties: {
    status: {
      type: "string",
      enum: ["approved", "rejected", "requested"],
      description: "approved/rejected = admin only. requested = vendor resubmit (only when current status is 'rejected')",
    },
    message: {
      type: "string",
      description: "Required when status=rejected. Optional for approved or resubmit.",
      example: "Please update your banner image.",
    },
  },
};

const activePayload = {
  type: "object",
  required: ["isActive"],
  properties: {
    isActive: {
      type: "integer",
      enum: [0, 1],
      description: "1 = visible on public frontend. 0 = hidden. Cannot set to 1 unless approvalStatus='approved'.",
      example: 1,
    },
  },
};

function statusEndpoint(tag: string) {
  return {
    patch: {
      tags: [tag],
      summary: "Change approval status",
      description: [
        "State machine transitions:",
        "- `requested → approved` — **admin only**, message optional",
        "- `requested → rejected` — **admin only**, message **required**",
        "- `rejected → requested` — **vendor only** (resubmit after fixing, only for inactive listings)",
        "",
        "### Live Listing Edit (pendingData flow)",
        "When a vendor edits a **live** listing (`isActive=1`), the edit is stored in `pendingData`.",
        "The listing stays live during review. Admin then approves or rejects the pending edit:",
        "",
        "**Admin approves pending edit** (`status: 'approved'` when `isActive=1 && pendingData != null`)",
        "- `pendingData` is merged into main columns",
        "- `pendingData` cleared, `approvalStatus=approved`, `isActive` stays 1",
        "- Public immediately sees the new data",
        "",
        "**Admin rejects pending edit** (`status: 'rejected'` when `isActive=1 && pendingData != null`)",
        "- `pendingData` is discarded",
        "- `approvalStatus` restored to `approved`, `isActive` stays 1",
        "- Listing stays live with **original data unchanged**",
        "- Rejection reason added to `comments[]`",
        "",
        "### New / Inactive Listing",
        "When vendor resubmits an inactive rejected listing: `rejected → requested`, `isActive` set to 0.",
      ].join("\n"),
      parameters: [idParam],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/StatusPayload" },
            examples: {
              approve: { summary: "Admin approves (new listing or live edit)", value: { status: "approved" } },
              approveWithComment: { summary: "Admin approves with note", value: { status: "approved", message: "Looks good!" } },
              rejectNew: { summary: "Admin rejects new listing (message required)", value: { status: "rejected", message: "Please update banner to at least 1200×600px." } },
              rejectLiveEdit: { summary: "Admin rejects live listing edit", value: { status: "rejected", message: "Price increase too high, please keep under Rp 320.000" } },
              resubmit: { summary: "Vendor resubmits after rejection (inactive only)", value: { status: "requested", message: "Fixed all images." } },
            },
          },
        },
      },
      responses: {
        "200": { description: "Status updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } },
        "400": {
          description: "Invalid transition or missing message",
          content: {
            "application/json": {
              examples: {
                alreadyApproved: { value: { error: "Only requested items can be approved" } },
                missingMessage: { value: { error: "Message required when rejecting" } },
                notRejected: { value: { error: "Only rejected items can be resubmitted" } },
              },
            },
          },
        },
        "403": {
          description: "Wrong role for this transition",
          content: {
            "application/json": {
              examples: {
                vendorApprove: { value: { error: "Forbidden" } },
                adminResubmit: { value: { error: "Only vendors can resubmit" } },
              },
            },
          },
        },
        "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
  };
}

function activeEndpoint(tag: string, entityName: string) {
  return {
    patch: {
      tags: [tag],
      summary: `Toggle ${entityName} public visibility (admin only)`,
      description: [
        "**Admin only.** Controls whether this listing appears on the public lifestyle frontend.",
        "",
        "- `isActive: 1` → listing goes live. **Requires `approvalStatus='approved'`** — returns 400 otherwise.",
        "- `isActive: 0` → listing hidden from public, regardless of approval status.",
        "",
        "This is a separate step from approval. Approved listings stay hidden until admin explicitly activates them (useful for scheduling a launch date).",
      ].join("\n"),
      parameters: [idParam],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ActivePayload" },
            examples: {
              activate: { summary: "Make listing live", value: { isActive: 1 } },
              deactivate: { summary: "Hide listing", value: { isActive: 0 } },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Visibility updated",
          content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, isActive: { type: "integer" } } }, example: { success: true, isActive: 1 } } },
        },
        "400": { description: "Cannot activate — approvalStatus is not 'approved'", content: { "application/json": { example: { error: "Cannot activate unapproved listing" } } } },
        "403": { description: "Non-admin", content: { "application/json": { example: { error: "Forbidden" } } } },
        "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
  };
}

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Template Backend API",
    version: "1.0.0",
    description: [
      "## Overview",
      "Partner dashboard + lifestyle public API built with Hono.js + Drizzle ORM (Turso/SQLite).",
      "",
      "---",
      "",
      "## Authentication",
      "All `/api/*` routes require `Authorization: Bearer <token>`, **except** `/api/auth/register` and `/api/auth/login`.",
      "Lifestyle (`/lifestyle/*`) routes are fully public — no auth needed.",
      "",
      "---",
      "",
      "## Roles & Permissions",
      "| Role | What they can do |",
      "|---|---|",
      "| `admin` | See all listings, approve/reject, toggle isActive, manage users |",
      "| `vendor` | CRUD their own listings, resubmit after rejection |",
      "",
      "Vendors also have a `roleType` array controlling which listing types they can create.",
      "Example: `roleType: [\"hotel\", \"event\"]` means this vendor can only create hotels and events.",
      "Admin must assign roleType via `PATCH /api/auth/users/:id/role-type`.",
      "",
      "---",
      "",
      "## Full App Flow",
      "",
      "### 1. Vendor Onboarding",
      "```",
      "POST /api/auth/register        → vendor account created, roleType=[]",
      "PATCH /api/auth/users/:id/role-type  → admin grants permissions e.g. [\"hotel\",\"event\"]",
      "POST /api/auth/login           → get JWT token",
      "```",
      "",
      "### 2. Vendor Creates a Listing",
      "```",
      "POST /api/hotels               → approvalStatus=requested, isActive=0",
      "                                 listing is NOT visible publicly",
      "                                 admin gets notified (out of band)",
      "```",
      "",
      "### 3. Admin Reviews",
      "```",
      "GET  /api/hotels?status=requested   → admin sees all pending listings",
      "PATCH /api/hotels/:id/status        → { status: \"approved\" }",
      "                                       approvalStatus=approved, isActive still 0",
      "                                       listing is approved but still NOT live",
      "```",
      "",
      "### 4. Admin Activates (Go Live)",
      "```",
      "PATCH /api/hotels/:id/active        → { isActive: 1 }",
      "                                       listing is now live on public frontend",
      "                                       requires approvalStatus=approved first",
      "```",
      "",
      "### 5. Vendor Edits an Active Listing (pendingData flow)",
      "```",
      "PUT /api/hotels/:id",
      "  IF listing is inactive (isActive=0):",
      "    → approvalStatus=requested, isActive=0",
      "    → listing was already offline, normal approval flow",
      "  IF listing is live (isActive=1):",
      "    → edit stored in pendingData column only",
      "    → listing STAYS LIVE, public sees old data",
      "    → approvalStatus=requested for admin review",
      "    → isActive in PUT body is ignored — use PATCH /:id/active",
      "```",
      "",
      "### 5b. GET /:id response when pendingData exists",
      "```",
      "Vendor sees:  pending edit merged over the record (their submitted changes)",
      "Admin sees:   same + liveSnapshot (what public currently sees)",
      "Public:       lifestyle routes always read main columns (never pendingData)",
      "```",
      "",
      "### 6. Admin Rejects",
      "```",
      "PATCH /api/hotels/:id/status   → { status: \"rejected\", message: \"Fix your images\" }",
      "                                 message is required on rejection",
      "                                 message is stored in comments[] for audit trail",
      "```",
      "",
      "### 7. Vendor Resubmits After Fix",
      "```",
      "PATCH /api/hotels/:id/status   → { status: \"requested\", message: \"Fixed all images\" }",
      "                                 only allowed when current status is rejected",
      "                                 isActive set back to 0 automatically",
      "```",
      "",
      "### 8. Customer Places an Order",
      "```",
      "GET  /lifestyle/v1/all-hotels  → public, no auth, only approved+active listings",
      "POST /api/orders               → no auth required",
      "                                 { orderType, serviceId, customerName, totalAmount }",
      "GET  /api/orders?customerPhone=08xxx → customer tracks their order",
      "```",
      "",
      "### 9. Vendor Manages Orders",
      "```",
      "GET  /api/orders               → vendor sees their own orders",
      "PATCH /api/orders/:id/status   → { status: \"accepted\" } or \"rejected\" etc.",
      "POST /api/orders/:id/checkout  → mark as completed, generates invoiceNumber",
      "```",
      "",
      "---",
      "",
      "## isActive Rules",
      "- `isActive` can **only** be changed via `PATCH /:id/active` (admin only)",
      "- `isActive` field in `PUT` body is **ignored** — sending it has no effect",
      "- Cannot set `isActive=1` unless `approvalStatus='approved'`",
      "- Setting `isActive=0` is always allowed (take a listing offline anytime)",
      "",
      "---",
      "",
      "## Public Visibility Rule",
      "A listing appears on lifestyle routes only when **both conditions are true**:",
      "- `approvalStatus = 'approved'`",
      "- `isActive = 1`",
    ].join("\n"),
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      ApprovalStatus: {
        type: "string",
        enum: ["requested", "approved", "rejected"],
      },
      StatusPayload: statusPayload,
      ActivePayload: activePayload,
      Comment: {
        type: "object",
        description: "Audit trail entry appended on every status change that includes a message",
        properties: {
          id: { type: "string" },
          senderName: { type: "string" },
          senderRole: { type: "string", enum: ["admin", "vendor"] },
          message: { type: "string" },
          statusSnapshot: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      MenuItem: {
        type: "object",
        required: ["name", "price"],
        properties: {
          id: { type: "string", description: "Auto-generated if omitted" },
          name: { type: "string", example: "Nasi Goreng Special" },
          description: { type: "string" },
          price: { type: "number", minimum: 0, example: 35000 },
          imageUrl: { type: "string" },
          isAvailable: { type: "boolean", default: true },
        },
      },
      Product: {
        type: "object",
        required: ["name", "price"],
        properties: {
          id: { type: "string", description: "Auto-generated if omitted" },
          name: { type: "string", example: "Batik Tulis" },
          description: { type: "string" },
          price: { type: "number", minimum: 0, example: 150000 },
          imageUrl: { type: "string" },
          isAvailable: { type: "boolean", default: true },
          stock: { type: "number", default: 100 },
        },
      },
      Vehicle: {
        type: "object",
        required: ["name", "type", "transmission", "capacity", "pricePerDay"],
        properties: {
          id: { type: "string", description: "Auto-generated if omitted" },
          name: { type: "string", example: "Toyota Avanza 2023" },
          type: { type: "string", example: "MPV" },
          transmission: { type: "string", enum: ["manual", "automatic"] },
          capacity: { type: "number", minimum: 1, example: 7 },
          pricePerDay: { type: "number", minimum: 0, example: 350000 },
          imageUrl: { type: "string" },
          isAvailable: { type: "boolean", default: true },
        },
      },
      HotelCategory: {
        type: "object",
        required: ["name", "pricePerNight", "images"],
        properties: {
          id: { type: "string" },
          name: { type: "string", example: "Deluxe Room" },
          roomType: { type: "string", example: "double" },
          description: { type: "string" },
          pricePerNight: { type: "number", minimum: 0, example: 450000 },
          capacity: { type: "integer", default: 2 },
          stock: { type: "integer", default: 5, description: "Number of rooms available" },
          bedConfig: { type: "object", properties: { type: { type: "string", example: "king" }, count: { type: "integer", example: 1 } } },
          roomAmenities: { type: "array", items: { type: "string" }, example: ["AC", "TV", "WiFi"] },
          bathAmenities: { type: "array", items: { type: "string" }, example: ["hot shower", "bathtub"] },
          images: { type: "array", items: { type: "string", format: "uri" }, minItems: 1 },
          isAvailable: { type: "boolean", default: true },
        },
      },
      TicketCategory: {
        type: "object",
        required: ["id", "name", "price"],
        description: "Use a temporary client-side id (e.g. 'cat-vip') so tickets can reference it via the `category` field. It gets replaced with a UUID on insert.",
        properties: {
          id: { type: "string", example: "cat-vip" },
          name: { type: "string", example: "VIP" },
          price: { type: "number", example: 500000 },
          maxPrice: { type: "number", example: 750000 },
          description: { type: "string" },
          status: { type: "string", default: "available" },
        },
      },
      Ticket: {
        type: "object",
        required: ["ticketId", "ticketName", "category", "price"],
        properties: {
          ticketId: { type: "string", example: "tix-1" },
          ticketName: { type: "string", example: "VIP Early Bird" },
          category: { type: "string", description: "Must match a ticketCategory.id in the same request", example: "cat-vip" },
          type: { type: "string", enum: ["normal", "b1g1", "discount"], default: "normal" },
          price: { type: "number", example: 400000 },
          normalPrice: { type: "number", description: "Original price before discount", example: 500000 },
          description: { type: "string" },
          isAvailable: { oneOf: [{ type: "boolean" }, { type: "integer", enum: [0, 1] }] },
        },
      },
      PendingData: {
        type: "object",
        nullable: true,
        description: "Populated only when a vendor edits a live listing (isActive=1). Stores the pending edit payload. Null when no edit is pending. Admin sees `liveSnapshot` alongside this to compare old vs new.",
        example: { name: "Updated Name", bannerUrl: "https://cdn.example.com/new.jpg", categories: [{ name: "Deluxe Room", pricePerNight: 550000 }] },
      },
      LiveSnapshot: {
        type: "object",
        nullable: true,
        description: "Returned in GET /:id for admins only when pendingData exists. Shows what the public currently sees (live main columns), so admin can compare against pendingData.",
        example: { categories: [{ name: "Standard Room", pricePerNight: 300000 }], bannerUrl: "https://cdn.example.com/old.jpg" },
      },
      Error: { type: "object", properties: { error: { type: "string" } } },
      Success: { type: "object", properties: { success: { type: "boolean", example: true } } },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {

    // =================== AUTH ===================
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Creates a vendor account by default. Admin accounts must set `role: 'admin'`. Admin users automatically get all roleTypes.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email", example: "vendor@example.com" },
                  password: { type: "string", minLength: 6, example: "secret123" },
                  name: { type: "string", example: "Budi Santoso" },
                  role: { type: "string", enum: ["admin", "vendor"], default: "vendor" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Registered successfully" },
          "400": { description: "Email already registered" },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login — returns JWT",
        description: "JWT payload: `sub` (userId), `role`, `name`, `roleType[]`. Token expires in 24h.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@example.com" },
                  password: { type: "string", example: "secret123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", description: "Use as: Authorization: Bearer <token>" },
                    user: { type: "object", properties: { id: { type: "string" }, email: { type: "string" }, name: { type: "string" }, role: { type: "string" }, roleType: { type: "array", items: { type: "string" } } } },
                  },
                },
              },
            },
          },
          "401": { description: "Invalid credentials" },
        },
      },
    },

    "/api/auth/users": {
      get: {
        tags: ["Auth"],
        summary: "List all users (admin only)",
        responses: {
          "200": { description: "List of users" },
          "403": { description: "Forbidden" },
        },
      },
    },

    "/api/auth/users/{id}/role-type": {
      patch: {
        tags: ["Auth"],
        summary: "Set vendor permissions (admin only)",
        description: "Replaces the entire roleType array. Omitting a type removes that permission. Vendor must have the matching roleType to create that listing type.",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["roleType"],
                properties: {
                  roleType: {
                    type: "array",
                    items: { type: "string", enum: ["event", "running", "hotel", "cafe", "restaurant", "rental", "umkm"] },
                    example: ["hotel", "event"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "roleType updated" },
          "403": { description: "Forbidden" },
          "404": { description: "User not found" },
        },
      },
    },

    // =================== EVENTS ===================
    "/api/events": {
      get: {
        tags: ["Events"],
        summary: "List events",
        description: "Admin sees all. Vendor sees only their own.",
        parameters: [{ name: "status", in: "query", schema: { $ref: "#/components/schemas/ApprovalStatus" } }],
        responses: { "200": { description: "List with ticketCategories and tickets nested" } },
      },
      post: {
        tags: ["Events"],
        summary: "Create event",
        description: "Requires `event` in roleType (or admin). Vendor → `approvalStatus=requested`. Admin → `approvalStatus=approved`. Both start with `isActive=0`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "startDate", "endDate", "price"],
                properties: {
                  name: { type: "string", minLength: 3, example: "Jazz Night 2025" },
                  eventType: { type: "string", enum: ["internal", "external"], default: "internal" },
                  externalUrl: { type: "string" },
                  description: { type: "string" },
                  startDate: { type: "string", example: "2025-08-01" },
                  endDate: { type: "string", example: "2025-08-03" },
                  price: { type: "number", description: "Auto-set to min ticket price when ticketCategories provided", example: 150000 },
                  location: { type: "string" },
                  locationAddress: { type: "string" },
                  locationUrl: { type: "string" },
                  bannerUrl: { type: "string" },
                  bannerUrls: { type: "array", items: { type: "string" } },
                  themeColor: { type: "string", default: "#FFFFFF" },
                  templateId: { type: "integer", minimum: 1, maximum: 5, default: 1 },
                  paymentMethod: { type: "string", enum: ["biller", "transfer"] },
                  accountNumber: { type: "string" },
                  ticketCategories: { type: "array", items: { $ref: "#/components/schemas/TicketCategory" } },
                  tickets: { type: "array", items: { $ref: "#/components/schemas/Ticket" } },
                },
              },
              example: {
                name: "Jazz Night 2025", startDate: "2025-08-01", endDate: "2025-08-03", price: 0, location: "Surabaya",
                ticketCategories: [{ id: "cat-vip", name: "VIP", price: 500000 }, { id: "cat-reg", name: "Regular", price: 150000 }],
                tickets: [
                  { ticketId: "t1", ticketName: "VIP Early Bird", category: "cat-vip", type: "discount", price: 400000, normalPrice: 500000 },
                  { ticketId: "t2", ticketName: "Regular", category: "cat-reg", type: "normal", price: 150000 },
                ],
              },
            },
          },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { type: "object", properties: { data: { type: "object", properties: { id: { type: "string" } } } } } } } },
          "403": { description: "Missing 'event' roleType" },
        },
      },
    },

    "/api/events/{id}": {
      get: { tags: ["Events"], summary: "Get event by ID", description: "Returns event with ticketCategories and flat tickets array.\n\nWhen `pendingData` exists and `isActive=1`: response shows the pending edit merged over the record. Admin also receives `liveSnapshot` (what public currently sees).", parameters: [idParam], responses: { "200": { description: "Event detail" }, "404": { description: "Not found" } } },
      put: { tags: ["Events"], summary: "Update event", description: "**If listing is inactive (`isActive=0`):** writes directly, `approvalStatus=requested`, `isActive=0`.\n\n**If listing is live (`isActive=1`, vendor only):** edit stored in `pendingData`, listing stays live. Admin reviews pending edit via `PATCH /:id/status`.\n\nAdmin edits always write directly regardless of `isActive`.\n\n⚠️ `isActive` in the request body is **ignored** — use `PATCH /:id/active` instead.", parameters: [idParam], requestBody: { content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", description: "Optional note appended to comments[] when vendor submits (ignored for admin edits)" } } } } } }, responses: { "200": { description: "Updated" }, "404": { description: "Not found" } } },
      delete: { tags: ["Events"], summary: "Delete event", parameters: [idParam], responses: { "200": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/api/events/{id}/status": statusEndpoint("Events"),
    "/api/events/{id}/active": activeEndpoint("Events", "event"),

    // =================== RUNNING EVENTS ===================
    "/api/running-events": {
      get: {
        tags: ["Running Events"],
        summary: "List running events",
        parameters: [{ name: "status", in: "query", schema: { $ref: "#/components/schemas/ApprovalStatus" } }],
        responses: { "200": { description: "List with categories and tickets" } },
      },
      post: {
        tags: ["Running Events"],
        summary: "Create running event",
        description: "Requires `running` in roleType (or admin). Running tickets include a `stock` field.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "startDate", "endDate", "price"],
                properties: {
                  name: { type: "string", minLength: 3, example: "Surabaya Marathon 2025" },
                  startDate: { type: "string", example: "2025-10-05" },
                  endDate: { type: "string", example: "2025-10-05" },
                  price: { type: "number", example: 200000 },
                  location: { type: "string" },
                  locationAddress: { type: "string" },
                  bannerUrl: { type: "string" },
                  bannerUrls: { type: "array", items: { type: "string" } },
                  ticketCategories: { type: "array", items: { $ref: "#/components/schemas/TicketCategory" } },
                  tickets: {
                    type: "array",
                    items: {
                      allOf: [
                        { $ref: "#/components/schemas/Ticket" },
                        { type: "object", properties: { stock: { type: "integer", example: 500 } } },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
          "403": { description: "Missing 'running' roleType" },
        },
      },
    },

    "/api/running-events/{id}": {
      get: { tags: ["Running Events"], summary: "Get running event by ID", description: "When `pendingData` exists and `isActive=1`: response shows the pending edit merged over the record. Admin also receives `liveSnapshot`.", parameters: [idParam], responses: { "200": { description: "Detail" }, "404": { description: "Not found" } } },
      put: { tags: ["Running Events"], summary: "Update running event", description: "**If inactive (`isActive=0`):** writes directly, `approvalStatus=requested`, `isActive=0`.\n\n**If live (`isActive=1`, vendor only):** edit stored in `pendingData`, listing stays live.\n\nAdmin edits always write directly.\n\n⚠️ `isActive` in the request body is **ignored** — use `PATCH /:id/active` instead.", parameters: [idParam], requestBody: { content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", description: "Optional note appended to comments[] when vendor submits (ignored for admin edits)" } } } } } }, responses: { "200": { description: "Updated" }, "404": { description: "Not found" } } },
      delete: { tags: ["Running Events"], summary: "Delete running event", parameters: [idParam], responses: { "200": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/api/running-events/{id}/status": statusEndpoint("Running Events"),
    "/api/running-events/{id}/active": activeEndpoint("Running Events", "running event"),

    // =================== HOTELS ===================
    "/api/hotels": {
      get: {
        tags: ["Hotels"],
        summary: "List hotels",
        description: "Returns hotels with their room categories.",
        parameters: [{ name: "status", in: "query", schema: { $ref: "#/components/schemas/ApprovalStatus" } }],
        responses: { "200": { description: "List with categories" } },
      },
      post: {
        tags: ["Hotels"],
        summary: "Create hotel",
        description: "Requires `hotel` in roleType (or admin). Room categories are stored as separate rows linked by hotelId.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "bannerUrl", "categories"],
                properties: {
                  name: { type: "string", minLength: 3, example: "Hotel Grand Surabaya" },
                  description: { type: "string" },
                  location: { type: "string", example: "Surabaya" },
                  locationAddress: { type: "string" },
                  locationUrl: { type: "string" },
                  starRating: { type: "number", minimum: 0, maximum: 5, example: 4 },
                  bannerUrl: { type: "array", items: { type: "string", format: "uri" }, minItems: 1, description: "First element used as primary banner" },
                  categories: { type: "array", items: { $ref: "#/components/schemas/HotelCategory" }, minItems: 1 },
                },
              },
              example: {
                name: "Hotel Grand Surabaya", location: "Surabaya", starRating: 4,
                bannerUrl: ["https://cdn.example.com/hotel.jpg"],
                categories: [{ name: "Deluxe Room", pricePerNight: 450000, capacity: 2, stock: 10, images: ["https://cdn.example.com/room.jpg"], roomAmenities: ["AC", "TV", "WiFi"], bedConfig: { type: "king", count: 1 } }],
              },
            },
          },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, id: { type: "string" } } } } } },
          "403": { description: "Missing 'hotel' roleType" },
        },
      },
    },

    "/api/hotels/{id}": {
      get: { tags: ["Hotels"], summary: "Get hotel by ID", description: "Includes room categories.\n\nWhen `pendingData` exists and `isActive=1`: top-level `categories` shows the pending edit. Admin also receives `liveSnapshot.categories` (live rooms public currently sees).", parameters: [idParam], responses: { "200": { description: "Hotel with categories (or pending edit merged when pendingData exists)" }, "404": { description: "Not found" } } },
      put: { tags: ["Hotels"], summary: "Update hotel", description: "Include `categories` array to replace all rooms.\n\n**If inactive (`isActive=0`):** writes directly to main columns and hotel_categories table. `approvalStatus=requested`, `isActive=0`.\n\n**If live (`isActive=1`, vendor only):** entire edit (including categories) stored in `pendingData`. Main columns and hotel_categories untouched. Listing stays live.\n\nAdmin edits always write directly.\n\n⚠️ `isActive` in the request body is **ignored** — use `PATCH /:id/active` instead.", parameters: [idParam], requestBody: { content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", description: "Optional note appended to comments[] when vendor submits (ignored for admin edits)" } } } } } }, responses: { "200": { description: "Updated" }, "404": { description: "Not found" } } },
      delete: { tags: ["Hotels"], summary: "Delete hotel", description: "Cascades room categories.", parameters: [idParam], responses: { "200": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/api/hotels/{id}/status": statusEndpoint("Hotels"),
    "/api/hotels/{id}/active": activeEndpoint("Hotels", "hotel"),

    // =================== CAFES & RESTAURANTS ===================
    "/api/cafes-restaurants": {
      get: {
        tags: ["Cafes & Restaurants"],
        summary: "List cafes and restaurants",
        parameters: [
          { name: "category", in: "query", schema: { type: "string", enum: ["cafe", "restaurant"] } },
          { name: "status", in: "query", schema: { $ref: "#/components/schemas/ApprovalStatus" } },
        ],
        responses: { "200": { description: "List" } },
      },
      post: {
        tags: ["Cafes & Restaurants"],
        summary: "Create cafe or restaurant",
        description: "Requires `cafe` or `restaurant` in roleType matching the `category` field (or admin).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category", "name", "bannerUrl", "menuItems"],
                properties: {
                  category: { type: "string", enum: ["cafe", "restaurant"], example: "restaurant" },
                  name: { type: "string", minLength: 3, example: "Warung Pak Budi" },
                  description: { type: "string" },
                  location: { type: "string" },
                  locationAddress: { type: "string" },
                  locationUrl: { type: "string" },
                  halalStatus: { type: "string", enum: ["halal-certified", "muslim-friendly", "non-halal"], example: "halal-certified" },
                  openTime: { type: "string", example: "08:00" },
                  closeTime: { type: "string", example: "22:00" },
                  priceRangeMin: { type: "number", example: 15000 },
                  priceRangeMax: { type: "number", example: 75000 },
                  bannerUrl: { type: "array", items: { type: "string" }, minItems: 1 },
                  amenities: { type: "array", items: { type: "string" }, example: ["WiFi", "AC", "Parkir"] },
                  menuItems: { type: "array", items: { $ref: "#/components/schemas/MenuItem" }, minItems: 1 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, id: { type: "string" } } } } } },
          "403": { description: "Missing cafe/restaurant roleType" },
        },
      },
    },

    "/api/cafes-restaurants/{id}": {
      get: { tags: ["Cafes & Restaurants"], summary: "Get cafe/restaurant by ID", description: "When `pendingData` exists and `isActive=1`: response shows pending fields merged. Admin also receives `liveSnapshot.menuItems`.", parameters: [idParam], responses: { "200": { description: "Detail" }, "404": { description: "Not found" } } },
      put: { tags: ["Cafes & Restaurants"], summary: "Update cafe/restaurant", description: "**If inactive (`isActive=0`):** writes directly, `approvalStatus=requested`, `isActive=0`.\n\n**If live (`isActive=1`, vendor only):** edit stored in `pendingData`, listing stays live.\n\nAdmin edits always write directly.\n\n⚠️ `isActive` in the request body is **ignored** — use `PATCH /:id/active` instead.", parameters: [idParam], requestBody: { content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", description: "Optional note appended to comments[] when vendor submits (ignored for admin edits)" } } } } } }, responses: { "200": { description: "Updated" }, "404": { description: "Not found" } } },
      delete: { tags: ["Cafes & Restaurants"], summary: "Delete cafe/restaurant", parameters: [idParam], responses: { "200": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/api/cafes-restaurants/{id}/status": statusEndpoint("Cafes & Restaurants"),
    "/api/cafes-restaurants/{id}/active": activeEndpoint("Cafes & Restaurants", "cafe/restaurant"),

    // =================== RENTALS ===================
    "/api/rentals": {
      get: {
        tags: ["Rentals"],
        summary: "List vehicle rentals",
        parameters: [
          { name: "category", in: "query", schema: { type: "string", enum: ["car", "motor"] } },
          { name: "status", in: "query", schema: { $ref: "#/components/schemas/ApprovalStatus" } },
        ],
        responses: { "200": { description: "List" } },
      },
      post: {
        tags: ["Rentals"],
        summary: "Create rental",
        description: "Requires `rental` in roleType (or admin).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category", "name", "bannerUrl", "vehicles"],
                properties: {
                  category: { type: "string", enum: ["car", "motor"], example: "car" },
                  name: { type: "string", minLength: 3, example: "Rental Mobil Pak Joko" },
                  description: { type: "string" },
                  location: { type: "string" },
                  locationAddress: { type: "string" },
                  locationUrl: { type: "string" },
                  bannerUrl: { type: "array", items: { type: "string" }, minItems: 1 },
                  vehicles: { type: "array", items: { $ref: "#/components/schemas/Vehicle" }, minItems: 1 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, id: { type: "string" } } } } } },
          "403": { description: "Missing 'rental' roleType" },
        },
      },
    },

    "/api/rentals/{id}": {
      get: { tags: ["Rentals"], summary: "Get rental by ID", description: "When `pendingData` exists and `isActive=1`: response shows pending fields merged. Admin also receives `liveSnapshot.vehicles`.", parameters: [idParam], responses: { "200": { description: "Detail with vehicles" }, "404": { description: "Not found" } } },
      put: { tags: ["Rentals"], summary: "Update rental", description: "**If inactive (`isActive=0`):** writes directly, `approvalStatus=requested`, `isActive=0`.\n\n**If live (`isActive=1`, vendor only):** edit stored in `pendingData`, listing stays live.\n\nAdmin edits always write directly.\n\n⚠️ `isActive` in the request body is **ignored** — use `PATCH /:id/active` instead.", parameters: [idParam], requestBody: { content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", description: "Optional note appended to comments[] when vendor submits (ignored for admin edits)" } } } } } }, responses: { "200": { description: "Updated" }, "404": { description: "Not found" } } },
      delete: { tags: ["Rentals"], summary: "Delete rental", parameters: [idParam], responses: { "200": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/api/rentals/{id}/status": statusEndpoint("Rentals"),
    "/api/rentals/{id}/active": activeEndpoint("Rentals", "rental"),

    // =================== UMKMS ===================
    "/api/umkms": {
      get: {
        tags: ["UMKMs"],
        summary: "List UMKMs",
        parameters: [
          { name: "category", in: "query", schema: { type: "string", enum: ["product", "food", "service"] } },
          { name: "status", in: "query", schema: { $ref: "#/components/schemas/ApprovalStatus" } },
        ],
        responses: { "200": { description: "List" } },
      },
      post: {
        tags: ["UMKMs"],
        summary: "Create UMKM",
        description: "Requires `umkm` in roleType (or admin).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category", "name", "bannerUrl", "products"],
                properties: {
                  category: { type: "string", enum: ["product", "food", "service"], example: "product" },
                  name: { type: "string", minLength: 3, example: "Batik Bu Sari" },
                  description: { type: "string" },
                  location: { type: "string" },
                  locationAddress: { type: "string" },
                  locationUrl: { type: "string" },
                  bannerUrl: { type: "array", items: { type: "string" }, minItems: 1 },
                  products: { type: "array", items: { $ref: "#/components/schemas/Product" }, minItems: 1 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, id: { type: "string" } } } } } },
          "403": { description: "Missing 'umkm' roleType" },
        },
      },
    },

    "/api/umkms/{id}": {
      get: { tags: ["UMKMs"], summary: "Get UMKM by ID", description: "When `pendingData` exists and `isActive=1`: response shows pending fields merged. Admin also receives `liveSnapshot.products`.", parameters: [idParam], responses: { "200": { description: "Detail with products" }, "404": { description: "Not found" } } },
      put: { tags: ["UMKMs"], summary: "Update UMKM", description: "**If inactive (`isActive=0`):** writes directly, `approvalStatus=requested`, `isActive=0`.\n\n**If live (`isActive=1`, vendor only):** edit stored in `pendingData`, listing stays live.\n\nAdmin edits always write directly.\n\n⚠️ `isActive` in the request body is **ignored** — use `PATCH /:id/active` instead.", parameters: [idParam], requestBody: { content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", description: "Optional note appended to comments[] when vendor submits (ignored for admin edits)" } } } } } }, responses: { "200": { description: "Updated" }, "404": { description: "Not found" } } },
      delete: { tags: ["UMKMs"], summary: "Delete UMKM", parameters: [idParam], responses: { "200": { description: "Deleted" }, "404": { description: "Not found" } } },
    },
    "/api/umkms/{id}/status": statusEndpoint("UMKMs"),
    "/api/umkms/{id}/active": activeEndpoint("UMKMs", "UMKM"),

    // =================== ORDERS ===================
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "List orders",
        description: "Admin = all orders. Vendor = own orders. No auth = must provide `?customerPhone=` or returns empty.",
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["pending", "accepted", "rejected", "completed", "preparing", "ready", "ready_to_pick", "searching_driver", "driver_found", "delivering"] } },
          { name: "orderType", in: "query", schema: { type: "string" } },
          { name: "customerPhone", in: "query", schema: { type: "string" }, description: "Required when calling without auth" },
        ],
        security: [],
        responses: { "200": { description: "List of orders" } },
      },
      post: {
        tags: ["Orders"],
        summary: "Create order (no auth required)",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderType", "serviceId", "customerName"],
                properties: {
                  orderType: { type: "string", enum: ["event", "running", "hotel", "cafe", "restaurant", "rental", "umkm"], example: "hotel" },
                  serviceId: { type: "string", description: "ID of the listing being ordered" },
                  customerName: { type: "string", example: "Andi Wijaya" },
                  customerPhone: { type: "string", example: "08123456789" },
                  quantity: { type: "integer", default: 1 },
                  totalAmount: { type: "number", example: 450000 },
                  notes: { type: "string" },
                  paymentMethod: { type: "string", enum: ["cash", "transfer", "va"] },
                  orderPayload: { type: "object", description: "Flexible extra data (selected tickets, room dates, etc.)" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Order created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, id: { type: "string" }, data: { type: "object" } } } } } },
        },
      },
    },

    "/api/orders/{id}/status": {
      patch: {
        tags: ["Orders"],
        summary: "Update order status (vendor/admin)",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["pending", "accepted", "rejected", "completed", "preparing", "ready", "ready_to_pick", "searching_driver", "driver_found", "delivering"] },
                  paymentMethod: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Status updated" }, "404": { description: "Order not found or not owned by you" } },
      },
    },

    "/api/orders/{id}/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Checkout — mark order as completed and generate invoice",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["paymentMethod"], properties: { paymentMethod: { type: "string", enum: ["cash", "transfer", "va"] } } },
            },
          },
        },
        responses: { "200": { description: "Checkout successful, invoiceNumber generated" }, "404": { description: "Order not found" } },
      },
    },

    // =================== DASHBOARD ===================
    "/api/dashboard/all-services": {
      get: {
        tags: ["Dashboard"],
        summary: "Aggregated listings + orders",
        description: "Returns all listing types and orders for the authenticated user (or all data for admin). Includes counts and a unified `summary` array sorted by createdAt.",
        responses: {
          "200": {
            description: "Dashboard data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: {
                        summary: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, type: { type: "string" }, createdAt: { type: "string" }, location: { type: "string" } } } },
                        totalEvents: { type: "integer" },
                        totalHotels: { type: "integer" },
                        totalCafesRestaurants: { type: "integer" },
                        totalRentals: { type: "integer" },
                        totalUmkms: { type: "integer" },
                        totalRunningEvents: { type: "integer" },
                        totalOrders: { type: "integer" },
                        raw: { type: "object", description: "Full data for each listing type" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // =================== LIFESTYLE (PUBLIC) ===================
    "/lifestyle/v1/menu": {
      get: {
        tags: ["Lifestyle — Public"],
        summary: "App menu — all active+approved listings in menu format",
        description: "No auth required. Only returns listings where `isActive=1 AND approvalStatus='approved'`. Returns a unified `partnerMenus` array suitable for app navigation.",
        security: [],
        responses: { "200": { description: "Menu data with partnerMenus array" } },
      },
    },
    "/lifestyle/v1/all-events": {
      get: { tags: ["Lifestyle — Public"], summary: "Active approved events", security: [], responses: { "200": { description: "Events with ticketCategories and tickets" } } },
    },
    "/lifestyle/v1/all-running-events": {
      get: { tags: ["Lifestyle — Public"], summary: "Active approved running events", security: [], responses: { "200": { description: "Running events with categories and tickets" } } },
    },
    "/lifestyle/v1/all-hotels": {
      get: { tags: ["Lifestyle — Public"], summary: "Active approved hotels", security: [], responses: { "200": { description: "Hotels with room categories" } } },
    },
    "/lifestyle/v1/all-cafes": {
      get: { tags: ["Lifestyle — Public"], summary: "Active approved cafes only", security: [], responses: { "200": { description: "Cafes list" } } },
    },
    "/lifestyle/v1/all-restaurants": {
      get: { tags: ["Lifestyle — Public"], summary: "Active approved restaurants only", security: [], responses: { "200": { description: "Restaurants list" } } },
    },
    "/lifestyle/v1/all-rentals": {
      get: { tags: ["Lifestyle — Public"], summary: "Active approved rentals", security: [], responses: { "200": { description: "Rentals list" } } },
    },
    "/lifestyle/v1/all-umkms": {
      get: { tags: ["Lifestyle — Public"], summary: "Active approved UMKMs", security: [], responses: { "200": { description: "UMKMs list" } } },
    },
  },
};
