// 🌳 TREE DATA
let tree = {
  id: 1,
  name: "Rajesh",
  left: null,
  right: null
};

// ➕ ADD MEMBER ANYWHERE
function addMemberToNode(id, side) {
  let name = prompt("Enter member name:");
  if (!name) return;

  function add(node) {
    if (!node) return;

    if (node.id === id) {
      if (side === "left") {
        if (!node.left) {
          node.left = {
            id: Date.now(),
            name,
            left: null,
            right: null
          };
        } else {
          alert("Left already filled");
        }
      }

      if (side === "right") {
        if (!node.right) {
          node.right = {
            id: Date.now(),
            name,
            left: null,
            right: null
          };
        } else {
          alert("Right already filled");
        }
      }
    }

    add(node.left);
    add(node.right);
  }

  add(tree);
  renderTree();
}

// ROOT BUTTON
function addMember(side) {
  addMemberToNode(1, side);
}

// ✏️ EDIT MEMBER
function editMember(id) {
  let newName = prompt("Enter new name:");
  if (!newName) return;

  function update(node) {
    if (!node) return;

    if (node.id === id) {
      node.name = newName;
    }

    update(node.left);
    update(node.right);
  }

  update(tree);
  renderTree();
}

// ❌ DELETE MEMBER
function deleteMember(id) {
  if (id === 1) {
    alert("Root delete nahi kar sakte");
    return;
  }

  function remove(node) {
    if (!node) return null;

    if (node.left && node.left.id === id) {
      node.left = null;
    } else if (node.right && node.right.id === id) {
      node.right = null;
    } else {
      remove(node.left);
      remove(node.right);
    }

    return node;
  }

  remove(tree);
  renderTree();
}

// 💰 PAIR CALCULATION
function calculatePairs(node) {
  if (!node) return { left: 0, right: 0, pairs: 0 };

  let leftData = calculatePairs(node.left);
  let rightData = calculatePairs(node.right);

  let leftCount = node.left ? 1 + leftData.left + leftData.right : 0;
  let rightCount = node.right ? 1 + rightData.left + rightData.right : 0;

  let pair = Math.min(leftCount, rightCount);

  let totalPairs = pair + leftData.pairs + rightData.pairs;

  return {
    left: leftCount,
    right: rightCount,
    pairs: totalPairs
  };
}

// 💵 INCOME
function getIncome() {
  let data = calculatePairs(tree);
  let income = data.pairs * 3;

  return {
    pairs: data.pairs,
    income: income
  };
}

// 🌳 RENDER TREE
function renderTree() {
  let result = getIncome();

  document.getElementById("tree").innerHTML =
    `<h3>Total Pairs: ${result.pairs}</h3>
     <h3>Total Income: ₹${result.income}</h3>` +
    renderNode(tree);
}

// 🌿 NODE UI
function renderNode(node) {
  if (!node) return "";

  return `
    <div style="margin:20px; text-align:center;">
      
      <div style="border:1px solid white; padding:10px; display:inline-block;">
        ${node.name} (ID: ${node.id})
        <br><br>

        <button onclick="addMemberToNode(${node.id}, 'left')">Left</button>
        <button onclick="addMemberToNode(${node.id}, 'right')">Right</button>
        <br><br>

        <button onclick="editMember(${node.id})">Edit</button>
        <button onclick="deleteMember(${node.id})">Delete</button>
      </div>

      <div style="display:flex; justify-content:space-around;">
        <div>${renderNode(node.left)}</div>
        <div>${renderNode(node.right)}</div>
      </div>

    </div>
  `;
}

// 🔄 START
renderTree();
