// API Base URL
const API_URL = 'http://localhost:3000/api';

let allClasses = [];
let allDepartments = [];

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.className = 'toast', 3000);
}

// Fetch departments
async function fetchDepartments() {
    try {
        const response = await fetch(`${API_URL}/departments`);
        const result = await response.json();
        
        if (result.success) {
            allDepartments = result.data;
            populateDepartmentSelects();
        }
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

// Populate department dropdowns
function populateDepartmentSelects() {
    const addSelect = document.getElementById('classDept');
    const filterSelect = document.getElementById('filterDept');

    const options = allDepartments.map(dept => 
        `<option value="${dept.id}">${dept.name}</option>`
    ).join('');

    addSelect.innerHTML = '<option value="">-- Select Department --</option>' + options;
    filterSelect.innerHTML = '<option value="">All Departments</option>' + options;
}

// Fetch and display all classes
async function fetchClasses() {
    try {
        document.getElementById('loadingClasses').style.display = 'block';
        
        const response = await fetch(`${API_URL}/classes`);
        const result = await response.json();

        document.getElementById('loadingClasses').style.display = 'none';

        if (result.success) {
            allClasses = result.data;
            displayClasses(allClasses);
            populateUpdateSelect(allClasses);
        }
    } catch (error) {
        document.getElementById('loadingClasses').style.display = 'none';
        console.error('Error fetching classes:', error);
        showToast('Error loading classes', 'error');
    }
}

// Display classes
function displayClasses(classes) {
    const container = document.getElementById('classesList');
    
    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes found. Add one to get started!</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => {
        const dept = allDepartments.find(d => d.id === cls.departmentId);
        return `
            <div class="list-item">
                <div class="list-item-content">
                    <h3>${cls.name}</h3>
                    <p><strong>Teacher:</strong> ${cls.teacher}</p>
                    <p><strong>Department:</strong> ${dept ? dept.name : 'Unknown'}</p>
                    <p><strong>Capacity:</strong> ${cls.capacity}</p>
                    <p><strong>ID:</strong> ${cls.id}</p>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-danger" onclick="deleteClass('${cls.departmentId}', '${cls.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Populate update dropdown
function populateUpdateSelect(classes) {
    const select = document.getElementById('updateClassId');
    select.innerHTML = '<option value="">-- Select Class --</option>' +
        classes.map(cls => `<option value="${cls.id}" data-dept="${cls.departmentId}">${cls.name}</option>`).join('');
}

// Filter classes by department
document.getElementById('filterDept').addEventListener('change', (e) => {
    const deptId = e.target.value;
    if (deptId === '') {
        displayClasses(allClasses);
    } else {
        const filtered = allClasses.filter(cls => cls.departmentId === deptId);
        displayClasses(filtered);
    }
});

// Add class form handler
document.getElementById('addClassForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        teacher: formData.get('teacher'),
        capacity: parseInt(formData.get('capacity')),
        departmentId: formData.get('departmentId')
    };

    try {
        const response = await fetch(`${API_URL}/classes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Class added successfully!', 'success');
            e.target.reset();
            fetchClasses();
        } else {
            showToast(result.message || 'Error adding class', 'error');
        }
    } catch (error) {
        console.error('Error adding class:', error);
        showToast('Error adding class', 'error');
    }
});

// Update class form handler
document.getElementById('updateClassForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const select = document.getElementById('updateClassId');
    const classId = formData.get('id');
    const departmentId = select.options[select.selectedIndex].getAttribute('data-dept');
    
    const updates = {};
    if (formData.get('name')) updates.name = formData.get('name');
    if (formData.get('teacher')) updates.teacher = formData.get('teacher');
    if (formData.get('capacity')) updates.capacity = parseInt(formData.get('capacity'));

    if (Object.keys(updates).length === 0) {
        showToast('Please provide at least one update', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/classes/${departmentId}/${classId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Class updated successfully!', 'success');
            e.target.reset();
            fetchClasses();
        } else {
            showToast(result.message || 'Error updating class', 'error');
        }
    } catch (error) {
        console.error('Error updating class:', error);
        showToast('Error updating class', 'error');
    }
});

// Delete class
async function deleteClass(departmentId, classId) {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
        const response = await fetch(`${API_URL}/classes/${departmentId}/${classId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Class deleted successfully!', 'success');
            fetchClasses();
        } else {
            showToast(result.message || 'Error deleting class', 'error');
        }
    } catch (error) {
        console.error('Error deleting class:', error);
        showToast('Error deleting class', 'error');
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDepartments();
    fetchClasses();
});
