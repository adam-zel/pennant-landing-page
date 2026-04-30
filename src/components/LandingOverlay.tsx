import { HERO_BODY_COPY } from "../siteCopy";
import "../styles/typography.css";

/** Paper “Coming Soon” strip — reads “SOON”; middle slot stacks two O’s (see Paper `L1X-0`). */
function MatchupDividerSingle() {
  return (
    <div className="pennant-matchup__divider-vertical" aria-hidden>
      <span className="pennant-matchup__divider-vertical__bar pennant-matchup__divider-vertical__bar--light" />
      <span className="pennant-matchup__divider-vertical__bar pennant-matchup__divider-vertical__bar--dark" />
    </div>
  );
}

/** Paper double divider: two horizontal 1px rules (#1A281C over #274434). */
function MatchupDividerDouble() {
  return (
    <div
      className="pennant-matchup__divider-horizontal"
      data-testid="matchup-double-divider"
      aria-hidden
    >
      <span className="pennant-matchup__divider-horizontal__bar pennant-matchup__divider-horizontal__bar--top" />
      <span className="pennant-matchup__divider-horizontal__bar pennant-matchup__divider-horizontal__bar--bottom" />
    </div>
  );
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
            <div className="pennant-matchup__cell">S</div>
            <MatchupDividerSingle />
            <div className="pennant-matchup__cell">O</div>
            <MatchupDividerSingle />
            <div
              className="pennant-matchup__middle"
              data-testid="matchup-middle-column"
            >
              <div className="pennant-matchup__middle-inner">
                <div className="pennant-matchup__cell pennant-matchup__cell--stacked">
                  O
                </div>
                <MatchupDividerDouble />
                <div className="pennant-matchup__cell pennant-matchup__cell--stacked">
                  O
                </div>
              </div>
            </div>
            <MatchupDividerSingle />
            <div className="pennant-matchup__cell">N</div>
          </div>
        </div>
      </div>
    </main>
  );
}
