let currentCompany = localStorage.getItem("company") || "1";

// ===== COMPANY =====
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

// ===== STORAGE =====
function getData() {
  return JSON.parse(localStorage.getItem("data_" + currentCompany)) || [];
}

function saveData(data) {
  localStorage.setItem("data_" + currentCompany, JSON.stringify(data));
}

// ===== ROOT =====
function createRoot() {
  let name = prompt("Enter Root Name");
  if (!name) return;

  let data = [{ id: "1", name, leftChild: null, rightChild: null }];
  saveData(data);
  render();
}

// ===== ADD =====
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

// ===== EDIT =====
function editMember(id) {
  let data = getData();
  let m = data.find(x => x.id == id);

  let n = prompt("Edit Name", m.name);
  if (!n) return;

  m.name = n;
  saveData(data);
  render();
}

// ===== COUNT =====
function count(id, side) {
  let data = getData();
  let m = data.find(x => x.id == id);
  if (!m) return 0;

  let child = side === "left" ? m.leftChild : m.rightChild;
  if (!child) return 0;

  return 1 + count(child, "left") + count(child, "right");
}

// ===== TREE (FINAL FIX) =====
function renderTree() {
  let data = getData();
  let container = document.getElementById("treeContainer");

  if (data.length === 0) {
    container.innerHTML = "<button onclick='createRoot()'>Create Root</button>";
    return;
  }

  let map = {};
  data.forEach(m => map[m.id] = m);

  let root = data[0];

  function build(node) {
    if (!node) return "";

    node.left = count(node.id, "left");
    node.right = count(node.id, "right");
    node.pair = Math.min(node.left, node.right);
    node.income = node.pair * 3;

    let leftNode = map[node.leftChild];
    let rightNode = map[node.rightChild];

    return `
    <ul>
      <li>
        <div class="node">
          ${node.name}<br>
          Pair:${node.pair}<br>
          ₹${node.income}<br><br>

          <button onclick="addLeft('${node.id}')">L</button>
          <button onclick="addRight('${node.id}')">R</button><br><br>
          <button onclick="editMember('${node.id}')">Edit</button>
        </div>

        ${(leftNode || rightNode) ? `
        <ul>
          <li>${leftNode ? build(leftNode) : ""}</li>
          <li>${rightNode ? build(rightNode) : ""}</li>
        </ul>` : ""}
      </li>
    </ul>`;
  }

  container.innerHTML = build(root);
}

// ===== TABLE =====
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

// ===== INIT =====
updateCompanyName();
render();
