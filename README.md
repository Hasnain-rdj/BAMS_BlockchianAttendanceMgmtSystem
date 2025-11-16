# 🔗 Blockchain-Based Attendance Management System (BAMS)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Hasnain-rdj/bams/graphs/commit-activity)

A complete production-ready **3-layer hierarchical blockchain system** for managing departments, classes, students, and attendance records with **Proof of Work (PoW)** consensus mechanism.

> **🎓 Educational Project**: This system demonstrates blockchain fundamentals including custom implementation, PoW mining, SHA-256 hashing, and multi-layer validation without using external blockchain libraries.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Hasnain-rdj/bams.git
cd bams

# Install dependencies
npm install

# Start the server
npm start

# Open browser
# Navigate to http://localhost:3000
```

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [System Architecture](#️-system-architecture)
- [Technology Stack](#️-technology-stack)
- [Installation](#-installation)
- [How to Run](#-how-to-run)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Blockchain Structure](#-blockchain-structure)
- [Validation Process](#-validation-process)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

---

## 🏗️ System Architecture

### 3-Layer Hierarchical Blockchain

```
┌─────────────────────────────────────────┐
│      DEPARTMENT BLOCKCHAIN (Layer 1)    │
│  - Independent top-level chain          │
│  - Genesis block with metadata          │
│  - CRUD operations as blocks            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       CLASS BLOCKCHAIN (Layer 2)        │
│  - Child of Department Chain            │
│  - Genesis prev_hash = Department hash  │
│  - One chain per department             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      STUDENT BLOCKCHAIN (Layer 3)       │
│  - Child of Class Chain                 │
│  - Genesis prev_hash = Class hash       │
│  - One chain per student                │
│  - Attendance blocks appended           │
└─────────────────────────────────────────┘
```

---

## ✨ Features

### Core Blockchain Features
- ✅ **Custom Blockchain Implementation** (no external blockchain libraries)
- ✅ **Proof of Work (PoW)** with difficulty 4 (hash starts with "0000")
- ✅ **SHA-256 Hashing** using Node.js crypto module
- ✅ **Append-only Architecture** (immutable history)
- ✅ **Multi-layer Validation** (recursive parent-child verification)
- ✅ **Block Mining** with nonce calculation
- ✅ **Chain Integrity Verification**

### Application Features
- 📊 **Dashboard** with system statistics
- 🏢 **Department Management** (Add, Update, Delete via blockchain)
- 📚 **Class Management** (Linked to departments)
- 👨‍🎓 **Student Management** (Linked to classes)
- ✅ **Attendance Marking** (Present, Absent, Leave)
- 📈 **Attendance Reports** by class and date
- ⛓️ **Blockchain Explorer** for all 3 layers
- 🔐 **Multi-layer Validation** interface
- 📱 **Responsive UI** (works on mobile/tablet/desktop)

### CRUD Operations
All CRUD operations follow **append-only blockchain behavior**:
- **Add**: New block with data
- **Update**: New block with updated fields (old blocks preserved)
- **Delete**: New block with `status: "deleted"` (data never removed)
- **Search**: Traverse all blocks to build current state

---

## 🛠️ Technology Stack

### Backend
- **Node.js** (v14+)
- **Express.js** (Web server)
- **Crypto** (SHA-256 hashing - built-in Node.js module)
- **UUID** (Unique ID generation)
- **File System** (JSON-based storage)

### Frontend
- **HTML5**
- **CSS3** (Custom styles, responsive design)
- **Vanilla JavaScript** (No frameworks - pure JS)
- **Fetch API** (REST API calls)

### Blockchain
- **Custom implementation** (no libraries)
- **Proof of Work** consensus
- **3-layer hierarchical structure**
- **Parent-child hash linking**

---

## ⛓️ Blockchain Structure

### Block Structure
Every block contains:
```javascript
{
  index: 0,                    // Block number
  timestamp: 1234567890,       // Unix timestamp
  transactions: {...},         // Block data (dept/class/student/attendance)
  prev_hash: "abc123...",      // Previous block hash
  nonce: 12345,                // PoW nonce
  hash: "0000abc..."           // SHA-256 hash (starts with "0000")
}
```

### Genesis Blocks
- **Department Genesis**: `prev_hash = "0"`
- **Class Genesis**: `prev_hash = departmentLatestHash`
- **Student Genesis**: `prev_hash = classLatestHash`

### Mining Algorithm
```javascript
while (hash does not start with "0000") {
  nonce++
  hash = SHA256(index + timestamp + transactions + prev_hash + nonce)
}
```

---

## 📥 Installation

### Prerequisites
- **Node.js** v14 or higher
- **npm** (comes with Node.js)

### Step 1: Clone or Download the Project
```bash
cd Blockchain_Assignment_3
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web server
- `cors` - Cross-origin resource sharing
- `uuid` - Unique ID generation

### Step 3: Verify Installation
```bash
node --version
npm --version
```

---

## 🚀 How to Run

### Option 1: Production Mode
```bash
npm start
```

### Option 2: Development Mode (Auto-restart on file changes)
```bash
npm run dev
```

### Expected Output
```
============================================================
🔗 BLOCKCHAIN-BASED ATTENDANCE MANAGEMENT SYSTEM
============================================================
Server running on: http://localhost:3000
API endpoint: http://localhost:3000/api
Frontend: http://localhost:3000
============================================================
System Stats:
  Departments: 0
  Classes: 0
  Students: 0
  Total Blocks: 1
  Chain Valid: ✓
============================================================
```

### Access the Application
Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

---

## 📖 Usage Guide

### 1. Add a Department
1. Navigate to **Departments** page
2. Fill in department name and head
3. Click "Add Department"
4. A new block will be mined and added to the department chain

### 2. Add a Class
1. Navigate to **Classes** page
2. Select a department
3. Fill in class details (name, teacher, capacity)
4. Click "Add Class"
5. A new class chain is created with genesis block referencing the department

### 3. Add a Student
1. Navigate to **Students** page
2. Select department and class
3. Fill in student details (name, roll number, email)
4. Click "Add Student"
5. A new student chain is created with genesis block referencing the class

### 4. Mark Attendance
1. Navigate to **Attendance** page
2. Select a class
3. Mark each student as Present, Absent, or Leave
4. Click "Submit Attendance"
5. A new attendance block is added to each student's blockchain

### 5. View Blockchain
1. Navigate to **Blockchain** page
2. Select Department/Class/Student
3. Click "Load Chain"
4. View all blocks with hashes, nonces, and data

### 6. Validate System
1. Navigate to **Validation** page
2. Click "Run Validation"
3. System validates:
   - All block hashes
   - Proof of Work (0000 prefix)
   - Parent-child hash references
   - Chain integrity

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/departments` | Get all departments |
| GET | `/departments/:id` | Get single department |
| POST | `/departments` | Add department |
| PUT | `/departments/:id` | Update department |
| DELETE | `/departments/:id` | Delete department |

### Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/classes` | Get all classes |
| GET | `/classes/department/:departmentId` | Get classes by department |
| GET | `/classes/:departmentId/:classId` | Get single class |
| POST | `/classes` | Add class |
| PUT | `/classes/:departmentId/:classId` | Update class |
| DELETE | `/classes/:departmentId/:classId` | Delete class |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/search?query=...` | Search students |
| GET | `/students/class/:classId` | Get students by class |
| GET | `/students/:id` | Get single student |
| GET | `/students/:id/blockchain` | Get student blockchain |
| POST | `/students` | Add student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/attendance/mark` | Mark attendance for one student |
| POST | `/attendance/bulk` | Bulk mark attendance |
| GET | `/attendance/student/:studentId` | Get student attendance |
| GET | `/attendance/student/:studentId/summary` | Get attendance summary |
| GET | `/attendance/class/:classId/today` | Get today's attendance |
| GET | `/attendance/class/:classId?date=YYYY-MM-DD` | Get attendance by date |

### Blockchain
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blockchain/validate` | Validate all chains |
| GET | `/blockchain/stats` | Get system statistics |
| GET | `/blockchain/department` | Get department blockchain |
| GET | `/blockchain/class/:departmentId` | Get class blockchain |
| GET | `/blockchain/export` | Export all blockchain data |

---

## ✅ Validation Process

### Multi-layer Validation Steps

1. **Department Chain Validation**
   - Verify all block hashes
   - Check PoW (hash starts with "0000")
   - Validate prev_hash links

2. **Class Chains Validation**
   - Validate each class chain
   - Verify genesis block references parent department hash
   - Check all blocks in chain

3. **Student Chains Validation**
   - Validate each student chain
   - Verify genesis block references parent class hash
   - Check attendance blocks

4. **Integrity Check**
   - Any tampering invalidates dependent chains
   - Parent hash mismatch detected
   - Modified blocks fail hash verification

---

## 📁 Project Structure

```
Blockchain_Assignment_3/
│
├── backend/
│   ├── blockchain/
│   │   ├── Block.js                    # Block class with PoW mining
│   │   ├── Blockchain.js               # Base blockchain class
│   │   ├── DepartmentChain.js          # Department blockchain
│   │   ├── ClassChain.js               # Class blockchain
│   │   ├── StudentChain.js             # Student blockchain
│   │   └── BlockchainManager.js        # Central manager
│   │
│   ├── controllers/
│   │   ├── departmentController.js     # Department CRUD
│   │   ├── classController.js          # Class CRUD
│   │   ├── studentController.js        # Student CRUD
│   │   ├── attendanceController.js     # Attendance operations
│   │   └── blockchainController.js     # Blockchain operations
│   │
│   ├── routes/
│   │   ├── departmentRoutes.js         # Department routes
│   │   ├── classRoutes.js              # Class routes
│   │   ├── studentRoutes.js            # Student routes
│   │   ├── attendanceRoutes.js         # Attendance routes
│   │   └── blockchainRoutes.js         # Blockchain routes
│   │
│   ├── models/
│   │   └── Storage.js                  # JSON file storage
│   │
│   ├── utils/
│   │   └── validators.js               # Input validation
│   │
│   ├── data/
│   │   └── blockchain.json             # Persisted blockchain data
│   │
│   └── server.js                       # Express server entry point
│
├── frontend/
│   ├── css/
│   │   └── style.css                   # All styles
│   │
│   ├── js/
│   │   ├── dashboard.js                # Dashboard logic
│   │   ├── departments.js              # Department management
│   │   ├── classes.js                  # Class management
│   │   ├── students.js                 # Student management
│   │   ├── attendance.js               # Attendance marking
│   │   ├── blockchain.js               # Blockchain explorer
│   │   └── validation.js               # Validation interface
│   │
│   ├── index.html                      # Dashboard page
│   ├── departments.html                # Departments page
│   ├── classes.html                    # Classes page
│   ├── students.html                   # Students page
│   ├── attendance.html                 # Attendance page
│   ├── blockchain.html                 # Blockchain explorer
│   └── validation.html                 # Validation page
│
├── package.json                        # Dependencies
└── README.md                           # This file
```

---

## 🔒 Security Features

- **Immutable History**: Blocks cannot be edited or deleted
- **Hash Verification**: SHA-256 ensures data integrity
- **Proof of Work**: Computational proof prevents tampering
- **Parent-Child Linking**: Changes invalidate dependent chains
- **Append-Only**: All operations create new blocks
- **Validation**: Multi-layer integrity verification

---

## 🎯 Key Highlights

1. ✅ **No External Blockchain Libraries** - 100% custom implementation
2. ✅ **True 3-Layer Hierarchy** - Department → Class → Student
3. ✅ **Full CRUD via Blockchain** - All operations create blocks
4. ✅ **Proof of Work Mining** - SHA-256 with difficulty 4
5. ✅ **Multi-layer Validation** - Recursive parent-child verification
6. ✅ **Attendance Blockchain** - Each student has full attendance history
7. ✅ **File-based Persistence** - Automatic save/load
8. ✅ **Clean UI** - No frameworks, pure HTML/CSS/JS

---

## 📝 Example Workflow

1. **Add Department "Computer Science"**
   - Block mined with PoW
   - Hash: `0000a1b2c3...`

2. **Add Class "Data Structures" to CS Department**
   - New class chain created
   - Genesis block prev_hash = `0000a1b2c3...`
   - Block mined with PoW

3. **Add Student "Alice" to Data Structures**
   - New student chain created
   - Genesis block references class chain
   - Profile block added

4. **Mark Alice Present on 2025-11-16**
   - New attendance block added to Alice's chain
   - Block mined with PoW
   - Hash: `0000x9y8z7...`

5. **Validate System**
   - All chains verified
   - Parent references validated
   - PoW checked on all blocks
   - Result: ✓ VALID

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in backend/server.js
const PORT = process.env.PORT || 3001; // Use different port
```

### Module Not Found
```bash
npm install
```

### Cannot Load Frontend
- Ensure server is running
- Check http://localhost:3000 (not file://)

---

## 📧 Support

For issues or questions:
1. Check the console for error messages
2. Verify Node.js version (14+)
3. Ensure all dependencies are installed
4. Check that port 3000 is available

---

## 🎓 Educational Purpose

This system demonstrates:

- Custom blockchain implementation
- Proof of Work consensus
- Hierarchical blockchain architecture
- Immutable data structures
- Hash-based integrity
- Parent-child chain relationships
- Real-world blockchain application

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=BAMS+Dashboard)
*System statistics and overview*

### Blockchain Explorer
![Blockchain Explorer](https://via.placeholder.com/800x400/2196F3/FFFFFF?text=Blockchain+Explorer)
*View all 3 layers of blockchain*

### Attendance Management
![Attendance](https://via.placeholder.com/800x400/FF9800/FFFFFF?text=Attendance+Management)
*Mark and track attendance with blockchain*

> **Note**: Replace placeholder images with actual screenshots by adding images to a `/screenshots` folder and updating the paths.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Project**
   ```bash
   git clone https://github.com/Hasnain-rdj/bams.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 BAMS Development Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Hasnain**

- GitHub: [@Hasnain-rdj](https://github.com/Hasnain-rdj)
- Email: mhussnainzardari34@gmail.com

---

## 🙏 Acknowledgments

- Inspired by blockchain technology and its educational applications
- Built with modern web development best practices
- Thanks to the open-source community for tools and inspiration
- Special thanks to all contributors

---

## ⭐ Show Your Support

If this project helped you learn about blockchain technology, please give it a ⭐️!

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/Hasnain-rdj/bams)
![GitHub stars](https://img.shields.io/github/stars/Hasnain-rdj/bams?style=social)
![GitHub forks](https://img.shields.io/github/forks/Hasnain-rdj/bams?style=social)

---

**🔗 BAMS - Blockchain-Based Attendance Management System**  
*Securing education data with blockchain technology*

---
