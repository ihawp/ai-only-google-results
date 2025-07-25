(() => {

    const tracker = {
        findAIOverview: undefined,
        aiResponse: undefined,
        aiContainer: undefined,
        faqContainer: undefined,
        overlayContainer: undefined,
        overlayOpen: false,
    }

    // Setters
    const setFindAIOverview = value => tracker.findAIOverview = value;
    const setAiResponse = value => tracker.aiResponse = value;
    const setAiContainer = value => tracker.aiContainer = value;
    const setFAQContainer = value => tracker.faqContainer = value;
    const setOverlayContainer = value => tracker.overlayContainer = value;
    const setOverlayOpen = value => tracker.overlayOpen = value;

    // Getters
    const getFindAIOverview = () => tracker.findAIOverview;
    const getAiResponse = () => tracker.aiResponse;
    const getAiContainer = () => tracker.aiContainer;
    const getFAQContainer = () => tracker.faqContainer;
    const getOverlayContainer = () => tracker.overlayContainer;
    const getOverlayOpen = () => tracker.overlayOpen;

    const hide = item => {
        item.style.display = 'none';
        item.style.visibility = 'hidden'; // fixed typo: stlye → style
    }

    const show = (item, display) => {
        item.style.display = display;
        item.style.visibility = 'visible';
    }

    const openOverlay = event => {
        event.preventDefault();
        if (getOverlayOpen()) return;
        const overlay = getOverlayContainer();
        show(overlay, 'flex');
        setOverlayContainer(overlay);
        setOverlayOpen(true);
    }

    const closeOverlay = event => {
        event.preventDefault();
        if (!getOverlayOpen()) return;
        const overlay = getOverlayContainer();
        hide(overlay);
        setOverlayContainer(overlay);
        setOverlayOpen(false);
    }

    function generateButton(innerText) {
        const button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.top = '1rem';
        button.style.right = '1rem';
        button.style.backgroundColor = '#fff';
        button.style.color = '#000';
        button.style.padding = '2rem';
        button.innerText = innerText;
        return button;
    }

    function generateOpenButton() {
        const button = generateButton('Open');
        button.addEventListener('click', openOverlay);
        return button;
    }

    function generateCloseButton() {
        const button = generateButton('Close');
        button.addEventListener('click', closeOverlay);
        return button;
    }

    function generateOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.backgroundColor = 'rgba(0,0,0,0.69)';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = 4343;
        overlay.style.overflowX = 'hidden';
        overlay.style.overflowY = 'scroll';

        const openButton = generateOpenButton();
        const closeButton = generateCloseButton();
        hide(closeButton);

        overlay.appendChild(openButton);
        overlay.appendChild(closeButton);

        return overlay;
    }

    const observerCallback = (mutationList, observer) => {
        const saveDivs = document.querySelectorAll('div');

        const findAIOverview = Array.from(saveDivs)
            .find(item => item.innerText.trim().toLowerCase() === 'ai overview');

        const findFAQContainer = Array.from(saveDivs)
            .find(item => item.innerText.trim().toLowerCase() === 'people also ask');

        if (findAIOverview) {
            console.log('coming');

            setFindAIOverview(findAIOverview);
            setAiResponse(findAIOverview.nextElementSibling);
            setAiContainer(findAIOverview.parentElement);

            const theOverlay = getOverlayContainer();
            theOverlay.appendChild(getFindAIOverview());
            theOverlay.appendChild(getAiResponse());
            theOverlay.appendChild(getAiContainer());
            setOverlayContainer(theOverlay);

            document.body.appendChild(theOverlay);
            openOverlay(new Event('click'));

            if (findFAQContainer) {
                setFAQContainer(findFAQContainer.parentElement);
                theOverlay.appendChild(getFAQContainer());
                setOverlayContainer(theOverlay);
            }

            observer.disconnect();
        }
    }

    setOverlayContainer(generateOverlay());

    const observer = new MutationObserver(observerCallback);
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(document.body, config);

})();