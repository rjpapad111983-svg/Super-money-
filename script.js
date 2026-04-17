let members = JSON.parse(localStorage.getItem("members")) || [];

// 👉 Save
function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
}

// 👉 Root ensure
function ensureRoot() {
    if (members.length === 0) {
        members.push({
            id: 1,
            name: "Rajesh",
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

// 👉 Add Left
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

// 👉 Add Right
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

// 👉 Edit
function editMember(id) {
    let m = members.find(x => x.id === id);
    let name = prompt("Edit Name:", m.name);
    if (name) {
        m.name = name;
        saveData();
        renderAll();
    }
}

// 👉 Count Downline
function countDownline(id, side) {
    let m = members.find(x => x.id === id);
    if (!m || !m[side]) return 0;

    return 1 +
        countDownline(m[side], "left") +
        countDownline(m[side], "right");
}

// 👉 Members Table
function renderMembers() {
    let table = document.getElementById("membersTable");
    if (!table) return;

    table.innerHTML = "";

    members.forEach(m => {
        let left = countDownline(m.id, "left");
        let right = countDownline(m.id, "right");

        let pair = Math.min(left, right);
        let income = pair * 3;

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${left}</td>
            <td>${right}</td>
            <td>${pair}</td>
            <td>₹${income}</td>
            <td>
                <button onclick="addLeft(${m.id})">L</button>
                <button onclick="addRight(${m.id})">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>`;
    });
}

// 👉 TREE (FINAL FIX)
function renderTree() {
    let container = document.getElementById("treeContainer");
    if (!container) return;

    container.innerHTML = "";

    if (members.length === 0) return;

    let map = {};
    members.forEach(m => map[m.id] = m);

    function build(member) {
        let node = document.createElement("div");
        node.className = "node";

        node.innerHTML = `
            <div class="box">
                ${member.name}<br>
                ID: ${member.id}<br>
                <button onclick="addLeft(${member.id})">L</button>
                <button onclick="addRight(${member.id})">R</button>
                <button onclick="editMember(${member.id})">Edit</button>
            </div>
        `;

        let children = document.createElement("div");
        children.className = "children";

        if (member.left && map[member.left]) {
            children.appendChild(build(map[member.left]));
        }

        if (member.right && map[member.right]) {
            children.appendChild(build(map[member.right]));
        }

        if (member.left || member.right) {
            node.appendChild(children);
        }

        return node;
    }

    container.appendChild(build(members[0]));
}

// 👉 Dashboard
function renderDashboard() {
    let totalMembers = members.length;
    let totalPairs = 0;
    let totalIncome = 0;

    members.forEach(m => {
        let l = countDownline(m.id, "left");
        let r = countDownline(m.id, "right");

        let p = Math.min(l, r);
        totalPairs += p;
        totalIncome += p * 3;
    });

    document.getElementById("totalMembers").innerText = totalMembers;
    document.getElementById("totalPairs").innerText = totalPairs;
    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("companyProfit").innerText = totalMembers * 10;
}

// 👉 All render
function renderAll() {
    renderMembers();
    renderTree();
    renderDashboard();
}

// 👉 INIT
ensureRoot();
renderAll();
