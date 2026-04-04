// =======================
// GLOBAL
// =======================

let currentCompany = localStorage.getItem("currentCompany") || "1";

// =======================
// INIT
// =======================

window.onload = function () {
  document.getElementById("companySelect").value = currentCompany;
  loadCompanyNames();
  render();
};

// =======================
// COMPANY SYSTEM
// =======================

function changeCompany() {
  currentCompany = document.getElementById("companySelect").value;
  localStorage.setItem("currentCompany", currentCompany);
  loadCompanyNames();
  render();
}

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

  alert("Company renamed ✅");
}

function loadCompanyNames() {
  let names = JSON.parse(localStorage.getItem("companyNames")) || {};
  let select = document.getElementById("companySelect");

  for (let i = 0; i < select.options.length; i++) {
    let val = select.options[i].value;
    select.options[i].text = names[val] || "Company " + val;
  }
}

// =======================
// PAGE SYSTEM
// =======================

function showPage(page) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("tree").style.display = "none";
  document.getElementById("members").style.display = "none";

  document.getElementById(page).style.display = "block";
}

// =======================
// DATA SYSTEM
// =======================

function getData() {
  return JSON.parse(localStorage.getItem("mlmData_" + currentCompany)) || [];
}

function saveData(data) {
  localStorage.setItem("mlmData_" + currentCompany, JSON.stringify(data));
}

// =======================
// ADD MEMBER (FIXED)
// =======================

function addMember() {
  let name = document.getElementById("name").value.trim();
  let id = document.getElementById("memberId").value.trim();
  let position = document.getElementById("position").value;

  if (!name || !id) {
    alert("Enter Name & ID");
    return;
  }

  let data = getData();

  // duplicate check
  if (data.find(m => m.id == id)) {
    alert("ID already exists");
    return;
  }

  let newMember = {
    name: name,
    id: id,
    left: 0,
    right: 0,
    wallet: 0
  };

  data.push(newMember);

  // first member root
  if (data.length > 1) {
    if (position === "left") {
      data[0].left++;
    } else {
      data[0].right++;
    }
  }

  saveData(data);

  // 👉 IMPORTANT: render after save
  render();

  alert("Member Added ✅");

  // clear input
  document.getElementById("name").value = "";
  document.getElementById("memberId").value = "";
}

// =======================
// SEARCH
// =======================

function searchMember() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(row => {
    let name = row.children[0].innerText.toLowerCase();
    row.style.display = name.includes(input) ? "" : "none";
  });
}

// =======================
// RENDER (FIXED)
// =======================

function render() {
  let data = getData();

  let table = document.getElementById("memberTable");
  table.innerHTML = "";

  let totalMembers = data.length;
  let totalPairs = 0;
  let totalCommission = 0;
  let companyProfit = 0;

  data.forEach(member => {
    let pair = Math.min(member.left, member.right);
    let income = pair * 3;

    // wallet sync
    member.wallet = income;

    totalPairs += pair;
    totalCommission += income;
    companyProfit += (pair * 10 - income);

    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${member.name}</td>
      <td>${member.id}</td>
      <td>${member.left}</td>
      <td>${member.right}</td>
      <td>₹${income}</td>
      <td>₹${member.wallet}</td>
      <td>
        <button onclick="editMember('${member.id}')">Edit</button>
      </td>
    `;

    table.appendChild(row);
  });

  saveData(data);

  // dashboard update
  document.getElementById("totalMembers").innerText = totalMembers;
  document.getElementById("totalPairs").innerText = totalPairs;
  document.getElementById("totalCommission").innerText = totalCommission;
  document.getElementById("companyProfit").innerText = companyProfit;
}

// =======================
// EDIT
// =======================

function editMember(id) {
  let data = getData();
  let member = data.find(m => m.id == id);

  let newName = prompt("Enter new name", member.name);

  if (newName) {
    member.name = newName;
    saveData(data);
    render();
  }
}
