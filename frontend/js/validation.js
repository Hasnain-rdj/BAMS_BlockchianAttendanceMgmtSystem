// API Base URL (from config.js)
const API_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.className = 'toast', 3000);
}

// Run validation
document.getElementById('validateBtn').addEventListener('click', async () => {
    try {
        // Show loading status
        document.getElementById('validationStatus').innerHTML = 
            '<div class="validation-status pending">⏳ Running validation... Please wait.</div>';

        const response = await fetch(`${API_URL}/blockchain/validate`);
        const result = await response.json();

        if (result.success) {
            displayValidationResults(result.data);
            showToast('Validation complete', 'success');
        } else {
            showToast('Error running validation', 'error');
        }
    } catch (error) {
        console.error('Error validating chains:', error);
        showToast('Error running validation', 'error');
    }
});

// Display validation results
function displayValidationResults(validation) {
    const statusContainer = document.getElementById('validationStatus');
    
    if (validation.isValid) {
        statusContainer.innerHTML = 
            '<div class="validation-status valid">✓ All blockchains are valid and intact!</div>';
    } else {
        statusContainer.innerHTML = 
            '<div class="validation-status invalid">✗ Blockchain validation failed! Issues detected.</div>';
    }

    // Overall status
    document.getElementById('overallStatus').innerHTML = `
        <div class="status-info">
            <div class="status-item">
                <span>Overall Validation Status:</span>
                <span class="badge ${validation.isValid ? 'badge-success' : 'badge-danger'}">
                    ${validation.isValid ? 'VALID' : 'INVALID'}
                </span>
            </div>
            <div class="status-item">
                <span>Total Errors:</span>
                <span class="badge ${validation.errors.length > 0 ? 'badge-danger' : 'badge-success'}">
                    ${validation.errors.length}
                </span>
            </div>
        </div>
    `;

    // Department chain validation
    document.getElementById('deptValidation').innerHTML = `
        <div class="status-info">
            <div class="status-item">
                <span>Chain Integrity:</span>
                <span class="badge ${validation.departmentChain.isValid ? 'badge-success' : 'badge-danger'}">
                    ${validation.departmentChain.isValid ? 'VALID' : 'INVALID'}
                </span>
            </div>
            <div class="status-item">
                <span>Message:</span>
                <span>${validation.departmentChain.message}</span>
            </div>
        </div>
    `;

    // Class chains validation
    if (validation.classChains.length === 0) {
        document.getElementById('classValidation').innerHTML = 
            '<div class="empty-state"><p>No class chains to validate</p></div>';
    } else {
        document.getElementById('classValidation').innerHTML = `
            <div class="validation-list">
                ${validation.classChains.map((chain, index) => `
                    <div class="validation-item">
                        <div>
                            <strong>Department ${index + 1}:</strong> ${chain.departmentId}
                        </div>
                        <div>
                            <span class="badge ${chain.isValid ? 'badge-success' : 'badge-danger'}">
                                ${chain.isValid ? 'VALID' : 'INVALID'}
                            </span>
                            ${!chain.chainValid ? '<span class="badge badge-danger">Chain Invalid</span>' : ''}
                            ${!chain.parentRefValid ? '<span class="badge badge-danger">Parent Ref Invalid</span>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Student chains validation
    if (validation.studentChains.length === 0) {
        document.getElementById('studentValidation').innerHTML = 
            '<div class="empty-state"><p>No student chains to validate</p></div>';
    } else {
        // Show only first 10 for performance, with summary
        const displayChains = validation.studentChains.slice(0, 10);
        const validCount = validation.studentChains.filter(c => c.isValid).length;
        const invalidCount = validation.studentChains.length - validCount;

        document.getElementById('studentValidation').innerHTML = `
            <div class="info-grid" style="margin-bottom: 1rem;">
                <div class="info-item">
                    <strong>Total Student Chains:</strong>
                    <p>${validation.studentChains.length}</p>
                </div>
                <div class="info-item">
                    <strong>Valid Chains:</strong>
                    <p style="color: var(--success-color);">${validCount}</p>
                </div>
                <div class="info-item">
                    <strong>Invalid Chains:</strong>
                    <p style="color: var(--danger-color);">${invalidCount}</p>
                </div>
            </div>
            <div class="validation-list">
                ${displayChains.map(chain => `
                    <div class="validation-item">
                        <div>
                            <strong>Student:</strong> ${chain.studentId}
                        </div>
                        <div>
                            <span class="badge ${chain.isValid ? 'badge-success' : 'badge-danger'}">
                                ${chain.isValid ? 'VALID' : 'INVALID'}
                            </span>
                            ${!chain.chainValid ? '<span class="badge badge-danger">Chain Invalid</span>' : ''}
                            ${!chain.parentRefValid ? '<span class="badge badge-danger">Parent Ref Invalid</span>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ${validation.studentChains.length > 10 ? `
                <p style="margin-top: 1rem; color: var(--text-secondary);">
                    Showing first 10 of ${validation.studentChains.length} student chains
                </p>
            ` : ''}
        `;
    }

    // Validation errors
    if (validation.errors.length === 0) {
        document.getElementById('validationErrors').innerHTML = 
            '<div class="empty-state"><p style="color: var(--success-color);">✓ No errors detected!</p></div>';
        document.getElementById('errorsCard').style.display = 'none';
    } else {
        document.getElementById('errorsCard').style.display = 'block';
        document.getElementById('validationErrors').innerHTML = `
            <div class="validation-list">
                ${validation.errors.map(error => `
                    <div class="validation-item">
                        <div>⚠️ ${error}</div>
                        <div><span class="badge badge-danger">ERROR</span></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Show all cards
    document.getElementById('overallCard').style.display = 'block';
    document.getElementById('deptCard').style.display = 'block';
    document.getElementById('classCard').style.display = 'block';
    document.getElementById('studentCard').style.display = 'block';
}

// Hide cards initially
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('overallCard').style.display = 'none';
    document.getElementById('deptCard').style.display = 'none';
    document.getElementById('classCard').style.display = 'none';
    document.getElementById('studentCard').style.display = 'none';
    document.getElementById('errorsCard').style.display = 'none';

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});
