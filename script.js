// ===== DATA =====
let members = JSON.parse(localStorage.getItem("members")) || [
  {id:1,name:"Rajesh",left:null,right:null}
];

// ===== SAVE =====
function save(){
  localStorage.setItem("members", JSON.stringify(members));
}

// ===== PAGE SWITCH =====
function showPage(page){
  document.getElementById("dashboardPage").style.display="none";
  document.getElementById("treePage").style.display="none";
  document.getElementById("membersPage").style.display="none";

  if(page==="dashboard"){
    document.getElementById("dashboardPage").style.display="block";
  }
  if(page==="tree"){
    document.getElementById("treePage").style.display="block";
    renderTree();
  }
  if(page==="members"){
    document.getElementById("membersPage").style.display="block";
    renderTable();
  }
}

// ===== ADD MEMBER =====
function addMember(){
  let name = prompt("Enter Name");
  if(!name) return;

  let id = Date.now();

  members.push({
    id:id,
    name:name,
    left:null,
    right:null
  });

  save();
  renderTable();
}

// ===== ADD LEFT / RIGHT =====
function addLeft(parentId){
  let name = prompt("Left Member Name");
  if(!name) return;

  let parent = members.find(m=>m.id==parentId);
  if(parent.left){
    alert("Left already exist");
    return;
  }

  let id = Date.now();

  members.push({id,name,left:null,right:null});
  parent.left = id;

  save();
  renderTree();
}

function addRight(parentId){
  let name = prompt("Right Member Name");
  if(!name) return;

  let parent = members.find(m=>m.id==parentId);
  if(parent.right){
    alert("Right already exist");
    return;
  }

  let id = Date.now();

  members.push({id,name,left:null,right:null});
  parent.right = id;

  save();
  renderTree();
}

// ===== TREE =====
function renderTree(){
  let container = document.getElementById("treeContainer");
  container.innerHTML = "";

  function createNode(member){
    if(!member) return "";

    let left = members.find(m=>m.id==member.left);
    let right = members.find(m=>m.id==member.right);

    return `
      <div class="node">
        <div>${member.name}</div>

        <button onclick="addLeft(${member.id})">L</button>
        <button onclick="addRight(${member.id})">R</button>

        <div style="display:flex;justify-content:space-around;">
          ${left ? createNode(left) : ""}
          ${right ? createNode(right) : ""}
        </div>
      </div>
    `;
  }

  let root = members[0];
  container.innerHTML = createNode(root);
}

// ===== TABLE =====
function renderTable(){
  let table = document.getElementById("memberTable");
  table.innerHTML = "";

  members.forEach(m=>{
    table.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${m.left || 0}</td>
        <td>${m.right || 0}</td>
        <td>0</td>
        <td>₹0</td>
        <td>-</td>
      </tr>
    `;
  });

  updateDashboard();
}

// ===== DASHBOARD =====
function updateDashboard(){
  document.getElementById("totalMembers").innerText = members.length;
  document.getElementById("totalPairs").innerText = 0;
  document.getElementById("totalIncome").innerText = 0;
  document.getElementById("companyProfit").innerText = members.length * 10;
}

// ===== INIT =====
renderTable();
showPage("dashboard");
