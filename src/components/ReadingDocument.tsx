import { CLOSING_LINES, POSITIONS } from "@/lib/constants";
import type { Reading } from "@/lib/types";

function MoonBadge({ no }: { no: number }) {
  return (
    <span className="moon-badge" aria-hidden="true">
      <svg width="44" height="44" viewBox="0 0 48 48">
        <path d="M36 30A15 15 0 1 1 18 12a12 12 0 0 0 18 18z" fill="none" stroke="#d9b96a" strokeWidth="1.3" />
      </svg>
      <span className="moon-badge-no">{no}</span>
    </span>
  );
}

export default function ReadingDocument({ reading }: { reading: Reading }) {
  const byNo = new Map(reading.positions.map((p) => [p.no, p]));
  return (
    <article className="reading-doc">
      <div className="reading-frame">
        <p className="reading-kicker">― 鑑定書 ―</p>
        <h2 className="reading-title">ケルト十字 鑑定書</h2>
        <p className="reading-sub">つくよみタロット よみ</p>
        {POSITIONS.map((pos) => {
          const p = byNo.get(pos.no);
          if (!p) return null;
          return (
            <section key={pos.no} className="reading-pos">
              <h3 className="reading-pos-head">
                <MoonBadge no={pos.no} />
                <span>
                  <span className="reading-pos-name">{pos.no}. {pos.name}</span>
                  <span className="reading-pos-sub">{pos.subtitle}</span>
                </span>
              </h3>
              <p className="reading-card">
                {p.card} <span className="orient-badge">{p.orientation}</span>
              </p>
              <p className="reading-text">{p.text}</p>
            </section>
          );
        })}
        <div className="reading-summary">
          <h3>全体から見た結論</h3><p>{reading.conclusion}</p>
          <h3>今回の鑑定で特に注目したい3枚</h3><p>{reading.spotlight}</p>
          <h3>今回、一番伝えたいこと</h3><p>{reading.key_message}</p>
        </div>
        {reading.final_text ? (
          <div className="reading-summary"><h3>鑑定文</h3><p style={{ whiteSpace: "pre-line" }}>{reading.final_text}</p></div>
        ) : null}
        <footer className="reading-closing">
          <p className="reading-sign glow">― よみ ―</p>
          {CLOSING_LINES.map((l) => (<p key={l} className="reading-close-line">{l}</p>))}
          <svg className="reading-moon glow-svg" width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 9.5A8.5 8.5 0 1 0 14.5 19a7 7 0 0 1-9.5-9.5z" fill="none" stroke="#e8cf8a" strokeWidth="1.4" />
          </svg>
        </footer>
      </div>
    </article>
  );
}
