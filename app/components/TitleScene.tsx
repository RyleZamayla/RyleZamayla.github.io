import { badmintonRacket, bike, chessKing, chessKnight, chessRook, headphones, mug, plant, sleepingCat, spritePaths, tableTennisPaddle, type Sprite } from "../lib/sprites.ts";

/*
 * The title screen: a night-lit workstation drawn on a 320 x 180 pixel grid.
 * The monitor shows project work (code, build progress, a contribution grid, a
 * chart); the shelves hold motorcycle figurines and a chess set; a racket and a
 * paddle hang on the wall. Each layer is its own group so the page can move
 * them at different speeds as you scroll (the "--dy" values), and the camera
 * pushes into the monitor as you scroll.
 */
type R = [number, number, number, number];
const path = (rects: R[]) => rects.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}z`).join("");
const style = (o: Record<string, string>) => o as React.CSSProperties;

function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/**
 * A sprite with depth: a soft contact shadow, an extruded dark side (drawn as
 * the same shape pushed down and right), a faint rim of light on the upper
 * left, and then the sprite itself. Set depth to 0 to draw it flat.
 */
function Sprite({ s, x, y, scale = 1, className, depth = 1, shadow = true }: { s: Sprite; x: number; y: number; scale?: number; className?: string; depth?: number; shadow?: boolean }) {
  const paths = spritePaths(s.rows, s.palette);
  const all = paths.map((p) => p.d).join("");
  const w = Math.max(...s.rows.map((r) => r.length));
  const h = s.rows.length;
  const d = depth / scale;
  return (
    <g className={className} transform={`translate(${x} ${y}) scale(${scale})`}>
      {shadow && <ellipse cx={w / 2 + 1.5} cy={h + 0.2} rx={w * 0.55} ry="1.1" fill="#000" opacity="0.38" />}
      {depth > 0 && (
        <>
          <path d={all} fill="#05030f" opacity="0.55" transform={`translate(${d * 1.2} ${d * 1.2})`} />
          <path d={all} fill="#05030f" opacity="0.35" transform={`translate(${d * 0.6} ${d * 0.6})`} />
          <path d={all} fill="#fff" opacity="0.22" transform={`translate(${-d * 0.4} ${-d * 0.4})`} />
        </>
      )}
      {paths.map((p) => (
        <path key={p.fill + p.d.length} fill={p.fill} d={p.d} />
      ))}
    </g>
  );
}

const DESK = 140; // y of the desk surface

const bikes = {
  sport: bike("sport", "#d6304f", "#8f1d36", "#ff8aa0"),
  cafe: bike("cafe", "#2fa06a", "#1d6a44", "#6fe3b4"),
  scrambler: bike("scrambler", "#ff9a52", "#b5551f", "#ffcf5c"),
};

/** What's on the monitor: code, build progress, a contribution grid and a chart. */
const screen = (() => {
  const r = lcg(21);
  const code: { x: number; y: number; w: number; c: string }[] = [];
  const indents = [0, 2, 2, 4, 4, 2, 4, 4, 2, 0, 0, 2];
  const widths = [14, 20, 16, 24, 12, 18, 22, 10, 16, 8, 6, 12];
  const colors = ["#6fe3b4", "#a99aff", "#ff9a52", "#f4eee0", "#6fe3b4", "#a99aff"];
  indents.forEach((ind, i) => code.push({ x: 180 + ind * 2, y: 84 + i * 3.6, w: widths[i]!, c: colors[(i * 5 + 1) % colors.length]! }));
  const grid: { x: number; y: number; c: string }[] = [];
  const levels = ["#1d2160", "#1f6b52", "#2fa06a", "#6fe3b4"];
  for (let cx = 0; cx < 10; cx++) for (let cy = 0; cy < 4; cy++) grid.push({ x: 217 + cx * 4, y: 113 + cy * 4, c: levels[Math.floor(r() * r() * 4)]! });
  const bars = [8, 12, 9, 16, 20, 24, 31].map((h, i) => ({ x: 262 + i * 4.6, h, c: i === 6 ? "#6fe3b4" : "#8f7cff" }));
  return { code, grid, bars };
})();

const stars = (() => {
  const r = lcg(11);
  return Array.from({ length: 36 }, (_, i) => ({ x: Math.floor(r() * 320), y: Math.floor(r() * 56), tw: i % 3 === 0 }));
})();

const keys = (() => {
  const out: R[] = [];
  for (let row = 0; row < 3; row++) for (let k = 0; k < 17; k++) out.push([187 + k * 3.2, 143 + row * 2, 2.2, 1.3]);
  out.push([196, 149, 22, 1.3]);
  return out;
})();

export function TitleScene() {
  return (
    <svg className="title__scene" viewBox="0 0 326 180" preserveAspectRatio="xMaxYMax slice" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ts-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090720" />
          <stop offset="1" stopColor="#1c1648" />
        </linearGradient>
        <linearGradient id="ts-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a6740" />
          <stop offset="1" stopColor="#5e3b27" />
        </linearGradient>
        <linearGradient id="ts-led" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f7cff" />
          <stop offset="0.5" stopColor="#6fe3b4" />
          <stop offset="1" stopColor="#ff9a52" />
        </linearGradient>
        <linearGradient id="ts-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c48a58" />
          <stop offset="0.5" stopColor="#a8714a" />
          <stop offset="1" stopColor="#7a4d33" />
        </linearGradient>
        <linearGradient id="ts-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3724" />
          <stop offset="1" stopColor="#2c1a10" />
        </linearGradient>
        <linearGradient id="ts-shelf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b57a4c" />
          <stop offset="1" stopColor="#7a4d33" />
        </linearGradient>
        <linearGradient id="ts-case" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1c1a45" />
          <stop offset="0.5" stopColor="#100f2c" />
          <stop offset="1" stopColor="#07061a" />
        </linearGradient>
        <linearGradient id="ts-bezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2c2a5c" />
          <stop offset="0.4" stopColor="#12102e" />
          <stop offset="1" stopColor="#06050f" />
        </linearGradient>
        <linearGradient id="ts-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ts-reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fe3b4" stopOpacity="0.28" />
          <stop offset="1" stopColor="#8f7cff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ts-vignette" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <radialGradient id="ts-screenglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#6fe3b4" stopOpacity="0.32" />
          <stop offset="0.55" stopColor="#8f7cff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#8f7cff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ts-warm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff9a52" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ff9a52" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Back wall with an RGB light strip */}
      <rect width="326" height="146" fill="url(#ts-wall)" />
      <g className="ts-l" style={style({ "--dy": "0px" })}>
        {stars.map((s, i) => (
          <rect key={i} className={s.tw ? "ts-twinkle" : undefined} x={s.x} y={s.y} width="1" height="1" fill="#f4eee0" opacity="0.4" style={s.tw ? style({ animationDelay: `${(i % 7) * 0.4}s` }) : undefined} />
        ))}
        <rect y="12" width="326" height="1" fill="url(#ts-led)" className="ts-rgbstrip" />
        <rect y="9" width="326" height="7" fill="url(#ts-led)" opacity="0.1" />
      </g>

      {/* Shelves: motorcycle figurines and a chess set */}
      <g className="ts-l" style={style({ "--dy": "3px" })}>
        {/* the shelf casts a soft shadow on the wall, then has a lit top, a front face and brackets */}
        <rect x="164" y="65" width="132" height="5" fill="#000" opacity="0.28" />
        <path d={path([[164, 61, 132, 1]])} fill="#d9a06c" />
        <rect x="164" y="62" width="132" height="2" fill="url(#ts-shelf)" />
        <rect x="164" y="64" width="132" height="1" fill="#2a190e" />
        <path d="M170 65h5v4l-5 -4zM285 65h5l0 0l-5 4z" fill="#5e3b27" />
        <path d={path([[170, 65, 2, 5], [288, 65, 2, 5]])} fill="#5e3b27" />
        <path d={path([[170, 65, 1, 5], [288, 65, 1, 5]])} fill="#8a5a3c" />
        <Sprite s={bikes.sport} x={166} y={44} scale={1.2} />
        <Sprite s={bikes.cafe} x={203} y={44} scale={1.2} />
        <Sprite s={bikes.scrambler} x={240} y={44} scale={1.2} />
        <Sprite s={plant} x={280} y={48} />
        <rect x="196" y="41" width="100" height="4" fill="#000" opacity="0.26" />
        <path d={path([[196, 37, 100, 1]])} fill="#d9a06c" />
        <rect x="196" y="38" width="100" height="2" fill="url(#ts-shelf)" />
        <rect x="196" y="40" width="100" height="1" fill="#2a190e" />
        <Sprite s={chessKing} x={202} y={23} />
        <Sprite s={chessKnight} x={216} y={25} />
        <Sprite s={chessRook} x={229} y={26} />
        <path d={path([[251, 23, 26, 16]])} fill="#000" opacity="0.35" />
        <path d={path([[250, 22, 26, 16]])} fill="#3a3670" />
        <path d={path([[250, 22, 26, 1], [250, 22, 1, 16]])} fill="#6a64b0" />
        <path d={path([[250, 37, 26, 1], [275, 22, 1, 16]])} fill="#14112e" />
        <path d={path([[252, 24, 22, 12]])} fill="#120f30" />
        <path d={path([[254, 27, 8, 1], [254, 30, 14, 1], [254, 33, 10, 1], [270, 26, 3, 8]])} fill="#6fe3b4" opacity="0.8" />
        <Sprite s={badmintonRacket} x={304} y={24} />
        <Sprite s={tableTennisPaddle} x={304} y={58} scale={0.9} />
      </g>

      {/* The monitor: project work glowing in the dark */}
      <g className="ts-l" style={style({ "--dy": "5px" })}>
        <ellipse className="ts-glow" cx="232" cy="104" rx="104" ry="58" fill="url(#ts-screenglow)" />
        {/* side and underside thickness, so it reads as a solid slab */}
        <path d="M298 74 L302 77 L302 132 L298 130 Z" fill="#05040f" />
        <path d="M166 130 L298 130 L302 133 L170 133 Z" fill="#0b0a1c" />
        <rect x="166" y="74" width="132" height="56" fill="url(#ts-bezel)" />
        <path d={path([[166, 74, 132, 1], [166, 74, 1, 56]])} fill="#4a468a" />
        <path d={path([[166, 129, 132, 1], [297, 74, 1, 56]])} fill="#030208" />
        <rect x="168" y="76" width="128" height="52" fill="#0e1130" />
        <rect x="168" y="76" width="128" height="5" fill="#161a46" />
        <path d={path([[171, 78, 2, 2], [175, 78, 2, 2], [179, 78, 2, 2]])} fill="#ff9a52" opacity="0.9" />
        <path d={path([[186, 78, 46, 1]])} fill="#343a82" />
        <rect x="170" y="83" width="6" height="43" fill="#121545" />
        {screen.code.map((l, i) => (
          <rect key={i} x={l.x} y={l.y} width={l.w} height="2" fill={l.c} opacity="0.9" />
        ))}
        <rect className="ts-cursor" x="192" y="124" width="2" height="2" fill="#f4eee0" />
        {/* Build progress */}
        <path d={path([[217, 84, 16, 2], [217, 90, 12, 1], [217, 98, 14, 1], [217, 106, 10, 1]])} fill="#a9a3c4" opacity="0.7" />
        {[[91, 30, "#6fe3b4"], [99, 38, "#6fe3b4"], [107, 20, "#ff9a52"]].map(([y, w, c], i) => (
          <g key={i}>
            <rect x="217" y={(y as number) + 0} width="38" height="3" fill="#1d2160" />
            <rect x="217" y={y as number} width={w as number} height="3" fill={c as string} />
          </g>
        ))}
        {screen.grid.map((g, i) => (
          <rect key={i} x={g.x} y={g.y} width="3" height="3" fill={g.c} />
        ))}
        {/* Chart */}
        <path d={path([[262, 84, 18, 2], [262, 89, 8, 1]])} fill="#a9a3c4" opacity="0.7" />
        <path d={path([[262, 125, 33, 1]])} fill="#343a82" />
        {screen.bars.map((b, i) => (
          <rect key={i} x={b.x} y={125 - b.h} width="3" height={b.h} fill={b.c} />
        ))}
        <path d="M168 76 L226 76 L190 128 L168 128 Z" fill="url(#ts-sheen)" />
        <rect x="167" y="75" width="130" height="54" fill="none" stroke="#000" strokeOpacity="0.35" />
        {/* neck and weighted base, with their own light and shade */}
        <path d={path([[229, 133, 6, 3]])} fill="#2a2660" />
        <path d={path([[229, 133, 2, 3]])} fill="#4a468a" />
        <path d={path([[233, 133, 2, 3]])} fill="#0c0a22" />
        <path d="M214 137 L250 137 L252 140 L212 140 Z" fill="#1b1838" />
        <rect x="214" y="136" width="36" height="1" fill="#5a56a8" />
        <rect x="212" y="140" width="40" height="1" fill="#000" opacity="0.5" />
      </g>

      {/* Desk, keyboard, mouse and the PC */}
      <g className="ts-l" style={style({ "--dy": "10px" })}>
        {/* the desk top, a lit back edge, wood grain, the glow of the screen, then the front face */}
        <rect y={DESK} width="326" height="14" fill="url(#ts-top)" />
        <rect y={DESK} width="326" height="1" fill="#e2ac78" />
        <path d={path([[6, 145, 34, 1], [52, 149, 46, 1], [110, 146, 30, 1], [18, 151, 26, 1], [140, 150, 24, 1], [270, 146, 36, 1], [262, 151, 30, 1]])} fill="#6b4129" opacity="0.4" />
        <path d={path([[4, 143, 22, 1], [60, 147, 28, 1], [118, 143, 18, 1]])} fill="#e2ac78" opacity="0.18" />
        <ellipse cx="232" cy="145" rx="64" ry="7" fill="url(#ts-reflect)" />
        <rect y={DESK + 14} width="326" height="1" fill="#d8a06a" opacity="0.65" />
        <rect y={DESK + 15} width="326" height="5" fill="url(#ts-front)" />
        <rect y={DESK + 20} width="326" height="3" fill="#000" opacity="0.5" />
        <rect y={DESK + 23} width="326" height="17" fill="#07051a" />
        <rect x="177" y="143" width="92" height="11" fill="#000" opacity="0.35" />
        <rect x="176" y="141" width="92" height="11" fill="#14122e" />
        <rect x="176" y="141" width="92" height="1" fill="#2a2660" />
        <rect x="176" y="151" width="92" height="1" fill="#07051a" />
        <path d="M186 150 h58 l1 2 h-60z" fill="#0d0b24" />
        <rect x="187" y="143" width="58" height="8" fill="#000" opacity="0.4" />
        <rect x="186" y="142" width="58" height="8" fill="#232052" />
        <rect x="186" y="142" width="58" height="1" fill="#3e3a86" />
        <path d={path(keys)} fill="#4a4590" />
        <rect className="ts-rgb" x="186" y="150" width="58" height="1" fill="#6fe3b4" />
        <rect x="255" y="144" width="6" height="8" fill="#000" opacity="0.4" />
        <rect x="254" y="143" width="6" height="8" fill="#232052" />
        <rect x="254" y="143" width="6" height="1" fill="#4a468a" />
        <rect className="ts-rgb" x="256" y="150" width="2" height="1" fill="#6fe3b4" />
        <Sprite s={mug} x={156} y={DESK - 9} className="ts-mug" />
        <g className="ts-steam ts-mug">
          <rect x="158" y={DESK - 13} width="1" height="3" fill="#8f93b8" opacity="0.7" />
          <rect x="160" y={DESK - 15} width="1" height="3" fill="#8f93b8" opacity="0.5" />
        </g>
        {/* the PC */}
        <ellipse className="ts-glow" cx="309" cy="122" rx="28" ry="26" fill="url(#ts-warm)" />
        <ellipse cx="306" cy="141" rx="14" ry="2" fill="#000" opacity="0.4" />
        <path d="M299 96 L303 92 L322 92 L318 96 Z" fill="#3a3680" />
        <path d="M318 96 L322 92 L322 136 L318 140 Z" fill="#05040f" />
        <rect x="299" y="96" width="19" height="44" fill="url(#ts-case)" />
        <path d={path([[299, 96, 19, 1], [299, 96, 1, 44]])} fill="#5a56a8" />
        <rect x="300" y="97" width="17" height="42" fill="#14123a" />
        <path d="M300 97 L309 97 L300 118 Z" fill="url(#ts-sheen)" />
        {[107, 120, 133].map((cy, i) => (
          <g key={cy}>
            <circle className="ts-rgb" cx="308.5" cy={cy} r="4.5" fill="#6fe3b4" style={style({ animationDelay: `${-i * 1.2}s` })} />
            <circle cx="308.5" cy={cy} r="2" fill="#0b0a18" />
          </g>
        ))}
        {/* the cat naps on the left, and stays put on short screens */}
        <g className="ts-catwrap">
          <g className="ts-cat">
            <Sprite s={sleepingCat} x={20} y={DESK - 23} scale={2} />
          </g>
          <g className="ts-zzz" fill="#cfc8ff" transform="translate(-14 -8)">
            <path d={path([[46, 117, 3, 1], [47, 118, 1, 1], [46, 119, 3, 1]])} className="ts-z ts-z1" />
            <path d={path([[52, 111, 4, 1], [54, 112, 1, 1], [53, 113, 1, 1], [52, 114, 4, 1]])} className="ts-z ts-z2" />
            <path d={path([[58, 103, 5, 1], [61, 104, 1, 1], [59, 105, 2, 1], [58, 106, 5, 1]])} className="ts-z ts-z3" />
          </g>
        </g>
        {/* left of the monitor: figurine, chess, headphones, plant */}
        <g className="ts-leftprops">
          <Sprite s={bikes.sport} x={70} y={DESK - 13} scale={1} />
          <Sprite s={chessKing} x={101} y={DESK - 15} />
          <Sprite s={chessKnight} x={111} y={DESK - 13} />
          <Sprite s={chessRook} x={121} y={DESK - 12} />
          <Sprite s={headphones} x={134} y={DESK - 16} />
          <Sprite s={plant} x={9} y={DESK - 14} />
        </g>
      </g>

      {/* Room vignette: pulls the eye to the screen and gives the scene depth */}
      <rect width="326" height="180" fill="url(#ts-vignette)" pointerEvents="none" />

      {/* Specks of light drifting off the screen */}
      <g className="ts-l" style={style({ "--dy": "22px" })}>
        {[[210, 120], [250, 112], [190, 108], [284, 118], [236, 124], [176, 122]].map(([x, y], i) => (
          <rect key={i} className="ts-fly" x={x} y={y} width="1.5" height="1.5" fill="#6fe3b4" style={style({ animationDelay: `${i * 0.9}s` })} />
        ))}
      </g>
    </svg>
  );
}
