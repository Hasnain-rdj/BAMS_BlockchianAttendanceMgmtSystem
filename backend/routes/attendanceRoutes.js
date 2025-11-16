const express = require('express');
const router = express.Router();

/**
 * Create routes for Attendance operations
 */
function createAttendanceRoutes(attendanceController) {
    // Mark attendance
    router.post('/mark', (req, res) => attendanceController.markAttendance(req, res));

    // Bulk mark attendance
    router.post('/bulk', (req, res) => attendanceController.bulkMarkAttendance(req, res));

    // Get student attendance
    router.get('/student/:studentId', (req, res) => 
        attendanceController.getStudentAttendance(req, res));

    // Get student attendance summary
    router.get('/student/:studentId/summary', (req, res) => 
        attendanceController.getStudentAttendanceSummary(req, res));

    // Get today's attendance by class
    router.get('/class/:classId/today', (req, res) => 
        attendanceController.getTodayAttendanceByClass(req, res));

    // Get attendance by class and date
    router.get('/class/:classId', (req, res) => 
        attendanceController.getAttendanceByClassAndDate(req, res));

    return router;
}

module.exports = createAttendanceRoutes;
