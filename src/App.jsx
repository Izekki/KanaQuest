import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Card from './components/ui/Card';
import AuthRedirectRoute from './components/auth/AuthRedirectRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/Home/HomePage';
import GamePage from './pages/Game/GamePage';
import HistoryPage from './pages/History/HistoryPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SentenceBuilderPage from './pages/SentenceBuilder/SentenceBuilderPage';
import PairMatchPage from './pages/PairMatch/PairMatchPage';

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
        path="/aprender"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GamePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pair-match"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PairMatchPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/par-parejas"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PairMatchPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sentence-builder"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SentenceBuilderPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/constructor"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SentenceBuilderPage />
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
        path="/historial"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HistoryPage />
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
