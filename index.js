import { TwitterApi } from "twitter-api-v2";
import fs from "fs";
import path from "path";

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const rwClient = client.readWrite;

const IMAGES_FOLDER = "./images";
const STATE_FILE = "./last_index.json";

// --- Load index terakhir ---
function loadLastIndex() {
  if (!fs.existsSync(STATE_FILE)) return 0;
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")).lastIndex || 0;
  } catch {
    return 0;
  }
}

// --- Simpan index ---
function saveLastIndex(idx) {
  fs.writeFileSync(STATE_FILE, JSON.stringify({ lastIndex: idx }));
}

// --- Ambil gambar & urutkan berdasarkan angka ---
function getImageList() {
  const files = fs.readdirSync(IMAGES_FOLDER)
    .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f))
    .sort((a, b) => {
      // ambil angka dari nama file
      const numA = parseInt(a.match(/\d+/)?.[0] || 0);
      const numB = parseInt(b.match(/\d+/)?.[0] || 0);
      return numA - numB;
    })
    .map(f => path.join(IMAGES_FOLDER, f));
    
  return files;
}

// --- Kirim Tweet ---
async function postTweet() {
  try {
    const images = getImageList();
    if (images.length === 0) {
      console.log("⚠ Tidak ada gambar di folder /images");
      return;
    }

    let idx = loadLastIndex();
    if (idx >= images.length) idx = 0;

    const imgToPost = images[idx];
    console.log("➡ Posting:", imgToPost);

    const mediaId = await rwClient.v1.uploadMedia(imgToPost);

    const tweet = `
    `.trim();

    await rwClient.v2.tweet({
      text: tweet,
      media: { media_ids: [mediaId] }
    });

    console.log("✅ Tweet terkirim:", new Date().toLocaleString());
    saveLastIndex(idx + 1);

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

postTweet();

