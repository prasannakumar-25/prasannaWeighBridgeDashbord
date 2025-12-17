// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
//   Alert,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// // import { Machine, Vehicle, Vendor } from "./VehicleRegister"; // Importing types from Parent
// import { Machine, Vehicle, Vendor } from "pages/RegisterManagement/VehicleRegister/VehicleRegister";

// interface VehicleDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (vehicleData: Vehicle) => void;
//   initialData: Vehicle | null;
//   vendors: Vendor[];
//   machines: Machine[]; // Passed to show linked machines
//   loading: boolean;
// }

// const VehicleDrawer: React.FC<VehicleDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   vendors,
//   machines,
//   loading,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);
  
//   // Default Form State
//   const defaultForm: Vehicle = {
//     id: 0,
//     vehicleType: "",
//     vendorId: undefined,
//     customerId: undefined,
//     tareWeight: undefined,
//     status: "Active",
//     createdDate: new Date().toISOString(),
//   };

//   const [form, setForm] = useState<Vehicle>(defaultForm);

//   // Reset or Populate form when Drawer opens
//   useEffect(() => {
//     if (open) {
//       setFormError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm(defaultForm);
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof Vehicle, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = (): boolean => {
//     if (!form.vehicleType?.trim()) {
//       setFormError("Vehicle type is required.");
//       return false;
//     }
//     if (form.tareWeight && form.tareWeight < 0) {
//       setFormError("Tare weight cannot be negative.");
//       return false;
//     }
//     setFormError(null);
//     return true;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       onSave(form);
//     }
//   };

//   // Helper: Get machines for the drawer dropdown info
//   const getVendorMachines = () => {
//     if (!form.vendorId) return [];
//     return machines.filter((m) => m.vendorId === form.vendorId);
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: drawerWidth,
//           p: 3,
//           borderTopLeftRadius: { xs: 0, md: 12 },
//           borderBottomLeftRadius: { xs: 0, md: 12 },
//         },
//       }}
//     >
//       {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h6" fontWeight="bold">
//           {initialData ? "Edit Vehicle" : "Add New Vehicle"}
//         </Typography>
//         <IconButton onClick={onClose}>
//           <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
        
//       </Box> */}
//       <Box className="drawer-header">
//       <Typography variant="h6">{initialData ? "Edit Machine" : "Add New Machine"}</Typography>
//       <IconButton onClick={onClose} aria-label="close">
//           <IconifyIcon icon="material-symbols:close-rounded" />
//       </IconButton>
//       </Box>

//       <Stack spacing={2.5}>
//         {formError && <Alert severity="error">{formError}</Alert>}

//         <TextField
//           label="Vehicle Type"
//           className="input-bg-color label-black"
//           placeholder="e.g., Truck, Van, Lorry"
//           fullWidth
//           value={form.vehicleType}
//           onChange={(e) => setField("vehicleType", e.target.value)}
//           disabled={loading}
//         />

//         <TextField
//           label="Vendor"
//           className="input-bg-color label-black"
//           select
//           fullWidth
//           value={form.vendorId || ""}
//           onChange={(e) => setField("vendorId", e.target.value ? Number(e.target.value) : undefined)}
//           disabled={loading}
//         >
//           <MenuItem value={0}>
//             <em>None</em>
//           </MenuItem>
//           {vendors.map((v) => (
//             <MenuItem key={v.id} value={v.id}>
//               {v.vendorName}
//             </MenuItem>
//           ))}
//         </TextField>

//         {/* Dynamic info about machines */}
//         {form.vendorId && getVendorMachines().length > 0 && (
//           <Alert severity="info" sx={{ py: 0 }}>
//             <Typography variant="caption" fontWeight="bold">
//               Linked Machines:
//             </Typography>
//             {getVendorMachines().map((machine) => (
//               <Typography key={machine.id} variant="caption" display="block">
//                 • {machine.machineName} ({machine.machineType})
//               </Typography>
//             ))}
//           </Alert>
//         )}

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Customer ID"
//             className="input-bg-color label-black"
//             type="number"
//             placeholder="ID"
//             fullWidth
//             value={form.customerId ?? ""}
//             onChange={(e) => setField("customerId", e.target.value ? Number(e.target.value) : undefined)}
//             disabled={loading}
//           />

//           <TextField
//             label="Tare Weight (kg)"
//             className="input-bg-color label-black"
//             type="number"
//             placeholder="0.00"
//             fullWidth
//             value={form.tareWeight ?? ""}
//             onChange={(e) => setField("tareWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
//             disabled={loading}
//           />
//         </Stack>

//         <TextField
//           label="Status"
//           className="input-bg-color label-black"
//           select
//           fullWidth
//           value={form.status}
//           onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
//           disabled={loading}
//         >
//           <MenuItem value="Active">Active</MenuItem>
//           <MenuItem value="Inactive">Inactive</MenuItem>
//         </TextField>

//         <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//           <Button variant="text" className="cancel-button" onClick={onClose} 
//           >
//               Cancel
//           </Button>

//           <Button variant="contained" className="edit-button" onClick={handleSubmit} 
//           >
//               {initialData ? "Update Machine" : "Save Machine"}
//           </Button>
//           </Stack>

//         {/* <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//           <Button onClick={onClose} color="inherit">
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {initialData ? "Update" : "Save"}
//           </Button>
//         </Stack> */}
//       </Stack>
//     </Drawer>
//   );
// };

// export default VehicleDrawer;









// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
//   Alert,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// import { Machine, Vehicle, Vendor } from "pages/RegisterManagement/VehicleRegister/VehicleRegister";

// interface VehicleDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (vehicleData: Vehicle) => void;
//   initialData: Vehicle | null;
//   vendors: Vendor[];
//   machines: Machine[]; 
//   loading?: boolean;
// }

// const VehicleDrawer: React.FC<VehicleDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   vendors,
//   machines,
//   loading = false
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);
  
//   // Default Form State
//   const defaultForm: Vehicle = {
//     id: 0,
//     vehicleType: "",
//     vendorId: undefined,
//     customerId: undefined,
//     tareWeight: undefined,
//     status: "Active",
//     createdDate: new Date().toISOString(),
//   };

//   const [form, setForm] = useState<Vehicle>(defaultForm);

//   // Reset or Populate form when Drawer opens
//   useEffect(() => {
//     if (open) {
//       setFormError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm(defaultForm);
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof Vehicle, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = (): boolean => {
//     if (!form.vehicleType?.trim()) {
//       setFormError("Vehicle type is required.");
//       return false;
//     }
//     if (form.tareWeight && form.tareWeight < 0) {
//       setFormError("Tare weight cannot be negative.");
//       return false;
//     }
//     setFormError(null);
//     return true;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       onSave(form);
//     }
//   };

//   // Helper: Get machines for the drawer dropdown info
//   const getVendorMachines = () => {
//     if (!form.vendorId) return [];
//     return machines.filter((m) => m.vendorId === form.vendorId);
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: drawerWidth,
//           p: 3,
//           borderTopLeftRadius: { xs: 0, md: 12 },
//           borderBottomLeftRadius: { xs: 0, md: 12 },
//         },
//       }}
//     >
//       <Box className="drawer-header" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h6" fontWeight="bold">
//             {initialData ? "Edit Vehicle" : "Add New Vehicle"}
//         </Typography>
//         <IconButton onClick={onClose} aria-label="close">
//             <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
//       </Box>

//       <Stack spacing={2.5}>
//         {formError && <Alert severity="error">{formError}</Alert>}

//         <TextField
//           label="Vehicle Type"
//           className="input-bg-color label-black"
//           placeholder="e.g., Truck, Van, Lorry"
//           fullWidth
//           value={form.vehicleType}
//           onChange={(e) => setField("vehicleType", e.target.value)}
//           disabled={loading}
//         />

//         <TextField
//           label="Vendor"
//           className="input-bg-color label-black"
//           select
//           fullWidth
//           value={form.vendorId || ""}
//           onChange={(e) => setField("vendorId", e.target.value ? Number(e.target.value) : undefined)}
//           disabled={loading}
//         >
//           <MenuItem value={0}>
//             <em>None</em>
//           </MenuItem>
//           {vendors.map((v) => (
//             <MenuItem key={v.id} value={v.id}>
//               {v.vendorName}
//             </MenuItem>
//           ))}
//         </TextField>

//         {/* Dynamic info about machines */}
//         {form.vendorId && getVendorMachines().length > 0 && (
//           <Alert severity="info" sx={{ py: 0 }}>
//             <Typography variant="caption" fontWeight="bold">
//               Linked Machines:
//             </Typography>
//             {getVendorMachines().map((machine) => (
//               <Typography key={machine.id} variant="caption" display="block">
//                 • {machine.machineName} ({machine.machineType})
//               </Typography>
//             ))}
//           </Alert>
//         )}

//         {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
//           <TextField
//             label="Customer ID"
//             className="input-bg-color label-black"
//             type="number"
//             placeholder="ID"
//             fullWidth
//             value={form.customerId ?? ""}
//             onChange={(e) => setField("customerId", e.target.value ? Number(e.target.value) : undefined)}
//             disabled={loading}
//           />

//           <TextField
//             label="Tare Weight (kg)"
//             className="input-bg-color label-black"
//             type="number"
//             placeholder="0.00"
//             fullWidth
//             value={form.tareWeight ?? ""}
//             onChange={(e) => setField("tareWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
//             disabled={loading}
//           />
//         {/* </Stack> */}

//         <TextField
//           label="Status"
//           className="input-bg-color label-black"
//           select
//           fullWidth
//           value={form.status}
//           onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
//           disabled={loading}
//         >
//           <MenuItem value="Active">Active</MenuItem>
//           <MenuItem value="Inactive">Inactive</MenuItem>
//         </TextField>

//         <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//           <Button variant="text" className="cancel-button" onClick={onClose}>
//               Cancel
//           </Button>

//           <Button variant="contained" className="edit-button" onClick={handleSubmit} disabled={loading}>
//               {initialData ? "Update Vehicle" : "Save Vehicle"}
//           </Button>
//         </Stack>
//       </Stack>
//     </Drawer>
//   );
// };

// export default VehicleDrawer;











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

interface VehicleDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (vehicleData: Vehicle) => void;
  initialData: Vehicle | null;
  vendors: Vendor[];
  machines: Machine[];
  loading?: boolean;
}

const VehicleDrawer: React.FC<VehicleDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  vendors,
  machines,
  loading = false,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 650 : "100%"; // Slightly narrower for a cleaner look

  // Form State
  const [form, setForm] = useState<Vehicle>({
    id: 0,
    vehicleType: "",
    vendorId: undefined,
    customerId: undefined,
    tareWeight: undefined,
    status: "Active",
    createdDate: new Date().toISOString(),
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
          id: 0,
          vehicleType: "",
          vendorId: undefined,
          customerId: undefined,
          tareWeight: undefined,
          status: "Active",
          createdDate: new Date().toISOString(),
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

    if (!form.vehicleType?.trim()) {
      newErrors.vehicleType = "Vehicle Type is required";
      isValid = false;
    }
    if (form.tareWeight !== undefined && form.tareWeight < 0) {
      newErrors.tareWeight = "Cannot be negative";
      isValid = false;
    }

    setErrors(newErrors);
    setGlobalError(isValid ? null : "Please check the highlighted fields.");
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(form);
    }
  };

  const getVendorMachines = () => {
    if (!form.vendorId) return [];
    return machines.filter((m) => m.vendorId === form.vendorId);
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
              {initialData ? `#${form.id} - ${form.vehicleType}` : "Register a new transport unit"}
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
                  value={form.vehicleType}
                  onChange={(e) => setField("vehicleType", e.target.value)}
                  disabled={loading}
                  error={!!errors.vehicleType}
                  helperText={errors.vehicleType}
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
                  value={form.tareWeight ?? ""}
                  onChange={(e) => setField("tareWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
                  disabled={loading}
                  error={!!errors.tareWeight}
                  helperText={errors.tareWeight}
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
              <TextField
                label="Associated Vendor"
                select
                fullWidth
                value={form.vendorId || 0}
                onChange={(e) => setField("vendorId", Number(e.target.value) || undefined)}
                disabled={loading}
              >
                <MenuItem value={0} sx={{ color: 'text.secondary' }}>
                  <em>No Vendor Linked</em>
                </MenuItem>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.vendorName}
                  </MenuItem>
                ))}
              </TextField>

              {/* Smart Info Widget for Machines */}
              <Collapse in={!!form.vendorId && getVendorMachines().length > 0}>
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
                        key={machine.id}
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