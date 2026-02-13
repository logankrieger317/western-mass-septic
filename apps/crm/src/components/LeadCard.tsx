import { useDraggable } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Mail, Phone } from "lucide-react";
import type { Lead } from "@western-mass-septic/shared";

interface LeadCardProps {
  lead: Lead;
  isDragOverlay?: boolean;
}

export default function LeadCard({ lead, isDragOverlay }: LeadCardProps) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <Card
      ref={!isDragOverlay ? setNodeRef : undefined}
      {...(!isDragOverlay ? { ...listeners, ...attributes } : {})}
      onClick={() => !isDragging && navigate(`/leads/${lead.id}`)}
      sx={{
        mb: 1,
        cursor: isDragging ? "grabbing" : "pointer",
        opacity: isDragging && !isDragOverlay ? 0.5 : 1,
        boxShadow: isDragOverlay ? 4 : 1,
        "&:hover": { boxShadow: 3 },
        transition: "box-shadow 0.2s",
        ...(style || {}),
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: "primary.main",
              fontSize: 12,
            }}
          >
            {lead.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle2" fontWeight={600} noWrap>
            {lead.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {lead.email && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Mail size={12} color="#9e9e9e" />
              <Typography variant="caption" color="text.secondary" noWrap>
                {lead.email}
              </Typography>
            </Box>
          )}
          {lead.phone && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Phone size={12} color="#9e9e9e" />
              <Typography variant="caption" color="text.secondary">
                {lead.phone}
              </Typography>
            </Box>
          )}
        </Box>

        {lead.assignedTo && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Assigned: {lead.assignedTo.name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
