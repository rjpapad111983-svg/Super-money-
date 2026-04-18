let members = JSON.parse(localStorage.getItem("members")) || [
    { id: 1, name: "Root", left: null, right: null }
];

function save() {
    localStorage.setItem("members", JSON.stringify(members));
}

/* Page switch */
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById(page).style.display = "block";

    if (page === "tree") renderTree();
    if (page === "members") renderMembers();
    if (page === "dashboard") updateDashboard();
}

/* Add Member */
function addMemberPrompt() {
    let parentId = parseInt(prompt("Parent ID:"));
    let side = prompt("Side (L/R):").toLowerCase();
    let name = prompt("Name:");

    let parent = members.find(m => m.id === parentId);
    if (!parent) return alert("Parent not found");

    let newId = members.length + 1;

    if (side === "l" && !parent.left) {
        parent.left = newId;
    } else if (side === "r" && !parent.right) {
        parent.right = newId;
    } else {
        return alert("Position filled");
    }

    members.push({ id: newId, name, left: null, right: null });
    save();
    renderMembers();
}

/* Pair Logic */
function getPair(id) {
    let node = members.find(m => m.id === id);
    if (!node) return 0;

    let left = countTree(node.left);
    let right = countTree(node.right);

    return Math.min(left, right);
}

function countTree(id) {
    if (!id) return 0;
    let node = members.find(m => m.id === id);
    return 1 + countTree(node.left) + countTree(node.right);
}

/* Dashboard */
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

/* Members Table */
function renderMembers() {
    let table = document.getElementById("memberTable");
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
                <button onclick="editMember(${m.id})">Edit</button>
            </td>
        </tr>`;
    });
}

/* Edit */
function editMember(id) {
    let member = members.find(m => m.id === id);
    let name = prompt("New Name:", member.name);
    if (name) {
        member.name = name;
        save();
        renderMembers();
        renderTree();
    }
}

/* SEARCH */
function searchMember() {
    let value = document.getElementById("search").value.toLowerCase();

    document.querySelectorAll("#memberTable tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
}

/* TREE SVG */
function renderTree() {
    let svg = document.getElementById("treeSvg");
    svg.innerHTML = "";

    let root = members.find(m => m.id === 1);
    if (!root) return;

    function drawNode(node, x, y, gap) {
        let pair = getPair(node.id);

        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x - 50);
        rect.setAttribute("y", y - 20);
        rect.setAttribute("width", 100);
        rect.setAttribute("height", 50);
        rect.setAttribute("fill", "#0c3f44");

        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "10");
        text.textContent = `${node.name} (${pair})`;

        svg.appendChild(rect);
        svg.appendChild(text);

        let newY = y + 100;

        if (node.left) {
            let leftX = x - gap;
            drawLine(x, y, leftX, newY);
            drawNode(members.find(m => m.id === node.left), leftX, newY, gap / 1.5);
        }

        if (node.right) {
            let rightX = x + gap;
            drawLine(x, y, rightX, newY);
            drawNode(members.find(m => m.id === node.right), rightX, newY, gap / 1.5);
        }
    }

    function drawLine(x1, y1, x2, y2) {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "white");
        svg.appendChild(line);
    }

    drawNode(root, 1500, 50, 400);
}

/* INIT */
updateDashboard();
renderMembers();
