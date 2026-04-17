// ================== DATA LOAD ==================
let members = JSON.parse(localStorage.getItem("mlmData")) || [];

// ROOT FIX
if (!members.length) {
  members = [{ id: 1, name: "Rajesh", left: 0, right: 0 }];
  saveData();
}

// ================== SAVE ==================
function saveData() {
  localStorage.setItem("mlmData", JSON.stringify(members));
}

// ================== GET MEMBER ==================
function getMember(id) {
  return members.find(m => m.id === id);
}

// ================== SAFE DATA FIX ==================
function fixData() {
  members = members.filter(m => m && m.id);

  members.forEach(m => {
    if (!getMember(m.left)) m.left = 0;
    if (!getMember(m.right)) m.right = 0;
  });

  saveData();
}
fixData();

// ================== ADD LEFT ==================
function addLeft(parentId) {
  let parent = getMember(parentId);
  if (!parent) return alert("Parent not found");

  if (parent.left !== 0) return alert("Left already filled");

  let name = prompt("Enter name");
  if (!name) return;

  let newId = Date.now();

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

// ================== ADD RIGHT ==================
function addRight(parentId) {
  let parent = getMember(parentId);
  if (!parent) return alert("Parent not found");

  if (parent.right !== 0) return alert("Right already filled");

  let name = prompt("Enter name");
  if (!name) return;

  let newId = Date.now();

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

// ================== EDIT ==================
function editMember(id) {
  let m = getMember(id);
  if (!m) return;

  let newName = prompt("Edit name", m.name);
  if (!newName) return;

  m.name = newName;

  saveData();
  renderAll();
}

// ================== COUNT TREE ==================
function countTree(id) {
  if (!id) return 0;

  let m = getMember(id);
  if (!m) return 0;

  return 1 + countTree(m.left) + countTree(m.right);
}

// ================== PAIRS ==================
function getPairs(id) {
  let m = getMember(id);
  if (!m) return 0;

  let left = countTree(m.left);
  let right = countTree(m.right);

  return Math.min(left, right);
}

// ================== MEMBERS TABLE ==================
function renderMembers() {
  let table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  members.forEach(m => {
    let left = countTree(m.left);
    let right = countTree(m.right);
    let pairs = Math.min(left, right);
    let income = pairs * 3;

    let row = `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${left}</td>
        <td>${right}</td>
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

// ================== SEARCH ==================
function searchMember() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#membersTable tr");

  rows.forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

// ================== TREE ==================
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

// ================== DASHBOARD ==================
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

  let tm = document.getElementById("totalMembers");
  let tp = document.getElementById("totalPairs");
  let ti = document.getElementById("totalIncome");
  let cp = document.getElementById("companyProfit");

  if (tm) tm.innerText = totalMembers;
  if (tp) tp.innerText = totalPairs;
  if (ti) ti.innerText = "₹" + totalIncome;
  if (cp) cp.innerText = "₹" + companyProfit;
}

// ================== RENDER ALL ==================
function renderAll() {
  renderMembers();
  renderTree();
  renderDashboard();
}

// ================== INIT ==================
renderAll();
