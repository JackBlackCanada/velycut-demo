# VELY - On-Demand Hair Services Platform

## Overview

VELY is a mobile-first, dual-sided web application that connects clients with professional hair stylists and barbers for on-demand and scheduled at-home services. The platform serves as an "Uber for haircuts," enabling clients to book services and stylists to manage their business operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state and React Hook Form for form handling
- **Routing**: Wouter for lightweight client-side routing
- **Payment Integration**: Stripe Elements for secure payment processing

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Authentication**: Replit Auth with OpenID Connect (OIDC) integration
- **Session Management**: Express sessions with PostgreSQL session store
- **API Structure**: RESTful endpoints with proper error handling and logging middleware

### Data Layer
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Key Components

### User Management System
- **Dual User Types**: Clients and stylists with role-based access control
- **Profile Setup**: Comprehensive onboarding flows for both user types
- **Authentication Flow**: Replit Auth integration with automatic redirects and session management

### Booking System
- **Multi-step Booking**: Service selection, scheduling, address collection, and payment
- **Real-time Availability**: Stylist availability management with toggle controls
- **Status Management**: Booking lifecycle from pending to completed with review capability

### Payment Infrastructure
- **Stripe Integration**: Secure payment processing with test mode support
- **Payment Intents**: Server-side payment intent creation for enhanced security
- **Checkout Flow**: Dedicated checkout page with Stripe Elements integration

### Review and Rating System
- **Multi-dimensional Reviews**: Overall rating plus specific metrics (professionalism, quality, punctuality)
- **Review Management**: Post-booking review collection with comment support
- **Rating Aggregation**: Automatic calculation of stylist ratings and review counts

### Search and Discovery
- **Stylist Search**: Location-based and specialization-based filtering
- **Service Catalog**: Individual service offerings with pricing and duration
- **Profile Browsing**: Detailed stylist profiles with bio, experience, and portfolio

## Data Flow

### User Registration Flow
1. User selects client or stylist registration
2. Replit Auth handles authentication
3. Profile setup form captures user-specific data
4. User record created with appropriate user type
5. Redirect to role-specific dashboard

### Booking Flow
1. Client searches for stylists or services
2. Service selection and scheduling
3. Address and contact information collection
4. Payment intent creation on server
5. Stripe payment processing
6. Booking confirmation and notifications

### Stylist Workflow
1. Profile and service management
2. Availability toggle control
3. Booking request notifications
4. Accept/reject booking decisions
5. Service completion and payment processing

## External Dependencies

### Authentication Services
- **Replit Auth**: Primary authentication provider with OIDC
- **Session Storage**: PostgreSQL-backed session management

### Payment Processing
- **Stripe**: Payment processing with Connect for marketplace functionality
- **Webhook Handling**: Payment confirmation and status updates

### Database Services
- **Neon**: Serverless PostgreSQL database hosting
- **Connection Management**: @neondatabase/serverless for optimal performance

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Production build optimization

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **Database Migrations**: Drizzle Kit for schema management
- **Environment Variables**: Secure configuration management

### Production Build
- **Frontend**: Vite build with optimized bundle splitting
- **Backend**: ESBuild compilation for Node.js deployment
- **Static Assets**: Served from dist/public directory

### Database Management
- **Schema Versioning**: Migration-based schema evolution
- **Connection Pooling**: Serverless-optimized connection management
- **Environment Separation**: Development and production database isolation

### Security Considerations
- **HTTPS Enforcement**: Secure cookie settings for production
- **CORS Configuration**: Proper origin validation
- **Session Security**: HttpOnly cookies with appropriate expiration
- **Input Validation**: Zod schema validation for all user inputs

The architecture prioritizes mobile-first responsive design, secure payment processing, and scalable user management while maintaining type safety throughout the application stack.