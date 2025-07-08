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
} from "lucide-react";
import { adminApi, handleApiError, User as ApiUser } from "@/lib/api";

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
    name: "",
    role: "manager",
    organization: "",
    location: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    organization: "",
    location: "",
  });

  useEffect(() => {
    fetchUsers();
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = {
        email: newUser.email,
        password: newUser.password,
        nama: newUser.name,
        organization: newUser.organization,
        location: newUser.location,
      };

      const response = await adminApi.registerManager(userData);

      if (response.success) {
        toast.success("Akun manager berhasil dibuat");
        await fetchUsers();
        setIsCreateDialogOpen(false);
        setNewUser({
          email: "",
          password: "",
          name: "",
          role: "manager",
          organization: "",
          location: "",
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "manager":
        return "Manager";
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "manager":
        return "default";
      default:
        return "outline";
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

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
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
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Akun Manager</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Input Data Kriminal</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Search and Filter Bar */}
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

          {/* Data Upload Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Data Kriminal</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Impor data kriminal dari file CSV untuk memperbarui database
                  sistem
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="max-w-2xl mx-auto">
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <FileText className="w-12 h-12 text-gray-400" />
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Upload File
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Pilih File
                        </label>

                        {selectedFile && (
                          <div className="text-sm text-gray-600">
                            Dipilih: {selectedFile.name} (
                            {(selectedFile.size / 1024).toFixed(1)} KB)
                          </div>
                        )}
                      </div>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Mengupload... {uploadProgress}%
                          </p>
                        </div>
                      )}

                      {/* Upload Button */}
                      <Button
                        onClick={handleFileUpload}
                        disabled={!selectedFile || isUploading}
                        className="bg-black hover:bg-gray-800"
                      >
                        {isUploading ? "Mengupload..." : "Upload Data"}
                      </Button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-8 space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Format File CSV:
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        File CSV harus mencakup kolom berikut:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>
                          <code className="bg-gray-200 px-1 rounded">
                            mapid
                          </code>{" "}
                          - ID Lokasi
                        </li>
                        <li>
                          <code className="bg-gray-200 px-1 rounded">
                            jenis_kejahatan
                          </code>{" "}
                          - Jenis Kriminal
                        </li>
                        <li>
                          <code className="bg-gray-200 px-1 rounded">
                            waktu
                          </code>{" "}
                          - Tanggal dan waktu (YYYY-MM-DD HH:MM:SS)
                        </li>
                        <li>
                          <code className="bg-gray-200 px-1 rounded">
                            deskripsi
                          </code>{" "}
                          - Deskripsi Kriminal
                        </li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">
                        Maximum file size: 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
