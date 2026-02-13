import { Router, type IRouter, Request, Response } from "express";
import { prisma } from "../services/db.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createCalendarEventSchema, updateCalendarEventSchema } from "@western-mass-septic/shared";

export const calendarRouter: IRouter = Router();
calendarRouter.use(authenticate);

calendarRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { start, end, userId } = req.query;
    const where: Record<string, unknown> = {};

    if (start && end) {
      where.start = { gte: new Date(start as string) };
      where.end = { lte: new Date(end as string) };
    }
    if (userId) where.userId = userId;

    const events = await prisma.calendarEvent.findMany({
      where: where as object,
      orderBy: { start: "asc" },
      include: {
        lead: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });

    res.json(events);
  } catch {
    res.status(500).json({ message: "Failed to fetch events", statusCode: 500 });
  }
});

calendarRouter.post("/", validate(createCalendarEventSchema), async (req: Request, res: Response) => {
  try {
    const event = await prisma.calendarEvent.create({
      data: {
        ...req.body,
        start: new Date(req.body.start),
        end: new Date(req.body.end),
        userId: req.user!.userId,
      },
      include: {
        lead: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
    res.status(201).json(event);
  } catch {
    res.status(500).json({ message: "Failed to create event", statusCode: 500 });
  }
});

calendarRouter.patch("/:id", validate(updateCalendarEventSchema), async (req: Request, res: Response) => {
  try {
    const data: Record<string, unknown> = { ...req.body };
    if (data.start) data.start = new Date(data.start as string);
    if (data.end) data.end = new Date(data.end as string);

    const event = await prisma.calendarEvent.update({
      where: { id: String(req.params.id) },
      data: data as object,
      include: {
        lead: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
    res.json(event);
  } catch {
    res.status(500).json({ message: "Failed to update event", statusCode: 500 });
  }
});

calendarRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.calendarEvent.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete event", statusCode: 500 });
  }
});
