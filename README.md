# Enterprise Maintenance Management System

## Project Overview
The **Enterprise Maintenance Management System** (EMMS) is a modern, web‑based application that enables manufacturing and facilities teams to plan, execute, and monitor maintenance activities across multiple plants and machines. It provides a single source of truth for downtime, corrective actions, preventive maintenance (PM) and total‑base‑maintenance (TBM) schedules, while delivering rich reporting and audit capabilities.

## Business Problem Solved
- **Uncontrolled equipment downtime** – operators struggle to capture precise downtime reasons, leading to prolonged outages.
- **Fragmented maintenance data** – information lives in spreadsheets, emails, and paper logs, making it difficult to analyze trends.
- **Lack of compliance visibility** – regulatory and internal PM/TBM compliance cannot be audited efficiently.
- **Inefficient decision‑making** – managers lack real‑time dashboards and historical insights to prioritize resources.

EMMS centralises all maintenance data, automates schedule compliance checks, and provides instant visibility for operational and compliance teams.

## Features
- **Master Modules** – Machines, Departments, Users, Maintenance Types, Frequency, UOM, Spare Parts.
- **Transaction Modules** –
  - Downtime Entry & Management
  - Action-Taken Entry & Management
  - PM Schedule & Completion
  - TBM Schedule & Completion
- **Reporting & Export** – Dynamic reports (Downtime, Activity, PM/TBM compliance, Machine performance) with CSV export.
- **Audit Trail** – Immutable log of create, update, delete, and status-change events with user, timestamp, module and record reference.
- **Dashboard** – Recent system activity, audit events, most active users, and latest maintenance actions.
- **Role-Based Access Control** – Administrator (full), Manager (manage data), Viewer (read-only).
- **Responsive UI** – Built with Ant Design, styled with premium gradients, glass-morphism and smooth micro-animations.

## Authentication & Authorization
- **Authentication** – Simple mock login using the existing AuthContext. The current user is stored in context and displayed throughout the UI.
- **Authorization** – Role-based UI gating implemented in permissions.ts. Components and export functionality check the user's role before rendering actions.

## Master Modules
| Module | Purpose |
|--------|---------|
| **Machine** | Catalog of all equipment with department association. |
| **Department** | Logical grouping of machines (Production, Utilities, etc.). |
| **User** | System users with role (Administrator, Manager, Viewer). |
| **Maintenance Type** | Classification of maintenance (Corrective, Preventive, Predictive). |
| **Frequency** | Recurrence options for PM/TBM schedules. |
| **UOM** | Units of measurement for consumables and spare parts. |
| **Spare Part** | Inventory of spares linked to machines. |

## Transaction Modules
| Module | Key Operations |
|--------|----------------|
| **Downtime Entry** | Record start/end, reason, duration, status. |
| **Action-Taken Entry** | Log corrective actions, root-cause analysis, engineer, status. |
| **PM Schedule Entry** | Create preventive-maintenance plans, auto-calculate next due date. |
| **PM Completion** | Close PM work orders, capture inspection results. |
| **TBM Schedule Entry** | Define total-base-maintenance cycles, assign owners. |
| **TBM Completion** | Record TBM execution, results and remarks. |

## Reporting & Audit Trail
- **Reports** – Dedicated Reports page with filters (date range, machine, department, status) for:
  - Downtime Report
  - Maintenance Activity Report
  - PM Compliance Report
  - TBM Compliance Report
  - Machine Performance Report
- **Export** – CSV export of any report data via a reusable csvExport utility.
- **Audit Log** – Centralised log view with search and filter capabilities. Every create, update, delete, and status change is recorded automatically by the DataContext.

## Technology Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | React (TypeScript), Ant Design, React Router, Day.js |
| **State Management** | Context API (single DataContext) with mock data persistence in memory |
| **Build Tool** | Vite (via 
pm run dev / 
pm run build) |
| **Styling** | Vanilla CSS with custom design tokens (gradient backgrounds, glass-morphism, micro-animations) |
| **Version Control** | Git |

## Project Structure
`
src/
+- components/          # Re-usable UI components (tables, forms, widgets)
+- context/            # DataContext & AuthContext (global state)
+- pages/             # Route components – Dashboard, Masters, Transactions, Reports, AuditLog
+- utils/             # csvExport, permission helpers
+- App.tsx            # Top-level router & layout
+- index.css         # Global design system (colors, typography, animations)
+- index.tsx         # Application entry point
`
---
