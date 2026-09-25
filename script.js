let stashData = [
  { n: "pizza", ess: "yup", c: 150, q: 10 },
  { n: "energy drinks", ess: "yup", c: 35, q: 40 },
  { n: "dinosaur suit", ess: "nah", c: 500, q: 1 },
];

let configData = { nerds: 50, turnout: 50, cash: 150, sugar: 0 };

function initApp() {
  const savedStash = localStorage.getItem("hackBudgetStash");
  const savedConfig = localStorage.getItem("hackBudgetConfig");

  if (savedStash) stashData = JSON.parse(savedStash);
  if (savedConfig) {
    configData = JSON.parse(savedConfig);
    document.getElementById("inp-nerds").value = configData.nerds;
    document.getElementById("inp-turnout").value = configData.turnout;
    document.getElementById("inp-cash").value = configData.cash;
    document.getElementById("inp-sugar").value = configData.sugar;
  }

  renderTable();
}

function saveData() {
  localStorage.setItem("hackBudgetStash", JSON.stringify(stashData));
  localStorage.setItem("hackBudgetConfig", JSON.stringify(configData));
}

function updateConfig(key, val) {
  configData[key] = Number(val) || 0;
  saveData();
  calcMath();
}

function updateItem(idx, key, val) {
  if (key === "c" || key === "q") stashData[idx][key] = Number(val) || 0;
  else stashData[idx][key] = val;
  saveData();

  if (key === "c" || key === "q") {
    document.getElementById(`dmg-${idx}`).innerText =
      stashData[idx].c * stashData[idx].q;
  }
  calcMath();
}

function addItem() {
  stashData.push({ n: "idk", ess: "yup", c: 10, q: 1 });
  saveData();
  renderTable();
}

function yeetItem(idx) {
  stashData.splice(idx, 1);
  saveData();
  renderTable();
}

function nukeIt() {
  if (confirm("bro u sure? this deletes everything forever!")) {
    stashData = [];
    saveData();
    renderTable();
  }
}

function renderTable() {
  const tbody = document.getElementById("loot-body");
  tbody.innerHTML = stashData
    .map(
      (item, i) => `
    <tr>
      <td><input type="text" value="${item.n}" onchange="updateItem(${i}, 'n', this.value)"></td>
      <td>
        <select onchange="updateItem(${i}, 'ess', this.value)">
          <option ${item.ess === "yup" ? "selected" : ""}>yup</option>
          <option ${item.ess === "nah" ? "selected" : ""}>nah</option>
        </select>
      </td>
      <td><input type="number" value="${item.c}" onchange="updateItem(${i}, 'c', this.value)"></td>
      <td><input type="number" value="${item.q}" onchange="updateItem(${i}, 'q', this.value)"></td>
      <td style="font-weight:900; font-size:1.2rem; color:var(--orange)" id="dmg-${i}">${item.c * item.q}</td>
      <td><button class="yeet-btn" onclick="yeetItem(${i})">yeet</button></td>
    </tr>
  `,
    )
    .join("");
  calcMath();
}

function calcMath() {
  const budget =
    configData.nerds * (configData.turnout / 100) * configData.cash +
    configData.sugar;

  let spent = 0;
  stashData.forEach((item) => {
    if (item.ess === "yup") {
      spent += item.c * item.q;
    }
  });

  const left = budget - spent;
  let percent = budget > 0 ? (spent / budget) * 100 : 0;

  document.getElementById("txt-total").innerText = budget;
  document.getElementById("txt-spent").innerText = spent;

  const txtLeft = document.getElementById("txt-left");
  txtLeft.innerText = left;
  txtLeft.className = left < 0 ? "val bad" : "val";

  const statusBox = document.getElementById("status-box");
  if (left < 0) {
    statusBox.classList.add("panic-mode");
    statusBox.classList.remove("glow");
  } else {
    statusBox.classList.remove("panic-mode");
    statusBox.classList.add("glow");
  }

  const fill = document.getElementById("bar-fill");
  const barTxt = document.getElementById("bar-text");

  if (percent > 100) percent = 100;
  fill.style.width = percent + "%";
  fill.style.backgroundColor =
    left < 0 ? "var(--red)" : percent > 80 ? "var(--orange)" : "var(--green)";
  barTxt.innerText =
    Math.round(budget > 0 ? (spent / budget) * 100 : 0) + "% burned";
}

window.onload = initApp;
