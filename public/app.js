let tabs = [];
let currentTab = 0;

function newTab(url = "") {
  tabs.push({ url });
  currentTab = tabs.length - 1;
  renderTabs();
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
    div.innerText = t.url || "New Tab";
    div.onclick = () => switchTab(i);
    tabBar.appendChild(div);
  });
}

function go() {
  let url = document.getElementById("url").value;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  tabs[currentTab].url = url;

  saveHistory(url);
  loadPage();
  renderTabs();
}

function loadPage() {
  const frame = document.getElementById("frame");
  frame.src = "/proxy?url=" + encodeURIComponent(tabs[currentTab].url);
}

function saveHistory(url) {
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.unshift(url);
  localStorage.setItem("history", JSON.stringify(history.slice(0, 10)));
}

function showHistory() {
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  alert("History:\n" + history.join("\n"));
}

function saveBookmark() {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  bookmarks.push(tabs[currentTab].url);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function showBookmarks() {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  alert("Bookmarks:\n" + bookmarks.join("\n"));
}

// Start with one tab
newTab();
