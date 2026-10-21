import type { Project } from "../content/types.ts";
import { getSnapshots, isScreenshot } from "../content/snapshots.ts";
import { useReveal } from "../hooks/useReveal.ts";
import { Mockup } from "./Mockup";

/** Small preview of a project's first snapshot, for project lists. Decorative. */
export function SnapshotThumb({ slug }: { slug: string }) {
  const first = getSnapshots(slug)[0];
  if (!first) return null;
  return (
    <div className={`thumb thumb--${first.frame}`}>
      <div className="thumb__inner">
        <Mockup snapshot={first} size="thumb" />
      </div>
    </div>
  );
}

/** Case-study gallery: every snapshot full-size, each captioned as an illustration. */
export function SnapshotGallery({ project }: { project: Project }) {
  const shots = getSnapshots(project.slug);
  const { ref, revealClass } = useReveal<HTMLUListElement>();
  if (shots.length === 0) return null;
  return (
    <>
      <p className="muted">
        {shots.every(isScreenshot)
          ? "Real screenshots of the app running on demo data. All names and figures are invented."
          : shots.some(isScreenshot)
            ? "Real screenshots run on demo data, plus illustrations where real screens can't be shown."
            : "Illustrations, not screenshots. All names and numbers are invented."}
      </p>
      <ul ref={ref} className={`gallery stagger ${revealClass}`}>
        {shots.map((s, i) => (
          <li key={s.id} style={{ "--i": i } as React.CSSProperties}>
            <figure className={`shot shot--${s.frame}`}>
              <Mockup snapshot={s} />
              <figcaption>
                {isScreenshot(s) ? (
                  <span className="shot__tag shot__tag--real">Screenshot · demo data</span>
                ) : (
                  <span className="shot__tag">Illustration</span>
                )}{" "}
                {s.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}
