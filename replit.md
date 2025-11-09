# KudiManager - Business Management System

## Overview
KudiManager is a comprehensive business management system for Nigerian small businesses, enabling them to track sales, expenses, and inventory. It offers a dashboard for performance monitoring, product and transaction management, and report generation. Key features include Nigerian tax calculations, AI-powered business advisory, vendor recommendations, learning resources, and Paystack-based subscription management. The platform aims to provide clear data and efficient workflows for informed decision-making.

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