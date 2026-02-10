/**
 * Clone SHIFT IN PARADIGMS website (rulmkeka.manus.space) to ./website
 * Run: npm run clone
 */
import scrape from 'website-scraper';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://rulmkeka.manus.space';
const OUT_DIR = path.join(__dirname, 'website');

// Ensure clean output (scraper requires directory to not exist)
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true });
}

const options = {
  urls: [
    { url: BASE + '/', filename: 'index.html' },
    { url: BASE + '/about.html', filename: 'about.html' },
    { url: BASE + '/forum.html', filename: 'forum.html' },
    { url: BASE + '/courses.html', filename: 'courses.html' },
    { url: BASE + '/vlog.html', filename: 'vlog.html' },
    { url: BASE + '/vlog-single.html', filename: 'vlog-single.html' },
    { url: BASE + '/login.html', filename: 'login.html' },
    { url: BASE + '/register.html', filename: 'register.html' },
    { url: BASE + '/terms.html', filename: 'terms.html' },
  ],
  directory: OUT_DIR,
  recursive: false,
  maxDepth: 2,
  urlFilter: (url) => url.startsWith(BASE),
  request: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  },
  ignoreErrors: true,
  subdirectories: [
    { directory: 'images', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'] },
    { directory: 'css', extensions: ['.css'] },
    { directory: 'js', extensions: ['.js'] },
  ],
};

console.log('Cloning', BASE, 'into', OUT_DIR, '...');
const result = await scrape(options);
console.log('Done. Saved', result.length, 'resource(s).');
console.log('Output folder:', OUT_DIR);
