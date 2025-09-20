# VELY - On-Demand Hair Services Platform

## Overview
VELY is a mobile-first, dual-sided web application that connects clients with professional hair stylists and barbers for on-demand and scheduled at-home services. It functions as an "Uber for haircuts," enabling clients to book services and stylists to manage their businesses. The platform aims to provide a trusted marketplace, drive viral growth through user engagement, and incorporate AI for personalized experiences and virtual consultations, ultimately enhancing service quality and user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
- **Design Philosophy**: Apple Style Guide implementation with a clean, minimalist interface, mobile-first architecture (`.app-container` constraint at max-width: 384px), and a purple accent color (`#6366f1`).
- **Typography**: Structured text hierarchy (`.text-title-large`, `.text-headline`, `.text-body`, `.text-caption`).
- **Components**: iOS-style cards, native button styles with active scaling, seamless avatar components, and color-coded status badges.
- **Navigation**: iOS-style bottom tab bar for primary navigation and clean headers with back buttons.
- **Visual Enhancements**: Skeleton loading states, dark mode support, notification system, glass morphism effects (initially, then transitioned to Apple style), and modern color palettes.

### Technical Implementations
- **Frontend**: React with TypeScript (Vite), Shadcn/ui (Radix UI), Tailwind CSS, TanStack Query, React Hook Form, and Wouter for routing.
- **Backend**: Node.js with Express.js, Replit Auth (OIDC), Express sessions, and RESTful APIs.
- **Database**: PostgreSQL with Neon (serverless), Drizzle ORM, and Drizzle Kit for schema management.
- **Authentication**: Replit Auth integrated with comprehensive user management for client and stylist roles, including multi-step onboarding and role-based access.
- **Booking System**: Multi-step booking wizard with service selection, scheduling, address collection, payment, real-time availability, dynamic pricing, group booking, recurring appointments, and weather integration for smart suggestions.
- **Payment Infrastructure**: Stripe for secure payment processing (Elements, Payment Intents), Stripe Connect for stylist payouts with a 15% platform fee, and webhook handling.
- **Communication**: Real-time in-app messaging (WebSockets) between clients and stylists, and live location tracking for stylists en route with ETA calculations.
- **AI/ML Features**:
    - **Recommendation Engine**: Machine learning-powered style suggestions based on hair type, face shape, and lifestyle, with personalization algorithms and smart filtering.
    - **Virtual Consultation**: Remote consultation system with photo analysis (AI-powered assessment of hair type), interactive questionnaires, and live video chat.
    - **Smart Service Suggestions**: AI-powered recommendations based on weather, hair type, and previous bookings.
- **Stylist Tools**: Comprehensive onboarding and verification (ID, background, professional credentials, references), VELY Count tracking system for completed haircuts with achievement badges and monetary rewards, and a professional portfolio system with before/after photos.
- **Upselling System**: Post-selection add-on services (hair care, styling, color, family services) with strategic pricing and multi-service discounts presented after stylist selection.
- **Search & Discovery**: Advanced multi-criteria search with location, price range, ratings, specialties, and availability filters.
- **Analytics**: Business intelligence dashboards for both clients and stylists, tracking financial metrics, performance goals, and achievement systems.
- **Competition Feature**: "Cut of the Month" viral marketing contest with user-generated content, public voting, social media amplification, and monetary prizes.

### System Design Choices
- **Modularity**: Reusable components for notifications, search, portfolio, and analytics.
- **Performance**: Optimized with lazy loading for images, efficient state updates, and serverless database architecture.
- **Security**: HTTPS enforcement, CORS configuration, HttpOnly cookies, input validation (Zod), and encrypted storage for sensitive data.
- **Scalability**: Designed for dual-sided marketplace growth with robust database and API structures.

## External Dependencies
- **Authentication**: Replit Auth, PostgreSQL (for session storage).
- **Payment Processing**: Stripe (for payments and Stripe Connect for payouts).
- **Database**: Neon (serverless PostgreSQL).
- **Development Tools**: Vite, TypeScript, ESBuild.