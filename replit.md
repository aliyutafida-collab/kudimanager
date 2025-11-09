# KudiManager - Business Management System

## Overview
KudiManager is a comprehensive business management system for Nigerian small businesses, enabling them to track sales, expenses, and inventory. It offers a dashboard for performance monitoring, product and transaction management, and report generation. Key features include Nigerian tax calculations, AI-powered business advisory, vendor recommendations, learning resources, and Paystack-based subscription management. The platform aims to provide clear data and efficient workflows for informed decision-making.

## Recent Changes (November 2025)

### Subscription & Trial System (New)
- **3-Month Free Trial**: All new users automatically receive 90-day free trial with full access
- **Trial Status Tracking**: Backend utilities calculate trial days remaining and status (active/warning/expired)
- **Access Enforcement**: Subscription middleware protects all API routes (products, sales, expenses, reports)
- **TrialBanner Component**: Color-coded banners on dashboard
  - Emerald green: Active trial (>7 days remaining)
  - Yellow/gold: Warning (≤7 days remaining)
  - Red: Trial expired (redirects to subscription page)
- **ProtectedRoute Updates**: Frontend redirects expired users to /subscription page
- **Subscription Page Enhancements**: Shows trial status with contextual messaging
- **AuthContext Integration**: Stores subscription info in user object with refreshSubscription() method
- **Paystack Integration**: Webhook handler activates subscriptions after successful payment
- **User Schema Updates**: Added planType, trialEndsAt, subscriptionStartedAt, subscriptionEndsAt, isActive fields

### Dashboard Enhancements
- Added 6-month analytics chart showing Sales vs Expenses vs Profit trends with Recharts
- Implemented smart reminder banners with contextual business advice
- Added daily rotating motivational quotes with gold accent styling
- Created footer component with brand messaging
- Integrated TrialBanner showing subscription status

### Onboarding Flow
- Built two-step setup wizard for new users (welcome → product setup)
- Registration now redirects to setup wizard before dashboard access
- Multiple product setup with visual chip display
- Fixed price validation to support Drizzle numeric type (string-based)

### Sales & Inventory Integration
- **Product Selector**: Sales dialog now uses dropdown to select from inventory
- **Auto-fill**: Unit price automatically populated when product selected
- **Stock Visibility**: Dropdown shows available stock for each product
- **Inventory Sync**: Sales automatically decrement product quantities
- **Validation**: Backend prevents overselling with stock checks
- **Error Handling**: Clear "Insufficient stock" messages to users

### Bug Fixes
- Fixed Gemini AI model name (gemini-1.5-pro)
- Fixed setup wizard price validation (numeric → string compatibility)
- Reordered backend sale creation logic to check stock BEFORE creating sale
- Added read-only unit price field to prevent NaN calculations
- Enhanced form validations with required product selection
- Fixed subscription field naming mismatch (isSubscriptionActive → subscriptionActive)

### Known Limitations
- **Concurrent Sales**: Race condition possible with simultaneous sales (requires database transactions for full prevention, acceptable for MVP/demo scenarios)

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend uses React with TypeScript, Vite for bundling, Wouter for routing, and TanStack Query for server state management. UI components are built with shadcn/ui on Radix UI primitives and styled with Tailwind CSS, adhering to a Material Design-inspired system with Inter and JetBrains Mono fonts. State is managed using React hooks, react-hook-form with Zod for forms, and localStorage for theme persistence.

### Backend Architecture
The backend is an Express.js application built with TypeScript, following a RESTful API pattern with JSON responses. Key API features include subscription management via Paystack, comprehensive financial learning resources, Nigerian tax calculation, AI business advisory using Google Gemini, and vendor suggestions. Authentication is handled by a JWT-based system with bcrypt for password hashing, supporting user registration, login, and protected routes. Data is scoped to individual users, ensuring isolation.

### Data Storage Solutions
The project uses an interface-based storage design, currently implemented with in-memory storage (MemStorage). The architecture is future-ready for migration to a database, with Drizzle ORM configured for PostgreSQL and schema definitions in `shared/schema.ts`. Planned tables include `products`, `sales`, and `expenses`.

### Authentication & Authorization
A JWT-based system handles user authentication, including registration, login, and protected API endpoints. Passwords are hashed with bcrypt. Frontend authentication uses a React Context (`AuthContext`) for global state management, localStorage for token persistence, and `ProtectedRoute` components for route protection.

### Subscription Management System
The platform implements a comprehensive trial and subscription system:
- **Trial Management**: 90-day free trial for all new users, tracked via `trialEndsAt` timestamp
- **Subscription Utilities** (`server/subscription-utils.ts`): Helper functions for trial/subscription validation
  - `calculateTrialDaysRemaining()`: Calculates days left in trial
  - `isTrialActive()`: Checks if trial is still valid
  - `isSubscriptionActive()`: Validates paid subscription status
  - `canAccessDashboard()`: Determines user access rights
  - `getSubscriptionInfo()`: Returns comprehensive subscription data
- **Access Enforcement**: `subscriptionMiddleware` protects all data routes, returns 403 for expired users
- **Frontend Components**:
  - `TrialBanner`: Displays color-coded subscription status on dashboard
  - `ProtectedRoute`: Redirects expired users to subscription page
  - `AuthContext`: Manages subscription state with `refreshSubscription()` method
- **Payment Integration**: Paystack webhook activates subscriptions and extends access for 30 days

### Key Architectural Decisions
The project adopts a monorepo structure for shared client/server code, emphasizing end-to-end type safety with TypeScript, Drizzle, and Zod. Performance is optimized through React Query caching and Vite's bundling. Development experience is enhanced with HMR, integrated error overlays, and API logging.

## External Dependencies

### Third-Party Services
- **Google Fonts**: Inter and JetBrains Mono font families.
- **Neon Database**: Serverless PostgreSQL (configured for future use).
- **Paystack**: Nigerian payment gateway for subscriptions.
- **Google Gemini AI**: Provides business advisory through Replit AI Integrations.

### UI Libraries
- **Radix UI**: Unstyled, accessible components.
- **Lucide React**: Icon library.
- **date-fns**: Date manipulation.
- **class-variance-authority**: Type-safe variant styling.
- **cmdk**: Command palette component.
- **embla-carousel-react**: Carousel functionality.

### Developer Tools
- **Replit Plugins**: Runtime error modal, cartographer, dev banner.
- **tsx**: TypeScript execution.
- **esbuild**: Production bundling.
- **Drizzle Kit**: Database migration tooling.

### Form & Validation
- **react-hook-form**: Form state management.
- **@hookform/resolvers**: Form validation integration.
- **Zod**: Schema validation and type inference.