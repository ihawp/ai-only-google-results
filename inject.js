(() => {

    // USE X button to allow for exiting the overlay displayed by the plugin.
        // Then you can return to the other results if you care, but if you are just looking for one answer from AI then here you go use this plugin.

    const tracker = {
        findAIOverview: undefined,
        aiResponse: undefined,
        aiContainer: undefined,
        faqContainer: undefined,
        overlayContainer: generateOverlay(),
        overlayOpen: false,
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

    // Setters
    const setFindAIOverview = value => {
        tracker.findAIOverview = value;
    }

    const setAiResponse = value => {
        tracker.aiResponse = value;
    }

    const setAiContainer = value => {
        tracker.aiContainer = value;
    }

    const setFAQContainer = value => {
        tracker.faqContainer = value;
    }

    const setOverlayContainer = value => {
        tracker.overlayContainer = value;
    }

    const setOverlayOpen = value => {
        tracker.overlayOpen = value;
    }

    // Getters
    const getFindAIOverview = () => {
        return tracker.findAIOverview;
    }

    const getAiResponse = () => {
        return tracker.aiResponse;
    }

    const getAiContainer = () => {
        return tracker.aiContainer;
    }

    const getFAQContainer = () => {
        return tracker.faqContainer;
    }

    const getOverlayContainer = () => {
        return tracker.overlayContainer;
    }

    const getOverlayOpen = () => {
        return tracker.overlayOpen;
    }

    const hide = item => {
        item.style.display = 'none';
        item.stlye.visibility = 'hidden';
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

    const observerCallback = (mutationList, observer) => {

        // get the div closest to the text instead of the original text (<strong>) 
        // so that we can utilize nextElementSibling and parentElement.

        const saveDivs = document.querySelectorAll('div');

        const findAIOverview = Array.from(saveDivs)
            .find(item => item.innerText.trim().toLowerCase() === 'ai overview');

        // search findAIOverview for the first div with a nextElementSibling.

        const findFAQContainer = Array.from(saveDivs)
            .find(item => item.innerText.trim().toLowerCase() == 'people also ask');

        if (findAIOverview) {

            console.log('coming');

            // AI Overview available for the search result.

            setFindAIOverview(findAIOverview);
            setAiResponse(findAIOverview.nextElementSibling);
            setAiContainer(findAIOverview.parentElement);

            const theOverlay = getOverlayContainer();

            theOverlay.appendChild(getFindAIOverview());
            theOverlay.appendChild(getAiResponse());
            theOverlay.appendChild(getAiContainer());

            setOverlayContainer(theOverlay);

            document.body.appendChild(getOverlayContainer());

            openOverlay();

            if (findFAQContainer) {

                setFAQContainer(findFAQContainer.parentElement);

                const theOverlay = getOverlayContainer();

                theOverlay.appendChild(getFAQContainer());

                setOverlayContainer(theOverlay);
            
            }

            observer.disconnect();
        }

    }

    const observer = new MutationObserver(observerCallback);
    
    const config = { attributes: true, childList: true, subtree: true };

    observer.observe(document.body, config);

    // if there is nothing do nothing.

})();