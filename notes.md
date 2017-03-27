# My Blog - Miscellaneous Notes

## What do I need to do to deploy to the staging environment?

- DONE! - setup the staging server with the project
- DONE! - fix the fixed localhost paths in the app/config.js
- DONE! - set up Let's Encrypt for staging
- add better handling of staging environment related configuration and behavior
  - configure meta robots in staging and dev to be noindex, nofollow (or configure proxy to serve robots.txt for staging)

## What do I need to do to deploy to the live environment?

- DONE! - setup the live server with the project (it is the same as the staging server for now)
- set up Let's Encrypt for live

## Design

- Make teasers more like Material Design cards?
  - make the hover more subtle (not full tomato background)
  - make the card appear to lift off the page realistically
  - page transition animation, when clicking the card: make it expand to 
    fill the viewport and make sure the title takes it's correct place

## Dev / Testing

- Move to WebPack 2
- DONE! - Update Node to Latest
- Update Node Modules to Latest
- Add unit tests for code...
- Run tests automatically on travis ci
- Put project in container for easy deployment (?)
- Split api and frontend server into separate projects (?) <=
- Create monorepo with articles included to facilitate maintenance (?)
- find a way to remove webpackIsomorphicTools
- fix the TODOs in the code

## Error Handling

- DONE! - fix generic error handler so that it responds to errors
- Propagate errors to error handling middleware, do not respond to them directly in handlers
- Add separate error renderer for the api responses
- and separate error renderer for the frontend responses
- add suggestions on frontend error page for potential misspelling of links
- replace console.log with proper error logging software

## Accessibility

- check site for WCAG compliance

## Security

- DONE! - Add meta robots noindex, nofollow for development mode
- Add a Content Security Policy
- Use Let's Encrypt to implement HTTPS
- Secure Redis Server
- Secure Node/Express Server
- make sure observatory by mozilla comes back with a high score
- make sure no unnecessary ports are open on the deployment server

## Performance

- Only load polyfils when actually required
- Make sure cache headers are set correctly
  - cache-control: max-age=3600, immutable - https://code.facebook.com/posts/557147474482256/this-browser-tweak-saved-60-of-requests-to-facebook
- General
  - switch to graphql + relay or lokka instead of REST
  - (subsetting) Make custom builds of the fonts with only the glyphs actually
    being used included for each font. (not really applicable to the body font)
- Time to first Meaningful Paint
  - DONE! - font loading strategy that replaces FOIT (Flash of Invisible Text)
            with FOUT (Flash of Unstyled Text), thus making the content 
            accessible earlier (no-js should not be affected)
- Time to Interactive
  - code-split app for each route so as to download the minimum required js for
    each page
- Make sure images are using the responsive images apis
- Use an SVG for the site Logo instead of text and a font (?)

## Functionality

- Add ability to have a series of related articles, like a youtube playlist. I envision
  it in the left sidebar on the article page (on mobile? where would I put it)

- DONE? - Make sure no-js class is removed only when js generally executes successfully (?)

- Api calls
  - DONE! - authenticate GitHub api calls with a token, so as not to incur limits on un-authenticated calls  
  - DONE! - make contact form use absolute url not relative for api submission
  - DONE! - make content api calls use absolute url not relative
  - DONE! - cache all successful api calls in redis db
  - DONE! - split up cache so that each microservice has its own cache

- Contact Form
  - DONE! - Fix bug with contact form when no-js and submitting two separate forms
  - DONE! - Add honeypot to email sender to reduce spam
  - Add server side cool-off rate limiter for multiple submissions
  - Use a better service to send emails to me (?)
  - Store submissions somewhere... (?)

- Archive
  - DONE! - Sort archive articles by publish date
  - DONE! - Only include articles marked with "status:published" when in 
            production mode
  - Add Archive page to make it easier for people to find articles (?)
  - DONE! - Display placeholders for Teasers in Archive component to make archive
            appear to load faster
  - DONE! - Display each article immediately when loaded to make it appear archive
            loads faster
  - Add Pagination to archive list (not needed for mvp ?)
  - Create a new endpoint for each archive teaser so as not to download the entire
    article's content

- Articles
  - should move the url for article pages to /articles/:article (?)
  - DONE! - Only show articles marked with "status:published" when in
            production mode
  - DONE! - Add published date
  - DONE! - Add date of last update
  - DONE! - Add author(s) avatar(s)
  - DONE! - Add contributor(s) avatar(s)
  - do something with reading time data
  - add social sharing buttons
  - add comment form
  - add comment feed
  - Add MathJax to the markdown parser for articles (?)

## Cache

- DONE! - consolidate cache handling between frontend server and content api server
- promisify redis cache client and use async/await for better readability
- add authentication when interfacing with Redis Server
- add testing for Lua script - based on: 
  http://ilyapimenov.com/blog/2014/09/19/lua-scripts-in-redis-within-nodejs.html
- redis setup likely needs rearchitecting, particularly because of the operations
  to selectively clean up cached items when modifications are made to articles
- setup
  - DONE! - cache must **only** be populated if the response has _no_ errors
  - DONE! - cache can keep data until the data is invalidated
  - DONE! - long term cache vs short term cache (?)
  - DONE! - cache parsed content api responses. Key: `api.content.parsed.${type}.${id}`
    - should invalidate when server restarts
  - N/A - cache raw github api responses for content. Key: `api.content.raw.${type}.${id}`
    - DONE! - should invalidate when content changes on github
       (implemented with git hook ?)
  - DONE! - cache frontend page renderings `frontend.${route}`
    - DONE! - should invalidate all pages when the year changes to update
               myYearsExperience and the copyright across the site
    - DONE! - should invalidate archive pages and specific article pages when a specific
       bit of content gets updated


- Invalidation
  - DONE! - Static cache should invalidate when the year changes to update 
    myYearsExperience and the copyright across the site
  - DONE! - Static cache should invalidate when an article is added so that the
    archive pages and the article page are created/updated


## Analytics

- Server-side logging
  - log page request


- Client-side analytics event tracking. Events to track:
  - page view
  - contact form
    - touched (?)
    - partially filled in (?)
    - fully filled in
    - submission
      - success
      - failure - note reason
