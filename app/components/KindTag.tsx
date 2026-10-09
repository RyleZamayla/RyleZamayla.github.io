import type { ProjectKind } from "../content/types.ts";

export function KindTag({ kind }: { kind: ProjectKind }) {
  return <span className={`kind kind--${kind}`}>{kind === "personal" ? "Personal" : "Professional, private code"}</span>;
}
