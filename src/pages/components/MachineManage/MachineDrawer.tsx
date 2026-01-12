

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
import machineApi from "services/machineApi";



interface MachineDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Machine) => void;
  initialData: Machine | null;
  vendorList: Vendor[]; // Received from parent
  loading: boolean;
}

const MachineDrawer: React.FC<MachineDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  vendorList,
  loading,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 800 : "100%";

  // State
  const [showPassword, setShowPassword] = useState(false);
   
  
  // Initialize form state
  const [form, setForm] = useState<Machine & { estateVehicleType?: string; estateMaterialType?: string }>({
    Machine_Id: 0,
    Vendor_Id: 0,
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
          Vendor_Id: 0,
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

  // const validate = (): boolean => {
  //   const newErrors: any = {};
  //   let isValid = true;

  //   const macRegex =
  //   /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$|^([0-9A-F]{4}\.){2}([0-9A-F]{4})$/;

  //   const mac = form.Machine_mac?.trim().toUpperCase();

  //   if (!form.Machine_name?.trim()) { 
  //     newErrors.Machine_name = "Machine name is required";
  //     isValid = false;
  //   }
  //   if (!form.password?.trim()) {
  //     newErrors.password = "Password is required";
  //     isValid = false;
  //   }
  //   if (!form.Vendor_Id || form.Vendor_Id <= 0) {
  //     newErrors.Vendor_Id = "Vendor selection is required";
  //     isValid = false;
  //   }
  //   if (form.Capacity_ton !== undefined && form.Capacity_ton < 0) {
  //     newErrors.Capacity_ton = "Capacity cannot be negative";
  //     isValid = false;
  //   }
  //   if (!mac) {
  //     newErrors.Machine_mac = "MAC address is required";
  //     isValid = false;
  //   } else if (!macRegex.test(mac)) {
  //     newErrors.Machine_mac =
  //       "Invalid MAC address (Format: AA:BB:CC:DD:EE:FF)";
  //     isValid = false;
  //   }

  //   setErrors(newErrors);

  //   if (!isValid) {
  //     setGlobalError("Please correct the highlighted errors below.")
  //   } else {
  //     setGlobalError(null);
  //   }
  //   return isValid;
  // };



  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // --- 1. Machine Name Validation ---
    const name = form.Machine_name?.trim();
    if (!name) {
      newErrors.Machine_name = "Machine name is required.";
      isValid = false;
    } else if (name.length < 3) {
      newErrors.Machine_name = "Machine name must be at least 3 characters.";
      isValid = false;
    } else if (name.length > 50) {
      newErrors.Machine_name = "Machine name cannot exceed 50 characters.";
      isValid = false;
    }

    // --- 2. Password Validation ---
    // Enforcing a minimum length prevents weak setup keys
    const pwd = form.password?.trim();
    if (!pwd) {
      newErrors.password = "Access password is required.";
      isValid = false;
    } else if (pwd.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    // --- 3. Vendor Validation ---
    if (!form.Vendor_Id || form.Vendor_Id === 0) {
      newErrors.Vendor_Id = "Please select a valid vendor associated with this machine.";
      isValid = false;
    }

    // --- 4. Professional MAC Address Validation ---
    const mac = form.Machine_mac?.trim().toUpperCase();
    const macRegex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;


    if (!mac) {
      newErrors.Machine_mac = "MAC address is required.";
      isValid = false;
    } else if (!macRegex.test(mac)) {
      newErrors.Machine_mac = "Invalid format. Expected: XX:XX:XX:XX:XX:XX";
      isValid = false;
    } 

    // --- Capacity Validation (Keep existing logic) ---
    if (form.Capacity_ton !== undefined && form.Capacity_ton < 0) {
      newErrors.Capacity_ton = "Capacity cannot be negative.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setGlobalError("Form contains errors. Please check the fields highlighted below.");
    } else {
      setGlobalError(null);
    }

    return isValid;
  };
  


  const handleSubmit = async () => {
    // 1. Run Validation
    if(!validate()) return;

    // 2. Prepare Payload
    const payload = {
       Vendor_Id: form.Vendor_Id, // Use form value, not hardcoded 1
       Machine_name: form.Machine_name,
       Password: form.password,
       Machine_mac: form.Machine_mac,
       Machine_model: form.Machine_model,
       Capacity_ton: form.Capacity_ton,
       Last_service_date: form.Last_service_date,
       Status: form.Status,
       Machine_type: form.Machine_type,
       Machine_location: form.Machine_location
    };

    try {
      let response
      if (initialData && form.Machine_Id > 0) {
        response = await machineApi.updataMachineDetailes(form.Machine_Id, payload);
      
      } else {
        
        response = await machineApi.addMachinDetails(payload);
      }

      if (response?.success) {
        console.log("Success:", response);
        onSave(response.data);
        onClose();
      }
    } catch(error) {
      console.error("Error submitting form:", error);
      
    }
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
                      divider={false} // Turn off default lines
                      sx={{
                        // 2. The "Floating Pill" Shape
                        borderRadius: '10px',
                        margin: '6px 10px', // Creates space around the item
                        padding: '10px 16px',
                        transition: 'all 0.2s ease-in-out',

                        // 3. Hover Effects
                        '&:hover': {
                          backgroundColor: 'primary.lighter', // or 'rgba(25, 118, 210, 0.08)'
                          transform: 'translateX(5px)', // Slide right effect
                          '& .vendor-avatar': {
                            transform: 'scale(1.1) rotate(-5deg)', // Avatar animation
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="MAC Address"
                  className="input-bg-color label-black"
                  placeholder="e.g. AA:BB:CC:DD:EE:FF"
                  fullWidth
                  value={form.Machine_mac || ""}
                  error={!!errors.Machine_mac}
                  helperText={errors.Machine_mac}
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