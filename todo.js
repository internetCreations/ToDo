// --- IndexedDB Constants ---
const DB_NAME = 'ToDoDB';
const STORE_NAME = 'todos';
const DB_VERSION = 1;
let db = null;

const initialTodoList = [
    { id: crypto.randomUUID(), item: 'Call Mom', category: 'Social', status: 'Done', priority: 'Medium' },
    { id: crypto.randomUUID(), item: 'Hawaii Trip Plan', category: 'Adventure', status: 'In Progress', priority: 'Low' },
    { id: crypto.randomUUID(), item: 'House Shop', category: 'Money', status: 'In Progress', priority: 'Low' },
    { id: crypto.randomUUID(), item: 'RV kitchen storage', category: 'Adventure', status: 'Not Started', priority: 'Low' },
    { id: crypto.randomUUID(), item: 'RV propane tank', category: 'Adventure', status: 'Not Started', priority: 'Low' },
    { id: crypto.randomUUID(), item: 'Book Fall/Winter Housing', category: 'Life Admin', status: 'Not Started', priority: 'Low' },
    { id: crypto.randomUUID(), item: 'Switch Storage Units', category: 'Life Admin', status: 'Not Started', priority: 'Low' },
    { id: crypto.randomUUID(), item: 'Reply Alex', category: 'Social', status: 'Not Started', priority: 'Medium' },
    { id: crypto.randomUUID(), item: 'Call Grandma', category: 'Social', status: 'Not Started', priority: 'Medium' },
    { id: crypto.randomUUID(), item: 'House Insurance Check', category: 'Money', status: 'Not Started', priority: 'Medium' },
];

function getStatusBadgeClasses(status) {
    switch (status) {
        case 'Done':
            return 'bg-green-100 text-green-800';
        case 'In Progress':
            return 'bg-yellow-100 text-yellow-800';
        case 'Not Started':
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function renderTable(tasks) {
    const tbody = document.getElementById('todoTableBody');
    if (!tbody) return console.error("Could not find table body element.");

    tbody.innerHTML = '';

    if (tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-500">No tasks found. Try refreshing to populate initial data.</td></tr>';
        return;
    }

    tasks.forEach((todo, index) => {
        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'table-row-even hover:bg-indigo-50/50' : 'table-row-odd hover:bg-indigo-50/50';
        const createCell = (content, isBadge = false) => {
            const cell = document.createElement('td');
            cell.className = 'py-3 px-4 whitespace-nowrap text-sm text-gray-700';
            if (isBadge) {
                const badge = document.createElement('span');
                badge.textContent = content;
                badge.className = `inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${getStatusBadgeClasses(content)}`;
                cell.appendChild(badge);
            } else {
                cell.textContent = content;
            }
            return cell;
        };
        row.appendChild(createCell(todo.item));
        row.appendChild(createCell(todo.status, true));
        row.appendChild(createCell(todo.category));
        row.appendChild(createCell(todo.priority));
        tbody.appendChild(row);
    });
}

function openDatabase() {
    if (!('indexedDB' in window)) {
        console.error("IndexedDB not supported.");
        document.getElementById('todoTableBody').innerHTML = '<tr><td colspan="4" class="text-center py-8 text-red-500">IndexedDB not supported by your browser.</td></tr>';
        return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            console.log(`IndexedDB store '${STORE_NAME}' created.`);
        }
    };
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log(`IndexedDB '${DB_NAME}' opened successfully.`);
        loadTasksFromDB();
    };
    request.onerror = (event) => {
        console.error(`IndexedDB error: ${event.target.errorCode}`);
        document.getElementById('todoTableBody').innerHTML = '<tr><td colspan="4" class="text-center py-8 text-red-500">Error opening IndexedDB.</td></tr>';
    };
}

function loadTasksFromDB() {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const getAllRequest = store.getAll();
    getAllRequest.onsuccess = () => {
        const tasks = getAllRequest.result;
        if (tasks.length === 0) {
            console.log("No tasks found in IndexedDB. Populating initial data.");
            populateInitialData();
        } else {
            console.log(`Loaded ${tasks.length} tasks from IndexedDB.`);
            renderTable(tasks);
        }
    };
    getAllRequest.onerror = (event) => {
        console.error("Error retrieving tasks:", event.target.errorCode);
    };
}

function populateInitialData() {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    initialTodoList.forEach(todo => {
        store.add(todo);
    });
    transaction.oncomplete = () => {
        console.log("Initial data successfully populated.");
        loadTasksFromDB();
    };
    transaction.onerror = (event) => {
        console.error("Error populating initial data:", event.target.error);
    };
}

window.onload = openDatabase;