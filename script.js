// ====== DATA ======
let members = JSON.parse(localStorage.getItem("members")) || [
    { id: 1, name: "Rajesh", left: null, right: null }
];

// ====== SAVE ======
function save() {
    localStorage.setItem("members", JSON.stringify(members));
}

// ====== ADD MEMBER ======
function addMember(parentId, side) {
    let name = prompt("Enter Member Name");
    if (!name) return;

    let id = Date.now();

    let parent = members.find(m => m.id === parentId);

    if (side === "L") {
        if (parent.left) return alert("Left already filled");
        parent.left = id;
    } else {
        if (parent.right) return alert("Right already filled");
        parent.right = id;
    }

    members.push({ id, name, left: null, right: null });

    save();
    renderAll();
}

// ====== EDIT MEMBER ======
function editMember(id) {
    let m = members.find(x => x.id === id);
    let name = prompt("Edit Name", m.name);
    if (!name) return;

    m.name = name;

    save();
    renderAll();
}

// ====== COUNT ======
function count(id) {
    if (!id) return 0;

    let m = members.find(x => x.id === id);
    if (!m) return 0;

    return 1 + count(m.left) + count(m.right);
}

// ====== PAIR ======
function pair(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let left = count(m.left);
    let right = count(m.right);

    return Math.min(left, right);
}

// ====== INCOME ======
function income(id) {
    return pair(id) * 3;
}

// ====== TREE ======
function renderTree() {
    let treeBox = document.getElementById("tree");
    if (!treeBox) return;

    let root = members.find(m => m.id === 1);

    function build(id) {
        let m = members.find(x => x.id === id);
        if (!m) return "";

        let p = pair(m.id);
        let inc = income(m.id);

        return `
        <li>
            <div class="card">
                <div>${m.name}</div>
                <div>Pair: ${p}</div>
                <div style="color:#00ff9d;">₹${inc}</div>

                <div>
                    <button onclick="addMember(${m.id},'L')">L</button>
                    <button onclick="addMember(${m.id},'R')">R</button>
                    <button onclick="editMember(${m.id})">Edit</button>
                </div>
            </div>

            ${
                (m.left || m.right)
                    ? `<ul>
                        ${build(m.left)}
                        ${build(m.right)}
                       </ul>`
                    : ""
            }
        </li>`;
    }

    treeBox.innerHTML = `<ul class="tree">${build(root.id)}</ul>`;
}

// ====== MEMBERS TABLE ======
function renderMembers() {
    let table = document.getElementById("membersData");
    if (!table) return;

    let html = "";

    members.forEach(m => {
        let p = pair(m.id);
        let inc = income(m.id);

        html += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${m.left || 0}</td>
            <td>${m.right || 0}</td>
            <td>${p}</td>
            <td style="color:#00ff9d;">₹${inc}</td>
            <td>
                <button onclick="addMember(${m.id},'L')">L</button>
                <button onclick="addMember(${m.id},'R')">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>`;
    });

    table.innerHTML = html;
}

// ====== DASHBOARD ======
function renderDashboard() {
    let totalMembersEl = document.getElementById("totalMembers");
    let totalPairsEl = document.getElementById("totalPairs");
    let totalIncomeEl = document.getElementById("totalIncome");
    let companyProfitEl = document.getElementById("companyProfit");

    if (!totalMembersEl) return;

    let totalMembers = members.length;

    let totalPairs = 0;
    members.forEach(m => totalPairs += pair(m.id));

    let totalIncome = totalPairs * 3;
    let companyProfit = (members.length * 10) - totalIncome;

    totalMembersEl.innerText = "Total Members: " + totalMembers;
    totalPairsEl.innerText = "Total Pairs: " + totalPairs;
    totalIncomeEl.innerText = "Total Income: ₹" + totalIncome;
    companyProfitEl.innerText = "Company Profit: ₹" + companyProfit;
}

// ====== ALL RENDER ======
function renderAll() {
    renderTree();
    renderMembers();
    renderDashboard();
}

// ====== AUTO LOAD FIX ======
window.onload = function () {
    renderAll();
};
