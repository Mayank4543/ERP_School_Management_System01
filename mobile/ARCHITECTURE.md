# Mobile App Architecture

## Overview

This document describes the architecture and design decisions for the School ERP Mobile App.

## Architecture Pattern

The app follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Screens, Components, Navigation)  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Business Logic Layer        │
│    (Contexts, Hooks, Services)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│          Data Access Layer           │
│      (API Client, Storage)          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         External Services           │
│    (Backend API, AsyncStorage)      │
└─────────────────────────────────────┘
```

## Key Design Decisions

### 1. Navigation
- **Expo Router**: File-based routing for simplicity
- **Role-based Tabs**: Different navigation structure per role
- **Stack Navigation**: For modal screens and details

### 2. State Management
- **React Context**: For global auth state
- **Local State**: For component-specific state
- **AsyncStorage**: For persistent storage (tokens, user data)

### 3. API Integration
- **Centralized Client**: Single axios instance with interceptors
- **Service Layer**: Separate service files per domain
- **Error Handling**: Centralized error handling in interceptors

### 4. Authentication
- **JWT Tokens**: Stored securely in AsyncStorage
- **Auto-refresh**: Token refresh on 401 errors
- **Protected Routes**: Navigation guards based on auth state

### 5. UI/UX
- **Material Design**: React Native Paper for consistency
- **Loading States**: Activity indicators for async operations
- **Error Messages**: User-friendly error handling
- **Pull to Refresh**: Standard pattern for list screens

## Folder Structure

```
mobile/
├── app/              # Screens (Expo Router)
├── contexts/         # React Contexts
├── services/         # API Services
├── types/            # TypeScript Types
├── theme/            # Theme Configuration
└── components/       # Reusable Components
```

## Data Flow

### Authentication Flow
```
Login Screen
    ↓
AuthService.login()
    ↓
API Client (with interceptors)
    ↓
Backend API
    ↓
Store token & user in AsyncStorage
    ↓
Update AuthContext
    ↓
Navigate to Dashboard
```

### Data Fetching Flow
```
Screen Component
    ↓
useEffect hook
    ↓
Service method (e.g., studentsService.getAttendance())
    ↓
API Client (adds token automatically)
    ↓
Backend API
    ↓
Update component state
    ↓
Render UI
```

## Security Considerations

1. **Token Storage**: Tokens stored in AsyncStorage (consider SecureStore for production)
2. **HTTPS**: All API calls should use HTTPS in production
3. **Token Expiration**: Handle token expiration gracefully
4. **Input Validation**: Validate user inputs before API calls
5. **Error Messages**: Don't expose sensitive information in errors

## Scalability

### Adding New Features
1. Create new service in `services/api/`
2. Add types in `types/index.ts`
3. Create screen in `app/(tabs)/`
4. Update navigation if needed

### Adding New Roles
1. Update `app/(tabs)/_layout.tsx` to add role-specific tabs
2. Create role-specific dashboard component
3. Add role-specific API endpoints

## Performance Optimization

1. **Lazy Loading**: Load screens on demand
2. **Caching**: Cache API responses where appropriate
3. **Image Optimization**: Use optimized images
4. **List Optimization**: Use FlatList for long lists
5. **Code Splitting**: Split code by routes

## Testing Strategy

1. **Unit Tests**: Test service functions
2. **Integration Tests**: Test API integration
3. **E2E Tests**: Test user flows
4. **Manual Testing**: Test on real devices

## Future Enhancements

1. **Offline Support**: Cache data for offline access
2. **Push Notifications**: Real-time notifications
3. **Biometric Auth**: Fingerprint/Face ID login
4. **Dark Mode**: Theme switching
5. **Internationalization**: Multi-language support



