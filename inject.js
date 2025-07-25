(() => {

    const tracker = {
        aiResponse: undefined,
        aiContainer: undefined,
        innerContainer: undefined,
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
    const setInnerContainer = value => tracker.innerContainer = value;
    const setOpenButton = value => tracker.openButton = value;
    const setCloseButton = value => tracker.closeButton = value;

    // Getters
    const getAiResponse = () => tracker.aiResponse;
    const getAiContainer = () => tracker.aiContainer;
    const getFAQContainer = () => tracker.faqContainer;
    const getOverlayContainer = () => tracker.overlayContainer;
    const getOverlayOpen = () => tracker.overlayOpen;
    const getInnerContainer = () => tracker.innerContainer;
    const getOpenButton = () => tracker.openButton;
    const getCloseButton = () => tracker.closeButton;

    const hide = item => {
        item.style.display = 'none';
        item.style.visibility = 'hidden';
    }

    const show = (item, display) => {
        item.style.display = display;
        item.style.visibility = 'visible';
    }

    const openOverlay = event => {
        event.preventDefault();
        if (getOverlayOpen()) return;
        const overlay = getOverlayContainer();
        document.body.style.overflow = 'hidden';
        show(overlay, 'flex');
        setOverlayContainer(overlay);
        setOverlayOpen(true);
        displayOverlayButton(true);
    }

    const closeOverlay = event => {
        event.preventDefault();

        if (!getOverlayOpen()) return;

        document.body.style.overflow = 'auto';

        // Update the overlay.
        const overlay = getOverlayContainer();
        hide(overlay);
        setOverlayContainer(overlay);
        setOverlayOpen(false);

        displayOverlayButton(false);
    }

    const displayOverlayButton = value => {

        const openButton = getOpenButton();
        const closeButton = getCloseButton();

        // Hide and show the buttons.
        hide(value ? openButton : closeButton);
        show(value ? closeButton : openButton, 'block');

        // Store the updated button in the tracker object.
        setOpenButton(openButton);
        setCloseButton(closeButton);

    }

    const insertMediaQueries = () => {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';

        styleElement.textContent = `
            @media (min-width: 68em) {
                #loaded-inner {
                    width: 1080px;
                    max-width: 1080px;
                }
            }
        `;

        document.head.appendChild(styleElement);
    }

    function generateButton(innerText) {
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.border = '1px solid white';
        button.style.outline = '1px solid white';
        button.style.fontWeight = '700';
        button.style.borderRadius = '100px';
        button.style.top = '1rem';
        button.style.right = '1rem';
        button.style.padding = '1rem 3rem';
        button.style.cursor = 'pointer';
        button.style.zIndex = 4444;
        button.innerText = innerText;
        button.classList.add('light');
        return button;
    }

    function generateOpenButton() {
        const button = generateButton('Open AI Overview');
        button.style.top = 'unset';
        button.style.bottom = '1rem';
        button.addEventListener('click', openOverlay);
        return button;
    }

    function generateCloseButton() {
        const button = generateButton('See Web Results');
        button.style.right = '2rem';
        button.addEventListener('click', closeOverlay);
        return button;
    }

    function generateInnerContainer() {
        const inner = document.createElement('div');
        inner.id = 'loaded-inner';
        inner.style.height = 'max-content';
        inner.style.padding = '1rem';
        inner.style.paddingTop = '5rem';
        inner.style.display = 'flex';
        inner.style.flexDirection = 'column';
        inner.style.alignItems = 'center';
        inner.classList.add('light');
        return inner;
    }

    function generateOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loaded';
        overlay.style.position = 'fixed';
        overlay.style.top = '134px'
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = 'calc(100vh - 134px)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = 4343;
        overlay.style.overflowX = 'hidden';
        overlay.style.overflowY = 'scroll';
        overlay.classList.add('light');

        // Generate an inner container (that has max-width)
        const innerContainer = generateInnerContainer();
        setInnerContainer(innerContainer);

        // Generate the open and close buttons (not yet implemented).
        const openButton = generateOpenButton();
        const closeButton = generateCloseButton();

        // Hide the new buttons before the content loaded has resolved...is there an AI overview?
        hide(openButton);
        hide(closeButton);

        // Add the buttons to the tracker object.
        setOpenButton(openButton);
        setCloseButton(closeButton);

        // Add nodes to the inner container.
        document.body.appendChild(openButton);
        document.body.appendChild(closeButton);

        // Add the inner container to the overlay.
        overlay.appendChild(innerContainer);

        // Return the completed* overlay.
        return overlay;
    }

    const observerCallback = (mutationList, observer) => {
        const saveDivs = document.querySelectorAll('div');

        // Find the "AI Overview" title above the AI overview section.
            // I could see this DOM element being removed if Google fully made the switch to AI centric search.
        const findAIOverview = Array.from(saveDivs)
            .find(item => item.innerText.trim().toLowerCase() === 'ai overview');

        const findFAQContainer = Array.from(saveDivs)
            .find(item => item.innerText.trim().toLowerCase() === 'people also ask');

        if (findAIOverview) {

            setAiResponse(findAIOverview.nextElementSibling);
            setAiContainer(findAIOverview.parentElement);

            const theOverlay = getInnerContainer();

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
                // Could still get opened for just a FAQ result, but feels less useful as those are related answers.

            if (aiContainer) {
                theOverlay.appendChild(aiContainer);
                document.body.appendChild(theOverlay);

                if (findFAQContainer) {
                    findFAQContainer.parentElement.style.width = '100%';
                    setFAQContainer(findFAQContainer.parentElement);
                    theOverlay.appendChild(getFAQContainer());
                }

                // Open the overlay with simulated click event.
                openOverlay(new Event('click'));

                setInnerContainer(theOverlay);

                const overlayContainer = getOverlayContainer();

                overlayContainer.appendChild(theOverlay);

                setOverlayContainer(overlayContainer);

                document.body.appendChild(overlayContainer);

                // add some media rules.

            }

            observer.disconnect();
        }
    }

    insertMediaQueries();

    setOverlayContainer(generateOverlay());

    const observer = new MutationObserver(observerCallback);
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(document.body, config);

})();