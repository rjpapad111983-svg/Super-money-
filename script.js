let members = [
    { id: 1, name: "Rajesh", left: null, right: null }
];

let lastId = 1;

// Page Switch
function showPage(page) {
    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("treePage").style.display = "none";
    document.getElementById("membersPage").style.display = "none";

    if (page === "dashboard") document.getElementById("dashboardPage").style.display = "block";
    if (page === "tree") document.getElementById("treePage").style.display = "block";
    if (page === "members") document.getElementById("membersPage").style.display = "block";

    renderAll();
}

// Add Member
function addMember(name = "", parentId, side) {
    let parent = members.find(m => m.id === parentId);

    if (!parent) return alert("Parent not found");

    if (parent[side]) {
        alert("Already filled");
        return;
    }

    lastId++;

    let newMember = {
        id: lastId,
        name: name || "Member " + lastId,
        left: null,
        right: null
    };

    members.push(newMember);
    parent[side] = newMember.id;

    renderAll();
}

// Edit Member
function editMember(id) {
    let m = members.find(x => x.id === id);
    let name = prompt("Enter name", m.name);
    if (name) m.name = name;

    renderAll();
}

// Count Left/Right
function countSide(id, side) {
    let m = members.find(x => x.id === id);
    if (!m || !m[side]) return 0;

    return 1 + countSide(m[side], "left") + countSide(m[side], "right");
}

// Pair
function countPairs(id) {
    let left = countSide(id, "left");
    let right = countSide(id, "right");
    return Math.min(left, right);
}

// Income (₹3 per pair)
function memberIncome(id) {
    return countPairs(id) * 3;
}

// Dashboard
function renderDashboard() {
    let totalMembers = members.length;

    let totalPairs = 0;
    let totalIncome = 0;

    members.forEach(m => {
        let p = countPairs(m.id);
        totalPairs += p;
        totalIncome += p * 3;
    });

    let companyProfit = (totalMembers * 10) - totalIncome;

    document.getElementById("totalMembers").innerText = totalMembers;
    document.getElementById("totalPairs").innerText = totalPairs;
    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("companyProfit").innerText = companyProfit;
}

// Tree
function renderTree() {
    let container = document.getElementById("tree");

    function build(id) {
        let m = members.find(x => x.id === id);
        if (!m) return "";

        return `
        <div class="node">
            <div>${m.name}</div>
            <div>Pair: ${countPairs(id)}</div>
            <div>₹${memberIncome(id)}</div>

            <button onclick="addMember('', ${id}, 'left')">L</button>
            <button onclick="addMember('', ${id}, 'right')">R</button>
            <br>
            <button onclick="editMember(${id})">Edit</button>

            <div style="display:flex; justify-content:center;">
                ${m.left ? build(m.left) : ""}
                ${m.right ? build(m.right) : ""}
            </div>
        </div>
        `;
    }

    container.innerHTML = build(1);
}

// Members Table
function renderMembers() {
    let table = document.getElementById("membersTable");
    table.innerHTML = "";

    members.forEach(m => {
        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${m.left || 0}</td>
            <td>${m.right || 0}</td>
            <td>${countPairs(m.id)}</td>
            <td>₹${memberIncome(m.id)}</td>
            <td><button onclick="editMember(${m.id})">Edit</button></td>
        </tr>
        `;
    });
}

// Render All
function renderAll() {
    renderDashboard();
    renderTree();
    renderMembers();
}

// Load
renderAll();
