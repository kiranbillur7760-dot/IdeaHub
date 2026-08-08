
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CreateIdea from "./pages/CreateIdea";
import IdeaDetails from "./pages/IdeaDetails";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import EditIdea from "./pages/EditIdea";
import SavedIdeas from "./pages/SavedIdeas";
import Trending from "./pages/Trending";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* ========================= */}
      {/* Root Route */}
      {/* ========================= */}

      <Route
        path="/"
        element={
          token ? <Navigate to="/home" replace /> : <Login />
        }
      />

      {/* ========================= */}
      {/* Register */}
      {/* ========================= */}

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ========================= */}
      {/* Protected Routes */}
      {/* ========================= */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Home />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Explore />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-idea"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <CreateIdea />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ideas/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <IdeaDetails />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-idea/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <EditIdea />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Profile />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <EditProfile />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SavedIdeas />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trending"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Trending />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ProjectWorkspace />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* Unknown Route */}
      {/* ========================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;

