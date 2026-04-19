// ===== DATA =====
let members = JSON.parse(localStorage.getItem("mlm_members")) || [
  { id: 1, name: "Rajesh", left: null, right: null }
];

let lastId = members.length;

// ===== SAVE =====
function save() {
  localStorage.setItem("mlm_members", JSON.stringify(members));
}

// ===== NAVIGATION FIX =====
function showPage(page) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("treePage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(page).style.display = "block";
}

// ===== BUTTON FIX (IMPORTANT) =====
window.addEventListener("DOMContentLoaded", () => {

  document.querySelector(".btn-dashboard")?.addEventListener("click", () => showPage("dashboard"));
  document.querySelector(".btn-tree")?.addEventListener("click", () => showPage("treePage"));
  document.querySelector(".btn-members")?.addEventListener("click", () => showPage("membersPage"));
  document.querySelector(".btn-add")?.addEventListener("click", addRootMember);

  renderAll();
});

// ===== ADD ROOT MEMBER =====
function addRootMember() {
  let name = prompt("Member Name");
  if (!name) return;

  let newId = ++lastId;
  members.push({ id: newId, name, left: null, right: null });

  save();
  renderAll();
}

// ===== ADD LEFT =====
function addLeft(id) {
  let parent = members.find(m => m.id == id);
  if (!parent || parent.left) return;

  let name = prompt("Left Name");
  if (!name) return;

  let newId = ++lastId;
  members.push({ id: newId, name, left: null, right: null });
  parent.left = newId;

  save();
  renderAll();
}

// ===== ADD RIGHT =====
function addRight(id) {
  let parent = members.find(m => m.id == id);
  if (!parent || parent.right) return;

  let name = prompt("Right Name");
  if (!name) return;

  let newId = ++lastId;
  members.push({ id: newId, name, left: null, right: null });
  parent.right = newId;

  save();
  renderAll();
}

// ===== EDIT =====
function editMember(id) {
  let m = members.find(x => x.id == id);
  if (!m) return;

  let newName = prompt("Edit Name", m.name);
  if (!newName) return;

  m.name = newName;

  save();
  renderAll();
}

// ===== COUNT =====
function countTree(id) {
  if (!id) return 0;

  let m = members.find(x => x.id == id);
  if (!m) return 0;

  return 1 + countTree(m.left) + countTree(m.right);
}

// ===== PAIR =====
function getPairData(m) {
  let left = countTree(m.left);
  let right = countTree(m.right);

  let pair = Math.min(left, right);
  let income = pair * 3;

  return { pair, income };
}

// ===== TREE =====
function renderTree() {
  let root = members[0];
  let el = document.getElementById("tree");
  if (!el) return;

  function build(id) {
    let m = members.find(x => x.id == id);
    if (!m) return "";

    let d = getPairData(m);

    return `
    <div class="node">
      ${m.name}<br>
      Pair:${d.pair}<br>₹${d.income}<br>

      <button onclick="addLeft(${m.id})">L</button>
      <button onclick="addRight(${m.id})">R</button>
      <button onclick="editMember(${m.id})">Edit</button>

      <div class="children">
        ${m.left ? build(m.left) : ""}
        ${m.right ? build(m.right) : ""}
      </div>
    </div>`;
  }

  el.innerHTML = build(root.id);
}

// ===== TABLE =====
function renderTable() {
  let el = document.getElementById("memberTable");
  if (!el) return;

  el.innerHTML = members.map(m => {
    let d = getPairData(m);

    return `
    <tr>
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${countTree(m.left)}</td>
      <td>${countTree(m.right)}</td>
      <td>${d.pair}</td>
      <td>₹${d.income}</td>
    </tr>`;
  }).join("");
}

// ===== DASHBOARD =====
function renderDashboard() {
  let totalMembers = members.length;
  let totalPairs = 0;
  let totalIncome = 0;

  members.forEach(m => {
    let d = getPairData(m);
    totalPairs += d.pair;
    totalIncome += d.income;
  });

  document.getElementById("totalMembers").innerText = totalMembers;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalIncome").innerText = "₹" + totalIncome;
  document.getElementById("companyProfit").innerText =
    "₹" + (totalMembers * 10 - totalIncome);
}

// ===== ALL =====
function renderAll() {
  renderTree();
  renderTable();
  renderDashboard();
}
