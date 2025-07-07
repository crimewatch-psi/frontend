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

  // Test multiple operations
  const handleTestMultipleOperations = async () => {
    await runAsyncTest(async () => {
      const operations = [{ name: "users", op: () => adminApi.getUsers() }];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Test API Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Get Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={handleGetUsers}
                  disabled={loadingUsers}
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
                      Get Users
                    </>
                  )}
                </Button>
                {usersError && (
                  <div className="text-red-600 text-sm">{usersError}</div>
                )}
                {testResults.getUsers &&
                  renderTestResult("getUsers", testResults.getUsers)}
                {users.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Users:</h4>
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="text-sm p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center justify-between">
                            <span>{user.email}</span>
                            <Badge>{user.role}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Create Test User */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Create User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Email"
                    value={newUserForm.email}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Input
                    placeholder="Name"
                    value={newUserForm.name}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Input
                    placeholder="Organization"
                    value={newUserForm.organization}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        organization: e.target.value,
                      })
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
                      Create User
                    </>
                  )}
                </Button>
                {createError && (
                  <div className="text-red-600 text-sm">{createError}</div>
                )}
                {testResults.createUser &&
                  renderTestResult("createUser", testResults.createUser)}
              </div>
            </CardContent>
          </Card>

          {/* Multiple Operations Test */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Multiple Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={handleTestMultipleOperations}
                  disabled={runningAsync}
                  className="w-full"
                >
                  {runningAsync ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Run Tests
                    </>
                  )}
                </Button>
                {asyncError && (
                  <div className="text-red-600 text-sm">{asyncError}</div>
                )}
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
              </div>
            </CardContent>
          </Card>
        </div>

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
