// ADMIN
let ADMIN_USER = "admin";
let ADMIN_PASS = "1234";

function adminLogin() {
  let u = adminUser.value;
  let p = adminPass.value;

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem("adminLogin", "true");
    location.reload();
  } else alert("Wrong login");
}

function checkLogin() {
  let s = localStorage.getItem("adminLogin");

  loginPage.style.display = s === "true" ? "none" : "block";
  app.style.display = s === "true" ? "block" : "none";
}

function logout() {
  localStorage.removeItem("adminLogin");
  location.reload();
}

// MULTI COMPANY
let currentCompany = localStorage.getItem("currentCompany") || "1";

function getKey() {
  return "mlm_" + currentCompany;
}

// LOAD
let tree;

function loadTree() {
  let data = localStorage.getItem(getKey());

  if (data) {
    tree = JSON.parse(data);
  } else {
    tree = { id: 1, name: "Root", left: null, right: null, wallet: 0 };
  }
}

// SAVE
function save() {
  localStorage.setItem(getKey(), JSON.stringify(tree));
}

// CHANGE COMPANY
function changeCompany() {
  currentCompany = companySelect.value;
  localStorage.setItem("currentCompany", currentCompany);
  loadTree();
  render();
}

// LOCK
const MAX_PAYOUT = 1000;

// TREE FUNCTIONS
function addMemberToNode(id, side) {
  let name = prompt("Name");
  if (!name) return;

  function add(n) {
    if (!n) return;

    if (n.id === id) {
      if (side === "left" && !n.left)
        n.left = { id: Date.now(), name, left: null, right: null, wallet: 0 };
      else if (side === "right" && !n.right)
        n.right = { id: Date.now(), name, left: null, right: null, wallet: 0 };
      else alert("Full");
    }

    add(n.left);
    add(n.right);
  }

  add(tree);
  save();
  render();
}

function editMember(id) {
  let name = prompt("New name");

  function edit(n) {
    if (!n) return;
    if (n.id === id) n.name = name;

    edit(n.left);
    edit(n.right);
  }

  edit(tree);
  save();
  render();
}

// COUNT
function count(n) {
  if (!n) return 0;
  return 1 + count(n.left) + count(n.right);
}

function downline(n) {
  if (!n) return 0;
  return 1 + downline(n.left) + downline(n.right);
}

// DASHBOARD
function dashboard() {
  let m = count(tree);
  let l = tree.left ? downline(tree.left) : 0;
  let r = tree.right ? downline(tree.right) : 0;
  let p = Math.min(l, r);

  members.innerText = m;
  pairs.innerText = p;
  commission.innerText = p * 3;
  profit.innerText = m * 10 - p * 3;
}

// TABLE
function table() {
  let arr = [];

  function collect(n) {
    if (!n) return;
    arr.push(n);
    collect(n.left);
    collect(n.right);
  }

  collect(tree);

  let html = "";

  arr.forEach(m => {
    let l = m.left ? downline(m.left) : 0;
    let r = m.right ? downline(m.right) : 0;

    let income = Math.min(l, r) * 3;

    if (!m.wallet) m.wallet = 0;

    if (m.wallet < MAX_PAYOUT) {
      let add = income - m.wallet;
      if (add > 0) m.wallet += add;
      if (m.wallet > MAX_PAYOUT) m.wallet = MAX_PAYOUT;
    }

    let status = m.wallet >= MAX_PAYOUT ? "🔒" : "Active";

    html += `
    <tr>
      <td>${m.name}</td>
      <td>${m.id}</td>
      <td>${l}</td>
      <td>${r}</td>
      <td>${income}</td>
      <td>${m.wallet}</td>
      <td>${status}</td>
      <td>
        <button onclick="editMember(${m.id})">Edit</button>
        <button onclick="openAction(${m.id})">Action</button>
      </td>
    </tr>`;
  });

  membersTable.innerHTML = html;
}

// ACTION
let currentUserId = null;

function openAction(id) {
  currentUserId = id;
  actionBox.style.display = "block";
  window.scrollTo(0, document.body.scrollHeight);
}

function closeAction() {
  actionBox.style.display = "none";
}

// WITHDRAW
function submitWithdraw() {
  let amt = parseInt(w_amount.value);

  function update(n) {
    if (!n) return;

    if (n.id === currentUserId) {
      if (n.wallet >= amt) {
        n.wallet -= amt;
        alert("Withdraw success");
      } else alert("Low balance");
    }

    update(n.left);
    update(n.right);
  }

  update(tree);
  save();
  render();
}

// TRANSFER
function submitTransfer() {
  let to = t_to.value.toLowerCase();
  let amt = parseInt(t_amount.value);

  let s, r;

  function find(n) {
    if (!n) return;

    if (n.id === currentUserId) s = n;
    if (n.name.toLowerCase() === to) r = n;

    find(n.left);
    find(n.right);
  }

  find(tree);

  if (!r) return alert("Not found");
  if (s.wallet < amt) return alert("Low balance");

  s.wallet -= amt;
  r.wallet += amt;

  alert("Done");
  save();
  render();
}

// TREE UI
function nodeUI(n) {
  if (!n) return "";

  return `
  <div class="node">
    ${n.name}<br>
    <button onclick="addMemberToNode(${n.id},'left')">L</button>
    <button onclick="addMemberToNode(${n.id},'right')">R</button>
    <button onclick="editMember(${n.id})">Edit</button>
    <div>${nodeUI(n.left)}${nodeUI(n.right)}</div>
  </div>`;
}

function renderTree() {
  treeDiv.innerHTML = nodeUI(tree);
}

// SEARCH
function searchMember() {
  let v = searchBox.value.toLowerCase();
  let rows = document.querySelectorAll("#membersTable tr");

  rows.forEach(r => {
    let name = r.children[0].innerText.toLowerCase();
    r.style.display = name.includes(v) ? "" : "none";
  });
}

// PAGE
function showPage(p) {
  dashboardPage.style.display = "none";
  treePage.style.display = "none";
  membersPage.style.display = "none";

  window[p + "Page"].style.display = "block";
}

// MAIN
function render() {
  checkLogin();
  loadTree();
  companySelect.value = currentCompany;
  renderTree();
  table();
  dashboard();
}

render();
