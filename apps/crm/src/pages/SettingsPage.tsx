import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { Plus, Trash2, Shield, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserInput } from "@western-mass-septic/shared";
import { company } from "@western-mass-septic/config";
import { useAuthStore } from "../store/authStore";
import { useUsers } from "../api/hooks";
import { api } from "../api/client";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { data: users, refetch } = useUsers();
  const [createOpen, setCreateOpen] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Delete this user?")) {
      await api.delete(`/users/${userId}`);
      refetch();
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Your Profile
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontSize: 20 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                  <Chip
                    label={user?.role}
                    size="small"
                    color={user?.role === "ADMIN" ? "primary" : "default"}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Company Info
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Company Name</Typography>
                  <Typography variant="body2">{company.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2">{company.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2">{company.phone}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography variant="body2">{company.address}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {isAdmin && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Team Members
                  </Typography>
                  <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setCreateOpen(true)}>
                    Add User
                  </Button>
                </Box>
                <List disablePadding>
                  {users?.map((u, idx) => (
                    <ListItem
                      key={u.id}
                      divider={idx < (users?.length || 0) - 1}
                      secondaryAction={
                        u.id !== user?.id ? (
                          <IconButton edge="end" color="error" onClick={() => handleDeleteUser(u.id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        ) : null
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: u.role === "ADMIN" ? "primary.main" : "grey.400", width: 36, height: 36 }}>
                          {u.role === "ADMIN" ? <Shield size={16} /> : <User size={16} />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                            <Chip label={u.role} size="small" sx={{ fontSize: 10, height: 20 }} />
                            {u.id === user?.id && <Chip label="You" size="small" color="primary" sx={{ fontSize: 10, height: 20 }} />}
                          </Box>
                        }
                        secondary={u.email}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Pipeline Stages
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Pipeline stages are configured in <code>config/company.ts</code>. Edit that file to customize stages.
              </Alert>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {company.pipeline.stages.map((stage) => (
                  <Chip
                    key={stage.key}
                    label={stage.label}
                    sx={{
                      backgroundColor: `${stage.color}20`,
                      color: stage.color,
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CreateUserDialog open={createOpen} onClose={() => { setCreateOpen(false); refetch(); }} />
    </Box>
  );
}

function CreateUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      setError(null);
      await api.post("/users", data);
      reset();
      onClose();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Team Member</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <TextField label="Name" fullWidth required {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
            <TextField label="Email" type="email" fullWidth required {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Password" type="password" fullWidth required {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
            <TextField label="Role" select fullWidth defaultValue="USER" {...register("role")} SelectProps={{ native: true }}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Add User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
