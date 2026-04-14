// ================= DATA =================
let members = JSON.parse(localStorage.getItem("mlm_members"));

if (!members || members.length === 0) {
  members = [
    { id: 1, name: "Rajesh", left: 0, right: 0 }
  ];
  saveData();
}

// ================= SAVE =================
function saveData() {
  localStorage.setItem("mlm_members", JSON.stringify(members));
}

// ================= GET =================
function getMember(id) {
  return members.find(m => m.id === id);
}

// ================= COUNT SYSTEM =================

// Left count
function countLeft(id) {
  let m = getMember(id);
  if (!m || m.left === 0) return 0;

  return 1 + countLeft(m.left) + countRight(m.left);
}

// Right count
function countRight(id) {
  let m = getMember(id);
  if (!m || m.right === 0) return 0;

  return 1 + countLeft(m.right) + countRight(m.right);
}

// ================= PAIR SYSTEM =================
function calculatePairs(id) {
  let left = countLeft(id);
  let right = countRight(id);
  return Math.min(left, right);
}

// ================= INCOME =================
function calculateIncome(id) {
  return calculatePairs(id) * 3;
}

// ================= TOTAL =================
function totalIncome() {
  return members.reduce((sum, m) => sum + calculateIncome(m.id), 0);
}

function companyProfit() {
  let totalCollection = members.length * 10;
  return totalCollection - totalIncome();
}

// ================= ADD MEMBER =================
function addMember(parentId, side) {
  let name = prompt("Enter member name");
  if (!name) return;

  let parent = getMember(parentId);

  if (side === "left" && parent.left !== 0) {
    alert("Left already filled");
    return;
  }

  if (side === "right" && parent.right !== 0) {
    alert("Right already filled");
    return;
  }

  let newId = members.length + 1;

  members.push({
    id: newId,
    name: name,
    left: 0,
    right: 0
  });

  if (side === "left") parent.left = newId;
  if (side === "right") parent.right = newId;

  saveData();
  renderAll();
}

// ================= MEMBERS TABLE =================
function renderMembers() {
  let table = document.getElementById("membersTable");
  if (!table) return;

  table.innerHTML = "";

  members.forEach(m => {
    let left = countLeft(m.id);
    let right = countRight(m.id);
    let pairs = calculatePairs(m.id);
    let income = calculateIncome(m.id);

    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${left}</td>
        <td>${right}</td>
        <td>${pairs}</td>
        <td>₹${income}</td>
        <td>
          <button onclick="addMember(${m.id}, 'left')">L</button>
          <button onclick="addMember(${m.id}, 'right')">R</button>
        </td>
      </tr>
    `;
  });

  let profitBox = document.getElementById("companyProfit");
  if (profitBox) {
    profitBox.innerText = "Company Profit: ₹" + companyProfit();
  }
}

// ================= TREE =================
function renderTree() {
  let container = document.getElementById("treeContainer");
  if (!container) return;

  function draw(id) {
    let m = getMember(id);
    if (!m) return "";

    let pairs = calculatePairs(id);
    let income = calculateIncome(id);

    return `
      <div class="node">
        <div class="title">${m.name}</div>
        <div>Pair: ${pairs}</div>
        <div>₹${income}</div>

        <div class="btns">
          <button onclick="addMember(${id}, 'left')">L</button>
          <button onclick="addMember(${id}, 'right')">R</button>
        </div>

        <div class="children">
          ${m.left ? draw(m.left) : ""}
          ${m.right ? draw(m.right) : ""}
        </div>
      </div>
    `;
  }

  container.innerHTML = draw(1);
}

// ================= DASHBOARD =================
function renderDashboard() {
  let totalMembers = document.getElementById("totalMembers");
  let totalPairs = document.getElementById("totalPairs");
  let totalIncomeBox = document.getElementById("totalIncome");
  let companyProfitBox = document.getElementById("companyProfit");

  if (totalMembers) totalMembers.innerText = members.length;

  if (totalPairs) {
    let pairs = members.reduce((sum, m) => sum + calculatePairs(m.id), 0);
    totalPairs.innerText = pairs;
  }

  if (totalIncomeBox) totalIncomeBox.innerText = "₹" + totalIncome();
  if (companyProfitBox) companyProfitBox.innerText = "₹" + companyProfit();
}

// ================= NAVIGATION FIX =================
function showPage(page) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("treePage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(page).style.display = "block";
}

// ================= INIT =================
function renderAll() {
  renderMembers();
  renderTree();
  renderDashboard();
}

// First load
renderAll();
