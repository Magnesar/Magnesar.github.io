const SUPABASE_URL = "https://xlaqobmretzuagcmjlun.supabase.co";
const SUPABASE_KEY = "sb_publishable_3bq8qk-mDEBpelQ1aC1t6g_qWjMc5Er";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const STORAGE_KEY = "research-life-scheduler-v2";
const LEGACY_STORAGE_KEY = "atlas-research-scheduler-v1";
const starterThemes = [
  { id: "research", name: "Research", icon: "⌘", color: "sage", description: "Questions, papers, experiments, and writing." },
  { id: "hobbies", name: "Hobbies", icon: "✦", color: "lavender", description: "Things you do simply because they make life richer." }
];
const starterTasks = [
  { id: "lit-review", themeId: "research", title: "Literature review", status: "in-progress", color: "sage", date: "2026-10-22", notes: "Synthesize the main arguments around **spatial memory** and identify the gap my work can address.\n\nWorking equation: $R = f(S, T, C)$", subtasks: [{ text: "Collect the five foundational papers", done: true }, { text: "Build an annotated bibliography", done: false }, { text: "Write the gap statement", done: false }] },
  { id: "experiment", themeId: "research", title: "Design experiment", status: "planned", color: "sun", date: "2026-10-29", notes: "Turn the research question into a falsifiable protocol. Consider a control group and a reproducible data collection plan.", subtasks: [{ text: "Define independent variables", done: false }, { text: "Draft participant protocol", done: false }] },
  { id: "conference", themeId: "research", title: "Paper work", status: "planned", color: "lavender", date: "2026-11-05", notes: "A 300-word abstract connecting the theoretical frame to the preliminary results.", subtasks: [{ text: "Choose a working title", done: false }, { text: "Draft the methods paragraph", done: false }, { text: "Ask for supervisor feedback", done: false }] },
  { id: "analysis", themeId: "research", title: "Analyse pilot data", status: "completed", color: "coral", date: "2026-10-16", notes: "Check the first pass for outliers and make a note of any assumptions.", subtasks: [{ text: "Clean the data", done: true }, { text: "Run descriptive statistics", done: true }] },
  { id: "reading", themeId: "research", title: "Read & annotate", status: "in-progress", color: "blue", date: "2026-10-19", notes: "Read the new paper on embodied cognition. Capture useful quotations and questions.", subtasks: [{ text: "Read introduction", done: true }, { text: "Annotate figures", done: false }] },
  { id: "running", themeId: "hobbies", title: "Running", status: "in-progress", color: "coral", date: "2026-10-18", notes: "Build a steady weekly rhythm and enjoy being outside.", subtasks: [{ text: "Easy 5 km run", done: true }, { text: "Stretch and recover", done: false }] },
  { id: "music", themeId: "hobbies", title: "Music", status: "planned", color: "lavender", date: "2026-10-20", notes: "Make time to listen deeply and practice.", subtasks: [{ text: "Practice for 20 minutes", done: false }, { text: "Listen to one full album", done: false }] },
  { id: "books", themeId: "hobbies", title: "Books", status: "planned", color: "sun", date: "2026-10-25", notes: "Keep a small reading queue and capture one idea from each book.", subtasks: [{ text: "Choose the next book", done: false }, { text: "Write a reading note", done: false }] }
];

let themes = [], tasks = [], currentUser = null, activeFilter = "all", activeTheme = "all", searchTerm = "", imageData = "", bootPromise = null, showingArchive = false;
const $ = (selector) => document.querySelector(selector);
const board = $("#task-board"), taskDialog = $("#task-dialog"), detailDialog = $("#detail-dialog");

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }
function formatDate(date) { if (!date) return "No due date"; return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`)); }
function statusLabel(status) { return status.replace("-", " "); }
function completedCount(task) { return task.subtasks.filter((item) => item.done).length; }
function markdownToHtml(markdown) {
  let html = escapeHtml(markdown || "");
  html = html.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, '<img src="$2" alt="$1">').replace(/\$([^$\n]+)\$/g, '<span class="equation">$1</span>').replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html.split(/\n{2,}/).map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`).join("");
}
function localSeed() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return { themes: JSON.parse(localStorage.getItem(`${STORAGE_KEY}-themes`)) || starterThemes, tasks: saved ? JSON.parse(saved) : starterTasks };
  } catch { return { themes: starterThemes, tasks: starterTasks }; }
}
function persistLocal() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); localStorage.setItem(`${STORAGE_KEY}-themes`, JSON.stringify(themes)); }
function showAuthMessage(message, error = false) { const element = $("#auth-message"); element.textContent = message; element.classList.toggle("error", error); }
function showApp() { $("#auth-screen").hidden = true; $("#app-container").hidden = false; }

async function signIn(event) {
  event.preventDefault(); showAuthMessage("Signing in...");
  const { error } = await supabaseClient.auth.signInWithPassword({ email: $("#auth-email").value.trim(), password: $("#auth-password").value });
  if (error) showAuthMessage(error.message, true);
}
async function signUp() {
  const email = $("#auth-email").value.trim(), password = $("#auth-password").value;
  if (!email || password.length < 6) return showAuthMessage("Enter an email and a password of at least 6 characters.", true);
  showAuthMessage("Creating account...");
  const { error } = await supabaseClient.auth.signUp({ email, password });
  showAuthMessage(error ? error.message : "Account created. Check your email if confirmation is enabled.");
}

async function loadCloudData() {
  const [themeResult, taskResult] = await Promise.all([
    supabaseClient.from("themes").select("*").order("created_at"),
    supabaseClient.from("tasks").select("*, subtasks(*)").order("created_at")
  ]);
  if (themeResult.error || taskResult.error) throw themeResult.error || taskResult.error;
  if (!themeResult.data.length && !taskResult.data.length) {
    const seed = localSeed();
    const insertedThemes = await insertThemes(seed.themes);
    const themeIds = new Map(insertedThemes.map((theme) => [theme.name, theme.id]));
    const insertedTasks = await insertTasks(seed.tasks, themeIds, seed.themes);
    themes = insertedThemes; tasks = insertedTasks;
  } else {
    themes = dedupeThemes(themeResult.data.map(({ id, name, icon, color, description }) => ({ id, name, icon, color, description })));
    tasks = taskResult.data.map((task) => ({ id: task.id, themeId: task.theme_id, title: task.title, status: task.status, color: task.color, date: task.due_date, notes: task.notes, imagePath: task.image_path, completedAt: task.completed_at || (task.status === "completed" ? task.updated_at : null), subtasks: (task.subtasks || []).sort((a, b) => a.position - b.position).map(({ id, text, done }) => ({ id, text, done })) }));
    if (!tasks.length) {
      const seed = localSeed();
      const themeIds = new Map(themes.map((theme) => [theme.name, theme.id]));
      tasks = await insertTasks(seed.tasks, themeIds, seed.themes);
    }
  }
  persistLocal(); render();
}
function dedupeThemes(source) {
  const seen = new Set();
  return source.filter((theme) => {
    const key = theme.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
async function insertThemes(source) {
  const rows = source.map((theme) => ({ user_id: currentUser.id, name: theme.name, icon: theme.icon, color: theme.color, description: theme.description || "" }));
  const { data, error } = await supabaseClient.from("themes").insert(rows).select();
  if (error) throw error;
  return data;
}
async function insertTasks(source, themeIds, sourceThemes = themes) {
  const rows = source.map((task) => {
    const theme = sourceThemes.find((item) => item.id === task.themeId);
    return { user_id: currentUser.id, theme_id: themeIds.get(theme?.name || task.themeId), title: task.title, status: task.status, color: task.color, due_date: task.date || null, notes: task.notes || "", completed_at: task.status === "completed" ? (task.completedAt || new Date().toISOString()) : null };
  }).filter((task) => task.theme_id);
  const { data, error } = await supabaseClient.from("tasks").insert(rows).select();
  if (error) throw error;
  for (let index = 0; index < data.length; index += 1) {
    const subtasks = source[index].subtasks.map((item, position) => ({ user_id: currentUser.id, task_id: data[index].id, text: item.text, done: item.done, position }));
    if (subtasks.length) { const result = await supabaseClient.from("subtasks").insert(subtasks); if (result.error) throw result.error; }
  }
  return data.map((task, index) => ({ id: task.id, themeId: task.theme_id, title: task.title, status: task.status, color: task.color, date: task.due_date, notes: task.notes, completedAt: task.status === "completed" ? (source[index].completedAt || new Date().toISOString()) : null, subtasks: source[index].subtasks }));
}
async function saveTask(task, existing) {
  const row = { user_id: currentUser.id, theme_id: task.themeId, title: task.title, status: task.status, color: task.color, due_date: task.date || null, notes: task.notes, image_path: task.imagePath || null, completed_at: task.status === "completed" ? (task.completedAt || new Date().toISOString()) : null };
  let result = existing ? await supabaseClient.from("tasks").update(row).eq("id", task.id).select().single() : await supabaseClient.from("tasks").insert(row).select().single();
  if (result.error?.code === "PGRST204" || result.error?.message?.includes("completed_at")) {
    const { completed_at, ...legacyRow } = row;
    result = existing ? await supabaseClient.from("tasks").update(legacyRow).eq("id", task.id).select().single() : await supabaseClient.from("tasks").insert(legacyRow).select().single();
  }
  if (result.error) throw result.error;
  task.id = result.data.id;
  if (!existing && task.subtasks.length) {
    const subtasksResult = await supabaseClient.from("subtasks").insert(task.subtasks.map((item, position) => ({ user_id: currentUser.id, task_id: result.data.id, text: item.text, done: item.done, position }))).select();
    if (subtasksResult.error) throw subtasksResult.error;
    task.subtasks = subtasksResult.data.map(({ id, text, done }) => ({ id, text, done }));
  }
  return result.data;
}
async function uploadImage(file) {
  const path = `${currentUser.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error } = await supabaseClient.storage.from("research-images").upload(path, file);
  if (error) throw error;
  return path;
}

function visibleTasks() { return tasks.filter((task) => task.status !== "completed" && (activeFilter === "all" || task.status === activeFilter) && (activeTheme === "all" || task.themeId === activeTheme) && `${task.title} ${task.notes}`.toLowerCase().includes(searchTerm)); }
function archiveTasks() { return tasks.filter((task) => task.status === "completed" && `${task.title} ${task.notes}`.toLowerCase().includes(searchTerm)).sort((a, b) => new Date(b.completedAt || b.date || 0) - new Date(a.completedAt || a.date || 0)); }
function formatArchiveDate(date) { return date ? new Intl.DateTimeFormat("en", { year: "numeric", month: "long" }).format(new Date(date)) : "Completion date unknown"; }
function renderArchive() {
  const archived = archiveTasks();
  const groups = archived.reduce((result, task) => { const key = formatArchiveDate(task.completedAt || task.date); (result[key] ||= []).push(task); return result; }, {});
  board.innerHTML = `<section class="archive-section"><header class="theme-header"><div><p class="eyebrow">COMPLETED WORK</p><h2>Archive</h2><p>Completed cards, kept in chronological groups.</p></div><span class="theme-count">${archived.length} ${archived.length === 1 ? "card" : "cards"}</span></header>${Object.entries(groups).map(([month, monthTasks]) => `<div class="archive-group"><h3>${escapeHtml(month)}</h3><div class="archive-list">${monthTasks.map((task) => `<article class="archive-card ${task.color}" data-id="${task.id}" tabindex="0" role="button"><div><span class="status"><i class="status-dot completed"></i>completed</span><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml((task.notes.split("\n")[0] || "No notes").slice(0, 150))}</p></div><span class="archive-date">${formatDate(task.completedAt || task.date)}</span></article>`).join("")}</div></div>`).join("")}${archived.length ? "" : `<div class="empty-state"><div class="empty-icon">✓</div><h3>Nothing archived yet</h3><p>Completed cards will appear here, grouped by month.</p></div>`}</section>`;
  board.querySelectorAll(".archive-card").forEach((card) => { card.addEventListener("click", () => openDetail(card.dataset.id)); card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") openDetail(card.dataset.id); }); });
}
function renderThemeTabs() {
  $("#theme-tabs").innerHTML = `<button class="theme-tab ${activeTheme === "all" ? "active" : ""}" data-theme="all">All themes</button>${themes.map((theme) => `<button class="theme-tab ${activeTheme === theme.id ? "active" : ""}" data-theme="${theme.id}">${escapeHtml(theme.icon)} ${escapeHtml(theme.name)}</button>`).join("")}<button class="theme-tab add-theme" id="add-theme">+ New theme</button>`;
  document.querySelectorAll(".theme-tab[data-theme]").forEach((button) => button.addEventListener("click", () => { activeTheme = button.dataset.theme; render(); }));
  $("#add-theme").addEventListener("click", addTheme);
}
function render() {
  $("#archive-count").textContent = tasks.filter((task) => task.status === "completed").length;
  if (showingArchive) { renderArchive(); $("#empty-state").hidden = true; return; }
  const visible = visibleTasks(); renderThemeTabs();
  board.innerHTML = themes.map((theme) => {
    const themeTasks = visible.filter((task) => task.themeId === theme.id); if (!themeTasks.length) return "";
    const cards = themeTasks.map((task) => { const total = task.subtasks.length, done = completedCount(task), progress = total ? Math.round(done / total * 100) : 0;
      return `<article class="task-card ${task.color}" data-id="${task.id}" tabindex="0" role="button" aria-label="Open ${escapeHtml(task.title)}"><div class="card-top"><span class="status"><i class="status-dot ${task.status}"></i>${statusLabel(task.status)}</span><span class="status">↗</span></div><h3 class="card-title">${escapeHtml(task.title)}</h3><p class="card-excerpt">${escapeHtml((task.notes.split("\n")[0] || "Add notes...").slice(0, 120))}</p><div class="progress-bar"><span style="width:${progress}%"></span></div><div class="card-meta"><span>${done}/${total} subtasks</span><span>${formatDate(task.date)}</span></div></article>`;
    }).join("");
    return `<section class="theme-section"><header class="theme-header"><div class="theme-heading"><span class="theme-icon ${theme.color}">${escapeHtml(theme.icon)}</span><div><p class="eyebrow">THEME</p><h2>${escapeHtml(theme.name)}</h2><p>${escapeHtml(theme.description || "")}</p></div></div><span class="theme-count">${themeTasks.length} ${themeTasks.length === 1 ? "card" : "cards"}</span></header><div class="theme-cards">${cards}</div></section>`;
  }).join("");
  $("#empty-state").hidden = visible.length > 0; $("#task-count").textContent = tasks.filter((task) => task.status !== "completed").length;
  const allSubtasks = tasks.flatMap((task) => task.subtasks); $("#progress-count").textContent = allSubtasks.length ? `${Math.round(allSubtasks.filter((item) => item.done).length / allSubtasks.length * 100)}%` : "0%";
  board.querySelectorAll(".task-card").forEach((card) => { card.addEventListener("click", () => openDetail(card.dataset.id)); card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") openDetail(card.dataset.id); }); });
}
function openEditor(task) {
  $("#task-id").value = task?.id || ""; $("#dialog-eyebrow").textContent = task ? "EDIT TASK CARD" : "NEW TASK CARD"; $("#dialog-title").textContent = task ? "Edit task" : "Create a task";
  $("#task-title").value = task?.title || ""; $("#task-theme").innerHTML = themes.map((theme) => `<option value="${theme.id}">${escapeHtml(theme.icon)} ${escapeHtml(theme.name)}</option>`).join(""); $("#task-theme").value = task?.themeId || themes[0].id; $("#task-status").value = task?.status || "planned"; $("#task-color").value = task?.color || "sun"; $("#task-date").value = task?.date || ""; $("#task-notes").value = task?.notes || "";
  imageData = task?.imagePath || ""; $("#image-name").textContent = imageData ? "Image attached · stored securely" : "PNG, JPG, GIF, or WebP · stored securely"; $("#remove-image").hidden = !imageData; $("#delete-task").hidden = !task; taskDialog.showModal();
}
function openDetail(id) {
  const task = tasks.find((item) => item.id === id); if (!task) return;
  const activeRows = task.subtasks.map((item, index) => ({ item, index })).filter(({ item }) => !item.done).map(({ item, index }) => `<label class="subtask-row"><input type="checkbox" data-subtask="${index}"><span>${escapeHtml(item.text)}</span></label>`).join("");
  const completedRows = task.subtasks.map((item, index) => ({ item, index })).filter(({ item }) => item.done).map(({ item, index }) => `<label class="subtask-row done"><input type="checkbox" data-subtask="${index}" checked><span>${escapeHtml(item.text)}</span></label>`).join("");
  const completedSection = completedRows ? `<details class="subtask-archive"><summary>Completed subtasks <span>${task.subtasks.filter((item) => item.done).length}</span></summary>${completedRows}</details>` : "";
  $("#detail-content").innerHTML = `<button class="icon-button detail-close" aria-label="Close">×</button><span class="detail-kicker">${statusLabel(task.status)} · ${formatDate(task.status === "completed" ? task.completedAt : task.date)}</span><h2>${escapeHtml(task.title)}</h2><div class="detail-notes">${markdownToHtml(task.notes)}</div><div class="detail-subtasks"><p class="eyebrow">WORKING CHECKLIST</p>${activeRows || "<p class='card-excerpt'>No active subtasks.</p>"}${completedSection}</div><div class="dialog-actions"><span></span><button class="button button-secondary edit-detail">${task.status === "completed" ? "Restore card" : "Edit card"}</button></div>`;
  detailDialog.showModal(); $("#detail-content .detail-close").addEventListener("click", () => detailDialog.close()); $("#detail-content .edit-detail").addEventListener("click", () => { detailDialog.close(); openEditor(task); });
  $("#detail-content").querySelectorAll("input[type=checkbox]").forEach((input) => input.addEventListener("change", async (event) => { const item = task.subtasks[Number(event.target.dataset.subtask)]; item.done = event.target.checked; try { await supabaseClient.from("subtasks").update({ done: item.done }).eq("id", item.id); persistLocal(); render(); openDetail(task.id); } catch (error) { alert(`Could not sync subtask: ${error.message}`); } }));
}
async function addTheme() {
  const name = prompt("Name your new theme (for example: Health, Learning, or Home):"); if (!name?.trim()) return;
  const theme = { user_id: currentUser.id, name: name.trim(), icon: "✦", color: "blue", description: "A new area of your life." };
  const { data, error } = await supabaseClient.from("themes").insert(theme).select().single(); if (error) return alert(`Could not create theme: ${error.message}`);
  themes.push({ id: data.id, name: data.name, icon: data.icon, color: data.color, description: data.description }); activeTheme = data.id; persistLocal(); render();
}

async function boot(session) {
  if (bootPromise) return bootPromise;
  bootPromise = (async () => {
    currentUser = session.user; showApp();
    try { await loadCloudData(); } catch (error) { const seed = localSeed(); themes = seed.themes; tasks = seed.tasks; persistLocal(); render(); alert(`Supabase could not be reached, so local data is shown. ${error.message}`); }
  })();
  return bootPromise;
}
$("#auth-form").addEventListener("submit", signIn); $("#auth-signup").addEventListener("click", signUp);
$("#sign-out-button").addEventListener("click", async () => { await supabaseClient.auth.signOut(); location.reload(); });
$("#new-task-button").addEventListener("click", () => openEditor()); $("#empty-new-task").addEventListener("click", () => openEditor()); $("#close-dialog").addEventListener("click", () => taskDialog.close()); $("#cancel-dialog").addEventListener("click", () => taskDialog.close());
$("#remove-image").addEventListener("click", () => { imageData = ""; $("#image-name").textContent = "PNG, JPG, GIF, or WebP · stored securely"; $("#remove-image").hidden = true; });
$("#task-image").addEventListener("change", (event) => { const file = event.target.files[0]; if (!file) return; imageData = file; $("#image-name").textContent = `${file.name} · ready to upload`; $("#remove-image").hidden = false; });
$("#task-form").addEventListener("submit", async (event) => {
  event.preventDefault(); const id = $("#task-id").value, existing = tasks.find((task) => task.id === id);   const nextStatus = $("#task-status").value;
  const task = { id: id || crypto.randomUUID(), themeId: $("#task-theme").value, title: $("#task-title").value.trim(), status: nextStatus, color: $("#task-color").value, date: $("#task-date").value, notes: $("#task-notes").value, subtasks: existing?.subtasks || [], imagePath: existing?.imagePath || "", completedAt: nextStatus === "completed" ? (existing?.completedAt || new Date().toISOString()) : null };
  try { if (imageData instanceof File) task.imagePath = await uploadImage(imageData); await saveTask(task, existing); if (existing) Object.assign(existing, task); else tasks.unshift(task); persistLocal(); render(); taskDialog.close(); } catch (error) { alert(`Could not save task: ${error.message}`); }
});
$("#delete-task").addEventListener("click", async () => { const id = $("#task-id").value; if (!id || !confirm("Delete this task?")) return; const { error } = await supabaseClient.from("tasks").delete().eq("id", id); if (error) return alert(`Could not delete task: ${error.message}`); tasks = tasks.filter((task) => task.id !== id); persistLocal(); render(); taskDialog.close(); });
$("#search-input").addEventListener("input", (event) => { searchTerm = event.target.value.toLowerCase().trim(); render(); });
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => { showingArchive = false; activeFilter = button.dataset.filter; document.querySelector(".filter.active")?.classList.remove("active"); button.classList.add("active"); $("#archive-toggle").classList.remove("active"); render(); }));
$("#archive-toggle").addEventListener("click", () => { showingArchive = !showingArchive; $("#archive-toggle").classList.toggle("active", showingArchive); document.querySelectorAll(".filter").forEach((button) => button.classList.remove("active")); if (!showingArchive) document.querySelector('[data-filter="all"]').classList.add("active"); render(); });
supabaseClient.auth.getSession().then(({ data: { session } }) => { if (session) boot(session); });
supabaseClient.auth.onAuthStateChange((_event, session) => { if (session && !currentUser) boot(session); });
