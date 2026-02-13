import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  MenuItem,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";
import { ArrowLeft, Send, Upload, Trash2 } from "lucide-react";
import { company } from "@western-mass-septic/config";
import { useLead, useUpdateLead, useDeleteLead, useUploadDocument } from "../api/hooks";
import { api } from "../api/client";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading, refetch } = useLead(id!);
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const uploadDoc = useUploadDocument();

  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const stageColors = Object.fromEntries(company.pipeline.stages.map((s) => [s.key, s.color]));
  const stageLabels = Object.fromEntries(company.pipeline.stages.map((s) => [s.key, s.label]));

  if (isLoading) {
    return (
      <Box>
        <Skeleton height={40} width={200} />
        <Skeleton variant="rounded" height={300} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!lead) {
    return <Alert severity="error">{company.pipeline.entityName} not found</Alert>;
  }

  const handleStageChange = async (stage: string) => {
    await updateLead.mutateAsync({ id: lead.id, stage });
    refetch();
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setAddingNote(true);
    try {
      await api.post("/notes", { content: noteContent, leadId: lead.id });
      setNoteContent("");
      refetch();
    } finally {
      setAddingNote(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadDoc.mutateAsync({ leadId: lead.id, file });
    refetch();
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete this ${company.pipeline.entityName.toLowerCase()}?`)) {
      await deleteLead.mutateAsync(lead.id);
      navigate("/leads");
    }
  };

  const customFields = (lead.customFields || {}) as Record<string, unknown>;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </IconButton>
        <Avatar sx={{ bgcolor: "primary.main" }}>{lead.name.charAt(0)}</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>{lead.name}</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Chip
              label={stageLabels[lead.stage] || lead.stage}
              size="small"
              sx={{
                backgroundColor: `${stageColors[lead.stage] || "#999"}20`,
                color: stageColors[lead.stage] || "#999",
                fontWeight: 600,
              }}
            />
            {lead.source && (
              <Chip label={lead.source} size="small" variant="outlined" sx={{ textTransform: "capitalize" }} />
            )}
          </Box>
        </Box>
        <Button color="error" startIcon={<Trash2 size={16} />} onClick={handleDelete}>
          Delete
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Details</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2">{lead.email || "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2">{lead.phone || "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                  <Typography variant="body2">{lead.assignedTo?.name || "Unassigned"}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Created</Typography>
                  <Typography variant="body2">{new Date(lead.createdAt).toLocaleString()}</Typography>
                </Grid>

                {company.leadFields.map((field) => (
                  <Grid key={field.key} size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">{field.label}</Typography>
                    <Typography variant="body2">
                      {field.type === "currency" && customFields[field.key]
                        ? `$${Number(customFields[field.key]).toLocaleString()}`
                        : String(customFields[field.key] || "-")}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Activity</Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  placeholder="Add a note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
                <Button
                  variant="contained"
                  disabled={!noteContent.trim() || addingNote}
                  onClick={handleAddNote}
                  sx={{ alignSelf: "flex-end" }}
                >
                  <Send size={16} />
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {lead.notes && lead.notes.length > 0 ? (
                <List disablePadding>
                  {lead.notes.map((note) => (
                    <ListItem key={note.id} alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "secondary.main" }}>
                          {note.author?.name?.charAt(0) || "?"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" fontWeight={600}>
                              {note.author?.name || "System"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(note.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={note.content}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No notes yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Stage</Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={lead.stage}
                onChange={(e) => handleStageChange(e.target.value)}
              >
                {company.pipeline.stages.map((s) => (
                  <MenuItem key={s.key} value={s.key}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
                      {s.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Documents</Typography>
                <Button component="label" size="small" startIcon={<Upload size={14} />}>
                  Upload
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
              </Box>

              {lead.documents && lead.documents.length > 0 ? (
                <List disablePadding>
                  {lead.documents.map((doc) => (
                    <ListItem key={doc.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={doc.name}
                        secondary={`${(doc.size / 1024).toFixed(1)} KB`}
                        primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No documents</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
