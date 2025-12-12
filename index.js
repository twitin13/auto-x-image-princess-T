import fs from "fs-extra";
import path from "path";
import { TwitterApi } from "twitter-api-v2";

// Gunakan ENV X_API_KEY bukan TWITTER_API_KEY
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const rwClient = client.readWrite;

async function main() {
  const imgFolder = "./images";
  const indexFile = "./current_index.json";

  // baca daftar gambar
  const images = fs
    .readdirSync(imgFolder)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort(); // biar urut

  if (images.length === 0) {
    console.log("Tidak ada foto dalam folder images.");
    return;
  }

  // baca index sekarang
  let idx = 0;
  if (fs.existsSync(indexFile)) {
    idx = JSON.parse(fs.readFileSync(indexFile, "utf8")).index || 0;
  }

  // ambil gambar
  const imageName = images[idx];
  const filePath = path.join(imgFolder, imageName);

  console.log(`📸 Posting gambar ke-${idx + 1}: ${imageName}`);

  // upload media
  const mediaId = await rwClient.v1.uploadMedia(filePath);

  // tweet
  await rwClient.v2.tweet({
    text: "✨", // edit caption di sini
    media: { media_ids: [mediaId] },
  });

  console.log("✔ Tweet terkirim:", imageName);

  // next index
  let nextIdx = idx + 1;
  if (nextIdx >= images.length) {
    nextIdx = 0; // kembali ke awal
  }

  // simpan index
  fs.writeFileSync(indexFile, JSON.stringify({ index: nextIdx }, null, 2));
  console.log(`➡ Next tweet index: ${nextIdx + 1}`);
}

main();
