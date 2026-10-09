/*
 * A 13 x 11 pixel orange cat, sitting and facing right. Drawn from a tiny
 * character map so it's easy to tweak. The tail has two frames that the CSS
 * alternates between, and the eyes blink by briefly taking the fur colour.
 */

const FUR = "#ff9e5e";
const STRIPE = "#c56f3b";
const PAW = "#efe6d2";
const EYE = "#6fd3a6";
const NOSE = "#efe6d2";

// o = fur, s = stripe, p = paw, e = eye, n = nose. Columns 0..12.
const BODY = [
  "      o   o  ",
  "      ooooo  ",
  "      oeoeo  ",
  "      oonoo  ",
  "    oooooo   ",
  "   ooooooo   ",
  "   oosoooo   ",
  "  oosooooo   ",
  "  oooooooo   ",
  "  oooooopp   ",
  "  ooooooooo  ",
];
const TAIL_UP: [number, number][] = [[1, 9], [0, 8], [0, 7], [1, 6]];
const TAIL_DOWN: [number, number][] = [[1, 10], [0, 10], [0, 9]];

const colour: Record<string, string> = { o: FUR, s: STRIPE, p: PAW, e: EYE, n: NOSE };

export function CatSprite({ x, y }: { x: number; y: number }) {
  const px: React.ReactElement[] = [];
  BODY.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      const fill = colour[ch];
      if (!fill) return;
      px.push(
        <rect
          key={`${r}-${c}`}
          x={x + c}
          y={y + r}
          width={1}
          height={1}
          fill={fill}
          className={ch === "e" ? "cat__eye" : undefined}
        />,
      );
    }),
  );
  return (
    <g className="cat">
      {px}
      <g className="cat__tail cat__tail--up">
        {TAIL_UP.map(([c, r]) => (
          <rect key={`u${c}-${r}`} x={x + c} y={y + r} width={1} height={1} fill={FUR} />
        ))}
      </g>
      <g className="cat__tail cat__tail--down">
        {TAIL_DOWN.map(([c, r]) => (
          <rect key={`d${c}-${r}`} x={x + c} y={y + r} width={1} height={1} fill={FUR} />
        ))}
      </g>
    </g>
  );
}

/** A floating pixel heart, used when the cat is petted. */
export function Heart({ x, y }: { x: number; y: number }) {
  const map = [" o o ", "ooooo", " ooo ", "  o  "];
  return (
    <g className="heart" aria-hidden="true">
      {map.flatMap((row, r) =>
        [...row].map((ch, c) =>
          ch === "o" ? <rect key={`${r}-${c}`} x={x + c} y={y + r} width={1} height={1} fill="#6fd3a6" /> : null,
        ),
      )}
    </g>
  );
}

/** Standalone cat for pages outside the hub scene, e.g. the 404 page. */
export function LostCat() {
  return (
    <svg viewBox="-2 -9 20 21" className="lost-cat" shapeRendering="crispEdges" role="img" aria-label="An orange pixel cat looking puzzled">
      <rect x={8} y={-8} width={6} height={7} fill="#2a2645" stroke="#6fd3a6" strokeWidth={0.5} />
      {[[10, -7], [11, -7], [12, -6], [11, -5], [11, -3]].map(([qx, qy]) => (
        <rect key={`${qx}${qy}`} x={qx} y={qy} width={1} height={1} fill="#ff9e5e" />
      ))}
      <CatSprite x={0} y={0} />
      <rect x={-2} y={11} width={20} height={1} fill="#514a7a" />
    </svg>
  );
}
