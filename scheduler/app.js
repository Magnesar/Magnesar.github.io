const SUPABASE_URL = "https://xlaqobmretzuagcmjlun.supabase.co";
const SUPABASE_KEY = "sb_publishable_3bq8qk-mDEBpelQ1aC1t6g_qWjMc5Er";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const STORAGE_KEY = "research-life-scheduler-v2";
const LEGACY_STORAGE_KEY = "atlas-research-scheduler-v1";
const starterThemes = [
  { id: "research", name: "Research", icon: "⌘", color: "sage", description: "Questions, papers, experiments, and writing." },
  { id: "hobbies", name: "Hobbies", icon: "✦", color: "lavender", description: "Things you do simply because they make life richer." },
  { id: "skill", name: "Skill", icon: "↗", color: "blue", description: "Skills and capabilities you are deliberately building." }
];
const starterTasks = [
  { id: "lit-review", themeId: "research", title: "Literature review", status: "in-progress", color: "sage", date: "2026-10-22", notes: "Synthesize the main arguments around **spatial memory** and identify the gap my work can address.\n\nWorking equation: $R = f(S, T, C)$", subtasks: [{ text: "Collect the five foundational papers", done: true }, { text: "Build an annotated bibliography", done: false }, { text: "Write the gap statement", done: false }] },
  { id: "experiment", themeId: "research", title: "Design experiment", status: "planned", color: "sun", date: "2026-10-29", notes: "Turn the research question into a falsifiable protocol. Consider a control group and a reproducible data collection plan.", subtasks: [{ text: "Define independent variables", done: false }, { text: "Draft participant protocol", done: false }] },
  { id: "conference", themeId: "research", title: "Paper work", status: "planned", color: "lavender", date: "2026-11-05", notes: "A 300-word abstract connecting the theoretical frame to the preliminary results.", subtasks: [{ text: "Choose a working title", done: false }, { text: "Draft the methods paragraph", done: false }, { text: "Ask for supervisor feedback", done: false }] },
  { id: "analysis", themeId: "research", title: "Analyse pilot data", status: "completed", color: "coral", date: "2026-10-16", notes: "Check the first pass for outliers and make a note of any assumptions.", subtasks: [{ text: "Clean the data", done: true }, { text: "Run descriptive statistics", done: true }] },
  { id: "reading", themeId: "research", title: "Read & annotate", status: "in-progress", color: "blue", date: "2026-10-19", notes: "Read the new paper on embodied cognition. Capture useful quotations and questions.", subtasks: [{ text: "Read introduction", done: true }, { text: "Annotate figures", done: false }] },
  { id: "positive-negative-heat-flux", themeId: "research", title: "Positive-Negative Heat flux", status: "planned", color: "crimson", date: "", notes: "Study the positive-negative heat flux behavior and organize the sign conventions.", subtasks: [{ text: "Define the sign convention", done: false }, { text: "Compare the flux profiles", done: false }] },
  { id: "counter-gradient-heat-flux", themeId: "research", title: "Counter Gradient Heat flux", status: "planned", color: "amber", date: "", notes: "Investigate counter-gradient transport and its relationship to the mean scalar gradient.", subtasks: [{ text: "Review the relevant closure model", done: false }, { text: "Plot the counter-gradient region", done: false }] },
  { id: "poisson-equation", themeId: "research", title: "Poisson Equation", status: "planned", color: "blue", date: "", notes: "Work through the Poisson equation formulation used in the project.", subtasks: [{ text: "Write the boundary conditions", done: false }, { text: "Check the numerical solver", done: false }] },
  { id: "rotational-rbc", themeId: "research", title: "Rotational RBC", status: "planned", color: "teal", date: "", notes: "Organize the rotating Rayleigh-Bénard convection analysis.", subtasks: [{ text: "Cross correlation", done: false }, { text: "Review the rotation parameter", done: false }] },
  { id: "quasi-2d", themeId: "research", title: "Quasi 2D", status: "planned", color: "sage", date: "", notes: "Clarify the quasi-two-dimensional approximation and its limits.", subtasks: [{ text: "List the assumptions", done: false }, { text: "Compare with the full model", done: false }] },
  { id: "interpolation-script", themeId: "research", title: "Interpolation script", status: "planned", color: "lavender", date: "", notes: "Finish and test the interpolation workflow.", subtasks: [{ text: "Choose interpolation method", done: false }, { text: "Test edge cases", done: false }] },
  { id: "grossman-lohse", themeId: "research", title: "Grossman Lohse parameters", status: "planned", color: "plum", date: "", notes: "Collect and compare the Grossmann–Lohse parameters relevant to the study.", subtasks: [{ text: "List the parameter definitions", done: false }, { text: "Compare the scaling regimes", done: false }] },
  { id: "running", themeId: "hobbies", title: "Running", status: "in-progress", color: "coral", date: "2026-10-18", notes: "Build a steady weekly rhythm and enjoy being outside.", subtasks: [{ text: "Easy 5 km run", done: true }, { text: "Stretch and recover", done: false }] },
  { id: "music", themeId: "hobbies", title: "Music", status: "planned", color: "lavender", date: "2026-10-20", notes: "Make time to listen deeply and practice.", subtasks: [{ text: "Practice for 20 minutes", done: false }, { text: "Listen to one full album", done: false }] },
  { id: "books", themeId: "hobbies", title: "Books", status: "planned", color: "sun", date: "2026-10-25", notes: "Keep a small reading queue and capture one idea from each book.", subtasks: [{ text: "Metamorphosis by Kafka", done: false, color: "amber", notes: "Read and capture the ideas that stay with me." }, { text: "Sylvia Plath poems", done: false, color: "plum", notes: "Read slowly and collect images, lines, and questions." }, { text: "Short stories by Kafka", done: false, color: "blue", notes: "Explore the short fiction alongside Metamorphosis." }, { text: "Vagabond", done: false, color: "coral", notes: "Make time for the series and keep a few observations." }, { text: "Choose the next book", done: false }, { text: "Write a reading note", done: false }] }
  ,{ id: "chess", themeId: "hobbies", title: "Chess", status: "planned", color: "teal", date: "", notes: "Build a regular practice habit and review games.", subtasks: [{ text: "Play one slow game", done: false }, { text: "Review the opening", done: false }] }
  ,{ id: "art", themeId: "hobbies", title: "Art", status: "planned", color: "plum", date: "", notes: "Keep a low-pressure visual practice.", subtasks: [{ text: "Make one small study", done: false }] }
  ,{ id: "cybersecurity", themeId: "skill", title: "Cybersecurity", status: "planned", color: "teal", date: "", notes: "Build practical security knowledge through small, consistent exercises.", subtasks: [{ text: "Choose a fundamentals path", done: false }, { text: "Set up a safe practice lab", done: false }] }
];

let themes = [], tasks = [], currentUser = null, activeFilter = "all", activeTheme = "all", searchTerm = "", imageData = "", bootPromise = null, showingArchive = false;
const $ = (selector) => document.querySelector(selector);
const board = $("#task-board"), taskDialog = $("#task-dialog"), detailDialog = $("#detail-dialog"), subtaskDialog = $("#subtask-dialog");
let openSubtaskContext = null;

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
    const key = currentUser ? `${STORAGE_KEY}-${currentUser.id}` : STORAGE_KEY;
    const saved = localStorage.getItem(key);
    return { themes: JSON.parse(localStorage.getItem(`${key}-themes`)) || starterThemes, tasks: saved ? JSON.parse(saved) : starterTasks };
  } catch (error) {
    console.warn("Could not read the local scheduler cache.", error);
    return { themes: starterThemes, tasks: starterTasks };
  }
}
function persistLocal() {
  const key = currentUser ? `${STORAGE_KEY}-${currentUser.id}` : STORAGE_KEY;
  localStorage.setItem(key, JSON.stringify(tasks));
  localStorage.setItem(`${key}-themes`, JSON.stringify(themes));
}
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
  const button = $("#auth-signup");
  button.disabled = true;
  showAuthMessage("Creating account...");
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return showAuthMessage(error.message, true);
    if (data.session) {
      showAuthMessage("Account created. Signing you in...");
      return;
    }
    showAuthMessage("Account created. Check your email to confirm it, then sign in.");
  } catch (error) {
    showAuthMessage(`Could not create account: ${error.message}`, true);
  } finally {
    button.disabled = false;
  }
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
    const rawThemes = themeResult.data.map(({ id, name, icon, color, description }) => ({ id, name, icon, color, description }));
    const canonicalThemes = new Map();
    rawThemes.forEach((theme) => { const key = theme.name.trim().toLowerCase(); if (!canonicalThemes.has(key)) canonicalThemes.set(key, theme); });
    const themeIdMap = new Map(rawThemes.map((theme) => [theme.id, canonicalThemes.get(theme.name.trim().toLowerCase()).id]));
    themes = [...canonicalThemes.values()];
    const loadedTasks = taskResult.data.map((task, index) => ({ id: task.id, themeId: themeIdMap.get(task.theme_id) || task.theme_id, title: task.title, status: task.status, color: task.color, date: task.due_date, notes: task.notes, imagePath: task.image_path, position: task.position ?? index, urgency: task.urgency ?? (task.position ?? index) + 1, createdAt: task.created_at, completedAt: task.completed_at || (task.status === "completed" ? task.updated_at : null), subtasks: (task.subtasks || []).sort((a, b) => a.position - b.position).map(({ id, text, done, notes, due_date, color, completed_at, urgency, position }) => ({ id, text, done, notes: notes || "", date: due_date || "", color: color || "sage", urgency: urgency ?? position + 1, completedAt: completed_at || null })) }));
    tasks = await dedupeCloudTasks(loadedTasks);
    tasks = await dedupeCloudSubtasks(tasks);
    if (!tasks.length) {
      const seed = localSeed();
      const themeIds = new Map(themes.map((theme) => [theme.name, theme.id]));
      tasks = await insertTasks(seed.tasks, themeIds, seed.themes);
    }
  }
  await ensureStarterContent();
  persistLocal(); render();
}
async function dedupeCloudTasks(source) {
  const seen = new Set();
  const duplicateIds = [];
  const unique = source.filter((task) => {
    const key = `${task.themeId}:${task.title.trim().toLowerCase()}`;
    if (seen.has(key)) {
      duplicateIds.push(task.id);
      return false;
    }
    seen.add(key);
    return true;
  });
  if (duplicateIds.length) {
    const { error } = await supabaseClient.from("tasks").delete().in("id", duplicateIds);
    if (error) throw error;
  }
  return unique;
}
async function dedupeCloudSubtasks(source) {
  const duplicateIds = [];
  source.forEach((task) => {
    const seen = new Set();
    task.subtasks = task.subtasks.filter((subtask) => {
      const key = subtask.text.trim().toLowerCase();
      if (seen.has(key)) {
        if (subtask.id) duplicateIds.push(subtask.id);
        return false;
      }
      seen.add(key);
      return true;
    });
  });
  if (duplicateIds.length) {
    const { error } = await supabaseClient.from("subtasks").delete().in("id", duplicateIds);
    if (error) throw error;
  }
  return source;
}
async function ensureStarterContent() {
  const existingThemeNames = new Set(themes.map((theme) => theme.name.toLowerCase()));
  const missingThemes = starterThemes.filter((theme) => !existingThemeNames.has(theme.name.toLowerCase()));
  if (missingThemes.length) {
    const inserted = await insertThemes(missingThemes);
    themes = themes.concat(inserted);
  }
  const themeIds = new Map(themes.map((theme) => [theme.name, theme.id]));
  const existingTitles = new Set(tasks.map((task) => task.title.toLowerCase()));
  const missingTasks = starterTasks.filter((task) => !existingTitles.has(task.title.toLowerCase()));
  if (missingTasks.length) tasks = tasks.concat(await insertTasks(missingTasks, themeIds, starterThemes));
  await consolidateBookCards();
}
async function consolidateBookCards() {
  const books = tasks.find((task) => task.title.toLowerCase() === "books");
  if (!books) return;
  const bookTitles = new Set(["metamorphosis by kafka", "sylvia plath poems", "short stories by kafka", "vagabond"]);
  const standalone = tasks.filter((task) => bookTitles.has(task.title.toLowerCase()) && task.id !== books.id);
  const existing = new Set(books.subtasks.map((item) => item.text.toLowerCase()));
  const additions = standalone.filter((task) => !existing.has(task.title.toLowerCase())).map((task) => ({ text: task.title, done: task.status === "completed", notes: task.notes, date: task.date, color: task.color }));
  if (additions.length) {
    const inserted = await insertSubtasks(additions.map((item, position) => ({ user_id: currentUser.id, task_id: books.id, text: item.text, done: item.done, position: books.subtasks.length + position, urgency: books.subtasks.length + position + 1, notes: item.notes, due_date: item.date || null, color: item.color, completed_at: item.done ? new Date().toISOString() : null })));
    books.subtasks = books.subtasks.concat(inserted.map(({ id, text, done, notes, due_date, color, completed_at, urgency, position }) => ({ id, text, done, notes: notes || "", date: due_date || "", color: color || "sage", urgency: urgency ?? position + 1, completedAt: completed_at || null })));
  }
  if (standalone.length) {
    const result = await supabaseClient.from("tasks").delete().in("id", standalone.map((task) => task.id));
    if (result.error) throw result.error;
    tasks = tasks.filter((task) => !standalone.includes(task));
  }
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
    return { user_id: currentUser.id, theme_id: themeIds.get(theme?.name || task.themeId), title: task.title, status: task.status, color: task.color, due_date: task.date || null, notes: task.notes || "", position: task.position ?? source.indexOf(task), urgency: task.urgency ?? (task.position ?? source.indexOf(task)) + 1, completed_at: task.status === "completed" ? (task.completedAt || new Date().toISOString()) : null };
  }).filter((task) => task.theme_id);
  let { data, error } = await supabaseClient.from("tasks").insert(rows).select();
  if (error?.code === "PGRST204" || error?.message?.includes("completed_at") || error?.message?.includes("urgency")) {
    const legacyRows = rows.map(({ user_id, theme_id, title, status, color, due_date, notes }) => ({ user_id, theme_id, title, status, color, due_date, notes }));
    ({ data, error } = await supabaseClient.from("tasks").insert(legacyRows).select());
  }
  if (error) throw error;
  for (let index = 0; index < data.length; index += 1) {
    const subtasks = source[index].subtasks.map((item, position) => ({ user_id: currentUser.id, task_id: data[index].id, text: item.text, done: item.done, position, urgency: item.urgency ?? position + 1, notes: item.notes || "", due_date: item.date || null, color: item.color || "sage", completed_at: item.done ? (item.completedAt || new Date().toISOString()) : null }));
    if (subtasks.length) await insertSubtasks(subtasks);
  }
  return data.map((task, index) => ({ id: task.id, themeId: task.theme_id, title: task.title, status: task.status, color: task.color, date: task.due_date, notes: task.notes, position: task.position ?? index, urgency: task.urgency ?? index + 1, completedAt: task.status === "completed" ? (source[index].completedAt || new Date().toISOString()) : null, subtasks: source[index].subtasks }));
}
async function insertSubtasks(rows) {
  let result = await supabaseClient.from("subtasks").insert(rows).select();
  if (result.error?.code === "PGRST204" || result.error?.message?.includes("column")) {
    const legacyRows = rows.map(({ user_id, task_id, text, done, position, notes, due_date, color }) => ({ user_id, task_id, text, done, position, notes, due_date, color }));
    result = await supabaseClient.from("subtasks").insert(legacyRows).select();
  }
  if (result.error) throw result.error;
  return result.data;
}
async function saveTask(task, existing) {
  const row = { user_id: currentUser.id, theme_id: task.themeId, title: task.title, status: task.status, color: task.color, due_date: task.date || null, notes: task.notes, image_path: task.imagePath || null, position: task.position ?? 0, urgency: task.urgency ?? (task.position ?? 0) + 1, completed_at: task.status === "completed" ? (task.completedAt || new Date().toISOString()) : null };
  let result = existing ? await supabaseClient.from("tasks").update(row).eq("id", task.id).select().single() : await supabaseClient.from("tasks").insert(row).select().single();
  if (result.error?.code === "PGRST204" || result.error?.message?.includes("completed_at") || result.error?.message?.includes("urgency")) {
    const { completed_at, position, urgency, ...legacyRow } = row;
    result = existing ? await supabaseClient.from("tasks").update(legacyRow).eq("id", task.id).select().single() : await supabaseClient.from("tasks").insert(legacyRow).select().single();
  }
  if (result.error) throw result.error;
  task.id = result.data.id;
  if (!existing && task.subtasks.length) {
    const subtasksResult = await insertSubtasks(task.subtasks.map((item, position) => ({ user_id: currentUser.id, task_id: result.data.id, text: item.text, done: item.done, position, urgency: item.urgency ?? position + 1, notes: item.notes || "", due_date: item.date || null, color: item.color || "sage", completed_at: item.done ? (item.completedAt || new Date().toISOString()) : null })));
    task.subtasks = subtasksResult.map(({ id, text, done, notes, due_date, color, completed_at, urgency, position }) => ({ id, text, done, notes: notes || "", date: due_date || "", color: color || "sage", urgency: urgency ?? position + 1, completedAt: completed_at || null }));
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
function urgencyStyle(rank, total) {
  const hue = total <= 1 ? 60 : Math.round(5 + ((Math.max(1, rank) - 1) / (total - 1)) * 115);
  return `--urgency-color: hsl(${hue} 72% 45%); --urgency-soft: hsl(${hue} 72% 92%);`;
}
function normalizeUrgency(items) {
  items.forEach((item, index) => { item.position = index; item.urgency = index + 1; });
  return items;
}
function urgencyLabel(rank) {
  return rank === 1 ? "critical" : rank <= 2 ? "high" : rank <= 4 ? "medium" : "low";
}
function renderArchive() {
  const archived = archiveTasks();
  const groups = archived.reduce((result, task) => { const key = formatArchiveDate(task.completedAt || task.date); (result[key] ||= []).push(task); return result; }, {});
  board.innerHTML = `<section class="archive-section"><header class="theme-header"><div><p class="eyebrow">COMPLETED WORK</p><h2>Archive</h2><p>Completed cards, kept in chronological groups.</p></div><span class="theme-count">${archived.length} ${archived.length === 1 ? "card" : "cards"}</span></header>${Object.entries(groups).map(([month, monthTasks]) => `<div class="archive-group"><h3>${escapeHtml(month)}</h3><div class="archive-list">${monthTasks.map((task) => `<article class="archive-card ${task.color}" data-id="${task.id}" tabindex="0" role="button"><div><span class="status"><i class="status-dot completed"></i>completed</span><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml((task.notes.split("\n")[0] || "No notes").slice(0, 150))}</p></div><span class="archive-date">${formatDate(task.completedAt || task.date)}</span></article>`).join("")}</div></div>`).join("")}${archived.length ? "" : `<div class="empty-state"><div class="empty-icon">✓</div><h3>Nothing archived yet</h3><p>Completed cards will appear here, grouped by month.</p></div>`}</section>`;
  board.querySelectorAll(".archive-card").forEach((card) => { card.addEventListener("click", () => openDetail(card.dataset.id)); card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") openDetail(card.dataset.id); }); });
}
function renderThemeTabs() {
  const urgencyColors = themes.map((theme) => {
    const themeTasks = tasks.filter((task) => task.themeId === theme.id && task.status !== "completed").sort((a, b) => (a.urgency ?? a.position ?? 0) - (b.urgency ?? b.position ?? 0));
    const stops = themeTasks.map((task, index) => `hsl(${Math.round(5 + (index / Math.max(1, themeTasks.length - 1)) * 115)} 72% 58%) ${Math.round(index / Math.max(1, themeTasks.length - 1) * 100)}%`).join(", ");
    return `<button class="theme-tab ${activeTheme === theme.id ? "active" : ""}" data-theme="${theme.id}" style="--theme-gradient: linear-gradient(110deg, ${stops || "hsl(120 25% 78%), hsl(120 25% 90%)"})">${escapeHtml(theme.icon)} ${escapeHtml(theme.name)}${themeTasks.length ? `<small>${urgencyLabel(themeTasks[0].urgency ?? 1)}</small>` : ""}</button>`;
  }).join("");
  $("#theme-tabs").innerHTML = `<button class="theme-tab ${activeTheme === "all" ? "active" : ""}" data-theme="all">All themes</button>${urgencyColors}<button class="theme-tab add-theme" id="add-theme">+ New theme</button>`;
  document.querySelectorAll(".theme-tab[data-theme]").forEach((button) => button.addEventListener("click", () => { activeTheme = button.dataset.theme; render(); }));
  $("#add-theme").addEventListener("click", addTheme);
}
function render() {
  $("#archive-count").textContent = tasks.filter((task) => task.status === "completed").length;
  if (showingArchive) { renderArchive(); $("#empty-state").hidden = true; return; }
  const visible = visibleTasks(); renderThemeTabs();
  board.innerHTML = themes.map((theme) => {
    const themeTasks = visible.filter((task) => task.themeId === theme.id).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)); if (!themeTasks.length) return "";
    const cards = themeTasks.map((task) => { const total = task.subtasks.length, done = completedCount(task), progress = total ? Math.round(done / total * 100) : 0;
      return `<article class="task-card ${task.color}" style="${urgencyStyle(task.urgency ?? 1, themeTasks.length)}" data-id="${task.id}" draggable="true" tabindex="0" role="button" aria-label="Open ${escapeHtml(task.title)}"><div class="card-top"><span class="status"><i class="status-dot ${task.status}"></i>${statusLabel(task.status)}</span><span class="urgency-badge">${escapeHtml(urgencyLabel(task.urgency ?? 1))} · #${task.urgency ?? 1}</span><span class="drag-handle" title="Drag to reorder" aria-label="Drag to reorder">⠿</span></div><h3 class="card-title">${escapeHtml(task.title)}</h3><p class="card-excerpt">${escapeHtml((task.notes.split("\n")[0] || "Add notes...").slice(0, 120))}</p><div class="progress-bar"><span style="width:${progress}%"></span></div><div class="card-meta"><span>${done}/${total} subtasks</span><span>${formatDate(task.date)}</span></div></article>`;
    }).join("");
    return `<section class="theme-section"><header class="theme-header"><div class="theme-heading"><span class="theme-icon ${theme.color}">${escapeHtml(theme.icon)}</span><div><p class="eyebrow">THEME</p><h2>${escapeHtml(theme.name)}</h2><p>${escapeHtml(theme.description || "")}</p></div></div><span class="theme-count">${themeTasks.length} ${themeTasks.length === 1 ? "card" : "cards"}</span></header><div class="theme-cards">${cards}</div></section>`;
  }).join("");
  $("#empty-state").hidden = visible.length > 0; $("#task-count").textContent = tasks.filter((task) => task.status !== "completed").length;
  const allSubtasks = tasks.flatMap((task) => task.subtasks); $("#progress-count").textContent = allSubtasks.length ? `${Math.round(allSubtasks.filter((item) => item.done).length / allSubtasks.length * 100)}%` : "0%";
  board.querySelectorAll(".task-card").forEach((card) => { card.addEventListener("click", () => openDetail(card.dataset.id)); card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") openDetail(card.dataset.id); }); });
  board.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("dragstart", (event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", card.dataset.id); card.classList.add("dragging"); });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
    card.addEventListener("dragover", (event) => { event.preventDefault(); card.classList.add("drag-over"); });
    card.addEventListener("dragleave", () => card.classList.remove("drag-over"));
    card.addEventListener("drop", async (event) => {
      event.preventDefault(); card.classList.remove("drag-over");
      const draggedId = event.dataTransfer.getData("text/plain"), dragged = tasks.find((task) => task.id === draggedId), target = tasks.find((task) => task.id === card.dataset.id);
      if (!dragged || !target || dragged.id === target.id || dragged.themeId !== target.themeId) return;
      const group = tasks.filter((task) => task.themeId === target.themeId && task.status !== "completed").sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      const from = group.indexOf(dragged), to = group.indexOf(target); group.splice(from, 1); group.splice(to, 0, dragged);
      normalizeUrgency(group);
      persistLocal(); render();
      try { await saveTaskOrder(group); } catch (error) { alert(`Cards reordered locally, but could not sync the order: ${error.message}`); }
    });
  });
}
async function saveTaskOrder(group) {
  const results = await Promise.all(group.map((task) => supabaseClient.from("tasks").update({ position: task.position, urgency: task.urgency }).eq("id", task.id)));
  const unsupported = results.find((result) => result.error && (result.error.code === "PGRST204" || result.error.message?.includes("position") || result.error.message?.includes("urgency")));
  if (unsupported) throw unsupported.error;
  const failed = results.find((result) => result.error);
  if (failed) throw failed.error;
}
function openEditor(task) {
  $("#task-id").value = task?.id || ""; $("#dialog-eyebrow").textContent = task ? "EDIT TASK CARD" : "NEW TASK CARD"; $("#dialog-title").textContent = task ? "Edit task" : "Create a task";
  $("#task-title").value = task?.title || ""; $("#task-theme").innerHTML = themes.map((theme) => `<option value="${theme.id}">${escapeHtml(theme.icon)} ${escapeHtml(theme.name)}</option>`).join(""); $("#task-theme").value = task?.themeId || themes[0].id; $("#task-status").value = task?.status || "planned"; $("#task-urgency").value = String(Math.min(5, task?.urgency || 3)); $("#task-color").value = task?.color || "sun"; $("#task-date").value = task?.date || ""; $("#task-notes").value = task?.notes || "";
  imageData = task?.imagePath || ""; $("#image-name").textContent = imageData ? "Image attached · stored securely" : "PNG, JPG, GIF, or WebP · stored securely"; $("#remove-image").hidden = !imageData; $("#delete-task").hidden = !task; taskDialog.showModal();
}
function openDetail(id) {
  const task = tasks.find((item) => item.id === id); if (!task) return;
  const activeRows = task.subtasks.map((item, index) => ({ item, index })).filter(({ item }) => !item.done).map(({ item, index }) => `<div class="subtask-row" draggable="true" data-subtask-drag="${index}" style="${urgencyStyle(item.urgency ?? 1, Math.max(1, task.subtasks.filter((subtask) => !subtask.done).length))}"><input type="checkbox" data-subtask="${index}"><button type="button" class="subtask-link" data-open-subtask="${index}">${escapeHtml(item.text)}</button><span class="urgency-badge">${escapeHtml(urgencyLabel(item.urgency ?? 1))}</span><span class="drag-handle">⠿</span></div>`).join("");
  const completedRows = task.subtasks.map((item, index) => ({ item, index })).filter(({ item }) => item.done).sort((a, b) => new Date(b.item.completedAt || 0) - new Date(a.item.completedAt || 0)).map(({ item, index }) => `<div class="subtask-row done"><input type="checkbox" data-subtask="${index}" checked><button type="button" class="subtask-link" data-open-subtask="${index}">${escapeHtml(item.text)}</button><time class="subtask-completed-date" datetime="${item.completedAt || ""}">${formatCompletionDate(item.completedAt)}</time></div>`).join("");
  const completedSection = completedRows ? `<details class="subtask-archive"><summary>Completed subtasks <span>${task.subtasks.filter((item) => item.done).length}</span></summary>${completedRows}</details>` : "";
  $("#detail-content").innerHTML = `<button class="icon-button detail-close" aria-label="Close">×</button><span class="detail-kicker">${statusLabel(task.status)} · ${formatDate(task.status === "completed" ? task.completedAt : task.date)}</span><h2>${escapeHtml(task.title)}</h2><div class="detail-notes">${markdownToHtml(task.notes)}</div><div class="detail-subtasks"><p class="eyebrow">WORKING CHECKLIST</p>${activeRows || "<p class='card-excerpt'>No active subtasks.</p>"}${completedSection}</div><div class="dialog-actions"><span></span><button class="button button-secondary edit-detail">${task.status === "completed" ? "Restore card" : "Edit card"}</button></div>`;
  detailDialog.showModal(); $("#detail-content .detail-close").addEventListener("click", () => detailDialog.close()); $("#detail-content .edit-detail").addEventListener("click", () => { detailDialog.close(); openEditor(task); });
  $("#detail-content").querySelectorAll("input[type=checkbox]").forEach((input) => input.addEventListener("change", async (event) => { const item = task.subtasks[Number(event.target.dataset.subtask)]; item.done = event.target.checked; item.completedAt = item.done ? (item.completedAt || new Date().toISOString()) : null; try { const result = await supabaseClient.from("subtasks").update({ done: item.done, completed_at: item.completedAt }).eq("id", item.id); if (result.error && !result.error.message?.includes("column")) throw result.error; persistLocal(); render(); openDetail(task.id); } catch (error) { alert(`Could not sync subtask: ${error.message}`); } }));
  $("#detail-content").querySelectorAll("[data-open-subtask]").forEach((button) => button.addEventListener("click", () => openSubtask(task, Number(button.dataset.openSubtask))));
  $("#detail-content").querySelectorAll("[data-subtask-drag]").forEach((row) => {
    row.addEventListener("dragstart", (event) => { event.dataTransfer.setData("text/plain", row.dataset.subtaskDrag); row.classList.add("dragging"); });
    row.addEventListener("dragend", () => row.classList.remove("dragging"));
    row.addEventListener("dragover", (event) => { event.preventDefault(); row.classList.add("drag-over"); });
    row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
    row.addEventListener("drop", async (event) => {
      event.preventDefault(); row.classList.remove("drag-over");
      const fromIndex = Number(event.dataTransfer.getData("text/plain")), toIndex = Number(row.dataset.subtaskDrag);
      const active = task.subtasks.filter((item) => !item.done);
      const from = active.indexOf(task.subtasks[fromIndex]), to = active.indexOf(task.subtasks[toIndex]);
      if (from < 0 || to < 0 || from === to) return;
      active.splice(to, 0, active.splice(from, 1)[0]); normalizeUrgency(active);
      task.subtasks = active.concat(task.subtasks.filter((item) => item.done));
      persistLocal(); render(); openDetail(task.id);
      try { await saveSubtaskOrder(active); } catch (error) { alert(`Subtasks reordered locally, but could not sync the order: ${error.message}`); }
    });
  });
}
async function saveSubtaskOrder(items) {
  const results = await Promise.all(items.map((item) => supabaseClient.from("subtasks").update({ position: item.position, urgency: item.urgency }).eq("id", item.id)));
  const failed = results.find((result) => result.error && !result.error.message?.includes("column"));
  if (failed) throw failed.error;
}
function openSubtask(task, index) {
  const item = task.subtasks[index]; openSubtaskContext = { task, index };
  $("#subtask-dialog-title").textContent = item.text; $("#subtask-parent").textContent = `Nested inside ${task.title}`;
  $("#subtask-notes").value = item.notes || ""; $("#subtask-date").value = item.date || ""; $("#subtask-urgency").value = String(Math.min(4, item.urgency || 3)); $("#subtask-color").value = item.color || "sage";
  subtaskDialog.showModal();
}
function formatCompletionDate(date) {
  if (!date) return "date unknown";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}
$("#subtask-form").addEventListener("submit", async (event) => {
  event.preventDefault(); if (!openSubtaskContext) return;
  const { task, index } = openSubtaskContext, item = task.subtasks[index];
  item.notes = $("#subtask-notes").value; item.date = $("#subtask-date").value; item.urgency = Number($("#subtask-urgency").value); item.color = $("#subtask-color").value;
  try {
    const result = await supabaseClient.from("subtasks").update({ notes: item.notes, due_date: item.date || null, urgency: item.urgency, color: item.color }).eq("id", item.id);
    if (result.error && !result.error.message?.includes("column")) throw result.error;
    const active = task.subtasks.filter((subtask) => !subtask.done).sort((a, b) => (a.urgency ?? 99) - (b.urgency ?? 99));
    normalizeUrgency(active);
    await saveSubtaskOrder(active);
    persistLocal(); subtaskDialog.close(); openDetail(task.id);
  } catch (error) { alert(`Could not save subtask details: ${error.message}`); }
});
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
  const task = { id: id || crypto.randomUUID(), themeId: $("#task-theme").value, title: $("#task-title").value.trim(), status: nextStatus, urgency: Number($("#task-urgency").value), color: $("#task-color").value, date: $("#task-date").value, notes: $("#task-notes").value, subtasks: existing?.subtasks || [], imagePath: existing?.imagePath || "", completedAt: nextStatus === "completed" ? (existing?.completedAt || new Date().toISOString()) : null };
  try {
    const group = tasks.filter((item) => item.status !== "completed" && item.themeId === task.themeId && item.id !== existing?.id).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    group.splice(Math.max(0, Math.min(task.urgency - 1, group.length)), 0, task);
    normalizeUrgency(group);
    if (imageData instanceof File) task.imagePath = await uploadImage(imageData);
    await saveTask(task, existing);
    if (existing) Object.assign(existing, task); else tasks.push(task);
    await saveTaskOrder(group);
    persistLocal(); render(); taskDialog.close();
  } catch (error) { alert(`Could not save task: ${error.message}`); }
});
$("#delete-task").addEventListener("click", async () => { const id = $("#task-id").value; if (!id || !confirm("Delete this task?")) return; const { error } = await supabaseClient.from("tasks").delete().eq("id", id); if (error) return alert(`Could not delete task: ${error.message}`); tasks = tasks.filter((task) => task.id !== id); persistLocal(); render(); taskDialog.close(); });
$("#close-subtask-dialog").addEventListener("click", () => subtaskDialog.close()); $("#cancel-subtask-dialog").addEventListener("click", () => subtaskDialog.close());
$("#search-input").addEventListener("input", (event) => { searchTerm = event.target.value.toLowerCase().trim(); render(); });
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => { showingArchive = false; activeFilter = button.dataset.filter; document.querySelector(".filter.active")?.classList.remove("active"); button.classList.add("active"); $("#archive-toggle").classList.remove("active"); render(); }));
$("#archive-toggle").addEventListener("click", () => { showingArchive = !showingArchive; $("#archive-toggle").classList.toggle("active", showingArchive); document.querySelectorAll(".filter").forEach((button) => button.classList.remove("active")); if (!showingArchive) document.querySelector('[data-filter="all"]').classList.add("active"); render(); });
supabaseClient.auth.getSession().then(({ data: { session } }) => { if (session) boot(session); });
supabaseClient.auth.onAuthStateChange((_event, session) => { if (session && !currentUser) boot(session); });
