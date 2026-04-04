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
// TREE JOIN (MAIN)
// =======================

function addLeft(parentId) {
  let childId = prompt("Enter NEW Member ID");
  if (!childId) return;

  let name = prompt("Enter Member Name");
  if (!name) return;

  let data = getData();

  let parent = data.find(m => m.id == parentId);

  if (parent.leftChild) return alert("Left already filled");

  // create new member
  let newMember = {
    name: name,
    id: childId,
    leftChild: null,
    rightChild: null
  };

  data.push(newMember);

  parent.leftChild = childId;

  saveData(data);
  render();
}

function addRight(parentId) {
  let childId = prompt("Enter NEW Member ID");
  if (!childId) return;

  let name = prompt("Enter Member Name");
  if (!name) return;

  let data = getData();

  let parent = data.find(m => m.id == parentId);

  if (parent.rightChild) return alert("Right already filled");

  let newMember = {
    name: name,
    id: childId,
    leftChild: null,
    rightChild: null
  };

  data.push(newMember);

  parent.rightChild = childId;

  saveData(data);
  render();
}

// =======================
// DOWNLINE CALCULATION
// =======================

function countDownline(id, side) {
  let data = getData();
  let member = data.find(m => m.id == id);

  if (!member) return 0;

  let childId = side === "left" ? member.leftChild : member.rightChild;
  if (!childId) return 0;

  let count = 1;

  count += countDownline(childId, "left");
  count += countDownline(childId, "right");

  return count;
}

// =======================
// CALCULATE
// =======================

function calculateAll() {
  let data = getData();

  data.forEach(m => {
    m.leftTotal = countDownline(m.id, "left");
    m.rightTotal = countDownline(m.id, "right");

    m.pair = Math.min(m.leftTotal, m.rightTotal);
    m.income = m.pair * 3;

    m.companyProfit = (m.leftTotal + m.rightTotal) * 10 - m.income;
  });

  saveData(data);
}

// =======================
// EDIT
// =======================

function editMember(id) {
  let data = getData();
  let m = data.find(x => x.id == id);

  let newName = prompt("Edit Name", m.name);
  if (!newName) return;

  m.name = newName;

  saveData(data);
  render();
}

// =======================
// TREE
// =======================

function renderTree() {
  let data = getData();
  let container = document.getElementById("treeContainer");

  if (data.length === 0) {
    container.innerHTML = "<h3>Add first member from tree</h3>";
    return;
  }

  let root = data[0];

  function build(m) {
    if (!m) return "";

    let left = data.find(x => x.id == m.leftChild);
    let right = data.find(x => x.id == m.rightChild);

    return `
    <div style="text-align:center;margin:15px;">
      <div style="border:1px solid #fff;padding:10px;">
        ${m.name}<br>ID:${m.id}<br>
        Pair: ${m.pair || 0}<br>
        ₹${m.income || 0}
        <br><br>

        <button onclick="addLeft('${m.id}')">Left</button>
        <button onclick="addRight('${m.id}')">Right</button>
        <br><br>
        <button onclick="editMember('${m.id}')">Edit</button>
      </div>

      <div style="display:flex;gap:40px;justify-content:center;">
        ${build(left)}
        ${build(right)}
      </div>
    </div>
    `;
  }

  container.innerHTML = build(root);
}

// =======================
// MEMBERS TABLE
// =======================

function render() {
  calculateAll();

  let data = getData();
  let table = document.getElementById("memberTable");

  table.innerHTML = "";

  let totalProfit = 0;

  data.forEach(m => {
    totalProfit += m.companyProfit;

    table.innerHTML += `
    <tr>
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${m.leftTotal || 0}</td>
      <td>${m.rightTotal || 0}</td>
      <td>${m.pair || 0}</td>
      <td>₹${m.income || 0}</td>
      <td>₹${m.companyProfit || 0}</td>
      <td><button onclick="editMember('${m.id}')">Edit</button></td>
    </tr>
    `;
  });

  document.getElementById("companyProfit").innerText = totalProfit;

  renderTree();
}

// =======================
// SEARCH
// =======================

function searchMember() {
  let val = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(r => {
    r.style.display = r.innerText.toLowerCase().includes(val) ? "" : "none";
  });
}
