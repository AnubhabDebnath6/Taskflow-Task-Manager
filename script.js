const STORAGE_KEY = "taskflow_tasks";
const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

const form = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const dueInput = document.getElementById("dueDate");
const formError = document.getElementById("formError");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const sortSelect = document.getElementById("sortSelect");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

let tasks = loadTasks();

function loadTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

function isOverdue(task) {
  return !task.completed && task.dueDate < todayString();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function validateForm(isEditing) {
  const title = titleInput.value.trim();
  const due = dueInput.value;

  if (!title) return "Task title is required.";
  if (title.length < 3) return "Title must be at least 3 characters long.";
  if (!due) return "Please select a due date.";
  if (!isEditing && due < todayString()) return "Due date cannot be in the past.";
  return "";
}

function resetForm() {
  form.reset();
  taskIdInput.value = "";
  priorityInput.value = "Medium";
  formTitle.textContent = "Add New Task";
  saveBtn.textContent = "Add Task";
  cancelBtn.classList.add("hidden");
  formError.textContent = "";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const editingId = taskIdInput.value;
  const message = validateForm(Boolean(editingId));

  if (message) {
    formError.textContent = message;
    return;
  }

  if (editingId) {
    const task = tasks.find(function (t) { return t.id === editingId; });
    if (task) {
      task.title = titleInput.value.trim();
      task.description = descInput.value.trim();
      task.priority = priorityInput.value;
      task.dueDate = dueInput.value;
    }
  } else {
    tasks.push({
      id: generateId(),
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      priority: priorityInput.value,
      createdAt: new Date().toISOString(),
      dueDate: dueInput.value,
      completed: false
    });
  }

  saveTasks();
  resetForm();
  render();
});

cancelBtn.addEventListener("click", resetForm);

[searchInput, statusFilter, priorityFilter, sortSelect].forEach(function (el) {
  el.addEventListener("input", render);
});

taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = button.dataset.id;

  if (button.dataset.action === "edit") startEdit(id);
  if (button.dataset.action === "delete") deleteTask(id);
});

taskList.addEventListener("change", function (event) {
  if (event.target.matches("input[type='checkbox']")) {
    toggleComplete(event.target.dataset.id);
  }
});

function startEdit(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descInput.value = task.description;
  priorityInput.value = task.priority;
  dueInput.value = task.dueDate;
  formTitle.textContent = "Edit Task";
  saveBtn.textContent = "Save Changes";
  cancelBtn.classList.remove("hidden");
  formError.textContent = "";
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  titleInput.focus();
}

function deleteTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  const sure = confirm('Delete "' + task.title + '" permanently? This cannot be undone.');
  if (!sure) return;
  tasks = tasks.filter(function (t) { return t.id !== id; });
  if (taskIdInput.value === id) resetForm();
  saveTasks();
  render();
}

function toggleComplete(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  render();
}

function getVisibleTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const priority = priorityFilter.value;

  let result = tasks.filter(function (task) {
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query);

    let matchesStatus = true;
    if (status === "pending") matchesStatus = !task.completed;
    if (status === "completed") matchesStatus = task.completed;
    if (status === "overdue") matchesStatus = isOverdue(task);

    const matchesPriority = priority === "all" || task.priority === priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortBy = sortSelect.value;
  result.sort(function (a, b) {
    switch (sortBy) {
      case "created-asc": return a.createdAt.localeCompare(b.createdAt);
      case "created-desc": return b.createdAt.localeCompare(a.createdAt);
      case "due-asc": return a.dueDate.localeCompare(b.dueDate);
      case "due-desc": return b.dueDate.localeCompare(a.dueDate);
      case "priority-desc": return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
      case "priority-asc": return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      case "title-asc": return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  return result;
}

function updateStats() {
  const completed = tasks.filter(function (t) { return t.completed; }).length;
  const overdue = tasks.filter(isOverdue).length;
  document.getElementById("statTotal").textContent = tasks.length;
  document.getElementById("statCompleted").textContent = completed;
  document.getElementById("statPending").textContent = tasks.length - completed;
  document.getElementById("statOverdue").textContent = overdue;
}

function render() {
  updateStats();
  const visible = getVisibleTasks();
  taskList.innerHTML = "";

  if (visible.length === 0) {
    emptyState.classList.remove("hidden");
    emptyState.textContent = tasks.length === 0
      ? "No tasks yet. Add your first task above to get started."
      : "No tasks match your search or filters.";
    return;
  }

  emptyState.classList.add("hidden");

  visible.forEach(function (task) {
    const overdue = isOverdue(task);
    const li = document.createElement("li");
    li.className = "task " + task.priority + (task.completed ? " is-done" : "") + (overdue ? " is-overdue" : "");

    const statusBadge = task.completed
      ? '<span class="badge ok">Completed</span>'
      : overdue
        ? '<span class="badge late">Overdue</span>'
        : '<span class="badge">Pending</span>';

    li.innerHTML =
      '<input type="checkbox" data-id="' + task.id + '"' + (task.completed ? " checked" : "") + ' aria-label="Mark complete">' +
      '<div class="task-body">' +
        '<div class="task-title">' + escapeHtml(task.title) + "</div>" +
        (task.description ? '<div class="task-desc">' + escapeHtml(task.description) + "</div>" : "") +
        '<div class="meta">' +
          '<span class="badge ' + task.priority + '">' + task.priority + " Priority</span>" +
          statusBadge +
          '<span class="badge">Due: ' + formatDate(task.dueDate) + "</span>" +
          '<span class="badge">Created: ' + formatDate(task.createdAt) + "</span>" +
        "</div>" +
      "</div>" +
      '<div class="task-actions">' +
        '<button class="small-btn edit" data-action="edit" data-id="' + task.id + '">Edit</button>' +
        '<button class="small-btn delete" data-action="delete" data-id="' + task.id + '">Delete</button>' +
      "</div>";

    taskList.appendChild(li);
  });
}

render();