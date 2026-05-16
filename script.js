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
      income: 0,
      level: 1,
      isSub: false
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

// ===== ADD MEMBER =====
function addMember(parentId, side) {

  const parent = members.find(m => m.id === parentId);
  if (!parent) return;

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
    income: 0,
    level: 1,
    isSub: name.toLowerCase().includes("sub")
  };

  let oldChildId = 0;

  if (side === "left") {
    oldChildId = parent.left;
    parent.left = id;
  } else {
    oldChildId = parent.right;
    parent.right = id;
  }

  if (oldChildId) {
    const oldChild = members.find(m => m.id === oldChildId);
    if (oldChild) {
      oldChild.parent = id;
      newMember.left = oldChildId;
    }
  }

  members.push(newMember);

  calculateAll();
  saveData();
  renderAll();
}

// ===== TEAM COUNT =====
function countTeam(id) {
  if (!id) return 0;

  const m = members.find(x => x.id === id);
  if (!m) return 0;

  return 1 + countTeam(m.left) + countTeam(m.right);
}

// ===== SETTINGS =====
const MAX_CAP = 1000;

function getCap(level) {
  if (level === 1) return 180;
  if (level === 2) return 200;
  if (level === 3) return 250;
  if (level === 4) return 300;
  if (level === 5) return 500;
  if (level === 6) return 1000;
  return 1000;
}

// ===== PASS TO CHILD =====
function passToChildren(member, amount) {

  const left = members.find(x => x.id === member.left);
  const right = members.find(x => x.id === member.right);

  let half = amount / 2;

  if (left && left.income < MAX_CAP) left.income += half;
  if (right && right.income < MAX_CAP) right.income += half;
}

// ===== MAIN CALCULATION =====
function calculateAll() {

  let companyProfit = 0;

  // 🔥 IMPORTANT RESET
  members.forEach(m => {
    m.income = 0;
    m.pairs = 0;
  });

  members.forEach(m => {

    let leftCount = m.left ? countTeam(m.left) : 0;
    let rightCount = m.right ? countTeam(m.right) : 0;

    m.pairs = Math.min(leftCount, rightCount);

    let earning = m.pairs * 3;

    // 🔥 SUB MEMBER
    if (m.isSub) {
      m.income = earning;
      return;
    }

    let cap = getCap(m.level || 1);

    if (m.income >= MAX_CAP) return;

    let total = m.income + earning;

    // 🔴 HARD CAP
    if (total > MAX_CAP) {
      let extra = total - MAX_CAP;
      m.income = MAX_CAP;
      companyProfit += extra;
      return;
    }

    // 🟡 LEVEL CAP
    if (total >= cap) {

      let extra = total - cap;
      m.income = cap;

      const left = members.find(x => x.id === m.left);
      const right = members.find(x => x.id === m.right);

      // level upgrade
      if (left && right && left.income >= cap && right.income >= cap) {
        m.level = (m.level || 1) + 1;
      } else {
        passToChildren(m, extra);
      }

      return;
    }

    m.income = total;
  });

  window.companyProfit = companyProfit;
}

// ===== RENDER TREE =====
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
  ₹${m.income}<br><br>

  <button onclick="addMember(${m.id}, 'left')">L+</button>
  <button onclick="addMember(${m.id}, 'right')">R+</button><br>

  <button onclick="editMember(${m.id})">Edit</button>
  <button onclick="deleteMember(${m.id})">Delete</button>
</div>

      <ul>
        ${m.left ? build(map[m.left]) : ""}
        ${m.right ? build(map[m.right]) : ""}
      </ul>
    </li>
    `;
  }

  if (members.length > 0) {
    tree.innerHTML = `<ul>${build(members[0])}</ul>`;
  }
}

// ===== MEMBERS TABLE =====
function renderMembers() {

  const table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  members.forEach(m => {

    let leftCount = m.left ? countTeam(m.left) : 0;
    let rightCount = m.right ? countTeam(m.right) : 0;

    table.innerHTML += `
    <tr>
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${leftCount}</td>
      <td>${rightCount}</td>
      <td>${m.pairs}</td>
      <td>₹${m.income}</td>
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

  let pairs = members.reduce((a, b) => a + b.pairs, 0);
  let income = members.reduce((a, b) => a + b.income, 0);

  totalPairs.innerText = pairs;
  totalIncome.innerText = income;
  companyProfit.innerText = window.companyProfit || 0;
}

// ===== RENDER ALL =====
function renderAll() {
  renderTree();
  renderMembers();
  renderDashboard();
}
function editMember(id) {
  const m = members.find(x => x.id === id);
  if (!m) return;

  const name = prompt("Edit name", m.name);
  if (!name) return;

  m.name = name;
  saveData();
  renderAll();
}

function deleteMember(id) {
  if (id === 1) {
    alert("Root delete nahi kar sakte");
    return;
  }

  function removeTree(mid) {
    const m = members.find(x => x.id === mid);
    if (!m) return;

    if (m.left) removeTree(m.left);
    if (m.right) removeTree(m.right);

    members = members.filter(x => x.id !== mid);
  }

  removeTree(id);
  saveData();
  renderAll();
}
