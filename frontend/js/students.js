// API Base URL (from config.js)
const API_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';

let allStudents = [];
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
            populateDepartmentSelect();
        }
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

// Populate department dropdown
function populateDepartmentSelect() {
    const select = document.getElementById('studentDept');
    select.innerHTML = '<option value="">-- Select Department --</option>' +
        allDepartments.map(dept => `<option value="${dept.id}">${dept.name}</option>`).join('');
}

// Fetch classes by department
async function fetchClassesByDepartment(departmentId) {
    try {
        const response = await fetch(`${API_URL}/classes/department/${departmentId}`);
        const result = await response.json();
        
        if (result.success) {
            const select = document.getElementById('studentClass');
            select.innerHTML = '<option value="">-- Select Class --</option>' +
                result.data.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error fetching classes:', error);
    }
}

// Department change handler
document.getElementById('studentDept').addEventListener('change', (e) => {
    const deptId = e.target.value;
    if (deptId) {
        fetchClassesByDepartment(deptId);
    } else {
        document.getElementById('studentClass').innerHTML = '<option value="">-- Select Class --</option>';
    }
});

// Fetch all classes
async function fetchAllClasses() {
    try {
        const response = await fetch(`${API_URL}/classes`);
        const result = await response.json();
        
        if (result.success) {
            allClasses = result.data;
            populateClassFilter();
        }
    } catch (error) {
        console.error('Error fetching classes:', error);
    }
}

// Populate class filter
function populateClassFilter() {
    const select = document.getElementById('filterClass');
    select.innerHTML = '<option value="">All Classes</option>' +
        allClasses.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('');
}

// Fetch and display all students
async function fetchStudents() {
    try {
        document.getElementById('loadingStudents').style.display = 'block';
        
        const response = await fetch(`${API_URL}/students`);
        const result = await response.json();

        document.getElementById('loadingStudents').style.display = 'none';

        if (result.success) {
            allStudents = result.data;
            displayStudents(allStudents);
            populateUpdateSelect(allStudents);
        }
    } catch (error) {
        document.getElementById('loadingStudents').style.display = 'none';
        console.error('Error fetching students:', error);
        showToast('Error loading students', 'error');
    }
}

// Display students
function displayStudents(students) {
    const container = document.getElementById('studentsList');
    
    if (students.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No students found. Add one to get started!</p></div>';
        return;
    }

    container.innerHTML = students.map(student => {
        const cls = allClasses.find(c => c.id === student.classId);
        const dept = allDepartments.find(d => d.id === student.departmentId);
        return `
            <div class="list-item">
                <div class="list-item-content">
                    <h3>${student.name}</h3>
                    <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Class:</strong> ${cls ? cls.name : 'Unknown'}</p>
                    <p><strong>Department:</strong> ${dept ? dept.name : 'Unknown'}</p>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-secondary" onclick="viewBlockchain('${student.studentId}')">View Chain</button>
                    <button class="btn btn-danger" onclick="deleteStudent('${student.studentId}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Populate update dropdown
function populateUpdateSelect(students) {
    const select = document.getElementById('updateStudentId');
    select.innerHTML = '<option value="">-- Select Student --</option>' +
        students.map(s => `<option value="${s.studentId}">${s.name} (${s.rollNumber})</option>`).join('');
}

// Search students
document.getElementById('searchStudent').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query === '') {
        displayStudents(allStudents);
    } else {
        const filtered = allStudents.filter(s => 
            s.name.toLowerCase().includes(query) || 
            s.rollNumber.toLowerCase().includes(query)
        );
        displayStudents(filtered);
    }
});

// Filter by class
document.getElementById('filterClass').addEventListener('change', (e) => {
    const classId = e.target.value;
    if (classId === '') {
        displayStudents(allStudents);
    } else {
        const filtered = allStudents.filter(s => s.classId === classId);
        displayStudents(filtered);
    }
});

// Add student form handler
document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        rollNumber: formData.get('rollNumber'),
        email: formData.get('email'),
        classId: formData.get('classId'),
        departmentId: formData.get('departmentId')
    };

    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Student added successfully!', 'success');
            e.target.reset();
            fetchStudents();
        } else {
            showToast(result.message || 'Error adding student', 'error');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        showToast('Error adding student', 'error');
    }
});

// Update student form handler
document.getElementById('updateStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const studentId = formData.get('id');
    
    const updates = {};
    if (formData.get('name')) updates.name = formData.get('name');
    if (formData.get('rollNumber')) updates.rollNumber = formData.get('rollNumber');
    if (formData.get('email')) updates.email = formData.get('email');

    if (Object.keys(updates).length === 0) {
        showToast('Please provide at least one update', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Student updated successfully!', 'success');
            e.target.reset();
            fetchStudents();
        } else {
            showToast(result.message || 'Error updating student', 'error');
        }
    } catch (error) {
        console.error('Error updating student:', error);
        showToast('Error updating student', 'error');
    }
});

// Delete student
async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        const response = await fetch(`${API_URL}/students/${studentId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Student deleted successfully!', 'success');
            fetchStudents();
        } else {
            showToast(result.message || 'Error deleting student', 'error');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showToast('Error deleting student', 'error');
    }
}

// View blockchain
function viewBlockchain(studentId) {
    window.location.href = `/attendance#blockchain-${studentId}`;
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDepartments();
    fetchClasses();
    fetchStudents();

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});
