import { Fragment } from "react";
import { HERO_BODY_COPY } from "../siteCopy";
import "../styles/typography.css";

/** Paper “Team Matchup” row — letter placeholders until real marks ship (reads “SOON”). */
const MATCHUP = ["S", "O", "O", "O", "N"] as const;

function MatchupDivider({ variant }: { variant: "single" | "double" }) {
  const column = (
    <div className="pennant-matchup__divider" aria-hidden>
      <span />
      <span />
    </div>
  );

  if (variant === "double") {
    return (
      <div
        className="pennant-matchup__divider--double"
        data-testid="matchup-double-divider"
        aria-hidden
      >
        {column}
        {column}
      </div>
    );
  }

  return column;
}

export function LandingOverlay() {
  return (
    <main className="pennant-overlay">
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
        <p className="pennant-body">{HERO_BODY_COPY}</p>
        <div className="pennant-matchup-shell" aria-hidden>
          <div className="pennant-matchup">
            {MATCHUP.map((ch, i) => (
              <Fragment key={`${ch}-${i}`}>
                {i > 0 ? (
                  <MatchupDivider
                    variant={i === 3 ? "double" : "single"}
                  />
                ) : null}
                <div className="pennant-matchup__cell">{ch}</div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
