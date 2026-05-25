import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Card from './components/ui/Card';
import AuthRedirectRoute from './components/auth/AuthRedirectRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/Home/HomePage';
import GamePage from './pages/Game/GamePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GamePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRedirectRoute>
            <AppLayout>
              <LoginPage />
            </AppLayout>
          </AuthRedirectRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirectRoute>
            <AppLayout>
              <RegisterPage />
            </AppLayout>
          </AuthRedirectRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <AppLayout>
            <Card
              eyebrow="404"
              title="Page not found"
              description="The route you requested does not exist yet. Use the navigation to move through the scaffold."
            />
          </AppLayout>
        }
      />
    </Routes>
  );
}
