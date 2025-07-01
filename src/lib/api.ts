import axios, { AxiosResponse } from "axios";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // Using JSONPlaceholder for demo
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@crimewatch.id",
    name: "System Administrator",
    role: "admin",
    organization: "CrimeWatch HQ",
    location: "https://maps.google.com/?q=Yogyakarta+City+Hall",
    status: "active",
    last_login: "2024-01-15T10:30:00Z",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "gov@example.com",
    name: "Government Official",
    role: "pemerintah",
    organization: "Yogyakarta Government",
    location: "https://maps.google.com/?q=Yogyakarta+Government+Office",
    status: "active",
    last_login: "2024-01-14T16:45:00Z",
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    email: "police@example.com",
    name: "Police Officer",
    role: "polri",
    organization: "Yogyakarta Police",
    location: "https://maps.google.com/?q=Yogyakarta+Police+Station",
    status: "active",
    last_login: "2024-01-13T09:15:00Z",
    created_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    email: "tourism@example.com",
    name: "Tourism Manager",
    role: "manajer_wisata",
    organization: "Borobudur Tourism Board",
    status: "inactive",
    last_login: null,
    created_at: "2024-01-04T00:00:00Z",
  },
];

const DEMO_CREDENTIALS = {
  "admin@crimewatch.id": { password: "admin123", role: "admin" },
  "gov@example.com": { password: "password123", role: "pemerintah" },
  "police@example.com": { password: "password123", role: "polri" },
  "tourism@example.com": { password: "password123", role: "manajer_wisata" },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage for demo
    const token = localStorage.getItem("demo-auth-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth token and redirect to login
      localStorage.removeItem("demo-auth-token");
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Types
export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organization: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
  location?: string;
  status: string;
  last_login: string | null;
  created_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: string;
  organization: string;
  location?: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface CreateUserResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface UpdateUserStatusData {
  userId: string;
  status: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Mock authentication API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { email, password, role } = credentials;
    const demoUser = DEMO_CREDENTIALS[email as keyof typeof DEMO_CREDENTIALS];

    if (!demoUser || demoUser.password !== password || demoUser.role !== role) {
      throw new Error("Invalid credentials");
    }

    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate a mock JWT token
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem("demo-auth-token", token);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
      },
    };
  },

  logout: () => {
    localStorage.removeItem("demo-auth-token");
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  },

  testConnection: async (): Promise<ApiResponse> => {
    // Simulate testing external API connection
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Make a simple request to JSONPlaceholder to test connection
      await api.get("/posts/1");
      return {
        success: true,
        message: "External API connection successful",
        data: { timestamp: new Date().toISOString() },
      };
    } catch (error) {
      throw new Error("Connection test failed");
    }
  },
};

// Mock admin API
export const adminApi = {
  // User Management
  getUsers: async (): Promise<UsersResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if user is admin (mock check)
    const token = localStorage.getItem("demo-auth-token");
    if (!token) {
      throw new Error("Unauthorized");
    }

    return {
      success: true,
      users: [...MOCK_USERS],
    };
  },

  createUser: async (userData: CreateUserData): Promise<CreateUserResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const newUser: User = {
      id: `${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      organization: userData.organization,
      location: userData.location,
      status: "active",
      last_login: null,
      created_at: new Date().toISOString(),
    };

    // Add to mock data (in real app, this would be persistent)
    MOCK_USERS.push(newUser);

    return {
      success: true,
      user: newUser,
      message: "User created successfully",
    };
  },

  updateUserStatus: async (
    data: UpdateUserStatusData
  ): Promise<CreateUserResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const userIndex = MOCK_USERS.findIndex((u) => u.id === data.userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Update user status
    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      status: data.status,
    };

    return {
      success: true,
      user: MOCK_USERS[userIndex],
      message: "User status updated successfully",
    };
  },

  initializeDatabase: async (): Promise<ApiResponse> => {
    // Simulate database initialization
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      message: "Mock database initialized with demo data",
      data: { usersCount: MOCK_USERS.length },
    };
  },
};

// Location API (mock implementation for future use)
export const locationApi = {
  getLocations: async (): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockLocations = [
      {
        id: "1",
        name: "Borobudur Temple",
        type: "tourist_attraction",
        status: "active",
      },
      {
        id: "2",
        name: "Malioboro Street",
        type: "shopping_area",
        status: "active",
      },
      {
        id: "3",
        name: "Prambanan Temple",
        type: "tourist_attraction",
        status: "active",
      },
    ];

    return {
      success: true,
      data: mockLocations,
      message: "Locations retrieved successfully",
    };
  },

  createLocation: async (locationData: any): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      data: { id: Date.now().toString(), ...locationData },
      message: "Location created successfully",
    };
  },

  updateLocation: async (
    id: string,
    locationData: any
  ): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      success: true,
      data: { id, ...locationData },
      message: "Location updated successfully",
    };
  },

  deleteLocation: async (id: string): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      message: "Location deleted successfully",
    };
  },
};

// Crime Data API (mock implementation for future use)
export const crimeDataApi = {
  getCrimeData: async (params?: any): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const mockCrimeData = [
      {
        id: "1",
        type: "theft",
        location: "Borobudur",
        date: "2024-01-10",
        severity: "low",
      },
      {
        id: "2",
        type: "vandalism",
        location: "Malioboro",
        date: "2024-01-12",
        severity: "medium",
      },
      {
        id: "3",
        type: "fraud",
        location: "Prambanan",
        date: "2024-01-14",
        severity: "high",
      },
    ];

    return {
      success: true,
      data: mockCrimeData,
      message: "Crime data retrieved successfully",
    };
  },

  createCrimeReport: async (reportData: any): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      data: { id: Date.now().toString(), ...reportData },
      message: "Crime report created successfully",
    };
  },

  updateCrimeReport: async (
    id: string,
    reportData: any
  ): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      data: { id, ...reportData },
      message: "Crime report updated successfully",
    };
  },

  deleteCrimeReport: async (id: string): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      message: "Crime report deleted successfully",
    };
  },

  exportData: async (format: "csv" | "json" | "excel"): Promise<Blob> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create mock export data
    const mockData = `Crime Data Export (${format})\nGenerated: ${new Date().toISOString()}\n\nThis is mock export data.`;
    return new Blob([mockData], { type: "text/plain" });
  },

  importData: async (file: File): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      message: `Mock import completed for file: ${file.name}`,
      data: { recordsImported: 15 },
    };
  },
};

// Analytics API (mock implementation for future use)
export const analyticsApi = {
  getDashboardStats: async (): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const mockStats = {
      totalCrimes: 156,
      thisMouth: 23,
      lastMonth: 31,
      highRiskAreas: 5,
      activeAlerts: 3,
    };

    return {
      success: true,
      data: mockStats,
      message: "Dashboard stats retrieved successfully",
    };
  },

  getPredictions: async (params?: any): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const mockPredictions = [
      { location: "Borobudur", risk: "low", confidence: 0.87 },
      { location: "Malioboro", risk: "medium", confidence: 0.73 },
      { location: "Prambanan", risk: "high", confidence: 0.91 },
    ];

    return {
      success: true,
      data: mockPredictions,
      message: "Predictions generated successfully",
    };
  },

  getRecommendations: async (locationId?: string): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockRecommendations = [
      "Increase patrol frequency during peak hours",
      "Install additional security cameras",
      "Improve lighting in dark areas",
      "Setup emergency call stations",
    ];

    return {
      success: true,
      data: mockRecommendations,
      message: "Recommendations generated successfully",
    };
  },

  getHeatmapData: async (params?: any): Promise<ApiResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockHeatmapData = {
      coordinates: [
        { lat: -7.6079, lng: 110.2038, intensity: 0.8 }, // Borobudur
        { lat: -7.7956, lng: 110.3695, intensity: 0.6 }, // Malioboro
        { lat: -7.752, lng: 110.4915, intensity: 0.9 }, // Prambanan
      ],
    };

    return {
      success: true,
      data: mockHeatmapData,
      message: "Heatmap data retrieved successfully",
    };
  },
};

// Export the main axios instance for custom requests
export { api };

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};
