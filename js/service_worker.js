chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed. Initializing settings...');

    // Set default settings if they don't exist.
    chrome.storage.local.set({
      showWebResults: true,
      showPlugin: true,
    });

  }
});