"use client";
import { useCallback, useEffect, useState} from "react";
import Link from "next/link";
import { getSupabase, isSupabaseConfigured} from "@/lib/supabase";
import ReadingDocument from "@/components/ReadingDocument";
import ReadingForm from "@/components/ReadingForm";
import type { Application, Feedback, Message, Reading} from "@/lib/types";

export default function RoomPage({ params, searchParams}: { params: { id: string}; searchParams: { preview?: string}}) {
const preview = searchParams?.preview === "1";
const [app, setApp] = useState<Application | null>(null);
const [messages, setMessages] = useState<Message[]>([]);
const [reading, setReading] = useState<Reading | null>(null);
const [feedback, setFeedback] = useState<Feedback | null>(null);
const [isReader, setIsReader] = useState(false);
const [draft, setDraft] = useState(""); const [fbDraft, setFbDraft] = useState("");
const [loading, setLoading] = useState(true); const [notice, setNotice] = useState("");

const load = useCallback(async () => {
if (!isSupabaseConfigured()) { setLoading(false); return;}
const sb = getSupabase();
const { data: session} = await sb.auth.getSession();
setIsReader(!!session.session);
const { data} = await sb.from("applications").select("*").eq("id", params.id).maybeSingle();
setApp((data as Application)?? null);
const { data: ms} = await sb.from("messages").select("*").eq("application_id", params.id).order("created_at", { ascending: true});
setMessages((ms as Message[])?? []);
const { data: rd} = await sb.from("readings").select("*").eq("application_id", params.id).order("created_at", { ascending: false}).limit(1);
setReading(rd && rd.length? (rd[0] as Reading): null);
const { data: fb} = await sb.from("feedback").select("*").eq("application_id", params.id).limit(1);
setFeedback(fb && fb.length? (fb[0] as Feedback): null);
setLoading(false);
}, [params.id]);

useEffect(() => { load();}, [load]);

const completed = app?.status === "completed" ||!!feedback;
const locked = completed || preview;

async function sendMessage(e: React.FormEvent) {
e.preventDefault(); if (!draft.trim() || locked) return;
const sb = getSupabase();
const sender = isReader? "reader": "client";
const { error} = await sb.from("messages").insert({ application_id: params.id, sender, body: draft.trim()});
if (!error) { setDraft(""); load();}
}

async function sendFeedback(e: React.FormEvent) {
e.preventDefault(); if (!fbDraft.trim() || locked) return;
const sb = getSupabase();
const { error} = await sb.from("feedback").insert({ application_id: params.id, body: fbDraft.trim()});
if (error) { setNotice("感想の送信に失敗しました。"); return;}
// 感想と同文面をメッセージにも届ける → 案件完了・ロック
await sb.from("messages").insert({ application_id: params.id, sender: "client", body: `\n${fbDraft.trim()}`});
await sb.from("applications").update({ status: "completed"}).eq("id", params.id);
setFbDraft(""); setNotice("感想をありがとうございました。この鑑定は完了となりました。"); load();
}

if (loading) return <div className="container"><p>読み込み中…</p></div>;
if (!isSupabaseConfigured()) return <div className="container"><p>（デモ表示）Supabase未接続のため鑑定ルームは表示できません。セットアップ後に利用できます。</p><Link href="/">← ホームへ</Link></div>;
if (!app) return <div className="container"><p>鑑定ルームが見つかりませんでした。</p><Link href="/">← ホームへ</Link></div>;

return (
<div className="container">
<h1 style={{ color: "var(--navy)", fontSize: 24}}>鑑定ルーム ― {app.applicant_name} さん</h1>
<p>ご相談内容：</p><div className="card" style={{ whiteSpace: "pre-line"}}>{app.consultation}</div>
{isReader &&!preview? (
<div className="card" style={{ background: "#fbf4de"}}>
<strong>占い師ビュー：</strong> ここは よみ さん専用の表示です。
<Link className="btn btn-outline" style={{ marginLeft: 10}} href={`/rooms/${app.id}?preview=1`}>相談者側の見え方を確認する（プレビュー）</Link>
</div>
): null}
{preview? <div className="card" style={{ background: "#eef2fb"}}>プレビュー表示中です。入力・送信はできません。<Link href={`/rooms/${app.id}`}> 占い師ビューに戻る</Link></div>: null}
{reading? <p><a className="btn btn-navy" href="#feedback">感想はこちらから →</a></p>: null}
{notice? <p className="card" style={{ background: "#f0fdf4"}}>{notice}</p>: null}

<h2 style={{ color: "var(--navy)"}}>メッセージ</h2>
<div>
{messages.length === 0? <p>まだメッセージはありません。</p>: messages.map((m) => (
<div key={m.id} className={`msg ${m.sender}`}>{m.sender === "reader"? "よみ： ": m.sender === "client"? "あなた： ": ""}{m.body}</div>
))}
</div>
{locked? <p className="lock-note">{completed? "この鑑定は完了しました。メッセージの送信はできません。": "プレビュー中のため送信できません。"}</p>: (
<form onSubmit={sendMessage}>
<textarea className="input" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="メッセージを入力" />
<button className="btn" type="submit">送信する</button>
</form>
)}

{reading? (<><h2 style={{ color: "var(--navy)", marginTop: 28}}>鑑定書</h2><ReadingDocument reading={reading} /></>): (
isReader &&!preview? <p>まだ鑑定書は送信されていません。下のフォームから作成できます。</p>: <p>鑑定書はまだ届いていません。お届けまで3日〜1週間ほどお待ちください。</p>
)}

{isReader &&!preview &&!reading &&!completed? (
<ReadingForm applicationId={app.id} consultation={app.consultation} onSent={load} />
): null}
{isReader && reading &&!completed? <p className="lock-note">鑑定書は送信済みです（再編集はできません）。</p>: null}

<section id="feedback" className="card" style={{ marginTop: 24}}>
<h3>鑑定の感想を送る（フィードバック）</h3>
{feedback? (<><p>いただいた感想：</p><p style={{ whiteSpace: "pre-line"}}>{feedback.body}</p><p className="lock-note">感想を送信済みのため、この鑑定は完了しました。</p></>)
:!reading? <p>鑑定書が届いたら、こちらから感想を送れます。</p>
: locked &&!isReader? <p className="lock-note">送信できません。</p>
: isReader? <p>相談者からの感想はまだ届いていません。感想が届くと案件は「完了（感想あり）」になります。</p>
: (
<form onSubmit={sendFeedback}>
<textarea className="input" rows={5} value={fbDraft} onChange={(e) => setFbDraft(e.target.value)} required placeholder="鑑定の感想をお聞かせください" />
<p style={{ fontSize: 13}}>送信すると感想と同じ文面がメッセージにも届き、この鑑定は完了となります。完了後はメッセージ・感想の追加はできません。</p>
<button className="btn" type="submit">感想を送る</button>
</form>
)}
</section>
<p><Link href="/">← ホームへ</Link> ／ <Link href="/mypage">マイページ（占い師用）</Link></p>
</div>
);
}
