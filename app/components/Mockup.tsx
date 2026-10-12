import type { Block, Snapshot } from "../content/snapshots.ts";

/*
 * Draws an illustrated snapshot. The whole drawing is exposed to assistive tech
 * as a single image with the caption as its description, so screen readers
 * don't read invented demo data out as if it were real content.
 */
export function Mockup({ snapshot, size = "full" }: { snapshot: Snapshot; size?: "full" | "thumb" }) {
  const { frame, title, blocks } = snapshot;
  return (
    <div
      className={`mock mock--${frame} mock--${size}`}
      role={size === "full" ? "img" : undefined}
      aria-label={size === "full" ? `Illustration: ${snapshot.caption}` : undefined}
      aria-hidden={size === "thumb" ? true : undefined}
    >
      <div className="mock__chrome" aria-hidden="true">
        {frame === "browser" && (
          <>
            <span className="mock__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="mock__url">{title}</span>
          </>
        )}
        {frame === "terminal" && (
          <>
            <span className="mock__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="mock__term-title">{title}</span>
          </>
        )}
        {frame === "phone" && (
          <>
            <span className="mock__notch" />
            <span className="mock__appbar">{title}</span>
          </>
        )}
      </div>
      <div className="mock__body" aria-hidden="true">
        {blocks.map((b, i) => (
          <MockBlock key={i} block={b} />
        ))}
      </div>
    </div>
  );
}

function MockBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "tabs":
      return (
        <div className="mb-tabs">
          {block.items.map((t, i) => (
            <span key={t} className={i === block.active ? "is-active" : undefined}>
              {t}
            </span>
          ))}
        </div>
      );
    case "heading":
      return (
        <div className="mb-heading">
          <strong>{block.text}</strong>
          {block.meta && <span>{block.meta}</span>}
        </div>
      );
    case "stats":
      return (
        <div className="mb-stats">
          {block.items.map((s) => (
            <div key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      );
    case "rows":
      return (
        <ul className="mb-rows">
          {block.rows.map((r) => (
            <li key={r.label}>
              {r.check !== undefined && <span className={`mb-check${r.check ? " is-on" : ""}`} />}
              <span className="mb-rows__text">
                <span>{r.label}</span>
                {r.meta && <small>{r.meta}</small>}
              </span>
              {r.chip && <span className={`mb-chip tone-${r.chip.tone}`}>{r.chip.text}</span>}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <table className="mb-table">
          <thead>
            <tr>
              {block.head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className={i === block.highlight ? "is-hi" : undefined}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "banner":
      return <p className={`mb-banner tone-${block.tone}`}>{block.text}</p>;
    case "code":
      return (
        <pre className="mb-code">
          {block.lines.map((l, i) => (
            <span key={i} className={l.startsWith("$ ") ? "is-cmd" : l.startsWith("✓") ? "is-ok" : undefined}>
              {l}
              {"\n"}
            </span>
          ))}
        </pre>
      );
    case "grid":
      return (
        <div>
          <div className="mb-grid" style={{ gridTemplateColumns: `repeat(${block.cols}, 1fr)` }}>
            {block.cells.map((t, i) => (
              <span key={i} className={`tone-bg-${t}`} />
            ))}
          </div>
          {block.legend && (
            <div className="mb-legend">
              {block.legend.map((l) => (
                <span key={l.text}>
                  <i className={`tone-bg-${l.tone}`} />
                  {l.text}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    case "fields":
      return (
        <div className="mb-fields">
          {block.fields.map((f) => (
            <label key={f.label}>
              <span>{f.label}</span>
              <span className="mb-input">{f.value}</span>
            </label>
          ))}
        </div>
      );
    case "buttons":
      return (
        <div className="mb-buttons">
          {block.items.map((b) => (
            <span key={b.text} className={b.primary ? "is-primary" : undefined}>
              {b.text}
            </span>
          ))}
        </div>
      );
    case "scanner":
      return (
        <div className="mb-scanner">
          <div className="mb-scanner__frame">
            <span className="mb-scanner__qr" />
            <span className="mb-scanner__line" />
          </div>
          <p>{block.hint}</p>
        </div>
      );
    case "signature":
      return (
        <div className="mb-signature">
          <span>{block.label}</span>
          <svg viewBox="0 0 120 30" className="mb-signature__pad">
            <path d="M6 22 C 18 4, 26 30, 36 16 S 52 8, 60 20 S 78 26, 86 12 S 104 14, 114 18" fill="none" strokeWidth="2.5" />
          </svg>
        </div>
      );
  }
}
