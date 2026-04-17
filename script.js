let members = JSON.parse(localStorage.getItem("members")) || [];

// 👉 Save data
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
}

// 👉 Add root अगर empty है
function ensureRoot() {
    if (members.length === 0) {
        members.push({
            id: 1,
            name: "Root",
            left: null,
            right: null,
            parentId: null
        });
        saveData();
    }
}

// 👉 Add Member
function addMember(name, parentId, side) {
    let id = members.length + 1;

    let newMember = {
        id,
        name,
        left: null,
        right: null,
        parentId
    };

    members.push(newMember);

    let parent = members.find(m => m.id === parentId);
    if (side === "left") parent.left = id;
    if (side === "right") parent.right = id;

    saveData();
    renderAll();
}

// 👉 Left button
function addLeft(id) {
    let name = prompt("Enter Left Member Name:");
    if (!name) return;

    let parent = members.find(m => m.id === id);

    if (parent.left) {
        alert("Left already filled!");
        return;
    }

    addMember(name, id, "left");
}

// 👉 Right button
function addRight(id) {
    let name = prompt("Enter Right Member Name:");
    if (!name) return;

    let parent = members.find(m => m.id === id);

    if (parent.right) {
        alert("Right already filled!");
        return;
    }

    addMember(name, id, "right");
}

// 👉 Count Downline (Recursive)
function countDownline(id, side) {
    let member = members.find(m => m.id === id);
    if (!member) return 0;

    let childId = member[side];
    if (!childId) return 0;

    return 1 +
        countDownline(childId, "left") +
        countDownline(childId, "right");
}

// 👉 Members Table
function renderMembers() {
    let table = document.getElementById("membersTable");
    if (!table) return;

    table.innerHTML = "";

    members.forEach(m => {
        let left = countDownline(m.id, "left");
        let right = countDownline(m.id, "right");

        let pairs = Math.min(left, right);
        let income = pairs * 3;

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${left}</td>
            <td>${right}</td>
            <td>${pairs}</td>
            <td>₹${income}</td>
            <td>
                <button onclick="addLeft(${m.id})">L</button>
                <button onclick="addRight(${m.id})">R</button>
            </td>
        </tr>`;
    });
}

// 👉 Tree Render (FULL FIXED)
function renderTree() {
    let container = document.getElementById("treeContainer");
    if (!container) return;

    container.innerHTML = "";

    if (members.length === 0) return;

    let map = {};
    members.forEach(m => map[m.id] = m);

    function buildNode(member) {
        let div = document.createElement("div");
        div.className = "tree-node";

        div.innerHTML = `
            <div class="box">
                ${member.name}<br>
                ID: ${member.id}<br>
                <button onclick="addLeft(${member.id})">L</button>
                <button onclick="addRight(${member.id})">R</button>
            </div>
        `;

        let children = document.createElement("div");
        children.className = "tree-children";

        if (member.left && map[member.left]) {
            children.appendChild(buildNode(map[member.left]));
        }

        if (member.right && map[member.right]) {
            children.appendChild(buildNode(map[member.right]));
        }

        div.appendChild(children);
        return div;
    }

    container.appendChild(buildNode(members[0]));
}

// 👉 Dashboard
function renderDashboard() {
    let totalMembers = members.length;
    let totalPairs = 0;
    let totalIncome = 0;

    members.forEach(m => {
        let left = countDownline(m.id, "left");
        let right = countDownline(m.id, "right");

        let pair = Math.min(left, right);

        totalPairs += pair;
        totalIncome += pair * 3;
    });

    let m = document.getElementById("totalMembers");
    let p = document.getElementById("totalPairs");
    let i = document.getElementById("totalIncome");
    let c = document.getElementById("companyProfit");

    if (m) m.innerText = totalMembers;
    if (p) p.innerText = totalPairs;
    if (i) i.innerText = totalIncome;
    if (c) c.innerText = totalMembers * 10;
}

// 👉 Main Render
function renderAll() {
    renderMembers();
    renderTree();
    renderDashboard();
}

// 👉 INIT
ensureRoot();
renderAll();
