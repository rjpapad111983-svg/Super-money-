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
            level: 1
        });
        saveData();
    }

    calculateAll();
    renderAll();
});

// SAVE
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
}

// ADD MEMBER
function addMember(parentId, side) {

    const parent = members.find(m => m.id == parentId);
    if (!parent) return;

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
        level: 1
    };

    if (side === "left") parent.left = id;
    else parent.right = id;

    members.push(newMember);

    saveData();
    calculateAll();
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
function passToChildren(member, amount) {

    let left = members.find(x => x.id == member.left);
    let right = members.find(x => x.id == member.right);

    if (left) left.extraIncome += amount / 2;
    if (right) right.extraIncome += amount / 2;
}

// 🔥 FINAL CALCULATION FIX
function calculateAll() {

    members.forEach(m => {
        m.pairs = 0;
        m.income = 0;
        m.extraIncome = 0;
    });

    // STEP 1
    members.forEach(m => {

        let left = countTeam(m.left);
        let right = countTeam(m.right);

        m.pairs = Math.min(left, right);

        let income = m.pairs * 3;

        let cap = getCap(m.level);

        if (income > cap) {
            let extra = income - cap;
            m.income = cap;
            passToChildren(m, extra);
        } else {
            m.income = income;
        }
    });

    // STEP 2 FINAL CAP
    members.forEach(m => {
        let total = m.income + m.extraIncome;
        let cap = getCap(m.level);

        m.income = Math.min(total, cap);
    });
}

function renderTree() {

    const tree = document.getElementById("tree");
    tree.innerHTML = "";

    const map = {};
    members.forEach(m => map[m.id] = m);

    function build(m) {
        if (!m) return "";

        return `
        <div class="tree-node">
            <div class="node">
                <b>${m.name}</b><br>
                Pair: ${m.pairs}<br>
                ₹${m.income}<br>

                <button onclick="addMember(${m.id},'left')">L+</button>
                <button onclick="addMember(${m.id},'right')">R+</button>
                <button onclick="deleteMember(${m.id})">Del</button>
            </div>

            <div class="children">
                ${m.left ? build(map[m.left]) : ""}
                ${m.right ? build(map[m.right]) : ""}
            </div>
        </div>
        `;
    }

    const root = members.find(m => m.parent === 0);

if (root) {
    tree.innerHTML = build(root);
} else {
    tree.innerHTML = "<p>No root found</p>";
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
            <td>₹${m.income}</td>
            <td><button onclick="deleteMember(${m.id})">Delete</button></td>
        </tr>
        `;
    });
}

// RENDER ALL
function renderAll() {
    renderTree();
    renderMembers();
}
