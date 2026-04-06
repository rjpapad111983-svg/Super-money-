let currentCompany = localStorage.getItem("company") || "1";

// ================= COMPANY NAME =================

function updateCompanyName() {
  let name = localStorage.getItem("companyName_" + currentCompany) || ("Company " + currentCompany);
  document.getElementById("companyTitle").innerText = name;
}

function renameCompany() {
  let name = document.getElementById("companyNameInput").value;
  if (!name) return alert("Enter company name");

  localStorage.setItem("companyName_" + currentCompany, name);
  updateCompanyName();
}

function changeCompany() {
  currentCompany = document.getElementById("companySelect").value;
  localStorage.setItem("company", currentCompany);
  updateCompanyName();
  render();
}

// ================= STORAGE =================

function getData() {
  return JSON.parse(localStorage.getItem("data_" + currentCompany)) || [];
}

function saveData(data) {
  localStorage.setItem("data_" + currentCompany, JSON.stringify(data));
}

// ================= TREE JOIN =================

function addLeft(parentId) {
  let name = prompt("Enter Name");
  if (!name) return;

  let data = getData();
  let parent = data.find(x => x.id == parentId);

  if (parent.leftChild) return alert("Left already filled");

  let id = Date.now().toString();

  data.push({ id, name, leftChild:null, rightChild:null });
  parent.leftChild = id;

  saveData(data);
  render();
}

function addRight(parentId) {
  let name = prompt("Enter Name");
  if (!name) return;

  let data = getData();
  let parent = data.find(x => x.id == parentId);

  if (parent.rightChild) return alert("Right already filled");

  let id = Date.now().toString();

  data.push({ id, name, leftChild:null, rightChild:null });
  parent.rightChild = id;

  saveData(data);
  render();
}

// ================= COUNT =================

function count(id, side) {
  let data = getData();
  let m = data.find(x => x.id == id);
  if (!m) return 0;

  let child = side=="left" ? m.leftChild : m.rightChild;
  if (!child) return 0;

  return 1 + count(child,"left") + count(child,"right");
}

// ================= EDIT =================

function editMember(id) {
  let data = getData();
  let m = data.find(x=>x.id==id);

  let n = prompt("Edit Name", m.name);
  if (!n) return;

  m.name = n;

  saveData(data);
  render();
}

// ================= TREE =================

function renderTree() {
  let data = getData();
  let c = document.getElementById("treeContainer");

  if (data.length==0) {
    c.innerHTML = "<button onclick='createRoot()'>Create Root</button>";
    return;
  }

  let root = data[0];

  function build(m){
    if(!m) return "";

    let l = data.find(x=>x.id==m.leftChild);
    let r = data.find(x=>x.id==m.rightChild);

    return `
    <div style="text-align:center;margin:10px;">
      <div style="border:1px solid #fff;padding:10px;min-width:120px;">
        ${m.name}<br>
        Pair:${m.pair||0}<br>
        ₹${m.income||0}<br><br>

        <button onclick="addLeft('${m.id}')">L</button>
        <button onclick="addRight('${m.id}')">R</button><br><br>
        <button onclick="editMember('${m.id}')">Edit</button>
      </div>

      <div style="display:flex;gap:30px;justify-content:center;">
        ${build(l)}
        ${build(r)}
      </div>
    </div>`;
  }

  c.innerHTML = build(root);
}

// ================= ROOT =================

function createRoot(){
  let name = prompt("Enter Root Name");
  if (!name) return;

  let id = "1"; // root fix

  let data = [{id,name,leftChild:null,rightChild:null}];
  saveData(data);
  render();
}

// ================= MAIN =================

function render(){
  let data = getData();
  let table = document.getElementById("memberTable");

  table.innerHTML = "";

  let totalPair=0, totalIncome=0, totalProfit=0;

  data.forEach(m=>{
    m.left = count(m.id,"left");
    m.right = count(m.id,"right");

    m.pair = Math.min(m.left,m.right);
    m.income = m.pair * 3;

    m.profit = (m.left + m.right) * 10 - m.income;

    totalPair += m.pair;
    totalIncome += m.income;
    totalProfit += m.profit;

    table.innerHTML += `
    <tr>
      <td>${m.name}</td>
      <td>${m.left}</td>
      <td>${m.right}</td>
      <td>${m.pair}</td>
      <td>₹${m.income}</td>
      <td>₹${m.profit}</td>
      <td><button onclick="editMember('${m.id}')">Edit</button></td>
    </tr>`;
  });

  document.getElementById("totalMembers").innerText = data.length;
  document.getElementById("totalPairs").innerText = totalPair;
  document.getElementById("totalCommission").innerText = totalIncome;
  document.getElementById("companyProfit").innerText = totalProfit;

  renderTree();
}

// ================= SEARCH =================

function searchMember(){
  let v = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#memberTable tr");

  rows.forEach(r=>{
    r.style.display = r.innerText.toLowerCase().includes(v) ? "" : "none";
  });
}

// ================= NAV =================

function showPage(p){
  document.getElementById("dashboard").style.display="none";
  document.getElementById("tree").style.display="none";
  document.getElementById("members").style.display="none";

  document.getElementById(p).style.display="block";
}

// ================= INIT =================

updateCompanyName();
render();
