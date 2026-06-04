// app.js — Taskboard logic

const STATUSES = ['todo', 'doing', 'done'];

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

/* ── helpers ───────────────────────────────────────────── */
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function nextStatus(s) {
  const i = STATUSES.indexOf(s);
  return STATUSES[(i + 1) % STATUSES.length];
}

/* ── render ────────────────────────────────────────────── */
function render() {
  STATUSES.forEach(status => {
    const container = document.getElementById('cards-' + status);
    const countEl   = document.getElementById('count-' + status);
    const items     = tasks.filter(t => t.status === status);

    container.innerHTML = '';
    items.forEach(task => container.appendChild(buildCard(task)));

    countEl.textContent = items.length;
    countEl.classList.toggle('has-items', items.length > 0);
  });
}

function buildCard(task) {
  const card = document.createElement('div');
  card.className = 'card' + (task.status === 'done' ? ' done' : '');
  card.dataset.id = task.id;

  const text = document.createElement('span');
  text.className = 'card-text';
  text.textContent = task.text;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  // advance button (→)
  const advance = document.createElement('button');
  advance.className = 'btn-icon';
  advance.title = 'Move forward';
  advance.textContent = '→';
  advance.onclick = () => {
    const t = tasks.find(x => x.id === task.id);
    if (t) { t.status = nextStatus(t.status); save(); render(); }
  };

  // delete button (×)
  const del = document.createElement('button');
  del.className = 'btn-icon del';
  del.title = 'Delete';
  del.textContent = '×';
  del.onclick = () => {
    tasks = tasks.filter(x => x.id !== task.id);
    save(); render();
  };

  actions.append(advance, del);
  card.append(text, actions);
  return card;
}

/* ── add task ───────────────────────────────────────────── */
function addTask() {
  const input = document.getElementById('task-input');
  const text  = input.value.trim();
  if (!text) return;

  tasks.push({ id: uid(), text, status: 'todo' });
  save();
  render();
  input.value = '';
  input.focus();
}

document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

/* ── seed data (first run only) ─────────────────────────── */
if (tasks.length === 0) {
  tasks = [
    { id: uid(), text: 'Read the Git workflow guide',           status: 'done'  },
    { id: uid(), text: 'Initialise this project as a Git repo', status: 'doing' },
    { id: uid(), text: 'Create a feature branch',               status: 'todo'  },
    { id: uid(), text: 'Style the card component',              status: 'todo'  },
    { id: uid(), text: 'Push to GitHub',                        status: 'todo'  },
  ];
  save();
}

render();
