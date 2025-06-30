# Supabase 部落格專案

這是一個使用 Next.js 和 Supabase 建立的部落格系統，具有管理員權限控制功能。

## 🚀 已完成功能

### ✅ 第一步：專案初始化與 Supabase 設定

- [x] 使用 Next.js 15 建立專案
- [x] 整合 Supabase 客戶端和伺服器端配置
- [x] 設定身份驗證系統
- [x] 建立主頁面顯示部落格文章列表
- [x] 實作管理員權限檢查機制
- [x] 建立登入/註冊頁面
- [x] 設定 RLS (Row Level Security) SQL 腳本

## 📁 專案結構

```
my-supabase-blog/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 主頁面 (文章列表)
│   │   ├── login/page.tsx        # 登入/註冊頁面
│   │   └── auth/signout/route.ts # 登出 API
│   ├── lib/
│   │   ├── auth.ts               # 身份驗證和管理員檢查
│   │   └── supabase/             # Supabase 客戶端配置
│   └── types/
│       └── database.ts           # 資料庫類型定義
├── supabase-setup.sql            # 資料庫設定 SQL
├── SETUP.md                      # 詳細設定指南
└── .env.local                    # 環境變數配置
```

## 🔐 安全性功能

### 管理員權限控制
- 使用兩種方式檢查管理員權限：
  1. 檢查 `profiles.is_admin` 欄位
  2. 檢查使用者 email 是否與 `ADMIN_EMAIL` 環境變數相符

### Row Level Security (RLS)
- **查看文章**: 所有人都可以查看
- **新增文章**: 只有管理員可以新增
- **編輯文章**: 只有管理員可以編輯
- **刪除文章**: 只有管理員可以刪除

## 🛠️ 下一步計劃

### 待實作功能：
1. **管理員專用：新增文章功能** (`/admin/new-post`)
2. **管理員專用：刪除文章功能** (`/admin/manage-posts`)
3. **單篇文章詳情頁面** (`/posts/[id]`)
4. **部署指南** (Cloudflare Pages & Netlify)

## 🚀 快速開始

1. **設定 Supabase**：
   - 建立 Supabase 專案
   - 執行 `supabase-setup.sql` 中的 SQL 腳本
   - 更新 `.env.local` 中的環境變數

2. **啟動開發伺服器**：
   ```bash
   npm install
   npm run dev
   ```

3. **訪問應用程式**：
   - 開啟 http://localhost:3000
   - 註冊帳戶並測試功能

## 📖 詳細說明

請參閱 `SETUP.md` 檔案以獲得完整的設定指南和故障排除資訊。

---

**目前狀態**: ✅ 第一步已完成 - 基礎架構和身份驗證系統已就緒
**下一步**: 實作管理員專用的新增文章功能
