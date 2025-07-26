# AI Only Google

## Project Goal

Explore the future possibilities of search and possible implementations of user flows that could be a part of our daily lives in the coming future.

## TODO

Worrysome:
- HARD(er): Only display the popup loader on the search results page (not images, short videos, etc).
    - Use the navigation bar, maybe there are active classes on the highlighted current page.
- Checkbox for power on/off is not focusable.

General:
- Add custom loading animations.
- Set a name (or use Google API console to allow for OAuth login with Google account)?
- Sometimes AI overview will not properly transfer to the overlay, this happens when the page is reloaded numerous times.

## Initial Thoughts

This past weekend I spent a lot of time thinking about the future of people and how they will want to interact and use technology. Websites are great, but they are inconsistent in layout and are sometimes slow and dysfunctional.

One persons Grandma said that she "does not want to see links anymore!!!" (on Google). And hey fair enough, there are a lot of them and they can be quite overwhelming. SO I thought (unless this already exists) why not enable this sort of functionality for this persons Grandmother by building a Chrome Extension that focuses on the AI/quick-answer portions of the results page.

I am probably going to switch the overlay for hiding of DOM elements and a focus on the AI portions on the loaded page, with the option to display the results as they should be.

Currently, this plugin adds an overlay that displays the AI answer in full immediatley + the related links and FAQ section. All the quickest things that could be available in your AI answerable query.

If no AI answer is available then you will not receive any sort of functionality from the plugin.

This shouldn't be the end of this idea though. It shouldn't only be a DOM manipulation...and until Google alters its model to display AI answers first and focus on that experience this will be one solution.

What if the extension used it's own AI to break down the page and read it to you at the level you want, or in the style that you want based on your plugins settings. Or what if this was involved at a browser level (where customizable models is a realistic product for $5-$10 a month).

If I did add custom Ollama to the plugin (locally) then I could have it intake the pages results and make a summary.

Does Google have any legal blockages in this regard...can they not just remove the search feature as it's been for 'hundreds of years' because they will get in legal trouble with a government or governments? Who knows...probably a Google AI Overview.

As I thought, they do not! Google could just fundamentally change their business model. If no one is clicking the links then why show them! Make people pay for a customized AI experience that can lead to some links...but in the nice sidebar popup tab way they are doing now, not hyperlinks.

At this point I must have stopped typing in this document and began typing in the JavaScript files...!