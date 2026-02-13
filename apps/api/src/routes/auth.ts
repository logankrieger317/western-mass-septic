import { Router, type IRouter, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../services/db.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, createUserSchema } from "@western-mass-septic/shared";
import {
  authenticate,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  type AuthPayload,
} from "../middleware/auth.js";

export const authRouter: IRouter = Router();

authRouter.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password", statusCode: 401 });
      return;
    }

    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch {
    res.status(500).json({ message: "Login failed", statusCode: 500 });
  }
});

authRouter.post("/register", validate(createUserSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: "Email already registered", statusCode: 409 });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userCount = await prisma.user.count();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userCount === 0 ? "ADMIN" : role || "USER",
      },
    });

    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch {
    res.status(500).json({ message: "Registration failed", statusCode: 500 });
  }
});

authRouter.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token required", statusCode: 400 });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      res.status(401).json({ message: "User not found", statusCode: 401 });
      return;
    }

    const newPayload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    res.json({
      accessToken: generateAccessToken(newPayload),
      refreshToken: generateRefreshToken(newPayload),
    });
  } catch {
    res.status(401).json({ message: "Invalid refresh token", statusCode: 401 });
  }
});

authRouter.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      res.status(404).json({ message: "User not found", statusCode: 404 });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch user", statusCode: 500 });
  }
});
