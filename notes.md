# My Blog - Miscellaneous Notes

## Dev / Testing

- Add unit tests for code...
- Run tests on automatically travis ci
- Add ability to specify different environments
- Put project in container for easy deployment (?)
- Split api and frontend server into separate projects (?)
- Create monorepo with articles included to facilitate development (?)

## Functionality

- Add Archive page to make it easier for people to find articles (?)
- Display placeholders for Teasers in Archive component to make archive
  appear to load faster
- Display each article immediately when loaded to make it appear archive
  loads faster
- Add Pagination to archive list (not needed for mvp ?)
- DONE! - Only show articles marked with "status:published" when in
  production mode

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

- Add MathJax to the markdown parser for articles?

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
