/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import api from "../../services/axios.service";
import { useAlert } from "../../store/AlertContext";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { useRouter } from "@tanstack/react-router";

export function FormLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const route = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await api.post("/auth/login", formData);
      let userLogin = result.data.data;
      let user = userLogin.user;
      let token = userLogin.token;
      dispatch(
        loginSuccess({
          user,
          token,
        })
      );
      showAlert("success", "Login Successfully!");
      route.navigate({ to: "/" });
    } catch (error) {
      console.log(error);
      showAlert(
        "error",
        "Login failed. Please check your username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg w-full max-w-md mx-auto border border-gray-200"
    >
      {/* Username Field */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Username
        </label>
        <div
          className="flex items-center border rounded-lg px-3 py-2 bg-gray-50
          focus-within:ring-2 focus-within:ring-blue-300 transition"
        >
          <FaUser className="mr-2 text-gray-500" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Password
        </label>
        <div
          className="flex items-center border rounded-lg px-3 py-2 bg-gray-50
          focus-within:ring-2 focus-within:ring-blue-300 transition"
        >
          <FaLock className="mr-2 text-gray-500" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 
        text-white font-semibold shadow-md hover:from-blue-600 hover:to-teal-500 
        transition-all disabled:opacity-50"
      >
        {loading ? "Processing..." : "Login"}
      </button>
    </form>
  );
}
