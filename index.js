
import { initDB, saveAllRecords, getAllRecords } from './indexedDBManager.js';

// Sample data set
const sampleData = [
    { id: 1, name: "task 1a", status: 'In-Progress', details: "Details 1a" },
    { id: 2, name: "task 2", status: 'In-Progress', details: "Details 2" },
    { id: 3, name: "task 3", status: 'In-Progress', details: "Details 3" }
];

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing rows
    sampleData.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.status}</td>
            <td>${item.details}</td>
        `;
        tableBody.appendChild(row);
    });
}

function loadData() {
    const cachedData = localStorage.getItem("taskData");
    if (cachedData) {
        // Use cached data if available
        return JSON.parse(cachedData);
    } else {
        // Use sample data and cache it
        localStorage.setItem("taskData", JSON.stringify(sampleData));
        return sampleData;
    }
}


/*
function dbConnect(){ 
    // 1. Initialize the database connection
    initDB();
    console.log("Database Ready.");

    // 2. Save the initial "table" of data
    saveAllRecords(sampleData);
    console.log("Sample data saved.");

    // 3. Retrieve the saved data
    const retrievedData = getAllRecords();
    console.log("Retrieved Data:", retrievedData);
}

   */

// Load data and populate the table on page load
const data = loadData();
populateTable(data);
//dbConnect(); 