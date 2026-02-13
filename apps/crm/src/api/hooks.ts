import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type {
  Lead,
  Activity,
  CalendarEvent,
  User,
  DashboardStats,
  PaginatedResponse,
  CreateLeadRequest,
  UpdateLeadRequest,
  CreateActivityRequest,
  UpdateActivityRequest,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
  CreateNoteRequest,
} from "@western-mass-septic/shared";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: () => api.get("/dashboard/stats").then((r) => r.data),
  });
}

export function useLeads(params?: { page?: number; pageSize?: number; stage?: string; search?: string }) {
  return useQuery<PaginatedResponse<Lead>>({
    queryKey: ["leads", params],
    queryFn: () => api.get("/leads", { params }).then((r) => r.data),
  });
}

export function useLead(id: string) {
  return useQuery<Lead>({
    queryKey: ["leads", id],
    queryFn: () => api.get(`/leads/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadRequest) => api.post("/leads", data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateLeadRequest & { id: string }) =>
      api.patch(`/leads/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateLeadStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api.patch(`/leads/${id}/stage`, { stage }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoteRequest) => api.post("/notes", data).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["leads", variables.leadId] });
    },
  });
}

export function useActivities(params?: { leadId?: string; completed?: string }) {
  return useQuery<Activity[]>({
    queryKey: ["activities", params],
    queryFn: () => api.get("/activities", { params }).then((r) => r.data),
  });
}

export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateActivityRequest) => api.post("/activities", data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activities"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateActivityRequest & { id: string }) =>
      api.patch(`/activities/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activities"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCalendarEvents(params?: { start?: string; end?: string }) {
  return useQuery<CalendarEvent[]>({
    queryKey: ["calendar", params],
    queryFn: () => api.get("/calendar", { params }).then((r) => r.data),
  });
}

export function useCreateCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCalendarEventRequest) => api.post("/calendar", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  });
}

export function useUpdateCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateCalendarEventRequest & { id: string }) =>
      api.patch(`/calendar/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar"] }),
  });
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((r) => r.data),
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, file }: { leadId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("leadId", leadId);
      return api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then((r) => r.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
