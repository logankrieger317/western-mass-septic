import { Router, type IRouter, Request, Response } from "express";
import { prisma } from "../services/db.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createNoteSchema } from "@western-mass-septic/shared";

export const notesRouter: IRouter = Router();
notesRouter.use(authenticate);

notesRouter.post("/", validate(createNoteSchema), async (req: Request, res: Response) => {
  try {
    const note = await prisma.note.create({
      data: {
        content: req.body.content,
        leadId: req.body.leadId,
        authorId: req.user!.userId,
      },
      include: { author: { select: { id: true, name: true } } },
    });
    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: "Failed to create note", statusCode: 500 });
  }
});

notesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.note.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete note", statusCode: 500 });
  }
});
