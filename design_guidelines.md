# KudiManager Design Guidelines

## Design Approach: Business Dashboard System

**Selected Framework:** Material Design with business productivity focus
**Justification:** Data-heavy business management tool requiring clear information hierarchy, efficient forms, and scannable reports. Prioritizes functionality and usability over visual flair.

**Design References:** Draw inspiration from Notion (clarity), Asana (task management), and QuickBooks (financial data presentation)

---

## Brand Colors

**Primary Color:** Emerald Green `#007F5F` - Trust, growth, prosperity
**Accent Color:** Gold `#F4C542` - Success, premium quality
**Background:** Light Gray `#F6F7F9` - Clean, professional
**Text Primary:** Charcoal `#333333` - High readability

**Application:**
- Primary buttons, active nav items, success states: Emerald Green
- Highlights, badges, premium features: Gold
- Page backgrounds: Light Gray
- All body text: Charcoal

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
**Sidebar Navigation:**
- Uses shadcn Sidebar component
- Emerald green active state
- Sections: Dashboard, Sales, Expenses, Inventory, Tax Calculator, AI Advisor, Vendors, Learn, Subscription

**Mobile Navigation:**
- Collapsible sidebar with trigger button
- Full-height slide-out drawer

### Dashboard Cards
**Stats Overview Cards:**
- Grid of 3-4 metric cards
- Large currency value with mono font
- Label above value
- Emerald green for positive trends, red for negative
- Rounded corners (8px)
- Subtle elevation on hover

### Data Tables
**List Views (Sales, Expenses, Inventory):**
- Sticky header row
- Action column (right-aligned) with edit/delete icons
- Sortable columns
- Pagination at bottom
- Mobile: Card-based layout stacking info vertically

### Forms
**Input Forms (Add/Edit):**
- Clear section headers
- Label above each field
- Required field indicators (*)
- Focus ring in emerald green
- Number inputs for currency (step="0.01")
- Date pickers for transaction dates
- Primary action button (emerald green, rounded-lg)
- Secondary cancel button (ghost style)

**Form Validation:**
- Inline error messages below fields
- Error state border (red)
- Success confirmation toast notification

### Buttons & Actions
**Button Hierarchy:**
- Primary: Emerald green background, white text, 8px border radius
- Secondary: Border outline in emerald, transparent background
- Accent: Gold background for premium features
- Danger: Red for delete actions
- Hover transitions: All buttons have smooth 200ms transitions

### Status Indicators
- Profit (positive): Emerald green badge/text
- Loss (negative): Red badge/text
- Low stock warnings: Gold badge
- Premium features: Gold accent color

---

## Page-Specific Guidelines

### Tax Calculator Page
- Simple two-column form (Sales, Expenses inputs)
- Large emerald green "Calculate Tax" button
- Results card with breakdown (Corporate Tax, VAT, Total)
- AI tips section below results with gold accent

### AI Business Advisor Page
- Chat-like interface with message cards
- User inputs on right, AI insights on left
- Gold accent for AI avatar/icon
- Clean, conversational design

### Learning Resources Page
- Topic cards with icons (from lucide-react)
- Expandable sections for each topic
- Emerald green icons
- Clear, simple formatting for SME owners

### Vendor Directory Page
- Search bar at top
- Vendor cards in grid (3 columns on desktop)
- Gold badges for featured vendors
- Contact info clearly displayed

### Subscription/Billing Page
- Two pricing cards side-by-side
- Basic plan: Standard card
- Premium plan: Gold accent border, "Most Popular" badge
- Feature comparison list
- Emerald green "Subscribe Now" buttons
- Paystack integration

---

## Icons
**Library:** Lucide React
**Usage:**
- Navigation menu items
- Action buttons (edit, delete, view)
- Stats cards (trending up/down)
- Empty states
- Topic icons for learning resources

---

## Responsive Behavior

**Breakpoints:**
- Mobile: Base (< 768px) - Single column, stacked cards
- Tablet: md (768px+) - 2-column layouts where appropriate
- Desktop: lg (1024px+) - Full multi-column layouts, sidebar navigation

**Critical Adaptations:**
- Tables become cards on mobile
- Sidebar collapses with hamburger trigger
- Form layouts stack to single column
- Stats cards stack vertically on mobile

---

## Accessibility
- All form inputs have associated labels
- Buttons have clear text or aria-labels
- Sufficient color contrast (emerald on white, white on emerald)
- Focus indicators on all interactive elements
- Keyboard navigation support throughout

---

## Special Considerations

**Currency Display:** Always show currency symbol (₦ for Naira), formatted with commas (₦1,234.56)

**Empty States:** Friendly illustrations/messages when no data exists ("No sales yet. Add your first sale to get started!")

**Loading States:** Skeleton screens for tables, spinner for form submissions

**Animations:** Smooth hover transitions (200ms), rounded corners (8px), subtle elevation changes

---

This design creates a professional, trustworthy business tool with KudiManager's emerald green and gold branding that prioritizes clarity and efficiency.
