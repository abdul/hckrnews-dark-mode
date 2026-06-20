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
            body.dark-mode { 
                background: var(--bg-primary) !important; 
                color: var(--text-primary) !important;
            }
            body.dark-mode a { 
                color: var(--link) !important;
                transition: color 0.2s ease, text-decoration 0.2s ease;
            }
            body.dark-mode a:visited { 
                color: var(--visited) !important;
            }
            body.dark-mode a:hover { 
                color: var(--hover-nav-text) !important;
                text-decoration: underline;
            }
            body.dark-mode a:active { 
                color: var(--accent) !important;
            }
            body.dark-mode a:visited:hover {
                color: var(--hover-nav-text) !important;
            }
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
        // Validate theme name to prevent injection
        if (!themeName || typeof themeName !== 'string') {
            themeName = 'default';
        }
        
        // Only use themes from our predefined list
        const safeTheme = themes.hasOwnProperty(themeName) ? themes[themeName] : themes['default'];
        
        let styleTag = document.getElementById('hckr-dark-mode-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'hckr-dark-mode-style';
            document.documentElement.appendChild(styleTag);
        }
        styleTag.textContent = safeTheme + getBaseCss();
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
                chrome.storage.sync.set({ darkModeEnabled: darkModeEnabled }, function() {
                    if (chrome.runtime.lastError) {
                        console.error('Error saving dark mode state:', chrome.runtime.lastError);
                    }
                });
            });
        }
        btn.textContent = enabled ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    // Initial load
    chrome.storage.sync.get(['theme', 'darkModeEnabled'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError);
            // Use defaults on error
            currentTheme = 'default';
            darkModeEnabled = true;
        } else {
            // Validate theme exists
            currentTheme = (result.theme && themes.hasOwnProperty(result.theme)) ? result.theme : 'default';
            darkModeEnabled = result.darkModeEnabled !== undefined ? result.darkModeEnabled : true;
        }
        applyDarkMode(darkModeEnabled);
    });

    // Listen for theme change messages
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // Validate request object
        if (!request || typeof request !== 'object') {
            return;
        }

        if (request.action === 'setTheme' && request.theme) {
            // Validate theme exists in our themes object
            if (themes.hasOwnProperty(request.theme)) {
                currentTheme = request.theme;
                chrome.storage.sync.set({ theme: currentTheme }, function() {
                    if (chrome.runtime.lastError) {
                        console.error('Error saving theme:', chrome.runtime.lastError);
                    }
                });
                if (document.body.classList.contains('dark-mode')) {
                    injectThemeCSS(currentTheme);
                }
            }
        }
        
        if (request.action === 'setAutoRefresh') {
            updateAutoRefresh(request.enabled, request.interval);
        }

        if (request.action === 'setLinkPreview') {
            setPreviewEnabled(request.enabled);
        }
    });

    // Auto-refresh functionality
    let autoRefreshTimer = null;

    function updateAutoRefresh(enabled, intervalSeconds) {
        if (autoRefreshTimer) {
            clearInterval(autoRefreshTimer);
            autoRefreshTimer = null;
        }
        const validInterval = Math.max(5, Math.min(3600, parseInt(intervalSeconds, 10) || 60));
        if (enabled && !isNaN(validInterval)) {
            autoRefreshTimer = setInterval(function() {
                location.reload();
            }, validInterval * 1000);
        }
    }

    chrome.storage.sync.get(['autoRefreshEnabled', 'refreshInterval'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('Error loading auto-refresh settings:', chrome.runtime.lastError);
            return;
        }
        if (result.autoRefreshEnabled && result.refreshInterval) {
            updateAutoRefresh(true, result.refreshInterval);
        }
    });

    // ---- LINK PREVIEW (hover card + accordion side panel) ----

    let previewEnabled = false;
    let hoverTimer = null;
    const savedArticles = new Map(); // Map<url, { data, expanded }>
    const previewDataCache = new Map();
    let panelEl = null;

    function getPreviewCSS() {
        return `
            #hckr-preview-card {
                position: fixed; z-index: 2147483640; width: 500px; max-height: 560px;
                background: var(--bg-secondary, #23272f); color: var(--text-primary, #e8e6e3);
                border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.55);
                display: flex; flex-direction: column; overflow: hidden;
                font-family: Inter, Segoe UI, Arial, sans-serif; font-size: 14px; line-height: 1.6;
                opacity: 0; transform: translateY(6px);
                transition: opacity 0.18s ease, transform 0.18s ease; pointer-events: none;
            }
            #hckr-preview-card.hckr-visible { opacity: 1; transform: translateY(0); pointer-events: all; }
            #hckr-preview-card .hckr-card-header {
                padding: 12px 14px 8px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;
            }
            #hckr-preview-card .hckr-card-title {
                font-size: 15px; font-weight: 600; margin: 0 0 4px 0; line-height: 1.35;
                color: var(--accent, #ff8c42); text-decoration: none; display: block;
            }
            #hckr-preview-card .hckr-card-title:hover {
                text-decoration: underline; color: var(--accent, #ff8c42);
            }
            #hckr-preview-card .hckr-card-meta { font-size: 12px; color: rgba(255,255,255,0.45); margin: 0; }
            #hckr-preview-card .hckr-card-body {
                padding: 12px 14px; overflow-y: auto; flex: 1;
                scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent;
            }
            #hckr-preview-card .hckr-card-body p { margin: 0 0 10px 0; }
            #hckr-preview-card .hckr-desc {
                font-size: 13px; color: rgba(255,255,255,0.65); font-style: italic;
                margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.07);
            }
            #hckr-preview-card .hckr-card-loading { text-align:center;padding:32px 0;color:rgba(255,255,255,0.4);font-size:13px; }
            #hckr-preview-card .hckr-card-error { text-align:center;padding:24px 0;color:#e06c75;font-size:13px; }
            #hckr-preview-card .hckr-card-actions {
                padding: 8px 14px; border-bottom: 1px solid rgba(255,255,255,0.08);
                display: flex; gap: 8px; flex-shrink: 0;
            }
            #hckr-preview-card button {
                flex: 1; padding: 7px 0; border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.07);
                color: var(--text-primary, #e8e6e3); font-size: 13px; cursor: pointer; transition: background 0.13s;
            }
            #hckr-preview-card button:hover { background: rgba(255,255,255,0.14); }
            #hckr-preview-card .hckr-btn-save.hckr-saved {
                background: var(--accent, #ff8c42); color: #181a1b; border-color: transparent;
            }
            #hckr-preview-card .hckr-btn-open { flex: 0 0 auto; padding: 7px 14px; }

            #hckr-side-panel {
                position: fixed; top: 0; right: -460px; width: 440px; height: 100vh;
                z-index: 2147483630; background: var(--bg-secondary, #23272f); color: var(--text-primary, #e8e6e3);
                border-left: 1px solid rgba(255,255,255,0.1); box-shadow: -4px 0 24px rgba(0,0,0,0.4);
                display: flex; flex-direction: column;
                font-family: Inter, Segoe UI, Arial, sans-serif; font-size: 14px; line-height: 1.6;
                transition: right 0.22s cubic-bezier(0.4,0,0.2,1); overflow: hidden;
            }
            #hckr-side-panel.hckr-panel-open { right: 0; }
            #hckr-side-panel .hckr-panel-topbar {
                padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
                background: var(--bg-primary, #1a1b1e);
            }
            .hckr-panel-topbar-title { font-size: 12px; font-weight: 700; color: var(--accent, #ff8c42); letter-spacing: 1px; text-transform: uppercase; }
            .hckr-panel-topbar-close { background:none;border:none;color:rgba(255,255,255,0.4);font-size:18px;cursor:pointer;padding:0 4px;line-height:1; }
            .hckr-panel-topbar-close:hover { color:#fff; }
            #hckr-side-panel .hckr-accordion { flex:1;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.2) transparent; }
            .hckr-accordion-empty { text-align:center;padding:48px 20px;color:rgba(255,255,255,0.3);font-size:13px;font-style:italic; }
            .hckr-accordion-item { border-bottom: 1px solid rgba(255,255,255,0.07); }
            .hckr-accordion-header {
                display:flex;align-items:center;padding:10px 14px;cursor:pointer;gap:8px;
                user-select:none;transition:background 0.13s;
            }
            .hckr-accordion-header:hover { background: rgba(255,255,255,0.04); }
            .hckr-accordion-chevron {
                font-size:11px;color:rgba(255,255,255,0.4);flex-shrink:0;width:14px;text-align:center;
                transition:transform 0.15s; display:inline-block;
            }
            .hckr-accordion-item.hckr-expanded .hckr-accordion-chevron { transform:rotate(90deg); }
            .hckr-accordion-header-text { flex:1;overflow:hidden; }
            .hckr-accordion-title {
                font-size:13px;font-weight:600;color:var(--accent,#ff8c42);
                white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;
            }
            .hckr-accordion-meta { font-size:11px;color:rgba(255,255,255,0.35);margin-top:1px; }
            .hckr-accordion-remove {
                background:none;border:none;color:rgba(255,255,255,0.25);font-size:16px;
                cursor:pointer;padding:0 2px;flex-shrink:0;line-height:1;transition:color 0.13s;
            }
            .hckr-accordion-remove:hover { color:#e06c75; }
            .hckr-accordion-body {
                display:none;padding:0 14px 14px 14px;font-size:13px;
                max-height:380px;overflow-y:auto;
                scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.15) transparent;
            }
            .hckr-accordion-item.hckr-expanded .hckr-accordion-body { display:block; }
            .hckr-accordion-body p { margin:0 0 9px 0; }
            .hckr-accordion-desc { font-style:italic;color:rgba(255,255,255,0.55);margin-bottom:10px;padding-bottom:9px;border-bottom:1px solid rgba(255,255,255,0.07); }
            .hckr-accordion-open-link {
                display:block;text-align:center;margin-top:10px;padding:7px 0;border-radius:6px;
                border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);
                color:var(--text-primary,#e8e6e3);font-size:12px;text-decoration:none;transition:background 0.13s;
            }
            .hckr-accordion-open-link:hover { background:rgba(255,255,255,0.12); }
        `;
    }

    function injectPreviewCSS() {
        if (document.getElementById('hckr-preview-style')) return;
        const s = document.createElement('style');
        s.id = 'hckr-preview-style';
        s.textContent = getPreviewCSS();
        document.documentElement.appendChild(s);
    }

    function removePreviewCSS() {
        const s = document.getElementById('hckr-preview-style');
        if (s) s.remove();
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // --- Fetch ---

    function fetchPreview(url) {
        return new Promise(resolve => {
            if (previewDataCache.has(url)) { resolve(previewDataCache.get(url)); return; }
            chrome.runtime.sendMessage({ action: 'fetchPreview', url }, data => {
                if (chrome.runtime.lastError || !data || data.error) {
                    resolve(null); return;
                }
                previewDataCache.set(url, data);
                resolve(data);
            });
        });
    }

    function buildBodyHtml(data, descClass) {
        let html = '';
        if (data.description) html += `<p class="${escapeHtml(descClass)}">${escapeHtml(data.description)}</p>`;
        if (data.content) {
            html += data.content.split('\n\n').filter(p => p.trim())
                .map(p => `<p>${escapeHtml(p.trim())}</p>`).join('');
        }
        return html || '<p style="color:rgba(255,255,255,0.4);font-style:italic;">No readable content found.</p>';
    }

    // --- Hover card ---

    function createCard() {
        if (document.getElementById('hckr-preview-card')) return;
        const card = document.createElement('div');
        card.id = 'hckr-preview-card';
        card.innerHTML = `
            <div class="hckr-card-header">
                <a class="hckr-card-title" target="_blank" rel="noopener noreferrer"></a>
                <p class="hckr-card-meta"></p>
            </div>
            <div class="hckr-card-actions">
                <button class="hckr-btn-save">📌 Save</button>
                <button class="hckr-btn-open">Open ↗</button>
            </div>
            <div class="hckr-card-body"><div class="hckr-card-loading">Loading preview…</div></div>
        `;
        document.body.appendChild(card);

        card.querySelector('.hckr-btn-save').addEventListener('click', e => {
            e.stopPropagation();
            const url = card.dataset.url;
            if (!url) return;
            const btn = card.querySelector('.hckr-btn-save');
            if (savedArticles.has(url)) {
                savedArticles.delete(url);
                btn.textContent = '📌 Save';
                btn.classList.remove('hckr-saved');
                if (savedArticles.size === 0) closePanel();
            } else {
                savedArticles.set(url, { data: previewDataCache.get(url) || null, expanded: true });
                btn.textContent = '✓ Saved';
                btn.classList.add('hckr-saved');
                openPanel();
            }
            renderAccordion();
        });

        card.querySelector('.hckr-btn-open').addEventListener('click', e => {
            e.stopPropagation();
            const url = card.dataset.url;
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
        });

        card.addEventListener('mouseenter', () => clearTimeout(hoverTimer));
        card.addEventListener('mouseleave', () => hideCard());
    }

    function positionCard(rect) {
        const card = document.getElementById('hckr-preview-card');
        if (!card) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const panelOpen = panelEl && panelEl.classList.contains('hckr-panel-open');
        const rightBoundary = vw - (panelOpen ? 440 : 0) - 10;
        const cardW = Math.min(500, rightBoundary - 20);

        const spaceBelow = vh - rect.bottom - 10;
        const spaceAbove = rect.top - 10;
        // Use whichever side has more room; cap height to that space
        const useBelow = spaceBelow >= spaceAbove || spaceBelow >= 300;
        const maxH = Math.min(560, useBelow ? spaceBelow : spaceAbove);

        card.style.maxHeight = maxH + 'px';
        card.style.width = cardW + 'px';

        let left = rect.left;
        if (left + cardW > rightBoundary) left = rightBoundary - cardW;
        if (left < 10) left = 10;

        const top = useBelow ? rect.bottom + 4 : rect.top - maxH - 4;

        card.style.left = left + 'px';
        card.style.top = Math.max(10, top) + 'px';
    }

    function showCard(url, rect) {
        createCard();
        const card = document.getElementById('hckr-preview-card');
        card.dataset.url = url;
        positionCard(rect);

        card.querySelector('.hckr-card-title').textContent = '';
        card.querySelector('.hckr-card-title').removeAttribute('href');
        card.querySelector('.hckr-card-meta').textContent = '';
        card.querySelector('.hckr-card-body').innerHTML = '<div class="hckr-card-loading">Loading…</div>';
        const isSaved = savedArticles.has(url);
        const btn = card.querySelector('.hckr-btn-save');
        btn.textContent = isSaved ? '✓ Saved' : '📌 Save';
        btn.classList.toggle('hckr-saved', isSaved);

        requestAnimationFrame(() => card.classList.add('hckr-visible'));

        fetchPreview(url).then(data => {
            if (!data || card.dataset.url !== url) return;
            const titleEl = card.querySelector('.hckr-card-title');
            titleEl.textContent = data.title || url;
            titleEl.href = url;
            const metaParts = [data.siteName, data.byline].filter(Boolean);
            card.querySelector('.hckr-card-meta').textContent = metaParts.join(' · ');
            card.querySelector('.hckr-card-body').innerHTML = buildBodyHtml(data, 'hckr-desc');
            // Update saved article data if it was saved before fetch finished
            const state = savedArticles.get(url);
            if (state && !state.data) { state.data = data; renderAccordion(); }
        });
    }

    function hideCard() {
        const card = document.getElementById('hckr-preview-card');
        if (card) card.classList.remove('hckr-visible');
    }

    // --- Accordion side panel ---

    function createPanel() {
        if (document.getElementById('hckr-side-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'hckr-side-panel';
        panel.innerHTML = `
            <div class="hckr-panel-topbar">
                <span class="hckr-panel-topbar-title">Saved Articles</span>
                <button class="hckr-panel-topbar-close" title="Close">✕</button>
            </div>
            <div class="hckr-accordion">
                <div class="hckr-accordion-empty">Save articles with 📌 to read them here</div>
            </div>
        `;
        document.body.appendChild(panel);
        panelEl = panel;
        panel.querySelector('.hckr-panel-topbar-close').addEventListener('click', () => closePanel());
    }

    function openPanel() {
        createPanel();
        panelEl.classList.add('hckr-panel-open');
    }

    function closePanel() {
        if (panelEl) panelEl.classList.remove('hckr-panel-open');
    }

    function renderAccordion() {
        if (!panelEl) return;
        const accordion = panelEl.querySelector('.hckr-accordion');
        if (savedArticles.size === 0) {
            accordion.innerHTML = '<div class="hckr-accordion-empty">Save articles with 📌 to read them here</div>';
            return;
        }
        accordion.innerHTML = '';
        for (const [url, state] of savedArticles.entries()) {
            const data = state.data;
            const title = (data && data.title) || url;
            const meta = (data && data.siteName) || '';
            const bodyHtml = data
                ? buildBodyHtml(data, 'hckr-accordion-desc') + `<a class="hckr-accordion-open-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Open article ↗</a>`
                : '<div style="color:rgba(255,255,255,0.4);font-style:italic;text-align:center;padding:20px 0">Loading…</div>';

            const item = document.createElement('div');
            item.className = 'hckr-accordion-item' + (state.expanded ? ' hckr-expanded' : '');
            item.dataset.url = url;
            item.innerHTML = `
                <div class="hckr-accordion-header">
                    <span class="hckr-accordion-chevron">▶</span>
                    <div class="hckr-accordion-header-text">
                        <div class="hckr-accordion-title">${escapeHtml(title)}</div>
                        ${meta ? `<div class="hckr-accordion-meta">${escapeHtml(meta)}</div>` : ''}
                    </div>
                    <button class="hckr-accordion-remove" title="Remove">✕</button>
                </div>
                <div class="hckr-accordion-body">${bodyHtml}</div>
            `;

            item.querySelector('.hckr-accordion-header').addEventListener('click', e => {
                if (e.target.classList.contains('hckr-accordion-remove')) return;
                state.expanded = !state.expanded;
                item.classList.toggle('hckr-expanded');
            });

            item.querySelector('.hckr-accordion-remove').addEventListener('click', e => {
                e.stopPropagation();
                savedArticles.delete(url);
                const card = document.getElementById('hckr-preview-card');
                if (card && card.dataset.url === url) {
                    const btn = card.querySelector('.hckr-btn-save');
                    btn.textContent = '📌 Save';
                    btn.classList.remove('hckr-saved');
                }
                renderAccordion();
                if (savedArticles.size === 0) closePanel();
            });

            accordion.appendChild(item);

            if (!data) {
                fetchPreview(url).then(fetched => {
                    if (!fetched) return;
                    state.data = fetched;
                    renderAccordion();
                });
            }
        }
    }

    // --- Link hover listeners ---

    function isHckrLink(el) {
        return el && el.tagName === 'A' && el.href
            && !el.href.startsWith('javascript:')
            && !el.href.includes('hckrnews.com')
            && !el.classList.contains('hckr-accordion-open-link')
            && !el.classList.contains('hckr-card-title');
    }

    function onLinkMouseEnter(e) {
        if (!previewEnabled) return;
        const link = e.target.closest('a');
        if (!isHckrLink(link)) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
            showCard(link.href, link.getBoundingClientRect());
        }, 380);
    }

    function onLinkMouseLeave(e) {
        if (!previewEnabled) return;
        const from = e.target.closest('a');
        if (!isHckrLink(from)) return;
        const to = e.relatedTarget;
        if (from && from.contains(to)) return;
        clearTimeout(hoverTimer);
        const card = document.getElementById('hckr-preview-card');
        if (card && (card === to || card.contains(to))) return;
        hideCard();
    }

    function setPreviewEnabled(enabled) {
        previewEnabled = enabled;
        if (enabled) {
            injectPreviewCSS();
            document.addEventListener('mouseover', onLinkMouseEnter, true);
            document.addEventListener('mouseout', onLinkMouseLeave, true);
        } else {
            document.removeEventListener('mouseover', onLinkMouseEnter, true);
            document.removeEventListener('mouseout', onLinkMouseLeave, true);
            removePreviewCSS();
            const card = document.getElementById('hckr-preview-card');
            if (card) card.remove();
            savedArticles.clear();
            closePanel();
        }
    }

    chrome.storage.sync.get(['linkPreviewEnabled'], function(result) {
        if (chrome.runtime.lastError) return;
        if (result.linkPreviewEnabled) setPreviewEnabled(true);
    });

})();
