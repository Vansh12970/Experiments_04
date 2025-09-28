const prompt = require('prompt-sync')({ sigint: true });

// Array to store employee records
let employees = [];

function showMenu() {
    console.log('\n=== Employee Management System ===');
    console.log('1. Add Employee');
    console.log('2. View Employees');
    console.log('3. Update Employee');
    console.log('4. Delete Employee');
    console.log('5. Exit');
}

function addEmployee() {
    const id = prompt('Enter employee ID: ');
    const name = prompt('Enter employee name: ');
    const role = prompt('Enter employee role: ');
    
    employees.push({ id, name, role });
    console.log('Employee added successfully!');
}

function viewEmployees() {
    if (employees.length === 0) {
        console.log('No employees found.');
        return;
    }
    console.log('\nEmployee List:');
    employees.forEach(emp => {
        console.log(`ID: ${emp.id}, Name: ${emp.name}, Role: ${emp.role}`);
    });
}

function updateEmployee() {
    const id = prompt('Enter employee ID to update: ');
    const emp = employees.find(e => e.id === id);
    if (!emp) {
        console.log('Employee not found.');
        return;
    }
    emp.name = prompt(`Enter new name (${emp.name}): `) || emp.name;
    emp.role = prompt(`Enter new role (${emp.role}): `) || emp.role;
    console.log('Employee updated successfully!');
}

function deleteEmployee() {
    const id = prompt('Enter employee ID to delete: ');
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) {
        console.log('Employee not found.');
        return;
    }
    employees.splice(index, 1);
    console.log('Employee deleted successfully!');
}

// Main loop
while (true) {
    showMenu();
    const choice = prompt('Enter your choice: ');

    switch (choice) {
        case '1':
            addEmployee();
            break;
        case '2':
            viewEmployees();
            break;
        case '3':
            updateEmployee();
            break;
        case '4':
            deleteEmployee();
            break;
        case '5':
            console.log('Exiting...');
            process.exit(0);
        default:
            console.log('Invalid choice. Please try again.');
    }
}
