import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Box, Typography, Chip, Button, TextField, InputAdornment } from "@mui/material";
import { Plus, Search } from "lucide-react";
import { company } from "@western-mass-septic/config";
import { useLeads, useUpdateLeadStage } from "../api/hooks";
import type { Lead } from "@western-mass-septic/shared";
import PipelineColumn from "../components/PipelineColumn";
import LeadCard from "../components/LeadCard";
import CreateLeadDialog from "../components/CreateLeadDialog";

export default function PipelinePage() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading } = useLeads({ pageSize: 500 });
  const updateStage = useUpdateLeadStage();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const leads = data?.data || [];
  const activeLead = leads.find((l) => l.id === activeId);

  const leadsByStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    company.pipeline.stages.forEach((s) => {
      map[s.key] = [];
    });
    leads
      .filter((l) =>
        search
          ? l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.email?.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .forEach((lead) => {
        if (map[lead.stage]) {
          map[lead.stage].push(lead);
        }
      });
    return map;
  }, [leads, search]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as string;
    const lead = leads.find((l) => l.id === leadId);

    if (lead && lead.stage !== newStage) {
      updateStage.mutate({ id: leadId, stage: newStage });
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Pipeline
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder={`Search ${company.pipeline.entityNamePlural.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setCreateOpen(true)}
          >
            New {company.pipeline.entityName}
          </Button>
        </Box>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {company.pipeline.stages.map((stage) => (
            <PipelineColumn
              key={stage.key}
              stage={stage}
              leads={leadsByStage[stage.key] || []}
              isLoading={isLoading}
            />
          ))}
        </Box>

        <DragOverlay>
          {activeLead ? <LeadCard lead={activeLead} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <CreateLeadDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}
