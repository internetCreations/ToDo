
import { initDB, saveAllRecords, getAllRecords } from './indexedDBManager.js';

// Sample data set
const sampleData = [
    { id: 1, name: "task 1b", status: 'In-Progress', details: "Details 1a", completed: false },
    { id: 2, name: "task 2", status: 'In-Progress', details: "Details 2", completed: false },
    { id: 3, name: "task 3", status: 'In-Progress', details: "Details 3", completed: false }
];

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing rows
    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.status}</td>
            <td>${item.details}</td>
            <td><button id="delete-button" data-index="${index}">Delete</button></td>
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
    console.log( " handleCheckboxChange start");
    const checkbox = event.target;
    const index = checkbox.getAttribute("data-index");
    const data = loadData();

    // Update the completed status in the data array
    data[index].completed = checkbox.checked;

    // Save the updated data back to localStorage
    localStorage.setItem("taskData", JSON.stringify(data));
    console.log( " handleCheckboxChange end");
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

function initButtons() {
    console.log(" initButtons ");
    document.getElementById("add-new-task").addEventListener("click", addNewTask); 
    document.getElementById("delete-button").addEventListener("click", deleteTask);
}

function deleteTask() {
    alert("Delete task clicked");
}

function addNewTask() {
    // Create a new task object
    const newTask = {
        id: data.length + 1, // Generate a new ID based on the current data length
        name: document.getElementById("task-name").value,
        status: document.getElementById("task-status").value,
        details: document.getElementById("task-details").value,
        completed: document.getElementById("task-completed").checked
    };

    alert(JSON.stringify(newTask));

        // Add the new task to the data array
        data.push(newTask);

        // Save the updated data back to localStorage
        localStorage.setItem("taskData", JSON.stringify(data));
    
        console.log("New task added to localStorage:", newTask);
    
        // Optionally, clear the form fields after adding the task
        document.getElementById("add-task-form").reset();
    
        // Re-populate the table with the updated data
        populateTable(data);
    
        console.log("addNewTask end");
}

// Load data and populate the table on page load
console.log(" start init ");
const data = loadData();
populateTable(data);
initButtons();
console.log(" end init ");
