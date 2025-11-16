// API Base URL (from config.js)
const API_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.className = 'toast', 3000);
}

// Fetch and display all departments
async function fetchDepartments() {
    try {
        document.getElementById('loadingDepts').style.display = 'block';
        
        const response = await fetch(`${API_URL}/departments`);
        const result = await response.json();

        document.getElementById('loadingDepts').style.display = 'none';

        if (result.success) {
            displayDepartments(result.data);
            populateUpdateSelect(result.data);
        }
    } catch (error) {
        document.getElementById('loadingDepts').style.display = 'none';
        console.error('Error fetching departments:', error);
        showToast('Error loading departments', 'error');
    }
}

// Display departments
function displayDepartments(departments) {
    const container = document.getElementById('departmentsList');
    
    if (departments.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No departments found. Add one to get started!</p></div>';
        return;
    }

    container.innerHTML = departments.map(dept => `
        <div class="list-item">
            <div class="list-item-content">
                <h3>${dept.name}</h3>
                <p><strong>Head:</strong> ${dept.head}</p>
                <p><strong>ID:</strong> ${dept.id}</p>
            </div>
            <div class="list-item-actions">
                <button class="btn btn-danger" onclick="deleteDepartment('${dept.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Populate update dropdown
function populateUpdateSelect(departments) {
    const select = document.getElementById('updateDeptId');
    select.innerHTML = '<option value="">-- Select Department --</option>' +
        departments.map(dept => `<option value="${dept.id}">${dept.name}</option>`).join('');
}

// Add department form handler
document.getElementById('addDepartmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        head: formData.get('head')
    };

    try {
        const response = await fetch(`${API_URL}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Department added successfully!', 'success');
            e.target.reset();
            fetchDepartments();
        } else {
            showToast(result.message || 'Error adding department', 'error');
        }
    } catch (error) {
        console.error('Error adding department:', error);
        showToast('Error adding department', 'error');
    }
});

// Update department form handler
document.getElementById('updateDepartmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const updates = {};

    if (formData.get('name')) updates.name = formData.get('name');
    if (formData.get('head')) updates.head = formData.get('head');

    if (Object.keys(updates).length === 0) {
        showToast('Please provide at least one update', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/departments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Department updated successfully!', 'success');
            e.target.reset();
            fetchDepartments();
        } else {
            showToast(result.message || 'Error updating department', 'error');
        }
    } catch (error) {
        console.error('Error updating department:', error);
        showToast('Error updating department', 'error');
    }
});

// Delete department
async function deleteDepartment(id) {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
        const response = await fetch(`${API_URL}/departments/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Department deleted successfully!', 'success');
            fetchDepartments();
        } else {
            showToast(result.message || 'Error deleting department', 'error');
        }
    } catch (error) {
        console.error('Error deleting department:', error);
        showToast('Error deleting department', 'error');
    }
}

// Load departments on page load
document.addEventListener('DOMContentLoaded', fetchDepartments);
