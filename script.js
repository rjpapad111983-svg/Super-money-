// ===== DATA =====
let members = JSON.parse(localStorage.getItem("members")) || [];

// ===== INIT =====
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
            isSub: false
        });
        saveData();
    }

    calculateAll();
    renderTree();
});

// ===== SAVE =====
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
}

// ===== ADD MEMBER =====
function addMember(parentId, side) {

    const parent = members.find(m => m.id === parentId);
    if (!parent) return;

    if (side === "left" && parent.left) return alert("Left filled");
    if (side === "right" && parent.right) return alert("Right filled");

    const name = prompt("Enter name");
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
        isSub: name.toLowerCase().includes("sub")
    };

    if (side === "left") parent.left = id;
    else parent.right = id;

    members.push(newMember);

    saveData();
    calculateAll();
    renderTree();
}

// ===== EDIT =====
function editMember(id) {
    const m = members.find(x => x.id === id);
    if (!m) return;

    const name = prompt("Edit name", m.name);
    if (!name) return;

    m.name = name;
    m.isSub = name.toLowerCase().includes("sub");

    saveData();
    renderTree();
}

// ===== DELETE =====
function deleteMember(id) {

    if (id === 1) return alert("Root delete nahi");

    function removeTree(mid) {
        const m = members.find(x => x.id === mid);
        if (!m) return;

        if (m.left) removeTree(m.left);
        if (m.right) removeTree(m.right);

        members = members.filter(x => x.id !== mid);
    }

    removeTree(id);

    members.forEach(m => {
        if (m.left === id) m.left = 0;
        if (m.right === id) m.right = 0;
    });

    saveData();
    calculateAll();
    renderTree();
}

// ===== COUNT TEAM =====
function countTeam(id) {
    if (!id) return 0;
    const m = members.find(x => x.id === id);
    if (!m) return 0;
    return 1 + countTeam(m.left) + countTeam(m.right);
}

// ===== CALCULATION =====
function calculateAll() {

    members.forEach(m => {
        let left = countTeam(m.left);
        let right = countTeam(m.right);

        m.pairs = Math.min(left, right);

        let income = m.pairs * 3;

        // SIMPLE CAP (₹180)
        if (!m.isSub && income > 180) {
            income = 180;
        }

        m.income = income;
    });
}

// ===== TREE =====
function renderTree() {

    const tree = document.getElementById("tree");
    if (!tree) return;

    tree.innerHTML = "";

    const map = {};
    members.forEach(m => map[m.id] = m);

    function build(m) {
        if (!m) return "";

        return `
        <li>
            <div class="node-card">
                <b>${m.name}</b><br>
                Pair: ${m.pairs}<br>
                ₹${m.income}<br>

                <button onclick="addMember(${m.id}, 'left')">L+</button>
                <button onclick="addMember(${m.id}, 'right')">R+</button><br>

                <button onclick="editMember(${m.id})">Edit</button>
                <button onclick="deleteMember(${m.id})">Delete</button>
            </div>

            <ul>
                ${m.left ? build(map[m.left]) : '<li><div class="empty"></div></li>'}
                ${m.right ? build(map[m.right]) : '<li><div class="empty"></div></li>'}
            </ul>
        </li>`;
    }

    const root = members.find(m => m.parent === 0);

    if (root) {
        tree.innerHTML = `<ul class="mlm-tree">${build(root)}</ul>`;
    }
}
