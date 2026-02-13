// Shared types used across landing page, CRM, and API

export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  stage: string;
  source: string | null;
  assignedToId: string | null;
  assignedTo?: User | null;
  customFields: Record<string, unknown>;
  notes?: Note[];
  activities?: Activity[];
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  leadId: string;
  authorId: string;
  author?: User;
  createdAt: string;
}

export type ActivityType = "CALL" | "EMAIL" | "MEETING" | "TASK" | "NOTE";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  leadId: string | null;
  lead?: Lead | null;
  assignedToId: string | null;
  assignedTo?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start: string;
  end: string;
  allDay: boolean;
  leadId: string | null;
  lead?: Lead | null;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  leadId: string;
  uploadedById: string;
  uploadedBy?: User;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CreateLeadRequest {
  name: string;
  email?: string;
  phone?: string;
  stage?: string;
  source?: string;
  assignedToId?: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateLeadRequest {
  name?: string;
  email?: string;
  phone?: string;
  stage?: string;
  source?: string;
  assignedToId?: string;
  customFields?: Record<string, unknown>;
}

export interface CreateNoteRequest {
  content: string;
  leadId: string;
}

export interface CreateActivityRequest {
  type: ActivityType;
  title: string;
  description?: string;
  dueDate?: string;
  leadId?: string;
  assignedToId?: string;
}

export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  assignedToId?: string;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  leadId?: string;
}

export interface UpdateCalendarEventRequest {
  title?: string;
  description?: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  leadId?: string;
}

export interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalLeads: number;
  leadsByStage: Record<string, number>;
  recentLeads: Lead[];
  upcomingActivities: Activity[];
  conversionRate: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
}
