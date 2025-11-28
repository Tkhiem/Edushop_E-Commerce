import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    console.log("\n🔄 Connecting to MongoDB Atlas...\n");
    console.log(
      `Connection String: ${process.env.MONGODB_URI.replace(
        /:[^:]*@/,
        ":****@"
      )}\n`
    );

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("╔════════════════════════════════════════════╗");
    console.log("║  ✅ CONNECTION SUCCESSFUL!                ║");
    console.log("╠════════════════════════════════════════════╣");
    console.log(`║  📊 Database: ${mongoose.connection.name.padEnd(27)}║`);
    console.log(`║  🌍 Host: ${mongoose.connection.host.padEnd(31)}║`);
    console.log("╚════════════════════════════════════════════╝\n");

    await mongoose.disconnect();
    console.log("👋 Disconnected successfully.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n╔════════════════════════════════════════════╗");
    console.error("║  ❌ CONNECTION FAILED!                    ║");
    console.error("╚════════════════════════════════════════════╝\n");
    console.error(`Error: ${error.message}\n`);

    if (error.message.includes("authentication failed")) {
      console.error("💡 Tips:");
      console.error("   1. Check your password in .env file");
      console.error("   2. Make sure no < > around password");
      console.error("   3. If password has special chars, encode them\n");
    }

    if (error.message.includes("IP") || error.message.includes("whitelist")) {
      console.error("💡 Tips:");
      console.error("   1. Add IP 0.0.0.0/0 to Network Access");
      console.error("   2. Wait 1-2 minutes for changes to take effect\n");
    }

    process.exit(1);
  }
}

testConnection();
