const { server } = require("./src/app");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3030";

server.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
});
