import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ThemeToggle } from "./ThemeToggle";
import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  onLogin: (email: string, role: "user" | "admin") => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const navigate = useNavigate(); // 🚀 for navigation

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  //  LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      // Check if login failed
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login failed:", errorText);
        alert("Incorrect email or password ");
        return;
      }

      const data = await response.json();
      console.log("Login response:", data);

      const token = data.token || data.access_token || data;
      if (!token) {
        alert("No token found in response :(");
        return;
      }

      // Save token
      localStorage.setItem("token", token);
      console.log("Token saved:", token);

      // 🔍 Check role
      const roleResponse = await fetch("http://localhost:8080/view/user/isAdmin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!roleResponse.ok) {
        const errorText = await roleResponse.text();
        console.error("Role check failed:", errorText);
        alert("Could not verify user role");
        return;
      }

      const roleData = await roleResponse.json();
      console.log("Role check:", roleData);

      if (roleData.isAdmin) {
        setRole("admin");
        alert("Welcome, admin!");
        onLogin(loginEmail, "admin");
        navigate("/admin/dashboard");
      } else {
        setRole("user");
        alert("Welcome, user!");
        onLogin(loginEmail, "user");
        navigate("/user/dashboard");
      }

    } catch (error) {
      alert("Error connecting to backend :(");
      console.error(error);
    }
  };


  // 🧾 SIGNUP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: signupName.split(" ")[0],
          lastName: signupName.split(" ").slice(1).join(" "),
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const text = await response.text();
      if (!response.ok) {
        alert(`Signup failed: ${text}`);
        return;
      }

      alert("Account created successfully!");
    } catch (error) {
      alert("Error connecting to backend :(");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 relative z-10">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">ParkWise</CardTitle>
            <CardDescription className="mt-2">
              Sign in to manage your parking
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-role">Role</Label>
                  <Select
                    value={role}
                    onValueChange={(value) =>
                      setRole(value as "user" | "admin")
                    }
                  >
                    <SelectTrigger id="login-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-role">Role</Label>
                  <Select
                    value={role}
                    onValueChange={(value) =>
                      setRole(value as "user" | "admin")
                    }
                  >
                    <SelectTrigger id="signup-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
