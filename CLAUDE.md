# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bimi Admin Dashboard - A React-based web application for Program Managers to manage fiscal datasets for BudgIT's AI backend (Bimi) that powers a chatbot for Nigerian fiscal data analysis.

## Commands

```bash
# Development
npm run dev      # Start development server at http://localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build

# Code Quality
npm run lint     # Run ESLint
npm run test     # Run Jest tests
```

## Architecture

### Tech Stack
- **Frontend**: React 19.1.0 + Vite 7.0.0
- **UI**: Material-UI 7.1.2
- **State Management**: React Query 5.81.2 + Context API for auth
- **HTTP Client**: Axios 1.10.0
- **Testing**: Jest 30.0.2 + React Testing Library

### Key Patterns

1. **Authentication Flow**
   - JWT token-based auth stored in `AuthContext` and localStorage as `bimi_token`
   - All API requests require `Authorization: Bearer ${token}` header
   - Login endpoint: `/api/accounts/login/` returns `access_token`
   - Auth state managed by `useAuth()` hook

2. **API Integration** 
   - Base URL: `https://bimixapi.budgit.org` (hardcoded in `src/api/index.js`)
   - API docs: https://bimixapi.budgit.org/docs
   - Centralized API functions in `src/api/index.js`
   - File uploads use FormData for multipart requests

3. **Data Fetching**
   - React Query hooks in `src/hooks/` for all data operations
   - Query keys include auth token for cache isolation
   - Automatic cache invalidation on mutations
   - Example: `useUploads()`, `useUploadFile()`, `useDeleteUpload()`

4. **Component Structure**
   ```
   App.jsx → AuthProvider → QueryClientProvider → 
     ├── LoginPage (unauthenticated)
     └── DashboardApp (authenticated)
         ├── Sidebar
         ├── AppBar
         └── Main Content (UploadDataset, ManageDatasets)
   ```

5. **File Upload Requirements**
   - Supported formats: CSV, Excel (.xlsx, .xls), JSON
   - Required fields: file, data_description, table_name
   - Optional: columns array with name and description

## Development Guidelines

1. **API Calls**: Always use the functions in `src/api/index.js` and create React Query hooks for new endpoints
2. **Authentication**: Check auth status with `useAuth()` hook, never access localStorage directly
3. **UI Components**: Use Material-UI components, maintain theme colors (#0F4C5C primary)
4. **Error Handling**: React Query handles loading/error states - use them in components
5. **Testing**: Write tests in `__tests__` directories using React Testing Library patterns

## Important Notes

- No environment variables needed - API URL is hardcoded
- Token refresh endpoint exists but not implemented - consider adding auto-refresh
- No routing library - app is single page with conditional rendering
- Material-UI DataGrid used for table displays with built-in sorting/filtering