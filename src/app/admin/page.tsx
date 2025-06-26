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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Shield,
  Building,
  Car,
  ArrowLeftToLine,
  MapPin,
  Upload,
  Download,
  MoreHorizontal,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  adminApi,
  handleApiError,
  User as ApiUser,
  CreateUserData,
} from "@/lib/api";

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "pemerintah",
    organization: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage CrimeWatch user accounts
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800">
                <ArrowLeftToLine className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User Account</DialogTitle>
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
                      setNewUser({ ...newUser, organization: e.target.value })
                    }
                    placeholder="Organization name"
                  />
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Government
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "pemerintah").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <Car className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Police</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "polri").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tourism</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "manajer_wisata").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Last Login
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <span className="ml-2 font-medium text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getRoleBadgeVariant(user.role) as any}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleToggleUserStatus(
                                user.id,
                                user.status === "active" ? "inactive" : "active"
                              )
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
