# 🎯 Axios Mock Implementation Guide

## Overview

This project now uses a **frontend-only axios implementation** with mock data instead of backend APIs. This approach allows you to develop and test the frontend functionality without setting up complex backend infrastructure.

## 🚀 What's Included

### ✅ **Mock API Services** (`src/lib/api.ts`)

- **Authentication API** - Login/logout with demo credentials
- **Admin API** - User management with mock data
- **Location API** - Ready for location management
- **Crime Data API** - Ready for crime reporting
- **Analytics API** - Ready for dashboard statistics

### ✅ **React Hooks** (`src/hooks/useApi.ts`)

- `useApi` - Generic hook for API operations
- `useAsyncOperation` - Hook for complex async operations
- `useFormSubmit` - Hook for form submissions

### ✅ **Mock Data & Authentication**

- Pre-configured demo users with different roles
- localStorage-based authentication
- Simulated API delays for realistic testing
- Error handling and loading states

## 🔑 Demo Credentials

```typescript
// Available demo accounts:
admin@crimewatch.id / admin123 (admin role)
gov@example.com / password123 (pemerintah role)
police@example.com / password123 (polri role)
tourism@example.com / password123 (manajer_wisata role)
```

## 🛠️ How to Use

### 1. **Login & Authentication**

```typescript
import { authApi } from "@/lib/api";

// Login
const loginData = {
  email: "admin@crimewatch.id",
  password: "admin123",
  role: "admin",
};

try {
  const result = await authApi.login(loginData);
  console.log("Login successful:", result);
} catch (error) {
  console.error("Login failed:", error);
}

// Logout
authApi.logout();
```

### 2. **Using React Hooks**

```typescript
import { useApi } from "@/hooks/useApi";
import { adminApi } from "@/lib/api";

function UserManagement() {
  const { execute: getUsers, loading, error, data } = useApi(adminApi.getUsers);

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users ({data?.users?.length})</h2>
      {data?.users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 3. **Creating New Users**

```typescript
import { adminApi, CreateUserData } from "@/lib/api";

const newUser: CreateUserData = {
  email: "new@example.com",
  password: "password123",
  name: "New User",
  role: "pemerintah",
  organization: "Test Organization",
};

try {
  const result = await adminApi.createUser(newUser);
  console.log("User created:", result.user);
} catch (error) {
  console.error("Failed to create user:", error);
}
```

### 4. **Error Handling**

```typescript
import { handleApiError } from "@/lib/api";

try {
  await someApiCall();
} catch (error) {
  const errorMessage = handleApiError(error);
  alert(errorMessage); // User-friendly error message
}
```

## 📋 Available API Methods

### Authentication

```typescript
await authApi.login(credentials); // Login with demo credentials
await authApi.testConnection(); // Test external API connection
authApi.logout(); // Logout and clear session
```

### Admin Operations

```typescript
await adminApi.getUsers(); // Get all users
await adminApi.createUser(userData); // Create new user
await adminApi.updateUserStatus({ userId, status }); // Update user status
await adminApi.initializeDatabase(); // Initialize mock data
```

### Locations (Ready for implementation)

```typescript
await locationApi.getLocations();
await locationApi.createLocation(data);
await locationApi.updateLocation(id, data);
await locationApi.deleteLocation(id);
```

### Crime Data (Ready for implementation)

```typescript
await crimeDataApi.getCrimeData(params);
await crimeDataApi.createCrimeReport(data);
await crimeDataApi.exportData("csv");
await crimeDataApi.importData(file);
```

### Analytics (Ready for implementation)

```typescript
await analyticsApi.getDashboardStats();
await analyticsApi.getPredictions(params);
await analyticsApi.getRecommendations(locationId);
await analyticsApi.getHeatmapData(params);
```

## 🎨 Features

### **🔄 Realistic API Simulation**

- Simulated network delays
- Loading states and error handling
- Proper TypeScript interfaces
- Consistent response formats

### **🔒 Mock Authentication**

- localStorage-based token storage
- Role-based access control
- Automatic token management
- Login/logout functionality

### **🛡️ Error Handling**

- Centralized error handling
- User-friendly error messages
- Automatic retry mechanisms
- Graceful degradation

### **⚡ Performance**

- Request/response interceptors
- Optimistic updates
- Loading state management
- Caching strategies ready

## 🧪 Testing Your Implementation

### 1. **Test Login Flow**

```bash
# Visit: http://localhost:3000/login
# Use any demo credentials listed above
```

### 2. **Test Admin Dashboard**

```bash
# After logging in as admin: http://localhost:3000/admin
# Test user creation, status updates, etc.
```

### 3. **Test API Endpoints**

```bash
# Visit: http://localhost:3000/api-test
# Interactive testing interface for all APIs
```

## 🔧 Customization

### **Adding New Mock Data**

```typescript
// In src/lib/api.ts, update MOCK_USERS array
const MOCK_USERS = [
  // Add your custom users here
  {
    id: "5",
    email: "custom@example.com",
    name: "Custom User",
    role: "custom_role",
    organization: "Custom Org",
    status: "active",
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];
```

### **Adding New API Endpoints**

```typescript
// Create new API service
export const customApi = {
  getData: async (): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: "Custom data" },
      message: "Data retrieved successfully",
    };
  },
};
```

### **Customizing Authentication**

```typescript
// Update DEMO_CREDENTIALS in src/lib/api.ts
const DEMO_CREDENTIALS = {
  "your@email.com": { password: "yourPassword", role: "yourRole" },
};
```

## 🚀 Benefits of Mock Implementation

✅ **No Backend Required** - Develop frontend without server setup  
✅ **Fast Development** - No API delays or server issues  
✅ **Consistent Testing** - Predictable data and responses  
✅ **Offline Development** - Work without internet connection  
✅ **Easy Debugging** - Full control over data and responses  
✅ **Rapid Prototyping** - Quick iterations and testing

## 🔄 Migrating to Real Backend

When ready to connect to a real backend:

1. **Update Base URL**

```typescript
const api = axios.create({
  baseURL: "https://your-api.com/api", // Update this
  // ... rest of config
});
```

2. **Replace Mock Functions**

```typescript
// Replace mock implementations with real API calls
export const authApi = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
};
```

3. **Update Authentication**

```typescript
// Use real JWT token verification
function getUserFromToken(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}
```

## 📚 Resources

- **Axios Documentation**: https://axios-http.com/
- **React Hooks Guide**: https://react.dev/reference/react
- **TypeScript Guide**: https://www.typescriptlang.org/docs/

---

## 🎉 Your axios implementation is now ready for frontend development!

The mock system provides a complete API simulation that allows you to develop, test, and demonstrate your frontend functionality without backend complexity.
