// =======================
// GLOBAL
// =======================

let currentCompany = localStorage.getItem("company") || "1";

// =======================
// INIT
// =======================

window.onload = function () {
  let select = document.getElementById("companySelect");
  if (select) select.value = currentCompany;
  render();
};

// =======================
// COMPANY
// =======================

function changeCompany() {
  currentCompany = document.getElementById("companySelect").value;
  localStorage.setItem("company", currentCompany);
  render();
}

function renameCompany() {
  let name = document.getElementById("companyNameInput").value;
  if (!name) return alert("Enter name");

  localStorage.setItem("companyName_" + currentCompany, name);
  alert("Company renamed ✅");
}

// =======================
// DATA
// =======================

function getData() {
  return JSON.parse(localStorage.getItem("data_" + currentCompany)) || [];
}

function saveData(data) {
  localStorage.setItem("data_" + currentCompany, JSON.stringify(data));
}

// =======================
// ADD MEMBER
// =======================

function addMember() {
  let name = document.getElementById("name").value.trim();
  let id = document.getElementById("memberId").value.trim();

  if (!name || !id) {
    alert("Enter Name & ID");
    return;
  }

  let data = getData();

  if (data.find(m => m.id == id)) {
    alert("ID already exists");
    return;
  }

  let newMember = {
    name: name,
    id: id,
    left: 0,
    right: 0,
    leftChild: null,
    rightChild: null
  };

  data.push(newMember);

  saveData(data);
  render();

  alert("Member Added ✅");

  document.getElementById("name").value = "";
  document.getElementById("memberId").value = "";
}

// =======================
// LEFT / RIGHT SYSTEM
// =======================

function addLeft(parentId) {
  let childId = prompt("Enter LEFT child ID");

  if (!childId) return;

  let data = getData();

  let parent = data.find(m => m.id == parentId);
  let child = data.find(m => m.id == childId);

  if (!child) return alert("Child not found");
  if (parent.leftChild) return alert("Left already filled");

  parent.leftChild = childId;
  parent.left += 1;

  saveData(data);
  render();
}

function addRight(parentId) {
  let childId = prompt("Enter RIGHT child ID");

  if (!childId) return;

  let data = getData();

  let parent = data.find(m => m.id == parentId);
  let child = data.find(m => m.id == childId);

  if (!child) return alert("Child not found");
  if (parent.rightChild) return alert("Right already filled");

  parent.rightChild = childId;
  parent.right += 1;

  saveData(data);
  render();
}

// =======================
// TREE RENDER
// =======================

function renderTree() {
  let data = getData();
  let container = document.getElementById("treeContainer");

  if (!container) return;

  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "No Members";
    return;
  }

  let root = data[0];

  function buildNode(member) {
    if (!member) return "";

    let left = data.find(m => m.id == member.leftChild);
    let right = data.find(m => m.id == member.rightChild);

    return `
      <div style="text-align:center; margin:15px;">
        
        <div style="border:1px solid white; padding:10px; display:inline-block;">
          <b>${member.name}</b><br>ID:${member.id}<br><br>

          <button onclick="addLeft('${member.id}')">Left</button>
          <button onclick="addRight('${member.id}')">Right</button>
        </div>

        <div style="display:flex; justify-content:center; gap:40px; margin-top:10px;">
          ${buildNode(left)}
          ${buildNode(right)}
        </div>

      </div>
    `;
  }

  container.innerHTML = buildNode(root);
}

// =======================
// TABLE + DASHBOARD
// =======================

function render() {
  let data = getData();

  let table = document.getElementById("memberTable");

  if (table) table.innerHTML = "";

  let totalPairs = 0;
  let totalCommission = 0;

  data.forEach(m => {
    let pair = Math.min(m.left, m.right);
    let income = pair * 3;

    totalPairs += pair;
    totalCommission += income;

    if (table) {
      table.innerHTML += `
        <tr>
          <td>${m.name}</td>
          <td>${m.id}</td>
          <td>${m.left}</td>
          <td>${m.right}</td>
          <td>₹${income}</td>
        </tr>
      `;
    }
  });

  if (document.getElementById("totalMembers"))
    document.getElementById("totalMembers").innerText = data.length;

  if (document.getElementById("totalPairs"))
    document.getElementById("totalPairs").innerText = totalPairs;

  if (document.getElementById("totalCommission"))
    document.getElementById("totalCommission").innerText = totalCommission;

  renderTree();
}

// =======================
// SEARCH
// =======================

function searchMember() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

// =======================
// PAGE SWITCH
// =======================

function showPage(page) {
  let pages = ["dashboard", "tree", "members"];

  pages.forEach(p => {
    let el = document.getElementById(p);
    if (el) el.style.display = "none";
  });

  let active = document.getElementById(page);
  if (active) active.style.display = "block";
}
