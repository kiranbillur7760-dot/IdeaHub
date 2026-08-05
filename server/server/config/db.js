import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log("✅ MongoDB Connected Successfully");

    // ==========================
    // DEBUG INFORMATION
    // ==========================

    console.log("Database:", mongoose.connection.db.databaseName);
    console.log("Host:", mongoose.connection.host);

    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();

    console.log("========== DATABASES ==========");
    databases.databases.forEach((db) => {
      console.log(db.name);
    });
    console.log("================================");

  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;