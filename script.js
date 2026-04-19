// ===== LOAD DATA =====
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

// ===== LEFT / RIGHT ADD =====
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

// ===== COUNT SYSTEM (IMPORTANT FIX) =====
function countDownline(id){
  if(!id) return 0;

  let m = members.find(x=>x.id==id);
  if(!m) return 0;

  return 1 + countDownline(m.left) + countDownline(m.right);
}

// ===== PAIR CALCULATION =====
function getData(m){
  let left = countDownline(m.left);
  let right = countDownline(m.right);

  let pairs = Math.min(left, right);
  let income = pairs * 3;

  return {left,right,pairs,income};
}

// ===== TREE =====
function renderTree(){
  let container = document.getElementById("treeContainer");
  container.innerHTML = "";

  function build(m){
    if(!m) return "";

    let d = getData(m);

    let left = members.find(x=>x.id==m.left);
    let right = members.find(x=>x.id==m.right);

    return `
    <div class="node">
      <b>${m.name}</b><br>
      Pair: ${d.pairs}<br>
      ₹${d.income}<br>

      <button onclick="addLeft(${m.id})">L</button>
      <button onclick="addRight(${m.id})">R</button>

      <div style="display:flex;justify-content:space-around;">
        ${left ? build(left) : ""}
        ${right ? build(right) : ""}
      </div>
    </div>`;
  }

  container.innerHTML = build(members[0]);
}

// ===== TABLE =====
function renderTable(){
  let table = document.getElementById("memberTable");
  table.innerHTML = "";

  let totalPairs = 0;
  let totalIncome = 0;

  members.forEach(m=>{
    let d = getData(m);

    total
