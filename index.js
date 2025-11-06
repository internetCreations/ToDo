// Data set
const data = [
    { id: 1, name: "John Doe", age: 99, city: "New York" },
    { id: 2, name: "Jane Smith", age: 34, city: "Los Angeles" },
    { id: 3, name: "Sam Wilson", age: 23, city: "Chicago" }
];

// Function to populate the table
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.city}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate the table on page load
populateTable(data);