import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Card from './components/ui/Card';
import AuthRedirectRoute from './components/auth/AuthRedirectRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import HomePage from './pages/Home/HomePage';
import GamePage from './pages/Game/GamePage';
import HistoryPage from './pages/History/HistoryPage';
import LoginPage from './pages/Login/LoginPage';
import ForgotPasswordPage from './pages/Login/ForgotPasswordPage';
import ResetPasswordPage from './pages/Login/ResetPasswordPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SentenceBuilderPage from './pages/SentenceBuilder/SentenceBuilderPage';
import PairMatchPage from './pages/PairMatch/PairMatchPage';
import AdminFeedbackPage from './pages/Admin/AdminFeedbackPage';

export default function App() {
  return (
    <Routes>
      {/* Persistent AppLayout: Navbar, Petals Animation & Header stay mounted across all page navigations */}
      <Route element={<AppLayout />}>
        {/* Public / Dashboard */}
        <Route path="/" element={<HomePage />} />

        {/* Learning & Game Practice Modes */}
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aprender"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pair-match"
          element={
            <ProtectedRoute>
              <PairMatchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/par-parejas"
          element={
            <ProtectedRoute>
              <PairMatchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sentence-builder"
          element={
            <ProtectedRoute>
              <SentenceBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/constructor"
          element={
            <ProtectedRoute>
              <SentenceBuilderPage />
            </ProtectedRoute>
          }
        />

        {/* User Profile & Vocabulary History */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vocabulary"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vocabulario"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Authentication Flow (Redirects to /game if already logged in) */}
        <Route
          path="/login"
          element={
            <AuthRedirectRoute>
              <LoginPage />
            </AuthRedirectRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRedirectRoute>
              <ForgotPasswordPage />
            </AuthRedirectRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirectRoute>
              <RegisterPage />
            </AuthRedirectRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminFeedbackPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <Card
              eyebrow="404"
              title="Page not found"
              description="The route you requested does not exist yet. Use the navigation to move through the scaffold."
            />
          }
        />
      </Route>
    </Routes>
  );
}
