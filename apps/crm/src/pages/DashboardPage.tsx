import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Skeleton,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from "@mui/material";
import { TrendingUp, TrendingDown, Users, Target, CheckCircle, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { company } from "@western-mass-septic/config";
import { useDashboardStats } from "../api/hooks";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();

  const stageColors = Object.fromEntries(
    company.pipeline.stages.map((s) => [s.key, s.color])
  );
  const stageLabels = Object.fromEntries(
    company.pipeline.stages.map((s) => [s.key, s.label])
  );

  const chartData = stats
    ? company.pipeline.stages
        .filter((s) => s.key !== "lost")
        .map((s) => ({
          name: s.label,
          count: stats.leadsByStage[s.key] || 0,
          color: s.color,
        }))
    : [];

  const monthChange = stats
    ? stats.leadsLastMonth > 0
      ? Math.round(((stats.leadsThisMonth - stats.leadsLastMonth) / stats.leadsLastMonth) * 100)
      : stats.leadsThisMonth > 0
      ? 100
      : 0
    : 0;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: `Total ${company.pipeline.entityNamePlural}`,
            value: stats?.totalLeads ?? "-",
            icon: Users,
            color: "#3B82F6",
          },
          {
            label: "This Month",
            value: stats?.leadsThisMonth ?? "-",
            icon: monthChange >= 0 ? TrendingUp : TrendingDown,
            color: monthChange >= 0 ? "#10B981" : "#EF4444",
            subtitle: `${monthChange >= 0 ? "+" : ""}${monthChange}% vs last month`,
          },
          {
            label: "Conversion Rate",
            value: stats ? `${stats.conversionRate}%` : "-",
            icon: Target,
            color: "#8B5CF6",
          },
          {
            label: "Upcoming Tasks",
            value: stats?.upcomingActivities?.length ?? "-",
            icon: CheckCircle,
            color: "#F59E0B",
          },
        ].map((stat, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${stat.color}15`,
                  }}
                >
                  <stat.icon size={24} color={stat.color} />
                </Box>
                <Box>
                  {isLoading ? (
                    <Skeleton width={60} height={32} />
                  ) : (
                    <Typography variant="h5" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  {stat.subtitle && (
                    <Typography variant="caption" color={stat.color}>
                      {stat.subtitle}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Pipeline Overview
              </Typography>
              {isLoading ? (
                <Skeleton variant="rounded" height={250} />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Recent {company.pipeline.entityNamePlural}
              </Typography>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} height={50} sx={{ mb: 0.5 }} />
                ))
              ) : (
                <List disablePadding>
                  {stats?.recentLeads?.map((lead) => (
                    <ListItemButton
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      sx={{ borderRadius: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "primary.main" }}>
                          {lead.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={lead.name}
                        secondary={new Date(lead.createdAt).toLocaleDateString()}
                        primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                      <Chip
                        label={stageLabels[lead.stage] || lead.stage}
                        size="small"
                        sx={{
                          backgroundColor: `${stageColors[lead.stage] || "#999"}20`,
                          color: stageColors[lead.stage] || "#999",
                          fontWeight: 600,
                          fontSize: 11,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Upcoming Tasks
              </Typography>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={50} sx={{ mb: 0.5 }} />
                ))
              ) : stats?.upcomingActivities?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No upcoming tasks
                </Typography>
              ) : (
                <List disablePadding>
                  {stats?.upcomingActivities?.map((activity) => (
                    <ListItemButton key={activity.id} sx={{ borderRadius: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#F59E0B20" }}>
                          <Clock size={16} color="#F59E0B" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          activity.dueDate
                            ? `Due: ${new Date(activity.dueDate).toLocaleDateString()}`
                            : undefined
                        }
                        primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                      {activity.lead && (
                        <Chip label={activity.lead.name} size="small" variant="outlined" />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
