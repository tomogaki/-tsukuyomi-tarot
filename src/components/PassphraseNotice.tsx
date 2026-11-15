import { PASSPHRASE_NOTICE } from "@/lib/constants";
export default function PassphraseNotice() {
  return (
    <div className="pass-notice" role="note">
      <span aria-hidden="true">⚠ </span>
      <strong>合言葉は再発行できません。</strong>
      {PASSPHRASE_NOTICE.replace("合言葉は再発行できません。", "")}
    </div>
  );
}
