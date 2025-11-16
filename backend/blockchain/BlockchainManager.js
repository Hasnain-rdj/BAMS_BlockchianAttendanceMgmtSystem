const DepartmentChain = require('./DepartmentChain');
const ClassChain = require('./ClassChain');
const StudentChain = require('./StudentChain');

/**
 * BlockchainManager - Central manager for all blockchain layers
 * Manages department, class, and student blockchains
 * Handles validation across all layers
 */
class BlockchainManager {
    constructor() {
        this.departmentChain = new DepartmentChain();
        this.classChains = new Map(); // departmentId -> ClassChain
        this.studentChains = new Map(); // studentId -> StudentChain
    }

    // ==================== DEPARTMENT OPERATIONS ====================

    /**
     * Add department
     */
    addDepartment(departmentData) {
        return this.departmentChain.addDepartment(departmentData);
    }

    /**
     * Update department
     */
    updateDepartment(departmentId, updates) {
        return this.departmentChain.updateDepartment(departmentId, updates);
    }

    /**
     * Delete department
     */
    deleteDepartment(departmentId) {
        return this.departmentChain.deleteDepartment(departmentId);
    }

    /**
     * Get department
     */
    getDepartment(departmentId) {
        return this.departmentChain.getDepartment(departmentId);
    }

    /**
     * Get all departments
     */
    getAllDepartments() {
        return this.departmentChain.getAllDepartments();
    }

    // ==================== CLASS OPERATIONS ====================

    /**
     * Add class to a department
     */
    addClass(departmentId, classData) {
        // Ensure department exists
        if (!this.departmentChain.departmentExists(departmentId)) {
            throw new Error('Department does not exist');
        }

        // Get or create class chain for this department
        if (!this.classChains.has(departmentId)) {
            const parentHash = this.departmentChain.getLatestBlock().hash;
            this.classChains.set(departmentId, new ClassChain(departmentId, parentHash));
        }

        const classChain = this.classChains.get(departmentId);
        return classChain.addClass(classData);
    }

    /**
     * Update class
     */
    updateClass(departmentId, classId, updates) {
        const classChain = this.classChains.get(departmentId);
        if (!classChain) {
            throw new Error('Class chain not found for department');
        }
        return classChain.updateClass(classId, updates);
    }

    /**
     * Delete class
     */
    deleteClass(departmentId, classId) {
        const classChain = this.classChains.get(departmentId);
        if (!classChain) {
            throw new Error('Class chain not found for department');
        }
        return classChain.deleteClass(classId);
    }

    /**
     * Get class
     */
    getClass(departmentId, classId) {
        const classChain = this.classChains.get(departmentId);
        if (!classChain) return null;
        return classChain.getClass(classId);
    }

    /**
     * Get all classes for a department
     */
    getClassesByDepartment(departmentId) {
        const classChain = this.classChains.get(departmentId);
        if (!classChain) return [];
        return classChain.getAllClasses();
    }

    /**
     * Get all classes (all departments)
     */
    getAllClasses() {
        const allClasses = [];
        for (let [departmentId, classChain] of this.classChains) {
            const classes = classChain.getAllClasses();
            allClasses.push(...classes);
        }
        return allClasses;
    }

    // ==================== STUDENT OPERATIONS ====================

    /**
     * Add student to a class
     */
    addStudent(departmentId, classId, studentData) {
        // Validate department and class
        if (!this.departmentChain.departmentExists(departmentId)) {
            throw new Error('Department does not exist');
        }

        const classChain = this.classChains.get(departmentId);
        if (!classChain || !classChain.classExists(classId)) {
            throw new Error('Class does not exist');
        }

        // Create student chain
        const parentHash = classChain.getLatestBlock().hash;
        const studentChain = new StudentChain(
            studentData.id,
            classId,
            departmentId,
            parentHash
        );

        // Add student profile
        studentChain.addStudentProfile(studentData);
        this.studentChains.set(studentData.id, studentChain);

        return studentChain.getLatestBlock();
    }

    /**
     * Update student
     */
    updateStudent(studentId, updates) {
        const studentChain = this.studentChains.get(studentId);
        if (!studentChain) {
            throw new Error('Student not found');
        }
        return studentChain.updateStudentProfile(updates);
    }

    /**
     * Delete student
     */
    deleteStudent(studentId) {
        const studentChain = this.studentChains.get(studentId);
        if (!studentChain) {
            throw new Error('Student not found');
        }
        return studentChain.deleteStudentProfile();
    }

    /**
     * Get student
     */
    getStudent(studentId) {
        const studentChain = this.studentChains.get(studentId);
        if (!studentChain) return null;
        return studentChain.getStudentProfile();
    }

    /**
     * Get all students
     */
    getAllStudents() {
        const students = [];
        for (let [studentId, studentChain] of this.studentChains) {
            const student = studentChain.getStudentProfile();
            if (student && student.status === 'active') {
                students.push(student);
            }
        }
        return students;
    }

    /**
     * Get students by class
     */
    getStudentsByClass(classId) {
        const students = [];
        for (let [studentId, studentChain] of this.studentChains) {
            const student = studentChain.getStudentProfile();
            if (student && student.classId === classId && student.status === 'active') {
                students.push(student);
            }
        }
        return students;
    }

    /**
     * Get students by department
     */
    getStudentsByDepartment(departmentId) {
        const students = [];
        for (let [studentId, studentChain] of this.studentChains) {
            const student = studentChain.getStudentProfile();
            if (student && student.departmentId === departmentId && student.status === 'active') {
                students.push(student);
            }
        }
        return students;
    }

    /**
     * Search students by name or roll number
     */
    searchStudents(query) {
        const students = [];
        const searchTerm = query.toLowerCase();

        for (let [studentId, studentChain] of this.studentChains) {
            const student = studentChain.getStudentProfile();
            if (student && student.status === 'active') {
                if (student.name.toLowerCase().includes(searchTerm) ||
                    student.rollNumber.toLowerCase().includes(searchTerm)) {
                    students.push(student);
                }
            }
        }
        return students;
    }

    // ==================== ATTENDANCE OPERATIONS ====================

    /**
     * Mark attendance for a student
     */
    markAttendance(studentId, status) {
        const studentChain = this.studentChains.get(studentId);
        if (!studentChain) {
            throw new Error('Student not found');
        }

        if (!['Present', 'Absent', 'Leave'].includes(status)) {
            throw new Error('Invalid attendance status');
        }

        return studentChain.markAttendance(status);
    }

    /**
     * Get student attendance history
     */
    getStudentAttendance(studentId) {
        const studentChain = this.studentChains.get(studentId);
        if (!studentChain) return [];
        return studentChain.getAllAttendance();
    }

    /**
     * Get student attendance summary
     */
    getStudentAttendanceSummary(studentId) {
        const studentChain = this.studentChains.get(studentId);
        if (!studentChain) return null;
        return studentChain.getAttendanceSummary();
    }

    /**
     * Get today's attendance for a class
     */
    getTodayAttendanceByClass(classId) {
        const today = new Date().toISOString().split('T')[0];
        const attendance = [];

        for (let [studentId, studentChain] of this.studentChains) {
            const student = studentChain.getStudentProfile();
            if (student && student.classId === classId && student.status === 'active') {
                const todayRecord = studentChain.getAttendanceByDate(today);
                attendance.push({
                    student: student,
                    attendance: todayRecord || { status: 'Not Marked', date: today }
                });
            }
        }

        return attendance;
    }

    /**
     * Get attendance by date for a class
     */
    getAttendanceByClassAndDate(classId, date) {
        const attendance = [];

        for (let [studentId, studentChain] of this.studentChains) {
            const student = studentChain.getStudentProfile();
            if (student && student.classId === classId && student.status === 'active') {
                const record = studentChain.getAttendanceByDate(date);
                attendance.push({
                    student: student,
                    attendance: record || { status: 'Not Marked', date: date }
                });
            }
        }

        return attendance;
    }

    /**
     * Get student blockchain (for visualization)
     */
    getStudentBlockchain(studentId) {
        const studentChain = this.studentChains.get(studentId);
        if (!studentChain) return null;
        return studentChain.getAllBlocks();
    }

    // ==================== VALIDATION ====================

    /**
     * Validate entire blockchain system
     * Multi-layer recursive validation
     */
    validateAllChains() {
        const validationReport = {
            isValid: true,
            departmentChain: { isValid: false, message: '' },
            classChains: [],
            studentChains: [],
            errors: []
        };

        try {
            // 1. Validate Department Chain
            const deptValid = this.departmentChain.isChainValid();
            validationReport.departmentChain.isValid = deptValid;
            validationReport.departmentChain.message = deptValid ? 'Valid' : 'Invalid';
            
            if (!deptValid) {
                validationReport.isValid = false;
                validationReport.errors.push('Department chain is invalid');
            }

            // 2. Validate Class Chains
            for (let [departmentId, classChain] of this.classChains) {
                const classValid = classChain.isChainValid();
                const expectedParentHash = this.departmentChain.getLatestBlock().hash;
                const parentRefValid = classChain.validateParentReference(expectedParentHash);

                const classReport = {
                    departmentId: departmentId,
                    isValid: classValid && parentRefValid,
                    chainValid: classValid,
                    parentRefValid: parentRefValid
                };

                validationReport.classChains.push(classReport);

                if (!classValid || !parentRefValid) {
                    validationReport.isValid = false;
                    validationReport.errors.push(
                        `Class chain for department ${departmentId} is invalid`
                    );
                }
            }

            // 3. Validate Student Chains
            for (let [studentId, studentChain] of this.studentChains) {
                const studentValid = studentChain.isChainValid();
                
                // Get parent class chain
                const student = studentChain.getStudentProfile();
                if (student) {
                    const classChain = this.classChains.get(student.departmentId);
                    let parentRefValid = false;
                    
                    if (classChain) {
                        const expectedParentHash = classChain.getLatestBlock().hash;
                        parentRefValid = studentChain.validateParentReference(expectedParentHash);
                    }

                    const studentReport = {
                        studentId: studentId,
                        isValid: studentValid && parentRefValid,
                        chainValid: studentValid,
                        parentRefValid: parentRefValid
                    };

                    validationReport.studentChains.push(studentReport);

                    if (!studentValid || !parentRefValid) {
                        validationReport.isValid = false;
                        validationReport.errors.push(
                            `Student chain for ${studentId} is invalid`
                        );
                    }
                }
            }

        } catch (error) {
            validationReport.isValid = false;
            validationReport.errors.push(`Validation error: ${error.message}`);
        }

        return validationReport;
    }

    // ==================== DATA EXPORT/IMPORT ====================

    /**
     * Export all blockchains to JSON
     */
    exportToJSON() {
        const data = {
            departmentChain: this.departmentChain.toJSON(),
            classChains: {},
            studentChains: {}
        };

        for (let [departmentId, classChain] of this.classChains) {
            data.classChains[departmentId] = classChain.toJSON();
        }

        for (let [studentId, studentChain] of this.studentChains) {
            data.studentChains[studentId] = studentChain.toJSON();
        }

        return data;
    }

    /**
     * Import blockchains from JSON
     */
    importFromJSON(data) {
        // Import department chain
        this.departmentChain = new DepartmentChain();
        this.departmentChain.fromJSON(data.departmentChain);

        // Import class chains
        this.classChains.clear();
        for (let [departmentId, classChainData] of Object.entries(data.classChains)) {
            const classChain = new ClassChain(departmentId, classChainData.parentHash);
            classChain.fromJSON(classChainData);
            this.classChains.set(departmentId, classChain);
        }

        // Import student chains
        this.studentChains.clear();
        for (let [studentId, studentChainData] of Object.entries(data.studentChains)) {
            const studentChain = new StudentChain(
                studentId,
                studentChainData.classId || '',
                studentChainData.departmentId || '',
                studentChainData.parentHash
            );
            studentChain.fromJSON(studentChainData);
            this.studentChains.set(studentId, studentChain);
        }
    }

    /**
     * Get system statistics
     */
    getSystemStats() {
        return {
            departments: this.departmentChain.getAllDepartments().length,
            classes: this.getAllClasses().length,
            students: this.getAllStudents().length,
            departmentBlocks: this.departmentChain.chain.length,
            totalBlocks: this.getTotalBlocks(),
            isValid: this.validateAllChains().isValid
        };
    }

    /**
     * Get total number of blocks across all chains
     */
    getTotalBlocks() {
        let total = this.departmentChain.chain.length;

        for (let classChain of this.classChains.values()) {
            total += classChain.chain.length;
        }

        for (let studentChain of this.studentChains.values()) {
            total += studentChain.chain.length;
        }

        return total;
    }
}

module.exports = BlockchainManager;
