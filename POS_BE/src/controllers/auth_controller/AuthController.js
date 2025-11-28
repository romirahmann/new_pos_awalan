const authModel = require("../../models/auth.model");
const {
  verifyPassword,
  generateToken,
} = require("../../services/auth.service");
const api = require("../../utils/common");

const login = async (req, res) => {
  let { username, password } = req.body;
  try {
    if (!username || !password)
      return api.error(res, "Username & Password Required!", 401);

    const user = await authModel.login(username);
    if (!user) return api.error(res, "User Not Found!", 404);

    const passwordIsMatch = await verifyPassword(password, user.password);
    if (!passwordIsMatch) return api.error(res, "Incorrect Password!", 401);

    const payload = {
      userId: user.userId,
      username: user.username,
      fullname: user.fullname,
      roleId: user.roleId,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      roleId: user.roleId,
      roleName: user.roleName,
      jobdeskId: user.jobdeskId,
      jobdeskName: user.jobdeskName,
    };

    const token = generateToken(payload);

    return api.success(res, { token, user: payload });
  } catch (error) {
    console.log(error);
    return api.error(res, "Login Failed!", 500);
  }
};

module.exports = {
  login,
};
