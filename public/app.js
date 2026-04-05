let tabs = [];
let currentTab = 0;

function newTab(url = "https://example.com") {
  tabs.push({ url, history: [url], index: 0 });
  currentTab = tabs.length - 1;
  renderTabs();
  loadPage();
}

function switchTab(i) {
  currentTab = i;
  renderTabs();
  loadPage();
}

function renderTabs() {
  const tabBar = document.getElementById("tabs");
  tabBar.innerHTML = "";

  tabs.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "tab" + (i === currentTab ? " active" : "");
    div.innerText = t.url.replace("https://", "").slice(0, 15);
    div.onclick = () => switchTab(i);
    tabBar.appendChild(div);
  });
}

function go() {
  let url = document.getElementById("url").value;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  let tab = tabs[currentTab];
  tab.url = url;
  tab.history.push(url);
  tab.index++;

  loadPage();
  renderTabs();
}

function loadPage() {
  const frame = document.getElementById("frame");
  frame.src = "/proxy?url=" + encodeURIComponent(tabs[currentTab].url);
}

function back() {
  let tab = tabs[currentTab];
  if (tab.index > 0) {
    tab.index--;
    tab.url = tab.history[tab.index];
    loadPage();
  }
}

function forward() {
  let tab = tabs[currentTab];
  if (tab.index < tab.history.length - 1) {
    tab.index++;
    tab.url = tab.history[tab.index];
    loadPage();
  }
}

// Start
newTab();
