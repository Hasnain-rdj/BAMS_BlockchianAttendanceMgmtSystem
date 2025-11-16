const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique ID
 */
function generateId() {
    return uuidv4();
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate department data
 */
function validateDepartment(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Department name is required');
    }

    if (!data.head || typeof data.head !== 'string' || data.head.trim().length === 0) {
        errors.push('Department head is required');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate class data
 */
function validateClass(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Class name is required');
    }

    if (!data.teacher || typeof data.teacher !== 'string' || data.teacher.trim().length === 0) {
        errors.push('Teacher name is required');
    }

    if (!data.capacity || typeof data.capacity !== 'number' || data.capacity <= 0) {
        errors.push('Valid capacity is required');
    }

    if (!data.departmentId || typeof data.departmentId !== 'string') {
        errors.push('Department ID is required');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate student data
 */
function validateStudent(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Student name is required');
    }

    if (!data.rollNumber || typeof data.rollNumber !== 'string' || data.rollNumber.trim().length === 0) {
        errors.push('Roll number is required');
    }

    if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }

    if (!data.classId || typeof data.classId !== 'string') {
        errors.push('Class ID is required');
    }

    if (!data.departmentId || typeof data.departmentId !== 'string') {
        errors.push('Department ID is required');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate attendance status
 */
function validateAttendanceStatus(status) {
    const validStatuses = ['Present', 'Absent', 'Leave'];
    return validStatuses.includes(status);
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
}

/**
 * Sanitize input string
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
}

module.exports = {
    generateId,
    isValidEmail,
    validateDepartment,
    validateClass,
    validateStudent,
    validateAttendanceStatus,
    formatDate,
    sanitizeString
};
