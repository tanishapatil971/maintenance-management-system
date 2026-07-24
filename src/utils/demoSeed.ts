import dayjs from 'dayjs';
import { loadStoredState, saveStoredState } from './persistence';

type DemoSeedOptions = {
  force?: boolean;
};

type DepartmentRecord = {
  id: number;
  name: string;
  description: string;
};

type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
};

type MachineMasterRecord = {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  department: string;
  status: 'Running' | 'Idle' | 'Breakdown' | 'Maintenance';
  manufacturer: string;
  capacity: string;
  location: string;
  installationDate: string;
};

type DemoMachineContextRecord = {
  id: number;
  name: string;
  department: string;
};

type DemoDowntimeContextRecord = {
  id: number;
  ticketNumber: string;
  machine: string;
  machineId: number;
  department: string;
  downTimeReason: string;
  startDateTime: string;
  endDateTime: string;
  duration: string;
  status: 'Open' | 'In Progress' | 'Closed';
  remarks: string;
};

type DemoActionRecord = {
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
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
};

type DemoPMScheduleRecord = {
  id: number;
  machineId: number;
  machine: string;
  category: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  scheduledDate: string;
  nextDueDate: string;
  status: 'Upcoming' | 'Due' | 'Overdue' | 'Completed';
  assignedTo: string;
  notes?: string;
  completedDate?: string;
};

type DemoTBMScheduleRecord = {
  id: number;
  machineId: number;
  machine: string;
  plannedDate: string;
  cycle: string;
  nextDueDate: string;
  status: 'Upcoming' | 'Due' | 'Overdue' | 'Completed';
  owner: string;
  notes?: string;
};

type DemoPMScheduleCompletionRecord = {
  id: number;
  scheduleId: number;
  machine: string;
  completedDate: string;
  inspectionResult: 'Pass' | 'Fail';
  performedBy: string;
  remarks?: string;
  status: 'Completed' | 'Delayed' | 'Pending';
};

type DemoTBMScheduleCompletionRecord = {
  id: number;
  scheduleId: number;
  machine: string;
  completedDate: string;
  inspectionResult: 'Pass' | 'Fail';
  performedBy: string;
  remarks?: string;
  status: 'Completed' | 'Delayed' | 'Pending';
};

type DemoSeedPayload = {
  'maintenance-department-master': DepartmentRecord[];
  'maintenance-user-master': UserRecord[];
  'maintenance-machine-master': MachineMasterRecord[];
  'maintenance-downtime-master': Array<{ id: number; machine: string; category: string; status: string; reason: string }>;
  'maintenance-actiontaken-master': Array<{ id: number; action: string; technician: string; effectiveness: string }>;
  'maintenance-machines': DemoMachineContextRecord[];
  'maintenance-downtime-records': DemoDowntimeContextRecord[];
  'maintenance-action-records': DemoActionRecord[];
  'maintenance-pm-schedules': DemoPMScheduleRecord[];
  'maintenance-tbm-schedules': DemoTBMScheduleRecord[];
  'maintenance-pm-completions': DemoPMScheduleCompletionRecord[];
  'maintenance-tbm-completions': DemoTBMScheduleCompletionRecord[];
  'maintenance-audit-logs': Array<{ id: number; timestamp: string; user: string; module: string; action: string; recordReference: string }>;
};

const STORAGE_MARKER = 'maintenance-demo-seed-marker';
const SEED_VERSION = 1;
const isBrowser = typeof window !== 'undefined';

const departments = ['Production', 'Assembly', 'Packaging', 'Warehouse', 'Quality', 'Utility'] as const;
const departmentDescriptions: Record<string, string> = {
  Production: 'Primary line output and process throughput management.',
  Assembly: 'Final assembly and hardware integration operations.',
  Packaging: 'Cartonizing, palletizing, and dispatch packaging procedures.',
  Warehouse: 'Raw material, finished good, and spare part logistics.',
  Quality: 'Inspection, compliance, and process assurance activities.',
  Utility: 'Energy, utilities, and facility support systems.',
};
const maintenanceEngineers = [
  'Amit Sharma',
  'Priya Rao',
  'Rohan Verma',
  'Neha Sharma',
  'Arjun Singh',
  'Sanjay Kumar',
  'Anita Desai',
  'Karan Malhotra',
  'Varun Iyer',
  'Meera Nair',
  'Nikhil Patel',
  'Deepa Menon',
];
const manufacturers = ['Siemens', 'ABB', 'Fanuc', 'Schneider Electric', 'Mitsubishi', 'Bosch', 'Rockwell', 'Yaskawa', 'Emerson', 'SKF'];
const downtimeReasons = [
  'Bearing failure',
  'Sensor malfunction',
  'Belt misalignment',
  'Hydraulic leak',
  'Electrical trip',
  'PLC communication fault',
  'Motor overload',
  'Lubrication issue',
  'Calibration drift',
  'Vibration abnormality',
  'Pressure fluctuation',
  'Filter clogging',
];
const actionTypes = [
  'Bearing replacement',
  'Lubrication',
  'PLC reset',
  'Sensor replacement',
  'Motor rewinding',
  'Belt replacement',
  'Alignment',
  'Calibration',
  'Testing',
  'Verification',
] as const;
const machinePrefixes = [
  'CNC',
  'Press',
  'Mixer',
  'PLC',
  'Conveyor',
  'Filler',
  'Labeler',
  'Forklift',
  'Crusher',
  'Compressor',
  'Loader',
  'Pump',
];
const machineModels = ['MX-120', 'AX-240', 'FT-58', 'PL-310', 'CM-080', 'RF-410', 'BL-200', 'PR-750'];
const locations = ['Line A', 'Line B', 'Line C', 'Line D', 'Bay 01', 'Bay 02', 'Warehouse Zone 1', 'Utility Room', 'Packing Cell 1'];
const capacities = ['2.4 TPH', '8.5 TPH', '14.2 kW', '3.0 m³/min', '12.0 T', '450 kg/hr', '18.0 kW', '32.0 kPa'];
const statusPool: MachineMasterRecord['status'][] = ['Running', 'Idle', 'Breakdown', 'Maintenance'];

const makeDateTime = (offsetDays: number, hour: number, minute: number) =>
  dayjs().subtract(offsetDays, 'day').hour(hour).minute(minute).second(0).format('YYYY-MM-DD HH:mm:ss');
const formatDuration = (hours: number) => {
  const hh = String(Math.floor(hours)).padStart(2, '0');
  const mm = String(Math.round((hours % 1) * 60)).padStart(2, '0');
  return `${hh}:${mm}:00`;
};
const random = (list: readonly string[]) => list[Math.floor(Math.random() * list.length)];
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const buildMachineMasterData = (): MachineMasterRecord[] => {
  const records: MachineMasterRecord[] = [];
  for (let i = 1; i <= 120; i += 1) {
    const department = departments[(i - 1) % departments.length];
    const status = statusPool[(i + 2) % statusPool.length];
    const manufacturer = random(manufacturers);
    const serial = `MCH-${String(i).padStart(4, '0')}`;
    const model = machineModels[(i - 1) % machineModels.length];
    const location = `${locations[(i - 1) % locations.length]}-${String(randomBetween(1, 9)).padStart(2, '0')}`;
    const installationDate = dayjs().subtract(randomBetween(12, 84), 'month').format('YYYY-MM-DD');
    const machineName = `${random(machinePrefixes)} ${String(i).padStart(3, '0')}`;
    records.push({
      id: i,
      name: machineName,
      model,
      serialNumber: serial,
      department,
      status,
      manufacturer,
      capacity: random(capacities),
      location,
      installationDate,
    });
  }
  return records;
};

const buildMachineContextData = (machines: MachineMasterRecord[]): DemoMachineContextRecord[] =>
  machines.map(machine => ({ id: machine.id, name: machine.name, department: machine.department }));

const buildDepartmentMasterData = (): DepartmentRecord[] =>
  departments.map((department, index) => ({
    id: index + 1,
    name: department,
    description: departmentDescriptions[department],
  }));

const buildUserMasterData = (): UserRecord[] => [
  { id: 1, name: 'Riya Patel', email: 'riya.patel@enterpriseplant.com', role: 'Admin', department: 'Quality' },
  { id: 2, name: 'Arjun Singh', email: 'arjun.singh@enterpriseplant.com', role: 'Maintenance Manager', department: 'Production' },
  { id: 3, name: 'Priya Rao', email: 'priya.rao@enterpriseplant.com', role: 'Maintenance Engineer', department: 'Utility' },
  { id: 4, name: 'Sanjay Kumar', email: 'sanjay.kumar@enterpriseplant.com', role: 'Supervisor', department: 'Assembly' },
  { id: 5, name: 'Neha Sharma', email: 'neha.sharma@enterpriseplant.com', role: 'Operator', department: 'Packaging' },
  { id: 6, name: 'Rohan Verma', email: 'rohan.verma@enterpriseplant.com', role: 'Maintenance Engineer', department: 'Warehouse' },
  { id: 7, name: 'Anita Desai', email: 'anita.desai@enterpriseplant.com', role: 'Supervisor', department: 'Production' },
  { id: 8, name: 'Karan Malhotra', email: 'karan.malhotra@enterpriseplant.com', role: 'Operator', department: 'Assembly' },
];

const buildDowntimeData = (machines: MachineMasterRecord[]): DemoDowntimeContextRecord[] => {
  const records: DemoDowntimeContextRecord[] = [];
  let ticketId = 1;

  for (let i = 0; i < 340; i += 1) {
    const machine = machines[i % machines.length];
    const status: DemoDowntimeContextRecord['status'] = i % 7 === 0 ? 'Open' : i % 5 === 0 ? 'In Progress' : 'Closed';
    const startDaysAgo = randomBetween(5, 365);
    const startHour = randomBetween(6, 18);
    const startMinute = randomBetween(0, 59);
    const durationHours = randomBetween(1, 12);
    const startDate = dayjs().subtract(startDaysAgo, 'day').hour(startHour).minute(startMinute).second(0);
    const endDate = status === 'Closed' ? startDate.add(durationHours, 'hour') : null;
    records.push({
      id: ticketId,
      ticketNumber: `DT-${startDate.format('YYYYMMDD')}-${String(ticketId).padStart(3, '0')}`,
      machine: machine.name,
      machineId: machine.id,
      department: machine.department,
      downTimeReason: random(downtimeReasons),
      startDateTime: startDate.format('YYYY-MM-DD HH:mm:ss'),
      endDateTime: endDate ? endDate.format('YYYY-MM-DD HH:mm:ss') : '',
      duration: formatDuration(durationHours),
      status,
      remarks: status === 'Closed' ? 'Corrective action completed and verified.' : 'Awaiting technician dispatch and follow-up.',
    });
    ticketId += 1;
  }

  return records;
};

const buildActionData = (downtimeRecords: DemoDowntimeContextRecord[]): DemoActionRecord[] => {
  const records: DemoActionRecord[] = [];
  let id = 1;

  downtimeRecords.forEach((ticket, index) => {
    if (index % 3 !== 0) {
      return;
    }

    const actionTaken = random(actionTypes);
    const engineer = random(maintenanceEngineers);
    const actionDate = dayjs(ticket.startDateTime).add(randomBetween(0, 4), 'hour');
    const status: DemoActionRecord['status'] = ticket.status === 'Open' ? 'Open' : ticket.status === 'In Progress' ? 'In Progress' : 'Resolved';
    records.push({
      id,
      actionNumber: `ACT-${actionDate.format('YYYYMMDD')}-${String(id).padStart(3, '0')}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      machine: ticket.machine,
      actionTaken,
      maintenanceEngineer: engineer,
      actionDateTime: actionDate.format('YYYY-MM-DD HH:mm:ss'),
      rootCause: `Root cause identified from ${ticket.downTimeReason.toLowerCase()}.`,
      correctiveAction: `${actionTaken} performed on ${ticket.machine}.`,
      preventiveAction: `Weekly verification checklist for ${ticket.machine}.`,
      remarks: `Action validated by ${engineer}.`,
      status,
    });
    id += 1;
  });

  return records;
};

const buildPMScheduleData = (machines: MachineMasterRecord[]): DemoPMScheduleRecord[] => {
  const records: DemoPMScheduleRecord[] = [];
  const frequencies: Array<DemoPMScheduleRecord['frequency']> = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];
  let id = 1;

  machines.forEach((machine, index) => {
    const frequency = frequencies[index % frequencies.length];
    const scheduledDate = dayjs().subtract(randomBetween(0, 25), 'day').format('YYYY-MM-DD');
    const nextDueDate = dayjs(scheduledDate).add(frequency === 'Daily' ? 1 : frequency === 'Weekly' ? 7 : frequency === 'Monthly' ? 30 : 90, 'day').format('YYYY-MM-DD');
    const completedDate = index % 3 === 0 ? dayjs().subtract(randomBetween(1, 8), 'day').format('YYYY-MM-DD') : undefined;
    records.push({
      id,
      machineId: machine.id,
      machine: machine.name,
      category: 'Preventive',
      frequency,
      scheduledDate,
      nextDueDate,
      status: completedDate ? 'Completed' : index % 5 === 0 ? 'Due' : 'Upcoming',
      assignedTo: random(maintenanceEngineers),
      notes: `${frequency} preventive inspection for ${machine.name}.`,
      completedDate,
    });
    id += 1;
  });

  return records;
};

const buildTBMScheduleData = (machines: MachineMasterRecord[]): DemoTBMScheduleRecord[] => {
  const records: DemoTBMScheduleRecord[] = [];
  let id = 1;

  machines.slice(0, 96).forEach((machine, index) => {
    const plannedDate = dayjs().subtract(randomBetween(40, 160), 'day').format('YYYY-MM-DD');
    const nextDueDate = dayjs(plannedDate).add(index % 3 === 0 ? 15 : index % 4 === 0 ? 30 : 60, 'day').format('YYYY-MM-DD');
    records.push({
      id,
      machineId: machine.id,
      machine: machine.name,
      plannedDate,
      cycle: index % 4 === 0 ? '6 months' : '12 months',
      nextDueDate,
      status: index % 6 === 0 ? 'Overdue' : index % 4 === 0 ? 'Due' : 'Upcoming',
      owner: random(maintenanceEngineers),
      notes: `${machine.name} time-based servicing plan.`,
    });
    id += 1;
  });

  return records;
};

const buildPMCompletionData = (pmSchedules: DemoPMScheduleRecord[]): DemoPMScheduleCompletionRecord[] => {
  const records: DemoPMScheduleCompletionRecord[] = [];
  let id = 1;

  pmSchedules.forEach((schedule, index) => {
    if (index % 4 !== 0) {
      return;
    }

    const completedDate = dayjs(schedule.scheduledDate).add(randomBetween(0, 2), 'day').format('YYYY-MM-DD');
    records.push({
      id,
      scheduleId: schedule.id,
      machine: schedule.machine,
      completedDate,
      inspectionResult: index % 5 === 0 ? 'Fail' : 'Pass',
      performedBy: schedule.assignedTo,
      remarks: `Inspection completed for ${schedule.machine}.`,
      status: 'Completed',
    });
    id += 1;
  });

  return records;
};

const buildTBMCompletionData = (tbmSchedules: DemoTBMScheduleRecord[]): DemoTBMScheduleCompletionRecord[] => {
  const records: DemoTBMScheduleCompletionRecord[] = [];
  let id = 1;

  tbmSchedules.forEach((schedule, index) => {
    if (index % 5 !== 0) {
      return;
    }

    const completedDate = dayjs(schedule.plannedDate).add(randomBetween(1, 7), 'day').format('YYYY-MM-DD');
    records.push({
      id,
      scheduleId: schedule.id,
      machine: schedule.machine,
      completedDate,
      inspectionResult: index % 6 === 0 ? 'Fail' : 'Pass',
      performedBy: schedule.owner,
      remarks: `TBM service completed for ${schedule.machine}.`,
      status: 'Completed',
    });
    id += 1;
  });

  return records;
};

const buildAuditLogs = (downtimeRecords: DemoDowntimeContextRecord[], actionRecords: DemoActionRecord[]): DemoSeedPayload['maintenance-audit-logs'] => {
  const logs: DemoSeedPayload['maintenance-audit-logs'] = [];
  let id = 1;

  downtimeRecords.slice(0, 30).forEach((ticket, index) => {
    logs.push({
      id,
      timestamp: makeDateTime(30 - index, randomBetween(8, 17), randomBetween(0, 59)),
      user: random(maintenanceEngineers),
      module: 'DownTime',
      action: 'Record Created',
      recordReference: ticket.ticketNumber,
    });
    id += 1;
  });

  actionRecords.slice(0, 20).forEach((action, index) => {
    logs.push({
      id,
      timestamp: makeDateTime(20 - index,randomBetween(7,18),randomBetween(0,59)),
      user: action.maintenanceEngineer,
      module: 'ActionTaken',
      action: 'Record Updated',
      recordReference: action.actionNumber,
    });
    id += 1;
  });

  return logs;
};

export const clearDemoData = () => {
  if (!isBrowser) return;

  const keys = [
    'maintenance-department-master',
    'maintenance-user-master',
    'maintenance-machine-master',
    'maintenance-downtime-master',
    'maintenance-actiontaken-master',
    'maintenance-machines',
    'maintenance-downtime-records',
    'maintenance-action-records',
    'maintenance-pm-schedules',
    'maintenance-tbm-schedules',
    'maintenance-pm-completions',
    'maintenance-tbm-completions',
    'maintenance-audit-logs',
    STORAGE_MARKER,
  ];

  keys.forEach(key => window.localStorage.removeItem(key));
};

export const seedDemoData = (options: DemoSeedOptions = {}): DemoSeedPayload | null => {
  if (!isBrowser) {
    return null;
  }

  const hasSeedMarker = Boolean(window.localStorage.getItem(STORAGE_MARKER));
  if (!options.force && hasSeedMarker) {
    return null;
  }

  const machineMasterData = buildMachineMasterData();
  const machineContextData = buildMachineContextData(machineMasterData);
  const downtimeData = buildDowntimeData(machineMasterData);
  const actionData = buildActionData(downtimeData);
  const pmScheduleData = buildPMScheduleData(machineMasterData);
  const tbmScheduleData = buildTBMScheduleData(machineMasterData);
  const pmCompletionData = buildPMCompletionData(pmScheduleData);
  const tbmCompletionData = buildTBMCompletionData(tbmScheduleData);
  const auditLogs = buildAuditLogs(downtimeData, actionData);

  const payload: DemoSeedPayload = {
    'maintenance-department-master': buildDepartmentMasterData(),
    'maintenance-user-master': buildUserMasterData(),
    'maintenance-machine-master': machineMasterData,
    'maintenance-downtime-master': downtimeData.map(ticket => ({
      id: ticket.id,
      machine: ticket.machine,
      category: ticket.department,
      status: ticket.status,
      reason: ticket.downTimeReason,
    })),
    'maintenance-actiontaken-master': actionData.map(action => ({
      id: action.id,
      action: action.actionTaken,
      technician: action.maintenanceEngineer,
      effectiveness: action.status === 'Closed' ? 'High' : action.status === 'Resolved' ? 'Medium' : 'Low',
    })),
    'maintenance-machines': machineContextData,
    'maintenance-downtime-records': downtimeData,
    'maintenance-action-records': actionData,
    'maintenance-pm-schedules': pmScheduleData,
    'maintenance-tbm-schedules': tbmScheduleData,
    'maintenance-pm-completions': pmCompletionData,
    'maintenance-tbm-completions': tbmCompletionData,
    'maintenance-audit-logs': auditLogs,
  };

  Object.entries(payload).forEach(([key, value]) => {
    saveStoredState(key, value);
  });

  window.localStorage.setItem(STORAGE_MARKER, JSON.stringify({ version: SEED_VERSION, seededAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }));

  return payload;
};

export const seedImport = () => {
  if (typeof window !== 'undefined') {
    (window as typeof window & { __demoSeed?: typeof seedDemoData }).__demoSeed = seedDemoData;
    (window as typeof window & { __clearDemoData?: typeof clearDemoData }).__clearDemoData = clearDemoData;
  }
};

if (isBrowser) {
  seedImport();
}

const loadSeededValue = <T,>(key: string, fallbackValue: T): T => {
  const stored = loadStoredState<T>(key, fallbackValue);
  return stored;
};

export const getSeededDemoState = () => ({
  departments: loadSeededValue('maintenance-department-master', [] as DepartmentRecord[]),
  users: loadSeededValue('maintenance-user-master', [] as UserRecord[]),
  machines: loadSeededValue('maintenance-machines', [] as DemoMachineContextRecord[]),
});
