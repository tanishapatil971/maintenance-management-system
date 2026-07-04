# Enterprise Maintenance Management System (EMMS)

## Project Overview

Enterprise Maintenance Management System (EMMS) is a web-based application developed for the manufacturing domain to manage and monitor machine maintenance activities efficiently.

The system provides a centralized platform for tracking machine downtime, recording maintenance actions, managing preventive maintenance schedules, and monitoring key maintenance metrics through an interactive dashboard.

This project was developed as part of a Web Development Internship at Probity Technologies Pvt. Ltd.

---

## Problem Statement

Manufacturing industries require an efficient way to manage machine maintenance activities and minimize equipment downtime.

Traditional maintenance tracking methods using manual records and spreadsheets can create challenges such as:

- Difficulty tracking machine downtime history
- Delayed maintenance action updates
- Poor visibility of pending maintenance activities
- Lack of centralized maintenance data management

EMMS helps digitize the maintenance workflow by providing structured tracking from issue reporting to resolution and monitoring.

---

# Features

## Master Management Modules

- User Management
- Role & Authorization Management
- Machine Master
- Department Master
- Checklist Management
- Spare Parts Management
- Element Management
- Sub Element Management
- Unit of Measurement (UOM)
- Downtime & Action Configuration

---

## Transaction Modules

### Downtime Entry Management

- Create and manage machine downtime records
- Track affected machines
- Maintain downtime status workflow
- Monitor open and closed maintenance issues

### Action Taken Management

- Record corrective maintenance actions
- Link actions with downtime records
- Track issue resolution progress

### Preventive Maintenance (PM)

- Create preventive maintenance schedules
- Manage planned maintenance activities
- Track maintenance completion status

### TBM Management

- Create TBM schedules
- Monitor execution and completion details

---

# Maintenance Workflow

```
Machine Issue Detected

        ↓

Downtime Entry Created

        ↓

Action Taken Recorded

        ↓

Maintenance Completed

        ↓

Issue Closed

        ↓

Dashboard Monitoring
```

---

# Dashboard Features

Interactive dashboard for maintenance monitoring:

- Total Machines
- Open Downtime Records
- Closed Downtime Records
- Pending Maintenance Activities
- Maintenance Status Overview

Dashboard statistics are dynamically generated from persisted maintenance records.

---

# Authentication & Authorization

- User login functionality
- Role-based access control
- Permission-based UI handling
- Protected application workflow

---

# Data Persistence

Implemented reusable data persistence functionality.

Features:

- Stores master records
- Maintains downtime/action transaction data
- Saves schedule information
- Maintains authentication state
- Data remains available after page refresh

---

# Technology Stack

| Category | Technology |
|---|---|
| Frontend | React.js, TypeScript |
| UI Library | Ant Design |
| Build Tool | Vite |
| Routing | React Router |
| State Management | Context API |
| Data Storage | LocalStorage Persistence |
| Styling | CSS |
| Version Control | Git & GitHub |

---

# Project Structure

```
src/

├── components/
│   └── Reusable UI Components

├── context/
│   ├── AuthContext
│   └── Data Management Context

├── pages/
│   ├── Dashboard
│   ├── Master Modules
│   └── Transaction Modules

├── utils/
│   └── Helper & Persistence Utilities

├── App.tsx

└── main.tsx
```

---

# Installation & Setup

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build project:

```bash
npm run build
```

---

# Project Status

Completed:

- Requirement Analysis
- Application Architecture Design
- Master Module Development
- Maintenance Transaction Workflow
- Authentication & Authorization
- Data Persistence Implementation
- Dashboard Integration
- Testing & Optimization

---

# Future Enhancements

- Backend API Integration
- Database Connectivity
- Advanced Analytics Reports
- Notification System
- Deployment Improvements

---

# Developer

**Tanisha Patil**

B.Tech Artificial Intelligence & Machine Learning

---
