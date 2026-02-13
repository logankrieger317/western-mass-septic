import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  TablePagination,
  Skeleton,
} from "@mui/material";
import { Search, Plus } from "lucide-react";
import { company } from "@western-mass-septic/config";
import { useLeads } from "../api/hooks";
import CreateLeadDialog from "../components/CreateLeadDialog";

export default function LeadsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useLeads({
    page: page + 1,
    pageSize,
    search: search || undefined,
  });

  const stageColors = Object.fromEntries(
    company.pipeline.stages.map((s) => [s.key, s.color])
  );
  const stageLabels = Object.fromEntries(
    company.pipeline.stages.map((s) => [s.key, s.label])
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          All {company.pipeline.entityNamePlural}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><Search size={18} /></InputAdornment>
              ),
            }}
          />
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setCreateOpen(true)}>
            New {company.pipeline.entityName}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.data?.map((lead) => (
                  <TableRow
                    key={lead.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "primary.main" }}>
                          {lead.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>{lead.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{lead.email || "-"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{lead.phone || "-"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={stageLabels[lead.stage] || lead.stage}
                        size="small"
                        sx={{
                          backgroundColor: `${stageColors[lead.stage] || "#999"}20`,
                          color: stageColors[lead.stage] || "#999",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                        {lead.source || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {lead.assignedTo?.name || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.total || 0}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => { setPageSize(+(e.target as HTMLInputElement).value); setPage(0); }}
        />
      </TableContainer>

      <CreateLeadDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}
