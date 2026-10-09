import { useState } from "react";
import { CatSprite, Heart } from "./Cat";
import { Link } from "react-router";
import { projects } from "../content/projects.ts";
import type { Project } from "../content/types.ts";

/*
 * A 192 x 112 pixel scene drawn with plain rectangles, so it stays crisp at any
 * size. Each object on the desk is a link to the project it represents.
 */

const C = {
  wall: "#2a2645",
  trim: "#322d52",
  edge: "#514a7a",
  edgeHi: "#6a6296",
  sky: "#1e1b33",
  paper: "#efe6d2",
  paperDim: "#c9bfa8",
  mint: "#6fd3a6",
  ember: "#ff9e5e",
  screen: "#16302a",
  woodTop: "#8a5a3c",
  wood: "#5e3b27",
  woodDark: "#4a2e1f",
  floor: "#191629",
  floorLine: "#24203b",
};

type Spot = Project["sceneSpot"];

/** Bounding box of each object, used for the focus outline and label position. */
const boxes: Record<Spot, { x: number; y: number; w: number; h: number; name: string }> = {
  board: { x: 117, y: 7, w: 58, h: 34, name: "Planning board" },
  monitor: { x: 71, y: 29, w: 52, h: 45, name: "Monitor" },
  laptop: { x: 25, y: 55, w: 32, h: 19, name: "Laptop" },
  notebook: { x: 6, y: 64, w: 18, h: 10, name: "Notebook" },
  phone: { x: 125, y: 60, w: 11, h: 14, name: "Phone" },
  tablet: { x: 137, y: 62, w: 19, h: 12, name: "Tablet" },
  rack: { x: 161, y: 43, w: 28, h: 58, name: "Server rack" },
};

function R(props: { x: number; y: number; w: number; h: number; f: string; className?: string }) {
  return <rect x={props.x} y={props.y} width={props.w} height={props.h} fill={props.f} className={props.className} />;
}

function Room() {
  const stars: [number, number][] = [
    [14, 12], [22, 17], [30, 11], [17, 26], [27, 30], [45, 28], [36, 21], [48, 33],
  ];
  return (
    <g aria-hidden="true">
      <R x={0} y={0} w={192} h={100} f={C.wall} />
      <R x={0} y={96} w={192} h={4} f={C.trim} />
      <R x={0} y={100} w={192} h={12} f={C.floor} />
      {[8, 40, 72, 104, 136, 168].map((x) => (
        <R key={x} x={x} y={104} w={16} h={1} f={C.floorLine} />
      ))}
      {/* window */}
      <R x={10} y={8} w={42} h={30} f={C.edge} />
      <R x={12} y={10} w={38} h={26} f={C.sky} />
      <R x={30} y={10} w={2} h={26} f={C.edge} />
      <R x={12} y={22} w={38} h={2} f={C.edge} />
      {stars.map(([x, y], i) => (
        <R key={`${x}-${y}`} x={x} y={y} w={1} h={1} f={C.paper} className={`star star--${i % 3}`} />
      ))}
      <clipPath id="window-sky">
        <rect x={12} y={10} width={38} height={26} />
      </clipPath>
      <g clipPath="url(#window-sky)">
        <g className="shooting-star">
          <R x={14} y={12} w={1} h={1} f={C.paperDim} />
          <R x={15} y={13} w={1} h={1} f={C.paperDim} />
          <R x={16} y={14} w={2} h={1} f={C.paper} />
        </g>
      </g>
      <R x={40} y={12} w={4} h={6} f={C.paper} />
      <R x={39} y={13} w={6} h={4} f={C.paper} />
      <R x={42} y={13} w={2} h={3} f={C.paperDim} />
      {/* desk */}
      <R x={0} y={73} w={158} h={4} f={C.woodTop} />
      <R x={0} y={77} w={158} h={5} f={C.wood} />
      <R x={4} y={82} w={4} h={18} f={C.woodDark} />
      <R x={150} y={82} w={4} h={18} f={C.woodDark} />
      {/* coffee */}
      <R x={109} y={67} w={6} h={6} f={C.paperDim} />
      <R x={109} y={69} w={6} h={1} f={C.mint} />
      <R x={115} y={68} w={2} h={1} f={C.paperDim} />
      <R x={116} y={69} w={1} h={2} f={C.paperDim} />
      <R x={115} y={70} w={2} h={1} f={C.paperDim} />
      {[0, 1, 2].map((i) => (
        <R key={i} x={110 + i * 2} y={64 - i} w={1} h={2} f={C.edgeHi} className={`steam steam--${i}`} />
      ))}
    </g>
  );
}

function Monitor() {
  const lines = [30, 22, 34, 18, 27];
  return (
    <g>
      <R x={72} y={30} w={50} h={34} f={C.edge} />
      <R x={72} y={30} w={50} h={1} f={C.edgeHi} />
      <R x={75} y={33} w={44} h={27} f={C.screen} />
      <R x={77} y={35} w={14} h={2} f={C.mint} />
      <R x={113} y={35} w={4} h={2} f={C.ember} />
      {lines.map((w, i) => (
        <g key={i}>
          <R x={77} y={39 + i * 4} w={5} h={2} f={C.ember} />
          <R x={84} y={39 + i * 4} w={w} h={2} f={C.mint} className={`type-line type-line--${i}`} />
        </g>
      ))}
      <R x={94} y={64} w={6} h={6} f={C.edge} />
      <R x={88} y={70} w={18} h={3} f={C.edgeHi} />
    </g>
  );
}

function Laptop() {
  return (
    <g>
      <R x={30} y={56} w={22} h={14} f={C.edge} />
      <R x={32} y={58} w={18} h={10} f={C.trim} />
      {[59, 62, 65].map((y) => (
        <g key={y}>
          <R x={33} y={y} w={7} h={1} f={C.paperDim} />
          <R x={42} y={y} w={6} h={1} f={y === 62 ? C.mint : C.paperDim} />
        </g>
      ))}
      <R x={26} y={70} w={30} h={3} f={C.edgeHi} />
    </g>
  );
}

function Notebook() {
  return (
    <g>
      <R x={8} y={66} w={14} h={7} f={C.ember} />
      <R x={8} y={72} w={14} h={1} f={C.paperDim} />
      <R x={10} y={66} w={1} h={7} f={C.wood} />
      <R x={14} y={68} w={6} h={1} f={C.paper} />
      <R x={14} y={70} w={4} h={1} f={C.paper} />
    </g>
  );
}

function Phone() {
  const qr: [number, number][] = [[128, 64], [130, 64], [132, 65], [129, 66], [131, 67], [128, 68], [132, 68], [130, 69]];
  return (
    <g>
      <R x={126} y={61} w={9} h={12} f={C.edge} />
      <R x={127} y={63} w={7} h={8} f={C.screen} />
      {qr.map(([x, y]) => (
        <R key={`${x}-${y}`} x={x} y={y} w={1} h={1} f={C.paper} />
      ))}
      <R x={124} y={72} w={13} h={1} f={C.woodDark} />
      <R x={127} y={63} w={7} h={8} f={C.mint} className="ping-flash" />
      <g className="ping-bubble">
        <R x={128} y={52} w={5} h={7} f={C.paper} />
        <R x={130} y={53} w={1} h={3} f={C.ember} />
        <R x={130} y={57} w={1} h={1} f={C.ember} />
        <R x={129} y={59} w={2} h={1} f={C.paper} />
      </g>
    </g>
  );
}

function Tablet() {
  return (
    <g>
      <R x={138} y={63} w={17} h={10} f={C.edge} />
      <R x={139} y={64} w={15} h={8} f={C.trim} />
      {[65, 68].map((y, i) => (
        <g key={y}>
          <R x={140} y={y} w={2} h={2} f={i === 0 ? C.mint : C.ember} className={i === 0 ? "pulse" : undefined} />
          <R x={143} y={y} w={10} h={1} f={C.paperDim} />
        </g>
      ))}
    </g>
  );
}

function Board() {
  const cells: string[] = [C.mint, C.edge, C.ember, C.mint, C.edge, C.mint, C.edge, C.mint, C.mint, C.ember, C.edge, C.edge, C.mint, C.edge, C.edge, C.mint, C.ember, C.mint];
  return (
    <g>
      <R x={118} y={8} w={56} h={32} f={C.edge} />
      <R x={120} y={10} w={52} h={28} f={C.paperDim} />
      {cells.map((f, i) => (
        <R key={i} x={122 + (i % 6) * 8} y={12 + Math.floor(i / 6) * 8} w={6} h={6} f={f} className={i === 7 ? "bay bay--a" : i === 10 ? "bay bay--b" : undefined} />
      ))}
      <R x={140} y={40} w={14} h={1} f={C.edge} />
    </g>
  );
}

function Rack() {
  return (
    <g>
      <R x={162} y={44} w={26} h={56} f={C.edge} />
      <R x={164} y={46} w={22} h={52} f={C.trim} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <R x={165} y={48 + i * 10} w={20} h={7} f={C.sky} />
          <R x={167} y={50 + i * 10} w={10} h={1} f={C.edgeHi} />
          <R x={167} y={52 + i * 10} w={10} h={1} f={C.edgeHi} />
          <R x={180} y={50 + i * 10} w={2} h={2} f={C.mint} className={`led led--${i}`} />
          <R x={183} y={50 + i * 10} w={1} h={2} f={i === 2 ? C.ember : C.mint} />
        </g>
      ))}
    </g>
  );
}

const art: Record<Spot, () => React.ReactElement> = {
  board: Board,
  monitor: Monitor,
  laptop: Laptop,
  notebook: Notebook,
  phone: Phone,
  tablet: Tablet,
  rack: Rack,
};

export function HubScene() {
  const [active, setActive] = useState<Project | null>(null);
  const [pets, setPets] = useState(0);
  const [catNote, setCatNote] = useState<string | null>(null);

  function petCat() {
    const n = pets + 1;
    setPets(n);
    setActive(null);
    setCatNote(n === 1 ? "The cat purrs. It approves of your visit." : `The cat purrs. Petted ${n} times so far.`);
  }

  const label = active ? boxes[active.sceneSpot] : null;
  const labelText = active?.title ?? "";
  const labelW = Math.min(150, labelText.length * 2.6 + 8);
  const labelX = label ? Math.max(2, Math.min(190 - labelW, label.x + label.w / 2 - labelW / 2)) : 0;
  const labelY = label ? (label.y > 14 ? label.y - 12 : label.y + label.h + 2) : 0;

  return (
    <figure className="scene">
      <svg
        viewBox="0 0 192 112"
        className="scene__svg"
        shapeRendering="crispEdges"
        role="group"
        aria-label="My desk at night. Each object links to a project."
      >
        <Room />
        {projects.map((p) => {
          const Art = art[p.sceneSpot];
          const b = boxes[p.sceneSpot];
          return (
            <Link
              key={p.slug}
              to={`/projects/${p.slug}`}
              className="hotspot"
              aria-label={`${b.name}: ${p.title}, ${p.kind} project`}
              viewTransition
              onMouseEnter={() => {
                setActive(p);
                setCatNote(null);
              }}
              onMouseLeave={() => setActive((cur) => (cur === p ? null : cur))}
              onFocus={() => {
                setActive(p);
                setCatNote(null);
              }}
              onBlur={() => setActive((cur) => (cur === p ? null : cur))}
            >
              <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="transparent" />
              <Art />
              <rect
                className="hotspot__outline"
                x={b.x - 0.5}
                y={b.y - 0.5}
                width={b.w + 1}
                height={b.h + 1}
                fill="none"
                strokeWidth={1}
              />
            </Link>
          );
        })}
        <g
          className="cat-button"
          role="button"
          tabIndex={0}
          aria-label="Pet the cat"
          onClick={petCat}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              petCat();
            }
          }}
        >
          <rect x={56} y={60} width={14} height={13} fill="transparent" />
          <CatSprite x={57} y={62} />
          <rect className="hotspot__outline" x={55.5} y={59.5} width={15} height={14} fill="none" strokeWidth={1} />
        </g>
        {pets > 0 && <Heart key={pets} x={61} y={55} />}
        {label && (
          <g aria-hidden="true" className="scene__label">
            <rect x={labelX} y={labelY} width={labelW} height={10} fill={C.sky} stroke={C.mint} strokeWidth={1} />
            <text x={labelX + labelW / 2} y={labelY + 7.3} textAnchor="middle" fontSize={6.4} fill={C.paper}>
              {labelText}
            </text>
          </g>
        )}
      </svg>
      <figcaption className="scene__caption" aria-live="polite">
        {catNote ? (
          catNote
        ) : active ? (
          <>
            <strong>{boxes[active.sceneSpot].name}:</strong> {active.title}. {active.tagline}
          </>
        ) : (
          "Pick anything on the desk to open its project, or use the list below."
        )}
      </figcaption>
    </figure>
  );
}
