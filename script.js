// =======================
// DATA
// =======================

function getData() {
  return JSON.parse(localStorage.getItem("data_" + currentCompany)) || [];
}

function saveData(data) {
  localStorage.setItem("data_" + currentCompany, JSON.stringify(data));
}

// =======================
// DOWNLINE COUNT (MAIN)
// =======================

function countDownline(id, side) {
  let data = getData();
  let member = data.find(m => m.id == id);

  if (!member) return 0;

  let childId = side === "left" ? member.leftChild : member.rightChild;
  if (!childId) return 0;

  let count = 1;

  count += countDownline(childId, "left");
  count += countDownline(childId, "right");

  return count;
}

// =======================
// CALCULATE ALL
// =======================

function calculateAll() {
  let data = getData();

  data.forEach(m => {
    m.leftTotal = countDownline(m.id, "left");
    m.rightTotal = countDownline(m.id, "right");

    m.pair = Math.min(m.leftTotal, m.rightTotal);

    m.income = m.pair * 3;

    // company profit (example logic)
    m.companyProfit = (m.leftTotal + m.rightTotal) * 10 - m.income;
  });

  saveData(data);
}

// =======================
// ADD MEMBER
// =======================

function addMember() {
  let name = document.getElementById("name").value.trim();
  let id = document.getElementById("memberId").value.trim();

  if (!name || !id) return alert("Enter Name & ID");

  let data = getData();

  if (data.find(m => m.id == id)) return alert("ID exists");

  data.push({
    name,
    id,
    leftChild: null,
    rightChild: null
  });

  saveData(data);
  render();
}

// =======================
// LEFT RIGHT LINK
// =======================

function addLeft(parentId) {
  let childId = prompt("Enter LEFT ID");

  let data = getData();
  let parent = data.find(m => m.id == parentId);

  if (parent.leftChild) return alert("Already filled");

  parent.leftChild = childId;

  saveData(data);
  render();
}

function addRight(parentId) {
  let childId = prompt("Enter RIGHT ID");

  let data = getData();
  let parent = data.find(m => m.id == parentId);

  if (parent.rightChild) return alert("Already filled");

  parent.rightChild = childId;

  saveData(data);
  render();
}

// =======================
// EDIT
// =======================

function editMember(id) {
  let data = getData();
  let m = data.find(x => x.id == id);

  let name = prompt("New Name", m.name);
  if (!name) return;

  m.name = name;

  saveData(data);
  render();
}

// =======================
// TREE
// =======================

function renderTree() {
  let data = getData();
  let container = document.getElementById("treeContainer");

  if (data.length === 0) return;

  let root = data[0];

  function build(m) {
    if (!m) return "";

    let left = data.find(x => x.id == m.leftChild);
    let right = data.find(x => x.id == m.rightChild);

    return `
    <div style="text-align:center;margin:15px;">
      <div style="border:1px solid #fff;padding:10px;">
        ${m.name}<br>ID:${m.id}<br>
        Pair: ${m.pair || 0}<br>
        ₹${m.income || 0}
        <br><br>
        <button onclick="addLeft('${m.id}')">L</button>
        <button onclick="addRight('${m.id}')">R</button>
        <button onclick="editMember('${m.id}')">Edit</button>
      </div>

      <div style="display:flex;gap:40px;justify-content:center;">
        ${build(left)}
        ${build(right)}
      </div>
    </div>
    `;
  }

  container.innerHTML = build(root);
}

// =======================
// RENDER TABLE
// =======================

function render() {
  calculateAll();

  let data = getData();
  let table = document.getElementById("memberTable");

  table.innerHTML = "";

  let totalCompanyProfit = 0;

  data.forEach(m => {
    totalCompanyProfit += m.companyProfit;

    table.innerHTML += `
    <tr>
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${m.leftTotal || 0}</td>
      <td>${m.rightTotal || 0}</td>
      <td>${m.pair || 0}</td>
      <td>₹${m.income || 0}</td>
      <td>₹${m.companyProfit || 0}</td>
      <td><button onclick="editMember('${m.id}')">Edit</button></td>
    </tr>
    `;
  });

  document.getElementById("companyProfit").innerText = totalCompanyProfit;

  renderTree();
}

// =======================
// SEARCH
// =======================

function searchMember() {
  let val = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(r => {
    r.style.display = r.innerText.toLowerCase().includes(val) ? "" : "none";
  });
}
