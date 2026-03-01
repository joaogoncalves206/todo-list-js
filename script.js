const form = document.getElementById("form");
const input = document.getElementById("taskInput");
const list = document.getElementById("list");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clearDone");
const totalNum = document.getElementById("totalNum");
const doneNum = document.getElementById("doneNum");

let prevTotal = 0;
let prevDone = 0;

const STORAGE_KEY = "joao_todo_list_v1";

let tasks = loadTasks();
render();

// adicionar tarefa
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text){
  input.classList.remove("shake");
  void input.offsetWidth; // re-trigger
  input.classList.add("shake");
  input.focus();
  return;
}

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
    createdAt: Date.now(),
  });

  input.value = "";
  saveTasks();
  render();
});

// limpar concluídas
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
});

function toggleDone(id){
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  saveTasks();
  render();
}

function removeTask(id){
  tasks = tasks.filter(x => x.id !== id);
  saveTasks();
  render();
}

function render(){
  list.innerHTML = "";

  for (const t of tasks){
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");

    const left = document.createElement("div");
    left.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = t.done;
    checkbox.addEventListener("change", () => toggleDone(t.id));

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = t.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const del = document.createElement("button");
    del.className = "del";
    del.type = "button";
    del.textContent = "Apagar";
    del.addEventListener("click", () => removeTask(t.id));

    li.appendChild(left);
    li.appendChild(del);

    list.appendChild(li);
  }

  updateCounter();
}

function animateNumber(el, prev, next){
  el.textContent = next;

  // remove classes pra reativar animação
  el.classList.remove("up", "down");
  void el.offsetWidth;

  if (next > prev) el.classList.add("up");
  else if (next < prev) el.classList.add("down");
}

function updateCounter(){
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;

  animateNumber(totalNum, prevTotal, total);
  animateNumber(doneNum, prevDone, done);

  prevTotal = total;
  prevDone = done;
}


function saveTasks(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}