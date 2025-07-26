const defaultSettings = {
    showWebResults: true,
    showPlugin: true,
}

document.addEventListener('DOMContentLoaded', () => {

    const toggleWebResults = document.getElementById('toggleWebResults');
    const togglePlugin = document.getElementById('togglePlugin');
    const resetSettings = document.getElementById('resetSettings');
    const reloadPage = document.getElementById('reloadPage');
    const pluginStatus = document.getElementById('plugin-status');

    // Load stored setting.
    chrome.storage.local.get(['showWebResults', 'showPlugin'], (result) => {
        const showWebResults = result.showWebResults ?? defaultSettings.showWebResults;
        const showPlugin = result.showPlugin ?? defaultSettings.showPlugin;

        if (toggleWebResults) toggleWebResults.checked = showWebResults;
        if (togglePlugin) togglePlugin.checked = showPlugin;

        if (pluginStatus) updatePluginStatus(getPluginStatusData(showPlugin));
    });

    const toggleChange = (event) => {
        if (!event) return; // safeguard
        const bool = event.currentTarget.checked;
        const title = event.currentTarget.dataset.title;
        if (!title) return;

        chrome.storage.local.set({ [title]: bool });

        if (title === 'showPlugin' && pluginStatus) {
            updatePluginStatus(getPluginStatusData(bool));
        }
    }

    const resetUserSettings = () => {
        if (toggleWebResults) toggleWebResults.checked = true;
        if (togglePlugin) togglePlugin.checked = true;
        chrome.storage.local.set(defaultSettings);
        if (pluginStatus) updatePluginStatus(getPluginStatusData(true));
    }

    const getPluginStatusData = (bool) => bool ? {
        text: 'On',
        color: 'limegreen',
    } : {
        text: 'Off',
        color: 'red'
    }

    const updatePluginStatus = (data) => {
        pluginStatus.innerText = data.text;
        pluginStatus.style.setProperty('--indicator-color', data.color);
    }

    const reloadThePage = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    }

    const settingKeydownEvent = event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.currentTarget.checked = !event.currentTarget.checked;
            toggleChange({ currentTarget: event.currentTarget });
        }
    }

    if (resetSettings) resetSettings.addEventListener('click', resetUserSettings);
    if (reloadPage) reloadPage.addEventListener('click', reloadThePage);

    if (toggleWebResults) {
        toggleWebResults.addEventListener('change', toggleChange);
        toggleWebResults.addEventListener('keydown', settingKeydownEvent);
    }

    if (togglePlugin) {
        togglePlugin.addEventListener('change', toggleChange);
        togglePlugin.addEventListener('keydown', settingKeydownEvent);
    }

    
});