# My Blog - Miscellaneous Notes

## Dev / Testing

- Add unit tests for code...
- Run tests automatically on travis ci
- Add ability to specify different environments
- Put project in container for easy deployment (?)
- Split api and frontend server into separate projects (?)
- Create monorepo with articles included to facilitate maintenance (?)

## Functionality

- Api calls
  - DONE! - make contact form use absolute url not relative for api submission
  - DONE! - make content api calls use absolute url not relative
  - make endpoints for api calls configurable

- Contact Form
  - DONE! - Add honeypot to email sender to reduce spam
  - Add server side cool-off rate limiter for multiple submissions
  - Use a better service to send emails to me (?)
  
- Archive
  - Sort archive articles by publish date
  - Only include articles marked with "status:published" when in 
    production mode
  - Add Archive page to make it easier for people to find articles (?)
  - Display placeholders for Teasers in Archive component to make archive
    appear to load faster
  - Display each article immediately when loaded to make it appear archive
    loads faster
  - Add Pagination to archive list (not needed for mvp ?)
  
- Articles
  - DONE! - Only show articles marked with "status:published" when in
            production mode
  - DONE! - Add published date
  - DONE! - Add date of last update
  - DONE! - Add author(s) avatar(s)
  - DONE! - Add contributor(s) avatar(s)

## Cache

- Static cache should invalidate when the year changes to update 
  myYearsExperience and the copyright across the site

- Static cache should invalidate when an article is added so that the
  archive pages and the article page are created/updated

## Refactor Opportunity

- app/style/utils/contents.scss
- app/style/theme/colors.scss
- update packages in package json

## Random

- Add MathJax to the markdown parser for articles (?)

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
