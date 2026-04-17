// ===== LOAD =====
let members = JSON.parse(localStorage.getItem("members")) || [];

if (members.length === 0) {
  members = [{ id: 1, name: "Rajesh", left: 0, right: 0 }];
  saveData();
}

function saveData() {
  localStorage.setItem("members", JSON.stringify(members));
}

function getMember(id) {
  return members.find(m => m.id === id);
}

// ===== AUTO ADD =====
function addMemberAuto() {
  let name = prompt("Enter member name:");
  if (!name) return;

  let newId = members.length + 1;

  members.push({
    id: newId,
    name: name,
    left: 0,
    right: 0
  });

  // AUTO PLACE (BFS)
  for (let i = 0; i < members.length; i++) {
    if (members[i].left === 0) {
      members[i].left = newId;
      break;
    } else if (members[i].right === 0) {
      members[i].right = newId;
      break;
    }
  }

  saveData();
  renderAll();
}

// ===== EDIT =====
function editMember(id) {
  let m = getMember(id);
  let name = prompt("Edit name:", m.name);
  if (!name) return;

  m.name = name;
  saveData();
  renderAll();
}

// ===== COUNT =====
function countSide(id) {
  if (!id) return 0;
  let m = getMember(id);
  return 1 + countSide(m.left) + countSide(m.right);
}

// ===== PAIRS =====
function getPairs(id) {
  let m = getMember(id);
  let left = countSide(m.left);
  let right = countSide(m.right);
  return Math.min(left, right);
}

// ===== DASHBOARD =====
function renderDashboard() {
  let totalMembers = members.length;

  let totalPairs = 0;
  members.forEach(m => totalPairs += getPairs(m.id));

  let totalIncome = totalPairs * 3;
  let companyProfit = (members.length * 10) - totalIncome;

  totalMembersEl.innerText = totalMembers;
  totalPairsEl.innerText = totalPairs;
  totalIncomeEl.innerText = "₹" + totalIncome;
  companyProfitEl.innerText = "₹" + companyProfit;
}

// ===== MEMBERS =====
function renderMembers() {
  let html = "";

  members.forEach(m => {
    let pairs = getPairs(m.id);
    let income = pairs * 3;

    html += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${countSide(m.left)}</td>
        <td>${countSide(m.right)}</td>
        <td>${pairs}</td>
        <td>₹${income}</td>
        <td><button onclick="editMember(${m.id})">Edit</button></td>
      </tr>
    `;
  });

  membersTable.innerHTML = html;
}

// ===== TREE =====
function renderTree() {
  tree.innerHTML = renderNode(1);
}

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
        <button onclick="editMember(${id})">Edit</button>
      </div>

      <div class="children">
        ${m.left ? renderNode(m.left) : ""}
        ${m.right ? renderNode(m.right) : ""}
      </div>
    </div>
  `;
}

// ===== SEARCH =====
function searchMember() {
  let val = searchInput.value.toLowerCase();
  let rows = document.querySelectorAll("#membersTable tr");

  rows.forEach(r => {
    let name = r.children[0].innerText.toLowerCase();
    let id = r.children[1].innerText;

    r.style.display = (name.includes(val) || id.includes(val)) ? "" : "none";
  });
}

// ===== ZOOM =====
let scale = 1;
function zoomIn() {
  scale += 0.1;
  tree.style.transform = `scale(${scale})`;
}
function zoomOut() {
  scale -= 0.1;
  if (scale < 0.3) scale = 0.3;
  tree.style.transform = `scale(${scale})`;
}

// ===== PAGE =====
function showPage(p) {
  dashboardPage.style.display = "none";
  membersPage.style.display = "none";
  treePage.style.display = "none";

  document.getElementById(p + "Page").style.display = "block";

  if (p === "dashboard") renderDashboard();
  if (p === "members") renderMembers();
  if (p === "tree") renderTree();
}

// ===== INIT =====
const totalMembersEl = document.getElementById("totalMembers");
const totalPairsEl = document.getElementById("totalPairs");
const totalIncomeEl = document.getElementById("totalIncome");
const companyProfitEl = document.getElementById("companyProfit");
const membersTable = document.getElementById("membersTable");
const tree = document.getElementById("tree");

renderAll();

function renderAll() {
  renderDashboard();
  renderMembers();
  renderTree();
}
