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
