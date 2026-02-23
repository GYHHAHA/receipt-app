# Receipt App (Receipt Canada Dashboard)

A modern dashboard for managing receipts and invoices, powered by Supabase and Gemini for AI-assisted receipt extraction.  
Business references and common flow patterns are aligned with [Receipt Canada](https://receiptcanada.com/).

## Highlights

- **AI receipt analysis**: Upload a receipt image, analyze via Gemini, store structured JSON in Supabase.
- **Human verification loop**: Change status and fix extracted fields when OCR/AI is imperfect.
- **Batch operations**: Batch assign ERP Chart of Accounts for multiple selected receipts.
- **CSV export**: Export filtered receipt data to a spreadsheet-friendly CSV.
- **Analytics**: Business + tax visualizations (14+ charts) with a clean, themed UI.
- **i18n + Theme**: English / Chinese / French + Light/Dark mode.

## Product & Business Flow

### Receipt flow (core)

1. **Capture / Upload**: User clicks **Upload Receipts** and uploads a receipt screenshot.
2. **AI extraction**: Frontend calls Gemini to extract fields as JSON:
   - vendor_name, receipt_no, receipt_time
   - subtotal, gst_hst, pst_qst, tax, total
   - payment, chart_of_acct
3. **Persist**: Insert the extracted record into Supabase `receipts`.
4. **Verify & correct**:
   - Select **one** receipt → **Change Receipts Status** → edit fields and save.
   - Tax/Total are auto-calculated in the edit form to keep numbers consistent.
5. **Batch assign**:
   - Select **multiple** receipts → **Batch Assign Chart of Acct/Payment** → choose a category and apply.
6. **Export**: **Export Receipts to CSV** exports the currently filtered dataset.

### Invoice flow (overview)

- Upload a filled invoice Excel, download template, manage invoice list and status.

### User Center flow (overview)

- Manage users (Add/Edit modal), company profile, activity logs, and subscriptions.

## Navigation & Sidebar Logic

### Routing

This project uses `@tanstack/react-router`.

- `/` → **Home** (default entry)
- `/data-panel/*` → Receipt / Invoice / Analytics / File Export
- `/user-center/*` → User Profile / Company / Activity / Subscription
- `/contact-us` → Contact page

### Sidebar organization

- **Data Panel**: Receipt, Invoice, Analytics, File Export (financial workflow)
- **User Center**: User Profile, Company, Activity, Subscription (org/user lifecycle)
- **Contact Us**: support/contact entry

`SidebarMenuItem` uses fuzzy route matching to highlight active groups and links.

### Company logo behavior

The top-left logo in the sidebar is clickable and navigates back to `/` (Home).

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Routing**: `@tanstack/react-router`
- **UI**: Tailwind CSS v4 + CSS variables (Light/Dark via `.dark`)
- **Icons**: `lucide-react`
- **i18n**: `i18next`, `react-i18next`
- **Charts**: `echarts`, `echarts-for-react`
- **Backend**: Supabase (`@supabase/supabase-js`)
- **AI**: Gemini (`@google/generative-ai`)

## Supabase Setup

### 1) Create table + sample data

Run the SQL in `supabase-schema.sql` using **Supabase SQL Editor**. It will:

- Create the `receipts` table
- Enable RLS and allow all access (demo-friendly)
- Insert **45 sample records**

### 2) Environment variables

Create/modify `.env` in the project root:

```bash
# Supabase: Dashboard -> Project -> Settings -> API
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Gemini: https://aistudio.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Where to find values:

- **Supabase URL**: Project Settings → API → **Project URL**
- **Supabase anon key**: Project Settings → API → **anon public**
- **Gemini key**: Google AI Studio → API Keys

## Local Development

```bash
npm install
npm run dev
```

Scripts:

- `npm run dev` – start dev server
- `npm run build` – typecheck + build
- `npm run lint` – eslint
- `npm run preview` – preview build

## Implementation Notes (How it works)

### Supabase data access

`src/lib/supabase.ts` provides:

- `fetchAllReceipts()` – load all receipts (used by Receipt + Analytics)
- `insertReceipt()` – insert new AI-extracted receipt
- `updateReceiptFields(ids, fields)` – update one or many receipts (Change Status & Batch Assign)

### Gemini receipt analysis

`src/lib/gemini.ts`:

- Converts the uploaded image file to base64
- Sends prompt + image to Gemini
- Parses and returns a JSON payload used to populate the `receipts` row

Model note:

- If a model becomes unavailable, update:
  - `genAI.getGenerativeModel({ model: \"...\" })`
  - Example fallback: `gemini-1.5-flash` (availability depends on your account/region)

### Security note (important for production)

This demo calls Gemini directly from the browser, so the API key is exposed to the client bundle.  
For production, move Gemini calls to a server-side layer (e.g., **Supabase Edge Functions** or your backend) and let the frontend call your own API.

## Pages (Quick Map)

- **Home**: `src/pages/HomePage.tsx`
- **Receipt**: `src/pages/data-panel/ReceiptPage.tsx`
- **Invoice**: `src/pages/data-panel/InvoicePage.tsx`
- **Analytics**: `src/pages/data-panel/AnalyticsPage.tsx`
- **File Export**: `src/pages/data-panel/FileExportPage.tsx`
- **User Center**:
  - `src/pages/user-center/UserProfilePage.tsx`
  - `src/pages/user-center/CompanyPage.tsx`
  - `src/pages/user-center/ActivityPage.tsx`
  - `src/pages/user-center/SubscriptionPage.tsx`
- **Contact**: `src/pages/ContactUsPage.tsx`
