# SHIFT IN PARADIGMS – Website

Static clone of the [SHIFT IN PARADIGMS](https://rulmkeka.manus.space) site for backup and GitHub hosting.

## Live site

- **Original:** https://rulmkeka.manus.space  
- **Forum:** https://rulmkeka.manus.space/forum

## What’s in this repo

| Path        | Contents                          |
|------------|------------------------------------|
| `website/` | Cloned static site (HTML, CSS, JS, images) |
| `clone-site.js` | Script to re-download the site      |
| `forum-reference.md` | Forum link and category reference   |

## Re-clone the site

To refresh the static copy from the live site:

```bash
npm install
npm run clone
```

This overwrites the `website/` folder with a fresh clone.

## Hosting on GitHub

1. **Push to GitHub:**  
   Create a new repo on GitHub and set visibility to **Private** (Repository → New → choose **Private**). Then:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SHIFT IN PARADIGMS site clone"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **GitHub Pages (free):**  
   - **Option A – Site at root:** Move everything from `website/` to the repo root (so `index.html` is at root). Then: **Settings → Pages → Deploy from a branch** → Branch: `main`, Folder: **/ (root)**.  
   - **Option B – Site in `/docs`:** Move the contents of `website/` into a folder named `docs/`. Then: **Settings → Pages** → Branch: `main`, Folder: **/docs**.  
   Your site will be at `https://<username>.github.io/<repo>/`.

3. **Custom domain:**  
   Add a `CNAME` file in the same folder as `index.html` containing your domain (e.g. `www.yoursite.com`).

## Notes

- **Private repo:** The source code stays visible only to you (and collaborators you add). If you enable GitHub Pages, the *published* site is still publicly accessible unless you use a plan that supports private Pages.
- The clone is **static only**. Forms, login, and forum posts still go to the live Manus site.
- Font Awesome is loaded from CDN; it will work as long as the browser can reach cdnjs.
