# Śpiewnik — Deploy to GitHub Pages

This folder contains a small static songbook. The repository can be published to GitHub Pages so you can open it on your smartphone via HTTPS.

Quick steps to publish (replace USERNAME and REPO):

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

After pushing, GitHub Actions (workflow included) will build and publish the site to the `gh-pages` branch. The site will be available at:

```
https://USERNAME.github.io/REPO/
```

Notes:
- Make the repository public (recommended) so the Pages site is accessible without authentication.
- The workflow uses the built-in `GITHUB_TOKEN` so no extra secrets are required.
- If you rename files, push again — the workflow redeploys on every push to `main`.
