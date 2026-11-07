# EXIRE — Personal Discord Site

Responsive static personal site for Exire. Plain HTML, CSS and JavaScript; no framework, build step, backend, bot token, or secrets.

## Files
- `index.html` — page structure and content
- `styles.css` — responsive dark/purple design
- `script.js` — sidebar, active section, Discord copy/profile links
- `site-config.js` — public profile settings
- `favicon.svg` — ER browser icon

## Publish with GitHub Pages
1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and `/(root)`, then save.
4. Wait for the Pages deployment. GitHub displays the URL in Settings → Pages.

## Important
The site is static. It does not fetch Discord presence, messages, member counts, or server data. Do not add Discord bot tokens, passwords, or API secrets to this repository.

## Edit profile links
Change values in `site-config.js`. Leave optional URLs empty to hide those buttons.