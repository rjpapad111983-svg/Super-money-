// 🌳 TREE
let tree = {
  id: 1,
  name: "Rajesh",
  left: null,
  right: null
};

// 💾 STORAGE
function saveData() {
  localStorage.setItem("mlmTree", JSON.stringify(tree));
}

function loadData() {
  let data = localStorage.getItem("mlmTree");
  if (data) tree = JSON.parse(data);
}

// ➕ ADD
function addMemberToNode(id, side) {
  let name = prompt("Enter name");
  if (!name) return;

  function add(node) {
    if (!node) return;

    if (node.id === id) {
      if (side === "left" && !node.left) {
        node.left = { id: Date.now(), name, left: null, right: null };
      } else if (side === "right" && !node.right) {
        node.right = { id: Date.now(), name, left: null, right: null };
      } else {
        alert("Position full");
      }
    }

    add(node.left);
    add(node.right);
  }

  add(tree);
  saveData();
  renderAll();
}

// ✏️ EDIT
function editMember(id) {
  let name = prompt("Enter new name");
  if (!name) return;

  function edit(node) {
    if (!node) return;
    if (node.id === id) node.name = name;

    edit(node.left);
    edit(node.right);
  }

  edit(tree);
  saveData();
  renderAll();
}

// ❌ DELETE
function deleteMember(id) {
  if (id === 1) return alert("Root delete not allowed");

  function remove(node) {
    if (!node) return;

    if (node.left && node.left.id === id) node.left = null;
    else if (node.right && node.right.id === id) node.right = null;
    else {
      remove(node.left);
      remove(node.right);
    }
  }

  remove(tree);
  saveData();
  renderAll();
}

// 👥 COUNT TOTAL MEMBERS
function countMembers(node) {
  if (!node) return 0;
  return 1 + countMembers(node.left) + countMembers(node.right);
}

// 🔥 DOWNLINE COUNT
function getDownlineCount(node) {
  if (!node) return 0;
  return 1 + getDownlineCount(node.left) + getDownlineCount(node.right);
}

// 🔥 MEMBER PAIR (CORRECT MLM)
function getMemberPair(node) {
  if (!node) return 0;

  let left = node.left ? getDownlineCount(node.left) : 0;
  let right = node.right ? getDownlineCount(node.right) : 0;

  return Math.min(left, right);
}

// 📊 DASHBOARD (ROOT BASED)
function updateDashboard() {
  let members = countMembers(tree);

  let left = tree.left ? getDownlineCount(tree.left) : 0;
  let right = tree.right ? getDownlineCount(tree.right) : 0;

  let pairs = Math.min(left, right);

  let commission = pairs * 3;
  let profit = members * 10 - commission;

  document.getElementById("members").innerText = members;
  document.getElementById("pairs").innerText = pairs;
  document.getElementById("commission").innerText = commission;
  document.getElementById("profit").innerText = profit;
}

// 📋 ALL MEMBERS
function getAllMembers(node, arr = []) {
  if (!node) return arr;

  arr.push(node);
  getAllMembers(node.left, arr);
  getAllMembers(node.right, arr);

  return arr;
}

// 📋 MEMBERS TABLE (DOWNLINE BASED)
function renderMembersTable() {
  let members = getAllMembers(tree);
  let html = "";

  members.forEach(m => {

    let left = m.left ? getDownlineCount(m.left) : 0;
    let right = m.right ? getDownlineCount(m.right) : 0;

    let pairs = getMemberPair(m);
    let income = pairs * 3;

    html += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${left}</td>
        <td>${right}</td>
        <td>₹${income}</td>
        <td>
          <button class="action-btn edit" onclick="editMember(${m.id})">Edit</button>
          <button class="action-btn delete" onclick="deleteMember(${m.id})">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("membersTable").innerHTML = html;
}

// 🌳 TREE UI
function renderNode(node) {
  if (!node) return "";

  return `
    <div class="node">
      <b>${node.name}</b><br>
      ID: ${node.id}<br>

      <button onclick="addMemberToNode(${node.id}, 'left')">L</button>
      <button onclick="addMemberToNode(${node.id}, 'right')">R</button><br>

      <button onclick="editMember(${node.id})">✏️</button>
      <button onclick="deleteMember(${node.id})">❌</button>

      <div class="children">
        ${renderNode(node.left)}
        ${renderNode(node.right)}
      </div>
    </div>
  `;
}

function renderTree() {
  document.getElementById("tree").innerHTML = renderNode(tree);
}

// 🔄 PAGE
function showPage(page) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("treePage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(page + "Page").style.display = "block";
}

// 🚀 INIT
function renderAll() {
  renderTree();
  renderMembersTable();
  updateDashboard();
}

loadData();
renderAll();
