"use client";
import { useMemo, useState } from "react";
import { POSITIONS, TAROT_CARDS, buildAiPrompt } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";
import type { ReadingPosition } from "@/lib/types";

type Pick = { card: string; orientation: "正位置" | "逆位置"; text: string };

export default function ReadingForm({ applicationId, consultation, onSent }: {
  applicationId: string; consultation: string; onSent: () => void;
}) {
  const [picks, setPicks] = useState<Pick[]>(POSITIONS.map(() => ({ card: TAROT_CARDS[0], orientation: "正位置", text: "" })));
  const [conclusion, setConclusion] = useState(""); const [spotlight, setSpotlight] = useState("");
  const [keyMessage, setKeyMessage] = useState(""); const [finalText, setFinalText] = useState("");
  const [copied, setCopied] = useState(false); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");

  const prompt = useMemo(() => buildAiPrompt({
    consultation,
    picks: picks.map((p, i) => ({ position: `${POSITIONS[i].no}. ${POSITIONS[i].name}`, card: p.card, orientation: p.orientation })),
  }), [picks, consultation]);

  function setPick(i: number, patch: Partial<Pick>) { setPicks((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p))); }

  async function copyPrompt() {
    try { await navigator.clipboard.writeText(prompt); setCopied(true); }
    catch { setMsg("コピーできませんでした。下のテキストを手動でコピーしてください。"); }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    const sb = getSupabase();
    const positions: ReadingPosition[] = picks.map((p, i) => ({ no: POSITIONS[i].no, card: p.card, orientation: p.orientation, text: p.text }));
    const { error } = await sb.from("readings").insert({
      application_id: applicationId, positions, conclusion, spotlight, key_message: keyMessage, final_text: finalText || null,
    });
    if (!error) await sb.from("applications").update({ status: "delivered" }).eq("id", applicationId);
    setBusy(false);
    if (error) { setMsg("送信に失敗しました。"); return; }
    onSent();
  }

  return (
    <form onSubmit={send} className="card">
      <h3>鑑定書を作成する（占い師専用）</h3>
      {POSITIONS.map((pos, i) => (
        <fieldset key={pos.no} style={{ border: "1px solid var(--line)", borderRadius: 10, marginBottom: 12 }}>
          <legend>{pos.no}. {pos.name}（{pos.subtitle}）</legend>
          <label>カード
            <select className="input" value={picks[i].card} onChange={(e) => setPick(i, { card: e.target.value })}>
              {TAROT_CARDS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label style={{ marginRight: 14 }}><input type="radio" name={`o${i}`} checked={picks[i].orientation === "正位置"} onChange={() => setPick(i, { orientation: "正位置" })} /> 正位置</label>
          <label><input type="radio" name={`o${i}`} checked={picks[i].orientation === "逆位置"} onChange={() => setPick(i, { orientation: "逆位置" })} /> 逆位置</label>
          <label>このポジションの解釈<textarea className="input" rows={3} value={picks[i].text} onChange={(e) => setPick(i, { text: e.target.value })} /></label>
        </fieldset>
      ))}
      <label>全体から見た結論<textarea className="input" rows={3} value={conclusion} onChange={(e) => setConclusion(e.target.value)} required /></label>
      <label>今回の鑑定で特に注目したい3枚<textarea className="input" rows={3} value={spotlight} onChange={(e) => setSpotlight(e.target.value)} required /></label>
      <label>今回、一番伝えたいこと<textarea className="input" rows={3} value={keyMessage} onChange={(e) => setKeyMessage(e.target.value)} required /></label>
      <p>
        <button type="button" className="btn btn-outline" onClick={copyPrompt}>AI（ChatGPT）用の鑑定作成プロンプトをコピー</button>
        {copied ? <span style={{ marginLeft: 8 }}>コピーしました</span> : null}
      </p>
      <details><summary>プロンプトを手動でコピーする場合はこちら</summary>
        <textarea className="input" rows={8} readOnly value={prompt} onFocus={(e) => e.target.select()} /></details>
      <label>鑑定文（最終編集）<textarea className="input" rows={10} value={finalText} onChange={(e) => setFinalText(e.target.value)} placeholder="AIの出力を貼り付けて整えたり、追記できます。入力した場合は鑑定書にも表示されます。" /></label>
      {msg ? <p style={{ color: "#9a3412" }}>{msg}</p> : null}
      <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>鑑定書を送信する</button>
    </form>
  );
}
