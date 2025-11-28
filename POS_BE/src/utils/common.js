const success = (res, data) => {
  return res.status(200).json({
    status: true,
    message: "Success",
    data,
  });
};

const error = (res, message, code) => {
  return res.status(code).json({
    status: false,
    data: message,
  });
};

module.exports = { success, error };
