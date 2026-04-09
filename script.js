const roadmapByLevel = {
  beginner: [
    "理解 Cyber Kill Chain 的目的：把攻擊拆成可防守的步驟。",
    "認識七個階段：Recon → Weaponization → Delivery → Exploitation → Installation → C2 → Actions on Objectives。",
    "學會最基本的防禦概念：最小權限、修補漏洞、多因子驗證、備份。"
  ],
  intermediate: [
    "將七階段對應到監控資料：Email Gateway、EDR、DNS、Proxy、SIEM。",
    "建立偵測規則：可疑附件、異常 PowerShell、可疑 C2 流量、橫向移動跡象。",
    "設計事件回應流程：分級、隔離、鑑識、復原、通報。"
  ],
  advanced: [
    "用 ATT&CK Technique 對應 Kill Chain，補足細節與紫隊演練情境。",
    "導入 Threat Intelligence：將 IOC/TTP 與告警做關聯，提高偵測信噪比。",
    "建立量化指標：MTTD、MTTR、阻斷率、模擬演練覆蓋率，持續改善防禦。"
  ]
};

const phases = [
  {
    name: "1. Reconnaissance",
    attacker: "蒐集目標資訊（員工名單、技術堆疊、外網資產、供應鏈關係）。",
    signals: ["大量探測掃描", "公開資訊蒐集痕跡", "針對特定員工社工前置活動"],
    defense: ["外部攻擊面管理", "OSINT 監測", "安全意識訓練"]
  },
  {
    name: "2. Weaponization",
    attacker: "將惡意程式與利用手法組合成可投遞武器。",
    signals: ["惡意樣本家族更新", "新漏洞利用鏈流出"],
    defense: ["威脅情資訂閱", "沙箱分析", "漏洞管理前移"]
  },
  {
    name: "3. Delivery",
    attacker: "透過釣魚郵件、惡意連結、供應鏈更新等方式送達。",
    signals: ["惡意附件", "異常下載", "可疑更新來源"],
    defense: ["郵件與Web閘道", "URL重寫與掃描", "軟體簽章與來源驗證"]
  },
  {
    name: "4. Exploitation",
    attacker: "觸發漏洞或社工行為取得初始執行。",
    signals: ["程序異常鏈", "漏洞利用特徵", "權限提升嘗試"],
    defense: ["快速修補", "攻擊面縮減", "應用程式防護"]
  },
  {
    name: "5. Installation",
    attacker: "部署後門、排程、持久化機制。",
    signals: ["新服務/排程任務", "啟動項目異常", "檔案完整性改變"],
    defense: ["EDR 持續監控", "白名單執行控制", "主機硬化"]
  },
  {
    name: "6. Command & Control",
    attacker: "建立遠端控制通道，等待下達指令。",
    signals: ["可疑 DNS beaconing", "非常見對外連線", "加密隧道異常"],
    defense: ["出口流量管控", "DNS 安全策略", "網路分段"]
  },
  {
    name: "7. Actions on Objectives",
    attacker: "資料竊取、勒索加密、破壞營運。",
    signals: ["大規模檔案讀取/壓縮", "敏感資料外傳", "橫向移動與域控存取"],
    defense: ["DLP", "零信任存取", "離線備份與復原演練"]
  }
];

const cases = [
  {
    title: "SolarWinds 供應鏈事件（2020）",
    type: "supply-chain",
    summary:
      "攻擊者透過供應鏈植入，讓受害者在合法更新流程中中招，展現 Delivery 與 C2 階段的隱蔽性。",
    chainFocus: ["Delivery", "Installation", "C2"],
    link: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
  },
  {
    title: "Colonial Pipeline 勒索事件（2021）",
    type: "ransomware",
    summary:
      "勒索軟體造成關鍵基礎設施營運中斷，顯示初始入侵後到 Actions on Objectives 的速度可非常快。",
    chainFocus: ["Exploitation", "Installation", "Actions on Objectives"],
    link: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside"
  },
  {
    title: "Equifax 資料外洩（2017）",
    type: "data-breach",
    summary:
      "未即時修補已知漏洞導致大規模個資外洩，突顯 Exploitation 階段的修補時效關鍵性。",
    chainFocus: ["Reconnaissance", "Exploitation", "Actions on Objectives"],
    link: "https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement"
  }
];

const quiz = [
  {
    q: "下列哪一項最能在 Delivery 階段前就降低風險？",
    choices: ["只做災難復原演練", "建立郵件過濾與連結沙箱", "關閉所有日誌"],
    answer: 1,
    explain: "Delivery 常透過郵件/連結觸發，前置攔截可顯著減少進入點。"
  },
  {
    q: "若你觀察到固定間隔對外 DNS 查詢，很可能對應哪個階段？",
    choices: ["Reconnaissance", "Command & Control", "Weaponization"],
    answer: 1,
    explain: "規律 beaconing 是常見 C2 訊號。"
  }
];

const sources = [
  {
    name: "Lockheed Martin：Seven Ways to Apply the Cyber Kill Chain®",
    url: "https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/documents/cyber/Seven_Ways_to_Apply_the_Cyber_Kill_Chain_with_a_Threat_Intelligence_Platform.pdf"
  },
  {
    name: "CISA：Advanced Persistent Threat Compromise of Government Agencies, Critical Infrastructure, and Private Sector Organizations (AA20-352A)",
    url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
  },
  {
    name: "U.S. DOJ：Seizure of cryptocurrency paid to DarkSide (Colonial Pipeline case)",
    url: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside"
  },
  {
    name: "FTC：Equifax Data Breach Settlement",
    url: "https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement"
  },
  {
    name: "MITRE ATT&CK（延伸學習）",
    url: "https://attack.mitre.org/"
  },
  {
    name: "Verizon 2025 DBIR（趨勢資料）",
    url: "https://www.verizon.com/about/news/2025-data-breach-investigations-report"
  }
];

const roadmapContent = document.getElementById("roadmapContent");
const phaseGrid = document.getElementById("phaseGrid");
const phaseDetail = document.getElementById("phaseDetail");
const caseFilter = document.getElementById("caseFilter");
const caseList = document.getElementById("caseList");
const quizRoot = document.getElementById("quiz");
const sourceRoot = document.getElementById("sources");

function renderRoadmap(level) {
  roadmapContent.innerHTML = "";
  roadmapByLevel[level].forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "roadmap-item";
    div.innerHTML = `<strong>Step ${i + 1}.</strong> ${item}`;
    roadmapContent.appendChild(div);
  });
}

function renderPhaseButtons() {
  phaseGrid.innerHTML = "";
  phases.forEach((p, idx) => {
    const btn = document.createElement("button");
    btn.className = `phase-btn ${idx === 0 ? "active" : ""}`;
    btn.textContent = p.name;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".phase-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderPhaseDetail(idx);
    });
    phaseGrid.appendChild(btn);
  });
}

function renderPhaseDetail(idx) {
  const p = phases[idx];
  phaseDetail.innerHTML = `
    <h3>${p.name}</h3>
    <p><strong>攻擊者行為：</strong>${p.attacker}</p>
    <p><strong>可觀測訊號：</strong></p>
    <ul>${p.signals.map((s) => `<li>${s}</li>`).join("")}</ul>
    <p><strong>防禦重點：</strong></p>
    <ul>${p.defense.map((d) => `<li>${d}</li>`).join("")}</ul>
  `;
}

function renderCases(type = "all") {
  caseList.innerHTML = "";
  const filtered = type === "all" ? cases : cases.filter((c) => c.type === type);
  filtered.forEach((c) => {
    const el = document.createElement("article");
    el.className = "case";
    el.innerHTML = `
      <h3>${c.title}</h3>
      <div>
        <span class="tag">${c.type}</span>
        ${c.chainFocus.map((f) => `<span class="tag">${f}</span>`).join("")}
      </div>
      <p>${c.summary}</p>
      <a href="${c.link}" target="_blank" rel="noopener noreferrer">閱讀來源</a>
    `;
    caseList.appendChild(el);
  });
}

function renderQuiz() {
  quizRoot.innerHTML = "";
  quiz.forEach((item, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quiz-item";
    const question = document.createElement("p");
    question.innerHTML = `<strong>Q${idx + 1}.</strong> ${item.q}`;
    wrapper.appendChild(question);

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";

    item.choices.forEach((choice, cIdx) => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        const correct = cIdx === item.answer;
        feedback.className = `quiz-feedback ${correct ? "good" : "bad"}`;
        feedback.textContent = `${correct ? "答對了！" : "再想想"} ${item.explain}`;
      });
      wrapper.appendChild(btn);
    });

    wrapper.appendChild(feedback);
    quizRoot.appendChild(wrapper);
  });
}

function renderSources() {
  sourceRoot.innerHTML = "";
  sources.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`;
    sourceRoot.appendChild(li);
  });
}

document.querySelectorAll(".level-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".level-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderRoadmap(btn.dataset.level);
  });
});

caseFilter.addEventListener("change", (e) => renderCases(e.target.value));

renderRoadmap("beginner");
renderPhaseButtons();
renderPhaseDetail(0);
renderCases();
renderQuiz();
renderSources();
