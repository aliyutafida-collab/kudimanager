# KudiManager Design Guidelines

## Design Approach: Business Dashboard System

**Selected Framework:** Material Design with business productivity focus
**Justification:** Data-heavy business management tool requiring clear information hierarchy, efficient forms, and scannable reports. Prioritizes functionality and usability over visual flair.

**Design References:** Draw inspiration from Notion (clarity), Asana (task management), and QuickBooks (financial data presentation)

---

## Core Design Principles

1. **Data Clarity First:** Information must be scannable and actionable
2. **Efficient Workflows:** Minimize clicks for common tasks (add sale, record expense)
3. **Trust Through Consistency:** Predictable patterns build user confidence
4. **Mobile-Responsive:** Small business owners work on-the-go

---

## Typography System

**Primary Font:** Inter (via Google Fonts)
**Secondary Font:** JetBrains Mono (for numbers, currency, reports)

**Hierarchy:**
- Page Titles: text-3xl font-semibold
- Section Headers: text-xl font-medium
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Data Labels: text-sm font-medium uppercase tracking-wide
- Currency/Numbers: font-mono text-lg font-semibold

---

## Layout System

**Spacing Scale:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section margins: mb-8, mt-6
- Card gaps: gap-4, gap-6
- Form fields: space-y-4

**Grid Structure:**
- Dashboard: 3-column grid (lg:grid-cols-3) for stats cards
- Tables: Full-width single column with responsive scroll
- Forms: 2-column layout on desktop (lg:grid-cols-2), single column mobile
- Reports: Flexible layout mixing charts and summary cards

---

## Component Library

### Navigation
**Sidebar Navigation (Desktop):**
- Fixed left sidebar, w-64
- Logo at top
- Menu items with icons (Heroicons)
- Active state with subtle background
- Sections: Dashboard, Sales, Expenses, Inventory, Reports, Settings

**Mobile Navigation:**
- Top bar with hamburger menu
- Slide-out drawer navigation

### Dashboard Cards
**Stats Overview Cards:**
- Grid of 3-4 metric cards
- Large currency value with mono font
- Label above value
- Small trend indicator (↑ ↓) with percentage
- Subtle border, rounded corners

### Data Tables
**List Views (Sales, Expenses, Inventory):**
- Sticky header row
- Zebra striping for rows
- Action column (right-aligned) with edit/delete icons
- Sortable columns
- Pagination at bottom
- Mobile: Card-based layout stacking info vertically

**Table Columns Example (Sales):**
- Date | Customer | Product | Quantity | Unit Price | Total | Actions

### Forms
**Input Forms (Add/Edit):**
- Clear section headers
- Label above each field
- Required field indicators (*)
- Input fields with border, focus ring
- Dropdown selects styled consistently
- Number inputs for currency (step="0.01")
- Date pickers for transaction dates
- Primary action button (large, prominent)
- Secondary cancel button (ghost style)

**Form Validation:**
- Inline error messages below fields
- Error state border (red)
- Success confirmation toast notification

### Reports Section
**Monthly Report View:**
- Date range selector at top
- Summary cards grid: Total Sales, Total Expenses, Net Profit
- Bar chart showing sales vs expenses over time
- Top products table
- Expense breakdown by category
- Export button (PDF/CSV)

### Buttons & Actions
**Button Hierarchy:**
- Primary: Solid background, medium shadow
- Secondary: Border outline, transparent
- Danger: Used for delete actions
- Icon buttons: Square, minimal padding
- Sizes: btn-sm, btn-md, btn-lg

### Status Indicators
- Profit (positive): Green badge/text
- Loss (negative): Red badge/text
- Low stock warnings: Yellow/orange badge
- Out of stock: Red badge with bold text

---

## Icons
**Library:** Heroicons (outline style via CDN)
**Usage:**
- Navigation menu items
- Action buttons (edit, delete, view)
- Stats cards (trending up/down)
- Empty states

---

## Responsive Behavior

**Breakpoints:**
- Mobile: Base (< 768px) - Single column, stacked cards
- Tablet: md (768px+) - 2-column layouts where appropriate
- Desktop: lg (1024px+) - Full multi-column layouts, fixed sidebar

**Critical Adaptations:**
- Tables become cards on mobile
- Sidebar collapses to hamburger menu
- Form layouts stack to single column
- Stats cards stack vertically on mobile

---

## Accessibility
- All form inputs have associated labels
- Buttons have clear text or aria-labels
- Sufficient color contrast for all text
- Focus indicators on all interactive elements
- Keyboard navigation support throughout

---

## Special Considerations

**Currency Display:** Always show currency symbol (₦ for Naira), formatted with commas (₦1,234.56)

**Empty States:** Friendly illustrations/messages when no data exists ("No sales yet. Add your first sale to get started!")

**Loading States:** Skeleton screens for tables, spinner for form submissions

**Animations:** Minimal - only subtle transitions on hover/focus. No distracting motion.

---

This design creates a professional, trustworthy business tool that prioritizes clarity and efficiency over decorative elements.