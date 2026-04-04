// =======================
// COMPANY
// =======================

let currentCompany = localStorage.getItem("company") || "1";

window.onload = function () {
  document.getElementById("companySelect").value = currentCompany;
  render();
};

function changeCompany() {
  currentCompany = document.getElementById("companySelect").value;
  localStorage.setItem("company", currentCompany);
  render();
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

  data.push({
    name: name,
    id: id,
    left: 0,
    right: 0,
    leftChild: null,
    rightChild: null
  });

  saveData(data);
  render();

  alert("Member Added ✅");

  document.getElementById("name").value = "";
  document.getElementById("memberId").value = "";
}

// =======================
// LEFT / RIGHT
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
// EDIT MEMBER
// =======================

function editMember(id) {
  let data = getData();
  let member = data.find(m => m.id == id);

  let newName = prompt("Enter new name", member.name);

  if (!newName) return;

  member.name = newName;

  saveData(data);
  render();

  alert("Updated ✅");
}

// =======================
// TREE RENDER
// =======================

function renderTree() {
  let data = getData();
  let container = document.getElementById("treeContainer");
  container.innerHTML = "";

  if (data.length === 0) return;

  let root = data[0];

  function buildNode(member) {
    if (!member) return "";

    let left = data.find(m => m.id == member.leftChild);
    let right = data.find(m => m.id == member.rightChild);

    return `
      <div style="text-align:center; margin:15px;">
        <div style="border:1px solid white; padding:10px; display:inline-block;">
          ${member.name} (ID:${member.id})<br><br>

          <button onclick="addLeft('${member.id}')">Left</button>
          <button onclick="addRight('${member.id}')">Right</button>
          <br><br>
          <button onclick="editMember('${member.id}')">Edit</button>
        </div>

        <div style="display:flex; justify-content:center; gap:40px;">
          ${buildNode(left)}
          ${buildNode(right)}
        </div>
      </div>
    `;
  }

  container.innerHTML = buildNode(root);
}

// =======================
// RENDER TABLE
// =======================

function render() {
  let data = getData();

  let table = document.getElementById("memberTable");
  table.innerHTML = "";

  let totalPairs = 0;
  let totalCommission = 0;

  data.forEach(m => {
    let pair = Math.min(m.left, m.right);
    let income = pair * 3;

    totalPairs += pair;
    totalCommission += income;

    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${m.left}</td>
        <td>${m.right}</td>
        <td>₹${income}</td>
        <td>
          <button onclick="editMember('${m.id}')">Edit</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("totalMembers").innerText = data.length;
  document.getElementById("totalPairs").innerText = totalPairs;
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
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("tree").style.display = "none";
  document.getElementById("members").style.display = "none";

  document.getElementById(page).style.display = "block";
}
