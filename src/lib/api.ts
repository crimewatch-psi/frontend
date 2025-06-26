import axios, { AxiosResponse } from "axios";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

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
      // Clear auth cookie and redirect to login
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

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  logout: () => {
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  },

  testConnection: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get("/test-db");
    return response.data;
  },
};

// Admin API
export const adminApi = {
  // User Management
  getUsers: async (): Promise<UsersResponse> => {
    const response: AxiosResponse<UsersResponse> = await api.get(
      "/admin/users"
    );
    return response.data;
  },

  createUser: async (userData: CreateUserData): Promise<CreateUserResponse> => {
    const response: AxiosResponse<CreateUserResponse> = await api.post(
      "/admin/users",
      userData
    );
    return response.data;
  },

  updateUserStatus: async (
    data: UpdateUserStatusData
  ): Promise<CreateUserResponse> => {
    const response: AxiosResponse<CreateUserResponse> = await api.put(
      "/admin/users",
      data
    );
    return response.data;
  },

  initializeDatabase: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/admin/init-db"
    );
    return response.data;
  },
};

// Location API (for future use)
export const locationApi = {
  getLocations: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get("/locations");
    return response.data;
  },

  createLocation: async (locationData: any): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/locations",
      locationData
    );
    return response.data;
  },

  updateLocation: async (
    id: string,
    locationData: any
  ): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.put(
      `/locations/${id}`,
      locationData
    );
    return response.data;
  },

  deleteLocation: async (id: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(
      `/locations/${id}`
    );
    return response.data;
  },
};

// Crime Data API (for future use)
export const crimeDataApi = {
  getCrimeData: async (params?: any): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get("/crime-data", {
      params,
    });
    return response.data;
  },

  createCrimeReport: async (reportData: any): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(
      "/crime-data",
      reportData
    );
    return response.data;
  },

  updateCrimeReport: async (
    id: string,
    reportData: any
  ): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.put(
      `/crime-data/${id}`,
      reportData
    );
    return response.data;
  },

  deleteCrimeReport: async (id: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(
      `/crime-data/${id}`
    );
    return response.data;
  },

  exportData: async (format: "csv" | "json" | "excel"): Promise<Blob> => {
    const response = await api.get(`/crime-data/export?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  },

  importData: async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response: AxiosResponse<ApiResponse> = await api.post(
      "/crime-data/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

// Analytics API (for future use)
export const analyticsApi = {
  getDashboardStats: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(
      "/analytics/dashboard"
    );
    return response.data;
  },

  getPredictions: async (params?: any): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(
      "/analytics/predictions",
      { params }
    );
    return response.data;
  },

  getRecommendations: async (locationId?: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(
      "/analytics/recommendations",
      {
        params: { locationId },
      }
    );
    return response.data;
  },

  getHeatmapData: async (params?: any): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(
      "/analytics/heatmap",
      { params }
    );
    return response.data;
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
