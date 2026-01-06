
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
  Alert,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
  InputAdornment,
  Avatar,
  Paper,
  Switch,
  FormControlLabel,
  Collapse,
  alpha,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { Machine, Vehicle, Vendor } from "pages/RegisterManagement/VehicleRegister/VehicleRegister";
import vehicletypeApi from "services/vehicletypeApi";

interface VehicleDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (vehicleData: Vehicle) => void;
  initialData: Vehicle | null;
  vendorList: Vendor[]; // Received from parent
  machines: Machine[];
  loading?: boolean;
}

const VehicleDrawer: React.FC<VehicleDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  vendorList,
  machines,
  loading = false,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 800 : "100%"; // Slightly narrower for a cleaner look

  // Form State
  const [form, setForm] = useState<Vehicle>({
    Vehicle_Id: 0,
    Vehicle_type: "",
    Vendor_Id: 0,
    customerId: undefined,
    Tare_weight: undefined,
    status: "Active",
    Created_at: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Vehicle, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Reset/Populate
  useEffect(() => {
    if (open) {
      setErrors({});
      setGlobalError(null);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm({
          Vehicle_Id: 0,
          Vehicle_type: "",
          Vendor_Id: undefined,
          customerId: undefined,
          Tare_weight: undefined,
          status: "Active",
          Created_at: new Date().toISOString(),
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof Vehicle, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // --- Validation Logic (Same as before) ---
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Vehicle, string>> = {};
    let isValid = true;

    if (!form.Vendor_Id) {
        newErrors.Vendor_Id = "Please select a Vendor"; // This links to vendor
        isValid = false;
    }

    if (!form.Vehicle_type?.trim()) {
      newErrors.Vehicle_type = "Vehicle Type is required";
      isValid = false;
    }
    if (form.Tare_weight !== undefined && form.Tare_weight < 0) {
      newErrors.Tare_weight = "Cannot be negative";
      isValid = false;
    }

    setErrors(newErrors);
    setGlobalError(isValid ? null : "Please check the highlighted fields.");
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      Vendor_Id: form.Vendor_Id,
      Vehicle_type: form.Vehicle_type,
      Tare_weight: form.Tare_weight,
      Created_at: form.Created_at,
    }
    try {
      let response 
      console.log("---response---", response)
      if (initialData && form.Vehicle_Id > 0) {
        response = await vehicletypeApi.updateVehicleDetails(form.Vehicle_Id, payload);

      } else {
        response = await vehicletypeApi.addVehicleDetails(payload);
      }
      if (response?.success) {
        console.log("Success", response);
        onSave(response.data)
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    console.log ("----------called----------")
  };

  const getVendorMachines = () => {
    if (!form.Vendor_Id) return [];
    return machines.filter((m) => m.vendorId === form.Vendor_Id);
  };

  // Helper for status toggle
  const handleStatusChange = (checked: boolean) => {
    setField("status", checked ? "Active" : "Inactive");
  };

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
      {/* --- DESIGN UPDATE 1: Stylish Header with Avatar --- */}
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
            <IconifyIcon icon="mdi:truck-outline" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {initialData ? "Edit Vehicle" : "New Vehicle"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {initialData ? `#${form.Vehicle_Id} - ${form.Vehicle_type}` : "Register a new transport unit"}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ 
          color: "black", 
          // bgcolor: "rgba(255,255,255,0.1)", 
          // '&:hover': { bgcolor: "rgba(255,255,255,0.2)" } 
          }}>
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

          {/* --- DESIGN UPDATE 2: Grouped Identity Section --- */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
              Vehicle Identity
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Vehicle Type / Number"
                  placeholder="e.g. KA-01-AB-1234"
                  fullWidth
                  variant="outlined"
                  value={form.Vehicle_type}
                  onChange={(e) => setField("Vehicle_type", e.target.value)}
                  disabled={loading}
                  error={!!errors.Vehicle_type}
                  helperText={errors.Vehicle_type}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  label="Customer ID"
                  placeholder="Reference ID"
                  fullWidth
                  value={form.customerId ?? ""}
                  onChange={(e) => setField("customerId", e.target.value ? Number(e.target.value) : undefined)}
                  disabled={loading}
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tare Weight"
                  placeholder="0.00"
                  type="number"
                  fullWidth
                  value={form.Tare_weight ?? ""}
                  onChange={(e) => setField("Tare_weight", e.target.value ? parseFloat(e.target.value) : undefined)}
                  disabled={loading}
                  error={!!errors.Tare_weight}
                  helperText={errors.Tare_weight}
                  className="input-bg-color label-black"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* --- DESIGN UPDATE 3: Configuration & Linking --- */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
              Configuration
            </Typography>
            <Stack spacing={2}>
              
              {/* <TextField
                  label="Select Vendor"
                  select
                  fullWidth
                  value={form.Vendor_Id === 0 ? "" : form.Vendor_Id} // Handle 0 as empty
                  onChange={(e) => setField("Vendor_Id", Number(e.target.value))}
                  disabled={loading}
                  error={!!errors.Vendor_Id} // Show error if not selected
                  helperText={errors.Vendor_Id}
                  className="input-bg-color label-black"
              >
                  {vendorList.map((vendor) => (
                      <MenuItem key={vendor.Vendor_Id} value={vendor.Vendor_Id}>
                          {vendor.Vendor_name}
                      </MenuItem>
                  ))}
              </TextField> */}

              <TextField
                label="Select Vendor"
                select
                fullWidth
                value={form.Vendor_Id === 0 ? "" : form.Vendor_Id}
                onChange={(e) => setField("Vendor_Id", Number(e.target.value))}
                disabled={loading}
                error={!!errors.Vendor_Id}
                helperText={errors.Vendor_Id}
                className="input-bg-color label-black"
                
                // 1. Customize the Dropdown Container (The "Paper")
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        borderRadius: 2,
                        marginTop: 1,
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', // Soft modern shadow
                        border: '1px solid',
                        borderColor: 'divider',
                        maxHeight: 300, // Good for long lists
                      },
                    },
                    // Remove default padding to handle our own margins
                    MenuListProps: { sx: { py: 1 } } 
                  },
                }}
              >
                {/* Placeholder option (Optional, if you want a clear option) */}
                <MenuItem value="" disabled sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                  <em>Choose a vendor...</em>
                </MenuItem>
                {vendorList.map((vendor) => (
                  <MenuItem
                    key={vendor.Vendor_Id}
                    value={vendor.Vendor_Id}
                    divider={false}
                    sx={{
                      // 2. The "Floating Pill" Shape
                      borderRadius: '10px',
                      margin: '6px 10px',
                      padding: '10px 16px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'primary.lighter', 
                        transform: 'translateX(5px)', 
                        '& .vendor-avatar': {
                          transform: 'scale(1.1) rotate(-5deg)',
                        }
                      },
                      // 4. Selected State Styling
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'common.white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                        // Change sub-text color when selected
                        '& .vendor-id-text': {
                          color: 'rgba(255,255,255,0.7)', 
                        }
                      }
                    }}
                  >
                    {/* Layout for Avatar + Text */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      
                      {/* Generated Avatar based on Name */}
                      <Avatar 
                        className="vendor-avatar"
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          mr: 2, 
                          fontSize: '0.75rem',
                          bgcolor: 'primary.main', // or dynamic colors
                          transition: 'transform 0.2s'
                        }}
                      >
                        {vendor.Vendor_name ? vendor.Vendor_name.charAt(0).toUpperCase() : 'V'}
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" fontWeight={600}>
                          {vendor.Vendor_name}
                        </Typography>
                        
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              {/* Smart Info Widget for Machines */}
              <Collapse in={!!form.Vendor_Id && getVendorMachines().length > 0}>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.info.main, 0.08), 
                  p: 2, 
                  borderRadius: 2, 
                  border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`
                }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <IconifyIcon icon="mdi:link-variant" color={theme.palette.info.main} />
                    <Typography variant="subtitle2" color="text.primary">
                      Linked Machines
                    </Typography>
                  </Stack>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {getVendorMachines().map((machine) => (
                      <Box
                        key={machine.machineName}
                        sx={{
                          bgcolor: "background.paper",
                          border: `1px solid ${theme.palette.divider}`,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                        }}
                      >
                        {machine.machineName}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Collapse>

              <Divider sx={{ my: 1 }} />

              {/* Status Switch */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2">Vehicle Status</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable or disable this vehicle in the system
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.status === "Active"}
                      onChange={(e) => handleStatusChange(e.target.checked)}
                      color="success"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={form.status === "Active" ? "success.main" : "text.secondary"}
                    >
                      {form.status}
                    </Typography>
                  }
                />
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Box>

      {/* --- Footer --- */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
         <Button onClick={onClose} color="inherit" sx={{ color: 'text.secondary' }}>
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
                boxShadow: theme.shadows[4]
            }}
          >
            {initialData ? "Save Changes" : "Create Vehicle"}
          </Button>
      </Box>
    </Drawer>
  );
};

export default VehicleDrawer;