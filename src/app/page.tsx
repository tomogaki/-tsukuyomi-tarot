import Link from "next/link";
import { FEATURES, HERO, PROFILE_BIO, READER_NAME } from "@/lib/constants";
import RoomLookup from "@/components/RoomLookup";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true" style={{ filter: "drop-shadow(0 0 8px rgba(232,207,138,.7))" }}>
          <path d="M19 14.5A8.5 8.5 0 1 1 9.5 5a7 7 0 0 0 9.5 9.5z" fill="none" stroke="#e8cf8a" strokeWidth="1.1" />
        </svg>
        <p className="shoulder">{HERO.shoulder}</p>
        <h1>{HERO.headlineLines[0]}<br />{HERO.headlineLines[1]}</h1>
        <p>{HERO.descriptionLines.map((l) => (<span key={l}>{l}<br /></span>))}</p>
        <p>
          <span className="badge">無料モニター</span><span className="badge">ケルト十字</span><span className="badge">文面鑑定</span>
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", maxWidth: "460px", margin: "24px auto 28px" }}>
          {[
            { num: "XVIII", name: "THE MOON", jp: "月・直感", symbol: "☾" },
            { num: "XVII", name: "THE STAR", jp: "星・希望", symbol: "✦" },
            { num: "XIX", name: "THE SUN", jp: "太陽・祝福", symbol: "☀" },
          ].map((card) => (
            <div key={card.num} style={{ background: "linear-gradient(160deg, #1b2440 0%, #0f1629 100%)", border: "1.5px solid #c8a96e", borderRadius: "12px", padding: "14px 8px", color: "#f8f4ea", boxShadow: "0 8px 20px rgba(15, 22, 41, 0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", minHeight: "160px" }}>
              <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#c8a96e" }}>{card.num}</span>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "1px solid rgba(200, 169, 110, 0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", color: "#f3d89b", margin: "8px 0" }}>{card.symbol}</div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", color: "#c8a96e" }}>{card.name}</div>
                <div style={{ fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>{card.jp}</div>
              </div>
            </div>
          ))}
        </div>

        <Link className="btn" href="/listings">募集メニューを見る・応募する</Link>
      </section>

      <section className="feature-grid">
        {FEATURES.map((f) => (
          <div className="card" key={f.title}><h3 style={{ color: "var(--navy)" }}>{f.title}</h3><p>{f.body}</p></div>
        ))}
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2 style={{ color: "var(--navy)" }}>占い師 {READER_NAME} のプロフィール</h2>
        <p style={{ whiteSpace: "pre-line" }}>{PROFILE_BIO}</p>
      </section>

      <RoomLookup />
    </div>
  );
}
