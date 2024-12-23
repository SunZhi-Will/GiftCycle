## 聖誕交換樂

一個讓用戶分享和交換聖誕禮物圖片的平台。

## 資料庫設置 (Supabase)

1. 前往 [Supabase](https://supabase.com) 創建新專案

2. 在 SQL 編輯器中執行以下命令創建資料表：

```sql
-- 用戶表
create table users (
id uuid references auth.users primary key,
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
daily_uploads int default 0,
last_upload_date date default current_date
);
-- 禮物表
create table gifts (
id uuid default uuid_generate_v4() primary key,
user_id uuid references users(id) not null,
image_url text not null,
message text,
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
received_by uuid references users(id),
received_at timestamp with time zone
);
-- 添加 RLS 策略
alter table users enable row level security;
alter table gifts enable row level security;
-- 用戶表的訪問策略
create policy "用戶可以讀取自己的資料"
on users for select
using (auth.uid() = id);
create policy "用戶註冊時自動創建資料"
on users for insert
with check (auth.uid() = id);
-- 禮物表的訪問策略
create policy "所有人都可以讀取禮物"
on gifts for select
to authenticated
using (true);
create policy "用戶可以上傳禮物"
on gifts for insert
to authenticated
with check (auth.uid() = user_id);
create policy "用戶可以更新收到的禮物"
on gifts for update
to authenticated
using (auth.uid() = received_by);
```

3. 在專案設置中獲取以下資訊並添加到 `.env.local`：

```
NEXT_PUBLIC_IMGUR_CLIENT_ID=你的Imgur客戶端ID
NEXT_PUBLIC_SUPABASE_URL=你的Supabase專案URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名金鑰
```

## 開發環境設置

1. 安裝依賴：
bash
npm install

2. 啟動開發伺服器：
bash
npm run dev


## 技術棧

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (PostgreSQL)
- Imgur API