export const resumeData = {
  systemInfo: {
    status: "ONLINE",
    uptime: "6 YEARS",
    role: "Backend Lead / Technical Project Manager",
    location: "Kaohsiung, Taiwan",
    email: "contact.6tone@gmail.com",
    github: "github.com/6tone"
  },
  overview: {
    title: "系統簡介 (System Overview)",
    summary: "6 年後端工程與技術專案管理 (TPM) 經驗，專注於 Node.js 與 C++ 分佈式伺服器開發、即時長連線維護與 AWS/DevOps 自動化部署。具備跨職能遠端團隊協調與技術規格審查經驗，協助將業務需求轉換為可水平擴展之服務架構。"
  },
  skills: {
    title: "技術規格表 (Technical Specifications)",
    categories: [
      {
        name: "Programming Languages (程式語言)",
        items: ["JavaScript (ES6+)", "C++ (11/14)", "SQL"]
      },
      {
        name: "Frameworks & Engines (後端框架與引擎)",
        items: ["Node.js", "Pomelo.js (分佈式遊戲伺服器)", "Express.js", "Vue.js", "React", "EJS"]
      },
      {
        name: "Databases & Cache (資料庫與快取)",
        items: ["MongoDB (Aggregation Pipeline, 原子操作)", "MySQL", "MSSQL", "Redis (Session, Cache, Queue)"]
      },
      {
        name: "DevOps & Cloud (雲端與維運)",
        items: ["AWS (EC2, S3, CloudFront, CloudWatch)", "Docker", "PM2 (Process Management)", "Jenkins (CI/CD)", "GitLab CI/CD", "Git Flow", "Jira"]
      },
      {
        name: "Security & Integrations (安全機制與外部整合)",
        items: ["OAuth 2.0 / OIDC (Google, Apple, Facebook)", "IAP In-App Purchase (雙平台內購收據驗證)", "Webhook Idempotency (冪等性交易防重入)"]
      },
      {
        name: "Engineering Methodology (工程方法論)",
        items: ["OOP Domain Modeling (物件導向領域建模)", "Separation of Concerns (關注點分離)", "Prompt Engineering & AI Agent Workflow Design", "RESTful API Design", "Postman (API 測試)", "Unit Testing (單元測試)", "Agile / Scrum"]
      }
    ]
  },
  experience: {
    title: "執行紀錄 (Execution History)",
    jobs: [
      {
        company: "獨立接案 / 技術顧問 (Freelance / Technical Consultant)",
        role: "技術專案經理 (TPM) / 資深後端顧問",
        period: "2024.02 - 至今",
        techStack: "Node.js (Express) / Pomelo.js / Redis / PostgreSQL / MongoDB / Docker / AWS / Jenkins (CI/CD)",
        bullets: [
          "擔任 TPM 協調美術、企劃、前後端等全遠端外包團隊，主導多人線上遊戲平台的技術選型與架構設計，並透過 Jenkins 建置 CI/CD 自動化部署流程，於時程與預算限制下完成專案交付。",
          "基於 Express 與 MongoDB 開發自研遊戲組件，設計單點登入 (SSO) 身分驗證機制並集成至合作平台，縮短對接時程。",
          "使用 Node.js 開發即時數據爬蟲與聚合計算引擎，實作監控水位之自動化避險交易系統，透過 Docker 部署減少人工操作時間差，降低資金曝險。",
          "擔任技術審查窗口，審核委外平台之系統設計、資料庫 Schema 及時程合理性，協助業主優化開發成本與時程。"
        ]
      },
      {
        company: "盛欣網絡 (Shengxin Network)",
        role: "後端工程師 ➔ 後端組長",
        period: "2020.01 - 2024.02",
        techStack: "Node.js (Express) / C++ / Redis / MySQL / MSSQL / MongoDB / React / GitLab CI/CD",
        bullets: [
          "實作 OAuth 2.0 與 OIDC 第三方登入，串接 App Store/Google Play 內購與第三方金流，設計防重放攻擊 (Replay Attack) 與動態環境路由，建立自動化對帳與異常退款處理機制。",
          "採用 Pomelo.js 拆分 Connector 與 Game 節點，設計無狀態伺服器架構（將玩家狀態外置於 Redis），支援高併發連線與水平擴展。",
          "招募並指導網頁工程師建立團隊，以 React 開發管理後台，並串接銀行虛擬帳號 API 實作自動化對帳，減少人工作業時間與對帳誤差。",
          "接管無文檔之 Cocos2d / C++ / MSSQL 伺服器，使用 C++ 實作核心業務邏輯運算與即時資料校驗機制，完成業務模組擴展。"
        ],
        links: [
          { label: "盛欣官網 (上線中)", platform: "web", url: "https://www.shengxingamers.com/" },
          { label: "鬥陣江湖 (Android)", platform: "android", url: "https://play.google.com/store/apps/details?id=com.shengxin.dzxq&hl=zh_TW" },
          { label: "鬥陣歡樂城 (Android)", platform: "android", url: "https://play.google.com/store/apps/details?id=com.douzhen.twmj&hl=zh_TW" },
          { label: "鬥陣歡樂城 (iOS)", platform: "ios", url: "https://apps.apple.com/tw/app/%E9%AC%A5%E9%99%A3%E6%AD%A1%E6%A8%82%E5%9F%8E/id1440011538" }
        ]
      }
    ]
  },
  automationTools: {
    title: "自動化與輔助系統",
    tools: [
      {
        name: "多平台帳務爬蟲與記帳系統",
        desc: "使用 Node.js 爬蟲與 Cron Job 定期抓取交易日誌，經資料清洗後匯入 MongoDB 進行自動化彙整，降低人工對帳成本。"
      },
      {
        name: "多策略自動化交易引擎",
        desc: "解析 WebSocket 協定進行即時數據串流擷取，實作勝率評估演算法並自動觸發交易；採用 Promise Pool 管理多帳號非同步任務，並使用 pkg 打包為跨平台獨立執行檔。"
      }
    ]
  }
};
