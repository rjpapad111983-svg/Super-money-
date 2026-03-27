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

function addMember(side) {
  addMemberToNode(1, side);
}

// ✏️ EDIT
function editMember(id) {
  let name = prompt("New name");
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

// 👥 COUNT
function countMembers(node) {
  if (!node) return 0;
  return 1 + countMembers(node.left) + countMembers(node.right);
}

// 💰 PAIRS
function calculatePairs(node) {
  if (!node) return { left: 0, right: 0, pairs: 0 };

  let left = calculatePairs(node.left);
  let right = calculatePairs(node.right);

  let l = node.left ? 1 + left.left + left.right : 0;
  let r = node.right ? 1 + right.left + right.right : 0;

  let pair = Math.min(l, r);

  return {
    left: l,
    right: r,
    pairs: pair + left.pairs + right.pairs
  };
}

// 📊 DASHBOARD
function updateDashboard() {
  let data = calculatePairs(tree);
  let members = countMembers(tree);

  document.getElementById("members").innerText = members;
  document.getElementById("pairs").innerText = data.pairs;
  document.getElementById("commission").innerText = data.pairs * 3;
  document.getElementById("profit").innerText = members * 10 - data.pairs * 3;
}

// 📋 MEMBERS
function getAllMembers(node, arr = []) {
  if (!node) return arr;

  arr.push(node);
  getAllMembers(node.left, arr);
  getAllMembers(node.right, arr);

  return arr;
}

function renderMembersTable() {
  let members = getAllMembers(tree);
  let html = "";

  members.forEach(m => {
    let left = m.left ? 1 : 0;
    let right = m.right ? 1 : 0;

    let pairs = calculatePairs(m).pairs;

    html += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${left}</td>
        <td>${right}</td>
        <td>₹${pairs * 3}</td>
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
      ${node.name} (ID: ${node.id})<br><br>

      <button onclick="addMemberToNode(${node.id}, 'left')">Left</button>
      <button onclick="addMemberToNode(${node.id}, 'right')">Right</button>
      <br><br>

      <button onclick="editMember(${node.id})">Edit</button>
      <button onclick="deleteMember(${node.id})">Delete</button>

      <div style="display:flex;">
        <div>${renderNode(node.left)}</div>
        <div>${renderNode(node.right)}</div>
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

  if (page === "dashboard") document.getElementById("dashboardPage").style.display = "block";
  if (page === "tree") document.getElementById("treePage").style.display = "block";
  if (page === "members") document.getElementById("membersPage").style.display = "block";
}

// 🚀 INIT
function renderAll() {
  renderTree();
  renderMembersTable();
  updateDashboard();
}

loadData();
renderAll();
