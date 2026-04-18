// ===== LOAD DATA SAFE =====
let members = JSON.parse(localStorage.getItem("members") || "[]");
if (!Array.isArray(members) || members.length === 0) {
    members = [{ id: 1, name: "Root", left: null, right: null }];
}

// ===== COMPANY FIX =====
let companies = JSON.parse(localStorage.getItem("companies") || "[]");

if (!Array.isArray(companies) || companies.length === 0) {
    companies = [
        "Company 1","Company 2","Company 3","Company 4","Company 5",
        "Company 6","Company 7","Company 8","Company 9","Company 10"
    ];
}

// FIX: object → string
companies = companies.map(c => typeof c === "string" ? c : "Company");

// ===== SAVE =====
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("companies", JSON.stringify(companies));
}

// ===== PAGE SWITCH =====
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    renderMembers();
    renderTree();
    updateDashboard();
}

// ===== ADD MEMBER =====
function addMember(side) {
    let name = document.getElementById("name").value.trim();
    let parentId = parseInt(document.getElementById("parentId").value);

    if (!name || !parentId) return alert("Fill all fields");

    let parent = members.find(m => m.id === parentId);
    if (!parent) return alert("Parent not found");

    if (parent[side]) return alert("Already filled");

    let id = Date.now();

    parent[side] = id;

    members.push({
        id,
        name,
        left: null,
        right: null
    });

    saveData();
    renderMembers();
    renderTree();
}

// ===== ADD CHILD =====
function addChild(parentId, side) {
    let name = prompt("Enter member name");
    if (!name) return;

    let parent = members.find(m => m.id === parentId);

    if (parent[side]) return alert("Already filled");

    let id = Date.now();

    parent[side] = id;

    members.push({
        id,
        name,
        left: null,
        right: null
    });

    saveData();
    renderMembers();
    renderTree();
}

// ===== EDIT =====
function editMember(id) {
    let m = members.find(x => x.id === id);
    let n = prompt("Enter new name", m.name);
    if (n) {
        m.name = n;
        saveData();
        renderMembers();
        renderTree();
    }
}

// ===== TREE CALCULATION =====
function countNode(id) {
    let node = members.find(m => m.id === id);
    if (!node) return 0;

    return (
        (node.left ? 1 + countNode(node.left) : 0) +
        (node.right ? 1 + countNode(node.right) : 0)
    );
}

function getPair(id) {
    let node = members.find(m => m.id === id);
    if (!node) return 0;

    let left = node.left ? countNode(node.left) : 0;
    let right = node.right ? countNode(node.right) : 0;

    return Math.min(left, right);
}

// ===== MEMBERS TABLE =====
function renderMembers() {
    let table = document.getElementById("memberTable");
    if (!table) return;

    table.innerHTML = "";

    members.forEach(m => {
        let left = m.left ? countNode(m.left) : 0;
        let right = m.right ? countNode(m.right) : 0;
        let pair = Math.min(left, right);
        let income = pair * 3;

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${left}</td>
            <td>${right}</td>
            <td>${pair}</td>
            <td>₹${income}</td>
            <td>
                <button onclick="addChild(${m.id},'left')">L</button>
                <button onclick="addChild(${m.id},'right')">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>`;
    });
}

// ===== TREE (FIXED PROPER) =====
function renderTree() {
    let tree = document.getElementById("tree");
    if (!tree) return;

    let root = members.find(m => m.id === 1);
    if (!root) return;

    function build(node) {
        if (!node) return "";

        let pair = getPair(node.id);
        let income = pair * 3;

        return `
        <ul>
            <li>
                <div class="box">
                    ${node.name}<br>
                    Pair: ${pair}<br>
                    ₹${income}<br>
                    <button onclick="addChild(${node.id},'left')">L</button>
                    <button onclick="addChild(${node.id},'right')">R</button>
                    <button onclick="editMember(${node.id})">Edit</button>
                </div>

                ${(node.left || node.right) ? `
                <ul>
                    ${node.left ? `<li>${build(members.find(m=>m.id===node.left))}</li>` : "<li></li>"}
                    ${node.right ? `<li>${build(members.find(m=>m.id===node.right))}</li>` : "<li></li>"}
                </ul>` : ""}
            </li>
        </ul>`;
    }

    tree.innerHTML = build(root);
}

// ===== DASHBOARD =====
function updateDashboard() {
    let totalMembers = members.length;
    let totalPairs = members.reduce((sum, m) => sum + getPair(m.id), 0);

    let totalIncome = totalPairs * 3;
    let companyProfit = totalMembers * 10 - totalIncome;

    document.getElementById("totalMembers").innerText = totalMembers;
    document.getElementById("totalPairs").innerText = totalPairs;
    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("companyProfit").innerText = companyProfit;
}

// ===== COMPANY =====
function renderCompanies() {
    let div = document.getElementById("companyList");
    if (!div) return;

    div.innerHTML = "";

    companies.forEach((c, i) => {
        div.innerHTML += `<button onclick="selectCompany(${i})">${c}</button>`;
    });
}

function selectCompany(i) {
    alert("Selected: " + companies[i]);
}

function renameCompany() {
    let i = prompt("Enter company number (1-10)");
    let name = prompt("Enter new name");

    if (!i || !name) return;

    companies[i - 1] = name;

    saveData();
    renderCompanies();
}

// ===== ZOOM =====
let zoom = 1;

function zoomIn() {
    zoom += 0.1;
    document.getElementById("tree").style.transform = `scale(${zoom})`;
}

function zoomOut() {
    zoom -= 0.1;
    document.getElementById("tree").style.transform = `scale(${zoom})`;
}

// ===== SEARCH =====
function searchMember() {
    let value = document.getElementById("search").value.toLowerCase();

    document.querySelectorAll("#memberTable tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
}

// ===== INIT =====
renderMembers();
renderTree();
renderCompanies();
updateDashboard();
