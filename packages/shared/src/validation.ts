import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "USER"]).optional().default("USER"),
});

export const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  stage: z.string().optional(),
  source: z.string().optional(),
  assignedToId: z.string().optional(),
  customFields: z.record(z.unknown()).optional().default({}),
});

export const updateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  stage: z.string().optional(),
  source: z.string().optional(),
  assignedToId: z.string().nullable().optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const createNoteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
  leadId: z.string().min(1, "Lead ID is required"),
});

export const createActivitySchema = z.object({
  type: z.enum(["CALL", "EMAIL", "MEETING", "TASK", "NOTE"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  leadId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const updateActivitySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
  assignedToId: z.string().nullable().optional(),
});

export const createCalendarEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
  allDay: z.boolean().optional().default(false),
  leadId: z.string().optional(),
});

export const updateCalendarEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  allDay: z.boolean().optional(),
  leadId: z.string().nullable().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(1, "Message is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
export type CreateCalendarEventInput = z.infer<typeof createCalendarEventSchema>;
export type UpdateCalendarEventInput = z.infer<typeof updateCalendarEventSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
