// GLOBAL TREE DATA
let tree = {
  id: 1,
  name: "Rajesh",
  left: null,
  right: null
};

// ADD MEMBER (ANY NODE LEFT/RIGHT)
function addMemberToNode(id, side) {
  let name = prompt("Enter member name:");
  if (!name) return;

  function add(node) {
    if (!node) return;

    if (node.id === id) {
      if (side === "left") {
        if (node.left === null) {
          node.left = {
            id: Date.now(),
            name: name,
            left: null,
            right: null
          };
        } else {
          alert("Left already filled");
        }
      }

      if (side === "right") {
        if (node.right === null) {
          node.right = {
            id: Date.now(),
            name: name,
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

// ROOT BUTTON (OPTIONAL)
function addMember(side) {
  addMemberToNode(1, side);
}

// EDIT MEMBER
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

// RENDER TREE
function renderTree() {
  document.getElementById("tree").innerHTML = renderNode(tree);
}

// EACH NODE UI
function renderNode(node) {
  if (!node) return "";

  return `
    <div style="margin:20px; text-align:center;">
      
      <div style="border:1px solid white; padding:10px; display:inline-block;">
        ${node.name} (ID: ${node.id})
        <br><br>

        <!-- 🔥 NEW BUTTONS PER MEMBER -->
        <button onclick="addMemberToNode(${node.id}, 'left')">Left</button>
        <button onclick="addMemberToNode(${node.id}, 'right')">Right</button>
        <br><br>
        <button onclick="editMember(${node.id})">Edit</button>
      </div>

      <div style="display:flex; justify-content:space-around;">
        <div>${renderNode(node.left)}</div>
        <div>${renderNode(node.right)}</div>
      </div>

    </div>
  `;
}

// INITIAL LOAD
renderTree();
