# AI & Automation Portfolio

A premium, high-performance personal portfolio website built with **pure HTML, CSS, and JavaScript** — zero dependencies, zero build step, opens instantly in any browser.

## 🚀 Quick Start

Just open `index.html` in your browser. No npm, no build tools needed.

```bash
# Option 1: Open directly
start index.html

# Option 2: Serve locally (Python)
python -m http.server 8080
# Then visit http://localhost:8080

# Option 3: Serve locally (Node)
npx serve .
```

## 📁 File Structure

```
portfolio/
├── index.html      ← Main page (all sections)
├── style.css       ← Design system + all styles
├── script.js       ← Vanilla JS (menu, scroll, animations)
└── README.md       ← This file
```

## 🌐 Deploy to Vercel (Free, 30 seconds)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Upload the `portfolio/` folder **or** push it to a GitHub repo and import
4. Vercel auto-detects it as a static site — click **Deploy**
5. Your site is live at `https://your-project.vercel.app`

### Custom Domain
In Vercel dashboard → Project → Settings → Domains → Add your domain.

## 🌐 Deploy to Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `portfolio/` folder onto the deploy zone
3. Done — live in seconds.

## ✏️ Customization Checklist

| What to change | Where |
|---|---|
| Your name | `index.html` → `<title>`, hero section, footer |
| Email address | `index.html` → contact section `href="mailto:..."` |
| LinkedIn URL | `index.html` → all `href="https://linkedin.com/"` |
| GitHub URL | `index.html` → all `href="https://github.com/"` |
| Project details | `index.html` → `#projects` section |
| Certifications | `index.html` → `#exposure` section |
| Accent color | `style.css` → `--accent: #4f8ef7` |

## ⚡ Performance

- **No JavaScript frameworks** — pure vanilla JS (~3KB)
- **No CSS frameworks** — hand-crafted CSS (~8KB)
- **No external dependencies** — only Google Fonts (preconnected)
- **Lazy loading** via IntersectionObserver
- **Expected Lighthouse score: 95–100** across all categories

## 🎨 Design System

- **Colors**: Dark background `#0a0a0a` + Blue accent `#4f8ef7`
- **Font**: Inter (Google Fonts)
- **Style**: Apple/Stripe-inspired minimalism
- **Mode**: Dark mode only

## 💡 Conversion Rate Tips

1. **Update the hero badge** — "Available for Projects" signals availability immediately
2. **Add real project results** — replace placeholder metrics with actual numbers
3. **Add a profile photo** — humanizes the brand significantly
4. **Link real GitHub repos** — builds instant credibility
5. **Add a Calendly link** — reduces friction for booking calls
