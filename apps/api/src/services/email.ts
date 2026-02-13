import nodemailer from "nodemailer";
import { company } from "@western-mass-septic/config";

let transporter: nodemailer.Transporter | null = null;

if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

interface LeadData {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

export async function sendNewLeadNotification(lead: LeadData): Promise<void> {
  const subject = `New ${company.pipeline.entityName}: ${lead.name}`;
  const text = [
    `A new ${company.pipeline.entityName.toLowerCase()} has been submitted via the website.`,
    "",
    `Name: ${lead.name}`,
    lead.email ? `Email: ${lead.email}` : "",
    lead.phone ? `Phone: ${lead.phone}` : "",
    "",
    `View in CRM: ${process.env.CRM_URL || "http://localhost:5174"}/leads/${lead.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!transporter) {
    console.log(`[Email] Would send notification:\n  To: ${company.email}\n  Subject: ${subject}\n  Body: ${text}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${company.name}" <noreply@${company.email.split("@")[1]}>`,
    to: company.email,
    subject,
    text,
  });
}

export async function sendTaskReminder(userEmail: string, taskTitle: string, dueDate: string): Promise<void> {
  const subject = `Task Reminder: ${taskTitle}`;
  const text = [
    `You have a task due soon.`,
    "",
    `Task: ${taskTitle}`,
    `Due: ${dueDate}`,
    "",
    `View in CRM: ${process.env.CRM_URL || "http://localhost:5174"}/activities`,
  ].join("\n");

  if (!transporter) {
    console.log(`[Email] Would send reminder:\n  To: ${userEmail}\n  Subject: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${company.name}" <noreply@${company.email.split("@")[1]}>`,
    to: userEmail,
    subject,
    text,
  });
}
