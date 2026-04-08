let currentCompany = "1";

// STORAGE
function getData(){
  return JSON.parse(localStorage.getItem("mlmData")) || [];
}
function saveData(d){
  localStorage.setItem("mlmData", JSON.stringify(d));
}

// ROOT
function createRoot(){
  let name = prompt("Enter Root Name");
  if(!name) return;

  let data = [{id:"1", name, leftChild:null, rightChild:null}];
  saveData(data);
  render();
}

// ADD
function addLeft(id){
  let name = prompt("Enter Name");
  if(!name) return;

  let data = getData();
  let p = data.find(x=>x.id==id);
  if(p.leftChild) return alert("Left full");

  let newId = Date.now()+"";
  data.push({id:newId, name, leftChild:null, rightChild:null});
  p.leftChild = newId;

  saveData(data);
  render();
}

function addRight(id){
  let name = prompt("Enter Name");
  if(!name) return;

  let data = getData();
  let p = data.find(x=>x.id==id);
  if(p.rightChild) return alert("Right full");

  let newId = Date.now()+"";
  data.push({id:newId, name, leftChild:null, rightChild:null});
  p.rightChild = newId;

  saveData(data);
  render();
}

// EDIT
function editMember(id){
  let data = getData();
  let m = data.find(x=>x.id==id);
  let name = prompt("Edit Name", m.name);
  if(!name) return;
  m.name = name;
  saveData(data);
  render();
}

// COUNT
function count(id, side){
  let data = getData();
  let m = data.find(x=>x.id==id);
  if(!m) return 0;

  let c = side=="left" ? m.leftChild : m.rightChild;
  if(!c) return 0;

  return 1 + count(c,"left") + count(c,"right");
}

// TREE
function renderTree(){
  let data = getData();
  let box = document.getElementById("treeContainer");

  if(data.length==0){
    box.innerHTML = "<button onclick='createRoot()'>Create Root</button>";
    return;
  }

  let map = {};
  data.forEach(m=>map[m.id]=m);

  function build(n){
    if(!n) return "";

    let l = map[n.leftChild];
    let r = map[n.rightChild];

    let lc = count(n.id,"left");
    let rc = count(n.id,"right");
    let pair = Math.min(lc,rc);
    let income = pair*3;

    return `
    <ul>
      <li>
        <div class="node">
          ${n.name}<br>
          Pair:${pair}<br>
          ₹${income}<br><br>
          <button onclick="addLeft('${n.id}')">L</button>
          <button onclick="addRight('${n.id}')">R</button><br><br>
          <button onclick="editMember('${n.id}')">Edit</button>
        </div>

        ${(l||r)?`
        <ul>
          <li>${l?build(l):""}</li>
          <li>${r?build(r):""}</li>
        </ul>`:""}
      </li>
    </ul>`;
  }

  box.innerHTML = build(data[0]);
}

// TABLE
function renderTable(){
  let data = getData();
  let t = document.getElementById("memberTable");
  t.innerHTML="";

  let tp=0, ti=0, prof=0;

  data.forEach(m=>{
    let l=count(m.id,"left");
    let r=count(m.id,"right");
    let p=Math.min(l,r);
    let inc=p*3;
    let pr=(l+r)*10 - inc;

    tp+=p; ti+=inc; prof+=pr;

    t.innerHTML+=`
    <tr>
      <td>${m.name}</td>
      <td>${l}</td>
      <td>${r}</td>
      <td>${p}</td>
      <td>₹${inc}</td>
      <td>₹${pr}</td>
      <td><button onclick="editMember('${m.id}')">Edit</button></td>
    </tr>`;
  });

  document.getElementById("totalMembers").innerText=data.length;
  document.getElementById("totalPairs").innerText=tp;
  document.getElementById("totalCommission").innerText=ti;
  document.getElementById("companyProfit").innerText=prof;
}

// MAIN
function render(){
  renderTree();
  renderTable();
}

// NAV
function showPage(p){
  document.getElementById("dashboard").style.display="none";
  document.getElementById("tree").style.display="none";
  document.getElementById("members").style.display="none";

  document.getElementById(p).style.display="block";
}

// INIT
render();
