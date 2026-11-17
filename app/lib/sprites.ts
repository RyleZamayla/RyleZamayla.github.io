/*
 * Pixel-art sprites drawn from code. Plain TypeScript, no React, so the same
 * art can be used by the title scene, the hub's loadout and the little icons.
 * Each sprite is a list of rows; each letter is a colour in its palette.
 */
export type Palette = Record<string, string>;
export type Sprite = { rows: string[]; palette: Palette };

/** A small drawing board: set pixels, rectangles and discs, then read the rows back. */
export function board(w: number, h: number) {
  const g = Array.from({ length: h }, () => Array<string>(w).fill(" "));
  const rect = (x: number, y: number, rw: number, rh: number, c: string) => {
    for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) if (g[j] && i >= 0 && i < w) g[j]![i] = c;
  };
  const put = (x: number, y: number, c: string) => rect(x, y, 1, 1, c);
  const disc = (cx: number, cy: number, r: number, c: string) => {
    for (let dy = -r; dy <= r; dy++) {
      const half = Math.round(Math.sqrt(r * r - dy * dy + 0.4));
      rect(cx - half, cy + dy, half * 2 + 1, 1, c);
    }
  };
  return { rect, put, disc, rows: () => g.map((r) => r.join("")) };
}

/** Path data per colour for a sprite, for drawing it inside a larger SVG. */
export function spritePaths(rows: string[], palette: Palette): { fill: string; d: string }[] {
  const byColor = new Map<string, string[]>();
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x]!;
      if (ch === " " || !palette[ch]) {
        x++;
        continue;
      }
      let end = x;
      while (end < row.length && row[end] === ch) end++;
      const list = byColor.get(ch) ?? [];
      list.push(`M${x} ${y}h${end - x}v1h${x - end}z`);
      byColor.set(ch, list);
      x = end;
    }
  });
  return [...byColor].map(([ch, d]) => ({ fill: palette[ch]!, d: d.join("") }));
}

/* ---------- Motorcycles (side view, facing right) ---------- */
type BikeKind = "sport" | "cafe" | "scrambler";
const bikeBase: Palette = { t: "#0d0b1d", m: "#b4bad8", w: "#ffcf5c", s: "#0b0a16", e: "#59608a", x: "#d5daf5", l: "#fff1b0", k: "#1b1838", g: "#9fc3ff" };
export function bike(kind: BikeKind, body: string, shade: string, shine: string): Sprite {
  const b = board(28, 15);
  // Wheels first (tyre, rim, hub); the body is drawn over them.
  for (const cx of [5, 22]) { b.disc(cx, 10, 4, "t"); b.disc(cx, 10, 2, "m"); b.put(cx, 10, "w"); }
  // Engine and frame shared by every bike
  b.rect(10, 6, 8, 4, "e"); b.rect(10, 6, 8, 1, "k"); b.rect(12, 8, 4, 1, "k");
  b.rect(5, 9, 6, 1, "D"); // swingarm
  if (kind === "sport") {
    b.rect(1, 4, 7, 3, "B"); b.rect(0, 4, 2, 2, "D"); b.rect(2, 4, 6, 1, "H"); // tail hump
    b.rect(7, 4, 4, 1, "s"); // seat
    b.rect(10, 2, 7, 4, "B"); b.rect(11, 2, 4, 1, "H"); b.rect(10, 5, 7, 1, "D"); // tank
    b.rect(17, 4, 6, 5, "B"); b.rect(21, 3, 3, 6, "B"); b.rect(23, 6, 2, 3, "D"); // fairing
    b.rect(18, 1, 4, 3, "g"); b.rect(17, 3, 2, 1, "g"); // screen
    b.rect(23, 8, 1, 3, "m"); b.put(25, 5, "l"); // fork, light
    b.rect(0, 10, 7, 1, "x"); b.rect(0, 9, 2, 1, "x"); // exhaust
  } else if (kind === "cafe") {
    b.rect(1, 3, 4, 3, "B"); b.rect(1, 3, 4, 1, "H"); // cowl
    b.rect(4, 4, 8, 1, "s"); // flat seat
    b.rect(10, 2, 8, 4, "B"); b.rect(12, 2, 4, 1, "H"); b.rect(10, 5, 8, 1, "D"); // round tank
    b.rect(18, 2, 4, 1, "m"); b.rect(18, 2, 1, 4, "m"); // clip-on bars
    b.rect(22, 4, 3, 3, "m"); b.rect(23, 5, 2, 2, "l"); b.rect(22, 8, 1, 3, "m"); // round headlight, fork
    b.rect(0, 9, 5, 1, "x"); b.rect(0, 8, 2, 1, "x"); // upswept pipe
  } else {
    b.rect(1, 3, 3, 3, "B"); b.rect(1, 3, 3, 1, "H"); // high tail
    b.rect(3, 4, 9, 1, "s"); // long seat
    b.rect(11, 2, 6, 4, "B"); b.rect(12, 2, 3, 1, "H"); b.rect(11, 5, 6, 1, "D"); // tank
    b.rect(18, 1, 1, 4, "m"); b.rect(17, 1, 4, 1, "m"); // tall bars
    b.rect(21, 4, 2, 2, "l"); b.rect(22, 6, 1, 5, "m"); b.rect(19, 3, 5, 1, "D"); // headlight, fender
    b.rect(0, 10, 6, 1, "x"); b.rect(16, 9, 4, 1, "x"); // pipes
  }
  return { rows: b.rows(), palette: { ...bikeBase, B: body, D: shade, H: shine } };
}

/* ---------- Chess pieces (cream) ---------- */
const chessPalette: Palette = { w: "#efe6d2", s: "#b5aa90", k: "#0d0b1d", g: "#ffcf5c" };
export const chessKnight: Sprite = (() => {
  const b = board(9, 13);
  b.rect(1, 11, 7, 2, "w"); b.rect(2, 8, 5, 3, "w"); b.rect(2, 3, 4, 5, "w"); b.rect(1, 4, 2, 3, "w");
  b.put(4, 2, "w"); b.put(5, 2, "w"); b.put(5, 1, "w"); b.rect(6, 3, 1, 5, "s"); b.put(2, 4, "k");
  b.rect(1, 12, 7, 1, "s"); b.rect(2, 10, 5, 1, "s");
  return { rows: b.rows(), palette: chessPalette };
})();
export const chessRook: Sprite = (() => {
  const b = board(9, 12);
  b.rect(1, 10, 7, 2, "w"); b.rect(2, 4, 5, 6, "w"); b.rect(1, 3, 7, 1, "w");
  b.rect(1, 0, 2, 3, "w"); b.rect(4, 0, 1, 3, "w"); b.rect(6, 0, 2, 3, "w");
  b.rect(6, 4, 1, 6, "s"); b.rect(1, 11, 7, 1, "s");
  return { rows: b.rows(), palette: chessPalette };
})();
export const chessKing: Sprite = (() => {
  const b = board(9, 15);
  b.rect(1, 13, 7, 2, "w"); b.rect(2, 7, 5, 6, "w"); b.rect(1, 6, 7, 1, "w"); b.rect(3, 3, 3, 3, "w");
  b.put(4, 0, "g"); b.rect(3, 1, 3, 1, "g"); b.put(4, 2, "g");
  b.rect(6, 7, 1, 6, "s"); b.rect(1, 14, 7, 1, "s");
  return { rows: b.rows(), palette: chessPalette };
})();

/* ---------- Racket sports ---------- */
export const badmintonRacket: Sprite = (() => {
  const b = board(11, 31);
  for (let y = 0; y < 15; y++) {
    const half = Math.round(5 * Math.sqrt(Math.max(0, 1 - ((y - 7) / 7.6) ** 2)));
    if (half < 1) continue;
    b.rect(5 - half, y, half * 2 + 1, 1, "f");
    if (half > 1) for (let x = 6 - half; x < 5 + half; x++) if ((x + y) % 2 === 0) b.put(x, y, "s");
    if (half > 1) for (let x = 6 - half; x < 5 + half; x++) if ((x + y) % 2 === 1) b.put(x, y, "n");
  }
  b.rect(4, 15, 3, 3, "f"); b.rect(5, 18, 1, 5, "m"); b.rect(4, 22, 3, 8, "g");
  for (let y = 23; y < 30; y += 2) b.rect(4, y, 3, 1, "G");
  return { rows: b.rows(), palette: { f: "#ff5e7a", s: "#f4eee0", n: "#7a6f9a", m: "#c8cde8", g: "#2a2750", G: "#8f7cff" } };
})();
export const tableTennisPaddle: Sprite = (() => {
  const b = board(12, 17);
  b.disc(5, 5, 5, "R"); b.disc(5, 5, 4, "r"); b.rect(2, 2, 3, 2, "h");
  b.rect(4, 10, 3, 6, "w"); b.rect(4, 15, 3, 1, "d");
  return { rows: b.rows(), palette: { R: "#7a1230", r: "#d6304f", h: "#ff8aa0", w: "#c58a55", d: "#8a5a3c" } };
})();
export const pickleballPaddle: Sprite = (() => {
  const b = board(11, 19);
  b.rect(1, 0, 9, 11, "p"); b.rect(0, 1, 11, 9, "p"); b.rect(1, 0, 9, 1, "P"); b.rect(1, 10, 9, 1, "P");
  for (let y = 2; y < 9; y += 2) for (let x = 2; x < 9; x += 2) b.put(x, y, "k");
  b.rect(4, 11, 3, 3, "P"); b.rect(4, 14, 3, 5, "g"); b.rect(4, 15, 3, 1, "G"); b.rect(4, 17, 3, 1, "G");
  return { rows: b.rows(), palette: { p: "#3a86ff", P: "#1f4fbf", k: "#0d0b1d", g: "#2a2750", G: "#6b6fa0" } };
})();

/* ---------- A PC tower with RGB fans ---------- */
export const pcTower: Sprite = (() => {
  const b = board(16, 22);
  b.rect(1, 0, 14, 22, "k"); b.rect(2, 1, 12, 20, "g");
  b.disc(8, 5, 3, "a"); b.disc(8, 5, 1, "k"); b.disc(8, 11, 3, "b"); b.disc(8, 11, 1, "k");
  b.rect(3, 16, 10, 2, "m"); b.rect(3, 16, 10, 1, "c"); b.rect(3, 19, 10, 1, "e");
  b.rect(1, 21, 2, 1, "m"); b.rect(13, 21, 2, 1, "m");
  return { rows: b.rows(), palette: { k: "#0b0a18", g: "#17143a", a: "#6fe3b4", b: "#8f7cff", m: "#38336a", c: "#ff9a52", e: "#6fe3b4" } };
})();

/* ---------- Desk props ---------- */
export const mug: Sprite = (() => {
  const b = board(9, 9);
  b.rect(1, 2, 6, 6, "m"); b.rect(1, 2, 6, 1, "c"); b.rect(7, 3, 2, 3, "m"); b.put(8, 4, " "); b.rect(2, 7, 4, 1, "d");
  b.put(2, 0, "s"); b.put(4, 0, "s"); b.put(3, 1, "s");
  return { rows: b.rows(), palette: { m: "#f4eee0", c: "#6b4a35", d: "#b5aa90", s: "#8f93b8" } };
})();
export const headphones: Sprite = (() => {
  const b = board(14, 16);
  b.rect(3, 0, 8, 1, "h"); b.rect(2, 1, 2, 1, "h"); b.rect(10, 1, 2, 1, "h"); b.rect(1, 2, 2, 5, "h"); b.rect(11, 2, 2, 5, "h");
  b.rect(0, 5, 3, 6, "c"); b.rect(11, 5, 3, 6, "c"); b.rect(0, 6, 1, 4, "a"); b.rect(13, 6, 1, 4, "a");
  b.rect(6, 7, 2, 7, "s"); b.rect(3, 14, 8, 2, "s");
  return { rows: b.rows(), palette: { h: "#2a2750", c: "#38336a", a: "#6fe3b4", s: "#1b1838" } };
})();
export const plant: Sprite = (() => {
  const b = board(11, 14);
  b.rect(3, 9, 5, 5, "p"); b.rect(3, 9, 5, 1, "P"); b.rect(5, 4, 1, 5, "s");
  b.rect(1, 2, 3, 2, "l"); b.rect(7, 1, 3, 2, "l"); b.rect(2, 5, 3, 2, "L"); b.rect(6, 4, 3, 2, "L"); b.rect(4, 0, 3, 3, "l");
  return { rows: b.rows(), palette: { p: "#b4552e", P: "#8f3f20", s: "#2f8f58", l: "#4fd68f", L: "#2fa06a" } };
})();


/** A ginger cat curled up asleep (24 x 12), with a stripe pattern and a tail wrapped round. */
export const sleepingCat: Sprite = (() => {
  const b = board(24, 12);
  // Body: a loaf, wider at the bottom
  b.rect(3, 4, 17, 7, "o");
  b.rect(2, 6, 19, 5, "o");
  b.rect(5, 3, 12, 1, "o");
  b.rect(3, 4, 17, 1, "h"); // top light
  b.rect(5, 3, 12, 1, "h");
  b.rect(2, 10, 19, 1, "d"); // belly shade
  b.rect(3, 11, 17, 1, "d");
  // Tabby stripes
  for (const x of [7, 10, 13, 16]) { b.rect(x, 4, 1, 3, "s"); }
  // Head tucked in at the left, with ears
  b.rect(1, 5, 8, 6, "o");
  b.rect(0, 7, 2, 3, "o");
  b.rect(1, 5, 8, 1, "h");
  b.put(1, 3, "o"); b.put(2, 4, "o"); b.put(1, 4, "o"); b.put(2, 3, "h");
  b.put(7, 3, "o"); b.put(6, 4, "o"); b.put(7, 4, "o"); b.put(6, 3, "h");
  b.put(2, 4, "p"); b.put(7, 4, "p");
  // Closed eyes, nose, a cheek
  b.rect(2, 8, 2, 1, "k"); b.rect(6, 8, 2, 1, "k");
  b.put(4, 9, "n"); b.put(5, 9, "n");
  b.rect(1, 10, 8, 1, "d");
  // Tail wrapped round the front
  b.rect(10, 10, 12, 2, "o"); b.rect(10, 10, 12, 1, "h");
  b.rect(21, 8, 2, 4, "o"); b.rect(22, 7, 1, 2, "w"); b.rect(21, 11, 2, 1, "d");
  b.rect(12, 10, 1, 2, "s"); b.rect(15, 10, 1, 2, "s"); b.rect(18, 10, 1, 2, "s");
  // Paws peeking out
  b.rect(8, 11, 3, 1, "w");
  return { rows: b.rows(), palette: { o: "#f08a3c", h: "#ffb36b", d: "#b9531d", s: "#c9621f", p: "#ff9fb0", k: "#1a0f12", n: "#ff9fb0", w: "#fff1dd" } };
})();
