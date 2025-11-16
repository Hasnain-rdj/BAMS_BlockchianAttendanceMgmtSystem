const Blockchain = require('./Blockchain');

/**
 * Department Blockchain (Top Level)
 * Independent chain for department management
 */
class DepartmentChain extends Blockchain {
    constructor() {
        super('department', null);
        this.departments = new Map(); // departmentId -> latest block index
    }

    /**
     * Add a new department
     * @param {object} departmentData
     * @returns {Block}
     */
    addDepartment(departmentData) {
        const blockData = {
            action: 'add',
            type: 'department',
            departmentId: departmentData.id,
            name: departmentData.name,
            head: departmentData.head,
            status: 'active',
            timestamp: new Date().toISOString()
        };

        const block = this.addBlock(blockData);
        this.departments.set(departmentData.id, block.index);
        return block;
    }

    /**
     * Update department (append new block)
     * @param {string} departmentId
     * @param {object} updates
     * @returns {Block}
     */
    updateDepartment(departmentId, updates) {
        const blockData = {
            action: 'update',
            type: 'department',
            departmentId: departmentId,
            updates: updates,
            status: 'active',
            timestamp: new Date().toISOString()
        };

        const block = this.addBlock(blockData);
        this.departments.set(departmentId, block.index);
        return block;
    }

    /**
     * Delete department (append deletion block)
     * @param {string} departmentId
     * @returns {Block}
     */
    deleteDepartment(departmentId) {
        const blockData = {
            action: 'delete',
            type: 'department',
            departmentId: departmentId,
            status: 'deleted',
            timestamp: new Date().toISOString()
        };

        const block = this.addBlock(blockData);
        this.departments.set(departmentId, block.index);
        return block;
    }

    /**
     * Get department current state by traversing blocks
     * @param {string} departmentId
     * @returns {object|null}
     */
    getDepartment(departmentId) {
        let departmentState = null;

        // Traverse all blocks to build current state
        for (let block of this.chain) {
            if (block.transactions.departmentId === departmentId) {
                if (block.transactions.action === 'add') {
                    departmentState = {
                        id: block.transactions.departmentId,
                        name: block.transactions.name,
                        head: block.transactions.head,
                        status: block.transactions.status
                    };
                } else if (block.transactions.action === 'update') {
                    if (departmentState) {
                        departmentState = { ...departmentState, ...block.transactions.updates };
                    }
                } else if (block.transactions.action === 'delete') {
                    if (departmentState) {
                        departmentState.status = 'deleted';
                    }
                }
            }
        }

        return departmentState;
    }

    /**
     * Get all active departments
     * @returns {Array}
     */
    getAllDepartments() {
        const departments = [];
        const processedIds = new Set();

        // Traverse blocks in reverse to get latest state faster
        for (let i = this.chain.length - 1; i >= 0; i--) {
            const block = this.chain[i];
            if (block.transactions.type === 'department' && 
                block.transactions.departmentId && 
                !processedIds.has(block.transactions.departmentId)) {
                
                const dept = this.getDepartment(block.transactions.departmentId);
                if (dept && dept.status === 'active') {
                    departments.push(dept);
                }
                processedIds.add(block.transactions.departmentId);
            }
        }

        return departments;
    }

    /**
     * Check if department exists and is active
     * @param {string} departmentId
     * @returns {boolean}
     */
    departmentExists(departmentId) {
        const dept = this.getDepartment(departmentId);
        return dept !== null && dept.status === 'active';
    }
}

module.exports = DepartmentChain;
