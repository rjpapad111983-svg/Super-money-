let members = JSON.parse(localStorage.getItem("members")) || [];

document.addEventListener("DOMContentLoaded", () => {

    if (members.length === 0) {
        members.push({
            id: 1,
            name: "Rajesh",
            left: 0,
            right: 0,
            parent: 0,
            pairs: 0,
            income: 0
        });
        saveData();
    }

    calculate();
    renderAll();
});

function saveData() {
    localStorage.setItem("members", JSON.stringify(members));
}

function addMember(parentId, side) {

    let name = prompt("Enter name");
    if (!name) return;

    const id = Date.now();

    const newMember = {
        id,
        name,
        left: 0,
        right: 0,
        parent: parentId,
        pairs: 0,
        income: 0
    };

    const parent = members.find(x => x.id === parentId);

    if (side === "left") parent.left = id;
    else parent.right = id;

    members.push(newMember);

    saveData();
    calculate();
    renderAll();
}

function deleteMember(id) {

    if (id === 1) return alert("Root delete nahi");

    members = members.filter(x => x.id !== id);

    members.forEach(m => {
        if (m.left === id) m.left = 0;
        if (m.right === id) m.right = 0;
    });

    saveData();
    calculate();
    renderAll();
}

function count(id) {
    if (!id) return 0;
    const m = members.find(x => x.id === id);
    if (!m) return 0;
    return 1 + count(m.left) + count(m.right);
}

function calculate() {

    members.forEach(m => {

        let left = count(m.left);
        let right = count(m.right);

        m.pairs = Math.min(left, right);

        let income = m.pairs * 3;

        // 🔥 HARD CAP 180
        if (income > 180) income = 180;

        m.income = income;
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
        <li>
            <div class="node-card">
                <b>${m.name}</b><br>
                Pair: ${m.pairs}<br>
                ₹${m.income}<br>

                <button onclick="addMember(${m.id},'left')">L</button>
                <button onclick="addMember(${m.id},'right')">R</button>
                <button onclick="deleteMember(${m.id})">Del</button>
            </div>

            ${(m.left || m.right) ? `
            <ul>
                ${m.left ? build(map[m.left]) : ""}
                ${m.right ? build(map[m.right]) : ""}
            </ul>` : ""}
        </li>`;
    }

    const root = members.find(m => m.parent === 0);

    tree.innerHTML = `<ul class="mlm-tree">${build(root)}</ul>`;
}

function renderMembers() {

    const table = document.getElementById("membersTable");
    table.innerHTML = "";

    members.forEach(m => {

        let left = count(m.left);
        let right = count(m.right);

        table.innerHTML += `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${left}</td>
            <td>${right}</td>
            <td>${m.pairs}</td>
            <td>₹${m.income}</td>
            <td>
                <button onclick="deleteMember(${m.id})">Delete</button>
            </td>
        </tr>`;
    });
}

function renderAll() {
    renderTree();
    renderMembers();
}
