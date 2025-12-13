import fs from "fs";
import { TwitterApi } from "twitter-api-v2";

// ===== X CLIENT =====
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const rwClient = client.readWrite;

// ===== MAIN =====
async function main() {
  try {
    const files = fs
      .readdirSync("./images")
      .filter(f => f.match(/\.(jpg|jpeg|png)$/i));

    if (files.length === 0) {
      throw new Error("Folder images kosong");
    }

    const randomImage = files[Math.floor(Math.random() * files.length)];
    const imagePath = `./images/${randomImage}`;

    const mediaId = await rwClient.v1.uploadMedia(imagePath);

    await rwClient.v2.tweet({
      text: "",
      media: { media_ids: [mediaId] },
    });

    console.log("✅ Tweet terkirim:", randomImage);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
