import { Router, type IRouter, Request, Response } from "express";
import { prisma } from "../services/db.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createActivitySchema, updateActivitySchema } from "@western-mass-septic/shared";

export const activitiesRouter: IRouter = Router();
activitiesRouter.use(authenticate);

activitiesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { leadId, completed, assignedToId, type } = req.query;
    const where: Record<string, unknown> = {};
    if (leadId) where.leadId = leadId;
    if (completed !== undefined) where.completed = completed === "true";
    if (assignedToId) where.assignedToId = assignedToId;
    if (type) where.type = type;

    const activities = await prisma.activity.findMany({
      where: where as object,
      orderBy: { createdAt: "desc" },
      include: {
        lead: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });

    res.json(activities);
  } catch {
    res.status(500).json({ message: "Failed to fetch activities", statusCode: 500 });
  }
});

activitiesRouter.post("/", validate(createActivitySchema), async (req: Request, res: Response) => {
  try {
    const activity = await prisma.activity.create({
      data: {
        ...req.body,
        assignedToId: req.body.assignedToId || req.user!.userId,
      },
      include: {
        lead: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
    res.status(201).json(activity);
  } catch {
    res.status(500).json({ message: "Failed to create activity", statusCode: 500 });
  }
});

activitiesRouter.patch("/:id", validate(updateActivitySchema), async (req: Request, res: Response) => {
  try {
    const activity = await prisma.activity.update({
      where: { id: String(req.params.id) },
      data: req.body,
      include: {
        lead: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
    res.json(activity);
  } catch {
    res.status(500).json({ message: "Failed to update activity", statusCode: 500 });
  }
});

activitiesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.activity.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete activity", statusCode: 500 });
  }
});
