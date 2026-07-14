/**
 * personalInfo.js
 * 從 Vite 環境變數讀取個人私密資料。
 * 真實資料放在 .env.local（已被 gitignore），不會上傳 GitHub。
 * Vercel 部署時，請至 Vercel Dashboard > Settings > Environment Variables 填入相同欄位。
 */
export const personalInfo = {
  name:     import.meta.env.VITE_PERSONAL_NAME     || '後端工程師',
  title:    import.meta.env.VITE_PERSONAL_TITLE    || '後端工程師 / 技術專案經理 (TPM)',
  email:    import.meta.env.VITE_PERSONAL_EMAIL    || '',
  github:   import.meta.env.VITE_PERSONAL_GITHUB   || '',
  location: import.meta.env.VITE_PERSONAL_LOCATION || '',
  avatar:   import.meta.env.VITE_PERSONAL_AVATAR   || '',
};
