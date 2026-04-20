// ===== DATA =====
let members = JSON.parse(localStorage.getItem("members")) || [];

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {

  if (members.length === 0) {
    members.push({
      id: 1,
      name: "Rajesh",
      left: 0,
      right: 0,
      parent: 0,
      pairs: 0,
      income: 0
    });
    saveData();
  }

  calculateAll();
  renderAll();
});

// ===== SAVE =====
function saveData() {
  localStorage.setItem("members", JSON.stringify(members));
}

// ===== PAGE SWITCH =====
function showPage(pageId) {
  ["dashboardPage", "treePage", "membersPage"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  document.getElementById(pageId).style.display = "block";
}

// ===== ADD MEMBER =====
function addMember(parentId, side) {
  const name = prompt("Enter member name");
  if (!name) return;

  const id = Date.now();

  const newMember = {
    id,
    name,
    left: 0,
    right: 0,
    parent: parentId,
    pairs: 0,
    income: 0
  };

  members.push(newMember);

  const parent = members.find(m => m.id === parentId);

  if (side === "left") parent.left = id;
  if (side === "right") parent.right = id;

  calculateAll();
  saveData();
  renderAll();
}

// ===== EDIT =====
function editMember(id) {
  const member = members.find(m => m.id === id);
  const name = prompt("Edit name", member.name);
  if (!name) return;

  member.name = name;
  saveData();
  renderAll();
}

// ===== COUNT =====
function countDownline(id) {
  const m = members.find(x => x.id === id);
  if (!m) return 0;

  return 1 + countDownline(m.left) + countDownline(m.right);
}

// ===== CALCULATION =====
function calculateAll() {
  members.forEach(m => {
    const left = countDownline(m.left);
    const right = countDownline(m.right);

    m.pairs = Math.min(left, right);
    m.income = m.pairs * 3;
  });
}

// ===== TREE =====
function renderTree() {
  const tree = document.getElementById("tree");
  if (!tree) return;

  tree.innerHTML = "";

  const map = {};
  members.forEach(m => map[m.id] = m);

  function build(m) {
    if (!m) return "";

    return `
      <li>
        <div class="node-card">
          <b>${m.name}</b><br>
          Pair: ${m.pairs}<br>
          ₹${m.income}<br>

          <button onclick="addMember(${m.id},'left')">L</button>
          <button onclick="addMember(${m.id},'right')">R</button>
          <button onclick="editMember(${m.id})">Edit</button>
        </div>

        <ul>
          ${build(map[m.left])}
          ${build(map[m.right])}
        </ul>
      </li>
    `;
  }

  tree.innerHTML = `<ul class="mlm-tree">${build(members[0])}</ul>`;
}

// ===== MEMBERS =====
function renderMembers() {
  const table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  members.forEach(m => {
    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${m.left || 0}</td>
        <td>${m.right || 0}</td>
        <td>${m.pairs}</td>
        <td>₹${m.income}</td>
        <td><button onclick="editMember(${m.id})">Edit</button></td>
      </tr>
    `;
  });
}

// ===== DASHBOARD =====
function renderDashboard() {
  document.getElementById("totalMembers").innerText = members.length;

  const totalPairs = members.reduce((a,b)=>a+b.pairs,0);
  const totalIncome = members.reduce((a,b)=>a+b.income,0);

  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalIncome").innerText = totalIncome;
  document.getElementById("companyProfit").innerText = (totalIncome * 0.7).toFixed(1);
}

// ===== RENDER =====
function renderAll() {
  renderTree();
  renderMembers();
  renderDashboard();
}
