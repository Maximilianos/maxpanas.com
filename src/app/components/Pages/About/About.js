import React from 'react';
import Helmet from 'react-helmet';

import {Link} from 'react-router';

import './About.scss';
import profilePic from './max.jpeg';


export default function About() {
  const age = (new Date()).getFullYear() - 1988;
  return (
    <main className="about">
      <Helmet
        title="My Story"
        meta={[{
          name: 'description',
          content: (
            'Max Panas is a web developer with six years of experience ' +
            'working mostly on the front-end side of the stack.'
          )
        }]}
      />
      <img
        className="about__intro-figure"
        width="460"
        height="460"
        src={profilePic}
        alt="Max GJ Panas"
      />
      <h1>
        About Me
      </h1>
      <p>
        Hey, my name is Max Panas. I'm {age} years old and I just
        moved to London from sunny Athens, Greece. I work here as a
        software engineer at <a href="http://www.camelotglobal.com/">
        Camelot Global</a>, working to deliver one of their mobile
        apps.
      </p>
      <p>
        I have been professionally writing code for web and mobile
        for the past six years. Within the workplace I find great
        enjoyment in sharing whatever I have learnt, mentoring and
        getting people to work together. This blog is where I hope
        to write down some of the moments and thoughts that I find
        most interesting or useful during my life in software
        development.
      </p>
      <p>
        If you want to say hi, feel free to <Link to="contact">drop
        me a line</Link> or hit me up on Twitter where I tweet
        as <a href="https://twitter.com/mgjp_">@mgjp_</a>. I look
        forward to hearing from you!
      </p>
      <section>
        <h2 className="about__section-title">
          Open Source
        </h2>
        <p>
          I can easily say that open source and the community
          surrounding it were some of the main reasons I ever got to
          where I am today and one of the main things that make me
          really happy and proud to be in software development. The
          following are a few open source projects that I've had the
          chance to kick off myself:
        </p>
        <ul className="about__list about__list--big">
          <li>
            <h3 className="about__list-title">
              <a href="https://github.com/MozaikAgency/wp-theme-starter">
                The Mozaik WP Theme Starter
              </a>
            </h3>
            <p>
              This is the project I am most proud of. Built for what
              the rest of the development team and I dreamed our
              development environment should be able to support and
              do. This theme starter became the starting point for
              almost every project within the company and since its
              release has seen adoption across the globe.
            </p>
          </li>
          <li>
            <h3 className="about__list-title">
              <a href="https://wordpress.org/plugins/media-vault/">
                Media Vault
              </a>
            </h3>
            This is the project I am most ashamed of.
            Not because of code quality or bad reception, but because
            I stopped supporting it. This WordPress plugin to allow
            users to block access to any file they wanted within
            their uploads folder was the first piece of open source I
            ever released. I am proud of what it does, but have found
            it incredibly difficult to find the time to go back and
            support it.
          </li>
          <li>
            <h3 className="about__list-title">
              <a href="https://github.com/Maximilianos/eqheights">
                eqheights
              </a>
            </h3>
            Using ES6 and native DOM operations and no
            runtime dependencies to make all elements in a selection the
            same height was fun when implementing this tiny helper.
          </li>
          <li>
            <h3 className="about__list-title">
              <a href="https://github.com/Maximilianos/solve-conversion-path">
                solve-conversion-path
              </a>
            </h3>
            This one is another fun one. I
            wrote it to solve a problem I was having with a color
            manipulation library I was writing at the time. The
            problem was: Given a set of converters, as a human, I
            can easily pick out the conversions I would need to run
            in order to go from one color format to the next and I
            wanted my library to be able to do just that.
          </li>
          <li>
            <a href="https://github.com/Maximilianos">
              and others&hellip;
            </a>
          </li>
        </ul>
      </section>
      <section>
        <h2 className="about__section-title">
          Speaking
        </h2>
        <p>
          Speaking has been something I've wanted to do for a long
          time, but only recently built up the courage to do. I've
          given my first couple of talks now and I am already
          planning to do more in the future. No looking back!
        </p>
        <ul className="about__list">
          <li>
            <a href="https://greecejs.org/">
              GreeceJS 2016
            </a>
            <ul>
              <li>
                GraphQL vs Rest
              </li>
              <li>
                Why You Need to Understand JavaScript Modules
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </main>
  );
}
