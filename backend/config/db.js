import mongoose from "mongoose";

/**
 * Mask sensitive credentials in database connection URI for safe logging.
 */
const maskUri = (uri) => {
  if (!uri) return "";
  return uri.replace(/\/\/(.*):(.*)@/, "//***:***@");
};

/**
 * Initialize MongoDB Connection with Local & Atlas Detection.
 * Disables query buffering to fail-fast when DB is offline instead of hanging 10 seconds.
 */
const connectDB = async () => {
  // Disable Mongoose buffering so queries fail immediately (0ms) when DB is offline
  mongoose.set("bufferCommands", false);

  const urisToTry = [];

  if (process.env.MONGO_URI) urisToTry.push({ type: "MONGO_URI", url: process.env.MONGO_URI });
  if (process.env.MONGODB_URI && process.env.MONGODB_URI !== process.env.MONGO_URI) {
    urisToTry.push({ type: "MONGODB_URI", url: process.env.MONGODB_URI });
  }
  if (process.env.MONGO_ATLAS_URI) urisToTry.push({ type: "MONGO_ATLAS_URI", url: process.env.MONGO_ATLAS_URI });

  // Default local fallback if no URIs listed
  if (urisToTry.length === 0) {
    urisToTry.push({ type: "Local MongoDB Default", url: "mongodb://127.0.0.1:27017/fittrack" });
  }

  for (const item of urisToTry) {
    try {
      console.log(`📡 Connecting to MongoDB (${item.type}: ${maskUri(item.url)})...`);

      await mongoose.connect(item.url, {
        serverSelectionTimeoutMS: 4000, // Fail fast after 4 seconds
        connectTimeoutMS: 5000,
      });

      console.log(`=======================================================`);
      console.log(`✅ MongoDB Connected Successfully!`);
      console.log(`   Source: ${item.type}`);
      console.log(`   URI:    ${maskUri(item.url)}`);
      console.log(`=======================================================`);
      return true;
    } catch (err) {
      console.warn(`⚠️ Failed connecting to ${item.type}: ${err.message}`);
    }
  }

  // If all connection attempts fail:
  console.error(`\n=======================================================`);
  console.error(`❌ MONGODB CONNECTION FAILED!`);
  console.error(`   Local MongoDB is NOT running on 127.0.0.1:27017.`);
  console.error(`   Please start your local MongoDB service:`);
  console.error(`     - Windows: net start MongoDB (or start MongoDB service)`);
  console.error(`     - Mac/Linux: sudo systemctl start mongod`);
  console.error(`   OR provide a valid MONGO_ATLAS_URI in backend/.env.`);
  console.error(`=======================================================\n`);

  return false;
};

export default connectDB;