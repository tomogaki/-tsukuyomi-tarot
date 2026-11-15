"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import PassphraseNotice from "@/components/PassphraseNotice";

export default function RoomLookup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [found, setFound] = useState<{ id: string; hasReading: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault(); setError(""); setFound(null); setBusy(true);
    try {
      if (!isSupabaseConfigured()) { setError("（デモ表示）Supabase未接続のため検索できません。セットアップ後に利用できます。"); return; }
      const sb = getSupabase();
      const { data, error: err } = await sb.from("applications")
        .select("id").eq("applicant_name", name.trim()).eq("passphrase", pass.trim())
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (err) throw err;
      if (!data) { setError("お名前と合言葉が一致する応募が見つかりませんでした。入力内容をご確認ください。"); return; }
      const { data: rd } = await sb.from("readings").select("id").eq("application_id", data.id).limit(1);
      setFound({ id: data.id as string, hasReading: !!(rd && rd.length) });
    } catch { setError("検索中にエラーが発生しました。時間をおいて再度お試しください。"); }
    finally { setBusy(false); }
  }

  return (
    <section className="card" id="room-lookup">
      <h2>🔑 応募済みの方はこちら</h2>
      <p>応募のときに登録した「お名前」と「合言葉」で、あなたの専用鑑定ルームに入れます。鑑定書の受け取りや、占い師とのやり取りはこちらからどうぞ。</p>
      <p style={{ fontSize: 14 }}>※合言葉は再発行できません。完全に忘れた場合は鑑定ルームに入れませんのでご注意ください。</p>
      <form onSubmit={search}>
        <label>お名前（ニックネーム可）<input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>合言葉<input className="input" value={pass} onChange={(e) => setPass(e.target.value)} required /></label>
        <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>鑑定ルームを探す</button>
      </form>
      {error ? <p style={{ color: "#9a3412", background: "#fff7ed", padding: 12, borderRadius: 10 }}>{error}</p> : null}
      {found ? (
        <div style={{ marginTop: 14 }}>
          <p>あなたの鑑定ルームが見つかりました。</p>
          <button className="btn btn-navy" onClick={() => router.push(`/rooms/${found.id}`)}>鑑定ルームに入る</button>
          {found.hasReading ? (
            <button className="btn" style={{ marginLeft: 8 }} onClick={() => router.push(`/rooms/${found.id}#feedback`)}>感想はこちらから →</button>
          ) : null}
        </div>
      ) : null}
      <PassphraseNotice />
    </section>
  );
}
