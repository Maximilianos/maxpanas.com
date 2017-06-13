# [maxpanas.com](https://maxpanas.com)

## About

I started working on this blog for two reasons:
1. I wanted a place to try applying some of the things I had been learning about the Web and JavaScript in particular
2. I wanted a place to write down my thoughts on all the things I was learning every day on the job

## Tech specs

The core technical aspect of this blog is that it is a responsive web site that acts as an SPA on the frontend while also working in full with JavaScript disabled. The site is currently architected as follows:
- The frontend, found in the `src/app` directory is the view layer that gets rendered universally on the server and client
- The browser entry file, found in the `src/browser` directory is the file root that webpack will use to compile the JavaScript/CSS/Assets bundle that will finally get delivered to able browsers and handles rendering the view layer on the client
- The server frontend, found in the `src/server/frontend` directory handles rendering, caching and serving the view layer on the server (it also handles handing over non-ajax form submissions to the forms api)
- The server content api found in the `src/server/api/content` directory handles processing, caching and serving api requests for content stored in the [articles](https://github.com/Maximilianos/articles) github repository
- The server forms api found in the `src/server/api/forms` directory handles processing form submissions from the frontend

## Credits

This project was initially loosely based on the [este project](https://github.com/este/este) but has deviated significantly since.
