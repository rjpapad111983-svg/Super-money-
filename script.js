let members = JSON.parse(localStorage.getItem("mlm_members"));

if (!members || members.length === 0) {
  members = [{ id: 1, name: "Rajesh", left: 0, right: 0 }];
  saveData();
}

function saveData() {
  localStorage.setItem("mlm_members", JSON.stringify(members));
}

function getMember(id) {
  return members.find(m => m.id === id);
}

// COUNT
function countLeft(id) {
  let m = getMember(id);
  if (!m || m.left === 0) return 0;
  return 1 + countLeft(m.left) + countRight(m.left);
}

function countRight(id) {
  let m = getMember(id);
  if (!m || m.right === 0) return 0;
  return 1 + countLeft(m.right) + countRight(m.right);
}

// PAIR
function calculatePairs(id) {
  return Math.min(countLeft(id), countRight(id));
}

// INCOME
function calculateIncome(id) {
  return calculatePairs(id) * 3;
}

// TOTAL
function totalIncome() {
  return members.reduce((sum, m) => sum + calculateIncome(m.id), 0);
}

function companyProfit() {
  return members.length * 10 - totalIncome();
}

// ADD MEMBER
function addMember(parentId, side) {
  let name = prompt("Enter name");
  if (!name) return;

  let parent = getMember(parentId);

  if (side === "left" && parent.left !== 0) {
    alert("Left filled");
    return;
  }

  if (side === "right" && parent.right !== 0) {
    alert("Right filled");
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

// MEMBERS TABLE
function renderMembers() {
  let table = document.getElementById("membersTable");
  table.innerHTML = "";

  members.forEach(m => {
    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${countLeft(m.id)}</td>
        <td>${countRight(m.id)}</td>
        <td>${calculatePairs(m.id)}</td>
        <td>₹${calculateIncome(m.id)}</td>
        <td>
          <button onclick="addMember(${m.id}, 'left')">L</button>
          <button onclick="addMember(${m.id}, 'right')">R</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("companyProfitText").innerText =
    "Company Profit: ₹" + companyProfit();
}

// TREE
function renderTree() {
  let container = document.getElementById("treeContainer");

  function draw(id) {
    let m = getMember(id);
    if (!m) return "";

    return `
      <div class="node">
        <b>${m.name}</b>
        <div>Pair: ${calculatePairs(id)}</div>
        <div>₹${calculateIncome(id)}</div>

        <button onclick="addMember(${id}, 'left')">L</button>
        <button onclick="addMember(${id}, 'right')">R</button>

        <div class="children">
          ${m.left ? draw(m.left) : ""}
          ${m.right ? draw(m.right) : ""}
        </div>
      </div>
    `;
  }

  container.innerHTML = draw(1);
}

// DASHBOARD
function renderDashboard() {
  document.getElementById("totalMembers").innerText = members.length;

  let totalPairs = members.reduce((sum, m) => sum + calculatePairs(m.id), 0);
  document.getElementById("totalPairs").innerText = totalPairs;

  document.getElementById("totalIncome").innerText = "₹" + totalIncome();
  document.getElementById("companyProfit").innerText = "₹" + companyProfit();
}

// NAVIGATION
function showPage(page) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("treePage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(page).style.display = "block";
}

// INIT
function renderAll() {
  renderMembers();
  renderTree();
  renderDashboard();
}

window.onload = function () {
  showPage("dashboardPage");
  renderAll();
};
