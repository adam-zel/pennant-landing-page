import { Fragment } from "react";
import "../styles/typography.css";

const BODY_COPY =
  "Pennant is your new baseball companion. Pick your team once. Open it every day. It tells you what's happening, who's playing, and where your team stands.";

/** Paper “Team Matchup” row — letter placeholders until real marks ship. */
const MATCHUP = ["S", "O", "O", "O", "N"] as const;

export function LandingOverlay() {
  return (
    <div className="pennant-overlay">
      <div className="pennant-overlay__inner">
        <p className="pennant-wordmark">Pennant</p>
        <h1 className="pennant-display-stack">
          <span className="pennant-display pennant-display--semibold">
            Baseball
          </span>
          <span className="pennant-display pennant-display--light">Without</span>
          <span className="pennant-display pennant-display--semibold">
            The Noise.
          </span>
        </h1>
        <p className="pennant-body">{BODY_COPY}</p>
        <div className="pennant-matchup-shell" aria-hidden>
          <div className="pennant-matchup">
            {MATCHUP.map((ch, i) => (
              <Fragment key={`${ch}-${i}`}>
                {i > 0 ? (
                  <div className="pennant-matchup__divider">
                    <span />
                    <span />
                  </div>
                ) : null}
                <div className="pennant-matchup__cell">{ch}</div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
