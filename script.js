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
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  const active = document.getElementById(pageId);
  if (active) active.style.display = "block";
}

// ===== ADD MEMBER =====
function addMember(parentId, side) {

  const parent = members.find(m => m.id === parentId);
  if (!parent) return;

  if (side === "left" && parent.left) {
    alert("Left already filled");
    return;
  }

  if (side === "right" && parent.right) {
    alert("Right already filled");
    return;
  }

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

  if (side === "left") parent.left = id;
  if (side === "right") parent.right = id;

  calculateAll();
  saveData();
  renderAll();
}

// ===== EDIT MEMBER =====
function editMember(id) {

  const member = members.find(m => m.id === id);
  if (!member) return;

  const name = prompt("Edit name", member.name);
  if (!name) return;

  member.name = name;

  saveData();
  renderAll();
}

// ===== SAFE TEAM COUNT =====
function countTeam(id) {

  if (!id) return 0;

  const member = members.find(m => m.id === id);
  if (!member) return 0;

  let total = 1;

  if (member.left) total += countTeam(member.left);
  if (member.right) total += countTeam(member.right);

  return total;
}

// ===== FINAL PAIR CALCULATION (FIXED) =====
function calculateAll() {

  members.forEach(m => {

    let leftCount = m.left ? countTeam(m.left) : 0;
    let rightCount = m.right ? countTeam(m.right) : 0;

    // ✅ सही MLM logic
    m.pairs = Math.min(leftCount, rightCount);

    // ₹3 per pair
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

  if (members.length > 0) {
    tree.innerHTML = `<ul class="mlm-tree">${build(members[0])}</ul>`;
  }
}

// ===== MEMBERS TABLE =====
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

  const totalMembers = document.getElementById("totalMembers");
  const totalPairs = document.getElementById("totalPairs");
  const totalIncome = document.getElementById("totalIncome");
  const companyProfit = document.getElementById("companyProfit");

  if (!totalMembers) return;

  totalMembers.innerText = members.length;

  const pairs = members.reduce((a, b) => a + b.pairs, 0);
  const income = members.reduce((a, b) => a + b.income, 0);

  totalPairs.innerText = pairs;
  totalIncome.innerText = income;

  // 70% company profit
  companyProfit.innerText = (income * 0.7).toFixed(1);
}

// ===== RENDER ALL =====
function renderAll() {
  renderTree();
  renderMembers();
  renderDashboard();
}
