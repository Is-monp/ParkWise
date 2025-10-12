import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <AuthForm onLogin={handleLogin} />
              ) : (
                <Navigate to={userRole === 'admin' ? '/admin' : '/user'} replace />
              )
            }
          />
          <Route
            path="/user"
            element={
              isAuthenticated && userRole === 'user' ? (
                <UserDashboard userEmail={userEmail} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && userRole === 'admin' ? (
                <AdminDashboard userEmail={userEmail} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              <Navigate
                to={
                  !isAuthenticated
                    ? '/login'
                    : userRole === 'admin'
                    ? '/admin'
                    : '/user'
                }
                replace
              />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}