let members = JSON.parse(localStorage.getItem("members")) || [
    { id: 1, name: "Rajesh", left: null, right: null }
];

/* SAVE */
function save() {
    localStorage.setItem("members", JSON.stringify(members));
}

/* PAGE SWITCH */
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById(page).style.display = "block";

    if (page === "tree") renderTree();
    if (page === "members") renderMembers();
    if (page === "dashboard") updateDashboard();
}

/* ADD MEMBER */
function addMember(parentId, side) {
    let name = prompt("Enter Name:");
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

/* EDIT MEMBER */
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

/* COUNT TREE */
function count(id) {
    if (!id) return 0;
    let m = members.find(x => x.id === id);
    return 1 + count(m.left) + count(m.right);
}

/* PAIR CALCULATION */
function getPair(id) {
    let m = members.find(x => x.id === id);
    if (!m) return 0;

    let left = count(m.left);
    let right = count(m.right);

    return Math.min(left, right);
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

/* TREE (SVG WITH BUTTONS) */
function renderTree() {
    let svg = document.getElementById("treeSvg");
    if (!svg) return;

    svg.innerHTML = "";

    let root = members.find(m => m.id === 1);
    if (!root) return;

    function drawNode(node, x, y, gap) {
        let pair = getPair(node.id);

        // BOX
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x - 60);
        rect.setAttribute("y", y - 30);
        rect.setAttribute("width", 120);
        rect.setAttribute("height", 80);
        rect.setAttribute("rx", 10);
        rect.setAttribute("fill", "#0c3f44");

        // NAME
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y - 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "11");
        text.textContent = node.name;

        // PAIR
        let pairText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        pairText.setAttribute("x", x);
        pairText.setAttribute("y", y + 12);
        pairText.setAttribute("text-anchor", "middle");
        pairText.setAttribute("fill", "#00ffcc");
        pairText.setAttribute("font-size", "10");
        pairText.textContent = `Pair: ${pair}`;

        svg.appendChild(rect);
        svg.appendChild(text);
        svg.appendChild(pairText);

        // BUTTONS
        let fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("x", x - 55);
        fo.setAttribute("y", y + 20);
        fo.setAttribute("width", 110);
        fo.setAttribute("height", 40);

        let div = document.createElement("div");
        div.innerHTML = `
            <button onclick="addMember(${node.id}, 'L')">L</button>
            <button onclick="addMember(${node.id}, 'R')">R</button>
            <button onclick="editMember(${node.id})">Edit</button>
        `;
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.gap = "3px";

        fo.appendChild(div);
        svg.appendChild(fo);

        let newY = y + 120;

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

    drawNode(root, 1500, 80, 400);
}

/* INIT */
updateDashboard();
renderMembers();
renderTree();
