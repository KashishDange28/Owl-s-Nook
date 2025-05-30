import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60000, // 60 seconds timeout to avoid premature request timeouts
});

async function testCloudinary() {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      { folder: "test_uploads" }
    );
    console.log("✅ Cloudinary test upload success:", result.public_id);
  } catch (error) {
    console.error("❌ Cloudinary test upload error:", error);
  }
}

// Run test only if this file is run directly (optional)
if (process.argv[1].endsWith("cloudinary.js")) {
  testCloudinary();
}

export default cloudinary;
