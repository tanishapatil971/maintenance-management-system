import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import dayjs from 'dayjs';
import { usePersistentState } from '../utils/persistence';

export type DowntimeStatus = 'Open' | 'In Progress' | 'Closed';
export type ActionStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type ScheduleStatus = 'Upcoming' | 'Due' | 'Overdue' | 'Completed';
export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export interface DownTimeRecord {
  id: number;
  ticketNumber: string;
  machine: string;
  machineId: number;
  department: string;
  downTimeReason: string;
  startDateTime: string;
  endDateTime: string;
  duration: string;
  status: DowntimeStatus;
  remarks: string;
}

export interface ActionTakenRecord {
  id: number;
  actionNumber: string;
  ticketId: number;
  ticketNumber: string;
  machine: string;
  actionTaken: string;
  maintenanceEngineer: string;
  actionDateTime: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  remarks: string;
  status: ActionStatus;
}

export interface Machine {
  id: number;
  name: string;
  department: string;
}

export interface TBMScheduleRecord {
  id: number;
  machineId: number;
  machine: string;
  plannedDate: string;
  cycle: string;
  nextDueDate: string;
  status: ScheduleStatus;
  owner: string;
  notes?: string;
}

export interface AuditLogEntry {
  id?: number;
  timestamp: string;
  user: string;
  module: string;
  action: string;
  recordReference: string;
}

export interface PMScheduleRecord {
  id: number;
  machineId: number;
  machine: string;
  category: string;
  frequency: Frequency;
  scheduledDate: string;
  nextDueDate: string;
  status: ScheduleStatus;
  assignedTo: string;
  notes?: string;
  completedDate?: string;
}

export interface PMScheduleCompletionRecord {
  id: number;
  scheduleId: number;
  machine: string;
  completedDate: string;
  inspectionResult: 'Pass' | 'Fail';
  performedBy: string;
  remarks?: string;
  status: 'Completed' | 'Delayed' | 'Pending';
}

export interface TBMScheduleCompletionRecord {
  id: number;
  scheduleId: number;
  machine: string;
  completedDate: string;
  inspectionResult: 'Pass' | 'Fail';
  performedBy: string;
  remarks?: string;
  status: 'Completed' | 'Delayed' | 'Pending';
}

export interface DataContextProps {
  downtimeRecords: DownTimeRecord[];
  setDowntimeRecords: React.Dispatch<React.SetStateAction<DownTimeRecord[]>>;
  actionRecords: ActionTakenRecord[];
  setActionRecords: React.Dispatch<React.SetStateAction<ActionTakenRecord[]>>;
  addAction: (action: Omit<ActionTakenRecord, 'id' | 'actionNumber' | 'ticketNumber' | 'machine'>) => void;
  updateAction: (updatedAction: ActionTakenRecord) => void;
  deleteAction: (actionId: number) => void;
  deleteDowntimeRecord: (ticketId: number) => void;
  getActionsByTicket: (ticketId: number) => ActionTakenRecord[];
  getTicketById: (ticketId: number) => DownTimeRecord | undefined;
  machines: Machine[];
  pmSchedules: PMScheduleRecord[];
  tbmSchedules: TBMScheduleRecord[];
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id'>) => void;
  addPMSchedule: (s: Omit<PMScheduleRecord, 'id' | 'nextDueDate' | 'status'>) => void;
  updatePMSchedule: (s: PMScheduleRecord) => void;
  deletePMSchedule: (id: number) => void;
  addTBMSchedule: (s: Omit<TBMScheduleRecord, 'id' | 'nextDueDate' | 'status'>) => void;
  updateTBMSchedule: (s: TBMScheduleRecord) => void;
  deleteTBMSchedule: (id: number) => void;
  getPMSchedules: () => PMScheduleRecord[];
  getTBMSchedules: () => TBMScheduleRecord[];
  pmCompletions: PMScheduleCompletionRecord[];
  setPmCompletions: React.Dispatch<React.SetStateAction<PMScheduleCompletionRecord[]>>;
  tbmCompletions: TBMScheduleCompletionRecord[];
  setTbmCompletions: React.Dispatch<React.SetStateAction<TBMScheduleCompletionRecord[]>>;
}

const initialDowntimeRecords: DownTimeRecord[] = [
  {
    id: 1,
    ticketNumber: 'DT-20260601-001',
    machine: 'Press Unit 14',
    machineId: 1,
    department: 'Production',
    downTimeReason: 'Mechanical failure',
    startDateTime: '2026-06-01 08:30:00',
    endDateTime: '2026-06-01 10:15:00',
    duration: '01:45:00',
    status: 'Closed',
    remarks: 'Hydraulic seal replaced',
  },
  {
    id: 2,
    ticketNumber: 'DT-20260602-002',
    machine: 'Pump Station 3',
    machineId: 3,
    department: 'Fluid Systems',
    downTimeReason: 'Sensor malfunction',
    startDateTime: '2026-06-02 14:20:00',
    endDateTime: '',
    duration: '00:00:00',
    status: 'In Progress',
    remarks: 'Awaiting sensor replacement',
  },
  {
    id: 3,
    ticketNumber: 'DT-20260603-003',
    machine: 'Conveyor A',
    machineId: 2,
    department: 'Material Handling',
    downTimeReason: 'Mechanical failure',
    startDateTime: '2026-06-03 11:00:00',
    endDateTime: '',
    duration: '00:00:00',
    status: 'Open',
    remarks: 'Belt misalignment detected',
  },
  {
    id: 4,
    ticketNumber: 'DT-20260604-004',
    machine: 'Cooling Tower',
    machineId: 4,
    department: 'Utilities',
    downTimeReason: 'Scheduled maintenance',
    startDateTime: '2026-06-04 09:00:00',
    endDateTime: '2026-06-04 16:30:00',
    duration: '07:30:00',
    status: 'Closed',
    remarks: 'Seasonal coolant service completed',
  },
];

const initialActionRecords: ActionTakenRecord[] = [
  {
    id: 1,
    actionNumber: 'ACT-20260601-001',
    ticketId: 1,
    ticketNumber: 'DT-20260601-001',
    machine: 'Press Unit 14',
    actionTaken: 'Replaced hydraulic seals',
    maintenanceEngineer: 'Sanjay Kumar',
    actionDateTime: '2026-06-01 10:10:00',
    rootCause: 'Hydraulic seal wear',
    correctiveAction: 'Install new seal and flush system',
    preventiveAction: 'Weekly inspection of hydraulic circuits',
    remarks: 'Validated pump pressure after replacement',
    status: 'Closed',
  },
  {
    id: 2,
    actionNumber: 'ACT-20260602-002',
    ticketId: 2,
    ticketNumber: 'DT-20260602-002',
    machine: 'Pump Station 3',
    actionTaken: 'Diagnosed sensor wiring and reset controller',
    maintenanceEngineer: 'Neha Sharma',
    actionDateTime: '2026-06-02 15:05:00',
    rootCause: 'Loose sensor connection',
    correctiveAction: 'Re-terminate wire and validate signal',
    preventiveAction: 'Install protective conduit for wiring',
    remarks: 'System returned to normal operation',
    status: 'In Progress',
  },
  {
    id: 3,
    actionNumber: 'ACT-20260603-003',
    ticketId: 3,
    ticketNumber: 'DT-20260603-003',
    machine: 'Conveyor A',
    actionTaken: 'Inspected belt and aligned pulleys',
    maintenanceEngineer: 'Rohan Verma',
    actionDateTime: '2026-06-03 11:30:00',
    rootCause: 'Belt misalignment',
    correctiveAction: 'Realigned conveyor belt and tightened bearings',
    preventiveAction: 'Daily trolley alignment checks',
    remarks: 'Continuing monitoring for belt wear',
    status: 'Open',
  },
];

const initialMachines: Machine[] = [
  { id: 1, name: 'Press Unit 14', department: 'Production' },
  { id: 2, name: 'Conveyor A', department: 'Material Handling' },
  { id: 3, name: 'Pump Station 3', department: 'Fluid Systems' },
  { id: 4, name: 'Cooling Tower', department: 'Utilities' },
];

const initialPMSchedules: PMScheduleRecord[] = [
  {
    id: 1,
    machineId: 4,
    machine: 'Cooling Tower',
    category: 'Preventive',
    frequency: 'Monthly',
    scheduledDate: '2026-06-10',
    nextDueDate: '2026-07-10',
    status: 'Upcoming',
    assignedTo: 'Arjun Singh',
    notes: 'Routine coolant system check',
  },
];

const initialTBMSchedules: TBMScheduleRecord[] = [
  {
    id: 1,
    machineId: 3,
    machine: 'Pump Station 3',
    plannedDate: '2026-06-08',
    cycle: '12 months',
    nextDueDate: '2027-06-08',
    status: 'Upcoming',
    owner: 'Priya Rao',
    notes: 'Annual bearing inspection',
  },
];

const DataContext = createContext<DataContextProps | undefined>(undefined);

const deriveDowntimeStatus = (actions: ActionTakenRecord[]): DowntimeStatus => {
  if (!actions.length) return 'Open';
  if (actions.some(action => action.status === 'Open' || action.status === 'In Progress')) {
    return 'In Progress';
  }
  if (actions.every(action => action.status === 'Resolved' || action.status === 'Closed')) {
    return 'Closed';
  }
  return 'Open';
};

const generateActionNumber = (existingCount: number) => {
  const seq = String(existingCount + 1).padStart(3, '0');
  return `ACT-${dayjs().format('YYYYMMDD')}-${seq}`;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [downtimeRecords, setDowntimeRecords] = usePersistentState<DownTimeRecord[]>('maintenance-downtime-records', initialDowntimeRecords);
  const [actionRecords, setActionRecords] = usePersistentState<ActionTakenRecord[]>('maintenance-action-records', initialActionRecords);
  const [machines] = usePersistentState<Machine[]>('maintenance-machines', initialMachines);
  const [pmSchedules, setPMSchedules] = usePersistentState<PMScheduleRecord[]>('maintenance-pm-schedules', initialPMSchedules);
  const [tbmSchedules, setTBMSchedules] = usePersistentState<TBMScheduleRecord[]>('maintenance-tbm-schedules', initialTBMSchedules);
  const [pmCompletions, setPmCompletions] = usePersistentState<PMScheduleCompletionRecord[]>('maintenance-pm-completions', []);
  const [tbmCompletions, setTbmCompletions] = usePersistentState<TBMScheduleCompletionRecord[]>('maintenance-tbm-completions', []);
  const [auditLogs, setAuditLogs] = usePersistentState<AuditLogEntry[]>('maintenance-audit-logs', []);

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id'>) => {
    const newEntry = { id: Date.now(), ...entry } as AuditLogEntry;
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const addAction = (action: Omit<ActionTakenRecord, 'id' | 'actionNumber' | 'ticketNumber' | 'machine'>) => {
    const ticket = downtimeRecords.find(item => item.id === action.ticketId);
    if (!ticket) return;
    const newAction: ActionTakenRecord = {
      id: Date.now(),
      actionNumber: generateActionNumber(actionRecords.length),
      ticketNumber: ticket.ticketNumber,
      machine: ticket.machine,
      ...action,
    };
    setActionRecords(prev => [newAction, ...prev]);
    addAuditLog({
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      user: 'CurrentUser',
      module: 'ActionTaken',
      action: 'Record Created',
      recordReference: `Action#${newAction.id}`,
    });
  };

  const updateAction = (updatedAction: ActionTakenRecord) => {
    setActionRecords(prev => prev.map(item => (item.id === updatedAction.id ? updatedAction : item)));
    addAuditLog({
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      user: 'CurrentUser',
      module: 'ActionTaken',
      action: 'Record Updated',
      recordReference: `Action#${updatedAction.id}`,
    });
  };

  const deleteAction = (actionId: number) => {
    setActionRecords(prev => prev.filter(item => item.id !== actionId));
    addAuditLog({
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      user: 'CurrentUser',
      module: 'ActionTaken',
      action: 'Record Deleted',
      recordReference: `Action#${actionId}`,
    });
  };

  const calculateNextDue = (fromDate: string, frequency: Frequency) => {
    const d = dayjs(fromDate);
    switch (frequency) {
      case 'Daily':
        return d.add(1, 'day').format('YYYY-MM-DD');
      case 'Weekly':
        return d.add(1, 'week').format('YYYY-MM-DD');
      case 'Monthly':
        return d.add(1, 'month').format('YYYY-MM-DD');
      case 'Quarterly':
        return d.add(3, 'month').format('YYYY-MM-DD');
      case 'Yearly':
        return d.add(1, 'year').format('YYYY-MM-DD');
      default:
        return d.add(1, 'month').format('YYYY-MM-DD');
    }
  };

  const deriveScheduleStatus = (nextDue: string, completedDate?: string): ScheduleStatus => {
    if (completedDate) return 'Completed';
    const now = dayjs();
    const due = dayjs(nextDue);
    if (due.isBefore(now, 'day')) return 'Overdue';
    if (due.isSame(now, 'day')) return 'Due';
    return 'Upcoming';
  };

  useEffect(() => {
    setPMSchedules(prev =>
      prev.map(s => {
        const comp = pmCompletions.find(c => c.scheduleId === s.id);
        if (comp) {
          return { ...s, completedDate: comp.completedDate, status: comp.status as ScheduleStatus };
        }
        const status = deriveScheduleStatus(s.nextDueDate, s.completedDate);
        return { ...s, status };
      })
    );
  }, [pmCompletions]);

  useEffect(() => {
    setTBMSchedules(prev =>
      prev.map(s => {
        const comp = tbmCompletions.find(c => c.scheduleId === s.id);
        if (comp) {
          return { ...s, status: comp.status as ScheduleStatus };
        }
        const status = deriveScheduleStatus(s.nextDueDate);
        return { ...s, status };
      })
    );
  }, [tbmCompletions]);

  const updatePMSchedule = (s: PMScheduleRecord) => {
    const nextDue = calculateNextDue(s.scheduledDate, s.frequency);
    const status = deriveScheduleStatus(nextDue, s.completedDate);
    setPMSchedules(prev => prev.map(it => (it.id === s.id ? { ...s, nextDueDate: nextDue, status } : it)));
  };

  const deletePMSchedule = (id: number) => setPMSchedules(prev => prev.filter(it => it.id !== id));

  const addTBMSchedule = (s: Omit<TBMScheduleRecord, 'id' | 'nextDueDate' | 'status'>) => {
    const machine = machines.find(m => m.id === s.machineId);
    const nextDue = s.plannedDate;
    const status = deriveScheduleStatus(nextDue);
    const newItem: TBMScheduleRecord = {
      id: Date.now(),
      nextDueDate: nextDue,
      status,
      ...s,
      machine: machine?.name || s.machineId.toString(),
    };
    setTBMSchedules(prev => [newItem, ...prev]);
  };

  const addPMSchedule = (s: Omit<PMScheduleRecord, 'id' | 'nextDueDate' | 'status'>) => {
    const machine = machines.find(m => m.id === s.machineId);
    const nextDue = calculateNextDue(s.scheduledDate, s.frequency);
    const status = deriveScheduleStatus(nextDue);
    const newItem: PMScheduleRecord = {
      id: Date.now(),
      nextDueDate: nextDue,
      status,
      ...s,
      machine: machine?.name || s.machineId.toString(),
      
    };
    setPMSchedules(prev => [newItem, ...prev]);
  };

  const updateTBMSchedule = (s: TBMScheduleRecord) => {
    const status = deriveScheduleStatus(s.nextDueDate);
    setTBMSchedules(prev => prev.map(it => (it.id === s.id ? { ...s, status } : it)));
  };

  const deleteTBMSchedule = (id: number) => setTBMSchedules(prev => prev.filter(it => it.id !== id));

  const getPMSchedules = () => pmSchedules.slice();
  const getTBMSchedules = () => tbmSchedules.slice();

  const deleteDowntimeRecord = (ticketId: number) => {
    setDowntimeRecords(prev => prev.filter(item => item.id !== ticketId));
    setActionRecords(prev => prev.filter(item => item.ticketId !== ticketId));
    addAuditLog({
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      user: 'CurrentUser',
      module: 'DownTime',
      action: 'Record Deleted',
      recordReference: `Downtime#${ticketId}`,
    });
  };

  const getActionsByTicket = (ticketId: number) =>
    actionRecords
      .filter(action => action.ticketId === ticketId)
      .sort((a, b) => dayjs(b.actionDateTime).diff(dayjs(a.actionDateTime)));

  const getTicketById = (ticketId: number) => downtimeRecords.find(item => item.id === ticketId);

  useEffect(() => {
    setDowntimeRecords(prev =>
      prev.map(ticket => {
        const ticketActions = actionRecords.filter(action => action.ticketId === ticket.id);
        if (!ticketActions.length) {
          return ticket;
        }
        const updatedStatus = deriveDowntimeStatus(ticketActions);
        if (ticket.status !== updatedStatus) {
          return { ...ticket, status: updatedStatus };
        }
        return ticket;
      })
    );
  }, [actionRecords]);

  useEffect(() => {
    setPMSchedules(prev => prev.map(s => ({ ...s, status: deriveScheduleStatus(s.nextDueDate, s.completedDate) })));
  }, [pmSchedules.length]);

  const value = useMemo(
    () => ({
      downtimeRecords,
      setDowntimeRecords,
      actionRecords,
      setActionRecords,
      addAction,
      updateAction,
      deleteAction,
      deleteDowntimeRecord,
      getActionsByTicket,
      getTicketById,
      machines,
      pmSchedules,
      tbmSchedules,
      addPMSchedule,
      updatePMSchedule,
      deletePMSchedule,
      addTBMSchedule,
      updateTBMSchedule,
      deleteTBMSchedule,
      getPMSchedules,
      getTBMSchedules,
      pmCompletions,
      setPmCompletions,
      tbmCompletions,
      setTbmCompletions,
      auditLogs,
      addAuditLog,
    }),
    [downtimeRecords, actionRecords, machines, pmCompletions, tbmCompletions, pmSchedules, tbmSchedules, auditLogs]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataProvider');
  }
  return context;
};
