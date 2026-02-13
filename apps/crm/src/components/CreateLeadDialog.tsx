import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  InputAdornment,
} from "@mui/material";
import { createLeadSchema, type CreateLeadInput } from "@western-mass-septic/shared";
import { company } from "@western-mass-septic/config";
import { useCreateLead } from "../api/hooks";

interface CreateLeadDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateLeadDialog({ open, onClose }: CreateLeadDialogProps) {
  const createLead = useCreateLead();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      stage: company.pipeline.stages[0]?.key || "lead",
      customFields: {},
    },
  });

  const onSubmit = async (data: CreateLeadInput) => {
    await createLead.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New {company.pipeline.entityName}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              required
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Phone"
                fullWidth
                {...register("phone")}
              />
            </Box>
            <TextField
              label="Stage"
              select
              fullWidth
              defaultValue={company.pipeline.stages[0]?.key || "lead"}
              {...register("stage")}
            >
              {company.pipeline.stages.map((s) => (
                <MenuItem key={s.key} value={s.key}>
                  {s.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Source"
              select
              fullWidth
              {...register("source")}
              defaultValue=""
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="website">Website</MenuItem>
              <MenuItem value="referral">Referral</MenuItem>
              <MenuItem value="phone">Phone</MenuItem>
              <MenuItem value="social">Social Media</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            {company.leadFields.map((field) => {
              if (field.type === "select" && field.options) {
                return (
                  <Controller
                    key={field.key}
                    name={`customFields.${field.key}` as `customFields.${string}`}
                    control={control}
                    defaultValue=""
                    render={({ field: f }) => (
                      <TextField
                        label={field.label}
                        select
                        fullWidth
                        value={f.value || ""}
                        onChange={f.onChange}
                      >
                        <MenuItem value="">None</MenuItem>
                        {field.options!.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                );
              }

              if (field.type === "currency") {
                return (
                  <Controller
                    key={field.key}
                    name={`customFields.${field.key}` as `customFields.${string}`}
                    control={control}
                    defaultValue=""
                    render={({ field: f }) => (
                      <TextField
                        label={field.label}
                        type="number"
                        fullWidth
                        value={f.value || ""}
                        onChange={f.onChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    )}
                  />
                );
              }

              if (field.type === "textarea") {
                return (
                  <Controller
                    key={field.key}
                    name={`customFields.${field.key}` as `customFields.${string}`}
                    control={control}
                    defaultValue=""
                    render={({ field: f }) => (
                      <TextField
                        label={field.label}
                        multiline
                        rows={3}
                        fullWidth
                        value={f.value || ""}
                        onChange={f.onChange}
                      />
                    )}
                  />
                );
              }

              return (
                <Controller
                  key={field.key}
                  name={`customFields.${field.key}` as `customFields.${string}`}
                  control={control}
                  defaultValue=""
                  render={({ field: f }) => (
                    <TextField
                      label={field.label}
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      fullWidth
                      value={f.value || ""}
                      onChange={f.onChange}
                      InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                    />
                  )}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : `Create ${company.pipeline.entityName}`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
