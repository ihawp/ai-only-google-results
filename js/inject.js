(async () => {

    const tracker = {
        aiResponse: undefined,
        aiContainer: undefined,
        innerContainer: undefined,
        faqContainer: undefined,
        overlayContainer: undefined,
        overlayOpen: false,
        openButton: false,
        closeButton: false,
        lastScrollTop: 0,
    }

    const settings = {
        displayNavButtons: undefined,
        showPlugin: undefined,
    }

    // Setters: Tracker
    const setAiResponse = value => tracker.aiResponse = value;
    const setAiContainer = value => tracker.aiContainer = value;
    const setFAQContainer = value => tracker.faqContainer = value;
    const setOverlayContainer = value => tracker.overlayContainer = value;
    const setOverlayOpen = value => tracker.overlayOpen = value;
    const setInnerContainer = value => tracker.innerContainer = value;
    const setOpenButton = value => tracker.openButton = value;
    const setCloseButton = value => tracker.closeButton = value;
    const setLastScrollTop = value => tracker.lastScrollTop = value;

    // Getters: Tracker
    const getAiResponse = () => tracker.aiResponse;
    const getAiContainer = () => tracker.aiContainer;
    const getFAQContainer = () => tracker.faqContainer;
    const getOverlayContainer = () => tracker.overlayContainer;
    const getOverlayOpen = () => tracker.overlayOpen;
    const getInnerContainer = () => tracker.innerContainer;
    const getOpenButton = () => tracker.openButton;
    const getCloseButton = () => tracker.closeButton;
    const getLastScrollTop = () => tracker.lastScrollTop;

    // Setters: Settings
    const setDisplayNavButtons = value => settings.displayNavButtons = value;
    const setShowPlugin = value => settings.showPlugin = value;

    // Getters: Settings
    const getDisplayNavButtons = () => settings.displayNavButtons;
    const getShowPlugin = value => settings.showPlugin;

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

        document.body.style.overflow = 'scroll';

        const scrollTop = document.documentElement.scrollTop;
        console.log(scrollTop);
        setLastScrollTop(scrollTop);

        window.scrollTo(0, 0);

        document.body.style.overflow = 'hidden';

        show(overlay, 'flex');
        setOverlayContainer(overlay);
        setOverlayOpen(true);

        displayOverlayButton(true);
    }

    const closeOverlay = event => {
        event.preventDefault();

        if (!getOverlayOpen()) return;

        // Update the overlay.
        const overlay = getOverlayContainer();
        hide(overlay);
        setOverlayContainer(overlay);
        setOverlayOpen(false);

        document.body.style.overflow = 'scroll';

        const scrollTop = getLastScrollTop();
        window.scrollTo({ top: scrollTop, behavior: 'auto' });

        displayOverlayButton(false);
    }

    function generateButton(innerText) {
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.border = '1px solid white';
        button.style.outline = '1px solid white';
        button.style.fontWeight = '700';
        button.style.borderRadius = '100px';
        button.style.bottom = '1rem';
        button.style.right = '1rem';
        button.style.padding = '1rem 3rem';
        button.style.cursor = 'pointer';
        button.style.zIndex = 126;
        button.innerText = innerText;
        button.classList.add('light');
        return button;
    }

    function generateOpenButton() {
        const button = generateButton('Open AI Overview');
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
        inner.style.paddingBottom = '10rem';
        inner.style.display = 'flex';
        inner.style.flexDirection = 'column';
        inner.style.gap = '1rem';
        inner.style.alignItems = 'center';
        inner.classList.add('light');
        return inner;
    }
    
    function displayOverlayButton(value) {

        const openButton = getOpenButton();
        const closeButton = getCloseButton();

        if (!openButton || !closeButton) return;

        // Hide and show the buttons.
        hide(value ? openButton : closeButton);
        show(value ? closeButton : openButton, 'block');

        // Store the updated button in the tracker object.
        setOpenButton(openButton);
        setCloseButton(closeButton);

    }

    async function generateOverlay() {
        const result = await new Promise(resolve => {
            chrome.storage.local.get(['showWebResults', 'showPlugin'], data => {
                resolve(data);
            });
        });

        const showWebResults = result.showWebResults ?? false;
        setDisplayNavButtons(showWebResults);

        const showPlugin = result.showPlugin ?? false;
        setShowPlugin(showPlugin);

        if (!showPlugin) return false;

        const overlay = document.createElement('div');
        overlay.id = 'loaded';
        overlay.style.position = 'fixed';
        overlay.style.top = '134px';
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = 'calc(100vh - 134px)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = 125;
        overlay.style.overflowX = 'hidden';
        overlay.style.overflowY = 'scroll';
        overlay.classList.add('light');

        const innerContainer = generateInnerContainer();
        setInnerContainer(innerContainer);

        if (showWebResults) {
            const openButton = generateOpenButton();
            const closeButton = generateCloseButton();

            hide(openButton);
            hide(closeButton);

            setOpenButton(openButton);
            setCloseButton(closeButton);

            document.body.appendChild(openButton);
            document.body.appendChild(closeButton);
        }

        overlay.appendChild(innerContainer);

        return overlay;
    }

    const generatedOverlay = await generateOverlay();

    if (generatedOverlay) {
        setOverlayContainer(generatedOverlay);

        const observerCallback = (mutationList, observer) => {
            const saveDivs = document.querySelectorAll('div');

            // Find the "AI Overview" title above the AI overview section.
                // I could see this DOM element being removed if Google fully made the switch to AI centric search.
            const findAIOverview = Array.from(saveDivs)
                .find(item => item.innerText.trim().toLowerCase() === 'ai overview');

            const findFAQContainer = Array.from(saveDivs)
                .find(item => item.innerText.trim().toLowerCase() === 'people also ask');

            // Remove the AI overview section if exists.
            const h1 = Array.from(document.querySelectorAll('h1'))
                .find(el => el.innerText.trim() === 'Search Results');

            if (findAIOverview) {

                const aiResponse = findAIOverview.nextElementSibling
                const aiContainer = findAIOverview.parentElement;

                setAiResponse(aiResponse);
                setAiContainer(aiContainer);

                const theOverlay = getInnerContainer();

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

                // only open the overlay if we have found an ai chat?
                    // Could still get opened for just a FAQ result, but feels less useful as those are related answers.

                if (aiContainer) {
                    // theOverlay.appendChild(aiContainer);

                    if (findFAQContainer) {
                        findFAQContainer.parentElement.style.width = '100%';
                        setFAQContainer(findFAQContainer.parentElement);
                        theOverlay.appendChild(getFAQContainer());
                    }

                    setInnerContainer(theOverlay);

                    const overlayContainer = getOverlayContainer();

                    overlayContainer.appendChild(getInnerContainer());

                    setOverlayContainer(overlayContainer);

                    document.body.appendChild(getOverlayContainer());

                    if (getDisplayNavButtons()) {
                        const closeButton = getCloseButton();
                        show(closeButton, 'block');
                        setCloseButton(closeButton);
                    }



                    openOverlay(new Event('click'));

                    // Remove h1 here.
                    if (h1 && h1.nextElementSibling?.nextElementSibling) {
                        h1.nextElementSibling.nextElementSibling.remove();
                    }

                }

                observer.disconnect();
            }
        }

        const observer = new MutationObserver(observerCallback);
        const config = { attributes: true, childList: true, subtree: true };
        observer.observe(document.body, config);
    }

})();