import { profile } from "../content/profile.ts";
import { bike, badmintonRacket, chessKnight, pcTower, pickleballPaddle, tableTennisPaddle } from "../lib/sprites.ts";
import { PixelArt } from "./PixelArt";

const scrambler = bike("scrambler", "#ff9a52", "#b5551f", "#ffcf5c");
const items = [
  { name: "Motorcycles", note: "Teardown to build", sprite: scrambler },
  { name: "PC setups", note: "Configured, tuned", sprite: pcTower },
  { name: "Badminton", note: "Smash and clear", sprite: badmintonRacket },
  { name: "Pickleball", note: "Dink and drive", sprite: pickleballPaddle },
  { name: "Table tennis", note: "Spin cycle", sprite: tableTennisPaddle },
  { name: "Chess", note: "The long game", sprite: chessKnight },
];

/** The off-duty loadout: the things I do when I'm not shipping code, as an RPG inventory. */
export function Loadout() {
  const status = profile.character.find((c) => c.label === "Status")?.value ?? "";
  return (
    <div className="loadout">
      <ul className="loadout__grid" aria-label="Off-duty loadout">
        {items.map((it) => (
          <li key={it.name} className="slot">
            <span className="slot__art">
              <PixelArt rows={it.sprite.rows} palette={it.sprite.palette} />
            </span>
            <b>{it.name}</b>
            <small>{it.note}</small>
          </li>
        ))}
      </ul>
      <p className="status">
        <span className="status__dot" aria-hidden="true" />
        <span>
          <b>Status</b> {status}
        </span>
      </p>
    </div>
  );
}
