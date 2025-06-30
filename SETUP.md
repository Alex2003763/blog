# Supabase 部落格設定指南

## 1. Supabase 專案設定

### 建立 Supabase 專案
1. 前往 [Supabase](https://supabase.com) 並建立新專案
2. 記下您的專案 URL 和 anon key

### 設定環境變數
1. 複製 `.env.local` 檔案並填入您的 Supabase 設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=your-admin-email@example.com
```

## 2. 資料庫設定

### 執行 SQL 腳本
1. 在 Supabase Dashboard 中，前往 "SQL Editor"
2. 複製並執行 `supabase-setup.sql` 中的所有 SQL 指令
3. 這將建立：
   - `profiles` 表格 (用於管理員權限)
   - `posts` 表格 (部落格文章)
   - RLS 政策 (安全性規則)
   - 自動建立 profile 的觸發器

### 設定管理員
有兩種方式設定管理員：

#### 方法 1: 使用環境變數 (推薦)
在 `.env.local` 中設定 `ADMIN_EMAIL`，系統會自動檢查使用者 email 是否為管理員。

#### 方法 2: 資料庫設定
1. 先註冊一個帳戶
2. 在 Supabase Dashboard 的 "Table Editor" 中找到 `profiles` 表格
3. 將該使用者的 `is_admin` 欄位設為 `true`

或執行 SQL：
```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'your-admin-email@example.com';
```

## 3. 本地開發

### 安裝依賴
```bash
cd my-supabase-blog
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```

### 測試功能
1. 訪問 http://localhost:3000
2. 註冊/登入帳戶
3. 如果是管理員，應該能看到「新增文章」和「管理文章」按鈕
4. 測試新增、查看、刪除文章功能

## 4. 安全性說明

### RLS 政策
- **查看文章**: 所有人都可以查看
- **新增文章**: 只有管理員可以新增
- **編輯文章**: 只有管理員可以編輯
- **刪除文章**: 只有管理員可以刪除
- **Profile**: 使用者只能查看和編輯自己的 profile

### 管理員檢查
系統使用兩種方式檢查管理員權限：
1. 檢查 `profiles.is_admin` 欄位
2. 檢查使用者 email 是否與 `ADMIN_EMAIL` 環境變數相符

## 5. 故障排除

### 常見問題
1. **無法連接 Supabase**: 檢查環境變數是否正確設定
2. **RLS 錯誤**: 確保已執行所有 SQL 腳本
3. **管理員權限問題**: 檢查 `profiles` 表格中的 `is_admin` 欄位或環境變數設定

### 檢查日誌
- 瀏覽器開發者工具的 Console
- Supabase Dashboard 的 Logs 頁面
- Next.js 終端輸出
