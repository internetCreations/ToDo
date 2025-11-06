// Data set
const data = [
    { id: 1, name: "task 1", status: 99, details: "Details 1" },
    { id: 2, name: "task 2", status: 34, details: "Details 2" },
    { id: 3, name: "task 3", status: 23, details: "Details 3" }
];

// Function to populate the table with initial data 
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    data.forEach(item => {
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

// Populate the table on page load
populateTable(data);