// ================= DATA LOAD =================
let members = JSON.parse(localStorage.getItem("members")) || [];

// ROOT FIX
if (members.length === 0) {
  members = [{ id: 1, name: "Rajesh", left: 0, right: 0 }];
  saveData();
}

// ================= SAVE =================
function saveData() {
  localStorage.setItem("members", JSON.stringify(members));
}

// ================= GET MEMBER =================
function getMember(id) {
  return members.find(m => m.id === id);
}

// ================= ADD MEMBER =================
function addMember(parentId, side) {
  let name = prompt("Enter member name:");
  if (!name) return;

  let parent = getMember(parentId);
  if (!parent) return;

  if (parent[side] !== 0) {
    alert("Already filled!");
    return;
  }

  let newId = members.length + 1;

  members.push({
    id: newId,
    name: name,
    left: 0,
    right: 0
  });

  parent[side] = newId;

  saveData();
  renderAll();
}

// ================= EDIT MEMBER =================
function editMember(id) {
  let m = getMember(id);
  if (!m) return;

  let name = prompt("Edit name:", m.name);
  if (!name) return;

  m.name = name;

  saveData();
  renderAll();
}

// ================= COUNT DOWNLINE =================
function countSide(id) {
  if (!id) return 0;

  let m = getMember(id);
  if (!m) return 0;

  return 1 + countSide(m.left) + countSide(m.right);
}

// ================= PAIR CALC =================
function getPairs(id) {
  let m = getMember(id);
  if (!m) return 0;

  let leftCount = countSide(m.left);
  let rightCount = countSide(m.right);

  return Math.min(leftCount, rightCount);
}

// ================= DASHBOARD =================
function renderDashboard() {
  let totalMembers = members.length;

  let totalPairs = 0;
  members.forEach(m => {
    totalPairs += getPairs(m.id);
  });

  let totalIncome = totalPairs * 3;

  let companyProfit = (members.length * 10) - totalIncome;

  document.getElementById("totalMembers").innerText = totalMembers;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalIncome").innerText = "₹" + totalIncome;
  document.getElementById("companyProfit").innerText = "₹" + companyProfit;
}

// ================= MEMBERS TABLE =================
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
        <td>
          <button onclick="addMember(${m.id}, 'left')">L</button>
          <button onclick="addMember(${m.id}, 'right')">R</button>
          <button onclick="editMember(${m.id})">Edit</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("membersTable").innerHTML = html;
}

// ================= TREE =================
function renderTree() {
  if (!members.length) return;

  document.getElementById("tree").innerHTML = renderTreeNode(1);
}

function renderTreeNode(id) {
  if (!id) return "";

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
        <button onclick="addMember(${id}, 'left')">L</button>
        <button onclick="addMember(${id}, 'right')">R</button>
        <button onclick="editMember(${id})">Edit</button>
      </div>

      <div class="children">
        ${m.left ? renderTreeNode(m.left) : ""}
        ${m.right ? renderTreeNode(m.right) : ""}
      </div>
    </div>
  `;
}

// ================= SEARCH =================
function searchMember() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#membersTable tr");

  rows.forEach(row => {
    let name = row.children[0].innerText.toLowerCase();
    let id = row.children[1].innerText;

    if (name.includes(input) || id.includes(input)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// ================= ZOOM =================
let scale = 1;

function zoomIn() {
  scale += 0.1;
  document.getElementById("tree").style.transform = `scale(${scale})`;
}

function zoomOut() {
  scale -= 0.1;
  if (scale < 0.3) scale = 0.3;
  document.getElementById("tree").style.transform = `scale(${scale})`;
}

// ================= PAGE SWITCH =================
function showPage(page) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";
  document.getElementById("treePage").style.display = "none";

  document.getElementById(page + "Page").style.display = "block";

  if (page === "dashboard") renderDashboard();
  if (page === "members") renderMembers();
  if (page === "tree") renderTree();
}

// ================= INIT =================
function renderAll() {
  renderDashboard();
  renderMembers();
  renderTree();
}

renderAll();
