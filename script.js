let members = JSON.parse(localStorage.getItem("members")) || [
    { id: 1, name: "Rajesh", left: null, right: null }
];

function save() {
    localStorage.setItem("members", JSON.stringify(members));
}

/* PAGE */
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById(page).style.display = "block";

    if (page === "tree") renderTree();
    if (page === "members") renderMembers();
    if (page === "dashboard") updateDashboard();
}

/* ADD MEMBER */
function addMember(parentId, side) {
    let name = prompt("Member Name:");
    if (!name) return;

    let parent = members.find(m => m.id === parentId);
    if (!parent) return alert("Parent not found");

    let newId = Date.now();

    if (side === "L") {
        if (parent.left) return alert("Left already filled");
        parent.left = newId;
    } else {
        if (parent.right) return alert("Right already filled");
        parent.right = newId;
    }

    members.push({ id: newId, name, left: null, right: null });

    save();
    renderTree();
    renderMembers();
    updateDashboard();
}

/* EDIT */
function editMember(id) {
    let m = members.find(x => x.id === id);
    let name = prompt("Edit Name:", m.name);
    if (name) {
        m.name = name;
        save();
        renderTree();
        renderMembers();
    }
}

/* TREE (SIMPLE LIST STYLE) */
function renderTree() {
    let box = document.getElementById("tree");
    box.innerHTML = "<h2>Binary Tree</h2>";

    function draw(id, level = 0) {
        let m = members.find(x => x.id === id);
        if (!m) return "";

        let pair = getPair(m.id);

        let html = `
        <div style="margin-left:${level * 20}px; margin-top:10px;">
            <b>${m.name}</b> (Pair: ${pair})
            <br>
            <button onclick="addMember(${m.id}, 'L')">L</button>
            <button onclick="addMember(${m.id}, 'R')">R</button>
            <button onclick="editMember(${m.id})">Edit</button>
        </div>
        `;

        html += draw(m.left, level + 1);
        html += draw(m.right, level + 1);

        return html;
    }

    box.innerHTML += draw(1);
}

/* PAIR LOGIC */
function getPair(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let left = count(m.left);
    let right = count(m.right);

    return Math.min(left, right);
}

function count(id) {
    if (!id) return 0;
    let m = members.find(x => x.id === id);
    return 1 + count(m.left) + count(m.right);
}

/* MEMBERS TABLE */
function renderMembers() {
    let table = document.getElementById("memberTable");
    if (!table) return;

    table.innerHTML = "";

    members.forEach(m => {
        let pair = getPair(m.id);
        let income = pair * 3;

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${m.left || 0}</td>
            <td>${m.right || 0}</td>
            <td>${pair}</td>
            <td>₹${income}</td>
            <td>
                <button onclick="addMember(${m.id}, 'L')">L</button>
                <button onclick="addMember(${m.id}, 'R')">R</button>
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>`;
    });
}

/* DASHBOARD */
function updateDashboard() {
    let totalMembers = members.length;
    let totalPairs = members.reduce((sum, m) => sum + getPair(m.id), 0);

    let totalIncome = totalPairs * 3;
    let companyProfit = totalMembers * 10 - totalIncome;

    document.getElementById("totalMembers").innerText = totalMembers;
    document.getElementById("totalPairs").innerText = totalPairs;
    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("companyProfit").innerText = companyProfit;
}

/* INIT */
renderTree();
renderMembers();
updateDashboard();
