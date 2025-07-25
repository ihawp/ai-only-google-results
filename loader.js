(() => {
    const tracker = {
        loader: undefined,
    };

    function generateOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';

        const loader = document.createElement('div');
        loader.classList.add('loader');
        overlay.appendChild(loader);

        tracker.loader = overlay;
        return overlay;
    }

    const loadingOverlay = generateOverlay();

    function insertLoader() {
        if (document.body && !document.body.contains(loadingOverlay)) {
            document.body.appendChild(loadingOverlay);
        }
    }

    function removeLoader() {
        if (tracker.loader && tracker.loader.parentNode) {
            tracker.loader.parentNode.removeChild(tracker.loader);
        }
    }

    function waitForBodyAndInsert() {
        if (document.body) {
            insertLoader();
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                if (document.body) {
                    insertLoader();
                    obs.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    // Start inserting loader early
    waitForBodyAndInsert();

    // Observer for "AI Overview"
    const observer = new MutationObserver((mutationList, obs) => {
        const divs = document.querySelectorAll('div');
        const found = Array.from(divs).find(d => d.innerText.trim().toLowerCase() === 'ai overview');

        if (found) {
            removeLoader();
            obs.disconnect();
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove loader on DOMContentLoaded if "AI Overview" is not found
    function checkAndRemoveIfNotFound() {
        const divs = document.querySelectorAll('div');
        const found = Array.from(divs).some(d => d.innerText.trim().toLowerCase() === 'ai overview');

        if (!found) {
            removeLoader();
            observer.disconnect(); // Optional: stop observing if "AI Overview" is definitely not coming
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndRemoveIfNotFound);
    } else {
        checkAndRemoveIfNotFound();
    }
})();