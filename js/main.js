const defaultSettings = {
    showWebResults: true,
    showPlugin: true,
}

document.addEventListener('DOMContentLoaded', () => {

    const toggleWebResults = document.getElementById('toggleWebResults');
    const togglePlugin = document.getElementById('togglePlugin');
    const resetSettings = document.getElementById('resetSettings');
    const reloadPage = document.getElementById('reloadPage');

    // Load stored setting.
    chrome.storage.local.get(['showWebResults', 'showPlugin'], result => {
        const showWebResults = result.showWebResults ?? false;
        const showPlugin = result.showPlugin ?? false;

        toggleWebResults.checked = showWebResults;
        togglePlugin.checked = showPlugin;
    });

    const toggleChange = event => {
        const bool = event.currentTarget.checked;
        const title = event.currentTarget.dataset.title;
        chrome.storage.local.set({ [title]: bool });
    }

    const resetUserSettings = () => {
        toggleWebResults.checked = true;
        togglePlugin.checked = true;
        chrome.storage.local.set(defaultSettings);
    }

    const reloadThePage = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    }

    resetSettings.addEventListener('click', resetUserSettings);

    reloadPage.addEventListener('click', reloadThePage);

    // Update setting on toggle change.
    toggleWebResults.addEventListener('change', toggleChange);
    togglePlugin.addEventListener('change', toggleChange);


});