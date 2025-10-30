// HckrNews Dark Mode - Content Script

(function() {
    'use strict';

    console.log('[HckrNews Dark Mode] Content script loaded');

    // Dark mode CSS
    const darkModeCSS = `
        :root {
            --bg-primary: #1a1a1a;
            --bg-secondary: #2d2d2d;
            --text-primary: #e4e4e7;
            --text-secondary: #a1a1aa;
            --text-muted: #71717a;
            --accent-orange: #fb923c;
            --accent-orange-hover: #f97316;
            --border-color: #404040;
            --link-color: #60a5fa;
            --link-visited: #a78bfa;
        }

        body.dark-mode {
            background-color: #1a1a1a !important;
            color: #e4e4e7 !important;
        }

        body.dark-mode,
        body.dark-mode * {
            background-color: #1a1a1a !important;
            color: #e4e4e7 !important;
        }

        body.dark-mode a {
            color: #60a5fa !important;
        }

        body.dark-mode a:visited {
            color: #a78bfa !important;
        }

        body.dark-mode a:hover {
            color: #f97316 !important;
            text-decoration: underline;
        }

        body.dark-mode input,
        body.dark-mode textarea,
        body.dark-mode select {
            background-color: #2d2d2d !important;
            color: #e4e4e7 !important;
            border: 1px solid #404040 !important;
        }

        body.dark-mode input::placeholder,
        body.dark-mode textarea::placeholder {
            color: #a1a1aa !important;
        }

        body.dark-mode input[type="submit"],
        body.dark-mode button {
            background-color: #fb923c !important;
            color: #1a1a1a !important;
            border: none !important;
            padding: 6px 12px;
            border-radius: 3px;
        }

        body.dark-mode input[type="submit"]:hover,
        body.dark-mode button:hover {
            background-color: #f97316 !important;
        }

        body.dark-mode table,
        body.dark-mode tr,
        body.dark-mode td {
            border-color: #404040 !important;
        }

        body.dark-mode code,
        body.dark-mode pre {
            background-color: #2d2d2d !important;
            color: #e4e4e7 !important;
            border: 1px solid #404040 !important;
        }

        .hckr-dark-toggle {
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 99999;
            background-color: #fb923c !important;
            color: white !important;
            border: none !important;
            padding: 10px 15px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 13px !important;
            font-weight: bold !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
            transition: all 0.2s ease !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        .hckr-dark-toggle:hover {
            background-color: #f97316 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }

        body.dark-mode .hckr-dark-toggle {
            background-color: #2d2d2d !important;
            color: #e4e4e7 !important;
            border: 1px solid #404040 !important;
        }

        body.dark-mode .hckr-dark-toggle:hover {
            background-color: #404040 !important;
        }
    `;

    // Inject CSS
    function injectCSS() {
        let styleTag = document.getElementById('hckr-dark-mode-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'hckr-dark-mode-style';
            styleTag.innerHTML = darkModeCSS;
            document.documentElement.appendChild(styleTag);
            console.log('[HckrNews Dark Mode] CSS injected');
        }
    }

    // Inject CSS immediately
    injectCSS();

    let darkModeEnabled = false;

    // Load saved preference
    chrome.storage.sync.get(['darkModeEnabled'], function(result) {
        darkModeEnabled = result.darkModeEnabled || false;
        console.log('[HckrNews Dark Mode] Loaded preference:', darkModeEnabled);
        applyDarkMode(darkModeEnabled);
        createToggleButton();
    });

    // Apply or remove dark mode
    function applyDarkMode(enabled) {
        console.log('[HckrNews Dark Mode] Applying dark mode:', enabled);
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Create toggle button
    function createToggleButton() {
        // Remove old button if exists
        const oldBtn = document.querySelector('.hckr-dark-toggle');
        if (oldBtn) oldBtn.remove();

        // Create new button
        const btn = document.createElement('button');
        btn.className = 'hckr-dark-toggle';
        btn.innerHTML = darkModeEnabled ? '☀️ Light Mode' : '🌙 Dark Mode';
        btn.title = 'Toggle dark mode for HckrNews';

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            darkModeEnabled = !darkModeEnabled;
            applyDarkMode(darkModeEnabled);
            chrome.storage.sync.set({ darkModeEnabled: darkModeEnabled });
            btn.innerHTML = darkModeEnabled ? '☀️ Light Mode' : '🌙 Dark Mode';
            console.log('[HckrNews Dark Mode] Toggled to:', darkModeEnabled);
        });

        document.body.appendChild(btn);
        console.log('[HckrNews Dark Mode] Toggle button created');
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'toggleDarkMode') {
            darkModeEnabled = !darkModeEnabled;
            applyDarkMode(darkModeEnabled);
            chrome.storage.sync.set({ darkModeEnabled: darkModeEnabled });
            sendResponse({ darkModeEnabled: darkModeEnabled });
        } else if (request.action === 'getDarkModeState') {
            sendResponse({ darkModeEnabled: darkModeEnabled });
        }
    });

    // Re-create button if page modifies DOM
    const observer = new MutationObserver(() => {
        if (!document.querySelector('.hckr-dark-toggle') && document.body) {
            createToggleButton();
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true });
    }
})();
