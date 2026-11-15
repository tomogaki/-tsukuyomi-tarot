"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CANNOT_READ, PROMISES, SEED_LISTINGS } from "@/lib/constants";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import PassphraseNotice from "@/components/PassphraseNotice";
import type { Listing } from "@/lib/types";

function MotifArt() {
  return (
    <svg width="220" height="90" viewBox="0 0 220 90" role="img" aria-label="月・星・太陽の線画" style={{ display: "block", margin: "0 auto" }}>
      <g fill="none" stroke="#b9974f" strokeWidth="1.3">
        <rect x="55" y="18" width="34" height="54" rx="4" transform="rotate(-10 72 45)" />
        <rect x="93" y="12" width="34" height="54" rx="4" />
        <rect x="131" y="18" width="34" height="54" rx="4" transform="rotate(10 148 45)" />
        <path d="M118 30a7 7 0 1 1-5-11.7A8.5 8.5 0 1 0 118 30z" />
        <path d="M72 34l1.8 4.2L78 40l-4.2 1.8L72 46l-1.8-4.2L66 40l4.2-1.8z" />
        <circle cx="148" cy="38" r="6" /><path d="M148 28v-5M148 53v-5M138 38h-5M163 38h-5M141 31l-3.5-3.5M158.5 48.5L155 45M155 31l3.5-3.5M137.5 48.5L141 45" />
      </g>
    </svg>
  );
}
function CrossDiagram() {
  const cell = (x: number, y: number, n: number) => (
    <g key={n}><rect x={x} y={y} width="26" height="38" rx="3" fill="#fdfaf2" stroke="#b9974f" /><text x={x + 13} y={y + 23} textAnchor="middle" fontSize="12" fill="#101c33">{n}</text></g>
  );
  return (
    <div>
      <svg width="240" height="190" viewBox="0 0 240 190" role="img" aria-label="ケルト十字11枚の並び図" style={{ display: "block", margin: "0 auto" }}>
        {cell(70, 76, 1)}{cell(74, 72, 2)}{cell(70, 20, 3)}{cell(70, 132, 4)}{cell(14, 76, 5)}{cell(126, 76, 6)}
        {cell(196, 8, 10)}{cell(196, 52, 9)}{cell(196, 96, 8)}{cell(196, 140, 7)}
        <line x1="182" y1="10" x2="182" y2="180" stroke="#b9974f" strokeDasharray="3 4" />
      </svg>
      <p style={{ fontSize: 13, textAlign: "center" }}>1〜10が十字の並び、右側の柱が7〜10。少し離れた11枚目が「対策」のカードです（番号のみ表示）。</p>
    </div>
  );
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [name, setName] = useState(""); const [pass, setPass] = useState("");
  const [consult, setConsult] = useState(""); const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const seed = SEED_LISTINGS.find((s) => s.slug === params.id);
      if (!isSupabaseConfigured() || seed) {
        if (seed) setListing({ id: seed.slug, category: seed.category, title: seed.title, description: seed.description, capacity: seed.capacity, is_open: true });
        return;
      }
      const { data } = await getSupabase().from("listings").select("*").eq("id", params.id).maybeSingle();
      setListing((data as Listing) ?? null);
    })();
  }, [params.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    if (!agree) { setMsg("お約束事項への同意チェックが必要です。"); return; }
    if (!isSupabaseConfigured()) { setMsg("（デモ表示）Supabase未接続のため送信できません。セットアップ後に申し込めます。"); return; }
    setBusy(true);
    const sb = getSupabase();
    const { data: l } = await sb.from("listings").select("id").eq("id", params.id).maybeSingle();
    const { count } = await sb.from("applications").select("id", { count: "exact", head: true }).eq("listing_id", params.id);
    if (l && listing && (count ?? 0) >= listing.capacity) { setMsg("申し訳ありません、この募集は満員になりました。"); setBusy(false); return; }
    const { error } = await sb.from("applications").insert({ listing_id: l ? params.id : null, applicant_name: name.trim(), passphrase: pass.trim(), consultation: consult.trim(), status: "applied", agreed: true });
    setBusy(false);
    if (error) { setMsg("送信に失敗しました。入力内容をご確認ください。"); return; }
    setDone(true);
  }

  if (!listing) return <div className="container"><p>募集が見つかりませんでした。</p><Link href="/listings">← 募集一覧に戻る</Link></div>;

  if (done) return (
    <div className="container"><section className="invite">
      <h2>お申し込みありがとうございました 🌙</h2>
      <p>受付が完了しました。鑑定書のお届けまで3日〜1週間ほどお待ちください。</p>
      <h3>あなたの入室情報（必ず残してください）</h3>
      <p style={{ fontSize: 20 }}>お名前：<strong>{name}</strong></p>
      <p style={{ fontSize: 20 }}>合言葉：<strong>{pass}</strong></p>
      <PassphraseNotice />
      <p>ホーム下部の「応募済みの方はこちら」から、このお名前と合言葉で鑑定ルームに入れます。</p>
      <Link className="btn btn-navy" href="/">ホームへ戻る</Link>
    </section></div>
  );

  return (
    <div className="container">
      <section className="invite">
        <MotifArt />
        <p><span className="badge">ケルト十字（11枚引き）</span><span className="badge">{listing.category}</span><span className="badge">無料</span></p>
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>
        <p>使用スプレッド：ケルト十字（11枚引き）／ 形式：文面鑑定（鑑定書）／ 占い師：よみ</p>
        <h3>ケルト十字（11枚引き）の並び</h3><CrossDiagram />
      </section>
      <section className="invite">
        <h2>占えないこと</h2>
        <ul>{CANNOT_READ.map((c) => <li key={c}>{c}</li>)}</ul>
        <h3>お約束事項</h3>
        <ol>{PROMISES.map((p) => <li key={p}>{p}</li>)}</ol>
      </section>
      <section className="invite">
        <h2>申し込みフォーム</h2>
        <form onSubmit={submit}>
          <label>お名前（ニックネーム可）<input className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="例：みい" /></label>
          <label>合言葉（鑑定ルームへの入室に使います）<input className="input" value={pass} onChange={(e) => setPass(e.target.value)} required placeholder="忘れない言葉を決めてください" /></label>
          <PassphraseNotice />
          <label>ご相談内容（テーマは1つ・具体的に）<textarea className="input" rows={6} value={consult} onChange={(e) => setConsult(e.target.value)} required placeholder="ここに今のあなたの想いを自由にお書きください…" /></label>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", margin: "10px 0 16px" }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 22, height: 22, accentColor: "#101c33" }} />
            <span>「占えないこと」と「お約束事項」を確認し、同意します</span>
          </label>
          {msg ? <p style={{ color: "#9a3412" }}>{msg}</p> : null}
          <button className="btn btn-navy" type="submit" disabled={busy} style={{ width: "100%" }}>無料鑑定を申し込む</button>
        </form>
      </section>
      <Link href="/listings">← 募集一覧に戻る</Link>
    </div>
  );
}
