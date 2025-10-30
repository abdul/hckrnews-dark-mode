document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleBtn');
    const statusBar = document.getElementById('statusBar');

    // Get current state
    chrome.storage.sync.get(['darkModeEnabled'], function(result) {
        const darkModeEnabled = result.darkModeEnabled || false;
        updateUI(darkModeEnabled);
    });

    // Toggle button click handler
    toggleBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0].url.includes('hckrnews.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleDarkMode'}, function(response) {
                    if (response) {
                        updateUI(response.darkModeEnabled);
                    }
                });
            } else {
                statusBar.textContent = 'Not on hckrnews.com';
            }
        });
    });

    function updateUI(darkModeEnabled) {
        if (darkModeEnabled) {
            toggleBtn.innerHTML = '☀️ Light Mode';
            toggleBtn.style.background = '#23272f';
            statusBar.textContent = 'Dark mode active';
        } else {
            toggleBtn.innerHTML = '🌙 Enable Dark Mode';
            toggleBtn.style.background = '';
            statusBar.textContent = 'Light mode active';
        }
    }
});
