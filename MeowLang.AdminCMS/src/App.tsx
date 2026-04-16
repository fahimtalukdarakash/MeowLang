// File: src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import FluidCursor from "./components/common/FluidCursor";
import LanguagesPage from "./pages/Languages/LanguagesPage";
import LevelsPage from "./pages/Levels/LevelsPage";
import SubLevelsPage from "./pages/SubLevels/SubLevelsPage";
import ContentPage from "./pages/Content/ContentPage";
import UsersPage from "./pages/Users/UsersPage";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      {/* Only show fluid cursor on login page — not in CMS */}
      {!isAuthenticated && <FluidCursor />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/languages"
          element={
            <ProtectedRoute>
              <LanguagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/languages/:languageId/levels"
          element={
            <ProtectedRoute>
              <LevelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/languages/:languageId/levels/:levelId/sublevels"
          element={
            <ProtectedRoute>
              <SubLevelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/languages/:languageId/levels/:levelId/sublevels/:subLevelId/content"
          element={
            <ProtectedRoute>
              <ContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
