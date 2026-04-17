// ===== DATA LOAD =====
let members = JSON.parse(localStorage.getItem("mlmData")) || [];

// ===== ROOT FIX =====
if (!members.length) {
  members = [{
    id: 1,
    name: "Rajesh",
    left: 0,
    right: 0
  }];
  saveData();
}

// ===== SAVE =====
function saveData() {
  localStorage.setItem("mlmData", JSON.stringify(members));
}

// ===== GET =====
function getMember(id) {
  return members.find(m => m.id == id);
}

// ===== ADD LEFT =====
function addLeft(parentId) {
  let parent = getMember(parentId);
  if (!parent) return alert("Parent missing");

  if (parent.left) return alert("Left full");

  let name = prompt("Name");
  if (!name) return;

  let id = Date.now();

  members.push({ id, name, left: 0, right: 0 });
  parent.left = id;

  saveData();
  renderAll();
}

// ===== ADD RIGHT =====
function addRight(parentId) {
  let parent = getMember(parentId);
  if (!parent) return alert("Parent missing");

  if (parent.right) return alert("Right full");

  let name = prompt("Name");
  if (!name) return;

  let id = Date.now();

  members.push({ id, name, left: 0, right: 0 });
  parent.right = id;

  saveData();
  renderAll();
}

// ===== COUNT =====
function countTree(id) {
  if (!id) return 0;

  let m = getMember(id);
  if (!m) return 0;

  return 1 + countTree(m.left) + countTree(m.right);
}

// ===== PAIRS =====
function getPairs(id) {
  let m = getMember(id);
  if (!m) return 0;

  let L = countTree(m.left);
  let R = countTree(m.right);

  return Math.min(L, R);
}

// ===== TREE =====
function renderNode(id) {
  let m = getMember(id);
  if (!m) return "";

  let p = getPairs(id);

  return `
    <div style="text-align:center;">
      <div class="node">
        ${m.name}<br>
        Pair: ${p}<br>
        ₹${p * 3}<br>

        <button onclick="addLeft(${id})">L</button>
        <button onclick="addRight(${id})">R</button>
      </div>

      <div class="children">
        ${m.left ? renderNode(m.left) : ""}
        ${m.right ? renderNode(m.right) : ""}
      </div>
    </div>
  `;
}

function renderTree() {
  let el = document.getElementById("tree");
  if (!el) return;

  el.innerHTML = renderNode(1);
}

// ===== DASHBOARD =====
function renderDashboard() {
  let totalPairs = 0;

  members.forEach(m => {
    totalPairs += getPairs(m.id);
  });

  let totalIncome = totalPairs * 3;
  let companyProfit = (members.length * 10) - totalIncome;

  document.getElementById("totalMembers").innerText = members.length;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalIncome").innerText = "₹" + totalIncome;
  document.getElementById("companyProfit").innerText = "₹" + companyProfit;
}

// ===== MEMBERS =====
function renderMembers() {
  let table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  members.forEach(m => {
    let L = countTree(m.left);
    let R = countTree(m.right);
    let P = Math.min(L, R);

    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${L}</td>
        <td>${R}</td>
        <td>${P}</td>
        <td>₹${P * 3}</td>
      </tr>
    `;
  });
}

// ===== MAIN =====
function renderAll() {
  renderTree();
  renderDashboard();
  renderMembers();
}

renderAll();
