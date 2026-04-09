const modules = ["roadmap", "phases", "cases", "scenario", "toolbox", "checklist", "sources"];
let currentModuleIndex = 0;

const roadmapByLevel = {
  beginner: [
    "理解 Cyber Kill Chain 七階段與防守切入點。",
    "學會辨識常見初始入侵（釣魚、弱密碼、漏洞）。",
    "建立基礎防禦：MFA、修補、備份、最小權限。"
  ],
  intermediate: [
    "把階段對應到實際監控資料：EDR、SIEM、DNS、郵件閘道。",
    "建立告警劇本：異常 PowerShell、可疑 C2、橫向移動。",
    "把事件回應流程制度化：分級、隔離、鑑識、復原。"
  ],
  advanced: [
    "將 Kill Chain 與 MITRE ATT&CK 技術編號做映射。",
    "導入威脅情資關聯 IOC/TTP，提升告警精準度。",
    "用 MTTD/MTTR 與演練覆蓋率做量化優化。"
  ]
};

const phaseData = [
  {
    key: "recon",
    short: "Recon",
    title: "1. Reconnaissance",
    attacker: "蒐集資產、員工與供應鏈資訊，建立攻擊目標地圖。",
    signals: ["公開資產探測流量", "特定人員社工前置接觸", "大量子網域枚舉"],
    defense: ["外部攻擊面管理（EASM）", "威脅情報監看", "員工社工演練"],
    attack: ["T1595 Active Scanning", "T1598 Phishing for Information"],
    nist: "NIST CSF 2.0：Identify / Govern",
    cis: "CIS Controls v8：1, 2, 14"
  },
  {
    key: "weapon",
    short: "Weapon",
    title: "2. Weaponization",
    attacker: "組裝惡意程式與漏洞利用鏈，準備投遞載荷。",
    signals: ["惡意樣本家族活躍", "新 CVE 利用 PoC 擴散"],
    defense: ["漏洞優先級管理", "沙箱與惡意樣本分析"],
    attack: ["T1587 Develop Capabilities", "T1203 Exploitation for Client Execution"],
    nist: "NIST CSF 2.0：Identify / Protect",
    cis: "CIS Controls v8：7, 16"
  },
  {
    key: "delivery",
    short: "Delivery",
    title: "3. Delivery",
    attacker: "透過釣魚郵件、惡意連結或供應鏈更新進入目標。",
    signals: ["惡意附件攔截", "URL 重新導向異常", "更新來源簽章異常"],
    defense: ["郵件安全閘道", "URL Sandbox", "軟體來源簽章驗證"],
    attack: ["T1566 Phishing", "T1195 Supply Chain Compromise"],
    nist: "NIST CSF 2.0：Protect / Detect",
    cis: "CIS Controls v8：9, 10"
  },
  {
    key: "exploit",
    short: "Exploit",
    title: "4. Exploitation",
    attacker: "利用漏洞或帳密弱點，取得初始執行與提升權限。",
    signals: ["可疑程序鏈", "特權提升事件", "WAF/IPS 利用警報"],
    defense: ["高風險漏洞快速修補", "零信任存取", "應用程式防護"],
    attack: ["T1068 Exploitation for Privilege Escalation", "T1110 Brute Force"],
    nist: "NIST CSF 2.0：Protect / Detect",
    cis: "CIS Controls v8：4, 5, 6"
  },
  {
    key: "install",
    short: "Install",
    title: "5. Installation",
    attacker: "建立持久化（服務、排程、啟動項）與後門。",
    signals: ["新排程任務", "可疑自啟動鍵", "EDR 持久化告警"],
    defense: ["端點偵測與回應（EDR）", "應用白名單", "主機硬化"],
    attack: ["T1053 Scheduled Task/Job", "T1547 Boot or Logon Autostart Execution"],
    nist: "NIST CSF 2.0：Detect / Protect",
    cis: "CIS Controls v8：2, 8"
  },
  {
    key: "c2",
    short: "C2",
    title: "6. Command & Control",
    attacker: "建立對外控制通道，長期下發命令與回傳資訊。",
    signals: ["固定週期 DNS beaconing", "不尋常海外連線", "隧道化流量"],
    defense: ["Egress Filtering", "DNS 安全策略", "網路分段"],
    attack: ["T1071 Application Layer Protocol", "T1573 Encrypted Channel"],
    nist: "NIST CSF 2.0：Detect / Respond",
    cis: "CIS Controls v8：13"
  },
  {
    key: "actions",
    short: "Actions",
    title: "7. Actions on Objectives",
    attacker: "完成目標：資料外洩、勒索加密、破壞營運。",
    signals: ["大量敏感資料壓縮讀取", "資料外傳", "大規模加密行為"],
    defense: ["DLP", "離線備份", "事件應變與復原演練"],
    attack: ["T1486 Data Encrypted for Impact", "T1041 Exfiltration Over C2 Channel"],
    nist: "NIST CSF 2.0：Respond / Recover",
    cis: "CIS Controls v8：11, 12, 17"
  }
];

const caseStudies = [
  {
    title: "SolarWinds 供應鏈事件（2020）",
    type: "supply-chain",
    storyline: [
      "攻擊者先入侵供應商建置流程（Delivery 前置）。",
      "惡意程式隨合法更新發送到客戶端（Delivery/Installation）。",
      "受害環境建立隱蔽 C2 通道並橫向移動（C2/Actions）。"
    ],
    timeline: ["Delivery", "Installation", "C2", "Actions on Objectives"],
    ioc: ["可疑 SUNBURST DNS 網域查詢", "異常程序父子鏈", "非常見雲端管理 API 呼叫"],
    link: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
  },
  {
    title: "Colonial Pipeline 勒索事件（2021）",
    type: "ransomware",
    storyline: [
      "攻擊者利用帳號存取進入企業網路（Exploitation）。",
      "部署勒索工具與橫向移動（Installation/C2）。",
      "最終造成業務中斷與勒索壓力（Actions on Objectives）。"
    ],
    timeline: ["Exploitation", "Installation", "C2", "Actions on Objectives"],
    ioc: ["VPN 異常登入", "可疑勒索工具執行", "大規模檔案加密行為"],
    link: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside"
  },
  {
    title: "Equifax 資料外洩（2017）",
    type: "data-breach",
    storyline: [
      "外部服務存在已知漏洞且修補延遲（Exploitation）。",
      "攻擊者長時間滯留並查找高價值資料（Installation/C2）。",
      "最終外洩大量個資（Actions on Objectives）。"
    ],
    timeline: ["Exploitation", "Installation", "C2", "Actions on Objectives"],
    ioc: ["WAF 告警對應漏洞利用", "資料庫異常查詢量", "大量敏感資料傳輸"],
    link: "https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement"
  }
];

const scenarioOrder = ["Reconnaissance", "Delivery", "Installation", "Actions on Objectives"];
let scenarioCards = [
  "安裝後門並建立排程工作",
  "蒐集目標員工與資產資訊",
  "發送含惡意連結的釣魚郵件",
  "加密檔案並要求贖金"
];

const tools = [
  { name: "MFA", covers: ["Exploitation"] },
  { name: "EDR", covers: ["Installation", "C2"] },
  { name: "Email Security Gateway", covers: ["Delivery"] },
  { name: "DNS Security", covers: ["C2"] },
  { name: "Offline Backup", covers: ["Actions on Objectives"] },
  { name: "Vulnerability Management", covers: ["Weaponization", "Exploitation"] },
  { name: "EASM", covers: ["Reconnaissance"] }
];

const maturityChecklist = [
  { stage: "Reconnaissance", item: "每月盤點外部攻擊面（網域、IP、暴露服務）", priority: "高" },
  { stage: "Delivery", item: "郵件閘道啟用惡意連結重寫與附件沙箱", priority: "高" },
  { stage: "Exploitation", item: "高風險漏洞（CVSS 9+）在 7 天內完成修補", priority: "高" },
  { stage: "Installation", item: "伺服器與端點都已部署 EDR 並開啟告警回傳", priority: "高" },
  { stage: "Command & Control", item: "對外連線啟用白名單或地理封鎖策略", priority: "中" },
  { stage: "Actions on Objectives", item: "關鍵系統備份可離線保存並定期還原演練", priority: "高" },
  { stage: "Respond / Recover", item: "事件通報、隔離、復原流程每季至少演練一次", priority: "中" }
];

const sources = [
  { name: "Lockheed Martin：Cyber Kill Chain 白皮書", url: "https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/documents/cyber/Seven_Ways_to_Apply_the_Cyber_Kill_Chain_with_a_Threat_Intelligence_Platform.pdf" },
  { name: "MITRE ATT&CK", url: "https://attack.mitre.org/" },
  { name: "NIST CSF 2.0", url: "https://www.nist.gov/cyberframework" },
  { name: "CIS Controls v8", url: "https://www.cisecurity.org/controls/v8" },
  { name: "CISA AA20-352A", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a" },
  { name: "DOJ Colonial Pipeline", url: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside" },
  { name: "FTC Equifax Settlement", url: "https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement" }
];

const roadmapContent = document.getElementById("roadmapContent");
const caseFilter = document.getElementById("caseFilter");
const caseList = document.getElementById("caseList");
const sourcesRoot = document.getElementById("sources");
const prevModule = document.getElementById("prevModule");
const nextModule = document.getElementById("nextModule");
const phaseCards = document.getElementById("phaseCards");
const chainSvgNav = document.getElementById("chainSvgNav");
const scenarioList = document.getElementById("scenarioList");
const scenarioFeedback = document.getElementById("scenarioFeedback");
const toolboxForm = document.getElementById("toolboxForm");
const toolboxResult = document.getElementById("toolboxResult");
const checklistRoot = document.getElementById("checklistRoot");
const checklistSummary = document.getElementById("checklistSummary");
const progressTracker = document.getElementById("progressTracker");
const themeToggle = document.getElementById("themeToggle");

function renderRoadmap(level) {
  roadmapContent.innerHTML = "";
  roadmapByLevel[level].forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "roadmap-item";
    div.innerHTML = `<strong>Step ${i + 1}.</strong> ${s}`;
    roadmapContent.appendChild(div);
  });
}

function renderProgress(activeIndex = 0) {
  progressTracker.innerHTML = "";
  phaseData.forEach((p, idx) => {
    const dot = document.createElement("div");
    dot.className = `phase-dot ${idx <= activeIndex ? "active" : ""}`;
    dot.textContent = p.short;
    progressTracker.appendChild(dot);
  });
}

function renderPhaseModule() {
  chainSvgNav.innerHTML = "";
  phaseCards.innerHTML = "";

  phaseData.forEach((phase, idx) => {
    const link = document.createElement("button");
    link.className = "phase-link";
    link.textContent = `${idx + 1}. ${phase.short}`;
    link.addEventListener("click", () => {
      document.getElementById(`phase-${phase.key}`).scrollIntoView({ behavior: "smooth", block: "start" });
      renderProgress(idx);
    });
    chainSvgNav.appendChild(link);

    const card = document.createElement("article");
    card.className = "phase-card";
    card.id = `phase-${phase.key}`;
    card.innerHTML = `
      <h3>${phase.title}</h3>
      <p><strong>攻擊者行為：</strong>${phase.attacker}</p>
      <p><strong>可觀測訊號：</strong>${phase.signals.map((x) => `<span class="tag">${x}</span>`).join(" ")}</p>
      <p><strong>防禦建議：</strong>${phase.defense.map((x) => `<span class="tag">${x}</span>`).join(" ")}</p>
      <div class="mappings">
        <div class="map-box">
          <strong>MITRE ATT&CK 對照</strong>
          <p>${phase.attack.map((x) => `<span class="tag">${x}</span>`).join(" ")}</p>
        </div>
        <div class="map-box">
          <strong>防禦矩陣</strong>
          <p>${phase.nist}</p>
          <p>${phase.cis}</p>
        </div>
      </div>
    `;
    phaseCards.appendChild(card);
  });
}

function renderCases(type = "all") {
  caseList.innerHTML = "";
  const filtered = type === "all" ? caseStudies : caseStudies.filter((c) => c.type === type);
  filtered.forEach((c) => {
    const el = document.createElement("article");
    el.className = "case";
    el.innerHTML = `
      <h3>${c.title}</h3>
      <p><strong>故事線（Attack Storyline）</strong></p>
      <ol class="storyline">${c.storyline.map((s) => `<li>${s}</li>`).join("")}</ol>
      <p><strong>Kill Chain 時點：</strong>${c.timeline.map((t) => `<span class="tag">${t}</span>`).join(" ")}</p>
      <p><strong>IOC 範例：</strong></p>
      <ul class="ioc-list">${c.ioc.map((i) => `<li>${i}</li>`).join("")}</ul>
      <a href="${c.link}" target="_blank" rel="noopener noreferrer">來源連結</a>
    `;
    caseList.appendChild(el);
  });
}

function renderScenario() {
  scenarioList.innerHTML = "";
  scenarioCards.forEach((cardText) => {
    const li = document.createElement("li");
    li.className = "scenario-item";
    li.draggable = true;
    li.textContent = cardText;

    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => li.classList.remove("dragging"));

    scenarioList.appendChild(li);
  });
}

scenarioList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const siblings = [...scenarioList.querySelectorAll(".scenario-item:not(.dragging)")];
  const next = siblings.find((s) => e.clientY <= s.offsetTop + s.offsetHeight / 2);
  if (next) scenarioList.insertBefore(dragging, next);
  else scenarioList.appendChild(dragging);
});

document.getElementById("checkScenario").addEventListener("click", () => {
  const current = [...scenarioList.querySelectorAll(".scenario-item")].map((i) => i.textContent);
  const normalized = {
    "蒐集目標員工與資產資訊": "Reconnaissance",
    "發送含惡意連結的釣魚郵件": "Delivery",
    "安裝後門並建立排程工作": "Installation",
    "加密檔案並要求贖金": "Actions on Objectives"
  };
  const mapped = current.map((c) => normalized[c]);
  const ok = JSON.stringify(mapped) === JSON.stringify(scenarioOrder);
  scenarioFeedback.textContent = ok
    ? "✅ 排序正確！你已掌握基本攻擊順序。"
    : "❌ 尚未正確，提示：先偵查，再投遞，再安裝，最後達成目的。";
});

function renderToolbox() {
  toolboxForm.innerHTML = "";
  tools.forEach((t) => {
    const label = document.createElement("label");
    label.className = "toolbox-option";
    label.innerHTML = `<input type="checkbox" value="${t.name}"> ${t.name}`;
    toolboxForm.appendChild(label);
  });

  toolboxForm.addEventListener("change", () => {
    const selected = [...toolboxForm.querySelectorAll("input:checked")].map((i) => i.value);
    const covered = new Set();
    tools.filter((t) => selected.includes(t.name)).forEach((t) => t.covers.forEach((c) => covered.add(c)));

    toolboxResult.innerHTML = `
      <p><strong>已選工具：</strong>${selected.length ? selected.join("、") : "尚未選擇"}</p>
      <div class="coverage">${[...covered].map((c) => `<span class="tag">${c}</span>`).join("") || "<span class='tag'>目前無覆蓋</span>"}</div>
    `;
  });
}

function renderChecklist() {
  checklistRoot.innerHTML = "";
  const storageKey = "ckc-checklist";
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

  maturityChecklist.forEach((entry, idx) => {
    const row = document.createElement("label");
    row.className = "checklist-item";
    row.innerHTML = `
      <input type="checkbox" data-id="${idx}" ${saved.includes(idx) ? "checked" : ""}>
      <span>
        <strong>[${entry.priority}] ${entry.stage}</strong><br>
        ${entry.item}
      </span>
    `;
    checklistRoot.appendChild(row);
  });

  function updateSummary() {
    const checked = [...checklistRoot.querySelectorAll("input:checked")].map((el) => Number(el.dataset.id));
    localStorage.setItem(storageKey, JSON.stringify(checked));
    const ratio = Math.round((checked.length / maturityChecklist.length) * 100);
    const hint = ratio < 40
      ? "先完成高優先項目（[高]）可快速降低風險。"
      : ratio < 80
        ? "已具備基礎防禦，建議補齊 C2 偵測與復原演練。"
        : "成熟度良好，建議持續透過演練優化 MTTD/MTTR。";

    checklistSummary.innerHTML = `
      <p><strong>完成率：</strong>${checked.length}/${maturityChecklist.length}（${ratio}%）</p>
      <p>${hint}</p>
    `;
  }

  checklistRoot.addEventListener("change", updateSummary);
  updateSummary();
}

function renderSources() {
  sourcesRoot.innerHTML = "";
  sources.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`;
    sourcesRoot.appendChild(li);
  });
}

function activateModule(moduleKey) {
  currentModuleIndex = modules.indexOf(moduleKey);
  document.querySelectorAll(".module").forEach((m) => m.classList.remove("active"));
  document.getElementById(`module-${moduleKey}`).classList.add("active");

  document.querySelectorAll(".module-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.module === moduleKey);
  });

  prevModule.disabled = currentModuleIndex === 0;
  nextModule.disabled = currentModuleIndex === modules.length - 1;
}

function applyTheme(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  themeToggle.textContent = mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("ckc-theme", mode);
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
});

const savedTheme = localStorage.getItem("ckc-theme") || "dark";
applyTheme(savedTheme);

caseFilter.addEventListener("change", (e) => renderCases(e.target.value));

document.querySelectorAll(".module-btn").forEach((btn) => {
  btn.addEventListener("click", () => activateModule(btn.dataset.module));
});

document.querySelectorAll(".level-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".level-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderRoadmap(btn.dataset.level);
  });
});

prevModule.addEventListener("click", () => {
  if (currentModuleIndex > 0) activateModule(modules[currentModuleIndex - 1]);
});
nextModule.addEventListener("click", () => {
  if (currentModuleIndex < modules.length - 1) activateModule(modules[currentModuleIndex + 1]);
});

renderRoadmap("beginner");
renderProgress(0);
renderPhaseModule();
renderCases();
renderScenario();
renderToolbox();
renderChecklist();
renderSources();
activateModule("roadmap");
