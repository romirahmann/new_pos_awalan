const db = require("../database/db.config");

const getAll = async () =>
  await db("users as u")
    .select(
      "u.userId",
      "u.username",
      "u.email",
      "u.roleId",
      "u.fullname",
      "u.isActive",
      "u.createdAt",
      "u.jobdeskId",
      "r.roleName",
      "j.jobdeskName"
    )
    .from("users as u")
    .innerJoin("user_roles as r", "r.roleId", "u.roleId")
    .innerJoin("jobdesk as j", "j.jobdeskId", "u.jobdeskId");

const getById = async (userId) =>
  await db("users as u")
    .select(
      "u.userId",
      "u.username",
      "u.email",
      "u.roleId",
      "u.fullname",
      "u.isActive",
      "u.createdAt",
      "u.jobdeskId",
      "r.roleName",
      "j.jobdeskName"
    )
    .from("users as u")
    .innerJoin("user_roles as r", "r.roleId", "u.roleId")
    .innerJoin("jobdesk as j", "j.jobdeskId", "u.jobdeskId")
    .where({ userId });

const register = async (data) => await db("users").insert(data);

const updated = async (userId, data) =>
  await db("users").where({ userId }).update(data);

const deleted = async (userId) => await db("users").where({ userId }).del();

// JOBDESK
const getAllJobdesk = async () => db.select("*").from("jobdesk");
const getJobdeskId = async (jobdeskId) =>
  db.select("*").from("jobdesk").where({ jobdeskId }).first();
const insertJobdesk = async (data) => db("jobdesk").insert(data);
const updateJobdesk = async (data, jobdeskId) =>
  db("jobdesk").where({ jobdeskId }).update(data);
const deleteJobdesk = async (jobdeskId) =>
  db("jobdesk").where({ jobdeskId }).del();

// Roles
const getRoles = async () => db.select("*").from("user_roles");

module.exports = {
  register,
  updated,
  deleted,
  getAll,
  getById,
  getAllJobdesk,
  getJobdeskId,
  insertJobdesk,
  updateJobdesk,
  deleteJobdesk,
  getRoles,
};
