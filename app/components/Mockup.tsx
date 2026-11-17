import type { Block, Snapshot } from "../content/snapshots.ts";

/*
 * Draws an illustrated snapshot. The whole drawing is exposed to assistive tech
 * as a single image with the caption as its description, so screen readers
 * don't read invented demo data out as if it were real content.
 */
export function Mockup({
  snapshot,
  size = "full",
}: {
  snapshot: Snapshot;
  size?: "full" | "thumb";
}) {
  const { frame, title, blocks, image, shell } = snapshot;
  if (frame === "screenshot" && image) {
    return (
      <div
        className={`mock mock--screenshot mock--${size}${image.height > image.width ? " mock--portrait" : ""}`}
        aria-hidden={size === "thumb" ? true : undefined}
      >
        {size === "full" ? (
          <a href={image.src} className="mock__zoom" title="Open full size">
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
              alt={`Screenshot: ${snapshot.caption}`}
            />
          </a>
        ) : (
          <img
            src={image.src}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            alt=""
          />
        )}
      </div>
    );
  }
  return (
    <div
      className={`mock mock--${frame} mock--${size}`}
      role={size === "full" ? "img" : undefined}
      aria-label={
        size === "full" ? `Illustration: ${snapshot.caption}` : undefined
      }
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
      {shell ? (
        <div className="mock__shell" aria-hidden="true">
          <nav className="mk-nav">
            <b>{shell.brand}</b>
            {shell.nav.map((n, i) => (
              <span key={n} className={i === shell.active ? "is-active" : undefined}>
                {n}
              </span>
            ))}
          </nav>
          <div className="mock__main">
            <div className="mk-top">
              <span>{shell.crumb}</span>
              <i className="mk-avatar">{shell.user}</i>
            </div>
            <div className="mock__body">
              {blocks.map((b, i) => (
                <MockBlock key={i} block={b} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mock__body" aria-hidden="true">
          {blocks.map((b, i) => (
            <MockBlock key={i} block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function MockBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "tabs":
      return (
        <div className="mb-tabs">
          {block.items.map((t, i) => (
            <span
              key={t}
              className={i === block.active ? "is-active" : undefined}
            >
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
              {r.avatar && <i className="mk-avatar">{r.avatar}</i>}
              {r.check !== undefined && (
                <span className={`mb-check${r.check ? " is-on" : ""}`} />
              )}
              <span className="mb-rows__text">
                <span>{r.label}</span>
                {r.meta && <small>{r.meta}</small>}
              </span>
              {r.chip && (
                <span className={`mb-chip tone-${r.chip.tone}`}>
                  {r.chip.text}
                </span>
              )}
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
              <tr
                key={i}
                className={i === block.highlight ? "is-hi" : undefined}
              >
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
            <span
              key={i}
              className={
                l.startsWith("$ ")
                  ? "is-cmd"
                  : l.startsWith("✓")
                    ? "is-ok"
                    : undefined
              }
            >
              {l}
              {"\n"}
            </span>
          ))}
        </pre>
      );
    case "grid":
      return (
        <div>
          <div
            className="mb-grid"
            style={{ gridTemplateColumns: `repeat(${block.cols}, 1fr)` }}
          >
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
              <span className={`mb-input${f.readonly ? " is-readonly" : ""}`}>
                {f.value}
                {f.readonly && <small>Read-only</small>}
              </span>
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
            <path
              d="M6 22 C 18 4, 26 30, 36 16 S 52 8, 60 20 S 78 26, 86 12 S 104 14, 114 18"
              fill="none"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      );
    case "split":
      return (
        <div className={`mb-split mb-split--${(block.ratio ?? "1:1").replace(":", "-")}`}>
          <div>
            {block.left.map((b, i) => (
              <MockBlock key={i} block={b} />
            ))}
          </div>
          <div>
            {block.right.map((b, i) => (
              <MockBlock key={i} block={b} />
            ))}
          </div>
        </div>
      );
    case "filters":
      return (
        <div className="mb-filters">
          {block.search && <span className="mb-search">{block.search}</span>}
          {block.chips.map((c) => (
            <span key={c.text} className={c.active ? "is-active" : undefined}>
              {c.text}
            </span>
          ))}
        </div>
      );
    case "bars": {
      const max = Math.max(...block.values, block.target ?? 0) * 1.12;
      return (
        <div className="mb-card">
          <p className="mb-cap">{block.title}</p>
          <div className="mb-bars">
            {block.values.map((v, i) => (
              <span
                key={i}
                className={i === block.highlight ? "is-hi" : undefined}
                style={{ height: `${(v / max) * 100}%` }}
              />
            ))}
            {block.target !== undefined && <i className="mb-bars__target" style={{ bottom: `${(block.target / max) * 100}%` }} />}
          </div>
          <div className="mb-bars__labels">
            {block.labels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      );
    }
    case "line": {
      const lo = Math.min(...block.points);
      const hi = Math.max(...block.points);
      const pts = block.points.map((v, i) => `${(i / (block.points.length - 1)) * 100},${34 - ((v - lo) / (hi - lo || 1)) * 30}`);
      return (
        <div className="mb-card">
          <p className="mb-cap">{block.title}</p>
          <svg viewBox="0 0 100 36" className="mb-line" preserveAspectRatio="none">
            <polygon points={`0,36 ${pts.join(" ")} 100,36`} className="mb-line__area" />
            <polyline points={pts.join(" ")} className="mb-line__stroke" />
          </svg>
          {(block.from || block.to) && (
            <div className="mb-bars__labels">
              <span>{block.from}</span>
              <span>{block.to}</span>
            </div>
          )}
        </div>
      );
    }
    case "rings":
      return (
        <div className="mb-rings">
          {block.items.map((r) => (
            <div key={r.label}>
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" className="mb-ring__track" pathLength={100} />
                <circle cx="18" cy="18" r="15.9155" className={`mb-ring__bar tone-stroke-${r.tone}`} pathLength={100} strokeDasharray={`${r.value} ${100 - r.value}`} transform="rotate(-90 18 18)" />
              </svg>
              <b>{r.value}%</b>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      );
    case "map": {
      const roads = block.variant === 1
        ? ["M0 22 L80 22 L110 60 L200 60", "M60 0 L60 110", "M140 0 L140 110", "M0 90 L200 90", "M0 110 L70 40 L120 0"]
        : ["M0 30 L70 30 L92 55 L200 55", "M40 0 L40 110", "M120 0 L120 110", "M0 88 L200 88", "M0 0 L60 60 L112 110"];
      return (
        <svg viewBox="0 0 200 110" className="mb-map" role="presentation">
          <rect width="200" height="110" className="mb-map__bg" />
          <path d="M150 0 C 160 30, 140 60, 165 110 L200 110 L200 0 Z" className="mb-map__water" />
          {roads.map((d) => (
            <path key={d} d={d} className="mb-map__road" />
          ))}
          {block.route && <polyline points={block.route.map((p) => p.join(",")).join(" ")} className="mb-map__route" />}
          {block.pins.map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              {p.label && (
                <g>
                  <rect x={-2} y={p.big ? -22 : -19} width={p.label.length * 4.4 + 6} height={9} className="mb-map__tag" />
                  <text x={1} y={p.big ? -15.2 : -12.2} className="mb-map__label">
                    {p.label}
                  </text>
                </g>
              )}
              <rect x={p.big ? -6 : -5} y={p.big ? -6 : -5} width={p.big ? 12 : 10} height={p.big ? 12 : 10} className={`mb-map__pin tone-fill-${p.tone}`} />
              {p.n && (
                <text x={0} y={2.4} textAnchor="middle" className="mb-map__n">
                  {p.n}
                </text>
              )}
            </g>
          ))}
        </svg>
      );
    }
    case "floor":
      return (
        <div>
          <div className="mb-floor" style={{ gridTemplateColumns: `repeat(${block.cols}, 1fr)`, gridTemplateRows: `repeat(${block.rows}, minmax(22px, 1fr))` }}>
            {block.zones.map((z) => (
              <div
                key={z.label}
                className={`mb-floor__bay is-${z.status}`}
                style={{ gridColumn: `${z.x + 1} / span ${z.w}`, gridRow: `${z.y + 1} / span ${z.h}` }}
              >
                <b>{z.label}</b>
                {z.sub && <small>{z.sub}</small>}
                {z.status === "locked" && <em className="mb-floor__lock">{z.editor ?? "ED"}</em>}
              </div>
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
    case "feed":
      return (
        <div className="mb-feed">
          {block.title && <p className="mb-cap">{block.title}</p>}
          <ol>
            {block.items.map((f) => (
              <li key={f.time + f.title}>
                <i className={`tone-bg-${f.tone ?? "muted"}`} />
                <span className="mb-feed__text">
                  <span>
                    {f.title}
                    {f.tag && <em className="mb-chip tone-ember">{f.tag}</em>}
                  </span>
                  {f.meta && <small>{f.meta}</small>}
                </span>
                <time>{f.time}</time>
              </li>
            ))}
          </ol>
        </div>
      );
    case "steps":
      return (
        <ol className="mb-steps">
          {block.items.map((t, i) => (
            <li key={t} className={i < block.active ? "is-done" : i === block.active ? "is-now" : undefined}>
              <i />
              <span>{t}</span>
            </li>
          ))}
        </ol>
      );
    case "kv":
      return (
        <dl className={`mb-kv${block.cols === 2 ? " mb-kv--2" : ""}`}>
          {block.items.map((it) => (
            <div key={it.k}>
              <dt>{it.k}</dt>
              <dd className={it.tone ? `tone-text-${it.tone}` : undefined}>{it.v}</dd>
            </div>
          ))}
        </dl>
      );
    case "queue":
      return (
        <ul className="mb-queue">
          {block.items.map((q) => (
            <li key={q.label} className={`is-${q.state}`}>
              <i />
              <span className="mb-rows__text">
                <span>{q.label}</span>
                {q.meta && <small>{q.meta}</small>}
              </span>
              <em>{{ synced: "Synced", sending: "Sending", waiting: "Waiting", retry: "Retry", paused: "Paused" }[q.state]}</em>
            </li>
          ))}
        </ul>
      );
    case "doc":
      return (
        <div className="mb-doc">
          <div className="mb-doc__head">
            <b>{block.title}</b>
            <small>{block.ref}</small>
          </div>
          <dl>
            {block.lines.map((l) => (
              <div key={l.k}>
                <dt>{l.k}</dt>
                <dd>{l.v}</dd>
              </div>
            ))}
          </dl>
          {block.signed && (
            <svg viewBox="0 0 120 30" className="mb-doc__sig">
              <path d="M6 22 C 18 4, 26 30, 36 16 S 52 8, 60 20 S 78 26, 86 12 S 104 14, 114 18" fill="none" strokeWidth="2" />
            </svg>
          )}
          {block.stamp && <span className="mb-doc__stamp">{block.stamp}</span>}
        </div>
      );
    case "compare":
      return (
        <div className="mb-compare">
          {block.items.map((c) => (
            <div key={c.label} className={c.best ? "is-best" : undefined}>
              <span>{c.label}</span>
              <span className="mb-compare__track">
                <i style={{ width: `${(c.value / block.max) * 100}%` }} />
              </span>
              <b>{c.display}</b>
              <small>{c.note}</small>
            </div>
          ))}
        </div>
      );
    case "photos":
      return (
        <div className="mb-photos">
          {block.labels.map((l, i) => (
            <span key={l} className={`ph-${i % 3}`}>
              <small>{l}</small>
            </span>
          ))}
        </div>
      );
    case "tabbar":
      return (
        <div className="mb-tabbar">
          {block.items.map((t, i) => (
            <span key={t} className={i === block.active ? "is-active" : undefined}>
              <i />
              {t}
            </span>
          ))}
        </div>
      );
    case "otp":
      return (
        <div className="mb-otp">
          <div>
            {[...block.digits].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <small>{block.hint}</small>
        </div>
      );
    case "matrix":
      return (
        <table className="mb-matrix">
          <thead>
            <tr>
              {block.head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                {r.cells.map((c, i) => (
                  <td key={i} className={c ? "is-yes" : "is-no"}>
                    <i />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
}
