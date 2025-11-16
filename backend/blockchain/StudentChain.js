const Blockchain = require('./Blockchain');

/**
 * Student Blockchain (Child of Class Chain)
 * Each student has their own blockchain
 * Genesis block uses parent class's latest hash
 * Attendance records are appended as blocks
 */
class StudentChain extends Blockchain {
    constructor(studentId, classId, departmentId, parentClassHash) {
        super(`student-${studentId}`, parentClassHash);
        this.studentId = studentId;
        this.classId = classId;
        this.departmentId = departmentId;
    }

    /**
     * Override genesis block to include student info and parent references
     */
    createGenesisBlock() {
        const genesisData = {
            type: 'genesis',
            chainType: this.chainType,
            studentId: this.studentId,
            classId: this.classId,
            departmentId: this.departmentId,
            parentClassHash: this.parentHash,
            message: `Genesis block for student ${this.studentId}`,
            createdAt: new Date().toISOString()
        };
        
        const Block = require('./Block');
        const genesisBlock = new Block(0, Date.now(), genesisData, this.parentHash || '0');
        genesisBlock.mineBlock(this.difficulty);
        this.chain.push(genesisBlock);
    }

    /**
     * Add student profile (first block after genesis)
     * @param {object} studentData
     * @returns {Block}
     */
    addStudentProfile(studentData) {
        const blockData = {
            action: 'add',
            type: 'student',
            studentId: this.studentId,
            classId: this.classId,
            departmentId: this.departmentId,
            name: studentData.name,
            rollNumber: studentData.rollNumber,
            email: studentData.email,
            status: 'active',
            timestamp: new Date().toISOString()
        };

        return this.addBlock(blockData);
    }

    /**
     * Update student profile (append new block)
     * @param {object} updates
     * @returns {Block}
     */
    updateStudentProfile(updates) {
        const blockData = {
            action: 'update',
            type: 'student',
            studentId: this.studentId,
            classId: this.classId,
            departmentId: this.departmentId,
            updates: updates,
            status: 'active',
            timestamp: new Date().toISOString()
        };

        return this.addBlock(blockData);
    }

    /**
     * Delete student (append deletion block)
     * @returns {Block}
     */
    deleteStudentProfile() {
        const blockData = {
            action: 'delete',
            type: 'student',
            studentId: this.studentId,
            classId: this.classId,
            departmentId: this.departmentId,
            status: 'deleted',
            timestamp: new Date().toISOString()
        };

        return this.addBlock(blockData);
    }

    /**
     * Mark attendance (append attendance block)
     * @param {string} status - 'Present' | 'Absent' | 'Leave'
     * @returns {Block}
     */
    markAttendance(status) {
        const blockData = {
            action: 'attendance',
            type: 'attendance',
            studentId: this.studentId,
            classId: this.classId,
            departmentId: this.departmentId,
            attendanceStatus: status,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        return this.addBlock(blockData);
    }

    /**
     * Get student current profile
     * @returns {object|null}
     */
    getStudentProfile() {
        let studentState = null;

        for (let block of this.chain) {
            if (block.transactions.type === 'student') {
                if (block.transactions.action === 'add') {
                    studentState = {
                        studentId: block.transactions.studentId,
                        classId: block.transactions.classId,
                        departmentId: block.transactions.departmentId,
                        name: block.transactions.name,
                        rollNumber: block.transactions.rollNumber,
                        email: block.transactions.email,
                        status: block.transactions.status
                    };
                } else if (block.transactions.action === 'update') {
                    if (studentState) {
                        studentState = { ...studentState, ...block.transactions.updates };
                    }
                } else if (block.transactions.action === 'delete') {
                    if (studentState) {
                        studentState.status = 'deleted';
                    }
                }
            }
        }

        return studentState;
    }

    /**
     * Get all attendance records
     * @returns {Array}
     */
    getAllAttendance() {
        const attendanceRecords = [];

        for (let block of this.chain) {
            if (block.transactions.type === 'attendance') {
                attendanceRecords.push({
                    blockIndex: block.index,
                    studentId: block.transactions.studentId,
                    classId: block.transactions.classId,
                    departmentId: block.transactions.departmentId,
                    status: block.transactions.attendanceStatus,
                    date: block.transactions.date,
                    timestamp: block.transactions.timestamp,
                    hash: block.hash
                });
            }
        }

        return attendanceRecords;
    }

    /**
     * Get attendance by date
     * @param {string} date - YYYY-MM-DD format
     * @returns {object|null}
     */
    getAttendanceByDate(date) {
        // Traverse from latest block backwards
        for (let i = this.chain.length - 1; i >= 0; i--) {
            const block = this.chain[i];
            if (block.transactions.type === 'attendance' && 
                block.transactions.date === date) {
                return {
                    blockIndex: block.index,
                    studentId: block.transactions.studentId,
                    classId: block.transactions.classId,
                    departmentId: block.transactions.departmentId,
                    status: block.transactions.attendanceStatus,
                    date: block.transactions.date,
                    timestamp: block.transactions.timestamp,
                    hash: block.hash
                };
            }
        }

        return null;
    }

    /**
     * Get attendance summary
     * @returns {object}
     */
    getAttendanceSummary() {
        const summary = {
            totalDays: 0,
            present: 0,
            absent: 0,
            leave: 0,
            percentage: 0
        };

        for (let block of this.chain) {
            if (block.transactions.type === 'attendance') {
                summary.totalDays++;
                const status = block.transactions.attendanceStatus.toLowerCase();
                if (status === 'present') summary.present++;
                else if (status === 'absent') summary.absent++;
                else if (status === 'leave') summary.leave++;
            }
        }

        if (summary.totalDays > 0) {
            summary.percentage = ((summary.present / summary.totalDays) * 100).toFixed(2);
        }

        return summary;
    }

    /**
     * Validate parent class reference
     * @param {string} expectedParentHash
     * @returns {boolean}
     */
    validateParentReference(expectedParentHash) {
        if (this.chain.length === 0) return false;
        return this.chain[0].prev_hash === expectedParentHash;
    }

    /**
     * Check if student is active
     * @returns {boolean}
     */
    isActive() {
        const profile = this.getStudentProfile();
        return profile !== null && profile.status === 'active';
    }
}

module.exports = StudentChain;
