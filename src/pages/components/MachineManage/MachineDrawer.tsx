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
//   InputAdornment,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// import { Machine, Vendor } from "pages/RegisterManagement/MachineRegister/MachineRegister";

// import "../../RegisterManagement/MachineRegister/MachineRegister.css";

// interface MachineDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: Machine) => void;
//   initialData: Machine | null;
//   vendors: Vendor[];
//   loading: boolean;
// }

// const MachineDrawer: React.FC<MachineDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   vendors,
//   loading,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);

//   // Default Form
//   const defaultForm: Machine = {
//     id: 0,
//     vendorId: 0,
//     machineName: "",
//     password: "",
//     machineMac: "",
//     machineModel: "",
//     capacityTon: undefined,
//     lastServiceDate: "",
//     machineType: "Company",
//     machineLocation: "",
//   };

//   const [form, setForm] = useState<Machine>(defaultForm);

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

//   const setField = (key: keyof Machine, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   const validate = (): boolean => {
//     if (!form.machineName || !form.machineName.trim()) {
//       setFormError("Machine name is required.");
//       return false;
//     }
//     if (!form.password || !form.password.trim()) {
//       setFormError("Password is required.");
//       return false;
//     }
//     if (!form.vendorId || form.vendorId <= 0) {
//       setFormError("Please select a vendor.");
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

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: drawerWidth,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: "30px",
//           maxWidth: "100%",
//           borderTopLeftRadius: { xs: 0, md: 12 },
//           borderBottomLeftRadius: { xs: 0, md: 12 },
//           height: { xs: "100vh", md: "100vh" },
//         },
//       }}
//       ModalProps={{ keepMounted: true }}
//     >
//       <Box className="drawer-header">
//         <Typography variant="h6">{initialData ? "Edit Machine" : "Add New Machine"}</Typography>
//         <IconButton onClick={onClose} aria-label="close">
//           <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
//       </Box>

//       <Box className="drawer-content">
//         {formError && <Box className="form-error">{formError}</Box>}
        
//         <Stack spacing={2}>
//           <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//             <TextField
//               label="Machine Name"
//               className="input-bg-color"
//               placeholder="Enter machine name"
//               fullWidth
//               value={form.machineName}
//               disabled={loading}
//               onChange={(e) => setField("machineName", e.target.value)}
//             />
//             <TextField
//               label="Password"
//               className="input-bg-color"
//               type={showPassword ? 'text' : "password"}
//               placeholder="*********"
//               fullWidth
//               value={form.password}
//               onChange={(e) => setField("password", e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       edge="end"
//                       sx={{ color: 'text.secondary' }}
//                     >
//                       {showPassword ? (
//                         <IconifyIcon icon="ic:baseline-key-off" />
//                       ) : (
//                         <IconifyIcon icon="ic:baseline-key" />
//                       )}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Stack>

//           <TextField
//             label="Asscoiated Vendor"
//             className="input-bg-color"
//             select
//             fullWidth
//             value={form.vendorId || ""}
//             onChange={(e) => setField("vendorId", Number(e.target.value))}
//           >
//             <MenuItem value={0}><em>None</em></MenuItem>
//             {vendors.map((v) => (
//               <MenuItem key={v.id} value={v.id}>
//                 {v.vendorName}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             label="MAC Address"
//             className="input-bg-color"
//             placeholder="e.g., AA:BB:CC:DD:EE:FF"
//             fullWidth
//             value={form.machineMac || ""}
//             onChange={(e) => setField("machineMac", e.target.value)}
//           />
//           <TextField
//             label="Machine Model"
//             className="input-bg-color"
//             placeholder="e.g., Model X"
//             fullWidth
//             value={form.machineModel || ""}
//             onChange={(e) => setField("machineModel", e.target.value)}
//           />

//           <TextField
//             label="Capacity (tons)"
//             className="input-bg-color"
//             type="number"
//             placeholder="e.g., 5.5"
//             fullWidth
//             value={form.capacityTon ?? ""}
//             onChange={(e) => setField("capacityTon", e.target.value ? parseFloat(e.target.value) : undefined)}
//           />

//           <TextField
//             label="Machine Type"
//             className="input-bg-color"
//             select
//             fullWidth
//             value={form.machineType}
//             onChange={(e) => setField("machineType", e.target.value as "Company" | "ThirdParty" | "Estate")}
//           >
//             <MenuItem value="Company">Company</MenuItem>
//             <MenuItem value="ThirdParty">ThirdParty</MenuItem> 
//             <MenuItem value="Estate">Estate</MenuItem>
//           </TextField>

//           <TextField
//             label="Machine Location"
//             className="input-bg-color"
//             placeholder="e.g., City, State"
//             fullWidth
//             value={form.machineLocation || ""}
//             onChange={(e) => setField("machineLocation", e.target.value)}
//           />
          
//           <TextField
//             label="Last Service Date"
//             className="input-bg-color"
//             type="date"
//             fullWidth
//             value={form.lastServiceDate || ""}
//             onChange={(e) => setField("lastServiceDate", e.target.value)}
//             InputLabelProps={{ shrink: true }}
//           />

//           <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
//             <Button variant="text" className="cancel-button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button variant="contained" className="edit-button" onClick={handleSubmit}>
//               {initialData ? "Update Machine" : "Save Machine"}
//             </Button>
//           </Stack>
//         </Stack>
//       </Box>
//     </Drawer>
//   );
// };

// export default MachineDrawer;









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
//   InputAdornment,
//   useMediaQuery,
//   useTheme,
//   Grid,
//   Paper,
//   Avatar,
//   Collapse,
//   alpha,
//   Alert,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// import { Machine, Vendor } from "pages/RegisterManagement/MachineRegister/MachineRegister";
// import "../../RegisterManagement/MachineRegister/MachineRegister.css";

// interface MachineDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: Machine) => void;
//   initialData: Machine | null;
//   vendors: Vendor[];
//   loading: boolean;
// }

// const MachineDrawer: React.FC<MachineDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   vendors,
//   loading,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? 650 : "100%";

//   // State
//   const [showPassword, setShowPassword] = useState(false);
//   const [form, setForm] = useState<Machine>({
//     id: 0,
//     vendorId: 0,
//     machineName: "",
//     password: "",
//     machineMac: "",
//     machineModel: "",
//     capacityTon: undefined,
//     lastServiceDate: "",
//     machineType: "Company",
//     machineLocation: "",
//   });

//   // Validation State
//   const [errors, setErrors] = useState<Partial<Record<keyof Machine, string>>>({});
//   const [globalError, setGlobalError] = useState<string | null>(null);

//   // Reset or Populate form
//   useEffect(() => {
//     if (open) {
//       setErrors({});
//       setGlobalError(null);
//       setShowPassword(false);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm({
//           id: 0,
//           vendorId: 0,
//           machineName: "",
//           password: "",
//           machineMac: "",
//           machineModel: "",
//           capacityTon: undefined,
//           lastServiceDate: "",
//           machineType: "Company",
//           machineLocation: "",
//         });
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof Machine, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     // Clear specific error on type
//     if (errors[key]) {
//       setErrors((prev) => ({ ...prev, [key]: undefined }));
//     }
//   };

//   const validate = (): boolean => {
//     const newErrors: Partial<Record<keyof Machine, string>> = {};
//     let isValid = true;

//     if (!form.machineName?.trim()) {
//       newErrors.machineName = "Machine name is required";
//       isValid = false;
//     }
//     if (!form.password?.trim()) {
//       newErrors.password = "Password is required";
//       isValid = false;
//     }
//     if (!form.vendorId || form.vendorId <= 0) {
//       newErrors.vendorId = "Vendor selection is required";
//       isValid = false;
//     }
//     if (form.capacityTon !== undefined && form.capacityTon < 0) {
//       newErrors.capacityTon = "Capacity cannot be negative";
//       isValid = false;
//     }

//     setErrors(newErrors);

//     if (!isValid) {
//       setGlobalError("Please correct the highlighted errors below.");
//     } else {
//       setGlobalError(null);
//     }
//     return isValid;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       onSave(form);
//     }
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: drawerWidth,
//           boxShadow: theme.shadows[20],
//         },
//       }}
//     >
//       {/* --- Stylish Header --- */}
//       <Box
//         sx={{
//           px: 2.5,
//           py: 2.3,
//           background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 100%)`,
//           color: "black",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Stack direction="row" spacing={2} alignItems="center">
//           <Avatar
//             sx={{
//               bgcolor: "#7bbefdff",
//               width: 50,
//               height: 50,
//               boxShadow: theme.shadows[3],
//             }}
//           >
//             <IconifyIcon icon="mdi:factory" width={32} color="white" />
//           </Avatar>
//           <Box>
//             <Typography variant="h5" fontWeight="bold">
//               {initialData ? "Edit Machine" : "New Machine"}
//             </Typography>
//             <Typography variant="body2" sx={{ opacity: 0.8 }}>
//               {initialData ? "Update machine configuration" : "Register new industrial equipment"}
//             </Typography>
//           </Box>
//         </Stack>
//         <IconButton
//           onClick={onClose}
//           sx={{
//             color: "black",
//             // bgcolor: "rgba(255,255,255,0.1)",
//             // "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
//           }}
//         >
//           <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
//       </Box>

//       {/* --- Content Area --- */}
//       <Box sx={{ p: 3, overflowY: "auto", flex: 1, bgcolor: theme.palette.background.default }}>
//         <Stack spacing={3}>
//           {globalError && (
//             <Collapse in={!!globalError}>
//               <Alert severity="error" onClose={() => setGlobalError(null)} sx={{ mb: 2 }}>
//                 {globalError}
//               </Alert>
//             </Collapse>
//           )}

//           {/* Section 1: Machine Identity */}
//           <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
//             <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
//               Machine Identity
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Machine Name"
//                   className="input-bg-color label-black"
//                   placeholder="e.g. Weighbridge Unit A"
//                   fullWidth
//                   value={form.machineName}
//                   onChange={(e) => setField("machineName", e.target.value)}
//                   disabled={loading}
//                   error={!!errors.machineName}
//                   helperText={errors.machineName}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="end">
//                         <IconifyIcon icon="mdi:id-card" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Access Password"
//                   className="input-bg-color label-black"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="*********"
//                   fullWidth
//                   value={form.password}
//                   onChange={(e) => setField("password", e.target.value)}
//                   disabled={loading}
//                   error={!!errors.password}
//                   helperText={errors.password}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="end">
//                         <IconifyIcon icon="mdi:lock-outline" />
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                           edge="end"
//                           sx={{ color: 'text.secondary' }} 
//                         >
//                           {showPassword ? (
//                             <IconifyIcon icon="ic:baseline-key-off" />
//                           ) : (
//                             <IconifyIcon icon="ic:baseline-key" />
//                           )}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Associated Vendor"
//                   className="input-bg-color label-black"
//                   select
//                   fullWidth
//                   value={form.vendorId || 0}
//                   onChange={(e) => setField("vendorId", Number(e.target.value))}
//                   disabled={loading}
//                   error={!!errors.vendorId}
//                   helperText={errors.vendorId}
//                 >
//                   <MenuItem value={0} disabled sx={{ color: "text.secondary", fontStyle: "italic" }}>
//                     Select Vendor
//                   </MenuItem>
//                   {vendors.map((v) => (
//                     <MenuItem key={v.id} value={v.id}>
//                       {v.vendorName}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   label="MAC Address"
//                   className="input-bg-color label-black"
//                   placeholder="e.g. AA:BB:CC:DD:EE:FF"
//                   fullWidth
//                   value={form.machineMac || ""}
//                   onChange={(e) => setField("machineMac", e.target.value)}
//                   disabled={loading}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="end">
//                         <IconifyIcon icon="mdi:ethernet" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* Section 2: Technical Specifications */}
//           <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
//             <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
//               Technical Specifications
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Model Number"
//                   className="input-bg-color label-black"
//                   placeholder="e.g. MX-500"
//                   fullWidth
//                   value={form.machineModel || ""}
//                   onChange={(e) => setField("machineModel", e.target.value)}
//                   disabled={loading}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="end">
//                         <IconifyIcon icon="mdi:cog-outline" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Capacity"
//                   className="input-bg-color label-black"
//                   type="number"
//                   placeholder="0.0"
//                   fullWidth
//                   value={form.capacityTon ?? ""}
//                   onChange={(e) =>
//                     setField("capacityTon", e.target.value ? parseFloat(e.target.value) : undefined)
//                   }
//                   disabled={loading}
//                   error={!!errors.capacityTon}
//                   helperText={errors.capacityTon}
//                   InputProps={{
//                     endAdornment: <InputAdornment position="end">tons</InputAdornment>,
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Machine Type"
//                   className="input-bg-color label-black"
//                   select
//                   fullWidth
//                   value={form.machineType}
//                   onChange={(e) =>
//                     setField("machineType", e.target.value as "Company" | "ThirdParty" | "Estate")
//                   }
//                   disabled={loading}
//                 >
//                   <MenuItem value="Company">Company</MenuItem>
//                   <MenuItem value="ThirdParty">Third Party</MenuItem>
//                   <MenuItem value="Estate">Estate</MenuItem>
//                 </TextField>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Last Service Date"
//                   className="input-bg-color label-black"
//                   type="date"
//                   fullWidth
//                   value={form.lastServiceDate || ""}
//                   onChange={(e) => setField("lastServiceDate", e.target.value)}
//                   disabled={loading}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   label="Location"
//                   placeholder="e.g. Factory Floor, Zone B"
//                   className="input-bg-color label-black"
//                   fullWidth
//                   value={form.machineLocation || ""}
//                   onChange={(e) => setField("machineLocation", e.target.value)}
//                   disabled={loading}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="end">
//                         <IconifyIcon icon="mdi:map-marker-outline" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>
//         </Stack>
//       </Box>

//       {/* --- Footer Actions --- */}
//       <Box
//         sx={{
//           p: 2,
//           bgcolor: theme.palette.background.paper,
//           borderTop: `1px solid ${theme.palette.divider}`,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Button onClick={onClose} color="inherit" sx={{ color: "text.secondary" }}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           size="large"
//           startIcon={<IconifyIcon icon="material-symbols:save-rounded" />}
//           sx={{
//             px: 4,
//             borderRadius: 2,
//             boxShadow: theme.shadows[4],
//           }}
//         >
//           {initialData ? "Save Changes" : "Create Machine"}
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default MachineDrawer;








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
    id: 0,
    vendorId: 0,
    machineName: "",
    password: "",
    machineMac: "",
    machineModel: "",
    capacityTon: undefined,
    lastServiceDate: "",
    machineType: "Company",
    machineLocation: "",
    estateVehicleType: "",
    estateMaterialType: "",
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
          id: 0,
          vendorId: 0,
          machineName: "",
          password: "",
          machineMac: "",
          machineModel: "",
          capacityTon: undefined,
          lastServiceDate: "",
          machineType: "Company",
          machineLocation: "",
          estateVehicleType: "",
          estateMaterialType: "",
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

    if (!form.machineName?.trim()) {
      newErrors.machineName = "Machine name is required";
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
    if (form.capacityTon !== undefined && form.capacityTon < 0) {
      newErrors.capacityTon = "Capacity cannot be negative";
      isValid = false;
    }

    // Estate Specific Validation
    if (form.machineType === "Estate") {
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
                  value={form.machineName}
                  onChange={(e) => setField("machineName", e.target.value)}
                  disabled={loading}
                  error={!!errors.machineName}
                  helperText={errors.machineName}
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
                    <MenuItem key={v.id} value={v.id}>
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
                  value={form.machineMac || ""}
                  onChange={(e) => setField("machineMac", e.target.value)}
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
                  value={form.machineModel || ""}
                  onChange={(e) => setField("machineModel", e.target.value)}
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
                  value={form.capacityTon ?? ""}
                  onChange={(e) =>
                    setField("capacityTon", e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  disabled={loading}
                  error={!!errors.capacityTon}
                  helperText={errors.capacityTon}
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
                  value={form.machineType}
                  onChange={(e) => {
                    setField("machineType", e.target.value as any);
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
                  value={form.lastServiceDate || ""}
                  onChange={(e) => setField("lastServiceDate", e.target.value)}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* ----- ESTATE CONFIGURATION CARD (Conditional) ----- */}
              {/* <Grid item xs={12}>
                <Collapse in={form.machineType === "Estate"} timeout="auto" unmountOnExit>
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
                  value={form.machineLocation || ""}
                  onChange={(e) => setField("machineLocation", e.target.value)}
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