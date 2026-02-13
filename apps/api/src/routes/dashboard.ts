import { Router, type IRouter, Request, Response } from "express";
import { prisma } from "../services/db.js";
import { authenticate } from "../middleware/auth.js";
import { company } from "@western-mass-septic/config";

export const dashboardRouter: IRouter = Router();
dashboardRouter.use(authenticate);

dashboardRouter.get("/stats", async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const closedStage = company.pipeline.stages[company.pipeline.stages.length - 1]?.key ?? "closed";

    const [
      totalLeads,
      leadsThisMonth,
      leadsLastMonth,
      leadsByStageRaw,
      recentLeads,
      upcomingActivities,
      closedLeads,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.lead.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
      }),
      prisma.lead.groupBy({ by: ["stage"], _count: { id: true } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { assignedTo: { select: { id: true, name: true } } },
      }),
      prisma.activity.findMany({
        where: { completed: false, dueDate: { gte: now } },
        take: 5,
        orderBy: { dueDate: "asc" },
        include: {
          lead: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      prisma.lead.count({ where: { stage: closedStage } }),
    ]);

    const leadsByStage: Record<string, number> = {};
    leadsByStageRaw.forEach((item: { stage: string; _count: { id: number } }) => {
      leadsByStage[item.stage] = item._count.id;
    });

    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

    res.json({
      totalLeads,
      leadsByStage,
      recentLeads,
      upcomingActivities,
      conversionRate: Math.round(conversionRate * 10) / 10,
      leadsThisMonth,
      leadsLastMonth,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch dashboard stats", statusCode: 500 });
  }
});
