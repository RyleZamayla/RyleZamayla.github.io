import type { ProjectKind } from "../content/types.ts";

const labels: Record<ProjectKind, string> = {
  personal: "Personal",
  professional: "Professional, private code",
};

export function KindTag({ kind }: { kind: ProjectKind }) {
  return <span className={`kind kind--${kind}`}>{labels[kind]}</span>;
}
