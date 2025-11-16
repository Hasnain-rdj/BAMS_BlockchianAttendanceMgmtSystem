const Blockchain = require('./Blockchain');

/**
 * Class Blockchain (Child of Department Chain)
 * Each class has its own blockchain
 * Genesis block uses parent department's latest hash
 */
class ClassChain extends Blockchain {
    constructor(departmentId, parentDepartmentHash) {
        super(`class-${departmentId}`, parentDepartmentHash);
        this.departmentId = departmentId;
        this.classes = new Map(); // classId -> latest block index
    }

    /**
     * Override genesis block to include department reference
     */
    createGenesisBlock() {
        const genesisData = {
            type: 'genesis',
            chainType: this.chainType,
            departmentId: this.departmentId,
            parentDepartmentHash: this.parentHash,
            message: `Genesis block for class chain under department ${this.departmentId}`,
            createdAt: new Date().toISOString()
        };
        
        const Block = require('./Block');
        const genesisBlock = new Block(0, Date.now(), genesisData, this.parentHash || '0');
        genesisBlock.mineBlock(this.difficulty);
        this.chain.push(genesisBlock);
    }

    /**
     * Add a new class
     * @param {object} classData
     * @returns {Block}
     */
    addClass(classData) {
        const blockData = {
            action: 'add',
            type: 'class',
            classId: classData.id,
            departmentId: this.departmentId,
            name: classData.name,
            teacher: classData.teacher,
            capacity: classData.capacity,
            status: 'active',
            timestamp: new Date().toISOString()
        };

        const block = this.addBlock(blockData);
        this.classes.set(classData.id, block.index);
        return block;
    }

    /**
     * Update class (append new block)
     * @param {string} classId
     * @param {object} updates
     * @returns {Block}
     */
    updateClass(classId, updates) {
        const blockData = {
            action: 'update',
            type: 'class',
            classId: classId,
            departmentId: this.departmentId,
            updates: updates,
            status: 'active',
            timestamp: new Date().toISOString()
        };

        const block = this.addBlock(blockData);
        this.classes.set(classId, block.index);
        return block;
    }

    /**
     * Delete class (append deletion block)
     * @param {string} classId
     * @returns {Block}
     */
    deleteClass(classId) {
        const blockData = {
            action: 'delete',
            type: 'class',
            classId: classId,
            departmentId: this.departmentId,
            status: 'deleted',
            timestamp: new Date().toISOString()
        };

        const block = this.addBlock(blockData);
        this.classes.set(classId, block.index);
        return block;
    }

    /**
     * Get class current state
     * @param {string} classId
     * @returns {object|null}
     */
    getClass(classId) {
        let classState = null;

        for (let block of this.chain) {
            if (block.transactions.classId === classId) {
                if (block.transactions.action === 'add') {
                    classState = {
                        id: block.transactions.classId,
                        departmentId: block.transactions.departmentId,
                        name: block.transactions.name,
                        teacher: block.transactions.teacher,
                        capacity: block.transactions.capacity,
                        status: block.transactions.status
                    };
                } else if (block.transactions.action === 'update') {
                    if (classState) {
                        classState = { ...classState, ...block.transactions.updates };
                    }
                } else if (block.transactions.action === 'delete') {
                    if (classState) {
                        classState.status = 'deleted';
                    }
                }
            }
        }

        return classState;
    }

    /**
     * Get all active classes in this department
     * @returns {Array}
     */
    getAllClasses() {
        const classes = [];
        const processedIds = new Set();

        for (let i = this.chain.length - 1; i >= 0; i--) {
            const block = this.chain[i];
            if (block.transactions.type === 'class' && 
                block.transactions.classId && 
                !processedIds.has(block.transactions.classId)) {
                
                const cls = this.getClass(block.transactions.classId);
                if (cls && cls.status === 'active') {
                    classes.push(cls);
                }
                processedIds.add(block.transactions.classId);
            }
        }

        return classes;
    }

    /**
     * Check if class exists and is active
     * @param {string} classId
     * @returns {boolean}
     */
    classExists(classId) {
        const cls = this.getClass(classId);
        return cls !== null && cls.status === 'active';
    }

    /**
     * Validate that genesis block references parent department
     * @param {string} expectedParentHash
     * @returns {boolean}
     */
    validateParentReference(expectedParentHash) {
        if (this.chain.length === 0) return false;
        return this.chain[0].prev_hash === expectedParentHash;
    }
}

module.exports = ClassChain;
