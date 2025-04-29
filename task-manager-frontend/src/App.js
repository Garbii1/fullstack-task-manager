import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; // Keep this one
import { useAuth } from './hooks/useAuth'; // Import the hook from its correct location
import Navbar from './components/Layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage'; // Create this page

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Optional: Or return null, or a minimal loading state
    return <div className="loading-spinner" style={{ margin: '50px auto' }}></div>;
  }

  // If not authenticated, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
   // 'replace' prevents the login page from being added to history when redirected
}

 // Component to redirect logged-in users away from auth pages
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading-spinner" style={{ margin: '50px auto' }}></div>;
    }

    // If authenticated, redirect to dashboard
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}


function App() {
  return (
    <ThemeProvider>
      <AuthProvider> {/* Wrap everything in AuthProvider */}
          <Router>
            <div className="app-container"> {/* Optional wrapper */}
              <Navbar />
              <main className="container"> {/* Main content area */}
                <Routes>
                   {/* Public routes - redirect if logged in */}
                  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                  {/* Protected routes - redirect if not logged in */}
                   <Route
                       path="/dashboard"
                       element={
                           <ProtectedRoute>
                               <DashboardPage />
                           </ProtectedRoute>
                       }
                   />
                   {/* Add other protected routes here */}


                   {/* Default route: Redirect to dashboard if logged in, else to login */}
                  <Route
                    path="/"
                    element={
                      <AuthRedirector />
                    }
                  />

                  {/* Catch-all for 404 Not Found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              {/* Optional Footer can go here */}
            </div>
          </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Helper component to handle the root path redirection logic
function AuthRedirector() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner" style={{ margin: '50px auto' }}></div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}


export default App;