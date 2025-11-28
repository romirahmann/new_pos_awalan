const db = require("../database/db.config");

const login = async (username) =>
  await db
    .select(
      "u.userId",
      "u.username",
      "u.email",
      "u.password",
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
    .where("username", username)
    .first();

module.exports = {
  login,
};
