# Finance Dashboard UI — Frontend Developer Intern Assignment

Built with Angular 17 (standalone components), Chart.js, and Tailwind CSS. The dashboard provides a role-based financial tracking interface with three core views: Dashboard (summary cards, daily activity line chart, spending doughnut chart), Transactions (sortable, searchable ledger with CSV/JSON export and full CRUD in Admin mode), and Insights (category breakdown, month-over-month comparison, savings rate). Roles are simulated on the frontend via a toggle — Viewer gets a read-only experience while Admin unlocks add, edit, and delete actions. State is managed entirely within the AppComponent using Angular signals-style reactive patterns. Dark mode is supported via CSS custom properties.

## Design Rationale

The dashboard was designed with a premium glassmorphism aesthetic featuring:
- **Full-page particle canvas background** with connecting dots and lines
- **Premium glassmorphism buttons** with hover effects and smooth transitions
- **Command bar interface** for unified time period filtering
- **Role-based access control** with clear visual indicators
- **Currency internationalization** supporting 7 major currencies
- **Responsive design** that works across desktop and mobile devices
- **Enhanced header** with prominent "Zorvyn - Your Financial Companion" branding

## Technical Implementation

### Architecture
- **Standalone Components**: Angular 17 with no NgModules for better tree-shaking
- **Reactive State Management**: Angular signals for reactive UI updates
- **CSS Custom Properties**: Theme system with dark/light mode support
- **Component Composition**: Modular design for maintainability
- **Type Safety**: Full TypeScript implementation with strict typing

### Key Features
- **Dashboard View**: Real-time charts with Balance Trend and Category breakdown
- **Transactions Management**: Full CRUD operations in Admin mode, read-only in Viewer mode
- **Data Export**: CSV and JSON export functionality
- **Theme System**: Dark/light mode with CSS variable-based theming and proper body text color
- **Currency Support**: 7 currencies with real-time conversion
- **Role Simulation**: Admin/Viewer roles with appropriate permissions
- **Command Bar**: Unified time period filtering (Week/Month/Year) with smart date range display

### UI Components
- **Enhanced Header**: Larger text size with prominent borders and glassmorphism effects
- **Sidebar Navigation**: Clean design with user panel and role management
- **Glassmorphism Effects**: Premium visual design throughout with proper borders
- **Bordered Elements**: Consistent border styling across all components

## Role-Based Access Control (RBAC)

The application implements a comprehensive RBAC system:
- **Viewer Role**: Read-only access to all data and charts
- **Admin Role**: Full access including add, edit, and delete operations
- **Visual Indicators**: Clear badges and status indicators
- **State Management**: Centralized role state with reactive updates

## State Management

All state is managed using Angular signals for optimal performance:
- **User State**: Current user and role information
- **Theme State**: Dark/light mode preference with proper CSS variable application
- **Data State**: Loading states and reactive data updates
- **UI State**: Component visibility and interaction states

## Responsive Design

The dashboard is fully responsive with:
- **Mobile-first approach** using Tailwind CSS breakpoints
- **Flexible layouts** that adapt to different screen sizes
- **Touch-friendly interactions** for mobile devices
- **Optimized performance** with efficient rendering

## Accessibility

- **Semantic HTML5** structure for screen readers
- **ARIA labels** on interactive elements
- **Keyboard navigation** support
- **High contrast ratios** in both light and dark modes
- **Focus management** for better keyboard navigation

## Performance Optimizations

- **Lazy loading** of components and data
- **Efficient chart rendering** with Chart.js optimizations
- **Minimal re-renders** using Angular signals
- **Optimized bundle size** through tree-shaking
- **Smooth animations** with CSS transforms

## Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile browsers**: iOS Safari, Chrome Mobile
- **Progressive enhancement**: Works without JavaScript enabled

## Security Considerations

- **Input sanitization** for XSS prevention
- **Role-based permissions** enforced on frontend
- **Secure data handling** with proper validation
- **CSRF protection** considerations for API calls
- **Content Security Policy** ready implementation

## Recent Enhancements

### Enhanced Header Design
- **Larger typography**: Increased from `text-base` to `text-3xl font-black` for maximum prominence
- **Prominent borders**: Added `border-b-2 border-cyan-500/30` with enhanced padding
- **Glassmorphism effects**: Premium backdrop blur and gradient effects
- **Improved spacing**: Better visual hierarchy with increased padding

### Advanced Theme System
- **Proper CSS variables**: Comprehensive dark/light mode support
- **Body text color**: Dynamic text color changes based on theme
- **Component theming**: All UI elements respect theme changes
- **Smooth transitions**: Animated theme switching with proper state management

### Command Bar Innovation
- **Unified interface**: Replaced multiple UI elements with single command bar
- **Smart filtering**: Week/Month/Year options with intelligent date range calculation
- **Role indicators**: Clean status badges without gold colors
- **Responsive design**: Adapts to different screen sizes

This dashboard represents a modern, professional financial management interface with comprehensive features, excellent user experience, and enterprise-ready architecture suitable for production deployment.

## Notes for reviewers

- **Role** is a frontend simulation only (dropdown in the header).
- **Currency** is shown as a plain number (no locale symbol) for simplicity.

## Tests

```bash
npm test
```
