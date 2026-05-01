import { HERO_BODY_COPY } from "../siteCopy";
import "../styles/typography.css";

/** Thin vertical rule between solari columns (reference: dark line, not bright twin stripes). */
function MatchupDivider() {
  return <div className="pennant-matchup__divider" aria-hidden />;
}

/**
 * Second “O” as a split-flap / solari panel: bottom of glyph in top half, top of glyph
 * in bottom half, dark gap + crease between — matches design reference (four equal columns).
 */
function MatchupSolariO() {
  return (
    <div className="pennant-matchup__solari" data-testid="matchup-solari-o">
      <div className="pennant-matchup__solari-half pennant-matchup__solari-half--top">
        O
      </div>
      <div className="pennant-matchup__solari-crease" aria-hidden />
      <div className="pennant-matchup__solari-half pennant-matchup__solari-half--bottom">
        O
      </div>
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
        {/*
          Matchup strip is decorative ornament (solari-style SOON); it is not a separate
          product-state announcement — hero copy carries messaging. aria-hidden keeps
          split glyphs from cluttering the SR experience.
        */}
        <div className="pennant-matchup-shell" aria-hidden>
          <div className="pennant-matchup">
            <div className="pennant-matchup__cell">S</div>
            <MatchupDivider />
            <div className="pennant-matchup__cell">O</div>
            <MatchupDivider />
            <MatchupSolariO />
            <MatchupDivider />
            <div className="pennant-matchup__cell">N</div>
          </div>
        </div>
      </div>
    </main>
  );
}
