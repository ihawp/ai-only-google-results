document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleWebResults');

  // Load stored setting
  chrome.storage.local.get(['showWebResults'], (result) => {
    const show = result.showWebResults ?? true;
    toggle.checked = show;
  });

  // Update setting on toggle change
  toggle.addEventListener('change', () => {
    const shouldShow = toggle.checked;
    chrome.storage.local.set({ showWebResults: shouldShow });
  });
  
});