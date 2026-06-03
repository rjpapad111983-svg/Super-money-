let members = JSON.parse(localStorage.getItem("members")) || [];

// INIT
document.addEventListener("DOMContentLoaded", () => {

    if (members.length === 0) {
        members.push({
            id: 1,
            name: "Rajesh",
            left: 0,
            right: 0,
            parent: 0,
            pairs: 0,
            income: 0,
            extraIncome: 0,
            level: 1,
            leftCarry: 0,
            rightCarry: 0
        });
        saveData();
    }

    calculateAll();
    renderAll();
    showDashboard();
});

// SAVE
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
}

// ADD MEMBER
function addMember(parentId, side) {

    const parent = members.find(m => m.id == parentId);
    if (!parent) return;

    if (parent[side] != 0) {
        alert("Already filled!");
        return;
    }

    const name = prompt("Enter member name");
    if (!name) return;

    const id = Date.now();

    const newMember = {
        id,
        name,
        left: 0,
        right: 0,
        parent: parentId,
        pairs: 0,
        income: 0,
        extraIncome: 0,
        level: 1,
        leftCarry: 0,
        rightCarry: 0
    };

    parent[side] = id;
    members.push(newMember);

    saveData();
    calculateAll();
    renderAll();
}

// EDIT
function editMember(id) {
    let m = members.find(x => x.id == id);
    if (!m) return;

    let newName = prompt("Enter new name", m.name);

    if (newName && newName.trim() !== "") {
        m.name = newName;
    }

    saveData();
    renderAll();
}

// DELETE
function deleteMember(id) {

    if (id == 1) {
        alert("Root delete nahi kar sakte");
        return;
    }

    function removeTree(mid) {
        let m = members.find(x => x.id == mid);
        if (!m) return;

        if (m.left) removeTree(m.left);
        if (m.right) removeTree(m.right);

        members = members.filter(x => x.id != mid);
    }

    removeTree(id);

    members.forEach(m => {
        if (m.left == id) m.left = 0;
        if (m.right == id) m.right = 0;
    });

    saveData();
    calculateAll();
    renderAll();
}

// COUNT TEAM
function countTeam(id) {
    if (!id) return 0;

    let m = members.find(x => x.id == id);
    if (!m) return 0;

    return 1 + countTeam(m.left) + countTeam(m.right);
}

// CAP
function getCap(level) {
    if (level == 1) return 180;
    if (level == 2) return 200;
    if (level == 3) return 250;
    if (level == 4) return 300;
    return 500;
}

// PASS DOWN
function passDown(id, amount) {

    let m = members.find(x => x.id == id);
    if (!m) return;

    let left = members.find(x => x.id == m.left);
    let right = members.find(x => x.id == m.right);

    let share = amount / 2;

    if (left) {
        left.extraIncome = (left.extraIncome || 0) + share;
    }

    if (right) {
        right.extraIncome = (right.extraIncome || 0) + share;
    }
}

// MAIN CALCULATION (REAL BINARY)
function calculateAll() {

    // RESET
    members.forEach(m => {
        m.pairs = 0;
        m.income = 0;
        m.extraIncome = 0;
    });

    // STEP 1
    members.forEach(m => {

        let leftNew = countTeam(m.left);
        let rightNew = countTeam(m.right);

        let left = (m.leftCarry || 0) + leftNew;
        let right = (m.rightCarry || 0) + rightNew;

        let pair = Math.min(left, right);

        m.pairs = pair;

        // carry forward
        m.leftCarry = left - pair;
        m.rightCarry = right - pair;

        let income = pair * 3;
        let cap = getCap(m.level);

        if (income > cap) {
            let extra = income - cap;
            m.income = cap;
            passDown(m.id, extra);
        } else {
            m.income = income;
        }
    });

    // STEP 2 (extra re-check)
    members.forEach(m => {

        let total = m.income + (m.extraIncome || 0);
        let cap = getCap(m.level);

        if (total > cap) {
            let extra = total - cap;
            m.income = cap;
            passDown(m.id, extra);
        } else {
            m.income = total;
        }
    });

    // LEVEL UPGRADE
    members.forEach(m => {

        let left = members.find(x => x.id == m.left);
        let right = members.find(x => x.id == m.right);

        let leftIncome = left ? left.income : 0;
        let rightIncome = right ? right.income : 0;

        let cap = getCap(m.level);

        if (m.income >= cap) {
            if (leftIncome >= cap && rightIncome >= cap) {
                m.level += 1;
            }
        }
    });
}

// TREE
function renderTree() {

    const tree = document.getElementById("tree");
    tree.innerHTML = "";

    function build(id) {

        let m = members.find(x => x.id == id);
        if (!m) return "";

        return `
        <div class="tree-node">
            <div class="node">
                <b>${m.name}</b><br>
                Level: ${m.level}<br>
                Pair: ${m.pairs}<br>
                ₹${m.income}<br>

                <button onclick="addMember(${m.id}, 'left')">L+</button>
                <button onclick="addMember(${m.id}, 'right')">R+</button>
                <button onclick="editMember(${m.id})">Edit</button>
                <button onclick="deleteMember(${m.id})">Del</button>
            </div>

            ${(m.left || m.right) ? `
            <div class="children">
                ${m.left ? build(m.left) : ""}
                ${m.right ? build(m.right) : ""}
            </div>` : ""}
        </div>
        `;
    }

    tree.innerHTML = build(1);
}

// MEMBERS TABLE
function renderMembers() {

    const table = document.getElementById("membersTable");
    table.innerHTML = "";

    members.forEach(m => {

        let left = countTeam(m.left);
        let right = countTeam(m.right);

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${left}</td>
            <td>${right}</td>
            <td>${m.pairs}</td>
            <td>${m.income}</td>
            <td>${m.level}</td>
            <td>
                <button onclick="editMember(${m.id})">Edit</button>
                <button onclick="deleteMember(${m.id})">Delete</button>
            </td>
        </tr>`;
    });
}

// DASHBOARD
function renderDashboard() {

    document.getElementById("totalMembers").innerText = members.length;

    let totalPairs = members.reduce((sum, m) => sum + m.pairs, 0);
    let totalIncome = members.reduce((sum, m) => sum + m.income, 0);

    let companyIncome = members.length * 10;
    let companyProfit = companyIncome - totalIncome;

    document.getElementById("totalPairs").innerText = totalPairs;
    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("companyProfit").innerText = companyProfit;
}

// SWITCH
function showDashboard() {
    document.getElementById("dashboardSection").style.display = "block";
    document.getElementById("treeSection").style.display = "none";
    document.getElementById("membersSection").style.display = "none";
    renderDashboard();
}

function showTree() {
    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("treeSection").style.display = "block";
    document.getElementById("membersSection").style.display = "none";
    renderTree();
}

function showMembers() {
    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("treeSection").style.display = "none";
    document.getElementById("membersSection").style.display = "block";
    renderMembers();
}

// RENDER ALL
function renderAll() {
    renderTree();
    renderMembers();
    renderDashboard();
                    }
