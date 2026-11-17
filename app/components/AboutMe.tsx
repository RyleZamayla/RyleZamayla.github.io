import { Link } from "react-router";
import { profile } from "../content/profile.ts";
import { useReveal } from "../hooks/useReveal.ts";

/** "Player 1" character card plus a few lines in Ryle's own words. */
export function AboutMe() {
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={`about ${revealClass}`}>
      <figure className="player-card">
        <p className="player-card__tag" aria-hidden="true">
          Player 1
        </p>
        <img
          className="player-card__avatar"
          src={profile.avatar.src}
          width={profile.avatar.width * 3}
          height={profile.avatar.height * 3}
          alt={`Pixel-art portrait of ${profile.name}`}
        />
        <figcaption>
          <p className="player-card__name">{profile.name}</p>
          <dl className="player-card__stats">
            {profile.character.map((c) => (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd>{c.value}</dd>
              </div>
            ))}
          </dl>
        </figcaption>
      </figure>

      <div className="about__text">
        <p className="about__lead">
          Honestly? I build things so I can be lazy. Every tool I make is one less chore in my day. That&rsquo;s how a
          month of timesheets turned into an afternoon.
        </p>
        <p>
          The two I&rsquo;m proudest of: <Link to="/projects/sweltrack">SwelTrack</Link>, the most intricate system
          I&rsquo;ve built, where one payroll bug could cost real money; and the{" "}
          <Link to="/projects/field-operations-platform">operations platform</Link> I work on at my job, now used across
          the company&rsquo;s operations and making routine work run noticeably smoother.
        </p>
        <p>
          I&rsquo;ve been freelancing for 5+ years. Alongside client work I build the tools I wish existed:{" "}
          <Link to="/projects/wais">WAIS</Link>, a money tracker that keeps everything on my own phone, and{" "}
          <Link to="/projects/isbogi">ISBOGI</Link>, a live van-arrival pilot I built to test with real commuters.
        </p>
        <p>
          Away from the keyboard, I&rsquo;m a self-taught motorcycle mechanic. Electrics are my strong suit; engine
          rebuilds, not yet. I also play badminton and pickleball competitively, still going after tearing my ACL and
          meniscus.
        </p>
      </div>
    </div>
  );
}
