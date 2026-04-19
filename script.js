// ===== DATA LOAD =====
let members = JSON.parse(localStorage.getItem("members")) || [
    { id: 1, name: "Rajesh", left: null, right: null }
];

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
    if (side === "L" && parent.left) return alert("Left already filled");
    if (side === "R" && parent.right) return alert("Right already filled");

    members.push({ id, name, left: null, right: null });

    if (side === "L") parent.left = id;
    if (side === "R") parent.right = id;

    saveData();
    renderAll();
}

// ===== EDIT MEMBER =====
function editMember(id) {
    let m = members.find(x => x.id === id);
    if (!m) return;

    let newName = prompt("Edit name:", m.name);
    if (newName) {
        m.name = newName;
        saveData();
        renderAll();
    }
}

// ===== COUNT DOWNLINE =====
function count(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let total = 0;
    if (m.left) total += 1 + count(m.left);
    if (m.right) total += 1 + count(m.right);

    return total;
}

// ===== PAIR =====
function pair(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let left = count(m.left);
    let right = count(m.right);

    return Math.min(left, right);
}

// ===== TREE RENDER =====
function renderTree() {
    let box = document.getElementById("tree");
    if (!box) return;

    function build(id) {
        let m = members.find(x => x.id === id);
        if (!m) return "";

        let p = pair(m.id);
        let income = p * 3;

        return `
        <li>
            <div class="card">
                <div>${m.name}</div>
                <div>Pair: ${p}</div>
                <div>₹${income}</div>

                <div>
                    <button onclick="addMember(${m.id},'L')">L</button>
                    <button onclick="addMember(${m.id},'R')">R</button>
                    <button onclick="editMember(${m.id})">Edit</button>
                </div>
            </div>

            ${(m.left || m.right) ? `
            <ul>
                ${m.left ? build(m.left) : ""}
                ${m.right ? build(m.right) : ""}
            </ul>` : ""}
        </li>
        `;
    }

    box.innerHTML = `
        <h2>Binary Tree</h2>
        <div class="treeWrap">
            <div class="tree">
                <ul>
                    ${build(1)}
                </ul>
            </div>
        </div>
    `;
}

// ===== MEMBERS TABLE =====
function renderMembers() {
    let table = document.getElementById("membersTable");
    if (!table) return;

    table.innerHTML = "";

    members.forEach(m => {
        let p = pair(m.id);
        let income = p * 3;

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${m.left || 0}</td>
            <td>${m.right || 0}</td>
            <td>${p}</td>
            <td>₹${income}</td>
            <td>
                <button onclick="addMember(${m.id},'L')">L</button>
                <button onclick="addMember(${m.id},'R')">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>
        `;
    });
}

// ===== DASHBOARD =====
function renderDashboard() {
    document.getElementById("tree").innerHTML = "";
    document.getElementById("membersTable").innerHTML = "";

    document.getElementById("totalMembers").innerText =
        "Total Members: " + members.length;

    let totalPairs = 0;
    members.forEach(m => totalPairs += pair(m.id));

    document.getElementById("totalPairs").innerText =
        "Total Pairs: " + totalPairs;

    document.getElementById("totalIncome").innerText =
        "Total Income: ₹" + (totalPairs * 3);

    document.getElementById("companyProfit").innerText =
        "Company Profit: ₹" + (members.length * 10 - totalPairs * 3);
}

// ===== COMPANIES =====
function renderCompanies() {
    let sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    document.querySelectorAll(".companyBtn").forEach(e => e.remove());

    companies.forEach(c => {
        let btn = document.createElement("button");
        btn.innerText = c.name;
        btn.className = "companyBtn";
        sidebar.appendChild(btn);
    });
}

// ===== ALL RENDER =====
function renderAll() {
    renderTree();
    renderMembers();
    renderDashboard();
    renderCompanies();
}

// ===== INIT =====
renderAll();
