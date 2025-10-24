# Frontend Development Prompts

## TLDR

AI prompts and guidance for frontend development tasks in the Fantasy Football Companion App.

## React.js Development Prompts

### Component Development

#### Creating New Components
```
You are developing a React component for the Fantasy Football Companion App. 

Context:
- Use React.js 18+ with TypeScript
- Follow mobile-first design principles
- Use Tailwind CSS for styling
- Implement proper error handling and loading states
- Follow the component architecture in /docs/2-Design/frontend.md

Requirements:
- Create a [COMPONENT_NAME] component that [FUNCTIONALITY]
- Use TypeScript interfaces for props
- Implement responsive design with Tailwind CSS
- Add proper error boundaries and loading states
- Follow the established component structure
- Include accessibility features (ARIA labels, keyboard navigation)
- Add proper TypeScript types and interfaces

Please create the component following these guidelines.
```

#### Updating Existing Components
```
You are updating an existing React component in the Fantasy Football Companion App.

Context:
- Component is located at [COMPONENT_PATH]
- Current functionality: [CURRENT_FUNCTIONALITY]
- Update requirements: [UPDATE_REQUIREMENTS]

Requirements:
- Maintain existing functionality while adding new features
- Follow established coding patterns and conventions
- Update TypeScript interfaces as needed
- Ensure mobile-first responsive design
- Add proper error handling for new functionality
- Update component documentation

Please update the component following these guidelines.
```

### State Management

#### React Query Implementation
```
You are implementing React Query for server state management in the Fantasy Football Companion App.

Context:
- Use React Query for all server state
- Implement proper caching and real-time updates
- Follow the state management strategy in /docs/2-Design/frontend.md

Requirements:
- Create a React Query hook for [DATA_TYPE]
- Implement proper caching with 30-second stale time
- Add real-time updates with refetchInterval
- Include error handling and loading states
- Add optimistic updates where appropriate
- Implement proper query invalidation

Please create the React Query hook following these guidelines.
```

#### Context API Implementation
```
You are implementing Context API for client state management in the Fantasy Football Companion App.

Context:
- Use Context API for user preferences and UI state
- Follow the state management strategy in /docs/2-Design/frontend.md

Requirements:
- Create a context for [STATE_TYPE]
- Implement proper TypeScript interfaces
- Add context provider with default values
- Create custom hook for context consumption
- Implement proper state updates and actions
- Add error handling and validation

Please create the context following these guidelines.
```

### Real-Time Updates

#### WebSocket Integration
```
You are implementing WebSocket integration for real-time updates in the Fantasy Football Companion App.

Context:
- Use Supabase real-time subscriptions
- Implement proper connection management
- Follow the real-time architecture in /docs/2-Design/frontend.md

Requirements:
- Create a WebSocket hook for [DATA_TYPE]
- Implement connection management and reconnection
- Add proper error handling and fallbacks
- Implement optimistic updates
- Add connection state monitoring
- Handle network interruptions gracefully

Please create the WebSocket hook following these guidelines.
```

### Mobile Optimization

#### Responsive Design
```
You are implementing responsive design for the Fantasy Football Companion App.

Context:
- Mobile-first design approach
- Use Tailwind CSS for responsive utilities
- Follow the mobile optimization guidelines in /docs/2-Design/frontend.md

Requirements:
- Implement responsive design for [COMPONENT_NAME]
- Use mobile-first approach with progressive enhancement
- Ensure touch-friendly interface (44px minimum touch targets)
- Optimize for mobile performance
- Test across different screen sizes
- Implement proper viewport handling

Please implement the responsive design following these guidelines.
```

#### PWA Features
```
You are implementing Progressive Web App (PWA) features for the Fantasy Football Companion App.

Context:
- Implement PWA capabilities for app-like experience
- Use service workers for offline functionality
- Follow the PWA architecture in /docs/2-Design/frontend.md

Requirements:
- Implement service worker for [FUNCTIONALITY]
- Add offline functionality and caching
- Implement push notifications
- Add app installation prompts
- Optimize for app-like experience
- Implement background sync

Please implement the PWA features following these guidelines.
```

### Performance Optimization

#### Component Optimization
```
You are optimizing React components for performance in the Fantasy Football Companion App.

Context:
- Optimize for mobile performance
- Use React optimization techniques
- Follow the performance guidelines in /docs/2-Design/frontend.md

Requirements:
- Optimize [COMPONENT_NAME] for performance
- Implement React.memo where appropriate
- Use useMemo and useCallback for expensive operations
- Optimize re-renders and state updates
- Implement virtual scrolling for large lists
- Add performance monitoring

Please optimize the component following these guidelines.
```

#### Bundle Optimization
```
You are optimizing the React application bundle for performance in the Fantasy Football Companion App.

Context:
- Optimize bundle size and loading performance
- Implement code splitting and lazy loading
- Follow the performance guidelines in /docs/2-Design/frontend.md

Requirements:
- Implement code splitting for [FEATURE]
- Add lazy loading for components
- Optimize bundle size
- Implement proper loading states
- Add performance monitoring
- Optimize asset loading

Please implement the bundle optimization following these guidelines.
```

### Testing

#### Component Testing
```
You are writing tests for React components in the Fantasy Football Companion App.

Context:
- Use Jest and React Testing Library
- Follow the testing guidelines in /docs/2-Design/frontend.md
- Test component behavior and user interactions

Requirements:
- Write tests for [COMPONENT_NAME]
- Test component rendering and props
- Test user interactions and events
- Test error states and edge cases
- Test accessibility features
- Add proper test coverage

Please write the tests following these guidelines.
```

#### Integration Testing
```
You are writing integration tests for the Fantasy Football Companion App frontend.

Context:
- Test component integration and data flow
- Use Jest and React Testing Library
- Follow the testing guidelines in /docs/2-Design/frontend.md

Requirements:
- Write integration tests for [FEATURE]
- Test component integration and data flow
- Test API integration and error handling
- Test real-time updates and WebSocket connections
- Test user workflows and interactions
- Add proper test coverage

Please write the integration tests following these guidelines.
```

### Accessibility

#### Accessibility Implementation
```
You are implementing accessibility features for the Fantasy Football Companion App.

Context:
- Follow WCAG 2.1 AA guidelines
- Implement proper ARIA labels and roles
- Follow the accessibility guidelines in /docs/2-Design/frontend.md

Requirements:
- Implement accessibility for [COMPONENT_NAME]
- Add proper ARIA labels and roles
- Implement keyboard navigation
- Add screen reader support
- Test with accessibility tools
- Ensure color contrast compliance

Please implement the accessibility features following these guidelines.
```

### Error Handling

#### Error Boundary Implementation
```
You are implementing error boundaries for the Fantasy Football Companion App.

Context:
- Implement proper error handling and recovery
- Follow the error handling guidelines in /docs/2-Design/frontend.md

Requirements:
- Create error boundary for [COMPONENT_NAME]
- Implement proper error logging and reporting
- Add user-friendly error messages
- Implement error recovery mechanisms
- Add fallback UI components
- Test error scenarios

Please implement the error boundary following these guidelines.
```

## Development Workflow

### Code Review Checklist
- [ ] Component follows established architecture
- [ ] TypeScript types are properly defined
- [ ] Mobile-first responsive design implemented
- [ ] Accessibility features included
- [ ] Error handling implemented
- [ ] Performance optimizations applied
- [ ] Tests written and passing
- [ ] Documentation updated

### Testing Checklist
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Accessibility tests passing
- [ ] Performance tests passing
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed
- [ ] Error scenario testing completed

### Deployment Checklist
- [ ] Code review completed
- [ ] Tests passing
- [ ] Performance optimized
- [ ] Accessibility verified
- [ ] Mobile testing completed
- [ ] Documentation updated
- [ ] Ready for deployment
