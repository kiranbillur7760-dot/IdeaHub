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

function App() {
  return (
    <Routes>

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Public Routes */}
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-idea"
        element={
          <ProtectedRoute>
            <CreateIdea />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ideas/:id"
        element={
          <ProtectedRoute>
            <IdeaDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-idea/:id"
        element={
          <ProtectedRoute>
            <EditIdea />
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
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <SavedIdeas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trending"
        element={
          <ProtectedRoute>
            <Trending />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectWorkspace />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;