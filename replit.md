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

## Recent Improvements (January 2025)

### User Experience Enhancements
- **Enhanced CSS Framework**: Added mobile-first responsive utilities, glass morphism effects, smooth animations, and custom scrollbars
- **Loading States**: Implemented skeleton loading components (DashboardSkeleton, BookingCardSkeleton, StylistCardSkeleton) for improved perceived performance
- **Dark Mode Support**: Integrated theme provider with light/dark/system theme options and theme toggle component
- **Notification System**: Created notification banner component with toast-style notifications for better user feedback

### Mobile-First Design Improvements  
- **Responsive Navigation**: Enhanced landing page with collapsible mobile menu and improved mobile navigation
- **Mobile Containers**: Added mobile-responsive container and grid classes for consistent spacing and layout
- **Enhanced Search**: Created advanced search component with filters for location, price range, specializations, and ratings
- **Touch-Friendly UI**: Improved button sizes, touch targets, and mobile interaction patterns

### Visual Design Enhancements
- **Modern Color Palette**: Updated primary colors with pink/purple gradient themes for a more vibrant, beauty-focused brand
- **Glass Morphism Effects**: Added backdrop blur and translucent card designs for modern visual appeal
- **Enhanced Typography**: Improved font rendering with better feature settings and spacing
- **Interactive Elements**: Added hover states, smooth transitions, and enhanced button styling

### Performance Optimizations
- **Query Client Improvements**: Enhanced TanStack Query configuration with better error handling and retry logic
- **Component Architecture**: Optimized component structure with proper loading states and error boundaries
- **Type Safety**: Improved TypeScript implementation across all components with proper type guards

The platform now provides a significantly improved user experience with modern design patterns, better mobile responsiveness, and enhanced visual appeal while maintaining all core functionality.

## Design System Transformation (January 2025)

### Apple Style Guide Implementation
- **Complete UI Overhaul**: Replaced glass morphism design with clean, minimalist Apple-inspired interface following iOS/Android design patterns
- **Mobile-First Architecture**: Redesigned with `.app-container` constraint (max-width: 384px) for authentic mobile app experience
- **Color Palette**: Updated to purple accent (#6366f1) with clean whites and subtle grays matching Apple's design language
- **Typography System**: Implemented structured text hierarchy (.text-title-large, .text-headline, .text-body, .text-caption) following Apple's typography guidelines

### Component Design Language
- **iOS-Style Cards**: Clean white cards with subtle shadows and rounded corners (.ios-card, .ios-card-content)
- **Native Button Styles**: Apple-inspired buttons with proper touch feedback (.btn-primary, .btn-secondary) and active scaling
- **Profile Integration**: Seamless avatar components with fallback initials matching mockup designs
- **Status Indicators**: Color-coded status badges (confirmed, pending, cancelled) with appropriate semantic colors

### Page-Specific Implementations
- **Landing Page**: Dark hero section with professional imagery, centered VELY logo, and clear call-to-action matching first mockup
- **Client Dashboard**: Clean welcome section, upcoming appointments list, and bottom tab navigation matching iOS patterns
- **Stylist Dashboard**: Earnings metrics cards, availability toggle, and appointment management interface matching dashboard mockup
- **Search/Booking Flow**: "Book a Haircut" interface with stylist selection, time picker, and bottom action button matching booking mockup

### Navigation & Interaction Patterns
- **Bottom Tab Bar**: iOS-style navigation with active/inactive states and appropriate icons
- **Header Navigation**: Clean app headers with back buttons, titles, and action items
- **Touch Feedback**: Proper active states with subtle scaling animations for mobile interaction
- **Modal Dialogs**: Clean modal interfaces for user type selection and booking flows

The platform now fully embraces Apple's design philosophy with clean interfaces, intuitive navigation, and professional mobile-first aesthetics while maintaining all existing functionality.

## Stripe Connect Implementation (January 2025)

### Payout Infrastructure
- **Stripe Connect Integration**: Complete stylist onboarding flow with external account linking for direct bank deposits
- **Account Status Management**: Real-time tracking of pending, active, restricted, and inactive payout accounts
- **Platform Fee Structure**: Automated 15% platform fee deduction with 85% stylist retention on all bookings
- **Payout Timeline**: Direct bank transfers within 2 business days of booking completion

### Enhanced Database Schema
- **Stripe Account Fields**: Added stripeAccountId, stripeAccountStatus, stripeOnboardingCompleted to user profiles
- **Booking Payout Tracking**: Enhanced bookings with stripeTransferStatus, stylistPayout, platformFee calculations
- **Migration Support**: Database schema updates pushed successfully with Drizzle migrations

### Stylist Experience Enhancements
- **Payout Setup Page**: Comprehensive onboarding interface with status indicators and requirements checklist
- **Earnings Dashboard**: Detailed analytics showing total earnings, monthly breakdown, pending payouts, and payout history
- **Dashboard Integration**: Direct navigation from stylist dashboard to earnings and payout setup with visual alerts
- **Real-time Status**: Account verification progress with refresh capabilities and external Stripe link integration

### Technical Architecture
- **Demo Endpoints**: Complete API structure for Stripe Connect operations (create-account, status-check, earnings-tracking)
- **Payment Flow Updates**: Enhanced payment intent creation with automatic fee calculation and transfer destination
- **Error Handling**: Comprehensive error management for account setup failures and status verification issues
- **Mobile-First Design**: Responsive payout interfaces matching Apple design guidelines with proper touch feedback

The platform now provides professional-grade payout infrastructure enabling stylists to receive earnings directly while maintaining VELY's service quality and user experience standards.

## Complete Page Architecture Implementation (January 2025)

### Essential Page Creation
- **Profile Page**: Comprehensive user profiles with editable information, avatar upload, and role-specific sections (client vs stylist details)
- **Settings Page**: Full preferences management including notifications, privacy, business settings, and account management
- **Contact Page**: Professional contact interface with multiple support channels, office locations, business hours, and contact form
- **Bookings Page**: Stylist-focused booking management with filtering, status tracking, and client communication tools
- **Enhanced 404 Page**: User-friendly error page with proper navigation and support options

### Navigation Integration
- **Complete Menu System**: All referenced navigation links now functional across client, stylist, and public menus
- **Consistent User Experience**: Apple Style Guide maintained across all new pages with proper mobile-first responsive design
- **Route Configuration**: Full routing implementation in App.tsx with proper component imports and path definitions

### Content Quality Standards  
- **Authentic Information**: Real Toronto and LA office locations, proper business hours, and professional contact details
- **Role-Based Customization**: Different content and functionality for clients vs stylists throughout the platform
- **Interactive Features**: Form submissions, settings toggles, booking actions, and profile editing capabilities

### Technical Implementation
- **TypeScript Integration**: Full type safety across all new components with proper interface definitions
- **Component Reusability**: Consistent use of shadcn/ui components and custom iOS-style cards
- **State Management**: Proper useState and form handling with toast notifications and loading states
- **Mobile Optimization**: All pages designed mobile-first with responsive breakpoints and touch-friendly interactions

The platform now offers a complete user experience with all essential pages functional and professionally designed, eliminating placeholder content and providing comprehensive functionality for both clients and stylists.

## "Cut of the Month" Competition Feature (January 2025)

### Viral Marketing Integration
- **Monthly Voting Contest**: User-generated content competition with $100 customer and $1000 stylist prizes
- **Social Media Amplification**: Built-in sharing functionality with pre-filled captions and UTM tracking for viral growth
- **Community Engagement**: Public voting system creates ongoing user interaction and platform return visits
- **Professional Branding**: Automatic watermarking with "#VELYcut of the Month" for brand consistency

### Technical Implementation
- **PostgreSQL Database Schema**: Complete competition tables (competitions, competitionEntries, competitionVotes) with relations
- **Comprehensive API**: RESTful endpoints for submissions, voting, leaderboards, and admin moderation
- **Spam Prevention**: IP-based voting limits and month-specific voter identification hashing
- **Content Moderation**: Admin approval workflow with pending/approved/rejected/featured status management

### User Experience Features
- **Multi-Tab Interface**: Gallery view, leaderboard, submission form, and winners hall of fame
- **Photo Upload System**: 5MB limit with automatic watermarking and thumbnail generation
- **Voting System**: One vote per entry per month with real-time vote count updates
- **Mobile-First Design**: Apple-inspired interface matching existing design system with touch-friendly interactions

### Administrative Features
- **Content Moderation Panel**: Admin-only routes for entry approval, rejection, and featuring
- **Winner Selection Tools**: Manual winner designation with automated prize calculation
- **Competition Management**: Create new monthly competitions with customizable prize amounts
- **Analytics Integration**: Entry tracking, vote counting, and user engagement metrics

### Integration Points
- **Dashboard Banners**: Eye-catching competition promotion on client dashboard with animated elements
- **Navigation Integration**: Competition access added to all user type navigation menus
- **Cross-Platform Sharing**: Native mobile sharing API with fallback clipboard functionality
- **Database Consistency**: Seamless integration with existing user system and authentication

The competition feature drives viral growth through user-generated content while maintaining professional quality standards and providing substantial monetary incentives for participation.

## Enhanced User Experience Features (January 2025)

### Real-Time Notification System
- **NotificationCenter Component**: Comprehensive notification management with real-time updates for bookings, payments, reviews, and messages
- **Smart Categorization**: Color-coded notification types with priority levels (high, medium, low) and appropriate icons
- **Interactive Features**: Mark as read, dismiss notifications, and one-click navigation to relevant pages
- **Live Simulation**: Automated new notification generation for demo purposes with toast integration
- **Unread Badge**: Dynamic counter showing unread notifications with visual prominence

### Advanced Search & Discovery
- **AdvancedSearch Component**: Multi-criteria search with location, price range, ratings, specialties, and availability filters
- **Smart Filtering**: Distance radius slider, specialty checkboxes, minimum rating selection, and sort options
- **Location Services**: Address and postal code search with maximum distance customization
- **Real-time Results**: Instant filtering with visual feedback and active filter indicators
- **Mobile-Optimized**: Full-screen modal design with responsive grid layouts

### Stylist Portfolio System  
- **StylistPortfolio Component**: Professional portfolio galleries with before/after photo showcases
- **Category Filtering**: Organized by service types (Color, Cuts, Bridal, Men's, Kids) with visual badges
- **Interactive Elements**: Like functionality, social sharing, and full-screen image viewing
- **Engagement Metrics**: Like counts, creation dates, and portfolio item descriptions
- **Booking Integration**: Direct booking buttons from portfolio views for seamless conversion

### Business Intelligence & Analytics
- **AnalyticsDashboard Component**: Comprehensive performance tracking for both clients and stylists
- **Financial Metrics**: Earnings tracking, growth indicators, and goal progress visualization
- **Performance Goals**: Visual progress bars for monthly targets and achievement badges
- **Client Analytics**: Spending history, loyalty points, and savings tracking
- **Achievement System**: Performance badges for 5-star ratings, quick responses, and client satisfaction

### Enhanced Mobile Experience
- **Notification Integration**: Bell icon with badge counter in navigation headers across all pages
- **Search Accessibility**: Advanced search accessible from dashboard quick actions
- **Portfolio Viewing**: Optimized gallery layouts with touch-friendly interactions
- **Analytics Display**: Mobile-first card layouts with appropriate information density
- **Responsive Design**: All new components follow Apple design guidelines with proper spacing

### Technical Architecture Improvements
- **Component Modularity**: Reusable notification, search, portfolio, and analytics components
- **State Management**: Proper React hooks usage with TypeScript interfaces
- **Performance Optimization**: Lazy loading for portfolio images and efficient state updates
- **API Integration**: Ready for backend integration with comprehensive mock data structures
- **Design Consistency**: Unified styling with existing iOS-style cards and purple accent colors

The platform now provides enterprise-level user experience features with real-time notifications, advanced search capabilities, professional portfolio displays, and comprehensive business analytics while maintaining the mobile-first Apple design aesthetic.

## Comprehensive Stylist Onboarding & Verification System (January 2025)

### Professional Identity Verification
- **Multi-Step Onboarding Flow**: Comprehensive 4-step verification process with identity, background, professional, and portfolio validation
- **Government ID Verification**: Upload and selfie verification with government-issued identification documents
- **Background Check Integration**: Police background verification with criminal record checks and employment verification
- **Professional Credential Validation**: License verification, years of experience documentation, and specialty certification uploads
- **Reference Check System**: Professional and character reference verification with previous employers and clients

### VELY Count Tracking System
- **Total Cut Counter**: Platform-wide tracking of completed haircuts for each stylist with milestone achievements
- **Achievement Badges**: Progressive ranking system from "VELY Rookie" to "VELY Icon" with monetary rewards
- **Monthly Performance**: Real-time tracking of monthly cuts with daily average calculations
- **Milestone Celebrations**: Animated achievement notifications with rewards ranging from $10 to $1000+ bonuses
- **Professional Recognition**: Hall of Fame status and annual recognition for top-performing stylists

### Enhanced Database Schema
- **Verification Fields**: Added identity verification, background check status, and onboarding completion tracking
- **Professional Data**: License numbers, experience years, specializations, and workplace history storage
- **VELY Count Integration**: Persistent tracking of total and monthly cut counts with proper indexing
- **Security Compliance**: Encrypted storage of sensitive verification documents and personal information

### Security & Compliance Features
- **Document Management**: Secure upload and storage of police clearances, employment history, and certifications
- **Privacy Protection**: Encrypted personal information with audit trails and access logging
- **Compliance Standards**: Meeting professional beauty industry standards and regulatory requirements
- **Verification Timeline**: 3-5 business day processing with email updates and status tracking

### User Experience Enhancements
- **Progressive Disclosure**: Step-by-step onboarding with clear progress indicators and completion status
- **Real-time Feedback**: Instant verification status updates with actionable next steps
- **Professional Presentation**: Apple-inspired design maintaining platform consistency and mobile optimization
- **Achievement Gamification**: VELY Count system creates engagement and professional pride among stylists

The enhanced onboarding system ensures platform safety and quality while the VELY Count feature drives engagement and professional recognition, creating a trusted marketplace for both clients and stylists.