// ================== STORAGE ==================
let companies = JSON.parse(localStorage.getItem("companies")) || [];
let currentCompanyIndex = 0;

// ================== INIT ==================
if (companies.length === 0) {
    // 10 company create
    for (let i = 1; i <= 10; i++) {
        companies.push({
            name: "Company " + i,
            members: [
                { id: 1, name: "Root", left: null, right: null }
            ]
        });
    }
    saveData();
}

function saveData() {
    localStorage.setItem("companies", JSON.stringify(companies));
}

// ================== COMPANY ==================
function getCurrentCompany() {
    return companies[currentCompanyIndex];
}

function switchCompany(index) {
    currentCompanyIndex = index;
    renderAll();
}

function updateCompanyName() {
    const name = prompt("Enter Company Name:");
    if (name) {
        companies[currentCompanyIndex].name = name;
        saveData();
        renderCompanies();
    }
}

function renderCompanies() {
    const box = document.getElementById("companyList");
    if (!box) return;

    box.innerHTML = "";

    companies.forEach((c, i) => {
        const btn = document.createElement("button");
        btn.innerText = c.name;
        btn.onclick = () => switchCompany(i);
        box.appendChild(btn);
    });
}

// ================== MEMBER ==================
function addMember(parentId, side) {
    const company = getCurrentCompany();

    const name = prompt("Enter Member Name:");
    if (!name) return;

    const newId = Date.now();

    const parent = company.members.find(m => m.id === parentId);

    if (side === "left") {
        if (parent.left) return alert("Left already filled");
        parent.left = newId;
    } else {
        if (parent.right) return alert("Right already filled");
        parent.right = newId;
    }

    company.members.push({
        id: newId,
        name: name,
        left: null,
        right: null
    });

    saveData();
    renderAll();
}

function addLeft(id) {
    addMember(id, "left");
}

function addRight(id) {
    addMember(id, "right");
}

function editMember(id) {
    const company = getCurrentCompany();
    const m = company.members.find(x => x.id === id);

    const name = prompt("Edit Name:", m.name);
    if (name) {
        m.name = name;
        saveData();
        renderAll();
    }
}

// ================== TREE ==================
function renderTree() {
    const container = document.getElementById("treeContainer");
    if (!container) return;

    const company = getCurrentCompany();
    const members = company.members;

    container.innerHTML = "";

    const map = {};
    members.forEach(m => map[m.id] = m);

    function createNode(member) {
        const li = document.createElement("li");

        const box = document.createElement("div");
        box.className = "tree-box";
        box.innerHTML = `
            ${member.name}<br>
            ID: ${member.id}<br>
            <button onclick="addLeft(${member.id})">L</button>
            <button onclick="addRight(${member.id})">R</button>
            <button onclick="editMember(${member.id})">Edit</button>
        `;

        li.appendChild(box);

        if (member.left || member.right) {
            const ul = document.createElement("ul");

            if (member.left && map[member.left]) {
                ul.appendChild(createNode(map[member.left]));
            }

            if (member.right && map[member.right]) {
                ul.appendChild(createNode(map[member.right]));
            }

            li.appendChild(ul);
        }

        return li;
    }

    const rootUL = document.createElement("ul");
    rootUL.className = "tree";

    rootUL.appendChild(createNode(members[0]));
    container.appendChild(rootUL);
}

// ================== MEMBERS TABLE ==================
function renderMembers() {
    const table = document.getElementById("memberTable");
    if (!table) return;

    const company = getCurrentCompany();
    const members = company.members;

    table.innerHTML = "";

    members.forEach(m => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${m.left || 0}</td>
            <td>${m.right || 0}</td>
            <td>
                <button onclick="addLeft(${m.id})">L</button>
                <button onclick="addRight(${m.id})">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        `;

        table.appendChild(tr);
    });
}

// ================== DASHBOARD ==================
function renderDashboard() {
    const total = document.getElementById("totalMembers");
    if (!total) return;

    const company = getCurrentCompany();
    total.innerText = company.members.length;
}

// ================== MAIN ==================
function renderAll() {
    renderCompanies();
    renderTree();
    renderMembers();
    renderDashboard();
}

window.onload = function () {
    renderAll();
};
