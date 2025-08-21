# Overview

This is a financial portfolio management web application built with a modern full-stack architecture. The application provides portfolio tracking, goal management, risk assessment via ATRQ (Attitude to Risk Questionnaire), and suitability monitoring features. It's designed for financial advisors and clients to manage investment portfolios and monitor compliance with suitability rules.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with **React + TypeScript** using Vite as the build tool. The UI leverages the **shadcn/ui component library** with **Radix UI primitives** and **Tailwind CSS** for styling. The application uses **Wouter** for client-side routing and **TanStack React Query** for state management and API communication.

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` for main views (Dashboard, Suitability Monitor)
- Reusable UI components in `client/src/components/ui/`
- Custom hooks for functionality like mobile detection and toast notifications
- Centralized API client with error handling and caching

## Backend Architecture
The server is built with **Express.js** and follows a RESTful API design pattern. The backend uses:
- Express middleware for request logging, JSON parsing, and error handling
- Route handlers in `server/routes.ts` for API endpoints
- Storage abstraction layer in `server/storage.ts` defining interfaces for data operations
- Custom Vite integration for development with HMR support

The API provides endpoints for:
- User management
- Portfolio CRUD operations
- Financial goals tracking
- ATRQ results management
- Suitability rules configuration
- Monitoring field management

## Data Storage
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The database schema is defined in `shared/schema.ts` using Drizzle's schema definition API with **Zod** for validation.

Key data models include:
- Users with authentication credentials
- Portfolios with financial metrics and risk levels
- Goals with asset targets and progress tracking
- ATRQ results for risk profiling
- Suitability rules for compliance monitoring
- Monitoring fields for custom tracking

## Authentication and Authorization
The application currently uses a simplified authentication model with hardcoded demo users for development purposes. Session management is implemented using PostgreSQL session storage with **connect-pg-simple**.

## External Dependencies

### Database
- **Neon Database** (`@neondatabase/serverless`) - Serverless PostgreSQL database provider
- **Drizzle ORM** (`drizzle-orm`) - Type-safe ORM for database operations
- **Drizzle Kit** (`drizzle-kit`) - Database migration and introspection tool

### UI Framework
- **React** with TypeScript for component development
- **Radix UI** components for accessible, unstyled UI primitives
- **shadcn/ui** - Pre-built component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### State Management & API
- **TanStack React Query** - Server state management and caching
- **React Hook Form** with resolvers for form handling
- **Zod** - Schema validation library

### Development Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety and enhanced developer experience
- **ESBuild** - Fast JavaScript bundler for production builds
- **PostCSS** with Autoprefixer for CSS processing