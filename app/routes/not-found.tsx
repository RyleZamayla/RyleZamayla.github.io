import { Link } from "react-router";
import { LostCat } from "../components/Cat";

export function meta() {
  return [{ title: "Page not found" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <div className="wrap page-pad">
      <LostCat />
      <h1>Page not found</h1>
      <p>The cat checked everywhere. There's nothing at this address; it may have moved, or the link has a typo.</p>
      <p className="hero__actions">
        <Link viewTransition className="btn" to="/projects">
          See all projects
        </Link>
        <Link viewTransition className="btn btn--quiet" to="/">
          Back to the hub
        </Link>
      </p>
    </div>
  );
}
