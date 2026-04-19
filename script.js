// ===== DATA =====
let members = JSON.parse(localStorage.getItem("members")) || [
    { id: 1, name: "Rajesh", left: null, right: null }
];

// 🔴 FIX: companies string में convert
let companies = JSON.parse(localStorage.getItem("companies")) || [
    {name:"RJ Recharge"},
    {name:"Company 2"},
    {name:"Company 3"},
    {name:"Company 4"},
    {name:"Company 5"},
    {name:"Company 6"},
    {name:"Company 7"},
    {name:"Company 8"},
    {name:"Company 9"},
    {name:"Company 10"}
];

// ===== SAVE =====
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("companies", JSON.stringify(companies));
}

// ===== ADD MEMBER =====
function addMember(parentId, side) {
    let name = prompt("Enter name");
    if (!name) return;

    let id = Date.now();

    let parent = members.find(m => m.id === parentId);
    if (!parent) return;

    if (side === "L" && parent.left) return alert("Left filled");
    if (side === "R" && parent.right) return alert("Right filled");

    members.push({ id, name, left: null, right: null });

    if (side === "L") parent.left = id;
    if (side === "R") parent.right = id;

    saveData();
    renderTree();
    renderMembers();
}

// ===== EDIT =====
function editMember(id) {
    let m = members.find(x => x.id === id);
    let n = prompt("Edit name", m.name);
    if (n) {
        m.name = n;
        saveData();
        renderTree();
        renderMembers();
    }
}

// ===== PAIR =====
function count(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let c = 0;
    if (m.left) c += 1 + count(m.left);
    if (m.right) c += 1 + count(m.right);

    return c;
}

function pair(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let l = count(m.left);
    let r = count(m.right);

    return Math.min(l, r);
}

// ===== TREE =====
function renderTree() {
    let box = document.getElementById("tree");
    if (!box) return;

    box.innerHTML = "<h2>Binary Tree</h2><div class='treeWrap'></div>";
    let wrap = box.querySelector(".treeWrap");

    function build(id) {
        let m = members.find(x => x.id === id);
        if (!m) return "";

        let p = pair(m.id);
        let income = p * 3;

        return `
        <div class="node">
            <div class="card">
                <div>${m.name}</div>
                <div>Pair: ${p}</div>
                <div>₹${income}</div>

                <div class="btns">
                    <button onclick="addMember(${m.id},'L')">L</button>
                    <button onclick="addMember(${m.id},'R')">R</button>
                    <button onclick="editMember(${m.id})">Edit</button>
                </div>
            </div>

            <div class="children">
                ${m.left ? build(m.left) : ""}
                ${m.right ? build(m.right) : ""}
            </div>
        </div>
        `;
    }

    wrap.innerHTML = build(1);
}

// ===== MEMBERS TABLE =====
function renderMembers() {
    let table = document.getElementById("membersTable");
    if (!table) return;

    table.innerHTML = "";

    members.forEach(m => {
        let p = pair(m.id);
        let inc = p * 3;

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${m.left || 0}</td>
            <td>${m.right || 0}</td>
            <td>${p}</td>
            <td>₹${inc}</td>
            <td>
                <button onclick="addMember(${m.id},'L')">L</button>
                <button onclick="addMember(${m.id},'R')">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>
        `;
    });
}

// ===== FIXED COMPANIES =====
function renderCompanies() {
    let sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    // remove old
    document.querySelectorAll(".companyBtn").forEach(e => e.remove());

    companies.forEach(c => {
        let btn = document.createElement("button");

        // 🔴 FIX HERE
        btn.innerText = c.name;

        btn.className = "companyBtn";
        sidebar.appendChild(btn);
    });
}

// ===== INIT =====
renderTree();
renderMembers();
renderCompanies();
