import { useState } from "react";
import FeedbackAdmin from "../components/FeedbackAdmin";
import FeedbackTester from "../components/FeedbackTester";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const FeedbackTest = () => {
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleAdminAccess = () => {
    // Simple password check (in production, this should be more secure)
    if (adminPassword === "admin123") {
      setIsAuthorized(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Admin Password
              </label>
              <Input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAdminAccess()}
              />
            </div>
            <Button onClick={handleAdminAccess} className="w-full">
              Access Feedback Dashboard
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Hint: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Feedback Testing & Management</h1>
          <Button
            variant="outline"
            onClick={() => setIsAuthorized(false)}
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="tester" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tester">Database Tester</TabsTrigger>
            <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="tester">
            <FeedbackTester />
          </TabsContent>
          <TabsContent value="admin">
            <FeedbackAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackTest;
