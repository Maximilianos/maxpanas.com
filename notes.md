# My Blog - Miscellaneous Notes

## Dev / Testing

- Add unit tests for code...
- Run tests automatically on travis ci
- Add ability to specify different environments
- Put project in container for easy deployment (?)
- Split api and frontend server into separate projects (?)
- Create monorepo with articles included to facilitate maintenance (?)
- set up production environment
- set up staging environment

## Performance

- General
  - (subsetting) Make custom builds of the fonts with only the glyphs actually
    being used included for each font. (not really applicable to the body font)


- Time to first Meaningful Paint
  - DONE! - font loading strategy that replaces FOIT (Flash of Invisible Text)
            with FOUT (Flash of Unstyled Text), thus making the content 
            accessible earlier (no-js should not be affected)


- Time to Interactive
  - code-split app for each route so as to download the minimum required js for
    each page

## Functionality

- Api calls
  - DONE! - make contact form use absolute url not relative for api submission
  - DONE! - make content api calls use absolute url not relative
  - cache all successful api calls in redis db
  - split up cache so that each microservice has its own cache

- Contact Form
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

- Articles
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

## Cache

- setup
  - DONE! - cache must **only** be populated if the response has _no_ errors
  - cache can keep data until the data is invalidated
  - long term cache vs short term cache (?)
  - cache parsed content api responses. Key: `api.content.parsed.${type}.${id}`
    - should invalidate when server restarts
  - cache raw github api responses for content. Key: `api.content.raw.${type}.${id}`
    - should invalidate when content changes on github
       (implemented with git hook ?)
  - cache frontend page renderings `frontend.${route}`
    - DONE! - should invalidate all pages when the year changes to update
               myYearsExperience and the copyright across the site
    - should invalidate archive pages and specific article pages when a specific
       bit of content gets updated


- Invalidation
  - Static cache should invalidate when the year changes to update 
    myYearsExperience and the copyright across the site
  - Static cache should invalidate when an article is added so that the
    archive pages and the article page are created/updated

## Refactor Opportunity

- app/style/utils/contents.scss
- app/style/theme/colors.scss
- update packages in package json

## Random

- Use an SVG for the site Logo instead of text and a font (?)
- Add MathJax to the markdown parser for articles (?)
- Make sure no-js class is removed only when js generally executes successfully (?)

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
