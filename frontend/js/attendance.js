// API Base URL (from config.js)
const API_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';

let allClasses = [];
let allStudents = [];
let attendanceData = {};

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.className = 'toast', 3000);
}

// Set current date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
document.getElementById('viewAttendanceDate').valueAsDate = new Date();

// Fetch classes
async function fetchClasses() {
    try {
        const response = await fetch(`${API_URL}/classes`);
        const result = await response.json();
        
        if (result.success) {
            allClasses = result.data;
            populateClassSelects();
        }
    } catch (error) {
        console.error('Error fetching classes:', error);
    }
}

// Populate class dropdowns
function populateClassSelects() {
    const markSelect = document.getElementById('attendanceClass');
    const viewSelect = document.getElementById('viewAttendanceClass');

    const options = allClasses.map(cls => 
        `<option value="${cls.id}">${cls.name}</option>`
    ).join('');

    markSelect.innerHTML = '<option value="">-- Select Class --</option>' + options;
    viewSelect.innerHTML = '<option value="">-- Select Class --</option>' + options;
}

// Fetch students
async function fetchAllStudents() {
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

// Populate student select for blockchain viewer
function populateStudentSelect() {
    const select = document.getElementById('blockchainStudent');
    select.innerHTML = '<option value="">-- Select Student --</option>' +
        allStudents.map(s => `<option value="${s.studentId}">${s.name} (${s.rollNumber})</option>`).join('');
}

// Load students for attendance marking
document.getElementById('attendanceClass').addEventListener('change', async (e) => {
    const classId = e.target.value;
    
    if (!classId) {
        document.getElementById('attendanceForm').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/attendance/class/${classId}/today`);
        const result = await response.json();

        if (result.success) {
            displayAttendanceForm(result.data);
            document.getElementById('attendanceForm').style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        showToast('Error loading students', 'error');
    }
});

// Display attendance form
function displayAttendanceForm(students) {
    const container = document.getElementById('studentAttendanceList');
    attendanceData = {};

    container.innerHTML = '<div class="attendance-grid">' + students.map(item => {
        const student = item.student;
        const currentStatus = item.attendance.status === 'Not Marked' ? '' : item.attendance.status;
        
        // Initialize attendance data
        if (currentStatus) {
            attendanceData[student.studentId] = currentStatus;
        }

        return `
            <div class="attendance-item">
                <div class="attendance-student">
                    <h4>${student.name}</h4>
                    <p>Roll: ${student.rollNumber}</p>
                </div>
                <div class="attendance-status">
                    <button class="status-btn present ${currentStatus === 'Present' ? 'active' : ''}" 
                            onclick="markStatus('${student.studentId}', 'Present', this)">
                        Present
                    </button>
                    <button class="status-btn absent ${currentStatus === 'Absent' ? 'active' : ''}" 
                            onclick="markStatus('${student.studentId}', 'Absent', this)">
                        Absent
                    </button>
                    <button class="status-btn leave ${currentStatus === 'Leave' ? 'active' : ''}" 
                            onclick="markStatus('${student.studentId}', 'Leave', this)">
                        Leave
                    </button>
                </div>
            </div>
        `;
    }).join('') + '</div>';
}

// Mark status
function markStatus(studentId, status, button) {
    // Update attendance data
    attendanceData[studentId] = status;

    // Update UI
    const parent = button.parentElement;
    const buttons = parent.querySelectorAll('.status-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Submit attendance
document.getElementById('submitAttendance').addEventListener('click', async () => {
    const attendanceArray = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status
    }));

    if (attendanceArray.length === 0) {
        showToast('Please mark attendance for at least one student', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/attendance/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attendanceData: attendanceArray })
        });

        const result = await response.json();

        if (result.success) {
            showToast(`Attendance submitted! ${result.data.successCount} successful, ${result.data.failCount} failed`, 'success');
            
            // Reload the form
            const classSelect = document.getElementById('attendanceClass');
            classSelect.dispatchEvent(new Event('change'));
        } else {
            showToast(result.message || 'Error submitting attendance', 'error');
        }
    } catch (error) {
        console.error('Error submitting attendance:', error);
        showToast('Error submitting attendance', 'error');
    }
});

// View attendance
document.getElementById('viewAttendanceBtn').addEventListener('click', async () => {
    const classId = document.getElementById('viewAttendanceClass').value;
    const date = document.getElementById('viewAttendanceDate').value;

    if (!classId) {
        showToast('Please select a class', 'warning');
        return;
    }

    if (!date) {
        showToast('Please select a date', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/attendance/class/${classId}?date=${date}`);
        const result = await response.json();

        if (result.success) {
            displayAttendanceReport(result.data, date);
        }
    } catch (error) {
        console.error('Error fetching attendance:', error);
        showToast('Error loading attendance', 'error');
    }
});

// Display attendance report
function displayAttendanceReport(data, date) {
    const container = document.getElementById('attendanceReport');
    
    if (data.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No students found</p></div>';
        return;
    }

    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let notMarkedCount = 0;

    data.forEach(item => {
        const status = item.attendance.status.toLowerCase();
        if (status === 'present') presentCount++;
        else if (status === 'absent') absentCount++;
        else if (status === 'leave') leaveCount++;
        else notMarkedCount++;
    });

    container.innerHTML = `
        <div class="info-grid" style="margin-top: 1rem;">
            <div class="info-item">
                <strong>Date:</strong>
                <p>${new Date(date).toLocaleDateString()}</p>
            </div>
            <div class="info-item">
                <strong>Total Students:</strong>
                <p>${data.length}</p>
            </div>
            <div class="info-item">
                <strong>Present:</strong>
                <p style="color: var(--success-color);">${presentCount}</p>
            </div>
            <div class="info-item">
                <strong>Absent:</strong>
                <p style="color: var(--danger-color);">${absentCount}</p>
            </div>
            <div class="info-item">
                <strong>Leave:</strong>
                <p style="color: var(--warning-color);">${leaveCount}</p>
            </div>
            <div class="info-item">
                <strong>Not Marked:</strong>
                <p>${notMarkedCount}</p>
            </div>
        </div>
        <div class="table-container" style="margin-top: 1rem;">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            <td>${item.student.name}</td>
                            <td>${item.student.rollNumber}</td>
                            <td>
                                <span class="badge ${
                                    item.attendance.status === 'Present' ? 'badge-success' :
                                    item.attendance.status === 'Absent' ? 'badge-danger' :
                                    item.attendance.status === 'Leave' ? 'badge-warning' : ''
                                }">
                                    ${item.attendance.status}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// View student blockchain
document.getElementById('viewBlockchainBtn').addEventListener('click', async () => {
    const studentId = document.getElementById('blockchainStudent').value;

    if (!studentId) {
        showToast('Please select a student', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${studentId}/blockchain`);
        const result = await response.json();

        if (result.success) {
            displayStudentBlockchain(result.data);
        }
    } catch (error) {
        console.error('Error fetching blockchain:', error);
        showToast('Error loading blockchain', 'error');
    }
});

// Display student blockchain
function displayStudentBlockchain(blocks) {
    const container = document.getElementById('studentBlockchain');
    
    if (blocks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No blocks found</p></div>';
        return;
    }

    container.innerHTML = '<div class="block-container">' + blocks.map(block => `
        <div class="block">
            <div class="block-header">
                <span class="block-title">Block #${block.index}</span>
                <span class="badge ${block.transactions.type === 'attendance' ? 'badge-success' : ''}">
                    ${block.transactions.type || 'genesis'}
                </span>
            </div>
            <div class="block-info">
                <div class="block-info-item">
                    <strong>Timestamp</strong>
                    <div>${new Date(block.timestamp).toLocaleString()}</div>
                </div>
                <div class="block-info-item">
                    <strong>Type</strong>
                    <div>${block.transactions.action || block.transactions.type}</div>
                </div>
                ${block.transactions.attendanceStatus ? `
                    <div class="block-info-item">
                        <strong>Status</strong>
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
                <div class="block-info-item">
                    <strong>Nonce</strong>
                    <div>${block.nonce}</div>
                </div>
                <div class="block-info-item" style="grid-column: 1 / -1;">
                    <strong>Hash</strong>
                    <div class="block-hash">${block.hash}</div>
                </div>
                <div class="block-info-item" style="grid-column: 1 / -1;">
                    <strong>Previous Hash</strong>
                    <div class="block-hash">${block.prev_hash}</div>
                </div>
            </div>
        </div>
    `).join('') + '</div>';
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchClasses();
    fetchAllStudents();

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});
