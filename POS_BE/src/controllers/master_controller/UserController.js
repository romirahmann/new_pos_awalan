const userModel = require("../../models/user.model");
const { hashPassword } = require("../../services/auth.service");
const api = require("../../utils/common");
const { emit } = require("../../services/socket.service");

/* ============================================================
   GET ALL USERS
============================================================ */
const getAllUser = async (req, res) => {
  try {
    const users = await userModel.getAll();
    return api.success(res, users);
  } catch (error) {
    console.error("❌ Error getAllUser:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   GET USER BY ID
============================================================ */
const getUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getById(id);
    if (!user) return api.error(res, "User not found", 404);
    return api.success(res, user);
  } catch (error) {
    console.error("❌ Error getUserByID:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   REGISTER / CREATE USER
============================================================ */
const register = async (req, res) => {
  const data = req.body;
  try {
    if (!data?.username || !data?.password)
      return api.error(res, "Username & password required!", 400);

    data.password = await hashPassword(data.password);

    const result = await userModel.register(data);

    emit("user:created", {
      message: "New user registered",
      user: { id: result[0], username: data.username },
    });

    return api.success(res, { id: result[0], username: data.username });
  } catch (error) {
    console.error("❌ Error register:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   UPDATE USER
============================================================ */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existing = await userModel.getById(id);
    if (!existing) return api.error(res, "User not found", 404);

    await userModel.updated(id, data);

    emit("user:updated", {
      message: "User data updated",
      userId: id,
      changes: data,
    });

    return api.success(res, { id, ...data });
  } catch (error) {
    console.error("❌ Error updateUser:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

/* ============================================================
   DELETE USER
============================================================ */
const deletedUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.getById(id);
    if (!user) return api.error(res, "User not found", 404);

    await userModel.deleted(id);

    emit("user:deleted", {
      message: "User deleted",
      userId: id,
      username: user.username,
    });

    return api.success(res, { id, username: user.username });
  } catch (error) {
    console.error("❌ Error deletedUser:", error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const getJobdeskRole = async (req, res) => {
  try {
    let jobdesk = await userModel.getAllJobdesk();
    let roles = await userModel.getRoles();

    return api.success(res, { jobdesk, roles });
  } catch (error) {
    console.log(error);
  }
};

/* ============================================================
   EXPORT MODULE
============================================================ */
module.exports = {
  getAllUser,
  getUserByID,
  register,
  updateUser,
  deletedUser,
  getJobdeskRole,
};
