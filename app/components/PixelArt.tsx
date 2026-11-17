import { useMemo } from "react";
import { board, spritePaths, type Palette } from "../lib/sprites.ts";

/*
 * Pixel art from tiny character maps, drawn as crisp SVG. Each letter is a
 * colour, a space is empty. Runs of the same colour are merged into one path
 * so sprites stay light. The sprites themselves live in lib/sprites.ts.
 */
export function PixelArt({
  rows,
  palette,
  className,
  label,
}: {
  rows: string[];
  palette: Palette;
  className?: string;
  /** Alt text. Leave out for purely decorative art. */
  label?: string;
}) {
  const w = Math.max(...rows.map((r) => r.length));
  const paths = useMemo(() => spritePaths(rows, palette), [rows, palette]);
  const all = useMemo(() => paths.map((p) => p.d).join(""), [paths]);
  return (
    <svg
      className={className}
      overflow="visible"
      viewBox={`0 0 ${w} ${rows.length}`}
      shapeRendering="crispEdges"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* Depth: the same shape pushed down and right as a dark side, plus a rim of light on the upper left. */}
      <path d={all} fill="#05030f" opacity="0.5" transform="translate(0.7 0.7)" />
      <path d={all} fill="#fff" opacity="0.2" transform="translate(-0.25 -0.25)" />
      {paths.map((p) => (
        <path key={p.fill + p.d.length} fill={p.fill} d={p.d} />
      ))}
    </svg>
  );
}

/* ---------- Treasure chest: closed and open ---------- */
export const chestPalette: Palette = {
  W: "#8a5a3c", L: "#a8714b", D: "#5e3b27", I: "#6b6f8f", G: "#ffcf5c", Y: "#fff1b0", O: "#ff9a52",
};
function chest(open: boolean) {
  const b = board(18, 15);
  if (open) {
    b.rect(2, 0, 14, 3, "L"); b.rect(2, 0, 14, 1, "W"); b.rect(2, 2, 14, 1, "D");
    b.rect(2, 3, 14, 4, "Y"); b.rect(4, 4, 10, 2, "G");
    b.put(5, 3, "O"); b.put(9, 4, "O"); b.put(12, 3, "O");
  } else {
    b.rect(1, 3, 16, 4, "L"); b.rect(2, 2, 14, 1, "L"); b.rect(1, 3, 16, 1, "W");
    b.rect(1, 6, 16, 1, "D");
  }
  b.rect(1, 7, 16, 7, "W"); b.rect(1, 13, 16, 1, "D");
  b.rect(1, 7, 16, 1, "I");
  b.rect(3, open ? 0 : 2, 1, open ? 14 : 12, "I"); b.rect(14, open ? 0 : 2, 1, open ? 14 : 12, "I");
  b.rect(8, 7, 2, 3, "G"); b.put(8, 8, "D"); b.put(9, 8, "D");
  return b.rows();
}
export const chestClosedRows = chest(false);
export const chestOpenRows = chest(true);

/* ---------- Campfire: two flame frames for the save point ---------- */
export const firePalette: Palette = {
  b: "#6a4a35", d: "#4a3024", o: "#ff9a52", r: "#ff5e3a", y: "#ffcf5c", w: "#fff1b0", k: "#9a9ab8",
};
function fire(frame: 0 | 1) {
  const b = board(16, 16);
  b.rect(2, 13, 12, 2, "b"); b.rect(1, 12, 5, 2, "d"); b.rect(10, 12, 5, 2, "d");
  if (frame === 0) {
    b.rect(5, 8, 6, 5, "r"); b.rect(6, 5, 4, 4, "o"); b.rect(7, 3, 2, 3, "o"); b.rect(6, 9, 4, 4, "o"); b.rect(7, 10, 2, 3, "y"); b.put(8, 11, "w");
    b.put(4, 6, "y"); b.put(12, 4, "y");
  } else {
    b.rect(5, 8, 6, 5, "r"); b.rect(5, 6, 5, 3, "o"); b.rect(8, 3, 2, 4, "o"); b.rect(6, 9, 4, 4, "o"); b.rect(7, 10, 2, 3, "y"); b.put(8, 11, "w");
    b.put(11, 6, "y"); b.put(3, 4, "y");
  }
  b.put(2, 2, "k"); b.put(13, 1, "k");
  return b.rows();
}
export const fireRows = [fire(0), fire(1)] as const;
