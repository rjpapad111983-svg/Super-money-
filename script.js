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

function renameCompany() {
  let name = document.getElementById("companyNameInput").value;
  localStorage.setItem("companyName_" + currentCompany, name);
  alert("Renamed ✅");
}

// DATA
function getData() {
  return JSON.parse(localStorage.getItem("data_" + currentCompany)) || [];
}

function saveData(data) {
  localStorage.setItem("data_" + currentCompany, JSON.stringify(data));
}

// ADD MEMBER
function addMember() {
  let name = document.getElementById("name").value;
  let id = document.getElementById("memberId").value;

  if (!name || !id) return alert("Fill all");

  let data = getData();

  if (data.find(m => m.id == id)) return alert("ID exists");

  data.push({
    name,
    id,
    left: 0,
    right: 0,
    leftChild: null,
    rightChild: null
  });

  saveData(data);
  render();

  alert("Added ✅");
}

// TREE FUNCTIONS
function addLeft(parentId) {
  let childId = prompt("Enter child ID");

  let data = getData();
  let parent = data.find(m => m.id == parentId);

  if (!parent) return;

  parent.leftChild = childId;
  parent.left++;

  saveData(data);
  render();
}

function addRight(parentId) {
  let childId = prompt("Enter child ID");

  let data = getData();
  let parent = data.find(m => m.id == parentId);

  if (!parent) return;

  parent.rightChild = childId;
  parent.right++;

  saveData(data);
  render();
}

// RENDER
function render() {
  let data = getData();

  // TABLE
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
      </tr>
    `;
  });

  document.getElementById("totalMembers").innerText = data.length;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalCommission").innerText = totalCommission;

  renderTree();
}

// TREE RENDER
function renderTree() {
  let data = getData();
  let box = document.getElementById("treeContainer");
  box.innerHTML = "";

  data.forEach(m => {
    let div = document.createElement("div");
    div.className = "tree-box";

    div.innerHTML = `
      ${m.name} (ID:${m.id}) <br><br>
      <button onclick="addLeft('${m.id}')">Left</button>
      <button onclick="addRight('${m.id}')">Right</button>
    `;

    box.appendChild(div);
  });
}

// SEARCH
function searchMember() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(input) ? "" : "none";
  });
}

// PAGE
function showPage(page) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("tree").style.display = "none";
  document.getElementById("members").style.display = "none";

  document.getElementById(page).style.display = "block";
          }
