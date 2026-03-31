let tree = {
  id: 1,
  name: "Rajesh",
  left: null,
  right: null,
  wallet: 0
};

let data = localStorage.getItem("mlmTree");
if (data) tree = JSON.parse(data);

function save() {
  localStorage.setItem("mlmTree", JSON.stringify(tree));
}

function fixWallet(node) {
  if (!node) return;
  if (node.wallet === undefined) node.wallet = 0;
  fixWallet(node.left);
  fixWallet(node.right);
}

function addMemberToNode(id, side) {
  let name = prompt("Enter name");
  if (!name) return;

  function add(node) {
    if (!node) return;

    if (node.id === id) {
      if (side === "left" && !node.left) {
        node.left = { id: Date.now(), name, left: null, right: null, wallet: 0 };
      } else if (side === "right" && !node.right) {
        node.right = { id: Date.now(), name, left: null, right: null, wallet: 0 };
      } else {
        alert("Already filled");
      }
    }

    add(node.left);
    add(node.right);
  }

  add(tree);
  save();
  render();
}

function editMember(id) {
  let name = prompt("New name");
  if (!name) return;

  function edit(node) {
    if (!node) return;
    if (node.id === id) node.name = name;

    edit(node.left);
    edit(node.right);
  }

  edit(tree);
  save();
  render();
}

function count(node) {
  if (!node) return 0;
  return 1 + count(node.left) + count(node.right);
}

function downline(node) {
  if (!node) return 0;
  return 1 + downline(node.left) + downline(node.right);
}

function dashboard() {
  let members = count(tree);
  let left = tree.left ? downline(tree.left) : 0;
  let right = tree.right ? downline(tree.right) : 0;
  let pairs = Math.min(left, right);

  document.getElementById("members").innerText = members;
  document.getElementById("pairs").innerText = pairs;
  document.getElementById("commission").innerText = pairs * 3;
  document.getElementById("profit").innerText = members * 10 - pairs * 3;
}

function table() {
  let arr = [];

  function collect(node) {
    if (!node) return;
    arr.push(node);
    collect(node.left);
    collect(node.right);
  }

  collect(tree);

  let html = "";

  arr.forEach(m => {
    let left = m.left ? downline(m.left) : 0;
    let right = m.right ? downline(m.right) : 0;

    let income = Math.min(left, right) * 3;

    if (!m.wallet) m.wallet = 0;
    if (income > m.wallet) m.wallet = income;

    html += `
      <tr>
        <td>${m.name}</td>
        <td>${m.id}</td>
        <td>${left}</td>
        <td>${right}</td>
        <td>₹${income}</td>
        <td>₹${m.wallet}</td>
        <td>
          <button onclick="editMember(${m.id})">Edit</button>
          <button onclick="openAction(${m.id})">Action</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("membersTable").innerHTML = html;
}

// ✅ ACTION FIX
let currentUserId = null;

function openAction(id) {
  currentUserId = id;

  let box = document.getElementById("actionBox");

  if (!box) {
    alert("Action box not found ❌");
    return;
  }

  box.style.display = "block";

  setTimeout(() => {
    box.scrollIntoView({ behavior: "smooth" });
  }, 200);
}

function closeAction() {
  document.getElementById("actionBox").style.display = "none";
}

function submitWithdraw() {
  let amount = parseInt(document.getElementById("w_amount").value);

  if (!amount || amount <= 0) return alert("Enter valid amount");

  function update(node) {
    if (!node) return;

    if (node.id === currentUserId) {
      if (node.wallet >= amount) {
        node.wallet -= amount;
        alert("Withdraw request submitted");
      } else {
        alert("Insufficient balance");
      }
    }

    update(node.left);
    update(node.right);
  }

  update(tree);
  save();
  render();
}

function submitTransfer() {
  let toName = document.getElementById("t_to").value.toLowerCase();
  let amount = parseInt(document.getElementById("t_amount").value);

  let sender = null;
  let receiver = null;

  function find(node) {
    if (!node) return;

    if (node.id === currentUserId) sender = node;
    if (node.name.toLowerCase() === toName) receiver = node;

    find(node.left);
    find(node.right);
  }

  find(tree);

  if (!receiver) return alert("Receiver not found");
  if (!amount || amount <= 0) return alert("Enter valid amount");
  if (sender.wallet < amount) return alert("Not enough balance");

  sender.wallet -= amount;
  receiver.wallet += amount;

  alert("Transfer success");

  save();
  render();
}

function nodeUI(node) {
  if (!node) return "";

  return `
    <div class="node">
      ${node.name}<br>ID:${node.id}<br>
      <button onclick="addMemberToNode(${node.id},'left')">L</button>
      <button onclick="addMemberToNode(${node.id},'right')">R</button><br>
      <button onclick="editMember(${node.id})">Edit</button>
      <div class="children">
        ${nodeUI(node.left)}
        ${nodeUI(node.right)}
      </div>
    </div>
  `;
}

function renderTree() {
  document.getElementById("tree").innerHTML = nodeUI(tree);
}

function searchMember() {
  let input = document.getElementById("searchBox").value.toLowerCase();
  let rows = document.querySelectorAll("#membersTable tr");

  rows.forEach(row => {
    let name = row.children[0].innerText.toLowerCase();
    row.style.display = name.includes(input) ? "" : "none";
  });
}

function showPage(p) {
  document.getElementById("dashboardPage").style.display = "none";
  document.getElementById("treePage").style.display = "none";
  document.getElementById("membersPage").style.display = "none";

  document.getElementById(p + "Page").style.display = "block";
}

function render() {
  fixWallet(tree);
  renderTree();
  table();
  dashboard();
}

render();
