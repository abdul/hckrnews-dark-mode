document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('themeSelect');
    const statusBar = document.getElementById('statusBar');

    // Load saved theme selection
    chrome.storage.sync.get(['theme'], function(result) {
        if (result.theme) {
            themeSelect.value = result.theme;
            statusBar.textContent = `Theme: ${themeSelect.options[themeSelect.selectedIndex].text}`;
        }
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
});
