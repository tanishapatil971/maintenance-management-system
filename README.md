# Enterprise Maintenance Management System (EMMS)

## Project Overview

Enterprise Maintenance Management System (EMMS) is a web-based application developed for the manufacturing domain to manage and monitor machine maintenance activities efficiently.

The system provides a centralized platform for tracking machine downtime, recording maintenance actions, managing preventive maintenance schedules, and monitoring key maintenance metrics through an interactive dashboard.

This project was developed as part of a Web Development Internship at Probity Technologies Pvt. Ltd.

---

## Problem Statement

Manufacturing industries require an efficient way to manage machine maintenance activities and minimize downtime.

Traditional maintenance tracking using manual records or spreadsheets can lead to:

- Difficulty tracking machine breakdown history
- Delayed maintenance action updates
- Poor visibility of pending maintenance activities
- Lack of centralized maintenance records

EMMS solves this by digitizing the complete maintenance workflow from downtime reporting to action completion and monitoring.

---

## Key Features

### Master Management Modules

- User Management
- Role & Authorization Management
- Machine Master
- Department Master
- Checklist Management
- Spare Parts Management
- Element & Sub Element Management
- Unit of Measurement (UOM)
- Downtime & Action Configuration

---

### Maintenance Transaction Modules

#### Downtime Entry Management

- Record machine downtime incidents
- Track affected machines
- Maintain downtime status workflow
- Monitor open and closed issues

#### Action Taken Management

- Record maintenance actions performed
- Link corrective actions with downtime records
- Track issue resolution progress

#### Preventive Maintenance (PM)

- Create preventive maintenance schedules
- Manage planned maintenance activities
- Track completion status

#### TBM Management

- Manage TBM schedules
- Track execution and completion details

---

## Maintenance Workflow

Machine Issue Detected

↓

Downtime Entry Created

↓

Maintenance Action Recorded

↓

Issue Resolution Updated

↓

Status Closure

↓

Dashboard Monitoring

---

## Dashboard Features

The dashboard provides maintenance insights including:

- Total Machines
- Open Downtime Records
- Closed Downtime Records
- Pending Maintenance Activities
- Maintenance Status Overview

Dashboard metrics are dynamically generated from stored maintenance records.

---

## Authentication & Authorization

- Login-based access system
- Role-based user permissions
- Different access levels for users
- Protected application workflow

---

## Data Persistence

Implemented persistent data handling using a reusable storage layer.

Features:

- Saves master records
- Stores maintenance transactions
- Maintains authentication state
- Preserves data after page refresh

---

## Technology Stack

| Category | Technology |
|---------|------------|
| Frontend | React.js, TypeScript |
| UI Framework | Ant Design |
| Build Tool | Vite |
| State Management | Context API |
| Storage | LocalStorage Persistence Layer |
| Routing | React Router |
| Styling | CSS |
| Version Control | Git & GitHub |

---

## Project Structure
