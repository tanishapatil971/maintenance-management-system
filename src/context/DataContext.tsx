import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import dayjs from 'dayjs';

export type DowntimeStatus = 'Open' | 'In Progress' | 'Closed';
export type ActionStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

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

interface DataContextProps {
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
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

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
  const [downtimeRecords, setDowntimeRecords] = useState<DownTimeRecord[]>(initialDowntimeRecords);
  const [actionRecords, setActionRecords] = useState<ActionTakenRecord[]>(initialActionRecords);

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
  };

  const updateAction = (updatedAction: ActionTakenRecord) => {
    setActionRecords(prev => prev.map(item => (item.id === updatedAction.id ? updatedAction : item)));
  };

  const deleteAction = (actionId: number) => {
    setActionRecords(prev => prev.filter(item => item.id !== actionId));
  };

  const deleteDowntimeRecord = (ticketId: number) => {
    setDowntimeRecords(prev => prev.filter(item => item.id !== ticketId));
    setActionRecords(prev => prev.filter(item => item.ticketId !== ticketId));
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
    }),
    [downtimeRecords, actionRecords]
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
