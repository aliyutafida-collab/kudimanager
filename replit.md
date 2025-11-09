# KudiManager - Business Management System

## Overview

KudiManager is a comprehensive business management system designed for small businesses to track sales, expenses, and inventory. The application provides a dashboard interface for monitoring business performance, managing products, recording transactions, and generating reports. Built with a focus on data clarity and efficient workflows, it enables business owners to make informed decisions through scannable data presentation and streamlined task management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React with TypeScript**: Component-based UI using functional components and hooks
- **Vite**: Fast build tool and development server with HMR (Hot Module Replacement)
- **Wouter**: Lightweight routing library for client-side navigation
- **TanStack Query (React Query)**: Server state management with automatic caching, refetching, and synchronization

**UI Component System**
- **shadcn/ui**: Headless component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Design System**: Material Design-inspired with business productivity focus
  - Typography: Inter (primary), JetBrains Mono (numbers/currency)
  - Theme: Light/dark mode support with custom color system
  - Spacing: Consistent Tailwind scale (2, 4, 6, 8, 12, 16 units)

**State Management Strategy**
- Server state handled by React Query with queryClient
- Local UI state managed by React hooks (useState, useContext)
- Form state managed by react-hook-form with Zod validation
- Theme persistence via localStorage

### Backend Architecture

**Server Framework**
- **Express.js**: Node.js web application framework
- **TypeScript**: Type-safe server implementation with ES modules
- **Architecture Pattern**: RESTful API with JSON responses

**API Design**
- RESTful endpoints organized by resource (products, sales, expenses)
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- JSON request/response format
- Error handling with appropriate status codes (404, 400, 500)
- Request logging middleware for debugging

**Storage Layer**
- **Interface-Based Design**: IStorage interface defines all data operations
- **Current Implementation**: In-memory storage (MemStorage class) using Map collections
- **Future-Ready**: Interface allows easy migration to database persistence
- **Data Models**: Products, Sales, Expenses with UUID identifiers

### Data Storage Solutions

**Database Schema (Drizzle ORM)**
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` for type sharing between client/server
- **Tables**:
  - `products`: Inventory management (name, SKU, category, price, quantity, stock thresholds)
  - `sales`: Transaction records (product references, customer info, quantities, totals, timestamps)
  - `expenses`: Business expenses (description, category, amount, timestamps)
- **Validation**: Drizzle-Zod integration for runtime schema validation

**Current State vs. Planned Architecture**
- Database connection configured in `drizzle.config.ts` pointing to `DATABASE_URL`
- Neon Database serverless driver installed (@neondatabase/serverless)
- Migration scripts ready (`db:push` command available)
- **Gap**: Storage layer currently uses in-memory implementation instead of database

### Authentication & Authorization

**Current State**: No authentication system implemented
- Application is single-user focused
- No login/signup flows
- No session management
- Future consideration: Would benefit from user authentication for multi-business support

### External Dependencies

**Third-Party Services**
- **Google Fonts**: Inter and JetBrains Mono font families
- **Neon Database**: Serverless PostgreSQL (configured but not actively used)

**UI Libraries**
- **Radix UI**: Comprehensive set of unstyled, accessible components
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date formatting and manipulation
- **class-variance-authority**: Type-safe variant styling
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel functionality

**Developer Tools**
- **Replit Plugins**: Runtime error modal, cartographer, dev banner
- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling
- **Drizzle Kit**: Database migration tooling

**Form & Validation**
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration
- **Zod**: Schema validation and type inference

### Key Architectural Decisions

**Monorepo Structure**
- Shared schema definitions between client and server
- Path aliases for clean imports (`@/`, `@shared/`, `@assets/`)
- Single package.json for simplified dependency management

**Type Safety Strategy**
- End-to-end TypeScript coverage
- Shared types via Drizzle schema inference
- Zod runtime validation aligned with database schema
- Strict TypeScript compiler settings

**Performance Considerations**
- React Query with infinite stale time for reduced network requests
- Vite's optimized bundling and code splitting
- No unnecessary re-fetching (refetchOnWindowFocus: false)
- Monospace fonts for numbers to prevent layout shift

**Development Experience**
- Hot module replacement for rapid iteration
- Integrated error overlay in development
- Request/response logging for API debugging
- Component examples for UI development isolation