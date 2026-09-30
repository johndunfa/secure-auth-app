"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // MUST be the first import — loads .env into process.env
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = Number(process.env.PORT) || 5000;
const start = async () => {
    // 1. Connect to MongoDB Atlas first
    await (0, db_1.connectDB)();
    // 2. Then start listening
    app_1.default.listen(PORT, () => {
        console.log("");
        console.log("=================================================");
        console.log(`🚀 API running at   http://localhost:${PORT}`);
        console.log(`   Health check     http://localhost:${PORT}/api/health`);
        console.log(`   Allowed client   ${process.env.CLIENT_URL}`);
        console.log(`   Environment      ${process.env.NODE_ENV}`);
        console.log("=================================================");
        console.log("");
    });
};
// Catch unhandled errors from async startup
start().catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
});
/* ----------------------- Graceful shutdown ----------------------- */
const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map