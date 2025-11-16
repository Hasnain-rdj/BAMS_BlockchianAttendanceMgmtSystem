// API Base URL
const API_URL = 'http://localhost:3000/api';

let allDepartments = [];
let allStudents = [];

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

// Populate department select
function populateDepartmentSelect() {
    const select = document.getElementById('classDeptSelect');
    select.innerHTML = '<option value="">-- Select Department --</option>' +
        allDepartments.map(dept => `<option value="${dept.id}">${dept.name}</option>`).join('');
}

// Fetch students
async function fetchStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        const result = await response.json();
        
        if (result.success) {
            allStudents = result.data;
            populateStudentSelect();
        }
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

// Populate student select
function populateStudentSelect() {
    const select = document.getElementById('studentSelect');
    select.innerHTML = '<option value="">-- Select Student --</option>' +
        allStudents.map(s => `<option value="${s.studentId}">${s.name} (${s.rollNumber})</option>`).join('');
}

// Load department blockchain
document.getElementById('loadDeptChain').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/blockchain/department`);
        const result = await response.json();

        if (result.success) {
            displayBlockchain(result.data, 'deptChainContainer', 'Department');
            showToast('Department blockchain loaded', 'success');
        }
    } catch (error) {
        console.error('Error loading department blockchain:', error);
        showToast('Error loading blockchain', 'error');
    }
});

// Load class blockchain
document.getElementById('loadClassChain').addEventListener('click', async () => {
    const departmentId = document.getElementById('classDeptSelect').value;

    if (!departmentId) {
        showToast('Please select a department', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/blockchain/class/${departmentId}`);
        const result = await response.json();

        if (result.success) {
            displayBlockchain(result.data, 'classChainContainer', 'Class');
            showToast('Class blockchain loaded', 'success');
        } else {
            showToast(result.message || 'Error loading blockchain', 'error');
        }
    } catch (error) {
        console.error('Error loading class blockchain:', error);
        showToast('Error loading blockchain', 'error');
    }
});

// Load student blockchain
document.getElementById('loadStudentChain').addEventListener('click', async () => {
    const studentId = document.getElementById('studentSelect').value;

    if (!studentId) {
        showToast('Please select a student', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${studentId}/blockchain`);
        const result = await response.json();

        if (result.success) {
            displayBlockchain(result.data, 'studentChainContainer', 'Student');
            showToast('Student blockchain loaded', 'success');
        }
    } catch (error) {
        console.error('Error loading student blockchain:', error);
        showToast('Error loading blockchain', 'error');
    }
});

// Display blockchain
function displayBlockchain(blocks, containerId, chainType) {
    const container = document.getElementById(containerId);
    
    if (blocks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No blocks found</p></div>';
        return;
    }

    container.innerHTML = `
        <div style="margin: 1rem 0; padding: 1rem; background-color: var(--light-bg); border-radius: 5px;">
            <strong>Total Blocks:</strong> ${blocks.length} | 
            <strong>Chain Type:</strong> ${chainType}
        </div>
        <div class="block-container">
            ${blocks.map(block => `
                <div class="block">
                    <div class="block-header">
                        <span class="block-title">Block #${block.index}</span>
                        <span class="badge ${block.transactions.type === 'genesis' ? 'badge-warning' : 'badge-success'}">
                            ${block.transactions.type || 'unknown'}
                        </span>
                    </div>
                    <div class="block-info">
                        <div class="block-info-item">
                            <strong>Timestamp</strong>
                            <div>${new Date(block.timestamp).toLocaleString()}</div>
                        </div>
                        <div class="block-info-item">
                            <strong>Action</strong>
                            <div>${block.transactions.action || 'N/A'}</div>
                        </div>
                        <div class="block-info-item">
                            <strong>Nonce</strong>
                            <div>${block.nonce}</div>
                        </div>
                        ${block.transactions.departmentId ? `
                            <div class="block-info-item">
                                <strong>Department ID</strong>
                                <div>${block.transactions.departmentId}</div>
                            </div>
                        ` : ''}
                        ${block.transactions.name ? `
                            <div class="block-info-item">
                                <strong>Name</strong>
                                <div>${block.transactions.name}</div>
                            </div>
                        ` : ''}
                        ${block.transactions.teacher ? `
                            <div class="block-info-item">
                                <strong>Teacher</strong>
                                <div>${block.transactions.teacher}</div>
                            </div>
                        ` : ''}
                        ${block.transactions.rollNumber ? `
                            <div class="block-info-item">
                                <strong>Roll Number</strong>
                                <div>${block.transactions.rollNumber}</div>
                            </div>
                        ` : ''}
                        ${block.transactions.attendanceStatus ? `
                            <div class="block-info-item">
                                <strong>Attendance</strong>
                                <div>
                                    <span class="badge ${
                                        block.transactions.attendanceStatus === 'Present' ? 'badge-success' :
                                        block.transactions.attendanceStatus === 'Absent' ? 'badge-danger' :
                                        'badge-warning'
                                    }">
                                        ${block.transactions.attendanceStatus}
                                    </span>
                                </div>
                            </div>
                            <div class="block-info-item">
                                <strong>Date</strong>
                                <div>${block.transactions.date}</div>
                            </div>
                        ` : ''}
                        ${block.transactions.status ? `
                            <div class="block-info-item">
                                <strong>Status</strong>
                                <div>
                                    <span class="badge ${
                                        block.transactions.status === 'active' ? 'badge-success' :
                                        block.transactions.status === 'deleted' ? 'badge-danger' :
                                        ''
                                    }">
                                        ${block.transactions.status}
                                    </span>
                                </div>
                            </div>
                        ` : ''}
                        <div class="block-info-item" style="grid-column: 1 / -1;">
                            <strong>Hash (PoW: starts with "0000")</strong>
                            <div class="block-hash">${block.hash}</div>
                        </div>
                        <div class="block-info-item" style="grid-column: 1 / -1;">
                            <strong>Previous Hash</strong>
                            <div class="block-hash">${block.prev_hash}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDepartments();
    fetchStudents();
});
