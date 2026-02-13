import { useDroppable } from "@dnd-kit/core";
import { Box, Typography, Chip, Skeleton } from "@mui/material";
import type { PipelineStage } from "@western-mass-septic/config";
import type { Lead } from "@western-mass-septic/shared";
import LeadCard from "./LeadCard";

interface PipelineColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  isLoading: boolean;
}

export default function PipelineColumn({ stage, leads, isLoading }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minWidth: 300,
        maxWidth: 300,
        backgroundColor: isOver ? "action.hover" : "grey.50",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.2s",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid",
          borderColor: stage.color,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: stage.color,
            }}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            {stage.label}
          </Typography>
        </Box>
        <Chip
          label={leads.length}
          size="small"
          sx={{
            backgroundColor: stage.color,
            color: "white",
            fontWeight: 600,
            minWidth: 28,
          }}
        />
      </Box>

      <Box sx={{ p: 1, flex: 1, overflowY: "auto", minHeight: 100 }}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 1 }} />
          ))
        ) : leads.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            No items
          </Typography>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        )}
      </Box>
    </Box>
  );
}
