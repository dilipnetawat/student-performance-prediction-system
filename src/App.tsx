import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './lib/store';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { StudentAuthPage } from './pages/StudentAuth';
import { LegalPage } from './pages/Legal';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudentsPage } from './pages/Students';
import { StudentProfilePage } from './pages/StudentProfile';
import { PredictionsPage } from './pages/Predictions';
import { NotificationsPage } from './pages/Notifications';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/student-signup" element={<StudentAuthPage />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentProfilePage />} />
            <Route path="predictions" element={<PredictionsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
