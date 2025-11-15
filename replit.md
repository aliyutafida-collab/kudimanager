# KudiManager - Business Management System

## Overview
KudiManager is a comprehensive business management system designed for Nigerian small businesses. Its primary purpose is to enable efficient tracking of sales, expenses, and inventory, offering a centralized dashboard for performance monitoring. Key capabilities include product and transaction management, report generation, Nigerian tax calculations, AI-powered business advisory, vendor recommendations, learning resources, and subscription management via Paystack. The platform aims to provide clear data and streamlined workflows to facilitate informed decision-making and support business growth.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, using Vite for bundling, Wouter for routing, and TanStack Query for server state management. UI components are developed with shadcn/ui based on Radix UI primitives, styled using Tailwind CSS. The design follows a modern, clean aesthetic with Inter font throughout the application. State management is handled by React hooks, form handling uses react-hook-form with Zod for validation, and localStorage persists user preferences like theme and language. 

The application includes a comprehensive multi-language translation system powered by react-i18next, supporting English, Hausa, Yoruba, and Igbo. A simple select dropdown serves as the LanguageSwitcher component in the header, with clean styling that adapts to light/dark themes. Language preferences persist to localStorage and apply immediately across all UI elements, including sidebar navigation and form labels.

A consistent currency formatting system uses a custom `CurrencyDisplay` component that displays Nigerian Naira (₦) in emerald green (#007F5F) with Inter font (weight 600) and tabular numerals for proper alignment. Currency amounts default to no decimals (e.g., ₦12,500) with proper rounding, providing a clean, professional look across all financial displays. 

A PWA conversion provides an app-like experience with offline capabilities, custom splash screen, and responsive design for mobile devices, ensuring touch-friendly interactions and adaptive layouts.

### Backend Architecture
The backend is an Express.js application written in TypeScript, providing a RESTful API with JSON responses. It integrates Paystack for subscription management, offers financial learning resources, performs Nigerian tax calculations, and utilizes Google Gemini for AI business advisory. Vendor suggestions are also a core feature. Authentication is managed via a JWT-based system, with bcrypt for password hashing, securing user registration, login, and protected API routes. Data is user-scoped to ensure privacy and isolation.

### Data Storage Solutions
The system uses an interface-based storage design, currently implemented with in-memory storage (MemStorage). It is designed for future migration to a persistent database, with Drizzle ORM configured for PostgreSQL and schema definitions prepared in `shared/schema.ts` for tables like `products`, `sales`, and `expenses`.

### Authentication & Authorization
A JWT-based system manages user authentication, including registration, login, and securing API endpoints. Passwords are hashed using bcrypt. The frontend utilizes a React Context (`AuthContext`) for global authentication state, with full login persistence via localStorage. 

**Login Persistence Implementation:**
- User data is stored in localStorage under the key `kudiUser` with the structure: `{id, email, name, business_type, plan}`
- JWT token stored separately under `auth_token`
- On app load, AuthContext automatically restores user session from localStorage, enabling seamless login persistence across page refreshes and backend restarts
- Loading state prevents premature redirects while auth initializes from localStorage
- Login and Register pages redirect authenticated users to prevent duplicate sessions
- Logout clears both `kudiUser` and `auth_token` from localStorage
- Defensive error handling ensures malformed localStorage data doesn't crash the app

Additional security features include:
- **Strong Password Validation**: Real-time validation using regex `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/` requiring minimum 8 characters with uppercase, lowercase, number, and special character. Visual feedback with color-coded messages (red #d93a3a for errors, green #007F5F for success) and icons (AlertCircle/CheckCircle2).
- **Password Confirmation**: Confirm password field with real-time matching validation and visual feedback.
- **Forgot Password**: Inline form toggle on login page (no new page/modal) with email validation, mock reset implementation that logs to console, and user-friendly confirmation message: "If this email exists, a password reset link has been sent."
- **Route Protection**: `ProtectedRoute` components guard authenticated routes, with automatic redirection of authenticated users away from login/register pages.

### Subscription Management System
The platform incorporates a robust trial and subscription system:
- **Trial Management**: New users receive a 90-day free trial, tracked by a `trialEndsAt` timestamp.
- **Subscription Utilities**: Server-side functions (e.g., `calculateTrialDaysRemaining`, `isTrialActive`, `isSubscriptionActive`, `canAccessDashboard`, `getSubscriptionInfo`) manage trial and subscription validation.
- **Access Enforcement**: A `subscriptionMiddleware` protects all data-related API routes, restricting access for expired users.
- **Frontend Integration**: A `TrialBanner` displays subscription status, `ProtectedRoute` redirects expired users, and `AuthContext` manages subscription state with a `refreshSubscription()` method.
- **Payment Integration**: Paystack webhooks are integrated to activate and extend subscriptions upon successful payment.

### Key Architectural Decisions
The project employs a monorepo structure for shared client/server code, emphasizing end-to-end type safety with TypeScript, Drizzle, and Zod. Performance is optimized through React Query caching and Vite's fast bundling. The development experience is enhanced with Hot Module Replacement (HMR), integrated error overlays, and API logging.

## External Dependencies

### Third-Party Services
- **Google Fonts**: Inter and JetBrains Mono.
- **Neon Database**: Serverless PostgreSQL (future integration).
- **Paystack**: Payment gateway for subscriptions.
- **Google Gemini AI**: Provides business advisory.

### UI Libraries
- **Radix UI**: Accessible, unstyled components.
- **Lucide React**: Icon library.
- **date-fns**: Date manipulation utility.
- **class-variance-authority**: Type-safe variant styling.
- **cmdk**: Command palette.
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