// ====== DATA ======
let members = JSON.parse(localStorage.getItem("mlm_members")) || [
  { id: 1, name: "Rajesh", left: null, right: null }
];

let lastId = members.length;

// ====== SAVE ======
function save() {
  localStorage.setItem("mlm_members", JSON.stringify(members));
}

// ====== ADD MEMBER ======
function addLeft(id) {
  let parent = members.find(m => m.id == id);
  if (!parent || parent.left) return;

  let name = prompt("Left Member Name");
  if (!name) return;

  let newId = ++lastId;
  members.push({ id: newId, name, left: null, right: null });
  parent.left = newId;

  save();
  renderAll();
}

function addRight(id) {
  let parent = members.find(m => m.id == id);
  if (!parent || parent.right) return;

  let name = prompt("Right Member Name");
  if (!name) return;

  let newId = ++lastId;
  members.push({ id: newId, name, left: null, right: null });
  parent.right = newId;

  save();
  renderAll();
}

// ====== EDIT ======
function editMember(id) {
  let m = members.find(x => x.id == id);
  if (!m) return;

  let newName = prompt("Edit Name", m.name);
  if (!newName) return;

  m.name = newName;

  save();
  renderAll();
}

// ====== COUNT TREE ======
function countTree(id) {
  if (!id) return 0;

  let m = members.find(x => x.id == id);
  if (!m) return 0;

  return (
    1 +
    countTree(m.left) +
    countTree(m.right)
  );
}

// ====== PAIR CALC ======
function getPairData(m) {
  let leftCount = countTree(m.left);
  let rightCount = countTree(m.right);

  let pair = Math.min(leftCount, rightCount);
  let income = pair * 3;

  return { pair, income };
}

// ====== TREE RENDER ======
function renderTree() {
  let root = members[0];
  let container = document.getElementById("tree");
  if (!container) return;

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

  container.innerHTML = build(root.id);
}

// ====== TABLE ======
function renderTable() {
  let table = document.getElementById("memberTable");
  if (!table) return;

  table.innerHTML = members.map(m => {
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

// ====== DASHBOARD ======
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
  document.getElementById("companyProfit").innerText = "₹" + (totalMembers * 10 - totalIncome);
}

// ====== ALL RENDER ======
function renderAll() {
  renderTree();
  renderTable();
  renderDashboard();
}

// ====== INIT ======
window.onload = function () {
  renderAll();
};
