import { Router, type IRouter, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../services/db.js";
import { authenticate } from "../middleware/auth.js";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const documentsRouter: IRouter = Router();
documentsRouter.use(authenticate);

documentsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { leadId } = req.query;
    const where: Record<string, unknown> = {};
    if (leadId) where.leadId = leadId;

    const documents = await prisma.document.findMany({
      where: where as object,
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });

    res.json(documents);
  } catch {
    res.status(500).json({ message: "Failed to fetch documents", statusCode: 500 });
  }
});

documentsRouter.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "File is required", statusCode: 400 });
      return;
    }

    const { leadId } = req.body;
    if (!leadId) {
      res.status(400).json({ message: "Lead ID is required", statusCode: 400 });
      return;
    }

    const document = await prisma.document.create({
      data: {
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype,
        size: req.file.size,
        leadId,
        uploadedById: req.user!.userId,
      },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });

    res.status(201).json(document);
  } catch {
    res.status(500).json({ message: "Failed to upload document", statusCode: 500 });
  }
});

documentsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.document.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete document", statusCode: 500 });
  }
});
