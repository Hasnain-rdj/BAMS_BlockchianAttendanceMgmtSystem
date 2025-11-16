// API Configuration
// Backend deployed at: https://bams-lpjt.onrender.com
const API_CONFIG = {
    // For local development
    LOCAL: 'http://localhost:3000/api',
    
    // Production backend URL (Render.com)
    PRODUCTION: 'https://bams-lpjt.onrender.com/api',
    
    // Auto-detect environment
    get BASE_URL() {
        return window.location.hostname === 'localhost' 
            ? this.LOCAL 
            : this.PRODUCTION;
    }
};

// Export for use in other files
window.API_CONFIG = API_CONFIG;
