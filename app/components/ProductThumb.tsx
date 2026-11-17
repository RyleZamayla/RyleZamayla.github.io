import type { CSSProperties } from "react";
import type { Project } from "../content/types.ts";
import { getSnapshots, getThumb, isScreenshot, type Snapshot, type ThumbSpec } from "../content/snapshots.ts";
import { Mockup } from "./Mockup";

/* Where each device sits on the 560 x 350 tile. Natural widths: windows 560, phones 250. */
type Place = { left: number; top: number; scale: number; dim?: boolean };
const places: Record<ThumbSpec["layout"], { main: Place; second?: Place; secondBehind: boolean }> = {
  window: { main: { left: 232, top: 44, scale: 0.6 }, secondBehind: true },
  phone: { main: { left: 356, top: 46, scale: 0.74 }, second: { left: 244, top: 92, scale: 0.68, dim: true }, secondBehind: true },
  duo: { main: { left: 236, top: 112, scale: 0.6 }, second: { left: 420, top: 34, scale: 0.72 }, secondBehind: false },
  stack: { main: { left: 226, top: 94, scale: 0.6 }, second: { left: 262, top: 30, scale: 0.55, dim: true }, secondBehind: true },
};

function isPhone(s: Snapshot): boolean {
  // Our phone screenshots are 600px wide; web and desktop screenshots are far wider, even when tall.
  return s.frame === "phone" || (isScreenshot(s) && !!s.image && s.image.width <= 800 && s.image.height > s.image.width);
}

function Device({ snap, place, chrome }: { snap: Snapshot; place: Place; chrome?: boolean }) {
  const phone = isPhone(snap);
  const style = { left: place.left, top: place.top, "--k": place.scale, width: phone ? 250 : 560 } as CSSProperties;
  const cls = `pt__dev ${phone ? "pt__dev--phone" : "pt__dev--window"}${place.dim ? " is-dim" : ""}`;
  if (isScreenshot(snap) && snap.image) {
    return (
      <div className={cls} style={style}>
        {phone ? (
          <div className="pt__bezel">
            <img src={snap.image.src} width={snap.image.width} height={snap.image.height} alt="" loading="lazy" decoding="async" />
          </div>
        ) : (
          <div className="pt__win">
            {chrome && (
              <div className="pt__bar">
                <i />
                <i />
                <i />
              </div>
            )}
            <img src={snap.image.src} width={snap.image.width} height={snap.image.height} alt="" loading="lazy" decoding="async" />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={`${cls} pt__dev--ill`} style={style}>
      <Mockup snapshot={snap} size="thumb" />
    </div>
  );
}

/** A product-style tile for project lists. Decorative: the project's title and summary sit beside it. */
export function ProductThumb({ project }: { project: Project }) {
  const spec = getThumb(project.slug);
  const shots = getSnapshots(project.slug);
  if (!spec) return null;
  const main = shots.find((s) => s.id === spec.main);
  const second = spec.second ? shots.find((s) => s.id === spec.second) : undefined;
  if (!main) return null;
  const at = places[spec.layout];
  const mainEl = <Device key="main" snap={main} place={at.main} chrome={spec.chrome} />;
  const secondEl = second && at.second ? <Device key="second" snap={second} place={at.second} chrome={spec.chrome} /> : null;
  return (
    <div className="pt" aria-hidden="true" style={{ "--a": spec.accent, "--a2": spec.accent2 } as CSSProperties}>
      <div className="pt__canvas">
        <div className="pt__brand">
          <span className="pt__mark">{spec.mark}</span>
          <span className="pt__name">{spec.name}</span>
          <span className="pt__headline">{spec.headline}</span>
          <span className="pt__platform">{spec.platform}</span>
        </div>
        {at.secondBehind ? [secondEl, mainEl] : [mainEl, secondEl]}
      </div>
    </div>
  );
}
