const { validateAttendanceStatus, formatDate } = require('../utils/validators');

/**
 * Attendance Controller
 * Handles all attendance-related operations
 */
class AttendanceController {
    constructor(blockchainManager) {
        this.blockchainManager = blockchainManager;
    }

    /**
     * Mark attendance for a student
     */
    markAttendance(req, res) {
        try {
            const { studentId, status } = req.body;

            // Validate student ID
            if (!studentId || typeof studentId !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Student ID is required'
                });
            }

            // Validate status
            if (!validateAttendanceStatus(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid attendance status. Must be Present, Absent, or Leave'
                });
            }

            // Check if student exists
            const student = this.blockchainManager.getStudent(studentId);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            if (student.status === 'deleted') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot mark attendance for deleted student'
                });
            }

            // Mark attendance
            const block = this.blockchainManager.markAttendance(studentId, status);

            res.status(201).json({
                success: true,
                message: 'Attendance marked successfully',
                data: {
                    studentId: studentId,
                    status: status,
                    date: formatDate(new Date()),
                    block: {
                        index: block.index,
                        hash: block.hash,
                        timestamp: block.timestamp
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error marking attendance',
                error: error.message
            });
        }
    }

    /**
     * Get attendance for a student
     */
    getStudentAttendance(req, res) {
        try {
            const { studentId } = req.params;

            const attendance = this.blockchainManager.getStudentAttendance(studentId);

            if (!attendance || attendance.length === 0) {
                return res.json({
                    success: true,
                    data: [],
                    count: 0,
                    message: 'No attendance records found'
                });
            }

            res.json({
                success: true,
                data: attendance,
                count: attendance.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching student attendance',
                error: error.message
            });
        }
    }

    /**
     * Get attendance summary for a student
     */
    getStudentAttendanceSummary(req, res) {
        try {
            const { studentId } = req.params;

            const summary = this.blockchainManager.getStudentAttendanceSummary(studentId);

            if (!summary) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.json({
                success: true,
                data: summary
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching attendance summary',
                error: error.message
            });
        }
    }

    /**
     * Get today's attendance for a class
     */
    getTodayAttendanceByClass(req, res) {
        try {
            const { classId } = req.params;

            const attendance = this.blockchainManager.getTodayAttendanceByClass(classId);

            res.json({
                success: true,
                data: attendance,
                count: attendance.length,
                date: formatDate(new Date())
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching class attendance',
                error: error.message
            });
        }
    }

    /**
     * Get attendance by class and date
     */
    getAttendanceByClassAndDate(req, res) {
        try {
            const { classId } = req.params;
            const { date } = req.query;

            if (!date) {
                return res.status(400).json({
                    success: false,
                    message: 'Date is required (YYYY-MM-DD format)'
                });
            }

            const attendance = this.blockchainManager.getAttendanceByClassAndDate(classId, date);

            res.json({
                success: true,
                data: attendance,
                count: attendance.length,
                date: date
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching attendance',
                error: error.message
            });
        }
    }

    /**
     * Bulk mark attendance for multiple students
     */
    bulkMarkAttendance(req, res) {
        try {
            const { attendanceData } = req.body;

            if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Attendance data array is required'
                });
            }

            const results = [];
            const errors = [];

            for (let entry of attendanceData) {
                try {
                    const { studentId, status } = entry;

                    if (!validateAttendanceStatus(status)) {
                        errors.push({
                            studentId: studentId,
                            error: 'Invalid status'
                        });
                        continue;
                    }

                    const block = this.blockchainManager.markAttendance(studentId, status);
                    results.push({
                        studentId: studentId,
                        status: status,
                        blockIndex: block.index,
                        hash: block.hash
                    });
                } catch (error) {
                    errors.push({
                        studentId: entry.studentId,
                        error: error.message
                    });
                }
            }

            res.status(201).json({
                success: true,
                message: 'Bulk attendance marked',
                data: {
                    successful: results,
                    failed: errors,
                    successCount: results.length,
                    failCount: errors.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error marking bulk attendance',
                error: error.message
            });
        }
    }
}

module.exports = AttendanceController;
