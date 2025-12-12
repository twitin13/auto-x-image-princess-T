import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';

// Ambil environment variables dari GitHub Secrets
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

(async () => {
  try {
    // 📝 Isi tweet kamu di sini (nanti aku bantu isi sesuai request kamu)
    const textTweet = `
Shopeefood Diskon 70% s/d 19rb minbel 20K. Resto tertentu, akun tertentu 🍒🥧

Cek dan klaim di resto ini 👇
https://spf.shopee.co.id/9pWwmb8Mfi
https://spf.shopee.co.id/9pWwmb8Mfi

Gofood grabfood kode promo go grab shopee food sfood voucher daget gojek gratis ongkir minggu malming
`;

    // 📸 Upload 1 gambar dari repo
    const mediaId = await client.v1.uploadMedia('1.jpg');

    // 🐦 Kirim tweet dengan teks + gambar
    const tweet = await client.v2.tweet({
      text: textTweet,
      media: { media_ids: [mediaId] },
    });

    console.log('✅ Tweet terkirim:', tweet.data.id);
  } catch (error) {
    console.error('❌ Gagal kirim tweet:', error);
  }
})();

