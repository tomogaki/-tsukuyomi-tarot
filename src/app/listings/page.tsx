"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, SEED_LISTINGS } from "@/lib/constants";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Listing } from "@/lib/types";

type Row = Listing & { applied: number };

export default function ListingsPage() {
  const [tab, setTab] = useState<string>("すべて");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!isSupabaseConfigured()) {
        setRows(SEED_LISTINGS.map((s, i) => ({ id: s.slug, slug: s.slug, category: s.category, title: s.title, description: s.description, capacity: s.capacity, is_open: true, applied: 0 })));
        setLoading(false); return;
      }
      const sb = getSupabase();
      const { data } = await sb.from("listings").select("*").order("created_at", { ascending: true });
      const list = (data as Listing[] | null) ?? [];
      const withCounts: Row[] = [];
      for (const l of list) {
        const { count } = await sb.from("applications").select("id", { count: "exact", head: true }).eq("listing_id", l.id);
        withCounts.push({ ...l, applied: count ?? 0 });
      }
      setRows(withCounts); setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => (tab === "すべて" ? rows : rows.filter((r) => r.category === tab)), [rows, tab]);

  return (
    <div className="container">
      <section className="hero" style={{ padding: "28px 18px" }}><h1 style={{ fontSize: 24 }}>募集メニュー</h1><p>ケルト十字（11枚引き）・文面鑑定・無料</p></section>
      <div className="tabs">{CATEGORIES.map((c) => (<button key={c} className={`tab${tab === c ? " active" : ""}`} onClick={() => setTab(c)}>{c}</button>))}</div>
      {loading ? <p>読み込み中…</p> : filtered.length === 0 ? <p>このカテゴリの募集は現在ありません。</p> : filtered.map((r) => {
        const remain = Math.max(0, r.capacity - r.applied); const full = remain <= 0 || !r.is_open;
        return (
          <article className="tarot-card" key={r.id}><div className="tarot-inner">
            <span className="badge">ケルト十字</span><span className="badge">{r.category}</span>
            {full ? <span className="badge" style={{ background: "#7f1d1d", color: "#fff" }}>満員御礼</span> : null}
            <h2 className="tarot-title">{r.title}</h2>
            <p style={{ color: "#e6e9f2" }}>{r.description}</p>
            <div className="info-row">
              <div className="info-box">鑑定料<strong>無料</strong></div>
              <div className="info-box">残り<strong>{full ? "0名" : `${remain}名`}</strong></div>
              <div className="info-box">占い師<strong>よみ</strong></div>
            </div>
            <p style={{ fontSize: 13, color: "#b9c2d6" }}>スプレッド：ケルト十字（11枚引き）／ 形式：文面鑑定（鑑定書）</p>
            {full ? <span className="btn" aria-disabled="true" style={{ opacity: .5 }}>満員御礼</span>
              : <Link className="btn" href={`/listings/${r.id}`}>詳細を見る・申し込む</Link>}
          </div></article>
        );
      })}
    </div>
  );
}
