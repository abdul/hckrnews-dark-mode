# 🌙 HckrNews Dark Mode Chrome Extension

A beautiful, accessible dark mode extension for [hckrnews.com](https://hckrnews.com) with **13 customizable themes**, WCAG-compliant colors, and instant toggling!

---

## ✨ Features

- **13 Premium Themes** - Choose from carefully curated code editor-inspired color schemes
- **WCAG AA Compliant** - All themes meet accessibility standards with proper contrast ratios
- **Instant Toggle** - Switch dark mode on/off via popup or in-page button
- **Auto-Refresh** - Automatically refresh the page at customizable intervals (5-3600 seconds)
- **Persistent Settings** - Your theme, mode preference, and refresh settings saved across sessions
- **Clean Navigation** - Subtle, modern styling for navigation links (top 10, top 20, etc.)
- **Lightweight & Fast** - No tracking, no analytics, no nonsense
- **Open Source** - Fully customizable and transparent

---

## 🎨 Available Themes

1. **Default** - Clean blue accents with balanced contrast
2. **Solarized Dark** - Classic precision color scheme
3. **Tomorrow Night** - Soft, pleasing tomorrow-inspired palette
4. **Dracula Official** - Popular purple and cyan theme
5. **Night Owl** - Optimized for night coding
6. **One Dark Pro** - VS Code's beloved dark theme
7. **Tokyo Night** - Vibrant colors inspired by Tokyo's neon nights
8. **Moonlight** - Smooth blue-purple gradients
9. **Cyberpunk 2077** - Neon cyan and yellow aesthetics
10. **Cobalt2** - High contrast with warm accents
11. **Noctis** - Warm, comfortable color scheme
12. **Catppuccin** - Soothing pastel dark theme
13. **Monokai Pro** - Modern take on classic Monokai

All themes feature:
- ✅ WCAG 2.1 AA compliant contrast ratios (4.5:1 for text, 7:1+ for links)
- ✅ Distinct colors for regular and visited links
- ✅ Accessible hover states without jarring brightness
- ✅ Colorblind-friendly palettes

---

## 📦 Installation

### From Source
1. Clone this repo:
   ```bash
   git clone https://github.com/abdul/hckrnews-dark-mode.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `hckrnews-dark-mode` folder
6. Visit [hckrnews.com](https://hckrnews.com) and enjoy!

---

## 🚀 Usage

### Switching Themes
1. Click the extension icon in your Chrome toolbar
2. Select your preferred theme from the dropdown
3. Theme applies instantly and saves automatically

### Toggling Dark Mode
- **Extension Popup**: Click the extension icon (shows current theme selection)
- **In-Page Button**: Use the toggle button in the top-right corner of the site
  - 🌙 Dark Mode - Activate dark mode
  - ☀️ Light Mode - Return to original light theme

### Auto-Refresh Settings
1. Click the extension icon in your Chrome toolbar
2. Check **Enable Auto Refresh** to turn on automatic page refreshing
3. Set **Interval (seconds)** to your desired refresh frequency
   - Minimum: 5 seconds
   - Maximum: 3600 seconds (1 hour)
   - Default: 60 seconds
4. Settings apply immediately and save automatically

Your preferences persist across:
- ✅ Browser sessions
- ✅ Multiple tabs
- ✅ Browser restarts

---

## 🎯 Accessibility Features

- **WCAG 2.1 AA Compliant** - All color combinations tested for accessibility
- **High Contrast Text** - Minimum 4.5:1 ratio for readability
- **Distinct Links** - Clear differentiation between regular and visited links
- **Smooth Hover States** - Color-shift hover effects (no bright opacity flashes)
- **Clean Navigation** - Minimal underline style for selected pages
- **Keyboard Friendly** - Full keyboard navigation support

---

## 🛠️ Technical Details

### Files Structure
```
hckrnews-dark-mode/
├── manifest.json       # Extension configuration
├── content.js          # Main script with themes, logic, and auto-refresh
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality
├── popup.css           # Popup styling
├── icon16.png          # Extension icon (16px)
├── icon48.png          # Extension icon (48px)
├── icon128.png         # Extension icon (128px)
└── README.md           # This file
```

### How It Works
1. Content script injects theme-specific CSS variables
2. Toggle button and popup communicate via Chrome storage API
3. Theme and auto-refresh preferences stored in `chrome.storage.sync`
4. CSS applied dynamically based on selected theme
5. Navigation elements styled with accessible underlines
6. Auto-refresh uses `setInterval` to reload page at specified intervals

---

## 📸 Screenshots

![Dark mode preview](hacker_news_mockup.png)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Add new themes to the `themes` object in `content.js`
   - Ensure WCAG AA compliance (use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
   - Update theme dropdown in `popup.html`
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Adding a New Theme
To add a new theme, edit `content.js`:

```javascript
themeName: `:root { 
  --bg-primary: #yourBg; 
  --bg-secondary: #yourSecondaryBg; 
  --text-primary: #yourText; 
  --accent: #yourAccent; 
  --link: #yourLink; 
  --visited: #yourVisited; 
  --selected-nav-text: #yourNavText; 
  --selected-nav-border: #yourNavBorder; 
  --hover-nav-text: #yourHoverText; 
}`,
```

Then add it to the dropdown in `popup.html`:
```html
<option value="themeName">Theme Display Name</option>
```

**Important**: Verify color contrast ratios meet WCAG AA standards!

---

## 👨‍💻 Author

**Abdul Qabiz**
- Website: [abdulqabiz.com](https://abdulqabiz.com)
- GitHub: [@abdul](https://github.com/abdul)
- Repository: [hckrnews-dark-mode](https://github.com/abdul/hckrnews-dark-mode)

---

## 📄 License

MIT License - feel free to use, modify, and distribute!

See [LICENSE](LICENSE) for full details.

---

## 🙏 Acknowledgments

- Inspired by the [Hacker News](https://news.ycombinator.com/) community
- Color schemes based on popular code editor themes
- Accessibility guidelines from [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- Built for [hckrnews.com](https://hckrnews.com) - an unofficial HN interface

---

## 🐛 Issues & Feedback

Found a bug or have a feature request?
- Open an issue on [GitHub](https://github.com/abdul/hckrnews-dark-mode/issues)
- Ensure WCAG compliance when suggesting color changes
- Include screenshots if reporting visual issues

---

**Enjoy your dark mode experience! 🌙✨**