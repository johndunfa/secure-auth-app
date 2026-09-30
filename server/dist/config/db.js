"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.trim().length === 0) {
        console.error("❌ MONGODB_URI is not defined. Check your .env file.");
        process.exit(1);
    }
    try {
        mongoose_1.default.set("strictQuery", true);
        const conn = await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 10_000,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map