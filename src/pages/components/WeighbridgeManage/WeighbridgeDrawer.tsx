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
// // import { Machine, Weighbridge } from "./WeighbridgeRegister"; // Import types from Parent
// import { Machine, Weighbridge } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";

// interface WeighbridgeDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: Weighbridge) => void;
//   initialData: Weighbridge | null;
//   machines: Machine[];
//   loading?: boolean;
// }

// const WeighbridgeDrawer: React.FC<WeighbridgeDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   machines,
//   loading = false,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);

//   // Default Form State
//   const defaultForm: Weighbridge = {
//     id: 0,
//     machineId: undefined,
//     serialNo: "",
//     port: "COM4",
//     baudRate: "19200",
//     dataBit: 8,
//     stopBit: 1,
//     party: "None",
//     createdAt: new Date().toISOString(),
//   };

//   const [form, setForm] = useState<Weighbridge>(defaultForm);

//   // Reset or Populate form when Drawer opens
//   useEffect(() => {
//     if (open) {
//       setFormError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm({ ...defaultForm, createdAt: new Date().toISOString() });
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof Weighbridge, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = (): boolean => {
//     if (!form.serialNo?.trim()) {
//       setFormError("Serial Number is required.");
//       return false;
//     }
//     if (!form.machineId) {
//       setFormError("Please associate a Machine.");
//       return false;
//     }
//     if (!form.party?.trim()) {
//       setFormError("Party (Parity) is required.");
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
//           {initialData ? "Edit Weighbridge" : "Add New Weighbridge"}
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
//           label="Associated Machine"
//           className="input-bg-color label-black"
//           select
//           fullWidth
//           value={form.machineId || ""}
//           onChange={(e) => setField("machineId", Number(e.target.value))}
//           disabled={loading}
//         >
//           <MenuItem value={0}>
//             <em>None</em>
//           </MenuItem>
//           {machines.map((m) => (
//             <MenuItem key={m.id} value={m.id}>
//               {m.machineName}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           label="Serial No"
//           className="input-bg-color label-black"
//           placeholder="Enter Serial Number"
//           fullWidth
//           value={form.serialNo}
//           onChange={(e) => setField("serialNo", e.target.value)}
//           disabled={loading}
//         />

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Port"
//             className="input-bg-color label-black"
//             select
//             fullWidth
//             value={form.port}
//             onChange={(e) => setField("port", e.target.value)}
//             disabled={loading}
//           >
//             <MenuItem value="COM3">COM3</MenuItem>
//             <MenuItem value="COM4">COM4</MenuItem>
//           </TextField>

//           <TextField
//             label="Baud Rate"
//             className="input-bg-color label-black"
//             placeholder="e.g. 19200"
//             fullWidth
//             value={form.baudRate}
//             onChange={(e) => setField("baudRate", e.target.value)}
//             disabled={loading}
//           />
//         </Stack>

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Data Bit"
//             className="input-bg-color label-black"
//             type="number"
//             fullWidth
//             value={form.dataBit}
//             onChange={(e) => setField("dataBit", Number(e.target.value))}
//             disabled={loading}
//           />

//           <TextField
//             label="Stop Bit"
//             className="input-bg-color label-black"
//             type="number"
//             fullWidth
//             value={form.stopBit}
//             onChange={(e) => setField("stopBit", Number(e.target.value))}
//             disabled={loading}
//           />
//         </Stack>

//         <TextField
//           label="Party (Parity)"
//           className="input-bg-color label-black"
//           placeholder="e.g. None, Even, Odd"
//           fullWidth
//           value={form.party}
//           onChange={(e) => setField("party", e.target.value)}
//           disabled={loading}
//         />

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

// export default WeighbridgeDrawer;











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
//   Grid,
//   Divider,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// import { Weighbridge, Machine } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";
// import "../../RegisterManagement/MachineRegister/MachineRegister.css";

// interface WeighbridgeDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: Weighbridge) => void;
//   initialData: Weighbridge | null;
//   machines: Machine[];
//   loading?: boolean;
// }

// const WeighbridgeDrawer: React.FC<WeighbridgeDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   machines,
//   loading = false,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? 600 : "100%";

//   // State for form data and specific field errors
//   const [form, setForm] = useState<Weighbridge>({
//     id: 0,
//     machineId: undefined,
//     serialNo: "",
//     port: "COM4",
//     baudRate: "19200",
//     dataBit: 8,
//     stopBit: 1,
//     party: "None",
//     createdAt: new Date().toISOString(),
//   });

//   const [errors, setErrors] = useState<Partial<Record<keyof Weighbridge, string>>>({});
//   const [globalError, setGlobalError] = useState<string | null>(null);

//   // Reset or Populate form when Drawer opens
//   useEffect(() => {
//     if (open) {
//       setErrors({});
//       setGlobalError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm({
//           id: 0,
//           machineId: undefined,
//           serialNo: "",
//           port: "COM4",
//           baudRate: "19200",
//           dataBit: 8,
//           stopBit: 1,
//           party: "None",
//           createdAt: new Date().toISOString(),
//         });
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof Weighbridge, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     // Clear error for this field when user types
//     if (errors[key]) {
//       setErrors((prev) => ({ ...prev, [key]: undefined }));
//     }
//   };

//   const validate = (): boolean => {
//     const newErrors: Partial<Record<keyof Weighbridge, string>> = {};
//     let isValid = true;

//     if (!form.machineId) {
//       newErrors.machineId = "Machine selection is required";
//       isValid = false;
//     }
//     if (!form.serialNo?.trim()) {
//       newErrors.serialNo = "Serial Number is required";
//       isValid = false;
//     }
//     if (!form.baudRate) {
//         newErrors.baudRate = "Baud Rate is required";
//         isValid = false;
//     }
//     if (!form.party) {
//         newErrors.party = "Parity is required";
//         isValid = false;
//     }

//     setErrors(newErrors);
    
//     if (!isValid) {
//         setGlobalError("Please correct the highlighted errors below.");
//     } else {
//         setGlobalError(null);
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
//           borderTopLeftRadius: { xs: 0, md: 16 },
//           borderBottomLeftRadius: { xs: 0, md: 16 },
//           boxShadow: theme.shadows[8],
//         },
//       }}
//     >
//       {/* Header */}
//       <Box 
//         sx={{ 
//             p: 3, 
//             borderBottom: `1px solid ${theme.palette.divider}`,
//             display: "flex", 
//             justifyContent: "space-between", 
//             alignItems: "center",
//             bgcolor: theme.palette.grey[50]
//         }}
//       >
//         <Box>
//             <Typography variant="h6" fontWeight="bold">
//                 {initialData ? "Edit Weighbridge" : "New Weighbridge"}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//                 {initialData ? "Update device configuration" : "Register a new device to the system"}
//             </Typography>
//         </Box>
//         <IconButton onClick={onClose} aria-label="close" sx={{ color: theme.palette.grey[500] }}>
//             <IconifyIcon icon="material-symbols:close-rounded" width={24} />
//         </IconButton>
//       </Box>

//       {/* Content */}
//       <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
//         <Stack spacing={3}>
            
//             {globalError && (
//                 <Alert severity="error" onClose={() => setGlobalError(null)}>
//                     {globalError}
//                 </Alert>
//             )}

//             {/* Section 1: Device Info */}
//             <Box>
//                 <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
//                     Device Information
//                 </Typography>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                         <TextField
//                         label="Associated Machine"
//                         select
//                         fullWidth
//                         value={form.machineId || ""}
//                         onChange={(e) => setField("machineId", Number(e.target.value))}
//                         disabled={loading}
//                         error={!!errors.machineId}
//                         helperText={errors.machineId}
//                         >
//                         <MenuItem value={0} disabled>
//                             <em>Select a Machine</em>
//                         </MenuItem>
//                         {machines.map((m) => (
//                             <MenuItem key={m.id} value={m.id}>
//                             {m.machineName}
//                             </MenuItem>
//                         ))}
//                         </TextField>
//                     </Grid>

//                     <Grid item xs={12}>
//                         <TextField
//                         label="Serial Number"
//                         placeholder="e.g. WB-SN-2024-X"
//                         fullWidth
//                         value={form.serialNo}
//                         onChange={(e) => setField("serialNo", e.target.value)}
//                         disabled={loading}
//                         error={!!errors.serialNo}
//                         helperText={errors.serialNo}
//                         InputProps={{
//                             startAdornment: <IconifyIcon icon="mdi:barcode" color="action.active" sx={{ mr: 1 }} />
//                         }}
//                         />
//                     </Grid>
//                 </Grid>
//             </Box>

//             <Divider />

//             {/* Section 2: Communication Settings */}
//             <Box>
//                 <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
//                     Communication Settings
//                 </Typography>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Port"
//                             select
//                             fullWidth
//                             value={form.port}
//                             onChange={(e) => setField("port", e.target.value)}
//                             disabled={loading}
//                         >
//                             <MenuItem value="COM1">COM1</MenuItem>
//                             <MenuItem value="COM2">COM2</MenuItem>
//                             <MenuItem value="COM3">COM3</MenuItem>
//                             <MenuItem value="COM4">COM4</MenuItem>
//                         </TextField>
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             label="Baud Rate"
//                             placeholder="e.g. 9600"
//                             fullWidth
//                             value={form.baudRate}
//                             onChange={(e) => setField("baudRate", e.target.value)}
//                             disabled={loading}
//                             error={!!errors.baudRate}
//                             helperText={errors.baudRate}
//                         />
//                     </Grid>

//                     <Grid item xs={6}>
//                         <TextField
//                             label="Data Bit"
//                             type="number"
//                             fullWidth
//                             value={form.dataBit}
//                             onChange={(e) => setField("dataBit", Number(e.target.value))}
//                             disabled={loading}
//                         />
//                     </Grid>

//                     <Grid item xs={6}>
//                         <TextField
//                             label="Stop Bit"
//                             type="number"
//                             fullWidth
//                             value={form.stopBit}
//                             onChange={(e) => setField("stopBit", Number(e.target.value))}
//                             disabled={loading}
//                         />
//                     </Grid>

//                     <Grid item xs={12}>
//                         <TextField
//                             label="Parity"
//                             select
//                             fullWidth
//                             value={form.party}
//                             onChange={(e) => setField("party", e.target.value)}
//                             disabled={loading}
//                             error={!!errors.party}
//                             helperText={errors.party}
//                         >
//                              <MenuItem value="None">None</MenuItem>
//                              <MenuItem value="Even">Even</MenuItem>
//                              <MenuItem value="Odd">Odd</MenuItem>
//                              <MenuItem value="Mark">Mark</MenuItem>
//                              <MenuItem value="Space">Space</MenuItem>
//                         </TextField>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </Stack>
//       </Box>

//       {/* Footer Actions */}
//       <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.grey[50] }}>
//         <Stack direction="row" spacing={2} justifyContent="flex-end">
//             <Button 
//                 variant="outlined" 
//                 color="inherit" 
//                 onClick={onClose}
//                 sx={{ px: 3 }}
//             >
//                 Cancel
//             </Button>
//             <Button 
//                 variant="contained" 
//                 onClick={handleSubmit} 
//                 disabled={loading}
//                 startIcon={<IconifyIcon icon="material-symbols:save-rounded" />}
//                 sx={{ px: 4 }}
//             >
//                 {initialData ? "Update" : "Save"}
//             </Button>
//         </Stack>
//       </Box>
//     </Drawer>
//   );
// };

// export default WeighbridgeDrawer;










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
  Paper,
  Avatar,
  Collapse,
  alpha,
  InputAdornment,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { Weighbridge, Machine } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";
import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface WeighbridgeDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Weighbridge) => void;
  initialData: Weighbridge | null;
  machines: Machine[];
  loading?: boolean;
}

const WeighbridgeDrawer: React.FC<WeighbridgeDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  machines,
  loading = false,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 650 : "100%";

  // State for form data and specific field errors
  const [form, setForm] = useState<Weighbridge>({
    id: 0,
    machineId: undefined,
    serialNo: "",
    port: "COM4",
    baudRate: "19200",
    dataBit: 8,
    stopBit: 1,
    party: "None",
    createdAt: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Weighbridge, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Reset or Populate form when Drawer opens
  useEffect(() => {
    if (open) {
      setErrors({});
      setGlobalError(null);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm({
          id: 0,
          machineId: undefined,
          serialNo: "",
          port: "COM4",
          baudRate: "19200",
          dataBit: 8,
          stopBit: 1,
          party: "None",
          createdAt: new Date().toISOString(),
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof Weighbridge, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Weighbridge, string>> = {};
    let isValid = true;

    if (!form.machineId) {
      newErrors.machineId = "Machine selection is required";
      isValid = false;
    }
    if (!form.serialNo?.trim()) {
      newErrors.serialNo = "Serial Number is required";
      isValid = false;
    }
    if (!form.baudRate) {
        newErrors.baudRate = "Baud Rate is required";
        isValid = false;
    }
    if (!form.party) {
        newErrors.party = "Parity is required";
        isValid = false;
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
          // color: "white",
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
            <IconifyIcon icon="mdi:scale-balance" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
                {initialData ? "Edit Weighbridge" : "New Weighbridge"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {initialData ? "Update device parameters" : "Configure new weighing hardware"}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ 
          color: "black", 
          // bgcolor: "rgba(255,255,255,0.1)", 
          '&:hover': { bgcolor: "rgba(255,255,255,0.2)" } 
      }}>
            <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      {/* --- Content Area --- */}
      <Box sx={{ p: 3, overflowY: 'auto', flex: 1, bgcolor: theme.palette.background.default }}>
        <Stack spacing={3}>
            
            {globalError && (
                <Collapse in={!!globalError}>
                    <Alert severity="error" onClose={() => setGlobalError(null)} sx={{ mb: 2 }}>
                        {globalError}
                    </Alert>
                </Collapse>
            )}

            {/* Section 1: Device Identity */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                    Device Identity
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                        label="Associated Machine"
                        className="input-bg-color label-black"
                        select
                        fullWidth
                        value={form.machineId || ""}
                        onChange={(e) => setField("machineId", Number(e.target.value))}
                        disabled={loading}
                        error={!!errors.machineId}
                        helperText={errors.machineId}
                        >
                        <MenuItem value={0} disabled sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Select a Machine
                        </MenuItem>
                        {machines.map((m) => (
                            <MenuItem key={m.id} value={m.id}>
                            {m.machineName}
                            </MenuItem>
                        ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                        label="Serial Number"
                        className="input-bg-color label-black"
                        placeholder="e.g. WB-SN-2024-X"
                        fullWidth
                        value={form.serialNo}
                        onChange={(e) => setField("serialNo", e.target.value)}
                        disabled={loading}
                        error={!!errors.serialNo}
                        helperText={errors.serialNo}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconifyIcon icon="mdi:barcode" color="action.active" />
                                </InputAdornment>
                            )
                        }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Section 2: Communication Settings */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                    Serial Communication
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Port"
                            className="input-bg-color label-black"
                            select
                            fullWidth
                            value={form.port}
                            onChange={(e) => setField("port", e.target.value)}
                            disabled={loading}
                        >
                            <MenuItem value="COM1">COM1</MenuItem>
                            <MenuItem value="COM2">COM2</MenuItem>
                            <MenuItem value="COM3">COM3</MenuItem>
                            <MenuItem value="COM4">COM4</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Baud Rate"
                            className="input-bg-color label-black"
                            placeholder="e.g. 9600"
                            fullWidth
                            value={form.baudRate}
                            onChange={(e) => setField("baudRate", e.target.value)}
                            disabled={loading}
                            error={!!errors.baudRate}
                            helperText={errors.baudRate}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">bps</InputAdornment>
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Data Bit"
                            className="input-bg-color label-black"
                            type="number"
                            fullWidth
                            value={form.dataBit}
                            onChange={(e) => setField("dataBit", Number(e.target.value))}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Stop Bit"
                            className="input-bg-color label-black"
                            type="number"
                            fullWidth
                            value={form.stopBit}
                            onChange={(e) => setField("stopBit", Number(e.target.value))}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Parity"
                            className="input-bg-color label-black"
                            select
                            fullWidth
                            value={form.party}
                            onChange={(e) => setField("party", e.target.value)}
                            disabled={loading}
                            error={!!errors.party}
                            helperText={errors.party}
                        >
                             <MenuItem value="None">None</MenuItem>
                             <MenuItem value="Even">Even</MenuItem>
                             <MenuItem value="Odd">Odd</MenuItem>
                             <MenuItem value="Mark">Mark</MenuItem>
                             <MenuItem value="Space">Space</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>
        </Stack>
      </Box>

      {/* Footer Actions */}
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
            {initialData ? "Save Configuration" : "Create Device"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default WeighbridgeDrawer;