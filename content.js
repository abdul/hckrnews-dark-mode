(function() {
    'use strict';

    // ---- THEMES ---- (add more presets as needed)
    const themes = {
        default: `:root { --bg-primary: #1a1b1e; --bg-secondary: #23272f; --text-primary: #e8e6e3; --accent: #ff8c42; --link: #64a9ff; --visited: #b392f0; --selected-nav-text: #64a9ff; --selected-nav-border: #64a9ff; --hover-nav-text: #4a8cd4; }`,
        solarizedDark: `:root { --bg-primary: #002b36; --bg-secondary: #073642; --text-primary: #93a1a1; --accent: #cb4b16; --link: #2aa198; --visited: #6c71c4; --selected-nav-text: #2aa198; --selected-nav-border: #2aa198; --hover-nav-text: #268bd2; }`,
        tomorrowNight: `:root { --bg-primary: #1d1f21; --bg-secondary: #282a2e; --text-primary: #c5c8c6; --accent: #81a2be; --link: #8abeb7; --visited: #b294bb; --selected-nav-text: #8abeb7; --selected-nav-border: #8abeb7; --hover-nav-text: #70a8a0; }`,
        dracula: `:root { --bg-primary: #282a36; --bg-secondary: #21222c; --text-primary: #f8f8f2; --accent: #bd93f9; --link: #8be9fd; --visited: #ff79c6; --selected-nav-text: #8be9fd; --selected-nav-border: #8be9fd; --hover-nav-text: #6fc9dc; }`,
        nightOwl: `:root { --bg-primary: #011627; --bg-secondary: #001a2b; --text-primary: #d6deeb; --accent: #82aaff; --link: #80cbc4; --visited: #c792ea; --selected-nav-text: #80cbc4; --selected-nav-border: #80cbc4; --hover-nav-text: #5fb3a8; }`,
        oneDarkPro: `:root { --bg-primary: #282c34; --bg-secondary: #21252b; --text-primary: #abb2bf; --accent: #e06c75; --link: #61afef; --visited: #c678dd; --selected-nav-text: #61afef; --selected-nav-border: #61afef; --hover-nav-text: #528bcc; }`,
        tokyoNight: `:root { --bg-primary: #1a1b26; --bg-secondary: #16161e; --text-primary: #c0caf5; --accent: #7aa2f7; --link: #7dcfff; --visited: #bb9af7; --selected-nav-text: #7dcfff; --selected-nav-border: #7dcfff; --hover-nav-text: #5fb5e0; }`,
        moonlight: `:root { --bg-primary: #222436; --bg-secondary: #1e2030; --text-primary: #c8d3f5; --accent: #82aaff; --link: #86e1fc; --visited: #c099ff; --selected-nav-text: #86e1fc; --selected-nav-border: #86e1fc; --hover-nav-text: #65c4e0; }`,
        cyberpunk2077: `:root { --bg-primary: #0f111a; --bg-secondary: #181e27; --text-primary: #00e8d4; --accent: #ffed4e; --link: #00e8d4; --visited: #ea00d9; --selected-nav-text: #00e8d4; --selected-nav-border: #00e8d4; --hover-nav-text: #00c4b3; }`,
        cobalt2: `:root { --bg-primary: #193549; --bg-secondary: #122738; --text-primary: #ffffff; --accent: #ffc600; --link: #80cbc4; --visited: #ff628c; --selected-nav-text: #80cbc4; --selected-nav-border: #80cbc4; --hover-nav-text: #5fb3a8; }`,
        noctis: `:root { --bg-primary: #1b2932; --bg-secondary: #222e38; --text-primary: #e6b673; --accent: #ff9800; --link: #49ace9; --visited: #df769b; --selected-nav-text: #49ace9; --selected-nav-border: #49ace9; --hover-nav-text: #3a8fc2; }`,
        catppuccin: `:root { --bg-primary: #1e1e2e; --bg-secondary: #181825; --text-primary: #cdd6f4; --accent: #cba6f7; --link: #89dceb; --visited: #f5c2e7; --selected-nav-text: #89dceb; --selected-nav-border: #89dceb; --hover-nav-text: #6bc2d0; }`,
        monokaiPro: `:root { --bg-primary: #2d2a2e; --bg-secondary: #221f22; --text-primary: #fcfcfa; --accent: #fc9867; --link: #78dce8; --visited: #ab9df2; --selected-nav-text: #78dce8; --selected-nav-border: #78dce8; --hover-nav-text: #5bb9c8; }`,
    };

    function getBaseCss() {
        return `
            body.dark-mode { background: var(--bg-primary) !important; color: var(--text-primary) !important;}
            body.dark-mode a { color: var(--link) !important;}
            body.dark-mode a:visited { color: var(--visited) !important;}
            body.dark-mode .selected,
            body.dark-mode .active,
            body.dark-mode a[aria-current="page"],
            body.dark-mode a.selected,
            body.dark-mode a.active {
                background: transparent !important;
                color: var(--selected-nav-text) !important;
                border-bottom: 2px solid var(--selected-nav-border) !important;
                padding: 4px 0px !important;
                margin: 0 8px !important;
                font-weight: 500 !important;
                border-radius: 0px !important;
                text-decoration: none !important;
            }
            body.dark-mode .selected:hover,
            body.dark-mode .active:hover,
            body.dark-mode a[aria-current="page"]:hover,
            body.dark-mode a.selected:hover,
            body.dark-mode a.active:hover {
                color: var(--hover-nav-text) !important;
                border-bottom-color: var(--hover-nav-text) !important;
            }
        `;
    }

    function getToggleButtonCss() {
        return `
            .hckr-dark-toggle { position: fixed; top: 15px; right: 15px; z-index: 99999; background: #fb923c; color: #181a1b; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.4); }
            body.dark-mode .hckr-dark-toggle { background: var(--accent); color: var(--bg-primary); }
        `;
    }

    function injectThemeCSS(themeName) {
        let styleTag = document.getElementById('hckr-dark-mode-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'hckr-dark-mode-style';
            document.documentElement.appendChild(styleTag);
        }
        styleTag.innerHTML = (themes[themeName] || themes['default']) + getBaseCss();
    }

    function injectToggleButtonCSS() {
        let toggleStyleTag = document.getElementById('hckr-toggle-button-style');
        if (!toggleStyleTag) {
            toggleStyleTag = document.createElement('style');
            toggleStyleTag.id = 'hckr-toggle-button-style';
            document.documentElement.appendChild(toggleStyleTag);
        }
        toggleStyleTag.innerHTML = getToggleButtonCss();
    }

    let darkModeEnabled = false;
    let currentTheme = 'default';

    function applyDarkMode(enabled) {
        let styleTag = document.getElementById('hckr-dark-mode-style');
        if (enabled) {
            document.body.classList.add('dark-mode');
            injectThemeCSS(currentTheme); // Only inject when darkModeEnabled = true
        } else {
            document.body.classList.remove('dark-mode');
            if (styleTag) styleTag.remove(); // Remove theme styles but keep toggle button
        }
        injectToggleButtonCSS(); // Always keep toggle button styles
        updateToggleButton(enabled);
    }

    // Toggle button logic
    function updateToggleButton(enabled) {
        let btn = document.querySelector('.hckr-dark-toggle');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'hckr-dark-toggle';
            document.body.appendChild(btn);
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                darkModeEnabled = !darkModeEnabled;
                applyDarkMode(darkModeEnabled);
                chrome.storage.sync.set({ darkModeEnabled: darkModeEnabled });
            });
        }
        btn.textContent = enabled ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    // Initial load
    chrome.storage.sync.get(['theme', 'darkModeEnabled'], function(result) {
        currentTheme = result.theme || 'default';
        darkModeEnabled = result.darkModeEnabled !== undefined ? result.darkModeEnabled : true;
        applyDarkMode(darkModeEnabled);
    });

    // Listen for theme change messages
    chrome.runtime.onMessage.addListener(function(request) {
        if (request.action === 'setTheme' && request.theme) {
            currentTheme = request.theme;
            chrome.storage.sync.set({ theme: currentTheme });
            if (document.body.classList.contains('dark-mode')) injectThemeCSS(currentTheme);
        }
    });

})();
