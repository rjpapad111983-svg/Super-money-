let members = [];

// ➤ ROOT MEMBER AUTO CREATE
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

// ➤ ADD MEMBER FROM TREE
function addMember(parentId, side) {
    let parent = members.find(m => m.id == parentId);

    if (!parent) {
        alert("Parent not found");
        return;
    }

    if (parent[side]) {
        alert("Position already filled");
        return;
    }

    let id = members.length + 1;

    let newMember = {
        id,
        name: "Member " + id,
        parentId,
        position: side,
        left: null,
        right: null
    };

    members.push(newMember);
    parent[side] = id;

    updateAll();
}

// ➤ EDIT MEMBER NAME
function editMember(id) {
    let member = members.find(m => m.id == id);
    let name = prompt("Enter Name", member.name);

    if (name) {
        member.name = name;
        updateAll();
    }
}

// ➤ COUNT DOWNLINE
function countDownline(id) {
    let member = members.find(m => m.id == id);
    if (!member) return 0;

    let count = 0;

    if (member.left) {
        count += 1 + countDownline(member.left);
    }

    if (member.right) {
        count += 1 + countDownline(member.right);
    }

    return count;
}

// ➤ COUNT PAIRS (CORRECT)
function countPairs(id) {
    let member = members.find(m => m.id == id);
    if (!member) return 0;

    let left = member.left ? 1 + countDownline(member.left) : 0;
    let right = member.right ? 1 + countDownline(member.right) : 0;

    return Math.min(left, right);
}

// ➤ TOTAL PAIRS
function totalPairs() {
    let total = 0;
    members.forEach(m => {
        total += countPairs(m.id);
    });
    return total;
}

// ➤ TOTAL INCOME
function totalIncome() {
    return totalPairs() * 3; // ₹3 per pair
}

// ➤ COMPANY PROFIT
function companyProfit() {
    let total = members.length * 10; // ₹10 per member
    return total - totalIncome();
}

// ➤ RENDER TREE
function renderTree() {
    let container = document.getElementById("tree");
    container.innerHTML = "";

    function createNode(id) {
        let member = members.find(m => m.id == id);
        if (!member) return "";

        let pairs = countPairs(id);
        let income = pairs * 3;

        return `
        <div class="node">
            <div>${member.name}</div>
            <div>Pair: ${pairs}</div>
            <div>₹${income}</div>
            <button onclick="addMember(${id}, 'left')">L</button>
            <button onclick="addMember(${id}, 'right')">R</button>
            <button onclick="editMember(${id})">Edit</button>

            <div class="children">
                ${member.left ? createNode(member.left) : ""}
                ${member.right ? createNode(member.right) : ""}
            </div>
        </div>
        `;
    }

    container.innerHTML = createNode(1);
}

// ➤ UPDATE DASHBOARD
function updateDashboard() {
    document.getElementById("totalMembers").innerText = members.length;
    document.getElementById("totalPairs").innerText = totalPairs();
    document.getElementById("totalIncome").innerText = "₹" + totalIncome();
    document.getElementById("companyProfit").innerText = "₹" + companyProfit();
}

// ➤ UPDATE ALL
function updateAll() {
    renderTree();
    updateDashboard();
}

// ➤ INIT
initRoot();
updateAll();
