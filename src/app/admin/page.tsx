"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Shield,
  UserPlus,
  Upload,
  UserCheck,
  UserX,
  Search,
  Edit2,
  Eye,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Database,
  Map,
  Plus,
  FileUp,
  Info,
} from "lucide-react";
import {
  adminApi,
  handleApiError,
  User as ApiUser,
  HeatmapLocation,
  CrimeData,
} from "@/lib/api";

export default function AdminDashboard() {
  useAdminGuard();

  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ApiUser[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Add this field
    name: "",
    role: "manager",
    organization: "",
    location: "",
    latitude: "",
    longitude: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    organization: "",
    location: "",
  });

  // Heatmap location states
  const [heatmapLocation, setHeatmapLocation] = useState<HeatmapLocation>({
    nama_lokasi: "",
    latitude: 0,
    longitude: 0,
    gmaps_url: "",
  });
  const [isSubmittingLocation, setIsSubmittingLocation] = useState(false);
  const [locationCSVFile, setLocationCSVFile] = useState<File | null>(null);
  const [isUploadingLocationCSV, setIsUploadingLocationCSV] = useState(false);

  // Crime data states
  const [crimeData, setCrimeData] = useState<CrimeData>({
    mapid: 0,
    jenis_kejahatan: "",
    waktu: "",
    deskripsi: "",
  });
  const [isSubmittingCrime, setIsSubmittingCrime] = useState(false);
  const [crimeCSVFile, setCrimeCSVFile] = useState<File | null>(null);
  const [isUploadingCrimeCSV, setIsUploadingCrimeCSV] = useState(false);
  const [heatmapLocations, setHeatmapLocations] = useState<HeatmapLocation[]>(
    []
  );
  const [allCrimeData, setAllCrimeData] = useState<CrimeData[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchHeatmapLocations();
    fetchCrimeData();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      if (response.success) {
        setUsers(response.users);
      } else {
        console.error("Failed to fetch users:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch users:", handleApiError(error));
    }
  };

  const fetchHeatmapLocations = async () => {
    try {
      const response = await adminApi.getHeatmapLocations();
      if (response.success && response.data) {
        setHeatmapLocations(response.data);
      }
    } catch (error) {
      console.error(
        "Failed to fetch heatmap locations:",
        handleApiError(error)
      );
    }
  };

  const fetchCrimeData = async () => {
    try {
      const response = await adminApi.getCrimeData();
      if (response.success && response.data) {
        setAllCrimeData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch crime data:", handleApiError(error));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if passwords match
      if (newUser.password !== newUser.confirmPassword) {
        toast.error("Password dan konfirmasi password tidak cocok");
        setIsLoading(false);
        return;
      }

      // Validate coordinates if provided
      if (newUser.latitude || newUser.longitude) {
        const lat = parseFloat(newUser.latitude);
        const lng = parseFloat(newUser.longitude);

        if (isNaN(lat) || lat < -90 || lat > 90) {
          toast.error("Latitude harus berada di antara -90 dan 90");
          setIsLoading(false);
          return;
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
          toast.error("Longitude harus berada di antara -180 dan 180");
          setIsLoading(false);
          return;
        }
      }

      const userData = {
        email: newUser.email,
        password: newUser.password,
        nama: newUser.name,
        organization: newUser.organization,
        location: newUser.location,
        latitude: newUser.latitude ? parseFloat(newUser.latitude) : undefined,
        longitude: newUser.longitude
          ? parseFloat(newUser.longitude)
          : undefined,
      };

      const response = await adminApi.registerManager(userData);

      if (response.success) {
        toast.success("Akun manager berhasil dibuat");
        await fetchUsers();
        setIsCreateDialogOpen(false);
        setNewUser({
          email: "",
          password: "",
          confirmPassword: "", // Reset this field too
          name: "",
          role: "manager",
          organization: "",
          location: "",
          latitude: "",
          longitude: "",
        });
      } else {
        toast.error(response.message || "Gagal membuat akun manager");
      }
    } catch (error) {
      console.error("Error creating manager:", error);
      toast.error("Gagal membuat akun manager. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const response = await adminApi.updateUser(selectedUser.id, {
        nama: editForm.name,
        email: editForm.email,
        organization: editForm.organization,
        location: editForm.location,
      });

      if (response.success) {
        toast.success("Data manager berhasil diperbarui");
        setIsEditDialogOpen(false);
        await fetchUsers();
      } else {
        toast.error(response.message || "Gagal memperbarui data manager");
      }
    } catch (error) {
      console.error("Error updating manager:", error);
      toast.error("Gagal memperbarui data manager");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await adminApi.updateUserStatus(userId, newStatus);

      if (response.success) {
        toast.success(
          `Status manager berhasil ${
            newStatus === "active" ? "diaktifkan" : "dinonaktifkan"
          }`
        );
        await fetchUsers();
      } else {
        toast.error(response.message || "Gagal mengubah status manager");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Gagal mengubah status manager");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        alert("Please select a CSV file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await adminApi.uploadCrimeData(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedFile(null);
          alert(`File uploaded successfully! ${response.message || ""}`);
        }, 500);
      } else {
        setIsUploading(false);
        setUploadProgress(0);
        alert(`Upload failed: ${response.error || "Unknown error"}`);
      }
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      alert("Upload failed: " + handleApiError(error));
    }
  };

  // Handle heatmap location form submission
  const handleHeatmapLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLocation(true);

    try {
      if (heatmapLocation.latitude < -90 || heatmapLocation.latitude > 90) {
        toast.error("Latitude harus berada di antara -90 dan 90");
        return;
      }
      if (heatmapLocation.longitude < -180 || heatmapLocation.longitude > 180) {
        toast.error("Longitude harus berada di antara -180 dan 180");
        return;
      }

      const response = await adminApi.addHeatmapLocation(heatmapLocation);

      if (response.success) {
        toast.success("Lokasi berhasil ditambahkan");
        setHeatmapLocation({
          nama_lokasi: "",
          latitude: 0,
          longitude: 0,
          gmaps_url: "",
        });
        fetchHeatmapLocations();
      } else {
        toast.error(response.message || "Gagal menambahkan lokasi");
      }
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error(handleApiError(error));
    } finally {
      setIsSubmittingLocation(false);
    }
  };

  // Handle crime data form submission
  const handleCrimeDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCrime(true);

    try {
      const response = await adminApi.addCrimeData(crimeData);

      if (response.success) {
        toast.success("Data kriminal berhasil ditambahkan");
        setCrimeData({
          mapid: 0,
          jenis_kejahatan: "",
          waktu: "",
          deskripsi: "",
        });
      } else {
        toast.error(response.message || "Gagal menambahkan data kriminal");
      }
    } catch (error) {
      console.error("Error adding crime data:", error);
      toast.error(handleApiError(error));
    } finally {
      setIsSubmittingCrime(false);
    }
  };

  // Handle location CSV upload
  const handleLocationCSVUpload = async () => {
    if (!locationCSVFile) {
      toast.error("Pilih file CSV terlebih dahulu");
      return;
    }

    setIsUploadingLocationCSV(true);
    try {
      const formData = new FormData();
      formData.append("file", locationCSVFile);

      const response = await adminApi.uploadHeatmapCSV(formData);

      if (response.success) {
        toast.success(response.message);
        setLocationCSVFile(null);
        fetchHeatmapLocations();
      } else {
        toast.error(response.error || "Gagal upload file");
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsUploadingLocationCSV(false);
    }
  };

  const handleCrimeCSVUpload = async () => {
    if (!crimeCSVFile) {
      toast.error("Pilih file CSV terlebih dahulu");
      return;
    }

    setIsUploadingCrimeCSV(true);
    try {
      const formData = new FormData();
      formData.append("file", crimeCSVFile);

      const response = await adminApi.uploadCrimeCSV(formData);

      if (response.success) {
        toast.success(response.message);
        setCrimeCSVFile(null);
      } else {
        toast.error(response.error || "Gagal upload file");
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsUploadingCrimeCSV(false);
    }
  };

  const openEditDialog = (user: ApiUser) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      organization: user.organization,
      location: user.location || "",
    });
    setIsEditDialogOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "manager":
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600">
              Kelola akun manager dan data sistem CrimeWatch
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Manager
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredUsers.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {filteredUsers.filter((u) => u.status === "active").length}{" "}
                    aktif
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Lokasi
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {heatmapLocations.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {
                      heatmapLocations.filter((h) => h.status === "aktif")
                        .length
                    }{" "}
                    aktif
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Map className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Data Kriminal
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {allCrimeData.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date().toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Lokasi Heatmap
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Nama Lokasi
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Koordinat
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {heatmapLocations.map((location) => (
                      <tr key={location.mapid} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <a
                              href={location.gmaps_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {location.nama_lokasi}
                            </a>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {location.latitude}, {location.longitude}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              location.status === "aktif"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              location.status === "aktif"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }
                          >
                            {location.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Data Kriminal
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Jenis Kejahatan
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Lokasi
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allCrimeData.map((crime) => (
                      <tr key={crime.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                            {crime.jenis_kejahatan}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {crime.nama_lokasi}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(crime.waktu).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Akun Manager</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Kelola Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari manager berdasarkan nama, email, atau organisasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Akun Manager</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Menampilkan {filteredUsers.length} dari {users.length}{" "}
                      manager
                    </p>
                  </div>
                  <Button
                    className="bg-black hover:bg-gray-800"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tambah Manager
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      Tidak ada manager
                    </p>
                    <p className="text-sm">Coba atur pencarian atau filter</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                            Manager
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                            Lokasi
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                            Status Aktivitas
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                            Aktivitas Terakhir
                          </th>
                          <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  {getRoleIcon(user.role)}
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.organization}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                <div className="text-sm text-gray-600">
                                  {user.location ? (
                                    <a
                                      href={user.location}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      Lihat Lokasi
                                    </a>
                                  ) : (
                                    <span className="text-gray-400">
                                      Tidak disediakan
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                {user.status === "active" ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                                )}
                                <Badge
                                  variant={
                                    user.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                                    user.status === "active"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-gray-100 text-gray-600 border-gray-200"
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-1" />
                                {user.last_login
                                  ? new Date(
                                      user.last_login
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "Never"}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  title="Edit Manager"
                                  onClick={() => openEditDialog(user)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`h-8 w-8 p-0 ${
                                    user.status === "active"
                                      ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                      : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                  }`}
                                  onClick={() =>
                                    handleToggleUserStatus(
                                      user.id,
                                      user.status === "active"
                                        ? "inactive"
                                        : "active"
                                    )
                                  }
                                  title={
                                    user.status === "active"
                                      ? "Nonaktifkan Manager"
                                      : "Aktifkan Manager"
                                  }
                                >
                                  {user.status === "active" ? (
                                    <UserX className="w-4 h-4" />
                                  ) : (
                                    <UserCheck className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Tambah Lokasi Manual</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Tambahkan satu lokasi secara manual
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <form
                    onSubmit={handleHeatmapLocationSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lokasi
                      </label>
                      <Input
                        required
                        value={heatmapLocation.nama_lokasi}
                        onChange={(e) =>
                          setHeatmapLocation({
                            ...heatmapLocation,
                            nama_lokasi: e.target.value,
                          })
                        }
                        placeholder="Contoh: Malioboro"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latitude
                        </label>
                        <Input
                          type="number"
                          required
                          step="any"
                          value={heatmapLocation.latitude}
                          onChange={(e) =>
                            setHeatmapLocation({
                              ...heatmapLocation,
                              latitude: parseFloat(e.target.value),
                            })
                          }
                          placeholder="-7.7956"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitude
                        </label>
                        <Input
                          type="number"
                          required
                          step="any"
                          value={heatmapLocation.longitude}
                          onChange={(e) =>
                            setHeatmapLocation({
                              ...heatmapLocation,
                              longitude: parseFloat(e.target.value),
                            })
                          }
                          placeholder="110.3695"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Google Maps
                      </label>
                      <Input
                        type="url"
                        required
                        value={heatmapLocation.gmaps_url}
                        onChange={(e) =>
                          setHeatmapLocation({
                            ...heatmapLocation,
                            gmaps_url: e.target.value,
                          })
                        }
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-gray-800"
                      disabled={isSubmittingLocation}
                    >
                      {isSubmittingLocation ? "Menyimpan..." : "Tambah Lokasi"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* CSV Location Upload */}
              <Card className="shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileUp className="w-5 h-5" />
                    <span>Upload Lokasi CSV</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Upload banyak lokasi sekaligus dengan file CSV
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) =>
                          setLocationCSVFile(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="location-csv-upload"
                      />
                      <label
                        htmlFor="location-csv-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih File CSV
                      </label>
                      {locationCSVFile && (
                        <p className="text-sm text-gray-600 mt-2">
                          File: {locationCSVFile.name}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        <strong>Format CSV:</strong>
                      </p>
                      <p>nama_lokasi, latitude, longitude, gmaps_url</p>
                      <p>
                        Contoh:
                        "Malioboro",-7.7956,110.3695,"https://maps.google.com/..."
                      </p>
                    </div>

                    <Button
                      onClick={handleLocationCSVUpload}
                      disabled={!locationCSVFile || isUploadingLocationCSV}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isUploadingLocationCSV
                        ? "Mengupload..."
                        : "Upload CSV Lokasi"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Crime Data Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Manual Crime Data Input */}
              <Card className="shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Tambah Data Kriminal Manual</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Tambahkan satu data kriminal secara manual
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCrimeDataSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasi
                      </label>
                      <Select
                        value={crimeData.mapid.toString()}
                        onValueChange={(value) =>
                          setCrimeData({ ...crimeData, mapid: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lokasi" />
                        </SelectTrigger>
                        <SelectContent>
                          {heatmapLocations.map((location) => (
                            <SelectItem
                              key={location.mapid}
                              value={location.mapid!.toString()}
                            >
                              {location.nama_lokasi}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jenis Kejahatan
                      </label>
                      <Input
                        required
                        value={crimeData.jenis_kejahatan}
                        onChange={(e) =>
                          setCrimeData({
                            ...crimeData,
                            jenis_kejahatan: e.target.value,
                          })
                        }
                        placeholder="Contoh: Pencopetan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Waktu Kejadian
                      </label>
                      <Input
                        type="datetime-local"
                        required
                        value={crimeData.waktu}
                        onChange={(e) =>
                          setCrimeData({ ...crimeData, waktu: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                      </label>
                      <Input
                        value={crimeData.deskripsi}
                        onChange={(e) =>
                          setCrimeData({
                            ...crimeData,
                            deskripsi: e.target.value,
                          })
                        }
                        placeholder="Deskripsi kejadian (opsional)"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full "
                      disabled={isSubmittingCrime}
                    >
                      {isSubmittingCrime
                        ? "Menyimpan..."
                        : "Tambah Data Kriminal"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* CSV Crime Data Upload */}
              <Card className="shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileUp className="w-5 h-5" />
                    <span>Upload Data Kriminal CSV</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Upload banyak data kriminal sekaligus dengan file CSV
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) =>
                          setCrimeCSVFile(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="crime-csv-upload"
                      />
                      <label
                        htmlFor="crime-csv-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih File CSV
                      </label>
                      {crimeCSVFile && (
                        <p className="text-sm text-gray-600 mt-2">
                          File: {crimeCSVFile.name}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        <strong>Format CSV:</strong>
                      </p>
                      <p>mapid, jenis_kejahatan, waktu, deskripsi</p>
                      <p>
                        Contoh: 1,"Pencopetan","2023-07-15 19:30:00","Deskripsi
                        kejadian"
                      </p>
                    </div>

                    <Button
                      onClick={handleCrimeCSVUpload}
                      disabled={!crimeCSVFile || isUploadingCrimeCSV}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isUploadingCrimeCSV
                        ? "Mengupload..."
                        : "Upload CSV Data Kriminal"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Manager Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Manager Baru</DialogTitle>
            <DialogDescription>
              Buat akun manager baru untuk sistem CrimeWatch
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <Input
                required
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                required
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="user@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                required
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Minimal 8 karakter"
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <Input
                type="password"
                required
                value={newUser.confirmPassword}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirmPassword: e.target.value })
                }
                placeholder="Minimal 8 karakter"
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Organisasi / Bisnis
              </label>
              <Input
                required
                value={newUser.organization}
                onChange={(e) =>
                  setNewUser({ ...newUser, organization: e.target.value })
                }
                placeholder="Nama organisasi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi (URL Google Maps)
              </label>
              <Input
                type="url"
                value={newUser.location}
                onChange={(e) =>
                  setNewUser({ ...newUser, location: e.target.value })
                }
                placeholder="https://maps.google.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Opsional: Tulis URL Google Maps untuk lokasi organisasi
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={newUser.latitude}
                  onChange={(e) =>
                    setNewUser({ ...newUser, latitude: e.target.value })
                  }
                  placeholder="-7.7956"
                />
                <p className="text-xs text-gray-500 mt-1">Contoh: -7.7956</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={newUser.longitude}
                  onChange={(e) =>
                    setNewUser({ ...newUser, longitude: e.target.value })
                  }
                  placeholder="110.3695"
                />
                <p className="text-xs text-gray-500 mt-1">Contoh: 110.3695</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="w-full px-2 py-1 text-start text-xs justify-start"
              >
                <Info className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-xs text-gray-500">
                  Latitude dan Longitude bisa didapatkan dari <br /> deskripsi
                  Google Maps
                </span>
              </Badge>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Buat Akun"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Manager</DialogTitle>
            <DialogDescription>
              Perbarui informasi akun manager
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <Input
                required
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                required
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="user@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Organisasi / Bisnis
              </label>
              <Input
                required
                value={editForm.organization}
                onChange={(e) =>
                  setEditForm({ ...editForm, organization: e.target.value })
                }
                placeholder="Nama organisasi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi (URL Google Maps)
              </label>
              <Input
                type="url"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                placeholder="https://maps.google.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Opsional: Tulis URL Google Maps untuk lokasi organisasi
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
