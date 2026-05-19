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

  if (side === "left") parent.left = id;
  else parent.right = id;

  members.push(newMember);

  saveData();
  calculateAll();
  renderAll();
}

// ===== COUNT TEAM =====
function countTeam(id) {
  if (!id) return 0;
  const m = members.find(x => x.id === id);
  if (!m) return 0;
  return 1 + countTeam(m.left) + countTeam(m.right);
}

// ===== LEVEL CAP =====
function getCap(level) {
  if (level === 1) return 180;
  if (level === 2) return 200;
  if (level === 3) return 250;
  if (level === 4) return 300;
  if (level === 5) return 500;
  if (level === 6) return 1000;
  return 1000;
}

// ===== PASS DOWN =====
function passToChildren(member, amount) {

  let left = members.find(x => x.id === member.left);
  let right = members.find(x => x.id === member.right);

  let distributed = 0;

  if (left && right) {
    let half = amount / 2;
    left.income += half;
    right.income += half;
    distributed = amount;
  }
  else if (left) {
    left.income += amount;
    distributed = amount;
  }
  else if (right) {
    right.income += amount;
    distributed = amount;
  }

  // remaining → company
  let remaining = amount - distributed;
  if (remaining > 0) {
    window.companyProfit += remaining;
  }
}

// ===== MAIN CALCULATION =====
function calculateAll() {

  window.companyProfit = 0;

  // RESET
  members.forEach(m => {
    m.income = 0;
    m.pairs = 0;
  });

  members.forEach(m => {

    let leftCount = countTeam(m.left);
    let rightCount = countTeam(m.right);

    m.pairs = Math.min(leftCount, rightCount);

    // 🔥 BUSINESS
    let totalBusiness = m.pairs * 10;

    // 🔥 MEMBER INCOME
    let memberIncome = m.pairs * 3;

    // 🔥 COMPANY CUT
    let companyCut = m.pairs * 7;

    // SUB MEMBER
    if (m.isSub) {
      m.income = memberIncome;
      window.companyProfit += companyCut;
      return;
    }

    let cap = getCap(m.level);

    if (memberIncome > cap) {

      let extra = memberIncome - cap;

      m.income = cap;

      // overflow नीचे
      passToChildren(m, extra);

    } else {
      m.income = memberIncome;
    }

    // company profit
    window.companyProfit += companyCut;

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

          <button onclick="addMember(${m.id}, 'left')">L+</button>
          <button onclick="addMember(${m.id}, 'right')">R+</button><br>

          <button onclick="editMember(${m.id})">Edit</button>
          <button onclick="deleteMember(${m.id})">Delete</button>
        </div>

        ${(m.left || m.right) ? `
        <ul>
          ${m.left ? build(map[m.left]) : "<li></li>"}
          ${m.right ? build(map[m.right]) : "<li></li>"}
        </ul>` : ""}
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

    let left = countTeam(m.left);
    let right = countTeam(m.right);

    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${left}</td>
        <td>${right}</td>
        <td>${m.pairs}</td>
        <td>₹${m.income}</td>
        <td>
          <button onclick="editMember(${m.id})">Edit</button>
          <button onclick="deleteMember(${m.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ===== DASHBOARD =====
function renderDashboard() {

  document.getElementById("totalMembers").innerText = members.length;

  let pairs = members.reduce((a, b) => a + b.pairs, 0);
  let income = members.reduce((a, b) => a + b.income, 0);

  document.getElementById("totalPairs").innerText = pairs;
  document.getElementById("totalIncome").innerText = income;
  document.getElementById("companyProfit").innerText = window.companyProfit || 0;
}

// ===== EDIT =====
function editMember(id) {
  const m = members.find(x => x.id === id);
  if (!m) return;

  const name = prompt("Edit name", m.name);
  if (!name) return;

  m.name = name;

  saveData();
  renderAll();
}

// ===== DELETE =====
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

  members.forEach(m => {
    if (m.left === id) m.left = 0;
    if (m.right === id) m.right = 0;
  });

  saveData();
  calculateAll();
  renderAll();
}

// ===== RENDER ALL =====
function renderAll() {
  renderTree();
  renderMembers();
  renderDashboard();
  }
