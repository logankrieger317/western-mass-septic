import { Router, type IRouter, Request, Response } from "express";
import { prisma } from "../services/db.js";
import { validate } from "../middleware/validate.js";
import { contactFormSchema } from "@western-mass-septic/shared";
import { company } from "@western-mass-septic/config";
import { sendNewLeadNotification } from "../services/email.js";

export const contactRouter: IRouter = Router();

contactRouter.post("/", validate(contactFormSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    const defaultStage = company.pipeline.stages[0]?.key || "lead";

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        stage: defaultStage,
        source: "website",
        customFields: {},
      },
    });

    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (admin) {
      await prisma.note.create({
        data: {
          content: `Contact form submission:\n\n${message}`,
          leadId: lead.id,
          authorId: admin.id,
        },
      });
    }

    sendNewLeadNotification(lead).catch(console.error);

    res.status(201).json({ message: "Thank you! We'll be in touch soon." });
  } catch {
    res.status(500).json({ message: "Failed to submit contact form", statusCode: 500 });
  }
});
