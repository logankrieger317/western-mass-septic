import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Plus, Phone, Mail, Users, CheckSquare, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createActivitySchema, type CreateActivityInput, type ActivityType } from "@western-mass-septic/shared";
import { useActivities, useCreateActivity, useUpdateActivity } from "../api/hooks";

const typeIcons: Record<ActivityType, React.FC<{ size?: number; color?: string }>> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  TASK: CheckSquare,
  NOTE: FileText,
};

const typeColors: Record<ActivityType, string> = {
  CALL: "#3B82F6",
  EMAIL: "#10B981",
  MEETING: "#8B5CF6",
  TASK: "#F59E0B",
  NOTE: "#6B7280",
};

export default function ActivitiesPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [createOpen, setCreateOpen] = useState(false);

  const { data: activities, isLoading } = useActivities(
    filter === "all" ? undefined : { completed: filter === "completed" ? "true" : "false" }
  );
  const updateActivity = useUpdateActivity();

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateActivity.mutate({ id, completed: !completed });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight={700}>Activities</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, v) => v && setFilter(v)}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="pending">Pending</ToggleButton>
            <ToggleButton value="completed">Completed</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setCreateOpen(true)}>
            New Activity
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Typography sx={{ p: 3 }}>Loading...</Typography>
          ) : !activities || activities.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
              No activities yet
            </Typography>
          ) : (
            <List disablePadding>
              {activities.map((activity, idx) => {
                const Icon = typeIcons[activity.type] || CheckSquare;
                const color = typeColors[activity.type] || "#999";
                return (
                  <ListItem
                    key={activity.id}
                    divider={idx < activities.length - 1}
                    secondaryAction={
                      <Checkbox
                        checked={activity.completed}
                        onChange={() => handleToggleComplete(activity.id, activity.completed)}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${color}20`, width: 36, height: 36 }}>
                        <Icon size={18} color={color} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ textDecoration: activity.completed ? "line-through" : "none" }}
                          >
                            {activity.title}
                          </Typography>
                          <Chip label={activity.type} size="small" sx={{ fontSize: 10, height: 20, bgcolor: `${color}15`, color }} />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                          {activity.description && (
                            <Typography variant="caption" color="text.secondary">{activity.description}</Typography>
                          )}
                          {activity.dueDate && (
                            <Typography variant="caption" color="text.secondary">
                              Due: {new Date(activity.dueDate).toLocaleDateString()}
                            </Typography>
                          )}
                          {activity.lead && (
                            <Chip label={activity.lead.name} size="small" variant="outlined" sx={{ fontSize: 10, height: 18 }} />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      <CreateActivityDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}

function CreateActivityDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createActivity = useCreateActivity();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: { type: "TASK", title: "" },
  });

  const onSubmit = async (data: CreateActivityInput) => {
    await createActivity.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Activity</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <TextField
              label="Type"
              select
              fullWidth
              defaultValue="TASK"
              {...register("type")}
            >
              {(["CALL", "EMAIL", "MEETING", "TASK", "NOTE"] as ActivityType[]).map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
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
              rows={3}
              fullWidth
              {...register("description")}
            />
            <TextField
              label="Due Date"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("dueDate")}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
