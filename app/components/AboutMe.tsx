import { profile } from "../content/profile.ts";

/** The "Player 0" character card: portrait plus the facts in Ryle's own words. */
export function PlayerCard() {
  return (
    <figure className="player-card">
      <p className="player-card__tag" aria-hidden="true">
        Player 0
      </p>
      <img
        className="player-card__avatar"
        src={profile.avatar.src}
        width={profile.avatar.width}
        height={profile.avatar.height}
        alt={profile.avatar.alt}
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
  );
}
