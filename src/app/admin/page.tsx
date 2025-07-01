"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Shield,
  Building,
  Car,
  UserPlus,
  MapPin,
  Upload,
  Download,
  MoreHorizontal,
  UserCheck,
  UserX,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
} from "lucide-react";
import {
  adminApi,
  handleApiError,
  User as ApiUser,
  CreateUserData,
} from "@/lib/api";
import Link from "next/link";

interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  coordinates: string;
  status: string;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ApiUser[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "pemerintah",
    organization: "",
    location: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", handleApiError(error));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData: CreateUserData = {
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        role: newUser.role,
        organization: newUser.organization,
        location: newUser.location,
      };

      const data = await adminApi.createUser(userData);

      if (data.success) {
        await fetchUsers();
        setIsCreateDialogOpen(false);
        setNewUser({
          email: "",
          password: "",
          name: "",
          role: "pemerintah",
          organization: "",
          location: "",
        });
      } else {
        alert(data.message || "Failed to create user");
      }
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, newStatus: string) => {
    try {
      const data = await adminApi.updateUserStatus({
        userId,
        status: newStatus,
      });

      if (data.success) {
        // Update the local state to reflect the change
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
      } else {
        alert(data.message || "Failed to update user status");
      }
    } catch (error) {
      alert(handleApiError(error));
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "pemerintah":
        return <Building className="w-4 h-4" />;
      case "polri":
        return <Car className="w-4 h-4" />;
      case "manajer_wisata":
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "pemerintah":
        return "Government";
      case "polri":
        return "Police";
      case "manajer_wisata":
        return "Tourism Manager";
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "pemerintah":
        return "default";
      case "polri":
        return "secondary";
      case "manajer_wisata":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New User Account</DialogTitle>
                    <DialogDescription>
                      Add a new user to the CrimeWatch system with appropriate
                      role and permissions.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        required
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        placeholder="Enter full name"
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
                        placeholder="user@example.com"
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
                        placeholder="Create password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pemerintah">Government</SelectItem>
                          <SelectItem value="polri">Police</SelectItem>
                          <SelectItem value="manajer_wisata">
                            Tourism Manager
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization
                      </label>
                      <Input
                        required
                        value={newUser.organization}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            organization: e.target.value,
                          })
                        }
                        placeholder="Organization name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location (Google Maps URL)
                      </label>
                      <Input
                        type="url"
                        value={newUser.location}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            location: e.target.value,
                          })
                        }
                        placeholder="https://maps.google.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Optional: Paste Google Maps URL for user's location
                      </p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create User"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage CrimeWatch user accounts and system configuration
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="pemerintah">Government</SelectItem>
                  <SelectItem value="polri">Police</SelectItem>
                  <SelectItem value="manajer_wisata">
                    Tourism Manager
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {users.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {filteredUsers.length} filtered
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
                    Government
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "pemerintah").length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Officials & staff
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Police
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "polri").length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Officers & staff</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Car className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Tourism
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "manajer_wisata").length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Managers & staff</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">User Accounts</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Users className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No users found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                        Contact & Role
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                        Location
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm uppercase tracking-wider">
                        Actions
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
                          <div>
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                            <div className="mt-1">
                              <Badge
                                variant={getRoleBadgeVariant(user.role) as any}
                                className="text-xs"
                              >
                                {getRoleLabel(user.role)}
                              </Badge>
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
                                  View Location
                                </a>
                              ) : (
                                <span className="text-gray-400">
                                  Not provided
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
                              ? new Date(user.last_login).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "Never"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              title="Edit User"
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
                                  ? "Deactivate User"
                                  : "Activate User"
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
      </div>
    </div>
  );
}
