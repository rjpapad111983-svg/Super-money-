// 🌳 TREE DATA
let tree = {
  id: 1,
  name: "Rajesh",
  left: null,
  right: null
};

// 🔄 LOAD
let data = localStorage.getItem("mlmTree");
if (data) tree = JSON.parse(data);

// 💾 SAVE
function save() {
  localStorage.setItem("mlmTree", JSON.stringify(tree));
}

// ➕ ADD MEMBER
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
        alert("Position already filled");
      }
    }

    add(node.left);
    add(node.right);
  }

  add(tree);
  save();
  render();
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
  save();
  render();
}

// ❌ DELETE (TABLE ONLY)
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
  save();
  render();
}

// 👥 TOTAL MEMBERS
function count(node) {
  if (!node) return 0;
  return 1 + count(node.left) + count(node.right);
}

// 🔥 DOWNLINE
function downline(node) {
  if (!node) return 0;
  return 1 + downline(node.left) + downline(node.right);
}

// 📊 DASHBOARD
function dashboard() {
  let members = count(tree);

  let left = tree.left ? downline(tree.left) : 0;
  let right = tree.right ? downline(tree.right) : 0;

  let pairs = Math.min(left, right);

  document.getElementById("members").innerText = members;
  document.getElementById("pairs").innerText = pairs;
  document.getElementById("commission").innerText = pairs * 3;
  document.getElementById("profit").innerText = members * 10 - pairs * 3;
}

// 📋 MEMBERS TABLE
function table() {
  let arr = [];

  function collect(node) {
    if (!node) return;
    arr.push(node);
    collect(node.left);
    collect(node.right);
  }

  collect(tree);

  let html = "";

  arr.forEach(m => {
    let left = m.left ? downline(m.left) : 0;
    let right = m.right ? downline(m.right) : 0;
    let income = Math.min(left, right) * 3;

    html += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${left}</td>
        <td>${right}</td>
        <td>₹${income}</td>
        <td>
          <button onclick="editMember(${m.id})">Edit</button>
          <button onclick="deleteMember(${m.id})">Delete</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("membersTable").innerHTML = html;
}

// 🌳 TREE UI (NO DELETE BUTTON)
function nodeUI(node) {
  if (!node) return "";

  return `
    <div class="node">
      ${node.name}<br>ID:${node.id}<br>

      <button onclick="addMemberToNode(${node.id},'left')">L</button>
      <button onclick="addMemberToNode(${node.id},'right')">R</button><br>

      <button onclick="editMember(${node.id})">Edit</button>

      <div class="children">
        ${nodeUI(node.left)}
        ${nodeUI(node.right)}
      </div>
    </div>
  `;
}

function renderTree() {
  document.getElementById("tree").innerHTML = nodeUI(tree);
}

// 🔍 SEARCH FUNCTION
function searchMember() {
  let input = document.getElementById("searchBox").value.toLowerCase();
  let rows = document.querySelectorAll("#membersTable tr");

  let resultHTML = "";
  let found = false;

  rows.forEach(row => {
    let name = row.children[0].innerText.toLowerCase();

    if (name.includes(input)) {
      row.style.display = "";

      if (!found && input !== "") {
        let left = row.children[2].innerText;
        let right = row.children[3].innerText;
        let income = row.children[4].innerText;

        let pair = Math.min(parseInt(left), parseInt(right));

        resultHTML = `
          <div style="background:#111;padding:10px;margin-top:10px;">
            <b>${row.children[0].innerText}</b><br>
            Left: ${left} | Right: ${right}<br>
            Pair: ${pair}<br>
            Income: ${income}
          </div>
        `;

        found = true;
      }

    } else {
      row.style.display = "none";
    }
  });

  document.getElementById("searchResult").innerHTML = resultHTML;
}

// 📄 PAGE SWITCH
function showPage(p) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("treePage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(p + "Page").style.display = "block";
}

// 🚀 MAIN RENDER
function render() {
  renderTree();
  table();
  dashboard();
}

// START
render();
