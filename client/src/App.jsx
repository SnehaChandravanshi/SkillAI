import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SkillSelection from "./pages/SkillSelection";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Roadmap from "./pages/Roadmap";
import ModuleViewer from "./pages/ModuleViewer";
import Quiz from "./pages/Quiz";
import Challenge from "./pages/Challenge";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <SkillSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <Roadmap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap/:id"
        element={
          <ProtectedRoute>
            <Roadmap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/:id"
        element={
          <ProtectedRoute>
            <ModuleViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenge/:moduleId"
        element={
          <ProtectedRoute>
            <Challenge />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:moduleId"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}
