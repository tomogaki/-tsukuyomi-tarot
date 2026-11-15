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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", maxWidth: "480px", margin: "24px auto 28px" }}>
          <div style={{ background: "linear-gradient(180deg, #131b33 0%, #0b1021 100%)", border: "1.5px solid #e8cf8a", borderRadius: "10px", padding: "8px 6px", boxShadow: "0 10px 24px rgba(0,0,0,.35)" }}>
            <div style={{ border: "0.8px solid rgba(232,207,138,.45)", borderRadius: "6px", padding: "6px 4px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#e8cf8a", marginBottom: "4px" }}>XVIII</div>
              <svg viewBox="0 0 120 170" style={{ width: "100%", height: "auto", display: "block" }}>
                <defs>
                  <radialGradient id="moonGlow" cx="50%" cy="32%" r="45%">
                    <stop offset="0%" stopColor="#e8cf8a" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#e8cf8a" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="54" r="44" fill="url(#moonGlow)" />
                <circle cx="60" cy="54" r="24" fill="none" stroke="#e8cf8a" strokeWidth="1.2" />
                <path d="M64 34 A20 20 0 1 0 64 74 A15 15 0 1 1 64 34 Z" fill="#e8cf8a" fillOpacity="0.85" />
                <line x1="60" y1="18" x2="60" y2="25" stroke="#e8cf8a" strokeWidth="1" />
                <line x1="34" y1="28" x2="39" y2="33" stroke="#e8cf8a" strokeWidth="1" />
                <line x1="86" y1="28" x2="81" y2="33" stroke="#e8cf8a" strokeWidth="1" />
                <line x1="24" y1="54" x2="31" y2="54" stroke="#e8cf8a" strokeWidth="1" />
                <line x1="96" y1="54" x2="89" y2="54" stroke="#e8cf8a" strokeWidth="1" />
                <path d="M46 86 L46 92 M60 84 L60 91 M74 86 L74 92" stroke="#e8cf8a" strokeWidth="1.1" strokeLinecap="round" />
                <rect x="16" y="102" width="16" height="36" fill="none" stroke="#e8cf8a" strokeWidth="1.1" />
                <path d="M14 102 L24 92 L34 102 Z" fill="none" stroke="#e8cf8a" strokeWidth="1.1" />
                <rect x="88" y="102" width="16" height="36" fill="none" stroke="#e8cf8a" strokeWidth="1.1" />
                <path d="M86 102 L96 92 L106 102 Z" fill="none" stroke="#e8cf8a" strokeWidth="1.1" />
                <path d="M10 144 Q35 138 60 144 T110 144" fill="none" stroke="#e8cf8a" strokeWidth="1.1" />
                <path d="M18 154 Q45 149 60 154 T102 154" fill="none" stroke="#e8cf8a" strokeWidth="0.9" strokeOpacity="0.75" />
                <path d="M48 138 Q60 120 72 138" fill="none" stroke="#e8cf8a" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
              <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1px", color: "#e8cf8a", marginTop: "4px" }}>THE MOON</div>
              <div style={{ fontSize: "10px", color: "#f8f4ea" }}>月・直感と本音</div>
            </div>
          </div>

          <div style={{ background: "linear-gradient(180deg, #131b33 0%, #0b1021 100%)", border: "1.5px solid #e8cf8a", borderRadius: "10px", padding: "8px 6px", boxShadow: "0 10px 24px rgba(0,0,0,.35)" }}>
            <div style={{ border: "0.8px solid rgba(232,207,138,.45)", borderRadius: "6px", padding: "6px 4px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#e8cf8a", marginBottom: "4px" }}>XVII</div>
              <svg viewBox="0 0 120 170" style={{ width: "100%", height: "auto", display: "block" }}>
                <defs>
                  <radialGradient id="starGlow" cx="50%" cy="34%" r="45%">
                    <stop offset="0%" stopColor="#e8cf8a" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#e8cf8a" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="56" r="46" fill="url(#starGlow)" />
                <polygon points="60,22 65,48 91,53 65,58 60,84 55,58 29,53 55,48" fill="#e8cf8a" fillOpacity="0.9" />
                <polygon points="60,34 63,50 79,53 63,56 60,72 57,56 41,53 57,50" fill="#131b33" />
                <circle cx="60" cy="53" r="3" fill="#e8cf8a" />
                <circle cx="28" cy="26" r="2" fill="#e8cf8a" />
                <circle cx="92" cy="26" r="2" fill="#e8cf8a" />
                <circle cx="22" cy="76" r="1.8" fill="#e8cf8a" />
                <circle cx="98" cy="76" r="1.8" fill="#e8cf8a" />
                <circle cx="38" cy="92" r="1.6" fill="#e8cf8a" />
                <circle cx="82" cy="92" r="1.6" fill="#e8cf8a" />
                <path d="M44 108 C44 102, 54 102, 54 108 C54 114, 44 118, 44 126" fill="none" stroke="#e8cf8a" strokeWidth="1.2" />
                <path d="M76 108 C76 102, 66 102, 66 108 C66 114, 76 118, 76 126" fill="none" stroke="#e8cf8a" strokeWidth="1.2" />
                <path d="M12 138 Q36 132 60 138 T108 138" fill="none" stroke="#e8cf8a" strokeWidth="1.1" />
                <path d="M22 148 Q45 144 60 148 T98 148" fill="none" stroke="#e8cf8a" strokeWidth="0.9" strokeOpacity="0.8" />
                <circle cx="60" cy="138" r="12" fill="none" stroke="#e8cf8a" strokeWidth="0.8" strokeDasharray="2 2" />
              </svg>
              <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1px", color: "#e8cf8a", marginTop: "4px" }}>THE STAR</div>
              <div style={{ fontSize: "10px", color: "#f8f4ea" }}>星・希望と導き</div>
            </div>
          </div>

          <div style={{ background: "linear-gradient(180deg, #131b33 0%, #0b1021 100%)", border: "1.5px solid #e8cf8a", borderRadius: "10px", padding: "8px 6px", boxShadow: "0 10px 24px rgba(0,0,0,.35)" }}>
            <div style={{ border: "0.8px solid rgba(232,207,138,.45)", borderRadius: "6px", padding: "6px 4px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#e8cf8a", marginBottom: "4px" }}>XIX</div>
              <svg viewBox="0 0 120 170" style={{ width: "100%", height: "auto", display: "block" }}>
                <defs>
                  <radialGradient id="sunGlow" cx="50%" cy="35%" r="48%">
                    <stop offset="0%" stopColor="#e8cf8a" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#e8cf8a" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="58" r="48" fill="url(#sunGlow)" />
                <circle cx="60" cy="58" r="20" fill="#e8cf8a" fillOpacity="0.2" stroke="#e8cf8a" strokeWidth="1.4" />
                <circle cx="60" cy="58" r="13" fill="none" stroke="#e8cf8a" strokeWidth="0.9" />
                <g stroke="#e8cf8a" strokeWidth="1.1">
                  <line x1="60" y1="16" x2="60" y2="32" />
                  <line x1="60" y1="84" x2="60" y2="100" />
                  <line x1="18" y1="58" x2="34" y2="58" />
                  <line x1="86" y1="58" x2="102" y2="58" />
                  <line x1="30" y1="28" x2="41" y2="39" />
                  <line x1="79" y1="77" x2="90" y2="88" />
                  <line x1="90" y1="28" x2="79" y2="39" />
                  <line x1="41" y1="77" x2="30" y2="88" />
                  <line x1="44" y1="20" x2="49" y2="33" />
                  <line x1="76" y1="20" x2="71" y2="33" />
                  <line x1="22" y1="42" x2="35" y2="47" />
                  <line x1="98" y1="42" x2="85" y2="47" />
                </g>
                <path d="M14 122 L106 122" stroke="#e8cf8a" strokeWidth="1.1" />
                <path d="M14 128 L106 128" stroke="#e8cf8a" strokeWidth="0.8" strokeOpacity="0.7" />
                <circle cx="34" cy="116" r="5" fill="none" stroke="#e8cf8a" strokeWidth="1" />
                <circle cx="60" cy="115" r="6" fill="none" stroke="#e8cf8a" strokeWidth="1" />
                <circle cx="86" cy="116" r="5" fill="none" stroke="#e8cf8a" strokeWidth="1" />
                <path d="M24 148 Q60 132 96 148" fill="none" stroke="#e8cf8a" strokeWidth="1.1" />
              </svg>
              <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1px", color: "#e8cf8a", marginTop: "4px" }}>THE SUN</div>
              <div style={{ fontSize: "10px", color: "#f8f4ea" }}>太陽・祝福と前進</div>
            </div>
          </div>
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
