import fs from "fs";
import path from "path";
import { TwitterApi } from "twitter-api-v2";

// === CLIENT X ===
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const rwClient = client.readWrite;

// === CONFIG ===
const IMAGE_FOLDER = "./images";
const TOTAL_IMAGES = 11;
const INDEX_FILE = "./current_index.json";

async function main() {
  try {
    // === LOAD INDEX ===
    let index = 0;
    if (fs.existsSync(INDEX_FILE)) {
      index = Number(fs.readFileSync(INDEX_FILE, "utf8"));
    }

    // === PILIH GAMBAR ===
    const imageNumber = (index % TOTAL_IMAGES) + 1;
    const imagePath = path.join(IMAGE_FOLDER, `img${imageNumber}.jpg`);

    console.log("Upload:", imagePath);

    // === UPLOAD GAMBAR ===
    const mediaId = await rwClient.v1.uploadMedia(imagePath);

    // === TWEET (NO TEXT) ===
    await rwClient.v2.tweet({
      text: "",
      media: { media_ids: [mediaId] },
    });

    console.log(`✅ Tweet image img${imageNumber}.jpg terkirim`);

    // === SIMPAN INDEX BARU ===
    fs.writeFileSync(INDEX_FILE, String(index + 1));
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

// === RUN ===
main();
