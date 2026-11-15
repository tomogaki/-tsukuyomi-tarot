"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    if (!isSupabaseConfigured()) { setMsg("（デモ表示）Supabase未接続のためログインできません。"); return; }
    setBusy(true);
    const sb = getSupabase();
    const res = mode === "login"
      ? await sb.auth.signInWithPassword({ email, password })
      : await sb.auth.signUp({ email, password });
    setBusy(false);
    if (res.error) { setMsg(mode === "login" ? "ログインに失敗しました。メールアドレスとパスワードをご確認ください。" : "登録に失敗しました。"); return; }
    if (mode === "signup") { setMsg("登録しました。確認メールが届く場合はリンクを開いてからログインしてください。"); setMode("login"); return; }
    router.push("/mypage");
  }

  return (
    <div className="container"><section className="invite">
      <h2>マイページ ログイン（占い師専用）</h2>
      <p>占い師「よみ」専用です。最初に登録したアカウントが運営者アカウントになります。公開前に必ず よみ さんご自身が先に登録してください。</p>
      <form onSubmit={submit}>
        <label>メールアドレス<input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>パスワード<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {msg ? <p>{msg}</p> : null}
        <button className="btn btn-navy" type="submit" disabled={busy} style={{ width: "100%" }}>{mode === "login" ? "ログイン" : "新規登録"}</button>
      </form>
      <p><button className="btn btn-outline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "初めての方はこちら（新規登録）" : "ログインに戻る"}</button></p>
    </section></div>
  );
}
