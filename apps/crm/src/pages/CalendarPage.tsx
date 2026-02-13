import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCalendarEventSchema, type CreateCalendarEventInput } from "@western-mass-septic/shared";
import { useCalendarEvents, useCreateCalendarEvent } from "../api/hooks";
import dayjs from "dayjs";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [createOpen, setCreateOpen] = useState(false);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");

  const { data: events } = useCalendarEvents({
    start: startOfMonth.toISOString(),
    end: endOfMonth.toISOString(),
  });

  const daysInMonth = useMemo(() => {
    const days: dayjs.Dayjs[] = [];
    const startDay = startOfMonth.day();

    for (let i = 0; i < startDay; i++) {
      days.push(startOfMonth.subtract(startDay - i, "day"));
    }

    for (let i = 0; i < endOfMonth.date(); i++) {
      days.push(startOfMonth.add(i, "day"));
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(endOfMonth.add(i, "day"));
    }

    return days;
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof events> = {};
    events?.forEach((event) => {
      const dateKey = dayjs(event.start).format("YYYY-MM-DD");
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey]!.push(event);
    });
    return map;
  }, [events]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Calendar</Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setCreateOpen(true)}>
          New Event
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, mb: 3 }}>
            <IconButton onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}>
              <ChevronLeft size={20} />
            </IconButton>
            <Typography variant="h6" fontWeight={600}>
              {currentDate.format("MMMM YYYY")}
            </Typography>
            <IconButton onClick={() => setCurrentDate(currentDate.add(1, "month"))}>
              <ChevronRight size={20} />
            </IconButton>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, mb: 0.5 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <Typography key={d} variant="caption" fontWeight={600} sx={{ textAlign: "center", color: "text.secondary", py: 1 }}>
                {d}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5 }}>
            {daysInMonth.map((day, idx) => {
              const dateKey = day.format("YYYY-MM-DD");
              const dayEvents = eventsByDate[dateKey] || [];
              const isCurrentMonth = day.month() === currentDate.month();
              const isToday = day.isSame(dayjs(), "day");

              return (
                <Box
                  key={idx}
                  sx={{
                    minHeight: 80,
                    p: 0.5,
                    borderRadius: 1,
                    bgcolor: isToday ? "primary.main" : isCurrentMonth ? "grey.50" : "transparent",
                    opacity: isCurrentMonth ? 1 : 0.3,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={isToday ? 700 : 400}
                    color={isToday ? "white" : "text.secondary"}
                    sx={{ display: "block", textAlign: "right", mb: 0.5 }}
                  >
                    {day.date()}
                  </Typography>
                  {dayEvents.slice(0, 2).map((event) => (
                    <Chip
                      key={event.id}
                      label={event.title}
                      size="small"
                      sx={{
                        fontSize: 10,
                        height: 18,
                        mb: 0.25,
                        maxWidth: "100%",
                        bgcolor: isToday ? "rgba(255,255,255,0.3)" : "primary.light",
                        color: isToday ? "white" : "primary.main",
                      }}
                    />
                  ))}
                  {dayEvents.length > 2 && (
                    <Typography variant="caption" color={isToday ? "white" : "text.secondary"}>
                      +{dayEvents.length - 2} more
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      <CreateEventDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}

function CreateEventDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createEvent = useCreateCalendarEvent();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCalendarEventInput>({
    resolver: zodResolver(createCalendarEventSchema),
  });

  const onSubmit = async (data: CreateCalendarEventInput) => {
    await createEvent.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Event</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              required
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Description"
              multiline
              rows={2}
              fullWidth
              {...register("description")}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start"
                type="datetime-local"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                {...register("start")}
                error={!!errors.start}
              />
              <TextField
                label="End"
                type="datetime-local"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                {...register("end")}
                error={!!errors.end}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
