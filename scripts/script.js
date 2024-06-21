// console.log("Boilerplate");

//DOM elements

const categorySelect = document.querySelector("#category");
const nameInput = document.querySelector("#name");
const amountInput = document.querySelector("#amount");
const addButton = document.querySelector("#addButton");
const budgetList = document.querySelector("#budgetList");

// Global Variables

const alertComponent = document.createElement("div");

// Budget Data
let budgetData = [];

let total = 0;

function saveData() {
  localStorage.setItem("budgetData", JSON.stringify(budgetData));
}
function loadData() {
  const data = localStorage.getItem("budgetData");
  if (data) {
    budgetData = JSON.parse(data);
    updateBudgetList();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadData(), calculateTotal();
});

document.querySelector("#loadButton").onclick = () => {
  loadData(), calculateTotal();
  showAlert("Data loaded", "success");
};

document.querySelector("#saveButton").onclick = () => {
  saveData();
  showAlert("Data saved", "success");
};

window.onbeforeunload = () => saveData();

addButton.onclick = () => {
  const name = nameInput.value;
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;

  //   Conditioning
  if (name && !isNaN(amount) && amount > 0) {
    const newItem = { name, amount, category };
    budgetData.push(newItem);

    // Calculate the total
    // console.log("calculateTotal");
    calculateTotal();

    // Update the budget list

    // console.log("updateBudgetList");
    updateBudgetList();

    nameInput.value = "";
    amountInput.value = "";

    if (addButton.innerHTML === "Update") {
      addButton.innerHTML = "Add";
      showAlert("Item Updated", "update");
    } else {
      showAlert("Item added", "confirm");
    }
    nameInput.focus();
  } else {
    // alert("Please enter a valid name and amount.");
    showAlert("Please enter a valid name and amount.", "error");
  }
};

// Calc total budget

function calculateTotal() {
  total = 0;
  budgetData.forEach((item) => {
    if (item.category === "income") {
      total += item.amount;
    } else {
      total -= item.amount;
    }
  });
  // Calculate the total per category
  //   console.log("calculateTotalCategory");
  calculateTotalCategory();
  document.querySelector("#totalAmount").textContent = total.toFixed(2);
}

// Calculate the total per category function \

function calculateTotalCategory() {
  let totalIncome = 0;
  let totalHome_utilities = 0;
  let totalInsurance_financial = 0;
  let totalGroceries = 0;
  let totalPersonal_medical = 0;
  let totalEntertainment_eat_out = 0;
  let totalTransport_auto = 0;
  let totalChildren = 0;

  budgetData.forEach((item) => {
    switch (item.category) {
      case "income":
        totalIncome += item.amount;
        break;

      case "home_utilities":
        totalHome_utilities += item.amount;
        break;
      case "insurance_financial":
        totalInsurance_financial += item.amount;
        break;
      case "groceries":
        totalGroceries += item.amount;
        break;
      case "personal_medical":
        totalPersonal_medical += item.amount;
        break;
      case "entertainment_eat_out":
        totalEntertainment_eat_out += item.amount;
        break;
      case "transport_auto":
        totalTransport_auto += item.amount;
        break;
      case "children":
        totalChildren += item.amount;
        break;
      default:
        total += item.amount;
        break;
    }
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalHome_utilities").textContent =
      totalHome_utilities.toFixed(2);
    document.getElementById("totalInsurance_financial").textContent =
      totalInsurance_financial.toFixed(2);
    document.getElementById("totalGroceries").textContent =
      totalGroceries.toFixed(2);
    document.getElementById("totalPersonal_medical").textContent =
      totalPersonal_medical.toFixed(2);
    document.getElementById("totalEntertainment_eat_out").textContent =
      totalEntertainment_eat_out.toFixed(2);
    document.getElementById("totalTransport_auto").textContent =
      totalTransport_auto.toFixed(2);
    document.getElementById("totalChildren").textContent =
      totalChildren.toFixed(2);
  });
}

// Function to update

function updateBudgetList() {
  budgetList.querySelectorAll("ul").forEach((ul) => (ul.innerHTML = ""));
  //   console.log(budgetData);
  budgetData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
    
     <div>${item.name} - $${item.amount}</div>

              <div>
                <i
                  class="fa-solid fa-pen-to-square btn edit"
                  onclick="editItem(${index})"
                ></i>
                <i
                  class="fa-solid fa-trash btn delete"
                  onclick="removeItem(${index})"
                ></i>
              </div> 
    
    `;

    addToCategory(item.category, li);
  });
}

function addToCategory(itemCategory, li) {
  const categories = [
    "income",
    "home_utilities",
    "insurance_financial",
    "groceries",
    "personal_medical",
    "entertainment_eat_out",
    "transport_auto",
    "children",
  ];

  categories.find((category) => {
    if (itemCategory === category) {
      budgetList.querySelector(`#${category}`).appendChild(li);
    }
  });
}

// Remove items

function removeItem(index) {
  itemName = budgetData[index].name;
  if (!window.confirm(`Are you sure you want to delete this ${itemName}`)) {
    return;
  }

  budgetData.splice(index, 1);
  calculateTotal();
  updateBudgetList();
  showAlert(`${itemName} was deleted`, "update");
}

// Edit Item

function editItem(index) {
  addButton.innerHTML = "Update";

  const item = budgetData[index];
  nameInput.value = item.name;
  amountInput.value = item.amount;
  categorySelect.value = item.category;

  budgetData.splice(index, 1);
  calculateTotal();
  updateBudgetList();
}

// Clear list

function clearBudgetList() {
  if (!window.confirm("Are you sure you want to clere the budget list?")) {
    return;
  }

  budgetData = [];
  calculateTotal();
  updateBudgetList();
  showAlert("Budget list cleared", "update");
}

document.querySelector("#clearButton").onclick = () => clearBudgetList();

// Create alert component and function

alertComponent.classList.add("alert", "hidden");
alertComponent.innerHTML = `<div class="alert-message"></div>`;
document.querySelector("#app").appendChild(alertComponent);

// Alert function

function showAlert(message, type) {
  document.querySelector(".alert-message").innerHTML = message;
  alertComponent.classList.remove("hidden");

  if (type === "success") {
    alertComponent.classList.add("alert-success");
    hideAlert("alert-success");
  }

  if (type === "confirm") {
    alertComponent.classList.add("alert-confirm");
    hideAlert("alert-confirm");
  }
  if (type === "error") {
    alertComponent.classList.add("alert-danger");
    hideAlert("alert-danger");
  }
  if (type === "update") {
    alertComponent.classList.add("alert-warning");
    hideAlert("alert-warning");
  }

  function hideAlert(type) {
    setTimeout(() => {
      alertComponent.classList.remove(type);
      alertComponent.classList.add("hidden");
    }, 3000);
  }
}
