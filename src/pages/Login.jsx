
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login button clicked");
    console.log("Form:", form);

    try {
      const res = await API.post("/auth/login", form);

      console.log("✅ Login Successful");
      console.log("Response:", res.data);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("🎉 Login Successful!");

      console.log("Stored Token:");
      console.log(localStorage.getItem("token"));

      console.log("Stored User:");
      console.log(localStorage.getItem("user"));

      // Redirect based on user role
      setTimeout(() => {
        console.log("Checking user role...");

        if (res.data.user.role === "client") {
          console.log("Client detected → Client Dashboard");
          navigate("/client-dashboard", { replace: true });
        } else {
          console.log("Normal user detected → Home");
          navigate("/home", { replace: true });
        }
      }, 1000);

    } catch (err) {
      console.error("Login Error:", err);
      console.error("Response:", err.response);
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);

      alert(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-8">
          Login to IdeaHub
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
