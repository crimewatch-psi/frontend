"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  authApi,
  adminApi,
  handleApiError,
  LoginCredentials,
  CreateUserData,
  User,
} from "@/lib/api";
import { useApi, useAsyncOperation } from "@/hooks/useApi";
import {
  Database,
  Users,
  UserPlus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [users, setUsers] = useState<User[]>([]);

  // Test hooks
  const {
    execute: testConnection,
    loading: testingConnection,
    error: connectionError,
  } = useApi(authApi.testConnection);
  const {
    execute: getUsers,
    loading: loadingUsers,
    error: usersError,
  } = useApi(adminApi.getUsers);
  const {
    execute: createUser,
    loading: creatingUser,
    error: createError,
  } = useApi(adminApi.createUser);
  const {
    execute: initializeDb,
    loading: initializingDb,
    error: initError,
  } = useApi(adminApi.initializeDatabase);

  const {
    execute: runAsyncTest,
    loading: runningAsync,
    error: asyncError,
  } = useAsyncOperation();

  const [newUserForm, setNewUserForm] = useState<CreateUserData>({
    email: "",
    password: "",
    name: "",
    role: "pemerintah",
    organization: "",
  });

  // Test database connection
  const handleTestConnection = async () => {
    try {
      const result = await testConnection();
      setTestResults((prev) => ({
        ...prev,
        connection: { success: true, result },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        connection: { success: false, error: handleApiError(error) },
      }));
    }
  };

  // Test user fetching
  const handleGetUsers = async () => {
    try {
      const result = await getUsers();
      if (result && result.success) {
        setUsers(result.users);
        setTestResults((prev) => ({
          ...prev,
          getUsers: { success: true, count: result.users.length },
        }));
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        getUsers: { success: false, error: handleApiError(error) },
      }));
    }
  };

  // Test user creation
  const handleCreateTestUser = async () => {
    if (!newUserForm.email || !newUserForm.password || !newUserForm.name) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const result = await createUser(newUserForm);
      if (result && result.success) {
        setTestResults((prev) => ({
          ...prev,
          createUser: { success: true, user: result.user },
        }));
        // Refresh users list
        await handleGetUsers();
        // Reset form
        setNewUserForm({
          email: "",
          password: "",
          name: "",
          role: "pemerintah",
          organization: "",
        });
      }
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        createUser: { success: false, error: handleApiError(error) },
      }));
    }
  };

  // Test database initialization
  const handleInitializeDatabase = async () => {
    try {
      const result = await initializeDb();
      setTestResults((prev) => ({
        ...prev,
        initDb: { success: true, result },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        initDb: { success: false, error: handleApiError(error) },
      }));
    }
  };

  // Test multiple operations
  const handleTestMultipleOperations = async () => {
    await runAsyncTest(async () => {
      const operations = [
        { name: "connection", op: () => authApi.testConnection() },
        { name: "users", op: () => adminApi.getUsers() },
      ];

      const results: Record<string, any> = {};

      for (const { name, op } of operations) {
        try {
          const result = await op();
          results[name] = { success: true, result };
        } catch (error) {
          results[name] = { success: false, error: handleApiError(error) };
        }
      }

      setTestResults((prev) => ({
        ...prev,
        multipleOperations: results,
      }));
    });
  };

  // Auto-load users on component mount
  useEffect(() => {
    handleGetUsers();
  }, []);

  const renderTestResult = (key: string, result: any) => {
    if (!result) return null;

    return (
      <div className="flex items-center space-x-2 text-sm">
        {result.success ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <XCircle className="w-4 h-4 text-red-600" />
        )}
        <span className={result.success ? "text-green-700" : "text-red-700"}>
          {result.success ? "Success" : "Error"}
        </span>
        {result.error && (
          <span className="text-red-600 text-xs">- {result.error}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Axios API Integration Test
          </h1>
          <p className="text-gray-600">
            Test all API endpoints using the new axios-based service layer
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Database Connection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="w-full"
              >
                {testingConnection ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
              {renderTestResult("connection", testResults.connection)}
              {connectionError && (
                <p className="text-red-600 text-sm">{connectionError}</p>
              )}
            </CardContent>
          </Card>

          {/* User Management Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGetUsers}
                disabled={loadingUsers}
                variant="outline"
                className="w-full"
              >
                {loadingUsers ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Users
                  </>
                )}
              </Button>
              {renderTestResult("getUsers", testResults.getUsers)}
              {usersError && (
                <p className="text-red-600 text-sm">{usersError}</p>
              )}

              <Button
                onClick={handleInitializeDatabase}
                disabled={initializingDb}
                variant="secondary"
                className="w-full"
              >
                {initializingDb ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Initialize Demo Data
                  </>
                )}
              </Button>
              {renderTestResult("initDb", testResults.initDb)}
              {initError && <p className="text-red-600 text-sm">{initError}</p>}
            </CardContent>
          </Card>

          {/* Create User Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Create User Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Name"
                  value={newUserForm.name}
                  onChange={(e) =>
                    setNewUserForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) =>
                    setNewUserForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Organization"
                  value={newUserForm.organization}
                  onChange={(e) =>
                    setNewUserForm((prev) => ({
                      ...prev,
                      organization: e.target.value,
                    }))
                  }
                />
              </div>

              <Button
                onClick={handleCreateTestUser}
                disabled={creatingUser}
                className="w-full"
              >
                {creatingUser ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Test User
                  </>
                )}
              </Button>
              {renderTestResult("createUser", testResults.createUser)}
              {createError && (
                <p className="text-red-600 text-sm">{createError}</p>
              )}
            </CardContent>
          </Card>

          {/* Multiple Operations Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Multiple Operations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleTestMultipleOperations}
                disabled={runningAsync}
                variant="outline"
                className="w-full"
              >
                {runningAsync ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Test Multiple Operations
                  </>
                )}
              </Button>
              {testResults.multipleOperations && (
                <div className="space-y-2">
                  {Object.entries(testResults.multipleOperations).map(
                    ([key, result]) => (
                      <div key={key}>
                        <strong className="text-sm">{key}:</strong>
                        {renderTestResult(key, result)}
                      </div>
                    )
                  )}
                </div>
              )}
              {asyncError && (
                <p className="text-red-600 text-sm">{asyncError}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Users Display */}
        {users.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
