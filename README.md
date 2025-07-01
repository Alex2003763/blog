# Supabase Blog Platform

一個使用 Next.js 15 和 Supabase 構建的現代化部落格平台，具備完整的內容管理系統和管理員權限控制。

## ✨ 特色功能

- 🎨 **現代化 UI/UX**
  - 響應式設計，支援所有裝置
  - 深色/淺色主題切換
  - 流暢的動畫效果

- 📝 **強大的編輯功能**
  - React Markdown 編輯器整合
  - 即時預覽
  - 語法高亮支援

- 🔐 **完整的權限管理**
  - Supabase 身份驗證
  - 管理員角色系統
  - Row Level Security (RLS)

- 🚀 **高效能架構**
  - Next.js 15 App Router
  - SSR 支援
  - 優化的資源載入

## 🛠️ 技術棧

- **前端框架**: [`Next.js 15`](https://nextjs.org/)
- **資料庫**: [`Supabase`](https://supabase.com/)
- **樣式**: [`Tailwind CSS v4`](https://tailwindcss.com/)
- **編輯器**: [`@uiw/react-md-editor`](https://github.com/uiwjs/react-md-editor)
- **認證**: [`Supabase Auth`](https://supabase.com/docs/guides/auth)
- **部署**: 支援 Vercel、Netlify、Cloudflare Pages

## 🚀 快速開始

### 環境要求

- Node.js 18+
- npm 或 yarn
- Supabase 帳號

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone <your-repo-url>
   cd my-supabase-blog
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **環境設定**
   ```bash
   cp .env.local.example .env.local
   # 編輯 .env.local 填入以下資訊：
   # NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   # ADMIN_EMAIL=your-admin-email
   ```

4. **設定 Supabase**
   - 建立 Supabase 專案
   - 執行 `supabase-setup.sql` 中的資料庫設定
   - 詳細步驟請參考 [`SETUP.md`](SETUP.md)

5. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

6. 開啟 http://localhost:3000 開始使用！

## 📚 主要功能

### 訪客功能
- 瀏覽所有文章
- 閱讀文章詳情
- 切換深色/淺色主題

### 管理員功能
- 新增/編輯/刪除文章
- 管理文章列表
- 即時預覽文章
- 檢視統計資料

詳細功能列表請參考 [`FEATURES.md`](FEATURES.md)

## 🔐 安全性設計

- **存取控制**
  - 訪客：只能查看文章
  - 管理員：完整的 CRUD 權限
  - RLS 策略確保資料安全

- **管理員驗證**
  1. 資料庫 `profiles.is_admin` 欄位
  2. 環境變數 `ADMIN_EMAIL` 配置

## 🤝 參與貢獻

1. Fork 本專案
2. 建立您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 建立 Pull Request

## 📝 版本記錄

- **v0.1.0** - 初始版本
  - 基礎部落格功能
  - 管理員系統
  - Markdown 編輯器

## 📄 授權協議

本專案採用 MIT 授權 - 詳情請見 LICENSE 檔案

## 🙏 鳴謝

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor)

---

**備註**：如需完整的設定說明和疑難排解，請參考 [`SETUP.md`](SETUP.md)
