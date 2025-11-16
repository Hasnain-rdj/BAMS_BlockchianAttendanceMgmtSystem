// API Base URL (from config.js)
const API_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Fetch system stats
async function fetchSystemStats() {
    try {
        const response = await fetch(`${API_URL}/blockchain/stats`);
        const result = await response.json();

        if (result.success) {
            const stats = result.data;
            
            document.getElementById('totalDepartments').textContent = stats.departments;
            document.getElementById('totalClasses').textContent = stats.classes;
            document.getElementById('totalStudents').textContent = stats.students;
            document.getElementById('totalBlocks').textContent = stats.totalBlocks;
            document.getElementById('deptBlocks').textContent = stats.departmentBlocks;

            const validityBadge = document.getElementById('chainValidity');
            if (stats.isValid) {
                validityBadge.textContent = '✓ Valid';
                validityBadge.className = 'badge badge-success';
            } else {
                validityBadge.textContent = '✗ Invalid';
                validityBadge.className = 'badge badge-danger';
            }
        }
    } catch (error) {
        console.error('Error fetching system stats:', error);
    }
}

// Load stats on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchSystemStats();
});
