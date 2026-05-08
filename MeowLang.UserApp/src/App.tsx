// File: src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
// import ShaderBackground from './components/background/ShaderBackground'
import MeteorBackground from "./components/background/MeteorBackground";
import FluidCursor from "./components/cursor/FluidCursor";
import LandingPage from "./pages/Landing/LandingPage";

// App pages — imported later when we build them
import LanguageSelectPage from "./pages/App/LanguageSelect/LanguageSelectPage";
import LevelMapPage from "./pages/App/LevelMap/LevelMapPage";
import SubLevelSelectPage from "./pages/App/SubLevelSelect/SubLevelSelectPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  // Determine if we are in the app world or landing world
  const isAppWorld =
    isAuthenticated && window.location.pathname.startsWith("/app");

  return (
    <BrowserRouter>
      {/* Layer 0 — always fixed background */}
      {/* <ShaderBackground /> */}
      {/* <MeteorBackground />
      {/* Layer 10 — fluid cursor, always on top of background */}
      {/* <FluidCursor /> */}
      {/* Landing world — meteor background and cursor */}
      {!isAppWorld && <MeteorBackground />}
      {!isAppWorld && <FluidCursor />}

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* ── App world ── */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <LanguageSelectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/language/:languageId"
          element={
            <ProtectedRoute>
              <LevelMapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/language/:languageId/level/:levelId"
          element={
            <ProtectedRoute>
              <SubLevelSelectPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
