import React from 'react';
import Helmet from 'react-helmet';

import './About.scss';


export default function About() {
  return (
    <main className="about">
      <Helmet
        title="My Story"
        meta={[{
          name: 'description',
          content: 'Max Panas is a web developer with six years of experience ' +
                   'working mostly on the front-end side of the stack.'
        }]}
      />
      <h1 className="about__title">
        My Web Story
      </h1>
      <div className="about__stories">
        <section className="about__story about__story--bio">
          <h2>Short Story</h2>
          <p>
            I have been professionally writing code for the web for the past six
            years. I am currently working as a Software Engineer at Agile Actors
            where I work on a hybrid mobile application for Camelot UK built on
            Cordova, Angular and Ionic.
          </p>
          <p>
            In the last two and half years I have been diving deeper and deeper
            into the world of JavaScript and functional programming. This year I
            gave my first couple of talks at local meet-ups, on topics such as
            "GraphQL vs Rest" and "Why You Need to Understand Modules in
            JavaScript".
          </p>
          <p>
            Now and then I get the chance to publish some of my work into the
            open. The first open source project I ever published was a plugin
            for WordPress called Media Vault. Later, at Mozaik, a creative
            agency I worked for, I created a WordPress theme starter that was
            focused on making our team there as happy and productive as we could
            possibly be. You can find most of my open source work on my GitHub
            profile.
          </p>
        </section>
        <section className="about__story about__story--back-story">
          <h2>Long Story</h2>
          <p>
            I didn't start coding when I was eight. I do not have a computer
            science degree. I hadn't even really considered I might become a
            programmer until about a year after I finished my undergraduate
            degree in Business Administration and Entrepreneurship.
          </p>
          <p>
            I looked on as some of my friends chose the programmer's path as
            early as middle school and although I was interested in the
            things they did, I could never have imagined that years later I
            would be sitting in front of a big bright screen writing about
            how it had come to be that I was now a professional software
            developer. Sure, the signs were there that I might possibly be
            good at this sort of thing, but I definitely did not see them
            then.
          </p>
          <p>
            One thing I have always had, was a knack for tinkering with
            electronics. When I was a kid we had a computer running
            DOS in my big sister's room, but all I knew how to do on that
            was get into Snake and a really obscure game called Dots that I
            never fully understood how to play.
          </p>
          <p>
            The first bit of code I wrote was years later, probably when I
            was around sixteen. I had been playing a game called Morrowind
            for about a year and I decided I wanted to mod it. So I
            downloaded the <em>The Elder Scrolls Construction Set</em>

            <a href="http://wiki.theassimilationlab.com/mmw/Scripting_for_Dummies#Scripting_Tutorial"></a>

          </p>
          <p>
            I love to make things come to life. I sketched using pens or
            pencils on paper since as far back as I can remember.
          </p>
        </section>
      </div>
    </main>
  );
}
