// File: src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuthStore } from './store/authStore'
// import ShaderBackground from './components/background/ShaderBackground'
import MeteorBackground from "./components/background/MeteorBackground";
import FluidCursor from "./components/cursor/FluidCursor";
import LandingPage from "./pages/Landing/LandingPage";

function App() {
  // const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      {/* Layer 0 — always fixed background */}
      {/* <ShaderBackground /> */}
      <MeteorBackground />
      {/* Layer 10 — fluid cursor, always on top of background */}
      <FluidCursor />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Temporary placeholder — we will build this properly next */}
        <Route
          path="/app"
          element={
            <div
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                position: "relative",
                zIndex: 20,
              }}
            >
              Welcome! App coming soon...
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
