(() => {
    const tracker = {
        loader: undefined,
        overlay: undefined,
    };

    function generateOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'var(--background-color)';
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

    // Setters
    const setOverlay = value => tracker.overlay = value;

    // Getters
    const getOverlay = () => tracker.overlay;

    // Set the overlay.
    const loadingOverlay = generateOverlay();
    setOverlay(loadingOverlay);

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

    function applyTheme() {

        const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        const html = document.documentElement;
        const overlay = getOverlay();

        let backgroundColor = '#ffffff';
        
        if (document.body) {

            const computedStyle = window.getComputedStyle(document.body);
            const computedBg = computedStyle.backgroundColor;
            const theOverlay = getOverlay();
            
            // If body doesn't have a background, try html element
            if (computedBg === 'rgba(0, 0, 0, 0)' || computedBg === 'transparent') {
                const htmlComputedStyle = window.getComputedStyle(html);
                backgroundColor = theOverlay.backgroundColor = htmlComputedStyle.backgroundColor;
            } else {
                backgroundColor = theOverlay.backgroundColor = computedBg;
            }
            
            // If still transparent, use theme-based defaults
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                backgroundColor = theOverlay.backgroundColor = isLight ? '#ffffff' : '#1f1f1f';
            }

            setOverlay(theOverlay);

        }

        if (isLight) {
            html.classList.remove('dark');
        } else {
            html.classList.add('dark');
        }

        document.documentElement.style.setProperty('--background-color', backgroundColor);

        setOverlay(overlay);
    }

    if (document.body) applyTheme();

    function waitForBodyAndInsert() {
        if (document.body) {
            insertLoader();
            applyTheme();
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                if (document.body) {
                    insertLoader();
                    applyTheme();
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