- つくよみタロット よみ Schema for Supabase (PostgreSQL)
-- 実行方法: Supabase ダッシュボード > SQL Editor に全文を貼り付けて Run
create extension if not exists pgcrypto;

-- 募集（メニュー）
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('恋愛','仕事','人間関係')),
  title text not null,
  description text,
  capacity int not null default 5 check (capacity >= 1),
  is_open boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 応募（お名前＋合言葉の簡易認証。合言葉は平文照合＝現行仕様踏襲。READMEの注意書き参照）
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete set null,
  applicant_name text not null,
  passphrase text not null,
  consultation text not null,
  status text not null default 'applied' check (status in ('applied','reading','delivered','completed')),
  agreed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_applications_lookup on applications (applicant_name, passphrase);
create index if not exists idx_applications_listing on applications (listing_id);

-- 1対1メッセージ（鑑定ルーム）
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  sender text not null check (sender in ('client','reader','system')),
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_app on messages (application_id, created_at);

-- 鑑定書（11ポジションを jsonb で保持 + まとめ3項目 + 鑑定文・最終編集）
create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  positions jsonb not null default '[]'::jsonb,
  -- positions の各要素: {"no":1,"card":"大アルカナ「愚者」","orientation":"正位置","text":"..."}
  conclusion text not null default '',
  spotlight text not null default '',
  key_message text not null default '',
  final_text text,
  created_at timestamptz not null default now()
);
create index if not exists idx_readings_app on readings (application_id);

-- 感想（フィードバック）。1応募につき1件。送信で案件は completed になる（アプリ側で制御＋下記トリガーで担保）
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references applications(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- 占い師プロフィール（単一行: id=1）
create table if not exists profile (
  id int primary key,
  reader_name text not null default 'よみ',
  bio text not null default '',
  updated_at timestamptz not null default now()
);
insert into profile (id, reader_name, bio) values (1, 'よみ',
'はじめまして、タロット占い師の「よみ」です。
誰にも言えないモヤモヤや、一人で抱えているお悩みを、11枚のカード（ケルト十字）を使って丁寧に紐解きます。
現在は実践経験を積むため、無料モニター様を大募集しています！初心者ではありますが、そのぶん一人ひとりのお悩みに時間をかけて、心を込めたメッセージでお返事いたします。顔出しや通話は一切ありませんので、お気軽にご相談ください。')
on conflict (id) do nothing;

-- 初期募集3件（各定員5名）
insert into listings (category, title, description, capacity, sort_order) values
('恋愛','今のまま進んでいい？気になる人とのこれからを占います','気になる人との関係の流れ、相手の気持ちの傾向、これからどう進むと良いかをケルト十字11枚で丁寧に読み解きます。',5,1),
('仕事','転職しても大丈夫？今の仕事とこれからの道を占います','今の仕事の状況、転職のタイミングや注意点、これからの道の選び方をケルト十字11枚で読み解きます。',5,2),
('人間関係','あの人との関係は良くなる？家族・友人とのこれからを占います','家族や友人との関係の現在地、すれ違いの原因、これから関係を良くするためのヒントをケルト十字11枚で読み解きます。',5,3)
on conflict do nothing;

-- ===== ロック用トリガー: 完了済み案件への追加書き込みをDB側でも拒否 =====
create or replace function reject_if_completed() returns trigger as $$
begin
  if exists (select 1 from applications where id = NEW.application_id and status = 'completed') then
    raise exception 'この鑑定は完了しているため追加できません';
  end if;
  return NEW;
end;
$$ language plpgsql;
drop trigger if exists trg_messages_lock on messages;
create trigger trg_messages_lock before insert on messages
  for each row execute function reject_if_completed();
drop trigger if exists trg_readings_lock on readings;
create trigger trg_readings_lock before insert on readings
  for each row execute function reject_if_completed();

-- ===== RLS =====
-- 方針（現行仕様踏襲）: 相談者はログインなしで「お名前＋合言葉」の完全一致でのみ自分の応募にアクセスする簡易認証。
-- そのため anon ロールに必要最小限の操作を許可し、合言葉を知らない第三者が一覧取得できないよう
-- アプリ側では必ず applicant_name + passphrase の等値条件でのみ applications を引くこと。
-- 占い師操作（募集管理・全応募閲覧・鑑定書作成）は Supabase Auth ログイン済みユーザー（authenticated）のみ。
-- 本番で厳密化する場合は Edge Function 経由の照合に切り替えてください（README参照）。
alter table listings enable row level security;
alter table applications enable row level security;
alter table messages enable row level security;
alter table readings enable row level security;
alter table feedback enable row level security;
alter table profile enable row level security;

-- listings: 全員閲覧可 / 変更はログイン済み（占い師）のみ
create policy "public read listings" on listings for select using (true);
create policy "reader insert listing" on listings for insert with check (auth.uid() is not null);
create policy "reader update listing" on listings for update using (auth.uid() is not null);
create policy "reader delete listing" on listings for delete using (auth.uid() is not null);

-- applications: 応募作成は誰でも可 / 閲覧・更新はログイン済み（占い師）
-- ※相談者のルーム再入場検索はアプリ側で name+passphrase 等値クエリのみを使う前提で select を公開しています。
--   合言葉が推測困難な文字列であることが前提です。READMEの注意書きを必ずお読みください。
create policy "public insert application" on applications for insert with check (agreed = true);
create policy "lookup application" on applications for select using (true);
create policy "reader update application" on applications for update using (auth.uid() is not null);

-- messages: ルーム参加者（アプリ側で application を特定済み）の閲覧・投稿を許可 / 完了ロックはトリガーで担保
create policy "room read messages" on messages for select using (true);
create policy "room insert message" on messages for insert with check (true);

-- readings: 閲覧はルーム参加者 / 作成はログイン済み（占い師）のみ
create policy "room read readings" on readings for select using (true);
create policy "reader insert reading" on readings for insert with check (auth.uid() is not null);

-- feedback: 閲覧・作成を許可（1応募1件は unique 制約で担保）
create policy "room read feedback" on feedback for select using (true);
create policy "room insert feedback" on feedback for insert with check (true);

-- profile: 全員閲覧可 / 更新はログイン済み（占い師）のみ
create policy "public read profile" on profile for select using (true);
create policy "reader upsert profile" on profile for insert with check (auth.uid() is not null);
create policy "reader update profile" on profile for update using (auth.uid() is not null);

-- NOTE: service_role キーは RLS をバイパスします。サーバー側でのみ使用し、絶対に公開しないでください。
