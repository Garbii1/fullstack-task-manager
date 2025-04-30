// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Hooks
import { useAuth } from './hooks/useAuth'; // Import useAuth from hooks

// Layout & Common Components
import Navbar from './components/Layout/Navbar';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Page Components
import HomePage from './pages/HomePage';         // <-- Import HomePage
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// --- Helper Components for Routing ---

/**
 * ProtectedRoute Component:
 * Renders its children only if the user is authenticated.
 * Shows a loading spinner while checking authentication status.
 * Redirects to the login page if the user is not authenticated.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Display a spinner centered on the page during the auth check
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // If authenticated, render the child components (e.g., DashboardPage)
  // Otherwise, redirect to the login page, replacing the current history entry
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/**
 * PublicOnlyRoute Component:
 * Renders its children only if the user is NOT authenticated.
 * Shows a loading spinner while checking authentication status.
 * Redirects to the dashboard page if the user IS already authenticated.
 * Useful for preventing logged-in users from accessing login/register pages.
 */
function PublicOnlyRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
       return (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)' }}>
           <LoadingSpinner />
         </div>
       );
    }

    // If authenticated, redirect to the dashboard
    // Otherwise, render the child components (e.g., LoginPage, RegisterPage)
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

/**
 * RootRouteHandler Component:
 * Handles the logic for the root path ('/').
 * Shows a loading spinner while checking authentication status.
 * Redirects authenticated users to the dashboard.
 * Renders the HomePage for unauthenticated users (by returning it implicitly via the Route).
 */
function RootRouteHandler() {
    const { isAuthenticated, loading } = useAuth();

     if (loading) {
       return (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)' }}>
           <LoadingSpinner />
         </div>
       );
    }

    // If authenticated, redirect immediately to the dashboard.
    // If not authenticated, this component implicitly allows the <HomePage />
    // defined in the <Route> element to be rendered.
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />;
}

// --- Main App Component ---

function App() {
  return (
    // Provide Theme context to the entire application
    <ThemeProvider>
      {/* Provide Authentication context to the entire application */}
      <AuthProvider>
        {/* Set up the BrowserRouter for client-side routing */}
        <Router>
          {/* Main application container div */}
          <div className="app-container">
            {/* Render the navigation bar on all pages */}
            <Navbar />

            {/* Define the main content area where routed pages will be rendered */}
            {/* Note: Removed the global "container" class here as HomePage manages its own layout */}
            <main>
              {/* Define the different routes for the application */}
              <Routes>
                {/* --- Root Route --- */}
                {/* The RootRouteHandler determines if HomePage is shown or redirects to Dashboard */}
                <Route path="/" element={<RootRouteHandler />} />

                {/* --- Authentication Routes (Public Only) --- */}
                {/* These routes are only accessible if the user is NOT logged in */}
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <div className="container"> {/* Add container for standard page layout */}
                        <LoginPage />
                      </div>
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute>
                      <div className="container"> {/* Add container for standard page layout */}
                       <RegisterPage />
                      </div>
                    </PublicOnlyRoute>
                  }
                />

                {/* --- Protected Application Routes --- */}
                {/* This route is only accessible if the user IS logged in */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <div className="container"> {/* Add container for standard page layout */}
                        <DashboardPage />
                      </div>
                    </ProtectedRoute>
                  }
                />
                {/* Add other protected routes here, wrapping the page component with <ProtectedRoute> */}
                {/* Example:
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                */}

                {/* --- Catch-all 404 Not Found Route --- */}
                {/* This route matches any path not defined above */}
                <Route
                  path="*"
                  element={
                    <div className="container"> {/* Add container for standard page layout */}
                      <NotFoundPage />
                    </div>
                  }
                />
              </Routes>
            </main>

            {/* Optional: A global footer could be placed here */}
            {/* <footer>Footer Content</footer> */}
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;