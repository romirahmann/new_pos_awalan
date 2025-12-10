/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import api from "../../../../services/axios.service";
import { useAlert } from "../../../../store/AlertContext";

export function FormUser({ mode = "Add", initialData, onClose }) {
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    roleId: "",
    jobdeskId: "",
  });

  const [roles, setRoles] = useState([]);
  const [jobdesks, setJobdesks] = useState([]);

  // ============================
  // Load initial data if edit
  // ============================
  useEffect(() => {
    if (mode === "Edit" && initialData) {
      setForm({
        username: initialData.username || "",
        password: "", // password tidak ditampilkan saat edit
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        roleId: initialData.roleId || "",
        jobdeskId: initialData.jobdeskId || "",
      });
    }
  }, [initialData, mode]);

  // ============================
  // Fetch roles & jobdesk
  // ============================
  const fetchJobNRole = async () => {
    try {
      let res = await api.get("/master/jobdesk-roles");
      setRoles(res.data.data.roles || []);
      setJobdesks(res.data.data.jobdesk);
    } catch (err) {
      console.log(err);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchJobNRole();
  }, []);

  // ============================
  // Handle Input Change
  // ============================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ============================
  // Submit Data
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { ...form };

    if (mode === "Edit" && !payload.password) {
      delete payload.password;
    }

    try {
      if (mode === "Add") {
        await api.post("/master/user", payload);
      } else {
        await api.put(`/master/user/${initialData.userId}`, payload);
      }

      showAlert(
        "success",
        `User ${mode === "Add" ? "created" : "updated"} successfully!`
      );
      onClose();
    } catch (error) {
      console.log(error);
      showAlert("error", "Something went wrong!");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
        <div className="form grid grid-cols-2 gap-2">
          {/* Username */}
          <div>
            <label className="text-white  block mb-1 text-sm font-semibold">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
              className="w-full px-3 py-2 border rounded bg-white"
              required
            />
          </div>

          {/* Password (hanya wajib saat ADD) */}
          <div>
            <label className="text-white  block mb-1 text-sm font-semibold">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder={
                mode === "Edit"
                  ? "Kosongkan jika tidak diganti"
                  : "enter your password"
              }
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white"
              required={mode === "Add"}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-white block mb-1 text-sm font-semibold">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="fullname"
              className="w-full px-3 py-2 border rounded bg-white"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-white block mb-1 text-sm font-semibold">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className=" text-white block mb-1 text-sm font-semibold">
              Role
            </label>
            <select
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>

          {/* Jobdesk */}
          <div>
            <label className=" text-white block mb-1 text-sm font-semibold">
              Jobdesk
            </label>
            <select
              name="jobdeskId"
              value={form.jobdeskId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white"
              required
            >
              <option value="">Select Jobdesk</option>
              {jobdesks.map((job) => (
                <option key={job.jobdeskId} value={job.jobdeskId}>
                  {job.jobdeskName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {mode === "Add" ? "Create User" : "Update User"}
          </button>
        </div>
      </form>
    </>
  );
}
