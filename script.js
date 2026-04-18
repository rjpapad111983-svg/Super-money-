// ===== DATA =====
let members = JSON.parse(localStorage.getItem("members")) || [
    { id: 1, name: "Root", left: null, right: null }
];

let companies = JSON.parse(localStorage.getItem("companies")) || [
    "Company 1","Company 2","Company 3","Company 4","Company 5",
    "Company 6","Company 7","Company 8","Company 9","Company 10"
];

let zoom = 1;

// ===== SAVE =====
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("companies", JSON.stringify(companies));
}

// ===== PAGE SWITCH =====
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    if (pageId === "members") renderMembers();
    if (pageId === "treePage") renderTree();
    if (pageId === "dashboard") updateDashboard();
}

// ===== ADD MEMBER =====
function addMember(side) {
    let name = document.getElementById("name").value;
    let parentId = parseInt(document.getElementById("parentId").value);

    if (!name || !parentId) return alert("Fill all fields");

    let parent = members.find(m => m.id === parentId);
    if (!parent) return alert("Parent not found");

    if (parent[side]) return alert(side + " already filled");

    let newId = Date.now();

    parent[side] = newId;

    members.push({
        id: newId,
        name: name,
        left: null,
        right: null
    });

    saveData();
    renderMembers();
    renderTree();
}

// ===== EDIT MEMBER =====
function editMember(id) {
    let member = members.find(m => m.id === id);
    let newName = prompt("Enter new name", member.name);
    if (newName) {
        member.name = newName;
        saveData();
        renderMembers();
        renderTree();
    }
}

// ===== ADD LEFT / RIGHT FROM TABLE =====
function addChild(parentId, side) {
    let name = prompt("Enter member name");
    if (!name) return;

    let parent = members.find(m => m.id === parentId);

    if (parent[side]) return alert("Already filled");

    let newId = Date.now();

    parent[side] = newId;

    members.push({
        id: newId,
        name: name,
        left: null,
        right: null
    });

    saveData();
    renderMembers();
    renderTree();
}

// ===== CALCULATE =====
function getCounts(id) {
    let node = members.find(m => m.id === id);
    if (!node) return { left: 0, right: 0 };

    let count = (childId) => {
        if (!childId) return 0;
        let child = members.find(m => m.id === childId);
        return 1 + count(child.left) + count(child.right);
    };

    return {
        left: count(node.left),
        right: count(node.right)
    };
}

// ===== MEMBERS TABLE =====
function renderMembers() {
    let table = document.getElementById("memberTable");
    table.innerHTML = "";

    members.forEach(m => {
        let c = getCounts(m.id);
        let pair = Math.min(c.left, c.right);
        let income = pair * 3;

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${c.left}</td>
            <td>${c.right}</td>
            <td>${pair}</td>
            <td>₹${income}</td>
            <td>
                <button onclick="addChild(${m.id},'left')">L</button>
                <button onclick="addChild(${m.id},'right')">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>
        `;
    });
}

// ===== TREE =====
function renderTree() {
    let tree = document.getElementById("tree");
    tree.innerHTML = "";

    let root = members.find(m => m.id === 1);
    if (!root) return;

    function build(node) {
        if (!node) return "";

        let c = getCounts(node.id);
        let pair = Math.min(c.left, c.right);
        let income = pair * 3;

        return `
        <div class="node">
            <div class="box">
                ${node.name}<br>
                Pair: ${pair}<br>
                ₹${income}<br>
                <button onclick="addChild(${node.id},'left')">L</button>
                <button onclick="addChild(${node.id},'right')">R</button>
                <button onclick="editMember(${node.id})">Edit</button>
            </div>
            <div class="children">
                ${node.left ? build(members.find(m => m.id === node.left)) : ""}
                ${node.right ? build(members.find(m => m.id === node.right)) : ""}
            </div>
        </div>
        `;
    }

    tree.innerHTML = build(root);
}

// ===== DASHBOARD =====
function updateDashboard() {
    let totalMembers = members.length;

    let totalPairs = 0;

    members.forEach(m => {
        let c = getCounts(m.id);
        totalPairs += Math.min(c.left, c.right);
    });

    let totalIncome = totalPairs * 3;
    let companyProfit = totalMembers * 10 - totalIncome;

    document.getElementById("totalMembers").innerText = totalMembers;
    document.getElementById("totalPairs").innerText = totalPairs;
    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("companyProfit").innerText = companyProfit;
}

// ===== SEARCH =====
function searchMember() {
    let value = document.getElementById("search").value.toLowerCase();

    document.querySelectorAll("#memberTable tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
}

// ===== COMPANY LIST =====
function renderCompanies() {
    let list = document.getElementById("companyList");
    list.innerHTML = "";

    companies.forEach((c, i) => {
        list.innerHTML += `
        <button onclick="selectCompany(${i})">${c}</button>
        `;
    });
}

// ===== SELECT COMPANY =====
function selectCompany(i) {
    alert("Selected: " + companies[i]);
}

// ===== RENAME COMPANY =====
function renameCompany() {
    let index = prompt("Enter company number (1-10)");
    let name = prompt("Enter new name");

    if (!index || !name) return;

    companies[index - 1] = name;

    saveData();
    renderCompanies();
}

// ===== ZOOM =====
function zoomIn() {
    zoom += 0.1;
    document.getElementById("tree").style.transform = `scale(${zoom})`;
}

function zoomOut() {
    zoom -= 0.1;
    document.getElementById("tree").style.transform = `scale(${zoom})`;
}

// ===== INIT =====
renderMembers();
renderTree();
updateDashboard();
renderCompanies();
