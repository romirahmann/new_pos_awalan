/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { Table } from "../../shared/Table";
import { listenToUpdate } from "../../services/socket.service";

import Modal from "../../shared/Modal";
import ConfirmDelete from "../../shared/ConfirmDeleted";
import dayjs from "dayjs";
import { useAlert } from "../../store/AlertContext";
import { FormUser } from "../../components/main/settings/users/FormUser";
import api from "../../services/axios.service";

export function UserPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("nameAsc");
  const [users, setUsers] = useState([]);
  const [jobRole, setJobRole] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("Add");
  const [selectedUser, setSelectedUser] = useState(null);

  // Confirm Delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { showAlert } = useAlert();

  // =======================
  // Fetch Users
  // =======================
  const fetchUsers = useCallback(async () => {
    try {
      let res = await api.get("/master/users");

      setUsers(res?.data?.data || []);
    } catch (error) {
      console.log(error);
      setUsers([]);
    }
  }, []);

  // =======================
  // Fetch Roles
  // =======================
  const fetchJobdeskRoles = async () => {
    try {
      let res = await api.get(`/master/jobdesk-roles`);

      setJobRole(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobdeskRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
    ["user:created", "user:updated", "user:deleted"].forEach((event) =>
      listenToUpdate(event, fetchUsers)
    );
  }, [fetchUsers]);

  // =======================
  // Open Modals
  // =======================
  const openAddModal = () => {
    setFormMode("Add");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormMode("Edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  // =======================
  // Confirm Delete
  // =======================
  const confirmDelete = async () => {
    try {
      await api.delete(`/master/users/${deleteId}`);
      showAlert("success", "User deleted successfully!");
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // =======================
  // Table Columns
  // =======================
  const columns = [
    { header: "Full Name", key: "fullname" },
    { header: "Username", key: "username" },
    { header: "Email", key: "email" },
    { header: "Role", key: "roleName" },
    {
      header: "Active",
      key: "isActive",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (val) => dayjs(val).format("DD MMM YY HH:mm:ss"),
    },
  ];

  // =======================
  // Filter + Sorting
  // =======================
  const filteredUsers = (users || [])
    .filter((item) =>
      item?.username?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) =>
      filterRole === "All" ? true : item.roleName === filterRole
    )
    .filter((item) =>
      filterStatus === "All"
        ? true
        : filterStatus === "Active"
        ? item.isActive
        : !item.isActive
    )
    .sort((a, b) => {
      if (sortBy === "nameAsc") return a.username.localeCompare(b.userName);
      if (sortBy === "nameDesc") return b.username.localeCompare(a.userName);
      if (sortBy === "dateNewest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "dateOldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  // =======================
  // Actions per Row
  // =======================
  const actionRenderer = (row) => (
    <div className="flex gap-2 justify-center">
      <button
        className="p-2 bg-blue-500 rounded hover:bg-blue-600 text-white"
        onClick={() => openEditModal(row)}
      >
        <FaEdit />
      </button>
      <button
        className="p-2 bg-red-500 rounded hover:bg-red-600 text-white"
        onClick={() => handleDelete(row.userId)}
      >
        <FaTrash />
      </button>
    </div>
  );

  // =======================
  // Page Return
  // =======================
  return (
    <>
      <div className="p-6 bg-gray-900 rounded-4xl text-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-gray-100 font-bold">User Management</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            <FaPlus /> Add User
          </button>
        </div>

        {/* 🔍 Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="flex items-center bg-white border px-3 py-2 rounded shadow-sm">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search user..."
              className="w-full bg-transparent outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="bg-white border px-3 py-2 rounded shadow-sm"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value={"All"}>All Roles</option>
            {jobRole.roles?.map((role, idx) => (
              <option key={role.roleId + idx} value={role.roleName}>
                {role.roleName}
              </option>
            ))}
          </select>

          <select
            className="bg-white border px-3 py-2 rounded shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select
            className="bg-white border px-3 py-2 rounded shadow-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="nameAsc">Name A-Z</option>
            <option value="nameDesc">Name Z-A</option>
            <option value="dateNewest">Newest</option>
            <option value="dateOldest">Oldest</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No users found.</div>
        ) : (
          <Table
            columns={columns}
            data={filteredUsers}
            actionRenderer={actionRenderer}
          />
        )}

        {/* Modal Form */}
        <Modal
          isOpen={isModalOpen}
          title={`${formMode} User`}
          onClose={() => setIsModalOpen(false)}
        >
          <FormUser
            mode={formMode}
            initialData={selectedUser}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>

        {/* Confirm Delete */}
        <ConfirmDelete
          isOpen={isConfirmOpen}
          title="Delete User?"
          message="User deleted cannot be restored."
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </>
  );
}
