require("dotenv").config();
const http = require("http");

const app = require("./app");
const { setupSocketServer } = require("./websocket/chatSocket");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Database!");

    const server = http.createServer(app);
    setupSocketServer(server);

    server.listen(PORT, () => {
      console.log(`✔ Server running on port ${PORT}`);
      console.log(`✔ ENV: ${process.env.NODE_ENV}`);
      console.log(`✔ API: http://localhost:${PORT}/api/v1`);
    });
  } catch (err) {
    console.error("Database Connection Error:", err);
    process.exit(1);
  }
};

startServer();
