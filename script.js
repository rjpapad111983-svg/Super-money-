// ===== STORAGE =====
let companies = JSON.parse(localStorage.getItem("companies")) || [];
let currentCompanyIndex = 0;

// ===== INIT =====
if (companies.length === 0) {
    companies.push({
        name: "Company 1",
        members: [
            { id: 1, name: "Root", left: null, right: null }
        ]
    });
    saveData();
}

function saveData() {
    localStorage.setItem("companies", JSON.stringify(companies));
}

function getCompany() {
    return companies[currentCompanyIndex];
}

// ===== ADD MEMBER =====
function addMember(parentId, side) {
    const name = prompt("Enter Member Name");
    if (!name) return;

    const company = getCompany();
    const parent = company.members.find(m => m.id === parentId);

    if (side === "left" && parent.left) return alert("Left already filled");
    if (side === "right" && parent.right) return alert("Right already filled");

    const id = Date.now();

    company.members.push({
        id,
        name,
        left: null,
        right: null
    });

    if (side === "left") parent.left = id;
    else parent.right = id;

    saveData();
    renderAll();
}

function addLeft(id) { addMember(id, "left"); }
function addRight(id) { addMember(id, "right"); }

// ===== EDIT =====
function editMember(id) {
    const company = getCompany();
    const m = company.members.find(x => x.id === id);

    const name = prompt("Edit Name", m.name);
    if (name) {
        m.name = name;
        saveData();
        renderAll();
    }
}

// ===== COUNT TREE =====
function countTree(id) {
    const company = getCompany();

    const map = {};
    company.members.forEach(m => map[m.id] = m);

    function count(nodeId) {
        if (!nodeId) return 0;
        const node = map[nodeId];
        if (!node) return 0;
        return 1 + count(node.left) + count(node.right);
    }

    return count(id);
}

// ===== CALCULATE =====
function calculate(member) {
    const left = countTree(member.left);
    const right = countTree(member.right);

    const pairs = Math.min(left, right);
    const income = pairs * 3;

    return { left, right, pairs, income };
}

// ===== MEMBERS TABLE =====
function renderMembers() {
    const table = document.getElementById("memberTable");
    if (!table) return;

    const company = getCompany();
    table.innerHTML = "";

    company.members.forEach(m => {
        const calc = calculate(m);

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${calc.left}</td>
            <td>${calc.right}</td>
            <td>${calc.pairs}</td>
            <td>₹${calc.income}</td>
            <td>
                <button onclick="addLeft(${m.id})">L</button>
                <button onclick="addRight(${m.id})">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        `;

        table.appendChild(tr);
    });
}

// ===== DASHBOARD =====
function renderDashboard() {
    const company = getCompany();

    let totalPairs = 0;

    company.members.forEach(m => {
        const calc = calculate(m);
        totalPairs += calc.pairs;
    });

    const totalMembers = company.members.length;
    const totalIncome = totalPairs * 3;
    const profit = (totalMembers * 10) - totalIncome;

    document.getElementById("totalMembers").innerText = totalMembers;
    document.getElementById("totalPairs").innerText = totalPairs;
    document.getElementById("totalIncome").innerText = "₹" + totalIncome;
    document.getElementById("companyProfit").innerText = "₹" + profit;
}

// ===== TREE =====
function renderTree() {
    const container = document.getElementById("treeContainer");
    if (!container) return;

    const company = getCompany();
    container.innerHTML = "";

    const map = {};
    company.members.forEach(m => map[m.id] = m);

    function createNode(member) {
        const li = document.createElement("li");
        const calc = calculate(member);

        const box = document.createElement("div");
        box.className = "tree-box";

        box.innerHTML = `
            ${member.name}<br>
            Pair: ${calc.pairs}<br>
            ₹${calc.income}<br>
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

    const ul = document.createElement("ul");
    ul.className = "tree";

    ul.appendChild(createNode(company.members[0]));
    container.appendChild(ul);
}

// ===== COMPANY NAME =====
function updateCompanyName() {
    const name = prompt("Enter Company Name");
    if (!name) return;

    companies[currentCompanyIndex].name = name;
    saveData();
}

// ===== MAIN =====
function renderAll() {
    renderMembers();
    renderTree();
    renderDashboard();
}

// ===== LOAD =====
window.onload = function () {
    renderAll();
};
