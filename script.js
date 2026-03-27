// 🌳 TREE DATA
let tree = {
  id: 1,
  name: "Rajesh",
  left: null,
  right: null
};

// 💾 SAVE DATA
function saveData() {
  localStorage.setItem("mlmTree", JSON.stringify(tree));
}

// 📂 LOAD DATA
function loadData() {
  let data = localStorage.getItem("mlmTree");
  if (data) {
    tree = JSON.parse(data);
  }
}

// ➕ ADD MEMBER
function addMemberToNode(id, side) {
  let name = prompt("Enter member name:");
  if (!name) return;

  function add(node) {
    if (!node) return;

    if (node.id === id) {
      if (side === "left") {
        if (!node.left) {
          node.left = {
            id: Date.now(),
            name,
            left: null,
            right: null
          };
        } else {
          alert("Left full");
        }
      }

      if (side === "right") {
        if (!node.right) {
          node.right = {
            id: Date.now(),
            name,
            left: null,
            right: null
          };
        } else {
          alert("Right full");
        }
      }
    }

    add(node.left);
    add(node.right);
  }

  add(tree);
  saveData();
  renderTree();
}

function addMember(side) {
  addMemberToNode(1, side);
}

// ✏️ EDIT
function editMember(id) {
  let name = prompt("New name:");
  if (!name) return;

  function update(node) {
    if (!node) return;

    if (node.id === id) {
      node.name = name;
    }

    update(node.left);
    update(node.right);
  }

  update(tree);
  saveData();
  renderTree();
}

// ❌ DELETE
function deleteMember(id) {
  if (id === 1) {
    alert("Root delete nahi hoga");
    return;
  }

  function remove(node) {
    if (!node) return;

    if (node.left && node.left.id === id) {
      node.left = null;
    } else if (node.right && node.right.id === id) {
      node.right = null;
    } else {
      remove(node.left);
      remove(node.right);
    }
  }

  remove(tree);
  saveData();
  renderTree();
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

// 💵 INCOME
function getIncome() {
  let data = calculatePairs(tree);
  let members = countMembers(tree);

  let memberIncome = data.pairs * 3;
  let companyIncome = members * 10;
  let profit = companyIncome - memberIncome;

  return {
    pairs: data.pairs,
    members,
    memberIncome,
    profit
  };
}

// 🏆 GET MEMBERS
function getAllMembers(node, arr = []) {
  if (!node) return arr;

  arr.push(node);
  getAllMembers(node.left, arr);
  getAllMembers(node.right, arr);

  return arr;
}

// 📋 TABLE
function renderMembersTable() {
  let members = getAllMembers(tree);
  let html = "";

  members.forEach(m => {
    let left = m.left ? 1 : 0;
    let right = m.right ? 1 : 0;

    let pairs = calculatePairs(m).pairs;
    let income = pairs * 3;

    html += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${left}</td>
        <td>${right}</td>
        <td>₹${income}</td>
      </tr>
    `;
  });

  document.getElementById("membersTable").innerHTML = html;
}

// 🌳 RENDER TREE
function renderTree() {
  document.getElementById("tree").innerHTML = renderNode(tree);

  let data = getIncome();

  document.getElementById("members").innerText = data.members;
  document.getElementById("pairs").innerText = data.pairs;
  document.getElementById("commission").innerText = data.memberIncome;
  document.getElementById("profit").innerText = data.profit;

  renderMembersTable();
}

// 🌿 NODE UI
function renderNode(node) {
  if (!node) return "";

  return `
    <div style="margin:20px; text-align:center;">
      
      <div style="border:1px solid white; padding:10px;">
        ${node.name} (ID: ${node.id})
        <br><br>

        <button onclick="addMemberToNode(${node.id}, 'left')">Left</button>
        <button onclick="addMemberToNode(${node.id}, 'right')">Right</button>
        <br><br>

        <button onclick="editMember(${node.id})">Edit</button>
        <button onclick="deleteMember(${node.id})">Delete</button>
      </div>

      <div style="display:flex; justify-content:space-around;">
        <div>${renderNode(node.left)}</div>
        <div>${renderNode(node.right)}</div>
      </div>

    </div>
  `;
}

// 🚀 START
loadData();
renderTree();
