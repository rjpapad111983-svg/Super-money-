let currentCompany = localStorage.getItem("company") || "1";

// ================= COMPANY =================
function updateCompanyName() {
  let name = localStorage.getItem("companyName_" + currentCompany) || ("Company " + currentCompany);
  document.getElementById("companyTitle").innerText = name;
}

function renameCompany() {
  let name = document.getElementById("companyNameInput").value;
  if (!name) return alert("Enter name");
  localStorage.setItem("companyName_" + currentCompany, name);
  updateCompanyName();
}

function changeCompany() {
  currentCompany = document.getElementById("companySelect").value;
  localStorage.setItem("company", currentCompany);
  updateCompanyName();
  render();
}

// ================= STORAGE =================
function getData() {
  return JSON.parse(localStorage.getItem("data_" + currentCompany)) || [];
}

function saveData(data) {
  localStorage.setItem("data_" + currentCompany, JSON.stringify(data));
}

// ================= ROOT =================
function createRoot() {
  let name = prompt("Enter Root Name");
  if (!name) return;

  let data = [{ id: "1", name, leftChild: null, rightChild: null }];
  saveData(data);
  render();
}

// ================= ADD =================
function addLeft(parentId) {
  let name = prompt("Enter Name");
  if (!name) return;

  let data = getData();
  let parent = data.find(x => x.id == parentId);

  if (parent.leftChild) return alert("Left full");

  let id = Date.now().toString();
  data.push({ id, name, leftChild: null, rightChild: null });

  parent.leftChild = id;
  saveData(data);
  render();
}

function addRight(parentId) {
  let name = prompt("Enter Name");
  if (!name) return;

  let data = getData();
  let parent = data.find(x => x.id == parentId);

  if (parent.rightChild) return alert("Right full");

  let id = Date.now().toString();
  data.push({ id, name, leftChild: null, rightChild: null });

  parent.rightChild = id;
  saveData(data);
  render();
}

// ================= EDIT =================
function editMember(id) {
  let data = getData();
  let m = data.find(x => x.id == id);

  let n = prompt("Edit Name", m.name);
  if (!n) return;

  m.name = n;
  saveData(data);
  render();
}

// ================= COUNT =================
function count(id, side) {
  let data = getData();
  let m = data.find(x => x.id == id);
  if (!m) return 0;

  let child = side === "left" ? m.leftChild : m.rightChild;
  if (!child) return 0;

  return 1 + count(child, "left") + count(child, "right");
}

// ================= TREE (PRO LEVEL) =================
function renderTree() {
  let data = getData();
  let container = document.getElementById("treeContainer");

  if (data.length === 0) {
    container.innerHTML = "<button onclick='createRoot()'>Create Root</button>";
    return;
  }

  let root = data[0];

  // ===== LEVEL BUILD =====
  let levels = [];

  function build(node, level = 0) {
    if (!node) return;

    if (!levels[level]) levels[level] = [];
    levels[level].push(node);

    let left = data.find(x => x.id == node.leftChild);
    let right = data.find(x => x.id == node.rightChild);

    build(left, level + 1);
    build(right, level + 1);
  }

  build(root);

  // ===== HTML =====
  let html = "";

  levels.forEach((levelNodes, levelIndex) => {

    html += `<div style="
      display:flex;
      justify-content:center;
      gap:${Math.max(20, 100 - levelIndex * 10)}px;
      margin:25px 0;
      flex-wrap:nowrap;
    ">`;

    levelNodes.forEach(m => {

      m.left = count(m.id, "left");
      m.right = count(m.id, "right");
      m.pair = Math.min(m.left, m.right);
      m.income = m.pair * 3;

      html += `
      <div style="
        border:1px solid #fff;
        padding:6px;
        min-width:90px;
        font-size:10px;
        border-radius:6px;
        text-align:center;
      ">
        ${m.name}<br>
        Pair:${m.pair}<br>
        ₹${m.income}<br><br>

        <button onclick="addLeft('${m.id}')">L</button>
        <button onclick="addRight('${m.id}')">R</button><br><br>

        <button onclick="editMember('${m.id}')">Edit</button>
      </div>
      `;
    });

    html += `</div>`;
  });

  container.innerHTML = html;
}

// ================= TABLE =================
function render() {
  let data = getData();
  let table = document.getElementById("memberTable");

  table.innerHTML = "";

  let totalPair = 0;
  let totalIncome = 0;
  let totalProfit = 0;

  data.forEach(m => {
    m.left = count(m.id, "left");
    m.right = count(m.id, "right");
    m.pair = Math.min(m.left, m.right);
    m.income = m.pair * 3;
    m.profit = (m.left + m.right) * 10 - m.income;

    totalPair += m.pair;
    totalIncome += m.income;
    totalProfit += m.profit;

    table.innerHTML += `
    <tr>
      <td>${m.name}</td>
      <td>${m.left}</td>
      <td>${m.right}</td>
      <td>${m.pair}</td>
      <td>₹${m.income}</td>
      <td>₹${m.profit}</td>
      <td><button onclick="editMember('${m.id}')">Edit</button></td>
    </tr>`;
  });

  document.getElementById("totalMembers").innerText = data.length;
  document.getElementById("totalPairs").innerText = totalPair;
  document.getElementById("totalCommission").innerText = totalIncome;
  document.getElementById("companyProfit").innerText = totalProfit;

  renderTree();
}

// ================= SEARCH =================
function searchMember() {
  let v = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(r => {
    r.style.display = r.innerText.toLowerCase().includes(v) ? "" : "none";
  });
}

// ================= NAV =================
function showPage(p) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("tree").style.display = "none";
  document.getElementById("members").style.display = "none";

  document.getElementById(p).style.display = "block";
}

// ================= INIT =================
updateCompanyName();
render();
