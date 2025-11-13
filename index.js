
import { initDB, saveAllRecords, getAllRecords } from './indexedDBManager.js';

// Sample data set
const sampleData = [
    { id: 1, name: "task 1b", status: 'In-Progress', details: "Details 1a" },
    { id: 2, name: "task 2", status: 'In-Progress', details: "Details 2" },
    { id: 3, name: "task 3", status: 'In-Progress', details: "Details 3" }
];

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing rows
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.status}</td>
            <td>${item.details}</td>
            <td><input type="checkbox" class="completed-checkbox" data-index="${index}" ${item.completed ? "checked" : ""}></td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to checkboxes
    document.querySelectorAll(".completed-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", handleCheckboxChange);
    });
}

// Function to handle checkbox changes
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const index = checkbox.getAttribute("data-index");
    const data = loadData();

    // Update the completed status in the data array
    data[index].completed = checkbox.checked;

    // Save the updated data back to localStorage
    localStorage.setItem("taskData", JSON.stringify(data));
}

function loadData() {
    const cachedData = localStorage.getItem("taskData");
    if (cachedData) {
        // Use cached data if available
        console.log("Using cached data.");
        return JSON.parse(cachedData);
    } else {
        // Use sample data and cache it
        localStorage.setItem("taskData", JSON.stringify(sampleData));
        console.log("sample data cached");
        return sampleData;
    }
}

function saveDbData() {

}

function initButtons() {
    console.log(" initButtons ");
    // Get the button element by its ID
    const button = document.getElementById("setupDb");

    // Attach the event listener
    button.addEventListener("click", dbConnect); 
}

// Load data and populate the table on page load
console.log(" start init ");
const data = loadData();
populateTable(data);
initButtons();
console.log(" end init ");
