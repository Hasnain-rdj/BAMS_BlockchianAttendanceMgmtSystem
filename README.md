# 🔗 BAMS - Blockchain-Based Attendance Management System

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://battendancemgmtsys.netlify.app/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready **3-layer hierarchical blockchain system** for managing educational institutions with custom Proof of Work consensus, SHA-256 hashing, and immutable attendance ledgers.

## 🌐 Live Application

- **Frontend (Netlify):** [https://battendancemgmtsys.netlify.app/](https://battendancemgmtsys.netlify.app/)
- **Backend API (Render):** [https://bams-lpjt.onrender.com](https://bams-lpjt.onrender.com)
- **GitHub Repository:** [https://github.com/Hasnain-rdj/BAMS](https://github.com/Hasnain-rdj/BAMS)

---

## 📖 Overview

BAMS is an educational blockchain project demonstrating:
- **Custom blockchain implementation** without external blockchain libraries
- **3-layer hierarchical architecture** (Department → Class → Student)
- **Proof of Work mining** with configurable difficulty
- **Immutable attendance records** stored as blockchain transactions
- **Interactive 3D tree visualization** of blockchain structure
- **Full CRUD operations** with blockchain integrity

---

## ✨ Key Features

### Blockchain Core
- ✅ SHA-256 cryptographic hashing
- ✅ Proof of Work (PoW) mining with difficulty 4
- ✅ Multi-layer chain validation
- ✅ Parent-child hash linking
- ✅ Genesis block creation
- ✅ Append-only immutable ledger

### Application Features
- 📊 **Dashboard** - Real-time statistics and metrics
- 🏢 **Department Management** - Create and manage departments
- 📚 **Class Management** - Organize classes by department
- 👨‍🎓 **Student Management** - Complete student lifecycle
- 📝 **Attendance Tracking** - Blockchain-based attendance records
- ⛓️ **Blockchain Explorer** - Interactive 3D tree visualization with hover tooltips
- ✅ **Chain Validation** - System-wide integrity verification
- 🔍 **Search & Filter** - Quick student and class lookup
- 📱 **Responsive Design** - Mobile, tablet, and desktop optimized

---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Department Chain      │  Independent top-level blockchain
│   (Genesis: prev=0)     │  CRUD operations create blocks
└──────────┬──────────────┘
           │ (links via hash)
           ▼
┌─────────────────────────┐
│   Class Chain           │  Child of Department
│   (Genesis: prev=Dept)  │  One chain per department
└──────────┬──────────────┘
           │ (links via hash)
           ▼
┌─────────────────────────┐
│   Student Chain         │  Child of Class
│   (Genesis: prev=Class) │  One chain per student
│   + Attendance Blocks   │  Attendance appended as blocks
└─────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone repository
git clone https://github.com/Hasnain-rdj/BAMS.git
cd BAMS

# Install dependencies
npm install

# Start development server
npm start
```

Server runs at `http://localhost:3000`

### Production Deployment

**Backend (Render.com):**
```bash
# Build command: npm install
# Start command: npm start
# Environment: NODE_ENV=production
```

**Frontend (Netlify):**
```bash
# Build command: (none)
# Publish directory: frontend
# Redirects: configured via netlify.toml
```

---

## 💻 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Crypto (built-in)** - SHA-256 hashing
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables and gradients
- **Vanilla JavaScript** - No frameworks
- **Fetch API** - HTTP requests

### Blockchain
- **Custom Implementation** - No external blockchain libraries
- **SHA-256** - Cryptographic hash function
- **Proof of Work** - Mining with difficulty 4
- **JSON Storage** - File-based persistence

---

## 📱 Features Overview

### 1. Dashboard
- System-wide statistics
- Total departments, classes, students
- Quick navigation

### 2. Department Management
- Create new departments
- Update existing departments
- Delete (soft delete via blockchain)
- View all departments

### 3. Class Management
- Add classes to departments
- Update class information
- Department-wise filtering
- Teacher assignment

### 4. Student Management
- Complete student profiles
- Roll number generation
- Class enrollment
- Search by name/roll number
- Student blockchain view

### 5. Attendance System
- Mark attendance (Present/Absent/Leave)
- Bulk attendance for entire class
- Individual student history
- Date-wise records
- Immutable blockchain storage
- Real-time blockchain visualization

### 6. Blockchain Explorer (3D Tree View)
- **Interactive Tree Visualization** - Vertical connected node structure
- **Hover Tooltips** - Detailed block information on hover
- **Color-coded Nodes:**
  - 🟡 Genesis Block (gold gradient)
  - 🟢 Active Block (green gradient)
  - 🔴 Deleted Block (red gradient, semi-transparent)
  - ⚪ Regular Block (white)
- **Toggle Views** - Switch between Tree and List view
- **Responsive** - Works on all device sizes
- **Detailed Information:**
  - Block index and hash
  - Timestamp
  - Transaction data
  - Nonce value
  - Previous hash
  - PoW verification (0000 prefix)

### 7. Validation System
- Verify entire blockchain integrity
- Check all three layers
- Hash verification
- PoW verification
- Parent-child link validation

---

## 🔧 API Endpoints

### Departments
```
GET    /api/departments          - List all departments
GET    /api/departments/:id      - Get single department
POST   /api/departments          - Create department
PUT    /api/departments/:id      - Update department
DELETE /api/departments/:id      - Delete department
```

### Classes
```
GET    /api/classes                        - List all classes
GET    /api/classes/:departmentId/:classId - Get single class
GET    /api/classes/department/:deptId     - Get classes by department
POST   /api/classes                        - Create class
PUT    /api/classes/:deptId/:classId       - Update class
DELETE /api/classes/:deptId/:classId       - Delete class
```

### Students
```
GET    /api/students                    - List all students
GET    /api/students/:id                - Get single student
GET    /api/students/class/:classId     - Get students by class
GET    /api/students/search?query=...   - Search students
POST   /api/students                    - Create student
PUT    /api/students/:id                - Update student
DELETE /api/students/:id                - Delete student
```

### Attendance
```
POST   /api/attendance/mark             - Mark single attendance
POST   /api/attendance/bulk             - Mark bulk attendance
GET    /api/attendance/student/:id      - Get student attendance
GET    /api/attendance/student/:id/summary - Get attendance summary
```

### Blockchain
```
GET    /api/blockchain/department           - Get department blockchain
GET    /api/blockchain/class/:deptId        - Get class blockchain
GET    /api/students/:studentId/blockchain  - Get student blockchain
POST   /api/blockchain/validate             - Validate all chains
```

---

## 📂 Project Structure

```
BAMS/
├── backend/
│   ├── blockchain/
│   │   ├── Block.js                 # Core block with PoW mining
│   │   ├── Blockchain.js            # Base blockchain class
│   │   ├── DepartmentChain.js       # Department-level chain
│   │   ├── ClassChain.js            # Class-level chain
│   │   ├── StudentChain.js          # Student-level chain
│   │   └── BlockchainManager.js     # Central orchestrator
│   ├── controllers/
│   │   ├── departmentController.js
│   │   ├── classController.js
│   │   ├── studentController.js
│   │   ├── attendanceController.js
│   │   └── blockchainController.js
│   ├── routes/
│   │   ├── departmentRoutes.js
│   │   ├── classRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── blockchainRoutes.js
│   ├── models/
│   │   └── Storage.js               # JSON file persistence
│   ├── utils/
│   │   └── validators.js            # Input validation
│   └── server.js                    # Express app entry
├── frontend/
│   ├── css/
│   │   └── style.css                # Responsive styles
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── departments.js
│   │   ├── classes.js
│   │   ├── students.js
│   │   ├── attendance.js
│   │   ├── blockchain.js            # 3D tree visualization
│   │   └── validation.js
│   ├── config.js                    # Environment-aware API config
│   ├── index.html
│   ├── departments.html
│   ├── classes.html
│   ├── students.html
│   ├── attendance.html
│   ├── blockchain.html              # Interactive tree view
│   ├── validation.html
│   └── _redirects                   # Netlify SPA routing
├── package.json
├── netlify.toml
└── README.md
```

---

## 🔐 Blockchain Implementation Details

### Block Structure
```javascript
{
  index: Number,           // Sequential block number
  timestamp: Number,       // Unix timestamp
  transactions: Object,    // Block data (dept/class/student/attendance)
  prev_hash: String,       // Previous block hash (SHA-256)
  hash: String,            // Current block hash (SHA-256)
  nonce: Number           // PoW nonce value
}
```

### Proof of Work Mining
```javascript
// Block.js - mineBlock() method
mineBlock(difficulty = 4) {
    const target = '0'.repeat(difficulty);
    while (this.hash.substring(0, difficulty) !== target) {
        this.nonce++;
        this.hash = this.calculateHash();
    }
}
```

### SHA-256 Hashing
```javascript
calculateHash() {
    const data = this.index + 
                 this.timestamp + 
                 JSON.stringify(this.transactions) + 
                 this.prev_hash + 
                 this.nonce;
    return crypto.createHash('sha256').update(data).digest('hex');
}
```

### Chain Validation
```javascript
isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
        const current = this.chain[i];
        const previous = this.chain[i - 1];

        // Verify hash hasn't been tampered with
        if (current.hash !== current.calculateHash()) return false;

        // Verify PoW
        if (!current.hasValidProofOfWork(4)) return false;

        // Verify chain link
        if (current.prev_hash !== previous.hash) return false;
    }
    return true;
}
```

---

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- **Desktop:** 1024px+ (full layout)
- **Tablet:** 768px - 1024px (2-column grid)
- **Mobile:** < 768px (single column, collapsible menu)

### Mobile Features:
- Hamburger navigation menu
- Touch-friendly buttons
- Scrollable tables
- Optimized tree visualization
- Responsive tooltips
- Full-width forms

---

## 🎨 UI/UX Features

### 3D Tree Visualization
- **Vertical Flow:** Top-to-bottom blockchain representation
- **Node Colors:** Visual status indication (genesis/active/deleted)
- **Hover Effects:** 3D lift animation on hover
- **Tooltips:** Detailed block information overlay
- **Responsive:** Adapts to screen size
- **Legend:** Color-coded guide
- **View Toggle:** Switch between Tree and List modes

### Design System
- **Color Palette:**
  - Primary: `#2563eb` (Blue)
  - Success: `#10b981` (Green)
  - Warning: `#f59e0b` (Orange)
  - Danger: `#ef4444` (Red)
  - Dark: `#1e293b` (Navy)
- **Typography:** System fonts (Segoe UI)
- **Shadows:** Layered depth with `box-shadow`
- **Gradients:** Genesis and status blocks
- **Animations:** Smooth transitions on all interactive elements

---

## 🧪 Testing

### Manual Testing
1. Create a department
2. Add a class to that department
3. Add a student to that class
4. Mark attendance for the student
5. View the student's blockchain
6. Verify chain integrity
7. Check blockchain explorer tree view

### Validation Checks
- All blocks have valid PoW (hash starts with "0000")
- All blocks are properly linked (prev_hash matches)
- No broken parent-child relationships
- Data integrity maintained across operations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Hasnain**

- GitHub: [@Hasnain-rdj](https://github.com/Hasnain-rdj)
- Email: mhussnainzardari34@gmail.com
- Project: [BAMS](https://github.com/Hasnain-rdj/BAMS)

---

## 🙏 Acknowledgments

- Built with Node.js and Express.js
- Inspired by blockchain technology and educational management needs
- Deployed on Render (backend) and Netlify (frontend)

---

## 📊 Project Statistics

- **Total Files:** 35+
- **Lines of Code:** 6400+
- **Backend Files:** 19
- **Frontend Files:** 15
- **API Endpoints:** 25+
- **Blockchain Layers:** 3

---

## 🔗 Useful Links

- [Live Demo](https://battendancemgmtsys.netlify.app/)
- [API Documentation](https://bams-lpjt.onrender.com/health)
- [GitHub Repository](https://github.com/Hasnain-rdj/BAMS)
- [Issue Tracker](https://github.com/Hasnain-rdj/BAMS/issues)

---

<div align="center">

Made with ❤️ by Hasnain

**[⬆ back to top](#-bams---blockchain-based-attendance-management-system)**

</div>
