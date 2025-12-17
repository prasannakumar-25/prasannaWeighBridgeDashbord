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
//   InputAdornment,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// // import { IPCamera, Machine } from "./IPCameraRegister"; // Import types from Parent
// import { IPCamera, Machine } from "pages/RegisterManagement/IPCameraRegister/IPCameraRegister";

// interface IPCameraDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: IPCamera) => void;
//   initialData: IPCamera | null;
//   machines: Machine[];
// }

// const IPCameraDrawer: React.FC<IPCameraDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   machines,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);

//   // Default Form State
//   const defaultForm: IPCamera = {
//     id: 0,
//     machineId: 0,
//     cameraName: "",
//     ipAddress: "",
//     rtspUrl: "",
//     httpUrl: "",
//     username: "",
//     password: "",
//     macAddress: "",
//     status: "Offline",
//     location: "",
//     installedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
//   };

//   const [form, setForm] = useState<IPCamera>(defaultForm);

//   // Reset or Populate form when Drawer opens
//   useEffect(() => {
//     if (open) {
//       setFormError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm({ ...defaultForm });
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof IPCamera, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = (): boolean => {
//     if (!form.cameraName?.trim()) {
//       setFormError("Camera name is required.");
//       return false;
//     }
//     if (!form.ipAddress?.trim()) {
//       setFormError("IP Address is required.");
//       return false;
//     }
//     if (!form.machineId || form.machineId <= 0) {
//       setFormError("Please associate a Machine.");
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
//           p: 3,
//           borderTopLeftRadius: { xs: 0, md: 12 },
//           borderBottomLeftRadius: { xs: 0, md: 12 },
//         },
//       }}
//     >
//       {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h6" fontWeight="bold">
//           {initialData ? "Edit Camera" : "Add New Camera"}
//         </Typography>
//         <IconButton onClick={onClose}>
//           <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
//       </Box> */}
//       <Box className="drawer-header">
//         <Typography variant="h6">{initialData ? "Edit Machine" : "Add New Machine"}</Typography>
//         <IconButton onClick={onClose} aria-label="close">
//             <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
//         </Box>

//       <Stack spacing={2.5}>
//         {formError && <Alert severity="error">{formError}</Alert>}

//         {/* Basic Info */}
//         <TextField
//           label="Camera Name"
//           className="input-bg-color label-black" 
//           placeholder="Enter camera name"
//           fullWidth
//           value={form.cameraName}
//           onChange={(e) => setField("cameraName", e.target.value)}
//         />

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Associated Machine"
//             className="input-bg-color label-black" 
//             select
//             fullWidth
//             value={form.machineId || ""}
//             onChange={(e) => setField("machineId", Number(e.target.value))}
//           >
//             <MenuItem value={0}><em>None</em></MenuItem>
//             {machines.map((m) => (
//               <MenuItem key={m.id} value={m.id}>
//                 {m.machineName}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             label="Status"
//             className="input-bg-color label-black" 
//             select
//             fullWidth
//             value={form.status}
//             onChange={(e) => setField("status", e.target.value)}
//           >
//             <MenuItem value="Online">Online</MenuItem>
//             <MenuItem value="Offline">Offline</MenuItem>
//             <MenuItem value="Error">Error</MenuItem>
//           </TextField>
//         </Stack>

//         {/* Network Info */}
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="IP Address"
//             className="input-bg-color label-black" 
//             placeholder="e.g., 192.168.1.100"
//             fullWidth
//             value={form.ipAddress}
//             onChange={(e) => setField("ipAddress", e.target.value)}
//           />
//           <TextField
//             label="MAC Address"
//             className="input-bg-color label-black" 
//             placeholder="e.g., AA:BB:CC:DD:EE:FF"
//             fullWidth
//             value={form.macAddress || ""}
//             onChange={(e) => setField("macAddress", e.target.value)}
//           />
//         </Stack>

//         {/* URLs */}
//         <TextField
//           label="RTSP URL"
//           className="input-bg-color label-black" 
//           placeholder="rtsp://..."
//           fullWidth
//           value={form.rtspUrl || ""}
//           onChange={(e) => setField("rtspUrl", e.target.value)}
//         />
//         <TextField
//           label="HTTP URL"
//           className="input-bg-color label-black" 
//           placeholder="http://..."
//           fullWidth
//           value={form.httpUrl || ""}
//           onChange={(e) => setField("httpUrl", e.target.value)}
//         />

//         {/* Credentials */}
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Username"
//             className="input-bg-color label-black" 
//             placeholder="Camera username"
//             fullWidth
//             value={form.username || ""}
//             onChange={(e) => setField("username", e.target.value)}
//           />

//           <TextField
//             label="Password"
//             className="input-bg-color label-black" 
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Camera password"
//             fullWidth
//             value={form.password || ""}
//             onChange={(e) => setField("password", e.target.value)}
//             InputProps={{
//               // endAdornment: (
//               //   <InputAdornment position="end">
//               //     <IconButton
//               //       onClick={() => setShowPassword(!showPassword)}
//               //       edge="end"
//               //     >
//               //       <IconifyIcon icon={showPassword ? "ic:baseline-key-off" : "ic:baseline-key"} />
//               //     </IconButton>
//               //   </InputAdornment>
//               // ),
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     // className="input-bg-color"
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                     sx={{
//                       color: 'text.secondary',
//                     }}
//                   >
//                     {showPassword ? (
//                       <IconifyIcon icon="ic:baseline-key-off" />
//                     ) : (
//                       <IconifyIcon icon="ic:baseline-key" />
//                     )}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Stack>

//         {/* Location & Date */}
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Location"
//             className="input-bg-color label-black" 
//             placeholder="e.g., Main Entrance"
//             fullWidth
//             value={form.location || ""}
//             onChange={(e) => setField("location", e.target.value)}
//           />
//           <TextField
//             label="Installed Date"
//             className="input-bg-color label-black"
//             type="date"
//             fullWidth
//             value={form.installedDate || ""}
//             onChange={(e) => setField("installedDate", e.target.value)}
//             InputLabelProps={{ shrink: true }}
//           />
//         </Stack>
//         <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//         <Button variant="text" className="cancel-button" onClick={onClose} 
//         >
//             Cancel
//         </Button>
        
//         <Button variant="contained" className="edit-button" onClick={handleSubmit} 
//         >
//             {initialData ? "Update Machine" : "Save Machine"}
//         </Button>
//         </Stack>

//         {/* Buttons
//         <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//           <Button onClick={onClose} color="inherit">
//             Cancel
//           </Button>

//           <Button variant="contained" onClick={handleSubmit}>
//             {initialData ? "Update" : "Save"}
//           </Button>
//         </Stack> */}
//       </Stack>
//     </Drawer>
//   );
// };

// export default IPCameraDrawer;










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
//   InputAdornment,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// import { IPCamera, Machine } from "pages/RegisterManagement/IPCameraRegister/IPCameraRegister"; 

// import "../../RegisterManagement/MachineRegister/MachineRegister.css";

// interface IPCameraDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: IPCamera) => void;
//   initialData: IPCamera | null;
//   machines: Machine[];
//   loading: boolean;
// }

// const IPCameraDrawer: React.FC<IPCameraDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   machines,
//   loading,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);

//   // Default Form State
//   const defaultForm: IPCamera = {
//     id: 0,
//     machineId: 0,
//     cameraName: "",
//     ipAddress: "",
//     rtspUrl: "",
//     httpUrl: "",
//     username: "",
//     password: "",
//     macAddress: "",
//     status: "Offline",
//     location: "",
//     installedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
//   };

//   const [form, setForm] = useState<IPCamera>(defaultForm);

//   // Reset or Populate form when Drawer opens
//   useEffect(() => {
//     if (open) {
//       setFormError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm({ ...defaultForm });
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof IPCamera, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = (): boolean => {
//     if (!form.cameraName?.trim()) {
//       setFormError("Camera name is required.");
//       return false;
//     }
//     if (!form.ipAddress?.trim()) {
//       setFormError("IP Address is required.");
//       return false;
//     }
//     if (!form.machineId || form.machineId <= 0) {
//       setFormError("Please associate a Machine.");
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
//           p: 3,
//           borderTopLeftRadius: { xs: 0, md: 12 },
//           borderBottomLeftRadius: { xs: 0, md: 12 },
//         },
//       }}
//     >
//       <Box className="drawer-header" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h6" fontWeight="bold">
//             {initialData ? "Edit Camera" : "Add New Camera"}
//         </Typography>
//         <IconButton onClick={onClose} aria-label="close">
//             <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
//       </Box>

//       <Stack spacing={2.5}>
//         {formError && <Alert severity="error">{formError}</Alert>}

//         {/* Basic Info */}
//         <TextField
//           label="Camera Name"
//           className="input-bg-color label-black" 
//           placeholder="Enter camera name"
//           fullWidth
//           value={form.cameraName}
//           onChange={(e) => setField("cameraName", e.target.value)}
//         />

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Associated Machine"
//             className="input-bg-color label-black" 
//             select
//             fullWidth
//             value={form.machineId || ""}
//             onChange={(e) => setField("machineId", Number(e.target.value))}
//           >
//             <MenuItem value={0}><em>None</em></MenuItem>
//             {machines.map((m) => (
//               <MenuItem key={m.id} value={m.id}>
//                 {m.machineName}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             label="Status"
//             className="input-bg-color label-black" 
//             select
//             fullWidth
//             value={form.status}
//             onChange={(e) => setField("status", e.target.value)}
//           >
//             <MenuItem value="Online">Online</MenuItem>
//             <MenuItem value="Offline">Offline</MenuItem>
//             <MenuItem value="Error">Error</MenuItem>
//           </TextField>
//         </Stack>

//         {/* Network Info */}
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="IP Address"
//             className="input-bg-color label-black" 
//             placeholder="e.g., 192.168.1.100"
//             fullWidth
//             value={form.ipAddress}
//             onChange={(e) => setField("ipAddress", e.target.value)}
//           />
//           <TextField
//             label="MAC Address"
//             className="input-bg-color label-black" 
//             placeholder="e.g., AA:BB:CC:DD:EE:FF"
//             fullWidth
//             value={form.macAddress || ""}
//             onChange={(e) => setField("macAddress", e.target.value)}
//           />
//         </Stack>

//         {/* URLs */}
//         <TextField
//           label="RTSP URL"
//           className="input-bg-color label-black" 
//           placeholder="rtsp://..."
//           fullWidth
//           value={form.rtspUrl || ""}
//           onChange={(e) => setField("rtspUrl", e.target.value)}
//         />
//         <TextField
//           label="HTTP URL"
//           className="input-bg-color label-black" 
//           placeholder="http://..."
//           fullWidth
//           value={form.httpUrl || ""}
//           onChange={(e) => setField("httpUrl", e.target.value)}
//         />

//         {/* Credentials */}
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Username"
//             className="input-bg-color label-black" 
//             placeholder="Camera username"
//             fullWidth
//             value={form.username || ""}
//             onChange={(e) => setField("username", e.target.value)}
//           />

//           <TextField
//             label="Password"
//             className="input-bg-color label-black" 
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Camera password"
//             fullWidth
//             value={form.password || ""}
//             onChange={(e) => setField("password", e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                     sx={{
//                       color: 'text.secondary',
//                     }}
//                   >
//                     {showPassword ? (
//                       <IconifyIcon icon="ic:baseline-key-off" />
//                     ) : (
//                       <IconifyIcon icon="ic:baseline-key" />
//                     )}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Stack>

//         {/* Location & Date */}
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Location"
//             className="input-bg-color label-black" 
//             placeholder="e.g., Main Entrance"
//             fullWidth
            
//             value={form.location || ""}
//             onChange={(e) => setField("location", e.target.value)}
//           />
//           <TextField
//             label="Installed Date"
//             className="input-bg-color label-black"
//             type="date"
//             fullWidth
//             value={form.installedDate || ""}
//             onChange={(e) => setField("installedDate", e.target.value)}
//             InputLabelProps={{ shrink: true }}
//           />
//         </Stack>
//         <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//             <Button variant="text" className="cancel-button" onClick={onClose}>
//                 Cancel
//             </Button>
            
//             <Button variant="contained" className="edit-button" onClick={handleSubmit}>
//                 {initialData ? "Update Camera" : "Save Camera"}
//             </Button>
//         </Stack>
//       </Stack>
//     </Drawer>
//   );
// };

// export default IPCameraDrawer;








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
  InputAdornment,
  useMediaQuery,
  useTheme,
  Grid,
  Paper,
  Avatar,
  Collapse,
  alpha,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { IPCamera, Machine } from "pages/RegisterManagement/IPCameraRegister/IPCameraRegister"; 
import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface IPCameraDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: IPCamera) => void;
  initialData: IPCamera | null;
  machines: Machine[];
  loading: boolean;
}

const IPCameraDrawer: React.FC<IPCameraDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  machines,
  loading,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 650 : "100%";

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<IPCamera>({
    id: 0,
    machineId: 0,
    cameraName: "",
    ipAddress: "",
    rtspUrl: "",
    httpUrl: "",
    username: "",
    password: "",
    macAddress: "",
    status: "Offline",
    location: "",
    installedDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IPCamera, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Reset or Populate form
  useEffect(() => {
    if (open) {
      setErrors({});
      setGlobalError(null);
      setShowPassword(false);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm({
            id: 0,
            machineId: 0,
            cameraName: "",
            ipAddress: "",
            rtspUrl: "",
            httpUrl: "",
            username: "",
            password: "",
            macAddress: "",
            status: "Offline",
            location: "",
            installedDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof IPCamera, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error on type
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof IPCamera, string>> = {};
    let isValid = true;

    if (!form.cameraName?.trim()) {
      newErrors.cameraName = "Camera name is required";
      isValid = false;
    }
    if (!form.machineId || form.machineId === 0) {
      newErrors.machineId = "Associated Machine is required";
      isValid = false;
    }
    if (!form.ipAddress?.trim()) {
      newErrors.ipAddress = "IP Address is required";
      isValid = false;
    }
    // Optional: Validate IP format regex if needed
    
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
            <IconifyIcon icon="mdi:cctv" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {initialData ? "Edit Camera" : "New Camera"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {initialData ? "Update surveillance details" : "Register a new IP camera"}
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

          {/* Section 1: General Information */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                General Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Camera Name"
                        className="input-bg-color  "
                        placeholder="e.g. Main Gate Camera 01"
                        fullWidth
                        value={form.cameraName}
                        onChange={(e) => setField("cameraName", e.target.value)}
                        disabled={loading}
                        error={!!errors.cameraName}
                        helperText={errors.cameraName}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:videocam-outline" /></InputAdornment>
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Associated Machine"
                        className="input-bg-color label-black"
                        select
                        fullWidth
                        value={form.machineId || 0}
                        onChange={(e) => setField("machineId", Number(e.target.value))}
                        disabled={loading}
                        error={!!errors.machineId}
                        helperText={errors.machineId}
                    >
                        <MenuItem value={0} disabled sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Select Machine
                        </MenuItem>
                        {machines.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                            {m.machineName}
                        </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Status"
                        className="input-bg-color label-black"
                        select
                        fullWidth
                        value={form.status}
                        onChange={(e) => setField("status", e.target.value)}
                        disabled={loading}
                    >
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Offline">Offline</MenuItem>
                        <MenuItem value="Error">Error</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Location"
                        className="input-bg-color label-black"
                        placeholder="e.g. Main Entrance"
                        fullWidth
                        value={form.location || ""}
                        onChange={(e) => setField("location", e.target.value)}
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

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Installed Date"
                        className="input-bg-color label-black"
                        type="date"
                        fullWidth
                        value={form.installedDate || ""}
                        onChange={(e) => setField("installedDate", e.target.value)}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
          </Paper>

          {/* Section 2: Network Configuration */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                Network Configuration
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="IP Address"
                        className="input-bg-color label-black"
                        placeholder="192.168.1.X"
                        fullWidth
                        value={form.ipAddress}
                        onChange={(e) => setField("ipAddress", e.target.value)}
                        disabled={loading}
                        error={!!errors.ipAddress}
                        helperText={errors.ipAddress}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:ip-network" /></InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="MAC Address"
                        className="input-bg-color label-black"
                        placeholder="AA:BB:CC:DD:EE:FF"
                        fullWidth
                        value={form.macAddress || ""}
                        onChange={(e) => setField("macAddress", e.target.value)}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="RTSP URL"
                        className="input-bg-color label-black"
                        placeholder="rtsp://user:pass@ip:port/stream"
                        fullWidth
                        value={form.rtspUrl || ""}
                        onChange={(e) => setField("rtspUrl", e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:cast-connected" /></InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="HTTP URL"
                        placeholder="http://ip:port/video"
                        className="input-bg-color label-black"
                        fullWidth
                        value={form.httpUrl || ""}
                        onChange={(e) => setField("httpUrl", e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:web" /></InputAdornment>
                        }}
                    />
                </Grid>
            </Grid>
          </Paper>

          {/* Section 3: Credentials */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                Security Credentials
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Username"
                        className="input-bg-color label-black"
                        fullWidth
                        value={form.username || ""}
                        onChange={(e) => setField("username", e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:account-outline" /></InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Password"
                        className="input-bg-color label-black"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={form.password || ""}
                        onChange={(e) => setField("password", e.target.value)}
                        disabled={loading}
                        InputProps={{
                        startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:lock-outline" /></InputAdornment>,
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
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
            {initialData ? "Save Changes" : "Create Camera"}
          </Button>
      </Box>
    </Drawer>
  );
};

export default IPCameraDrawer;