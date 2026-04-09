const roadmapByLevel = {
  beginner: [
    "理解 Cyber Kill Chain 的核心：把攻擊拆成可觀測、可阻斷的流程。",
    "認識七個階段與基本防禦：修補、MFA、備份、最小權限。",
    "會用簡單案例對應攻擊鏈，建立事件判讀習慣。"
  ],
  intermediate: [
    "把七階段對應到 EDR、SIEM、DNS、Mail Gateway 的監控資料。",
    "建立規則與劇本：釣魚攔截、異常程序鏈、可疑 C2 流量。",
    "完善事件回應流程：分級、隔離、鑑識、復原、通報。"
  ],
  advanced: [
    "將 Kill Chain 與 MITRE ATT&CK 技術層結合，做細緻映射。",
    "導入威脅情資關聯 IOC/TTP，提高告警精準度。",
    "以 MTTD、MTTR、阻斷率與演練覆蓋率持續優化防禦。"
  ]
};

const phases = [
  {
    name: "1. Reconnaissance",
    attacker: "蒐集目標資訊（外網資產、員工、供應鏈）。",
    signals: ["探測掃描", "特定對象社工前置", "公開資訊異常蒐整"],
    defense: ["攻擊面管理", "OSINT 監測", "資安意識訓練"]
  },
  {
    name: "2. Weaponization",
    attacker: "將 exploit 與惡意程式組裝為攻擊載荷。",
    signals: ["惡意樣本更新", "新漏洞利用鏈活動"],
    defense: ["情資訂閱", "惡意樣本沙箱", "漏洞治理前移"]
  },
  {
    name: "3. Delivery",
    attacker: "透過郵件、連結、供應鏈更新等方式投遞。",
    signals: ["惡意附件", "可疑連結", "異常更新來源"],
    defense: ["郵件/Web 閘道", "URL 掃描", "簽章與來源驗證"]
  },
  {
    name: "4. Exploitation",
    attacker: "利用漏洞或使用者操作取得初始執行。",
    signals: ["漏洞利用特徵", "權限提升", "程序鏈異常"],
    defense: ["高風險漏洞快速修補", "攻擊面縮減", "端點防護"]
  },
  {
    name: "5. Installation",
    attacker: "建立後門與持久化（服務、排程、啟動項）。",
    signals: ["新服務/排程", "啟動項異常", "檔案完整性改變"],
    defense: ["EDR", "白名單執行", "主機硬化"]
  },
  {
    name: "6. Command & Control",
    attacker: "建立可遠端操作的控制通道。",
    signals: ["DNS beaconing", "非常見對外連線", "隧道化流量"],
    defense: ["出口流量控制", "DNS 安全", "網路分段"]
  },
  {
    name: "7. Actions on Objectives",
    attacker: "竊資、勒索、破壞營運。",
    signals: ["大量敏感檔案讀取", "資料外傳", "橫向移動擴大"],
    defense: ["DLP", "零信任存取", "離線備份與演練"]
  }
];

const cases = [
  {
    title: "SolarWinds 供應鏈事件（2020）",
    type: "supply-chain",
    summary: "合法更新流程被濫用，凸顯 Delivery/Installation/C2 的隱蔽性。",
    chainFocus: ["Delivery", "Installation", "C2"],
    link: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
  },
  {
    title: "Colonial Pipeline 勒索事件（2021）",
    type: "ransomware",
    summary: "從入侵到營運中斷速度快，顯示早期偵測與隔離的重要性。",
    chainFocus: ["Exploitation", "Installation", "Actions on Objectives"],
    link: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside"
  },
  {
    title: "Equifax 資料外洩（2017）",
    type: "data-breach",
    summary: "已知漏洞未即時修補導致大規模個資外洩。",
    chainFocus: ["Exploitation", "Actions on Objectives"],
    link: "https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement"
  }
];

const quiz = [
  {
    q: "哪個控制最能在 Delivery 階段前降低風險？",
    choices: ["只做備份", "郵件過濾與連結沙箱", "停用所有日誌"],
    answer: 1,
    explain: "Delivery 常由郵件與連結觸發，前置攔截最有效。"
  },
  {
    q: "規律的 DNS beaconing 最可能對應哪個階段？",
    choices: ["Weaponization", "Reconnaissance", "Command & Control"],
    answer: 2,
    explain: "固定節奏對外呼叫是典型 C2 訊號。"
  }
];

const sources = [
  { name: "Lockheed Martin：Cyber Kill Chain 參考資料", url: "https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/documents/cyber/Seven_Ways_to_Apply_the_Cyber_Kill_Chain_with_a_Threat_Intelligence_Platform.pdf" },
  { name: "CISA：AA20-352A (SolarWinds)", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a" },
  { name: "U.S. DOJ：DarkSide/Colonial Pipeline seizure", url: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside" },
  { name: "FTC：Equifax Data Breach Settlement", url: "https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement" },
  { name: "MITRE ATT&CK", url: "https://attack.mitre.org/" },
  { name: "Verizon 2025 DBIR", url: "https://www.verizon.com/about/news/2025-data-breach-investigations-report" }
];

const modules = ["roadmap", "phases", "cases", "quiz", "sources"];
let currentModuleIndex = 0;

const roadmapContent = document.getElementById("roadmapContent");
const phaseGrid = document.getElementById("phaseGrid");
const phaseDetail = document.getElementById("phaseDetail");
const caseFilter = document.getElementById("caseFilter");
const caseList = document.getElementById("caseList");
const quizRoot = document.getElementById("quiz");
const sourceRoot = document.getElementById("sources");
const prevModule = document.getElementById("prevModule");
const nextModule = document.getElementById("nextModule");

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
      <div>${c.chainFocus.map((f) => `<span class="tag">${f}</span>`).join("")}</div>
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
    wrapper.innerHTML = `<p><strong>Q${idx + 1}.</strong> ${item.q}</p>`;

    const feedback = document.createElement("div");

    item.choices.forEach((choice, cIdx) => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.addEventListener("click", () => {
        const correct = cIdx === item.answer;
        feedback.className = correct ? "good" : "bad";
        feedback.textContent = `${correct ? "答對了！" : "再試一次。"} ${item.explain}`;
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

function activateModule(moduleKey) {
  currentModuleIndex = modules.indexOf(moduleKey);
  document.querySelectorAll(".module").forEach((el) => el.classList.remove("active"));
  document.getElementById(`module-${moduleKey}`).classList.add("active");

  document.querySelectorAll(".module-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.module === moduleKey);
  });

  prevModule.disabled = currentModuleIndex === 0;
  nextModule.disabled = currentModuleIndex === modules.length - 1;
}

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

caseFilter.addEventListener("change", (e) => renderCases(e.target.value));

renderRoadmap("beginner");
renderPhaseButtons();
renderPhaseDetail(0);
renderCases();
renderQuiz();
renderSources();
activateModule("roadmap");
