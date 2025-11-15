document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('themeSelect');
    const statusBar = document.getElementById('statusBar');
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    const refreshInterval = document.getElementById('refreshInterval');
    const refreshStatus = document.getElementById('refreshStatus');

    // Load saved settings
    chrome.storage.sync.get(['theme', 'autoRefreshEnabled', 'refreshInterval'], function(result) {
        if (result.theme) {
            themeSelect.value = result.theme;
            statusBar.textContent = `Theme: ${themeSelect.options[themeSelect.selectedIndex].text}`;
        }

        // Load auto-refresh settings
        autoRefreshToggle.checked = result.autoRefreshEnabled || false;
        refreshInterval.value = result.refreshInterval || 60;
        updateRefreshStatus();
    });

    // Apply theme on selection
    themeSelect.addEventListener('change', function() {
        const theme = themeSelect.value;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'setTheme', theme });
            statusBar.textContent = `Theme: ${themeSelect.options[themeSelect.selectedIndex].text}`;
            chrome.storage.sync.set({ theme: theme });
        });
    });

    // Handle auto-refresh toggle
    autoRefreshToggle.addEventListener('change', function() {
        const enabled = autoRefreshToggle.checked;
        chrome.storage.sync.set({ autoRefreshEnabled: enabled }, function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'setAutoRefresh',
                    enabled: enabled,
                    interval: parseInt(refreshInterval.value)
                });
            });
            updateRefreshStatus();
        });
    });

    // Handle interval change
    refreshInterval.addEventListener('change', function() {
        let interval = parseInt(refreshInterval.value);

        // Enforce min/max constraints
        if (interval < 5) {
            interval = 5;
            refreshInterval.value = 5;
        } else if (interval > 3600) {
            interval = 3600;
            refreshInterval.value = 3600;
        }

        chrome.storage.sync.set({ refreshInterval: interval }, function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'setAutoRefresh',
                    enabled: autoRefreshToggle.checked,
                    interval: interval
                });
            });
            updateRefreshStatus();
        });
    });

    function updateRefreshStatus() {
        if (autoRefreshToggle.checked) {
            const interval = parseInt(refreshInterval.value);
            refreshStatus.textContent = `Refreshing every ${interval} seconds`;
        } else {
            refreshStatus.textContent = 'Auto-refresh is off';
        }
    }
});
