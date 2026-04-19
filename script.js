// ===== DATA =====
let members = JSON.parse(localStorage.getItem("members")) || [
    { id: 1, name: "Rajesh", left: null, right: null }
];

let companies = JSON.parse(localStorage.getItem("companies")) || [
    "RJ Recharge","Company 2","Company 3","Company 4","Company 5",
    "Company 6","Company 7","Company 8","Company 9","Company 10"
];

// ===== SAVE =====
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
}

// ===== ADD MEMBER =====
function addMember(parentId, side) {
    let name = prompt("Enter member name:");
    if (!name) return;

    let id = Date.now();

    let parent = members.find(m => m.id === parentId);
    if (!parent) return;

    if (side === "L" && parent.left) return alert("Left already filled");
    if (side === "R" && parent.right) return alert("Right already filled");

    let newMember = { id, name, left: null, right: null };
    members.push(newMember);

    if (side === "L") parent.left = id;
    if (side === "R") parent.right = id;

    saveData();
    renderTree();
    renderMembers();
}

// ===== EDIT MEMBER =====
function editMember(id) {
    let m = members.find(x => x.id === id);
    let name = prompt("Edit name:", m.name);
    if (name) {
        m.name = name;
        saveData();
        renderTree();
        renderMembers();
    }
}

// ===== PAIR CALC =====
function countDownline(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let count = 0;
    if (m.left) count += 1 + countDownline(m.left);
    if (m.right) count += 1 + countDownline(m.right);

    return count;
}

function getPair(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let left = countDownline(m.left);
    let right = countDownline(m.right);

    return Math.min(left, right);
}

// ===== TREE RENDER =====
function renderTree() {
    let box = document.getElementById("tree");
    box.innerHTML = "<h2>Binary Tree</h2><div class='treeContainer'></div>";

    let container = box.querySelector(".treeContainer");

    function createNode(id) {
        let m = members.find(x => x.id === id);
        if (!m) return "";

        let pair = getPair(m.id);
        let income = pair * 3;

        return `
        <div class="tree-node">
            <div class="card">
                <div class="name">${m.name}</div>
                <div>Pair: ${pair}</div>
                <div>₹${income}</div>

                <div class="btns">
                    <button onclick="addMember(${m.id}, 'L')">L</button>
                    <button onclick="addMember(${m.id}, 'R')">R</button>
                    <button onclick="editMember(${m.id})">Edit</button>
                </div>
            </div>

            <div class="children">
                ${m.left ? createNode(m.left) : ""}
                ${m.right ? createNode(m.right) : ""}
            </div>
        </div>
        `;
    }

    container.innerHTML = createNode(1);
}

// ===== MEMBERS TABLE =====
function renderMembers() {
    let tbody = document.getElementById("membersTable");
    if (!tbody) return;

    tbody.innerHTML = "";

    members.forEach(m => {
        let pair = getPair(m.id);
        let income = pair * 3;

        let row = `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${m.left || 0}</td>
            <td>${m.right || 0}</td>
            <td>${pair}</td>
            <td>₹${income}</td>
            <td>
                <button onclick="addMember(${m.id},'L')">L</button>
                <button onclick="addMember(${m.id},'R')">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>
        `;
        tbody.innerHTML += row;
    });
}

// ===== COMPANIES =====
function renderCompanies() {
    let sidebar = document.querySelector(".sidebar");

    document.querySelectorAll(".companyBtn").forEach(e => e.remove());

    companies.forEach(c => {
        let btn = document.createElement("button");
        btn.innerText = c;
        btn.className = "companyBtn";
        sidebar.appendChild(btn);
    });
}

// ===== INIT =====
renderTree();
renderMembers();
renderCompanies();
