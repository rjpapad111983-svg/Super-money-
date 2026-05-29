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
            extraIncome: 0,
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
        isSub: name.toLowerCase().includes("sub")
    };

    if (side === "left") parent.left = id;
    else parent.right = id;

    members.push(newMember);

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

// ===== CAP =====
function getCap(level) {
    if (level === 1) return 180;
    if (level === 2) return 200;
    if (level === 3) return 250;
    if (level === 4) return 300;
    if (level === 5) return 500;
    return 1000;
}

// ===== DYNAMIC LEVEL =====
function getDynamicLevel(m) {
    let level = 1;

    while (true) {
        let cap = getCap(level);

        let leftIncome = countTeam(m.left) * 3;
        let rightIncome = countTeam(m.right) * 3;

        if (leftIncome >= cap && rightIncome >= cap) {
            level++;
        } else break;
    }

    return level;
}

// ===== PASS DOWN =====
function passToChildren(member, amount) {

    let left = members.find(x => x.id === member.left);
    let right = members.find(x => x.id === member.right);

    if (left && right) {
        left.extraIncome += amount / 2;
        right.extraIncome += amount / 2;
    } else if (left) {
        left.extraIncome += amount;
    } else if (right) {
        right.extraIncome += amount;
    }
}

// ===== CALCULATION =====
function calculateAll() {

    members.forEach(m => {
        m.income = 0;
        m.extraIncome = 0;
        m.pairs = 0;
    });

    members.forEach(m => {

        let level = getDynamicLevel(m);

        let left = countTeam(m.left);
        let right = countTeam(m.right);

        m.pairs = Math.min(left, right);

        let income = m.pairs * 3;

        if (!m.isSub) {
            let cap = getCap(level);

            if (income > cap) {
                let extra = income - cap;
                income = cap;
                passToChildren(m, extra);
            }
        }

        m.income = income;
    });

    // FINAL CAP
    members.forEach(m => {
        let total = m.income + m.extraIncome;

        if (!m.isSub) {
            let cap = getCap(getDynamicLevel(m));
            m.income = Math.min(total, cap);
        } else {
            m.income = total;
        }
    });
}

// ===== TREE RENDER =====
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
                <button onclick="addMember(${m.id}, 'right')">R+</button>
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
