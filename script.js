// ===== SAFE INIT =====
let members = JSON.parse(localStorage.getItem("members")) || [];

if(members.length === 0){
  members = [{id:1,name:"Rajesh",left:null,right:null}];
}

// ===== SAVE =====
function save(){
  localStorage.setItem("members", JSON.stringify(members));
}

// ===== PAGE SWITCH =====
function showPage(page){
  ["dashboardPage","treePage","membersPage"].forEach(id=>{
    document.getElementById(id).style.display="none";
  });

  if(page==="dashboard") document.getElementById("dashboardPage").style.display="block";
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
  members.push({id,name,left:null,right:null});

  save();
  renderTable();
}

// ===== LEFT RIGHT =====
function addLeft(pid){
  let name = prompt("Left Name");
  if(!name) return;

  let p = members.find(m=>m.id==pid);
  if(p.left){ alert("Already added"); return; }

  let id = Date.now();
  members.push({id,name,left:null,right:null});
  p.left=id;

  save();
  renderTree();
}

function addRight(pid){
  let name = prompt("Right Name");
  if(!name) return;

  let p = members.find(m=>m.id==pid);
  if(p.right){ alert("Already added"); return; }

  let id = Date.now();
  members.push({id,name,left:null,right:null});
  p.right=id;

  save();
  renderTree();
}

// ===== COUNT =====
function count(id){
  if(!id) return 0;
  let m = members.find(x=>x.id==id);
  if(!m) return 0;
  return 1 + count(m.left) + count(m.right);
}

// ===== CALC =====
function calc(m){
  let L = count(m.left);
  let R = count(m.right);
  let pair = Math.min(L,R);
  let income = pair*3;
  return {L,R,pair,income};
}

// ===== TREE =====
function renderTree(){
  let box = document.getElementById("treeContainer");
  box.innerHTML="";

  function build(m){
    let d = calc(m);
    let l = members.find(x=>x.id==m.left);
    let r = members.find(x=>x.id==m.right);

    return `
    <div class="node">
      ${m.name}<br>
      Pair:${d.pair}<br>₹${d.income}<br>
      <button onclick="addLeft(${m.id})">L</button>
      <button onclick="addRight(${m.id})">R</button>
      <div style="display:flex;gap:10px">
        ${l?build(l):""}
        ${r?build(r):""}
      </div>
    </div>`;
  }

  box.innerHTML = build(members[0]);
}

// ===== TABLE =====
function renderTable(){
  let tb = document.getElementById("memberTable");
  tb.innerHTML="";

  let totalP=0,totalI=0;

  members.forEach(m=>{
    let d=calc(m);
    totalP+=d.pair;
    totalI+=d.income;

    tb.innerHTML+=`
    <tr>
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${d.L}</td>
      <td>${d.R}</td>
      <td>${d.pair}</td>
      <td>₹${d.income}</td>
      <td>-</td>
    </tr>`;
  });

  updateDash(totalP,totalI);
}

// ===== DASH =====
function updateDash(p,i){
  let t = members.length;
  document.getElementById("totalMembers").innerText=t;
  document.getElementById("totalPairs").innerText=p;
  document.getElementById("totalIncome").innerText=i;
  document.getElementById("companyProfit").innerText=(t*10)-i;
}

// ===== START =====
document.addEventListener("DOMContentLoaded", ()=>{
  renderTable();
  showPage("dashboard");
});
