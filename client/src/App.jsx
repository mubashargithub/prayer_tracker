import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { Toaster } from 'sonner';
import { Loader } from 'lucide-react';

import { refreshToken, setInitialized } from './features/auth/authSlice';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

import { ThemeProvider } from './contexts/ThemeContext';

// Eagerly load Auth pages to keep login snappy
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';

// Lazy load feature routes for performance
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const PrayersPage = lazy(() => import('./features/prayers/PrayersPage'));
const DuasPage = lazy(() => import('./features/duas/DuasPage'));
const RemindersPage = lazy(() => import('./features/reminders/RemindersPage'));
const HistoryPage = lazy(() => import('./features/history/HistoryPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));

const ProtectedRoute = ({ children }) => {
  const { isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // Check token existence in state to know if authenticated
  // because 'isAuthenticated' is not explicitly in the state, it's inferred from token
  const token = useSelector(state => state.auth.token);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Fallback loader for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          } />
          <Route path="prayers" element={
            <Suspense fallback={<PageLoader />}>
              <PrayersPage />
            </Suspense>
          } />
          <Route path="duas" element={
            <Suspense fallback={<PageLoader />}>
              <DuasPage />
            </Suspense>
          } />
          <Route path="reminders" element={
            <Suspense fallback={<PageLoader />}>
              <RemindersPage />
            </Suspense>
          } />
          <Route path="history" element={
            <Suspense fallback={<PageLoader />}>
              <HistoryPage />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          } />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(refreshToken()).unwrap();
      } catch (err) {
        // Normal if user not logged in
      } finally {
        dispatch(setInitialized(true));
      }
    };
    initializeAuth();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster position={isMobile ? "top-center" : "top-right"} richColors />
          <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
export default App;
