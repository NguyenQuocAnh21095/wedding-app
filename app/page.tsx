"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="invite-shell">
      <nav className="site-nav" aria-label="Invitation navigation">
        <a className="monogram" href="#top" aria-label="Back to top">M <span>&amp;</span> A</a>
        <div className="nav-links">
          <a href="#details">The details</a>
          <a href="#rsvp">RSVP</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Hope we have wonderful memories together</p>
          <h1>Mai <i>&amp;</i> Anh</h1>
          <p className="hero-date">Happy the 5th month anniversary</p>
          <div className="hero-rule" aria-hidden="true"><span>✦</span></div>
          <p className="hero-location">Saturday, September 19, 2026<br />Place · Place</p>
          <a className="button button-light" href="#rsvp">Scroll to see our memories <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-stamp" aria-hidden="true">19<br /><small>SEP</small><br />26</div>
        {/* <div className="scroll-note" aria-hidden="true">Scroll to see our memories <span>↓</span></div> */}
      </section>

      <section className="welcome-section">
        <div className="section-label">01 / A note from us</div>
        <div className="welcome-content">
          <p className="large-copy">We found our way to each other,<br /><em>and we would love to celebrate<br />the next chapter with you.</em></p>
          <p className="body-copy">From our first coffee in Brooklyn to a thousand small adventures since, our story has always been made brighter by the people we love. Save the date for an afternoon of good food, dancing, and one very happy “I do.”</p>
        </div>
      </section>

      <section className="details-section" id="details">
        <div className="section-label">02 / The details</div>
        <div className="details-grid">
          <article className="detail-block"><span className="detail-icon">◷</span><h2>When</h2><p>Saturday, September 20, 2025<br />Ceremony at 4:00 in the afternoon<br />Dinner &amp; dancing to follow</p></article>
          <article className="detail-block"><span className="detail-icon">⌂</span><h2>Where</h2><p>The Willow House<br />18 Orchard Lane<br />Hudson Valley, New York</p><a className="text-link" href="https://maps.google.com/?q=Hudson+Valley+New+York" target="_blank" rel="noreferrer">Get directions ↗</a></article>
          <article className="detail-block"><span className="detail-icon">✧</span><h2>Dress code</h2><p>Garden formal<br />Think joyful colors, comfortable shoes,<br />and something you can dance in.</p></article>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-intro"><div className="section-label">03 / Be our guest</div><h2>Will you join us?</h2><p>Kindly reply by August 1st.<br />We can&apos;t wait to celebrate with you.</p></div>
        {submitted ? <div className="thank-you"><span>✦</span><h3>Thank you, we&apos;ll see you there.</h3><p>Your RSVP has been received.</p></div> : <form className="rsvp-form" onSubmit={handleSubmit}><label htmlFor="name">Your name<input id="name" name="name" placeholder="First and last name" required /></label><label htmlFor="attendance">Will you be joining us?<select id="attendance" name="attendance" defaultValue="yes"><option value="yes">Joyfully accepts</option><option value="no">Regretfully declines</option></select></label><button className="button button-dark" type="submit">Send RSVP <span aria-hidden="true">↗</span></button></form>}
      </section>

      <footer><p>With love, Anna &amp; James</p><span>2025 · Hudson Valley</span></footer>
    </main>
  );
}
