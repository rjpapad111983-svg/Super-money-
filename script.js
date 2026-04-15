let members = JSON.parse(localStorage.getItem("members")) || [
  { id: 1, name: "Rajesh", left: 0, right: 0 }
];

const PAIR_INCOME = 3;
const MEMBER_FEE = 10;

// SAVE
function save() {
  localStorage.setItem("members", JSON.stringify(members));
}

// GET MEMBER
function getMember(id) {
  return members.find(m => m.id === id);
}

// ADD MEMBER
function addMember(parentId, side) {
  let parent = getMember(parentId);

  if (parent[side] !== 0) {
    alert("Already filled");
    return;
  }

  let newId = members.length + 1;

  members.push({
    id: newId,
    name: "Member " + newId,
    left: 0,
    right: 0
  });

  parent[side] = newId;

  save();
  renderAll();
}

// EDIT
function editMember(id) {
  let m = getMember(id);
  let name = prompt("Enter name", m.name);
  if (name) {
    m.name = name;
    save();
    renderAll();
  }
}

// COUNT TEAM (FULL DOWNLINE)
function countTeam(id) {
  if (id === 0) return 0;

  let m = getMember(id);
  return 1 + countTeam(m.left) + countTeam(m.right);
}

// PAIR CALCULATION (CORRECT)
function getPairs(id) {
  let m = getMember(id);

  let left = countTeam(m.left);
  let right = countTeam(m.right);

  return Math.min(left, right);
}

// MEMBERS TABLE
function renderMembers() {
  let html = "";

  members.forEach(m => {
    let pairs = getPairs(m.id);
    let income = pairs * PAIR_INCOME;

    html += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${m.left}</td>
        <td>${m.right}</td>
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

// DASHBOARD
function renderDashboard() {
  let totalMembers = members.length;
  let totalPairs = 0;
  let totalIncome = 0;

  members.forEach(m => {
    let p = getPairs(m.id);
    totalPairs += p;
    totalIncome += p * PAIR_INCOME;
  });

  let companyProfit = totalMembers * MEMBER_FEE - totalIncome;

  document.getElementById("totalMembers").innerText = totalMembers;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalIncome").innerText = totalIncome;
  document.getElementById("companyProfit").innerText = companyProfit;
}

// SEARCH
function searchMember() {
  let input = document.getElementById("search").value.toLowerCase();
  let rows = document.querySelectorAll("#membersTable tr");

  rows.forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

// PAGE SWITCH
function showPage(page) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(page + "Page").style.display = "block";
}

// MAIN
function renderAll() {
  renderMembers();
  renderDashboard();
}

renderAll();
