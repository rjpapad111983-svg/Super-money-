let members = JSON.parse(localStorage.getItem("mlm")) || [
  { id: 1, name: "Rajesh", left: 0, right: 0 }
];

let idCounter = members.length + 1;

function save() {
  localStorage.setItem("mlm", JSON.stringify(members));
}

function showPage(page) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("treePage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(page + "Page").style.display = "block";
  renderAll();
}

function getMember(id) {
  return members.find(m => m.id === id);
}

function addMember(parentId, side) {
  let parent = getMember(parentId);
  if (!parent) return;

  if (parent[side] !== 0) {
    alert("Already filled");
    return;
  }

  let newMember = {
    id: idCounter++,
    name: "Member " + idCounter,
    left: 0,
    right: 0
  };

  members.push(newMember);
  parent[side] = newMember.id;

  save();
  renderAll();
}

function editMember(id) {
  let m = getMember(id);
  let name = prompt("Enter name", m.name);
  if (name) {
    m.name = name;
  }
  save();
  renderAll();
}

// ✅ Correct binary pair logic
function countDownline(id) {
  if (id === 0) return 0;
  let m = getMember(id);
  return 1 + countDownline(m.left) + countDownline(m.right);
}

function countPairs(id) {
  let m = getMember(id);
  if (!m) return 0;

  let left = countDownline(m.left);
  let right = countDownline(m.right);

  return Math.min(left, right);
}

// ✅ Members Table
function renderMembers() {
  let html = `
  <tr>
    <th>Name</th>
    <th>ID</th>
    <th>Left</th>
    <th>Right</th>
    <th>Pairs</th>
    <th>Income</th>
    <th>Action</th>
  </tr>
  `;

  members.forEach(m => {
    let pairs = countPairs(m.id);
    let income = pairs * 3;

    html += `
    <tr>
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${m.left}</td>
      <td>${m.right}</td>
      <td>${pairs}</td>
      <td>₹${income}</td>
      <td>
        <button onclick="addMember(${m.id}, 'left')">L</button>
        <button onclick="addMember(${m.id}, 'right')">R</button>
        <button onclick="editMember(${m.id})">Edit</button>
      </td>
    </tr>
    `;
  });

  document.getElementById("membersTable").innerHTML = html;
}

// ✅ FIXED TREE (Proper left-right layout)
function renderTreeNode(id) {
  if (id === 0) return "";

  let m = getMember(id);
  let pairs = countPairs(id);
  let income = pairs * 3;

  return `
    <div style="text-align:center; margin:20px;">
      
      <div style="border:1px solid white; padding:10px; border-radius:8px; display:inline-block;">
        ${m.name}<br>
        Pair: ${pairs}<br>
        ₹${income}<br>
        <button onclick="addMember(${id}, 'left')">L</button>
        <button onclick="addMember(${id}, 'right')">R</button>
        <button onclick="editMember(${id})">Edit</button>
      </div>

      <div style="display:flex; justify-content:center; gap:40px; margin-top:10px;">
        <div>${renderTreeNode(m.left)}</div>
        <div>${renderTreeNode(m.right)}</div>
      </div>

    </div>
  `;
}

function renderTree() {
  document.getElementById("tree").innerHTML = renderTreeNode(1);
}

// ✅ Dashboard
function renderDashboard() {
  let totalMembers = members.length;
  let totalPairs = 0;
  let totalIncome = 0;

  members.forEach(m => {
    let pairs = countPairs(m.id);
    totalPairs += pairs;
    totalIncome += pairs * 3;
  });

  let companyProfit = totalMembers * 10 - totalIncome;

  document.getElementById("totalMembers").innerText = totalMembers;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalIncome").innerText = totalIncome;
  document.getElementById("companyProfit").innerText = companyProfit;
}

// ✅ Main render
function renderAll() {
  renderMembers();
  renderTree();
  renderDashboard();
}

renderAll();
