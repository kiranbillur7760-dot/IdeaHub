import SavedIdeas from "./pages/SavedIdeas";
import { Routes, Route } from "react-router-dom";
import EditIdea from "./pages/EditIdea";
import Navbar from "./components/Navbar";
import Trending from "./pages/Trending";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateIdea from "./pages/CreateIdea";
import EditProfile from "./pages/EditProfile";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
  path="/saved"
  element={<SavedIdeas />}
/>
        <Route path="/trending" element={<Trending />} />
        <Route path="/" element={<Home />} />
        <Route path="/edit-idea/:id" element={<EditIdea />} />
        <Route path="/explore" element={<Explore />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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
      </Routes>
    </>
  );
}

export default App;