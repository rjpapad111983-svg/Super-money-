let members = [];

function addMember() {
  let name = prompt("Enter name");
  if (!name) return;

  members.push(name);
  renderTree();
}

function renderTree() {
  let tree = document.getElementById("tree");
  tree.innerHTML = "";

  members.forEach((m, i) => {
    let div = document.createElement("div");
    div.className = "node";
    div.innerText = m + " (ID: " + (i+1) + ")";
    tree.appendChild(div);
  });
}
