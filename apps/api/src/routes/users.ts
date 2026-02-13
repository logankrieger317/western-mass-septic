import { Router, type IRouter, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../services/db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema } from "@western-mass-septic/shared";

export const usersRouter: IRouter = Router();
usersRouter.use(authenticate);

usersRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { name: "asc" },
    });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users", statusCode: 500 });
  }
});

usersRouter.post("/", requireAdmin, validate(createUserSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: "Email already registered", statusCode: 409 });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || "USER" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    res.status(201).json(user);
  } catch {
    res.status(500).json({ message: "Failed to create user", statusCode: 500 });
  }
});

usersRouter.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    if (String(req.params.id) === req.user!.userId) {
      res.status(400).json({ message: "Cannot delete yourself", statusCode: 400 });
      return;
    }
    await prisma.user.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete user", statusCode: 500 });
  }
});
