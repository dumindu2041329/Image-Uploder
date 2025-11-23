# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
React 19 + TypeScript image uploader with Parse (Back4App) backend for authentication and image storage. Uses Vite for build tooling and Tailwind CSS for styling.

## Commands

### Development
```bash
npm run dev          # Start dev server at http://localhost:5173
npm run preview      # Preview production build locally
```

### Build
```bash
npm run build        # Build for production (outputs to dist/)
```

### Linting
```bash
npm run lint              # Run ESLint
npm run lint:dualite      # Run ESLint with Dualite config
npm run tsc:dualite       # Type check with Dualite tsconfig
```

Note: Use `yarn` instead of `npm` if the project has already been installed with Yarn.

## Architecture

### Parse Backend Integration
- **Parse initialization**: Must happen BEFORE any React code runs (see `src/main.tsx`)
- **Environment variables**: Required in `.env`:
  - `VITE_PARSE_APPLICATION_ID`
  - `VITE_PARSE_JAVASCRIPT_KEY`
- **Server URL**: Hard-coded to `https://parseapi.back4app.com/`
- **Safety checks**: Use `isParseInitialized()` helper before Parse operations to avoid crashes when credentials are missing

### Authentication Flow
- `AuthContext` wraps entire app and provides:
  - `user`: Current Parse.User or null
  - `isLoading`: Auth state loading status
  - `logout`: Async logout function
- Protected routes use `ProtectedRoute` component
- User persistence handled automatically by Parse SDK

### Image Upload Architecture
1. Client-side validation (file type, size limit 5MB)
2. Filename sanitization (removes invalid chars, replaces spaces with underscores)
3. Parse.File upload
4. Gallery object creation linking file to current user
5. Navigation back to home gallery on success

**Gallery Schema (Parse class):**
- `title`: string
- `imageFile`: Parse.File
- `user`: Pointer to _User

### Routing Structure
- `/` - Home (public gallery)
- `/login` - Login page
- `/signup` - Sign up page
- `/upload` - Upload page (protected route, requires authentication)

### UI Components
- Component library in `src/components/ui/` (button, card, dialog, input, label, password-input)
- Custom toast notifications via `use-toast` hook
- Theme toggle for dark/light mode (ThemeToggle component)
- All UI uses Tailwind CSS with `class-variance-authority` for variants

### Key Libraries
- **Parse SDK** (`parse`): Backend as a Service for auth and data
- **React Hook Form** + **Zod**: Form validation
- **React Router DOM v7**: Client-side routing
- **Lucide React**: Icon library
- **Vite**: Build tool with code-splitting configured (see `vite.config.ts`)

## Important Notes

### Parse Initialization Order
Always import `'./lib/parse'` before any React components in entry files. The Parse SDK must be initialized before any component tries to use it.

### File Uploads
- Sanitize filenames before creating Parse.File objects
- Parse.File requires authenticated user
- Max upload size enforced client-side at 5MB
- Only JPEG and PNG accepted

### Environment Configuration
The app checks for valid Parse credentials and degrades gracefully if missing. Never commit real credentials to version control.

### Build Configuration
- Manual chunk splitting configured in `vite.config.ts` to optimize bundle size
- `lucide-react` excluded from optimization to prevent dev server issues
- `events` polyfill aliased for Parse SDK compatibility

### Deployment
Configured for Netlify deployment via `netlify.toml`:
- Build command: `npm install && npm run build`
- Publish directory: `dist/`
- Node version: 18
- Environment variables must be set in Netlify dashboard
