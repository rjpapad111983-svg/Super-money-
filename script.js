// ===== DATA =====
let members = JSON.parse(localStorage.getItem("members")) || [];

// ===== SAVE =====
function saveData() {
  localStorage.setItem("members", JSON.stringify(members));
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

// ===== EDIT MEMBER =====
function editMember(id) {
  const member = members.find(m => m.id === id);
  const name = prompt("Edit name", member.name);
  if (!name) return;

  member.name = name;
  saveData();
  renderAll();
}

// ===== CALCULATE PAIR =====
function countDownline(id) {
  const member = members.find(m => m.id === id);
  if (!member) return 0;

  return (
    1 +
    countDownline(member.left) +
    countDownline(member.right)
  );
}

function calculateAll() {
  members.forEach(m => {
    const leftCount = countDownline(m.left);
    const rightCount = countDownline(m.right);

    m.pairs = Math.min(leftCount, rightCount);
    m.income = m.pairs * 3; // ₹3 per pair
  });
}

// ===== TREE =====
function renderTree() {
  const tree = document.getElementById("tree");
  if (!tree) return;

  tree.innerHTML = "";

  if (members.length === 0) return;

  const map = {};
  members.forEach(m => map[m.id] = m);

  function buildNode(member) {
    if (!member) return "";

    return `
      <li>
        <div class="node-card">
          <b>${member.name}</b><br>
          Pair: ${member.pairs}<br>
          ₹${member.income}<br>

          <button onclick="addMember(${member.id}, 'left')">L</button>
          <button onclick="addMember(${member.id}, 'right')">R</button>
          <button onclick="editMember(${member.id})">Edit</button>
        </div>

        <ul>
          ${buildNode(map[member.left])}
          ${buildNode(map[member.right])}
        </ul>
      </li>
    `;
  }

  tree.innerHTML = `
    <ul class="mlm-tree">
      ${buildNode(members[0])}
    </ul>
  `;
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
  document.getElementById("totalMembers").innerText = members.length;

  let totalPairs = members.reduce((a, b) => a + b.pairs, 0);
  let totalIncome = members.reduce((a, b) => a + b.income, 0);

  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalIncome").innerText = totalIncome;
  document.getElementById("companyProfit").innerText = totalIncome * 0.7;
}

// ===== MENU NAV =====
function showPage(page) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("treePage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(page).style.display = "block";
}

// ===== RENDER ALL =====
function renderAll() {
  renderTree();
  renderMembers();
  renderDashboard();
}

// ===== INIT =====
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
