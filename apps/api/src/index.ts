import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { leadsRouter } from "./routes/leads.js";
import { activitiesRouter } from "./routes/activities.js";
import { calendarRouter } from "./routes/calendar.js";
import { documentsRouter } from "./routes/documents.js";
import { contactRouter } from "./routes/contact.js";
import { usersRouter } from "./routes/users.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { notesRouter } from "./routes/notes.js";
import { errorHandler } from "./middleware/error.js";

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://western-mass-septiclanding-production.up.railway.app",
      "https://western-mass-septiccrm-production.up.railway.app",
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/users", usersRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/notes", notesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`API server running on http://0.0.0.0:${PORT}`);
});

export default app;
