import "./globals.css";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { SITE_NAME } from "@/lib/constants";
export const metadata = {
  title: `${SITE_NAME} | ケルト十字11枚・文面鑑定（無料モニター募集中）`,
  description: "11枚のケルト十字で丁寧に読み解く文面鑑定。ただいま無料モニター募集中。",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja"><body>
      <header className="header">
        <Link href="/" aria-label="ホームへ"><Wordmark /></Link>
        <nav>
          <Link href="/">ホーム</Link>
          <Link href="/listings">募集一覧</Link>
          <Link href="/mypage">マイページ</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <p><Wordmark small /></p>
        <p>ケルト十字（11枚引き）・文面鑑定 ／ 無料モニター募集中</p>
        <p>© {SITE_NAME}</p>
      </footer>
    </body></html>
  );
}
