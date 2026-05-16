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
    level: 1,
  
  };

  // 🔥 STEP 1: old child save karo
  let oldChildId = 0;

  if (side === "left") {
    oldChildId = parent.left;
    parent.left = id;
  } else {
    oldChildId = parent.right;
    parent.right = id;
  }

  // 🔥 STEP 2: agar old child tha to usko newMember ke niche lagao
  if (oldChildId) {
    const oldChild = members.find(m => m.id === oldChildId);

    if (oldChild) {
      oldChild.parent = id;

      // 👉 auto adjust (left side pe lagao)
      newMember.left = oldChildId;
    }
  }

  members.push(newMember);

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
function deleteMember(id) {

  if (id === 1) {
    alert("Root delete nahi kar sakte");
    return;
  }

  const member = members.find(m => m.id === id);
  if (!member) return;

  const parent = members.find(m => m.id === member.parent);

  if (parent) {
    if (parent.left === id) parent.left = 0;
    if (parent.right === id) parent.right = 0;
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
  calculateAll();
  renderAll();
}
// ===== TEAM COUNT =====
function countTeam(id) {
  if (!id) return 0;

  const member = members.find(m => m.id === id);
  if (!member) return 0;

  let total = 1;

  total += countTeam(member.left);
  total += countTeam(member.right);

  return total;
}

// ===== PAIR CALCULATION =====
function calculateAll() {

  members.forEach(m => {

    let leftCount = m.left ? countTeam(m.left) : 0;
    let rightCount = m.right ? countTeam(m.right) : 0;

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

function passToChildren(member, amount) {
  let left = members.find(x => x.id === member.left);
  let right = members.find(x => x.id === member.right);

  let half = amount / 2;

  if (left && left.income < MAX_CAP) left.income += half;
  if (right && right.income < MAX_CAP) right.income += half;
}

function calculateAll() {

  let companyProfit = 0;

  members.forEach(m => {

    let leftCount = m.left ? countTeam(m.left) : 0;
    let rightCount = m.right ? countTeam(m.right) : 0;

    m.pairs = Math.min(leftCount, rightCount);

    let earning = m.pairs * 3;

    let cap = getCap(m.level || 1);

    if (m.income >= MAX_CAP) return;

    let total = m.income + earning;

    if (total > MAX_CAP) {
      let extra = total - MAX_CAP;
      m.income = MAX_CAP;
      companyProfit += extra;
      return;
    }

    if (total >= cap) {

      let extra = total - cap;
      m.income = cap;

      const left = members.find(x => x.id === m.left);
      const right = members.find(x => x.id === m.right);

      if (left && right && left.income >= cap && right.income >= cap) {
        m.level = (m.level || 1) + 1;
      } else {
        passToChildren(m, extra);
        return;
      }

    } else {
      m.income = total;
    }

  });

  window.companyProfit = companyProfit;
}

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

<button onclick="addMember(${m.id}, 'left')">L</button>
<button onclick="addMember(${m.id}, 'right')">R</button>

<button onclick="editMember(${m.id})">Edit</button>
<button onclick="deleteMember(${m.id})">Delete</button>
<button onclick="focusMember(${m.id})">View</button>
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
        <td><button onclick="editMember(${m.id})">Edit</button></td>
      </tr>
    `;
  });
}

// ===== DASHBOARD (FINAL FIX) =====
function renderDashboard() {

  const totalMembers = document.getElementById("totalMembers");
  const totalPairs = document.getElementById("totalPairs");
  const totalIncome = document.getElementById("totalIncome");
  const companyProfit = document.getElementById("companyProfit");

  if (!totalMembers) return;

  totalMembers.innerText = members.length;

  // ✅ total income (all members)
  const totalIncomeValue = members.reduce((a, b) => a + b.income, 0);

  // optional pairs
  const totalPairsValue = members.reduce((a, b) => a + b.pairs, 0);

  totalPairs.innerText = totalPairsValue;
  totalIncome.innerText = totalIncomeValue;

  // ✅ REAL COMPANY PROFIT
  const totalCollection = members.length * 10; // ₹10 per member
  const profit = totalCollection - totalIncomeValue;

  companyProfit.innerText = window.companyProfit || 0;
}

// ===== RENDER ALL =====
function renderAll() {
  renderTree();
  renderMembers();
  renderDashboard();
}
// ===== SEARCH MEMBER =====
function searchMember() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#membersTable tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    if (text.includes(input)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// ✅ यहीं नीचे add करना है
function showTeam() {
  const name = document.getElementById("teamSearch").value.toLowerCase();

  const member = members.find(m => m.name.toLowerCase() === name);

  if (!member) {
    alert("Member not found");
    return;
  }

  function getTeam(id) {
    let list = [];

    const m = members.find(x => x.id === id);
    if (!m) return list;

    list.push(m);

    if (m.left) list = list.concat(getTeam(m.left));
    if (m.right) list = list.concat(getTeam(m.right));

    return list;
  }

  const team = getTeam(member.id);

  const table = document.getElementById("membersTable");
  table.innerHTML = "";

  team.forEach(m => {
    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${m.left || 0}</td>
        <td>${m.right || 0}</td>
        <td>${m.pairs}</td>
        <td>₹${m.income}</td>
      </tr>
    `;
  });
}
// ===== SHOW TEAM IN TREE =====
function showTeamTree() {
  const name = document.getElementById("teamSearch").value.toLowerCase();

  const member = members.find(m => m.name.toLowerCase() === name);

  if (!member) {
    alert("Member not found");
    return;
  }

  const tree = document.getElementById("tree");
  tree.innerHTML = "";

  const map = {};
  members.forEach(m => map[m.id] = m);

  function build(m) {
    if (!m) return "";

    return `
      <li>
        <div class="node-card" style="border:2px solid yellow;">
          <b>${m.name}</b><br>
          Pair: ${m.pairs}<br>
          ₹${m.income}
        </div>

        <ul>
          ${m.left ? build(map[m.left]) : ""}
          ${m.right ? build(map[m.right]) : ""}
        </ul>
      </li>
    `;
  }

  tree.innerHTML = `<ul class="mlm-tree">${build(member)}</ul>`;
function focusMember(id) {
   const member = members.find(m => m.id === id);
   if (!member) return;

   const tree = document.getElementById("tree");

   function build(m) {
      if (!m) return "";

      return `
      <li>
        <div class="node-card">
          <b>${m.name}</b><br>
          Pair: ${m.pairs}<br>
          ₹${m.income}
        </div>

        <ul>
          ${build(members.find(x => x.id === m.left))}
          ${build(members.find(x => x.id === m.right))}
        </ul>
      </li>
      `;
   }

   tree.innerHTML = `<ul class="mlm-tree">${build(member)}</ul>`;
}
  // 👉 auto tree page open
  showPage("treePage");
}
