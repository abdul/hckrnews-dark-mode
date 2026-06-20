document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('themeSelect');
    const statusBar = document.getElementById('statusBar');
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    const refreshInterval = document.getElementById('refreshInterval');
    const refreshStatus = document.getElementById('refreshStatus');
    const linkPreviewToggle = document.getElementById('linkPreviewToggle');
    const previewStatus = document.getElementById('previewStatus');

    // Load saved settings
    chrome.storage.sync.get(['theme', 'autoRefreshEnabled', 'refreshInterval', 'linkPreviewEnabled'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError);
            statusBar.textContent = 'Error loading settings';
            return;
        }

        if (result.theme) {
            themeSelect.value = result.theme;
            statusBar.textContent = `Theme: ${themeSelect.options[themeSelect.selectedIndex].text}`;
        }

        autoRefreshToggle.checked = result.autoRefreshEnabled || false;
        refreshInterval.value = result.refreshInterval || 60;
        updateRefreshStatus();

        linkPreviewToggle.checked = result.linkPreviewEnabled || false;
        updatePreviewStatus(result.linkPreviewEnabled || false);
    });

    // Apply theme on selection
    themeSelect.addEventListener('change', function() {
        const theme = themeSelect.value;
        
        if (!theme) {
            statusBar.textContent = 'Invalid theme selected';
            return;
        }

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (chrome.runtime.lastError) {
                console.error('Error querying tabs:', chrome.runtime.lastError);
                statusBar.textContent = 'Error applying theme';
                return;
            }

            if (!tabs || tabs.length === 0) {
                statusBar.textContent = 'No active tab found';
                return;
            }

            chrome.tabs.sendMessage(tabs[0].id, { action: 'setTheme', theme }, function(response) {
                if (chrome.runtime.lastError) {
                    // Ignore error if tab doesn't have content script (e.g., not on hckrnews.com)
                    console.log('Could not send message:', chrome.runtime.lastError.message);
                }
            });
            
            statusBar.textContent = `Theme: ${themeSelect.options[themeSelect.selectedIndex].text}`;
            
            chrome.storage.sync.set({ theme: theme }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error saving theme:', chrome.runtime.lastError);
                }
            });
        });
    });

    // Handle auto-refresh toggle
    autoRefreshToggle.addEventListener('change', function() {
        const enabled = autoRefreshToggle.checked;
        const interval = parseInt(refreshInterval.value, 10) || 60;

        chrome.storage.sync.set({ autoRefreshEnabled: enabled }, function() {
            if (chrome.runtime.lastError) {
                console.error('Error saving auto-refresh setting:', chrome.runtime.lastError);
                refreshStatus.textContent = 'Error saving settings';
                return;
            }

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (chrome.runtime.lastError || !tabs || tabs.length === 0) {
                    console.error('Error querying tabs:', chrome.runtime.lastError);
                    return;
                }

                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'setAutoRefresh',
                    enabled: enabled,
                    interval: interval
                }, function() {
                    if (chrome.runtime.lastError) {
                        console.log('Could not send message:', chrome.runtime.lastError.message);
                    }
                });
            });
            updateRefreshStatus();
        });
    });

    // Handle interval change
    refreshInterval.addEventListener('change', function() {
        let interval = parseInt(refreshInterval.value, 10);

        // Validate input is a number
        if (isNaN(interval)) {
            interval = 60;
            refreshInterval.value = 60;
        }

        // Enforce min/max constraints
        if (interval < 5) {
            interval = 5;
            refreshInterval.value = 5;
        } else if (interval > 3600) {
            interval = 3600;
            refreshInterval.value = 3600;
        }

        chrome.storage.sync.set({ refreshInterval: interval }, function() {
            if (chrome.runtime.lastError) {
                console.error('Error saving interval:', chrome.runtime.lastError);
                refreshStatus.textContent = 'Error saving settings';
                return;
            }

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (chrome.runtime.lastError || !tabs || tabs.length === 0) {
                    console.error('Error querying tabs:', chrome.runtime.lastError);
                    return;
                }

                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'setAutoRefresh',
                    enabled: autoRefreshToggle.checked,
                    interval: interval
                }, function() {
                    if (chrome.runtime.lastError) {
                        console.log('Could not send message:', chrome.runtime.lastError.message);
                    }
                });
            });
            updateRefreshStatus();
        });
    });

    // Handle link preview toggle
    linkPreviewToggle.addEventListener('change', function() {
        const enabled = linkPreviewToggle.checked;
        chrome.storage.sync.set({ linkPreviewEnabled: enabled }, function() {
            if (chrome.runtime.lastError) {
                console.error('Error saving link preview setting:', chrome.runtime.lastError);
                return;
            }
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (chrome.runtime.lastError || !tabs || tabs.length === 0) return;
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'setLinkPreview',
                    enabled: enabled
                }, function() {
                    if (chrome.runtime.lastError) {
                        console.log('Could not send message:', chrome.runtime.lastError.message);
                    }
                });
            });
            updatePreviewStatus(enabled);
        });
    });

    function updatePreviewStatus(enabled) {
        if (previewStatus) {
            previewStatus.textContent = enabled
                ? 'Hover links to preview — click 📌 to pin as side panel'
                : 'Preview disabled';
        }
    }

    function updateRefreshStatus() {
        if (autoRefreshToggle.checked) {
            const interval = parseInt(refreshInterval.value);
            refreshStatus.textContent = `Refreshing every ${interval} seconds`;
        } else {
            refreshStatus.textContent = 'Auto-refresh is off';
        }
    }
});
