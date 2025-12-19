

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Grid,
  Paper,
  Avatar,
  Collapse,
  alpha,
  Alert,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { Machine, Vendor } from "pages/RegisterManagement/MachineRegister/MachineRegister";
import "../../RegisterManagement/MachineRegister/MachineRegister.css";

// ----------------------------------------------------------------------
// NOTE: Please ensure your 'Machine' interface in your types file 
// includes these two new optional fields to avoid TypeScript errors:
// estateVehicleType?: string;
// estateMaterialType?: string;
// ----------------------------------------------------------------------

interface MachineDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Machine) => void;
  initialData: Machine | null;
  vendors: Vendor[];
  loading: boolean;
}

const MachineDrawer: React.FC<MachineDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  vendors,
  loading,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 650 : "100%";

  // State
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize form state
  const [form, setForm] = useState<Machine & { estateVehicleType?: string; estateMaterialType?: string }>({
    Machine_Id: 0,
    vendorId: 0,
    Machine_name: "",
    password: "",
    Machine_mac: "",
    Machine_model: "",
    Capacity_ton: undefined,
    Last_service_date: "",
    Machine_type: "Company",
    Machine_location: "",
    Status: "",
  });

  // Validation State
  const [errors, setErrors] = useState<Partial<Record<keyof Machine | "estateVehicleType" | "estateMaterialType", string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Reset or Populate form
  useEffect(() => {
    if (open) {
      setErrors({});
      setGlobalError(null);
      setShowPassword(false);
      if (initialData) {
        setForm({ 
            ...initialData,
            // Ensure these exist even if null in DB to prevent uncontrolled input warning
            estateVehicleType: (initialData as any).estateVehicleType || "", 
            estateMaterialType: (initialData as any).estateMaterialType || "" 
        });
      } else {
        setForm({
          Machine_Id: 0,
          vendorId: 0,
          Machine_name: "",
          password: "",
          Machine_mac: "",
          Machine_model: "",
          Capacity_ton: undefined,
          Last_service_date: "",
          Machine_type: "Company",
          Machine_location: "",
          Status: "",
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear specific error on type
    if (errors[key as keyof Machine]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: any = {};
    let isValid = true;

    if (!form.Machine_name?.trim()) {
      newErrors.Machine_name = "Machine name is required";
      isValid = false;
    }
    if (!form.password?.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    if (!form.vendorId || form.vendorId <= 0) {
      newErrors.vendorId = "Vendor selection is required";
      isValid = false;
    }
    if (form.Capacity_ton !== undefined && form.Capacity_ton < 0) {
      newErrors.Capacity_ton = "Capacity cannot be negative";
      isValid = false;
    }

    // Estate Specific Validation
    if (form.Machine_type === "Estate") {
      if (!form.estateVehicleType) {
        newErrors.estateVehicleType = "Vehicle type is required for Estate";
        isValid = false;
      }
      if (!form.estateMaterialType) {
        newErrors.estateMaterialType = "Material type is required for Estate";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) {
      setGlobalError("Please correct the highlighted errors below.");
    } else {
      setGlobalError(null);
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(form);
    }
  };

  // Helper for the "OK" button inside Estate card
  // const handleEstateConfirm = () => {
  //   // Just a visual confirmation or partial validation
  //   if (!form.estateVehicleType || !form.estateMaterialType) {
  //      setErrors(prev => ({
  //        ...prev,
  //        estateVehicleType: !form.estateVehicleType ? "Required" : undefined,
  //        estateMaterialType: !form.estateMaterialType ? "Required" : undefined
  //      }));
  //   } else {
  //      // Clear estate errors if filled
  //      setErrors(prev => ({
  //        ...prev,
  //        estateVehicleType: undefined,
  //        estateMaterialType: undefined
  //      }));
  //   }
  // };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          boxShadow: theme.shadows[20],
        },
      }}
    >
      {/* --- Stylish Header --- */}
      <Box
        sx={{
          px: 2.5,
          py: 2.3,
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 100%)`,
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "#7bbefdff",
              width: 50,
              height: 50,
              boxShadow: theme.shadows[3],
            }}
          >
            <IconifyIcon icon="mdi:factory" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {initialData ? "Edit Machine" : "New Machine"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {initialData ? "Update machine configuration" : "Register new industrial equipment"}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: "black" }}>
          <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      {/* --- Content Area --- */}
      <Box sx={{ p: 3, overflowY: "auto", flex: 1, bgcolor: theme.palette.background.default }}>
        <Stack spacing={3}>
          {globalError && (
            <Collapse in={!!globalError}>
              <Alert severity="error" onClose={() => setGlobalError(null)} sx={{ mb: 2 }}>
                {globalError}
              </Alert>
            </Collapse>
          )}

          {/* Section 1: Machine Identity */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Machine Identity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Machine Name"
                  className="input-bg-color label-black"
                  placeholder="e.g. Weighbridge Unit A"
                  fullWidth
                  value={form.Machine_name}
                  onChange={(e) => setField("Machine_name", e.target.value)}
                  disabled={loading}
                  error={!!errors.Machine_name}
                  helperText={errors.Machine_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:id-card" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Access Password"
                  className="input-bg-color label-black"
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  fullWidth
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  disabled={loading}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:lock-outline" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'text.secondary' }} 
                        >
                          {showPassword ? (
                            <IconifyIcon icon="ic:baseline-key-off" />
                          ) : (
                            <IconifyIcon icon="ic:baseline-key" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Associated Vendor"
                  className="input-bg-color label-black"
                  select
                  fullWidth
                  value={form.vendorId || 0}
                  onChange={(e) => setField("vendorId", Number(e.target.value))}
                  disabled={loading}
                  error={!!errors.vendorId}
                  helperText={errors.vendorId}
                >
                  <MenuItem value={0} disabled sx={{ color: "text.secondary", fontStyle: "italic" }}>
                    Select Vendor
                  </MenuItem>
                  {vendors.map((v) => (
                    <MenuItem key={v.Vendor_Id} value={v.Vendor_Id}>
                      {v.vendorName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="MAC Address"
                  className="input-bg-color label-black"
                  placeholder="e.g. AA:BB:CC:DD:EE:FF"
                  fullWidth
                  value={form.Machine_mac || ""}
                  onChange={(e) => setField("Machine_mac", e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:ethernet" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Section 2: Technical Specifications */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Technical Specifications
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Model Number"
                  className="input-bg-color label-black"
                  placeholder="e.g. MX-500"
                  fullWidth
                  value={form.Machine_model || ""}
                  onChange={(e) => setField("Machine_model", e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:cog-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Capacity"
                  className="input-bg-color label-black"
                  type="number"
                  placeholder="0.0"
                  fullWidth
                  value={form.Capacity_ton ?? ""}
                  onChange={(e) =>
                    setField("Capacity_ton", e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  disabled={loading}
                  error={!!errors.Capacity_ton}
                  helperText={errors.Capacity_ton}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">tons</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Machine Type Selection */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Machine Type"
                  className="input-bg-color label-black"
                  select
                  fullWidth
                  value={form.Machine_type}
                  onChange={(e) => {
                    setField("Machine_type", e.target.value as any);
                    // Clear estate fields if switched away from Estate
                    if (e.target.value !== "Estate") {
                        setForm(prev => ({...prev, estateVehicleType: "", estateMaterialType: ""}));
                    }
                  }}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:domain" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="Company">Company</MenuItem>
                  <MenuItem value="ThirdParty">Third Party</MenuItem>
                  <MenuItem value="Estate">Estate</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Service Date"
                  className="input-bg-color label-black"
                  type="date"
                  fullWidth
                  value={form.Last_service_date || ""}
                  onChange={(e) => setField("Last_service_date", e.target.value)}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* ----- ESTATE CONFIGURATION CARD (Conditional) ----- */}
              {/* <Grid item xs={12}>
                <Collapse in={form.Machine_type === "Estate"} timeout="auto" unmountOnExit>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mt: 1,
                      border: `1px dashed ${theme.palette.primary.main}`,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <IconifyIcon icon="mdi:nature-people" color={theme.palette.primary.main} />
                        <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                            Estate Details
                        </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Vehicle Option"
                                fullWidth
                                size="small"
                                value={form.estateVehicleType || ""}
                                onChange={(e) => setField("estateVehicleType", e.target.value)}
                                error={!!errors.estateVehicleType}
                                helperText={errors.estateVehicleType}
                                sx={{ bgcolor: 'background.paper' }}
                            >
                                <MenuItem value="Own Vehicle">Own Vehicle</MenuItem>
                                <MenuItem value="Other Vehicle">Other Vehicle</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Material Type"
                                fullWidth
                                size="small"
                                value={form.estateMaterialType || ""}
                                onChange={(e) => setField("estateMaterialType", e.target.value)}
                                error={!!errors.estateMaterialType}
                                helperText={errors.estateMaterialType}
                                sx={{ bgcolor: 'background.paper' }}
                            >
                                <MenuItem value="Own Leaf">Own Leaf</MenuItem>
                                <MenuItem value="Baught Leaf">Baught Leaf</MenuItem>
                                <MenuItem value="Dispatch Material">Dispatch Material</MenuItem>
                                <MenuItem value="Other Material">Other Material</MenuItem>
                            </TextField>
                        </Grid>
                        
                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                             <Button 
                                variant="contained" 
                                size="small"
                                color="primary" 
                                onClick={handleEstateConfirm}
                                startIcon={<IconifyIcon icon="mdi:check-circle-outline" />}
                                sx={{ borderRadius: 20, px: 3, textTransform: 'none' }}
                             >
                                OK
                             </Button>
                        </Grid>
                    </Grid>
                  </Paper>
                </Collapse>
              </Grid> */}
              {/* ------------------------------------------------ */}

              <Grid item xs={12}>
                <TextField
                  label="Location"
                  placeholder="e.g. Factory Floor, Zone B"
                  className="input-bg-color label-black"
                  fullWidth
                  value={form.Machine_location || ""}
                  onChange={(e) => setField("Machine_location", e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:map-marker-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Box>

      {/* --- Footer Actions --- */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button onClick={onClose} color="inherit" sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          size="large"
          startIcon={<IconifyIcon icon="material-symbols:save-rounded" />}
          sx={{
            px: 4,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          {initialData ? "Save Changes" : "Create Machine"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default MachineDrawer;