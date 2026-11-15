"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES, PROFILE_BIO } from "@/lib/constants";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Application, Listing } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  applied: "受付済み", reading: "鑑定中", delivered: "鑑定書お届け済み", completed: "完了（感想あり）",
};

export default function MyPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false); const [email, setEmail] = useState("");
  const [listings, setListings] = useState<Listing[]>([]); const [apps, setApps] = useState<Application[]>([]);
  const [title, setTitle] = useState(""); const [category, setCategory] = useState("恋愛");
  const [desc, setDesc] = useState(""); const [capacity, setCapacity] = useState(5);
  const [bio, setBio] = useState(PROFILE_BIO); const [msg, setMsg] = useState("");

  async function load() {
    const sb = getSupabase();
    const { data: l } = await sb.from("listings").select("*").order("created_at", { ascending: true });
    setListings((l as Listing[]) ?? []);
    const { data: a } = await sb.from("applications").select("*").order("created_at", { ascending: false });
    setApps((a as Application[]) ?? []);
    const { data: p } = await sb.from("profile").select("bio").eq("id", 1).maybeSingle();
    if (p?.bio) setBio(p.bio as string);
  }

  useEffect(() => {
    (async () => {
      if (!isSupabaseConfigured()) { setReady(true); return; }
      const sb = getSupabase();
      const { data } = await sb.auth.getSession();
      if (!data.session) { router.push("/login"); return; }
      setEmail(data.session.user.email ?? ""); setReady(true); load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createListing(e: React.FormEvent) {
    e.preventDefault(); const sb = getSupabase();
    const { error } = await sb.from("listings").insert({ category, title, description: desc, capacity, is_open: true });
    setMsg(error ? "募集の作成に失敗しました。" : "募集を作成しました。");
    if (!error) { setTitle(""); setDesc(""); load(); }
  }
  async function removeListing(id: string) {
    if (!confirm("本当にこの募集を削除しますか？")) return;
    await getSupabase().from("listings").delete().eq("id", id); load();
  }
  async function saveBio() {
    const sb = getSupabase();
    const { error } = await sb.from("profile").upsert({ id: 1, reader_name: "よみ", bio });
    setMsg(error ? "プロフィールの保存に失敗しました。" : "プロフィールを保存しました。");
  }
  async function logout() { await getSupabase().auth.signOut(); router.push("/"); }

  if (!ready) return <div className="container"><p>読み込み中…</p></div>;
  if (!isSupabaseConfigured()) return <div className="container"><p>（デモ表示）Supabase未接続のためマイページは表示できません。</p><Link href="/login">ログイン画面へ</Link></div>;

  return (
    <div className="container">
      <h1 style={{ color: "var(--navy)" }}>マイページ（占い師用）</h1>
      <p>{email} でログイン中 <button className="btn btn-outline" onClick={logout}>ログアウト</button></p>
      {msg ? <p className="card" style={{ background: "#f0fdf4" }}>{msg}</p> : null}

      <section className="card"><h2>応募一覧</h2>
        {apps.length === 0 ? <p>まだ応募はありません。</p> : apps.map((a) => (
          <p key={a.id} style={{ borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
            <strong>{a.applicant_name}</strong> さん ― {STATUS_LABEL[a.status] ?? a.status}
            <br /><span style={{ fontSize: 13 }}>{a.consultation.slice(0, 60)}…</span>
            <br /><Link className="btn btn-navy" href={`/rooms/${a.id}`}>鑑定ルームを開く（返信・鑑定書作成）</Link>
          </p>
        ))}
      </section>

      <section className="card"><h2>募集の管理</h2>
        {listings.map((l) => (
          <p key={l.id}>{l.category}：{l.title}（定員{l.capacity}名／{l.is_open ? "募集中" : "停止中"}）
            <button className="btn btn-outline" style={{ marginLeft: 8 }} onClick={async () => { await getSupabase().from("listings").update({ is_open: !l.is_open }).eq("id", l.id); load(); }}>{l.is_open ? "募集を停止" : "募集を再開"}</button>
            <button className="btn btn-outline" style={{ marginLeft: 6 }} onClick={() => removeListing(l.id)}>削除</button>
          </p>
        ))}
        <h3>新しい募集を作る</h3>
        <form onSubmit={createListing}>
          <label>カテゴリ<select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.filter((c) => c !== "すべて").map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>タイトル<input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
          <label>説明<textarea className="input" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></label>
          <label>定員<input className="input" type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} /></label>
          <button className="btn" type="submit">募集を作成する</button>
        </form>
      </section>

      <section className="card"><h2>プロフィール編集</h2>
        <textarea className="input" rows={6} value={bio} onChange={(e) => setBio(e.target.value)} />
        <button className="btn" onClick={saveBio}>プロフィールを保存</button>
        <p style={{ fontSize: 13 }}>※ホームのプロフィール表示は現在 constants.ts の文面が初期値です。運用時はこの保存内容をホームに反映するよう接続してください（README参照）。</p>
      </section>
    </div>
  );
}
