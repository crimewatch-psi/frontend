# CrimeWatch Middleware Authentication System

This middleware system differentiates between 4 types of users with specific access permissions.

## User Roles

### 1. Pemerintah (Government)

- **Purpose**: Input current crime data
- **Access**: Dashboard, input forms, crime data management
- **Routes**: `/`, `/dashboard`, `/input-data`, `/crime-data`, `/profile`

### 2. Polri (Police)

- **Purpose**: Input current crime data
- **Access**: Dashboard, input forms, crime data management
- **Routes**: `/`, `/dashboard`, `/input-data`, `/crime-data`, `/profile`

### 3. Manajer Wisata (Tourism Manager)

- **Purpose**: Get predictions and recommendations from processed data
- **Access**: Dashboard, analytics, predictions, reports
- **Routes**: `/`, `/dashboard`, `/predictions`, `/recommendations`, `/analytics`, `/reports`, `/profile`

### 4. Regular User

- **Purpose**: View heatmap and data
- **Access**: Only landing page
- **Routes**: `/` (landing page only)

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install jsonwebtoken @types/jsonwebtoken
   ```

2. **Environment Variables**
   Create a `.env.local` file:

   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **Demo Accounts**
   The system includes these demo accounts:
   - **Pemerintah**: `gov@example.com` / `password123`
   - **Polri**: `police@example.com` / `password123`
   - **Manajer Wisata**: `tourism@example.com` / `password123`
   - **Regular User**: `user@example.com` / `password123`

## How It Works

### Middleware (`middleware.ts`)

- Runs on every request except public routes
- Validates JWT tokens from cookies or Authorization header
- Checks user permissions against route requirements
- Redirects unauthorized users to appropriate pages
- Adds user info to request headers for use in pages

### Authentication Flow

1. User logs in via `/login` with email, password, and role
2. API validates credentials and returns JWT token
3. Token is stored in HTTP-only cookie
4. Middleware validates token on each request
5. User info is made available to pages via headers

### Route Protection

- **Public routes**: `/`, `/login`, `/register`, API routes
- **Protected routes**: All others require valid authentication
- **Role-based access**: Each role has specific allowed routes
- **Automatic redirects**: Unauthorized access redirects based on role

### Usage in Components

```typescript
import { getCurrentUser, canInputCrimeData } from "@/lib/auth";

export default async function MyPage() {
  const user = await getCurrentUser();

  if (canInputCrimeData(user)) {
    // Show crime data input form
  }

  return <div>Content based on user role</div>;
}
```

## File Structure

```
├── middleware.ts                     # Main middleware logic
├── src/
│   ├── app/
│   │   ├── login/page.tsx           # Login page
│   │   ├── register/page.tsx        # Register page
│   │   └── api/auth/
│   │       ├── login/route.ts       # Login API
│   │       └── register/route.ts    # Register API
│   └── lib/
│       └── auth.ts                  # Authentication utilities
```

## Security Considerations

⚠️ **For Production Use**:

1. Replace mock user database with real database
2. Hash passwords with bcrypt
3. Use secure JWT secrets
4. Implement proper session management
5. Add rate limiting
6. Use HTTPS only
7. Implement CSRF protection
8. Add input validation and sanitization

## Extending the System

To add new roles or modify permissions:

1. **Add new role** in `middleware.ts`:

   ```typescript
   export enum UserRole {
     // ... existing roles
     NEW_ROLE = "new_role",
   }
   ```

2. **Define permissions** in `rolePermissions` object

3. **Update auth utilities** in `src/lib/auth.ts`

4. **Add demo users** in API routes (or database)

## Testing

Test the middleware by:

1. Visiting `/login` and trying different user accounts
2. Attempting to access restricted routes without authentication
3. Logging in with different roles and testing route access
4. Verifying redirects work correctly for unauthorized access
