
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
import PersonalChat from "./pages/PersonalChat";
import ClientDashboard from "./pages/ClientDashboard";
import ProjectDiscovery from "./pages/ProjectDiscovery";
import ClientRequests from "./pages/ClientRequests";

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
          token ? (
            <Navigate to="/home" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* ========================= */}
      {/* Login */}
      {/* ========================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ========================= */}
      {/* Register */}
      {/* ========================= */}

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ========================= */}
      {/* Client Dashboard */}
      {/* ========================= */}

      <Route
        path="/client-dashboard"
        element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* Client Requests */}
      {/* ========================= */}

      <Route
        path="/client-requests"
        element={
          <ProtectedRoute>
            <ClientRequests />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* Client Project Discovery */}
      {/* ========================= */}

      <Route
        path="/discover-project/:projectId"
        element={
          <ProtectedRoute>
            <ProjectDiscovery />
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* Home */}
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

      {/* ========================= */}
      {/* Personal Chat */}
      {/* ========================= */}

      <Route
        path="/personal-chat/:userId"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <PersonalChat />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================= */}
      {/* Explore */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* Create Idea */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* Idea Details */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* Edit Idea */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* Profile */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* Edit Profile */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* Saved Ideas */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* Trending */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* Project Workspace */}
      {/* ========================= */}

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
