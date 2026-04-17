// ===== DATA LOAD / SAVE =====
let members = JSON.parse(localStorage.getItem("mlmData")) || [
  { id: 1, name: "Rajesh", left: 0, right: 0 }
];

function saveData() {
  localStorage.setItem("mlmData", JSON.stringify(members));
}

function getMember(id) {
  return members.find(m => m.id === id);
}

// ===== ADD MEMBER (MANUAL LEFT RIGHT) =====
function addLeft(parentId) {
  let parent = getMember(parentId);

  if (parent.left !== 0) {
    alert("Left already filled");
    return;
  }

  let name = prompt("Enter name");
  if (!name) return;

  let newId = members.length + 1;

  members.push({
    id: newId,
    name: name,
    left: 0,
    right: 0
  });

  parent.left = newId;

  saveData();
  renderAll();
}

function addRight(parentId) {
  let parent = getMember(parentId);

  if (parent.right !== 0) {
    alert("Right already filled");
    return;
  }

  let name = prompt("Enter name");
  if (!name) return;

  let newId = members.length + 1;

  members.push({
    id: newId,
    name: name,
    left: 0,
    right: 0
  });

  parent.right = newId;

  saveData();
  renderAll();
}

// ===== EDIT MEMBER =====
function editMember(id) {
  let m = getMember(id);
  let newName = prompt("Edit name", m.name);

  if (newName) {
    m.name = newName;
    saveData();
    renderAll();
  }
}

// ===== COUNT LEFT / RIGHT TREE =====
function countTree(id) {
  if (!id) return 0;

  let m = getMember(id);
  if (!m) return 0;

  return 1 + countTree(m.left) + countTree(m.right);
}

// ===== PAIR CALCULATION (CORRECT) =====
function getPairs(id) {
  let m = getMember(id);
  if (!m) return 0;

  let leftCount = countTree(m.left);
  let rightCount = countTree(m.right);

  return Math.min(leftCount, rightCount);
}

// ===== RENDER MEMBERS TABLE =====
function renderMembers() {
  let table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  members.forEach(m => {
    let leftCount = countTree(m.left);
    let rightCount = countTree(m.right);
    let pairs = Math.min(leftCount, rightCount);
    let income = pairs * 3;

    let row = `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${leftCount}</td>
        <td>${rightCount}</td>
        <td>${pairs}</td>
        <td>₹${income}</td>
        <td>
          <button onclick="addLeft(${m.id})">L</button>
          <button onclick="addRight(${m.id})">R</button>
          <button onclick="editMember(${m.id})">Edit</button>
        </td>
      </tr>
    `;

    table.innerHTML += row;
  });
}

// ===== SEARCH =====
function searchMember() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#membersTable tr");

  rows.forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

// ===== TREE RENDER =====
function renderNode(id) {
  let m = getMember(id);
  if (!m) return "";

  let pairs = getPairs(id);
  let income = pairs * 3;

  return `
    <div style="text-align:center;">
      <div class="node">
        ${m.name}<br>
        Pair: ${pairs}<br>
        ₹${income}<br>

        <button onclick="addLeft(${id})">L</button>
        <button onclick="addRight(${id})">R</button>
        <button onclick="editMember(${id})">Edit</button>
      </div>

      <div class="children">
        ${m.left ? renderNode(m.left) : ""}
        ${m.right ? renderNode(m.right) : ""}
      </div>
    </div>
  `;
}

function renderTree() {
  let tree = document.getElementById("tree");
  if (!tree) return;

  tree.innerHTML = renderNode(1);
}

// ===== DASHBOARD =====
function renderDashboard() {
  let totalMembers = members.length;

  let totalPairs = 0;
  let totalIncome = 0;

  members.forEach(m => {
    let pairs = getPairs(m.id);
    totalPairs += pairs;
    totalIncome += pairs * 3;
  });

  let companyProfit = (totalMembers * 10) - totalIncome;

  document.getElementById("totalMembers").innerText = totalMembers;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalIncome").innerText = "₹" + totalIncome;
  document.getElementById("companyProfit").innerText = "₹" + companyProfit;
}

// ===== RENDER ALL =====
function renderAll() {
  renderMembers();
  renderTree();
  renderDashboard();
}

// ===== INIT =====
renderAll();
