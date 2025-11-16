// API Base URL (from config.js)
const API_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000/api';

let allDepartments = [];
let allStudents = [];
let currentView = 'tree'; // 'tree' or 'list'

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.className = 'toast', 3000);
}

// Toggle view
function setView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active-view'));
    event.target.classList.add('active-view');
    
    // Reload current blockchain if displayed
    const containers = ['deptChainContainer', 'classChainContainer', 'studentChainContainer'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container.innerHTML && !container.innerHTML.includes('empty-state')) {
            // Trigger reload based on which container has content
            if (id === 'deptChainContainer' && container.children.length > 0) {
                document.getElementById('loadDeptChain').click();
            }
        }
    });
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
            if (currentView === 'tree') {
                displayBlockchainTree(result.data, 'deptChainContainer', 'Department');
            } else {
                displayBlockchainList(result.data, 'deptChainContainer', 'Department');
            }
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
            if (currentView === 'tree') {
                displayBlockchainTree(result.data, 'classChainContainer', 'Class');
            } else {
                displayBlockchainList(result.data, 'classChainContainer', 'Class');
            }
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
            if (currentView === 'tree') {
                displayBlockchainTree(result.data, 'studentChainContainer', 'Student');
            } else {
                displayBlockchainList(result.data, 'studentChainContainer', 'Student');
            }
            showToast('Student blockchain loaded', 'success');
        }
    } catch (error) {
        console.error('Error loading student blockchain:', error);
        showToast('Error loading blockchain', 'error');
    }
});

// Display blockchain as 3D tree
function displayBlockchainTree(blocks, containerId, chainType) {
    const container = document.getElementById(containerId);
    
    if (blocks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No blocks found</p></div>';
        return;
    }

    // Create legend
    const legend = `
        <div class="tree-legend">
            <div class="legend-item">
                <div class="legend-box" style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); border: 2px solid #ff9800;"></div>
                <span>Genesis Block</span>
            </div>
            <div class="legend-item">
                <div class="legend-box" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%);"></div>
                <span>Active Block</span>
            </div>
            <div class="legend-item">
                <div class="legend-box" style="background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);"></div>
                <span>Deleted Block</span>
            </div>
            <div class="legend-item">
                <div class="legend-box" style="background: white; border: 1px solid #ccc;"></div>
                <span>Regular Block</span>
            </div>
        </div>
    `;

    // Create tree structure
    const treeHTML = `
        <div style="margin: 1rem 0; padding: 1rem; background-color: rgba(255,255,255,0.9); border-radius: 8px; text-align: center;">
            <strong>Total Blocks:</strong> ${blocks.length} | 
            <strong>Chain Type:</strong> ${chainType} |
            <strong>View:</strong> Tree Visualization
        </div>
        ${legend}
        <div class="tree-container">
            <div class="tree-wrapper">
                ${blocks.map((block, index) => {
                    const isGenesis = block.transactions.type === 'genesis';
                    const isDeleted = block.transactions.status === 'deleted';
                    const isActive = block.transactions.status === 'active';
                    
                    let nodeClass = 'tree-node';
                    if (isGenesis) nodeClass += ' genesis';
                    else if (isDeleted) nodeClass += ' deleted';
                    else if (isActive) nodeClass += ' active';

                    return `
                        <div class="tree-level">
                            <div class="${nodeClass}" 
                                 data-block-index="${index}"
                                 onmouseenter="showNodeTooltip(event, ${index}, \`${JSON.stringify(block).replace(/`/g, '\\`')}\`)"
                                 onmouseleave="hideNodeTooltip()">
                                <div class="node-index">Block #${block.index}</div>
                                <div class="node-type">${block.transactions.name || block.transactions.type || 'Block'}</div>
                                <div class="node-hash">${block.hash.substring(0, 12)}...</div>
                                ${index < blocks.length - 1 ? '<div class="node-connector vertical" style="height: 2rem; top: 100%;"></div>' : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    container.innerHTML = treeHTML;
}

// Show tooltip on node hover
function showNodeTooltip(event, blockIndex, blockDataStr) {
    const tooltip = document.getElementById('nodeTooltip');
    const block = JSON.parse(blockDataStr);
    
    let tooltipContent = `
        <div class="tooltip-header">Block #${block.index} Details</div>
        <div class="tooltip-item">
            <span class="tooltip-label">Type:</span>
            <span class="tooltip-value">${block.transactions.type || 'N/A'}</span>
        </div>
        <div class="tooltip-item">
            <span class="tooltip-label">Timestamp:</span>
            <span class="tooltip-value">${new Date(block.timestamp).toLocaleString()}</span>
        </div>
        <div class="tooltip-item">
            <span class="tooltip-label">Action:</span>
            <span class="tooltip-value">${block.transactions.action || 'N/A'}</span>
        </div>
        <div class="tooltip-item">
            <span class="tooltip-label">Nonce:</span>
            <span class="tooltip-value">${block.nonce}</span>
        </div>
    `;

    // Add specific fields based on transaction data
    if (block.transactions.name) {
        tooltipContent += `
            <div class="tooltip-item">
                <span class="tooltip-label">Name:</span>
                <span class="tooltip-value">${block.transactions.name}</span>
            </div>
        `;
    }

    if (block.transactions.departmentId) {
        tooltipContent += `
            <div class="tooltip-item">
                <span class="tooltip-label">Department:</span>
                <span class="tooltip-value">${block.transactions.departmentId}</span>
            </div>
        `;
    }

    if (block.transactions.rollNumber) {
        tooltipContent += `
            <div class="tooltip-item">
                <span class="tooltip-label">Roll Number:</span>
                <span class="tooltip-value">${block.transactions.rollNumber}</span>
            </div>
        `;
    }

    if (block.transactions.attendanceStatus) {
        tooltipContent += `
            <div class="tooltip-item">
                <span class="tooltip-label">Attendance:</span>
                <span class="tooltip-value">${block.transactions.attendanceStatus}</span>
            </div>
            <div class="tooltip-item">
                <span class="tooltip-label">Date:</span>
                <span class="tooltip-value">${block.transactions.date}</span>
            </div>
        `;
    }

    if (block.transactions.status) {
        tooltipContent += `
            <div class="tooltip-item">
                <span class="tooltip-label">Status:</span>
                <span class="tooltip-value">${block.transactions.status}</span>
            </div>
        `;
    }

    tooltipContent += `
        <div class="tooltip-item" style="grid-template-columns: 1fr;">
            <span class="tooltip-label">Hash (PoW):</span>
            <span class="tooltip-value" style="font-size: 0.7rem; word-break: break-all;">${block.hash}</span>
        </div>
        <div class="tooltip-item" style="grid-template-columns: 1fr;">
            <span class="tooltip-label">Previous Hash:</span>
            <span class="tooltip-value" style="font-size: 0.7rem; word-break: break-all;">${block.prev_hash}</span>
        </div>
    `;

    tooltip.innerHTML = tooltipContent;
    
    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    
    let left = rect.right + 10;
    let top = rect.top;

    // Adjust if tooltip goes off screen
    if (left + 400 > window.innerWidth) {
        left = rect.left - 410;
    }
    
    if (top + 400 > window.innerHeight) {
        top = window.innerHeight - 410;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + window.scrollY + 'px';
    tooltip.classList.add('show');
}

// Hide tooltip
function hideNodeTooltip() {
    const tooltip = document.getElementById('nodeTooltip');
    tooltip.classList.remove('show');
}

// Display blockchain as list (original view)
function displayBlockchainList(blocks, containerId, chainType) {
    const container = document.getElementById(containerId);
    
    if (blocks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No blocks found</p></div>';
        return;
    }

    container.innerHTML = `
        <div style="margin: 1rem 0; padding: 1rem; background-color: var(--light-bg); border-radius: 5px;">
            <strong>Total Blocks:</strong> ${blocks.length} | 
            <strong>Chain Type:</strong> ${chainType} |
            <strong>View:</strong> List
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

// Mobile navigation toggle
// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDepartments();
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
