// CURRENT COMPANY
let currentCompany = localStorage.getItem("currentCompany") || "1";

// LOAD COMPANY ON START
window.onload = function () {
  document.getElementById("companySelect").value = currentCompany;
  loadCompanyNames();
  render();
};

// CHANGE COMPANY
function changeCompany() {
  currentCompany = document.getElementById("companySelect").value;
  localStorage.setItem("currentCompany", currentCompany);
  loadCompanyNames();
  render();
}

// =======================
// ✅ COMPANY RENAME SYSTEM
// =======================

function renameCompany() {
  let name = document.getElementById("companyNameInput").value;

  if (!name) {
    alert("Enter company name");
    return;
  }

  let names = JSON.parse(localStorage.getItem("companyNames")) || {};

  names[currentCompany] = name;

  localStorage.setItem("companyNames", JSON.stringify(names));

  loadCompanyNames();

  alert("Company name updated ✅");
}

// LOAD COMPANY NAMES
function loadCompanyNames() {
  let names = JSON.parse(localStorage.getItem("companyNames")) || {};
  let select = document.getElementById("companySelect");

  for (let i = 0; i < select.options.length; i++) {
    let val = select.options[i].value;

    if (names[val]) {
      select.options[i].text = names[val];
    } else {
      select.options[i].text = "Company " + val;
    }
  }
}

// =======================
// EXISTING SYSTEM (SAFE)
// =======================

// SHOW PAGE
function showPage(page) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("tree").style.display = "none";
  document.getElementById("members").style.display = "none";

  document.getElementById(page).style.display = "block";
}

// SEARCH MEMBER
function searchMember() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(row => {
    let name = row.children[0].innerText.toLowerCase();
    row.style.display = name.includes(input) ? "" : "none";
  });
}

// =======================
// DUMMY DATA LOAD (SAFE)
// =======================

function getData() {
  return JSON.parse(localStorage.getItem("mlmData_" + currentCompany)) || [];
}

function saveData(data) {
  localStorage.setItem("mlmData_" + currentCompany, JSON.stringify(data));
}

// =======================
// RENDER SYSTEM
// =======================

function render() {
  let data = getData();

  // MEMBERS TABLE
  let table = document.getElementById("memberTable");
  table.innerHTML = "";

  let totalMembers = data.length;
  let totalPairs = 0;
  let totalCommission = 0;
  let companyProfit = 0;

  data.forEach(member => {
    let pair = Math.min(member.left, member.right);
    let income = pair * 3;

    totalPairs += pair;
    totalCommission += income;
    companyProfit += (pair * 10 - income);

    let row = `
      <tr>
        <td>${member.name}</td>
        <td>${member.id}</td>
        <td>${member.left}</td>
        <td>${member.right}</td>
        <td>₹${income}</td>
        <td>₹${member.wallet || income}</td>
        <td>
          <button onclick="editMember('${member.id}')">Edit</button>
        </td>
      </tr>
    `;

    table.innerHTML += row;
  });

  // DASHBOARD UPDATE
  document.getElementById("totalMembers").innerText = totalMembers;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalCommission").innerText = totalCommission;
  document.getElementById("companyProfit").innerText = companyProfit;
}

// =======================
// EDIT MEMBER (SAFE)
// =======================

function editMember(id) {
  alert("Edit system already available");
}
