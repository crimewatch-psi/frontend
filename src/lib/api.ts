import axios, { AxiosResponse } from "axios";

export const API_BASE_URL =
  "https://crimewatch-be-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.log(
      `Making request to: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors and log responses
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(
      "Response error:",
      error.response?.status,
      error.response?.data
    );
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirecting to login");
      // Redirect to login page if unauthorized
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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
    status: string;
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
  nama: string;
  organization: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  message?: string;
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

export interface UpdateUserData {
  email?: string;
  nama?: string;
  organization?: string;
  location?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface HeatmapLocation {
  mapid?: number;
  nama_lokasi: string;
  latitude: number;
  longitude: number;
  gmaps_url: string;
  status?: string;
}

export interface CrimeData {
  id?: number;
  mapid: number;
  jenis_kejahatan: string;
  waktu: string;
  deskripsi?: string;
  nama_lokasi?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  nama: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nama: string;
    role: string;
    status: string;
  };
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log("🔐 FRONTEND LOGIN ATTEMPT:", {
        timestamp: new Date().toISOString(),
        email: credentials.email,
        documentCookie: document.cookie,
        userAgent: navigator.userAgent
      });

      const response = await api.post("/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("🔐 FRONTEND LOGIN RESPONSE:", {
        timestamp: new Date().toISOString(),
        success: !!response.data,
        documentCookie: document.cookie,
        responseHeaders: response.headers,
        setCookieHeader: response.headers['set-cookie']
      });

      return response.data;
    } catch (error: any) {
      console.error("🚨 FRONTEND LOGIN FAILED:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        documentCookie: document.cookie,
        timestamp: new Date().toISOString()
      });
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await api.post("/register", credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
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
  async registerManager(userData: CreateUserData): Promise<CreateUserResponse> {
    const response = await api.post("/admin/register-manager", userData);
    return response.data;
  },

  async getUsers(): Promise<UsersResponse> {
    const response = await api.get("/admin/users");
    return response.data;
  },

  async updateUser(
    userId: string,
    userData: UpdateUserData
  ): Promise<ApiResponse> {
    const response = await api.patch(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async updateUserStatus(userId: string, status: string): Promise<ApiResponse> {
    const response = await api.patch(`/admin/users/${userId}/status`, {
      status: status,
    });
    return response.data;
  },

  async uploadCrimeData(formData: FormData): Promise<ApiResponse> {
    const response = await api.post("/admin/kriminal/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Heatmap Location Management
  async getHeatmapLocations(): Promise<ApiResponse<HeatmapLocation[]>> {
    const response = await api.get("/admin/heatmap");
    return response.data;
  },

  async addHeatmapLocation(
    locationData: HeatmapLocation
  ): Promise<ApiResponse> {
    const response = await api.post("/admin/heatmap/upload", locationData);
    return response.data;
  },

  async uploadHeatmapCSV(formData: FormData): Promise<ApiResponse> {
    const response = await api.post("/admin/heatmap/upload-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updateHeatmapLocation(
    mapid: string,
    locationData: HeatmapLocation
  ): Promise<ApiResponse> {
    const response = await api.patch(`/admin/heatmap/${mapid}`, locationData);
    return response.data;
  },

  async deleteHeatmapLocation(mapid: string): Promise<ApiResponse> {
    const response = await api.delete(`/admin/heatmap/${mapid}`);
    return response.data;
  },

  async updateHeatmapLocationStatus(
    mapid: string,
    status: string
  ): Promise<ApiResponse> {
    const response = await api.patch(`/admin/heatmap/${mapid}/status`, {
      status,
    });
    return response.data;
  },

  // Crime Data Management
  async getCrimeData(): Promise<ApiResponse<CrimeData[]>> {
    const response = await api.get("/admin/kriminal");
    return response.data;
  },

  async addCrimeData(crimeData: CrimeData): Promise<ApiResponse> {
    const response = await api.post("/admin/kriminal/add", crimeData);
    return response.data;
  },

  async uploadCrimeCSV(formData: FormData): Promise<ApiResponse> {
    const response = await api.post("/admin/kriminal/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const uploadCrimeData = adminApi.uploadCrimeData;

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

export interface AnalyticsData {
  manager_info: {
    nama: string;
    organization: string;
    mapid: number;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  crime_summary: {
    total_crimes: number;
    nearby_locations: Array<{
      mapid: string;
      nama_lokasi: string;
      latitude: number;
      longitude: number;
      distance: number;
      crimes: Array<{
        id: number;
        jenis_kejahatan: string;
        waktu: string;
        deskripsi: string;
      }>;
    }>;
    crime_types: Record<string, number>;
    time_analysis: Record<string, number>;
    radius_km: number;
    analysis_date: string;
  };
  ai_analysis: {
    ringkasan: string;
    analisis_risiko: {
      tingkat_risiko: string;
      detail: string;
    };
    pola_kriminalitas: {
      tren: string;
      waktu_rawan: string;
      area_rawan: string;
    };
    dampak_bisnis: {
      langsung: string;
      tidak_langsung: string;
    };
    kesimpulan: string;
  };
  recommendations: string[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  error?: string;
}

export const managerApi = {
  async getAnalytics(signal?: AbortSignal): Promise<AnalyticsResponse> {
    try {
      const response = await api.get("/manager/analytics", { signal });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getProfile(): Promise<ApiResponse> {
    try {
      const response = await api.get("/manager/profile");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
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
