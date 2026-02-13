import { Router, type IRouter, Request, Response } from "express";
import { prisma } from "../services/db.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createLeadSchema, updateLeadSchema } from "@western-mass-septic/shared";

export const leadsRouter: IRouter = Router();
leadsRouter.use(authenticate);

leadsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", pageSize = "50", stage, search, assignedToId } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where: Record<string, unknown> = {};
    if (stage) where.stage = stage;
    if (assignedToId) where.assignedToId = assignedToId;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
        { phone: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where: where as object,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: { assignedTo: { select: { id: true, name: true, email: true } } },
      }),
      prisma.lead.count({ where: where as object }),
    ]);

    res.json({
      data,
      total,
      page: Number(page),
      pageSize: take,
      totalPages: Math.ceil(total / take),
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch leads", statusCode: 500 });
  }
});

leadsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: String(req.params.id) },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        notes: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { id: true, name: true } } },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          include: { assignedTo: { select: { id: true, name: true } } },
        },
        documents: {
          orderBy: { createdAt: "desc" },
          include: { uploadedBy: { select: { id: true, name: true } } },
        },
      },
    });

    if (!lead) {
      res.status(404).json({ message: "Lead not found", statusCode: 404 });
      return;
    }

    res.json(lead);
  } catch {
    res.status(500).json({ message: "Failed to fetch lead", statusCode: 500 });
  }
});

leadsRouter.post("/", validate(createLeadSchema), async (req: Request, res: Response) => {
  try {
    const lead = await prisma.lead.create({
      data: req.body,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
    res.status(201).json(lead);
  } catch {
    res.status(500).json({ message: "Failed to create lead", statusCode: 500 });
  }
});

leadsRouter.patch("/:id", validate(updateLeadSchema), async (req: Request, res: Response) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: String(req.params.id) },
      data: req.body,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
    res.json(lead);
  } catch {
    res.status(500).json({ message: "Failed to update lead", statusCode: 500 });
  }
});

leadsRouter.patch("/:id/stage", async (req: Request, res: Response) => {
  try {
    const { stage } = req.body;
    if (!stage) {
      res.status(400).json({ message: "Stage is required", statusCode: 400 });
      return;
    }

    const lead = await prisma.lead.update({
      where: { id: String(req.params.id) },
      data: { stage },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
    res.json(lead);
  } catch {
    res.status(500).json({ message: "Failed to update stage", statusCode: 500 });
  }
});

leadsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.lead.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete lead", statusCode: 500 });
  }
});
