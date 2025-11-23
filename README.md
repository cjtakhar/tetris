Here is a **clean, modern, beautifully styled README.md** you can drop directly into your GitHub repo.

It matches your tech stack (React + TypeScript + Vite + React Router + Tetris clone).
It also shows off features like ghost piece, high scores, modern UI, GitHub Pages deploy, etc.

Copy/paste the entire thing into `README.md`.

---

# 🎮 Modern Tetris — React + TypeScript + Vite

A fully featured, modern-styled **Tetris clone** built with React, TypeScript, and Vite — deployed on GitHub Pages.
Includes quality-of-life features like ghost pieces, high-score persistence, a Nintendo-inspired top bar, animations, and a glassy dark UI.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-purple.svg?logo=vite" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/React_Router-6-orange?logo=reactrouter" />
</p>

---

## 🚀 Live Demo

**▶️ Play the game here:**
👉 [https://cjtakhar.github.io/tetris/](https://cjtakhar.github.io/tetris/)

---

## ✨ Features

### 🧱 Core Gameplay

* Smooth, fully functional **Tetris engine**
* Accurate tetromino rotations
* Soft drop + hard drop
* Clean collision + line-clearing logic
* Increasing speed based on lines cleared
* Next piece preview panel

### 👻 Quality of Life

* **Ghost piece** that shows landing position
* **High score saved in localStorage**
* **Start screen overlay** with instructions
* Polished controls + input handling

### 🎨 Modern UI

* Beautiful glassmorphism-inspired design
* Soft shadows, smooth transitions, and cohesive color palette
* Nintendo-style header bar
* Responsive layout
* Styled buttons + cards

### 🌐 GitHub Pages Ready

* Works with Vite’s build system and `base` path
* Wrapped in `<BrowserRouter basename="/tetris">`
* Automatic deployment support

---

## 🧩 Controls

| Action          | Key    |
| --------------- | ------ |
| Move left       | ←      |
| Move right      | →      |
| Rotate          | ↑ or X |
| Soft drop       | ↓      |
| Hard drop       | Space  |
| Start / Restart | Enter  |

---

## 🛠️ Tech Stack

* **React 18 + TypeScript**
* **Vite** (super-fast dev + build)
* **React Router** (`BrowserRouter` with basename)
* **Custom CSS** (modern gradients, glassy UI)
* **LocalStorage** (persistent high scores)

---

## 📦 Getting Started

Clone the repo:

```bash
git clone https://github.com/cjtakhar/tetris.git
cd tetris
```

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deployment (GitHub Pages)

This project is configured to work perfectly with GitHub Pages.

### `vite.config.ts`

Make sure you have:

```ts
export default defineConfig({
  plugins: [react()],
  base: "/tetris/", // repo name
});
```

### `main.tsx`

Router must include the correct basename:

```tsx
<BrowserRouter basename="/tetris">
  <App />
</BrowserRouter>
```

Deploying GitHub Pages from `/dist` or using GitHub Actions will now work correctly.

---

## 🧠 Project Structure

```
tetris/
├── public/
├── src/
│   ├── TetrisGame.tsx       # Main game logic + rendering
│   ├── Tetris.css           # Modern styling
│   ├── App.tsx              # Router + route definitions
│   ├── main.tsx             # BrowserRouter w/ basename
│   └── ...
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🖼️ Screenshots

*
You can drop screenshots into a `/screenshots` folder and update:

```md
![Screenshot](screenshots/gameplay.png)
```

---

## 🧩 Future Ideas

* 🔊 Sound effects + background music
* 🌙 Light/dark theme toggle
* 🧠 AI opponent (plays Tetris for you)
* 💥 Particle effects on line clears
* 📱 Fully responsive mobile-optimized layout

---

## ❤️ Acknowledgements

Inspired by classic Nintendo Tetris and modern UI design principles.
Built with love using open-source tools.

---

## ✨ License

MIT — free for personal and commercial use.

---

