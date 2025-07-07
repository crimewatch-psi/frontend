import axios, { AxiosResponse } from "axios";

export const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    nama: string;
    email: string;
    role: string;
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

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post("/login", credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/logout");
      window.location.href = "/";
    } catch (error) {
      throw error;
    }
  },

  async checkSession(): Promise<{
    isAuthenticated: boolean;
    user?: LoginResponse["user"];
  }> {
    try {
      const response = await api.get("/session");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const adminApi = {
  async getUsers(): Promise<UsersResponse> {
    const response = await api.get("/admin/users");
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<CreateUserResponse> {
    const response = await api.post("/admin/users", userData);
    return response.data;
  },

  async updateUserStatus(
    data: UpdateUserStatusData
  ): Promise<CreateUserResponse> {
    const response = await api.patch(`/admin/users/${data.userId}/status`, {
      status: data.status,
    });
    return response.data;
  },
};

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

export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.error;
    if (errorMessage) {
      return errorMessage;
    }
    if (!error.response) {
      return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    }
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
};
