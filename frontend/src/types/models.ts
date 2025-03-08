export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  userId: number;
  name: string;
  client: string;
  hourlyRate: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HourRegistration {
  id: number;
  userId: number;
  projectId: number;
  date: string;
  hours: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  projectName?: string;
  projectClient?: string;
}

export interface YearlyTarget {
  id: number;
  year: number;
  target: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyStats {
  month: string;
  total_hours: number;
}

export interface YearlyTargetStats {
  year: number;
  target_hours: number;
  actual_hours: number;
}

export interface CreateProjectData {
  name: string;
  client: string;
  hourlyRate: number;
  startDate: string;
  endDate?: string;
}

export interface UpdateProjectData extends CreateProjectData {
  id: number;
}

export interface CreateHourRegistrationData {
  projectId: number;
  date: string;
  hours: number;
  description: string;
}

export interface UpdateHourRegistrationData extends Omit<CreateHourRegistrationData, 'projectId'> {
  id: number;
}

export interface CreateYearlyTargetData {
  year: number;
  target: number;
}

export interface UpdateYearlyTargetData extends CreateYearlyTargetData {
  id: number;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithRoles extends User {
  roles: Role[];
  permissions: Permission[];
} 