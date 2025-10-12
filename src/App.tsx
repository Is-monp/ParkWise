import { useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { UserDashboard } from "./components/UserDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  const handleLogin = (email: string, role: 'user' | 'admin') => {
    setUserEmail(email);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    setUserRole('user');
  };

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <AuthForm onLogin={handleLogin} />
      ) : userRole === 'admin' ? (
        <AdminDashboard userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <UserDashboard userEmail={userEmail} onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}