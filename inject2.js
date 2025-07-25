(() => {

    const tracker = {
        aiResponse: undefined,
        aiContainer: undefined,
        faqContainer: undefined,
        overlayContainer: undefined,
        overlayOpen: false,
    }

    // Setters
    const setAiResponse = value => tracker.aiResponse = value;
    const setAiContainer = value => tracker.aiContainer = value;
    const setFAQContainer = value => tracker.faqContainer = value;
    const setOverlayContainer = value => tracker.overlayContainer = value;
    const setOverlayOpen = value => tracker.overlayOpen = value;

    // Getters
    const getAiResponse = () => tracker.aiResponse;
    const getAiContainer = () => tracker.aiContainer;
    const getFAQContainer = () => tracker.faqContainer;
    const getOverlayContainer = () => tracker.overlayContainer;
    const getOverlayOpen = () => tracker.overlayOpen;

    const hide = item => {
        item.style.display = 'none';
        item.style.visibility = 'hidden';
    }

    const show = (item, display) => {
        item.style.display = display;
        item.style.visibility = 'visible';
    }

    const openBody = event => {
        document.body.style.overflow = 'hidden';
        document.body.style.display = 'flex';
        document.body.style.flexDirection = 'column';
        document.body.style.alignItems = 'center';
    }

    const closeBody = event => {
        document.body.style.overflow = 'scroll';
        document.body.style.display = 'inherit';
        document.body.style.flexDirection = 'unset';
        document.body.style.alignItems = 'unset';
    }

    const openOverlay = event => {
        event.preventDefault();
        if (getOverlayOpen()) return;
        const overlay = getOverlayContainer();
        openBody();
        show(overlay, 'flex');
        setOverlayContainer(overlay);
        setOverlayOpen(true);
    }

    const closeOverlay = event => {
        event.preventDefault();
        if (!getOverlayOpen()) return;
        const overlay = getOverlayContainer();
        closeBody();
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
        overlay.id = 'loaded';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.backgroundColor = '#1f1f1f';
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

            setAiResponse(findAIOverview.nextElementSibling);
            setAiContainer(findAIOverview.parentElement);

            const theOverlay = getOverlayContainer();

            const aiResponse = getAiResponse();
            if (aiResponse) {


                // Remove "AI responses..." footer for AI response section in overlay.
                    // Should use cloned nodes...but am having issues with the content 
                    // that is transfered, even with the subtree set to true.
                    /*
                const getThis = Array.from(aiResponse.querySelectorAll('div'))
                    .find(item => item.innerText.trim().toLowerCase() === 'ai responses may include mistakes. learn more');

                if (getThis) {
                    console.log(getThis);
                    hide(getThis);
                }
*/
                theOverlay.appendChild(aiResponse);
            }

            const aiContainer = getAiContainer();

            // only open the overlay if we have found an ai chat?
                // Could still get opened for FAQ, but feels less useful as those are related answers.

            if (aiContainer) {
                theOverlay.appendChild(aiContainer);
                document.body.appendChild(theOverlay);

                if (findFAQContainer) {
                    setFAQContainer(findFAQContainer.parentElement);
                    theOverlay.appendChild(getFAQContainer());
                }

                openOverlay(new Event('click'));

                setOverlayContainer(theOverlay);
                document.body.appendChild(theOverlay);
            }

            observer.disconnect();
        }
    }

    setOverlayContainer(generateOverlay());

    const observer = new MutationObserver(observerCallback);
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(document.body, config);

})();