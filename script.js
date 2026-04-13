// ================= DATA =================
let members = [];

// ================= INIT =================
function initRoot() {
    if (members.length === 0) {
        members.push({
            id: 1,
            name: "Rajesh",
            parentId: null,
            position: null,
            left: null,
            right: null
        });
    }
}

// ================= ADD MEMBER =================
function addMember(name, parentId, position) {
    let parent = members.find(m => m.id == parentId);

    if (!parent) return alert("Parent not found");
    if (parent[position]) return alert("Already filled");

    let id = members.length + 1;

    let newMember = {
        id,
        name: name || ("Member " + id),
        parentId,
        position,
        left: null,
        right: null
    };

    members.push(newMember);
    parent[position] = id;

    updateAll();
}

// ================= EDIT MEMBER =================
function editMember(id) {
    let m = members.find(x => x.id == id);
    let name = prompt("Enter Name", m.name);

    if (name) {
        m.name = name;
        updateAll();
    }
}

// ================= DOWNLINE =================
function countDownline(id) {
    let m = members.find(x => x.id == id);
    if (!m) return 0;

    let count = 0;

    if (m.left) count += 1 + countDownline(m.left);
    if (m.right) count += 1 + countDownline(m.right);

    return count;
}

// ================= PAIRS =================
function countPairs(id) {
    let m = members.find(x => x.id == id);
    if (!m) return 0;

    let left = m.left ? 1 + countDownline(m.left) : 0;
    let right = m.right ? 1 + countDownline(m.right) : 0;

    return Math.min(left, right); // ✅ FIXED
}

// ================= TOTAL PAIRS =================
function totalPairs() {
    let total = 0;
    members.forEach(m => total += countPairs(m.id));
    return total;
}

// ================= INCOME =================
function memberIncome(id) {
    return countPairs(id) * 3; // ₹3 per pair
}

function totalIncome() {
    return totalPairs() * 3;
}

// ================= COMPANY PROFIT =================
function companyProfit() {
    let totalCollection = members.length * 10; // ₹10 per member
    let payout = totalIncome();
    return totalCollection - payout;
}

// ================= DASHBOARD =================
function updateDashboard() {
    let m = document.getElementById("totalMembers");
    let p = document.getElementById("totalPairs");
    let i = document.getElementById("totalIncome");
    let c = document.getElementById("companyProfit");

    if (m) m.innerText = members.length;
    if (p) p.innerText = totalPairs();
    if (i) i.innerText = "₹" + totalIncome();
    if (c) c.innerText = "₹" + companyProfit();
}

// ================= MEMBERS TABLE =================
function renderMembers() {
    let table = document.getElementById("membersTable");
    if (!table) return;

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
            <td>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>
        `;
    });
}

// ================= TREE =================
function renderTree() {
    let container = document.getElementById("tree");
    if (!container) return;

    container.innerHTML = "";

    function build(id) {
        let m = members.find(x => x.id == id);
        if (!m) return "";

        return `
        <div class="node">
            <div>${m.name}</div>
            <div>Pair: ${countPairs(id)}</div>
            <div>₹${memberIncome(id)}</div>

            <button onclick="addMember('', ${id}, 'left')">L</button>
            <button onclick="addMember('', ${id}, 'right')">R</button>
            <button onclick="editMember(${id})">Edit</button>

            <div class="children">
                ${m.left ? build(m.left) : ""}
                ${m.right ? build(m.right) : ""}
            </div>
        </div>
        `;
    }

    container.innerHTML = build(1);
}

// ================= UPDATE ALL =================
function updateAll() {
    renderTree();
    renderMembers();
    updateDashboard();
}

// ================= START =================
initRoot();
updateAll();
