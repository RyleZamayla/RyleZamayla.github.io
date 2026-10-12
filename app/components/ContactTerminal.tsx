import { useState } from "react";
import { profile } from "../content/profile.ts";
import { useReveal } from "../hooks/useReveal.ts";

type Status = { kind: "idle" } | { kind: "copied" } | { kind: "shown"; email: string };

export function ContactTerminal() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copies, setCopies] = useState(0);
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.3);
  const line = (i: number) => ({ className: "term-line", style: { "--i": i } as React.CSSProperties });

  async function copyEmail() {
    const email = profile.emailParts.join("@");
    try {
      await navigator.clipboard.writeText(email);
      setStatus({ kind: "copied" });
      setCopies((n) => n + 1);
    } catch {
      // Clipboard can be blocked (permissions, older browsers): show it instead.
      setStatus({ kind: "shown", email });
    }
  }

  return (
    <div ref={ref} className={`terminal ${revealClass}`} role="group" aria-labelledby="contact-heading">
      <div className="terminal__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <p>contact.sh</p>
      </div>
      <div className="terminal__body">
        <p className="terminal__cmd term-line" style={{ "--i": 0 } as React.CSSProperties}>
          whoami
        </p>
        <p {...line(1)}>
          {profile.name}. {profile.tagline}, based in {profile.location}.
        </p>
        <p className="terminal__cmd term-line" style={{ "--i": 2 } as React.CSSProperties}>
          ls ./contact
        </p>
        <ul className="terminal__links">
          <li {...line(3)}>
            <a href={profile.links.github} rel="me">
              github
            </a>
            <span className="terminal__note">code and older projects</span>
          </li>
          <li {...line(4)}>
            <a href={profile.links.linkedin} rel="me">
              linkedin
            </a>
            <span className="terminal__note">work history</span>
          </li>
          <li {...line(5)}>
            <a href={profile.links.facebook} rel="me">
              facebook
            </a>
            <span className="terminal__note">say hello</span>
          </li>
          <li {...line(6)}>
            <a href={profile.links.instagram} rel="me">
              instagram
            </a>
            <span className="terminal__note">life outside the code</span>
          </li>
          <li {...line(7)}>
            <button type="button" className="terminal__btn" onClick={copyEmail}>
              copy-email
            </button>
            {copies > 0 && (
              <span key={copies} className="plus-one" aria-hidden="true">
                +1 contact
              </span>
            )}
            <span className="terminal__note">puts my address on your clipboard</span>
          </li>
        </ul>
        <p className="terminal__status" aria-live="polite">
          {status.kind === "copied" && "Email copied to your clipboard."}
          {status.kind === "shown" && (
            <>
              Couldn't reach your clipboard. My email is <a href={`mailto:${status.email}`}>{status.email}</a>
            </>
          )}
        </p>
        <noscript>
          <p>Email copying needs JavaScript. You can reach me on LinkedIn instead.</p>
        </noscript>
        <p className="terminal__prompt" aria-hidden="true">
          <span className="caret" />
        </p>
      </div>
    </div>
  );
}
