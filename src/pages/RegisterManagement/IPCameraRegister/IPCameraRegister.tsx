
// import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
// import {
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
//   useMediaQuery,
//   useTheme,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   InputAdornment,
//   debounce,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   Chip,
//   // useStepContext,
// } from "@mui/material";

// import IconifyIcon from "components/base/IconifyIcon";
// import { GridApi, useGridApiRef } from '@mui/x-data-grid';

// // --- Types based on your SQLAlchemy Models ---

// type Machine = {
//   id: number;
//   machineName: string;
//   // Included minimal fields needed for the dropdown reference
// };

// type IPCamera = {
//   id: number; // Maps to Camera (PK)
//   machineId: number; // Maps to Machine_Id (FK)
//   cameraName: string;
//   ipAddress: string;
//   rtspUrl?: string;
//   httpUrl?: string;
//   username?: string;
//   password?: string;
//   macAddress?: string;
//   // model?: string;
//   firmwareVersion?: string;
//   status: "Online" | "Offline" | "Error";
//   location?: string;
//   installedDate?: string;
// };

// // --- Mock Data ---

// // const initialMachines: Machine[] = [
// //   { id: 1, machineName: "Machine A" },
// //   { id: 2, machineName: "Machine B" },
// //   { id: 3, machineName: "Machine C" },
// // ];

// // const initialCameras: IPCamera[] = [
// //   {
// //     id: 1,
// //     machineId: 1,
// //     cameraName: "Cam A-Front",
// //     ipAddress: "192.168.1.101",
// //     rtspUrl: "rtsp://192.168.1.101/live",
// //     status: "Online",
// //     location: "Entrance Gate",
// //     model: "Hikvision v4",
// //     installedDate: "2024-01-10",
// //   },
// //   {
// //     id: 2,
// //     machineId: 2,
// //     cameraName: "Cam B-Internal",
// //     ipAddress: "192.168.1.102",
// //     status: "Offline",
// //     location: "Internal Conveyor",
// //     model: "Dahua T3",
// //     installedDate: "2024-02-15",
// //   },
// //   {
// //     id: 3,
// //     machineId: 1,
// //     cameraName: "Cam A-Rear",
// //     ipAddress: "192.168.1.103",
// //     status: "Error",
// //     location: "Rear Exit",
// //     installedDate: "2024-03-01",
// //   },
// // ];

// const IPCameraRegister: React.FC = () => {
//   // -- Data State --
//   const [cameras,  setCameras] = useState<IPCamera[]>([]);
//   const [machines, setMachines] = useState<Machine[]>([]);
  
//   // -- UI State --
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingCamera, setEditingCamera] = useState<IPCamera | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);
//   const [search, setSearch] = useState('');

//   // -- Delete & Feedback State --
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [cameraToDelete, setCameraToDelete] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   // Filter State (Filter by Machine)
//   const [filterIPcameraId, setFilterIPcameraId] = useState<number | "">("");

//   // --- show password ---
//   const [showPassword, setShowPassword] = useState(false);

//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   const apiRef = useGridApiRef<GridApi>();
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//   // -- Form Initial State --
//   const [form, setForm] = useState<IPCamera>({
//     id: 0,
//     machineId: 0,
//     cameraName: "",
//     ipAddress: "",
//     rtspUrl: "",
//     httpUrl: "",
//     username: "",
//     password: "",
//     macAddress: "",
//     // model: "",
//     // firmwareVersion: "",
//     status: "Offline",
//     location: "",
//     installedDate: "",
//   });

//   useEffect(() => {
//     // Load mock data
//     // setCameras(initialCameras);
//     // setMachines(initialMachines);
//     setMachines([]);
//   }, []);

//   // -- Drawer Handlers --

//   const handleOpenAdd = () => {
//     setEditingCamera(null);
//     setForm({
//       id: 0,
//       machineId: 0,
//       cameraName: "",
//       ipAddress: "",
//       rtspUrl: "",
//       httpUrl: "",
//       username: "",
//       password: "",
//       macAddress: "",
//       // model: "",
//       firmwareVersion: "",
//       status: "Offline", // Default per model
//       location: "",
//       installedDate: "",
//     });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (cam: IPCamera) => {
//     setEditingCamera(cam);
//     setForm({ ...cam });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingCamera(null);
//     setFormError(null);
//   };

//   // -- Validation & Save --

//   const validate = (): boolean => {
//     if (!form.cameraName || !form.cameraName.trim()) {
//       setFormError("Camera name is required.");
//       return false;
//     }
//     if (!form.ipAddress || !form.ipAddress.trim()) {
//       setFormError("IP Address is required.");
//       return false;
//     }
//     if (!form.machineId || form.machineId <= 0) {
//       setFormError("Please associate a Machine.");
//       return false;
//     }
//     if (!form.password || form.password.trim()) {
//       setFormError("Password is required")
//     }
//     setFormError(null);
//     return true;
//   };

//   const handleSave = () => {
//     if (!validate()) return;

//     if (editingCamera) {
//       // Update existing
//       setCameras((prev) => prev.map((c) => (c.id === editingCamera.id ? { ...form, id: editingCamera.id } : c)));
//       setSnackbarMessage("Camera updated successfully");
//     } else {
//       // Add new
//       const newCamera: IPCamera = { ...form, id: Date.now() };
//       setCameras((prev) => [newCamera, ...prev]);
//       setSnackbarMessage("Camera added successfully");
//     }
//     setSnackbarOpen(true);
//     handleCloseDrawer();
//   };

//   // -- Delete Handlers --

//   const handleClickDelete = (id: number) => {
//     setCameraToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (cameraToDelete !== null) {
//       setCameras((prev) => prev.filter((c) => c.id !== cameraToDelete));
//       setSnackbarMessage("Camera deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setCameraToDelete(null);
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setCameraToDelete(null);
//   };

//     // --- SNACKBAR HANDLER ---
//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   // -- Helper Functions --

//   const setField = (key: keyof IPCamera, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleGridSearch = useMemo(() => {
//     return debounce((searchValue) => {
//       apiRef.current.setQuickFilterValues(
//         searchValue.split(' ').filter((word: any) => word !== ''),
//       );
//       // Logic for grid filtering if using DataGrid, 
//       // currently just setting state for potential manual filtering
//     }, 250);
//   }, []);
  
//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const searchValue = event.currentTarget.value;
//     setSearch(searchValue);
//     handleGridSearch(searchValue);
//   };

//   // Filter cameras based on search and selected filter (optional logic)
//   const filteredCameras = cameras.filter((c) => {
//     const matchesSearch =
//       c.cameraName.toLowerCase().includes(search.toLowerCase()) ||
//       c.ipAddress.includes(search)

//     const matchesMachine = filterIPcameraId === "" || c.machineId === filterIPcameraId;

//     return matchesSearch && matchesMachine;
// });

//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   // Status Chip Color Helper
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Online": return "success";
//       case "Offline": return "default";
//       case "Error": return "error";
//       default: return "default";
//     }
//   };

//   return (
//     <div className="vm-root">
//       <Stack
//         bgcolor="background.paper"
//         borderRadius={5}
//         width={1}
//         boxShadow={(theme) => theme.shadows[4]}
//       >
//         <main className="vm-content">
//           <Box className="vm-header"
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2
//           }}
//           >
//             <Typography variant="h4" sx={{ flexGrow: 1 }}>IP Camera Register</Typography>
            
//             <TextField
//               variant="outlined"
//               placeholder="Search Camera or IP..."
//               id="search-input"
//               name="table-search-input"
//               onChange={handleChange}
//               value={search}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
//                     <IconifyIcon icon="mdi:search" width={1} height={1} />
//                   </InputAdornment>
//                 ),
//               }}
//               fullWidth
//               sx={{ maxWidth: 300,
//                 p: 2,
//                 mr: 'auto',
//                }}
//             />

//             {/* Filter by Machine dropdown (Replaces Vendor dropdown) */}
//             <div className="selection-header-lable">
//               <TextField
//                 select
//                 fullWidth
//                 variant="outlined"
//                 name="table-search-input"
//                 value={form.machineId || ""}
//                 placeholder="Filter by Machine"
//                 onChange={(e) => {
//                    // This is just UI logic for the filter dropdown in header 
//                    // currently tied to form state for demo, but typically would be a separate filter state
//                    setField("machineId", Number(e.target.value)); 
//                 }}
//                 sx={{
//                   p: 1,
//                   mr: 'auto',
//                   display: { xs: 'flex', lg: 'flex' },
//                 }}
//               >
//                 <MenuItem value=""><em>None</em></MenuItem>
//                 {machines.map((m) => (
//                   <MenuItem key={m.id} value={m.id}>
//                     {m.machineName}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </div>
//             {/* ✅ Refresh Button */}
//             <IconButton
//                 // onClick={handleRefresh}
//                 // disabled={loading}
//                 sx={{
//                   // bgcolor: "#609b5bff",
//                   color: "#46943fff",
//                   // "&:hover": { bgcolor: "success.dark" },
//                   borderRadius: "50%",
//                   width: 40,
//                   height: 40
//                 }}
//             >
//                 <IconifyIcon icon="mdi:refresh" />
//             </IconButton>
//             <IconButton
//                 // onClick={handleRefresh}
//                 // disabled={loading}
//                 sx={{
//                   // bgcolor: "#e25b5bff",
//                   color: "#e02121ff",
//                   // "&:hover": { bgcolor: "red" },
//                   borderRadius: "50%",
//                   width: 40,
//                   height: 40
//                 }}
//             >
//                 <IconifyIcon icon="material-symbols:close" />
//             </IconButton>

//             <div className="vm-actions">
//               <Button
//                 variant="contained"
//                 onClick={handleOpenAdd}
//                 className="add-vendor-btn"
//               >
//                 Add Camera
//               </Button>
//             </div>
//           </Box>

//           {/* TABLE */}
//           <TableContainer className="vm-table-container">
//             <Table className="vm-table">
//               <TableHead className="vm-table-header">
//                 <TableRow className="vm-table-row">
//                   <TableCell className="header-name">Camera Name</TableCell>
//                   <TableCell className="header-name">Machine</TableCell>
//                   <TableCell className="header-name">IP Address</TableCell>
//                   <TableCell className="header-name">Mac Address</TableCell>
//                   <TableCell className="header-name">RTSP URL</TableCell>
//                   <TableCell className="header-name">HTTP URL</TableCell>
//                   <TableCell className="header-name">Userneme</TableCell>
//                   {/* <TableCell className="header-name">Model</TableCell> */}
//                   <TableCell className="header-name">Location</TableCell>
//                   <TableCell className="header-name">Installed Date</TableCell>
//                   <TableCell className="header-name">Status</TableCell>
//                   <TableCell className="header-name" align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {filteredCameras.map((cam) => (
//                   <TableRow key={cam.id}>
//                     <TableCell>
//                       <Typography variant="subtitle1" className="vm-row-title">
//                         {cam.cameraName}
//                       </Typography>
//                     </TableCell>

//                     <TableCell>
//                       {machines.find(m => m.id === cam.machineId)?.machineName || "—"}
//                     </TableCell>
                    
//                     <TableCell>{cam.ipAddress || "_"}</TableCell>
//                     <TableCell>{cam.macAddress || "_"}</TableCell>
//                     <TableCell>{cam.rtspUrl || "—"}</TableCell>
//                     <TableCell>{cam.httpUrl || "—"}</TableCell>
//                     <TableCell>{cam.username || "—"}</TableCell>
//                     {/* <TableCell>{cam.model || "—"}</TableCell> */}
//                     <TableCell>{cam.location || "—"}</TableCell>
//                     <TableCell>{cam.installedDate || "—"}</TableCell>

//                     <TableCell>
//                       <Chip 
//                         label={cam.status} 
//                         color={getStatusColor(cam.status) as any}
//                         size="small"
//                         variant="outlined"
//                       />
//                     </TableCell>

//                     <TableCell align="right" className="vm-action-cell">
//                       <Button
//                         onClick={() => handleOpenEdit(cam)}
//                         className="vm-btn vm-action-btn-edit"
//                       >
//                         <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                       </Button>

//                       <Button
//                         onClick={() => handleClickDelete(cam.id)}
//                         className="vm-btn vm-action-btn-delete"
//                       >
//                         <IconifyIcon icon="wpf:delete" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 {filteredCameras.length === 0 && (
//                     <TableRow>
//                         <TableCell colSpan={11} align="center">
//                             No IP Camera found.
//                         </TableCell>
//                     </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </main>

//         {/* --- RIGHT DRAWER (ADD/EDIT) --- */}
//         <Drawer
//           anchor="right"
//           open={drawerOpen}
//           onClose={handleCloseDrawer}
//           PaperProps={{
//             sx: {
//               width: drawerWidth,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               padding: "30px",
//               maxWidth: "100%",
//               borderTopLeftRadius: { xs: 0, md: 12 },
//               borderBottomLeftRadius: { xs: 0, md: 12 },
//               height: { xs: "100vh", md: "100vh" },
//             },
//           }}
//           ModalProps={{ keepMounted: true }}
//         >
//           <Box className="drawer-header">
//             <Typography variant="h6">{editingCamera ? "Edit Camera" : "Add New Camera"}</Typography>
//             <IconButton onClick={handleCloseDrawer} aria-label="close">
//               <IconifyIcon icon="material-symbols:close-rounded" />
//             </IconButton>
//           </Box>

//           <Box className="drawer-content">
//             {formError && <Box className="form-error">{formError}</Box>}

//             <Stack spacing={2}>
//               {/* Basic Info */}
//               <TextField
//                 label="Camera Name"
//                 className="input-bg-color"
//                 placeholder="Enter camera name"
//                 fullWidth
//                 value={form.cameraName}
//                 onChange={(e) => setField("cameraName", e.target.value)}
//               />

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Associated Machine"
//                   className="input-bg-color"
//                   select
//                   fullWidth
//                   value={form.machineId}
//                   onChange={(e) => setFilterIPcameraId(e.target.value === "" ? "" : Number(e.target.value))}
//                 >
//                   <MenuItem>
//                     <em>None</em>
//                   </MenuItem>
//                   {machines.map((m) => (
//                     <MenuItem key={m.id} value={m.id}>
//                       {m.machineName}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <TextField
//                   label="Status"
//                   className="input-bg-color"
//                   select
//                   fullWidth
//                   value={form.status}
//                   onChange={(e) => setField("status", e.target.value)}
//                 >
//                   <MenuItem value="Online">Online</MenuItem>
//                   <MenuItem value="Offline">Offline</MenuItem>
//                   <MenuItem value="Error">Error</MenuItem>
//                 </TextField>
//               </Stack>

//               {/* Network Info */}
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="IP Address"
//                   className="input-bg-color"
//                   placeholder="e.g., 192.168.1.100"
//                   fullWidth
//                   value={form.ipAddress}
//                   onChange={(e) => setField("ipAddress", e.target.value)}
//                 />
//                  <TextField
//                   label="MAC Address"
//                   className="input-bg-color"
//                   placeholder="e.g., AA:BB:CC:DD:EE:FF"
//                   fullWidth
//                   value={form.macAddress || ""}
//                   onChange={(e) => setField("macAddress", e.target.value)}
//                 />
//               </Stack>

//               {/* URLs */}
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <TextField
//                 label="RTSP URL"
//                 className="input-bg-color"
//                 placeholder="rtsp://..."
//                 fullWidth
//                 value={form.rtspUrl || ""}
//                 onChange={(e) => setField("rtspUrl", e.target.value)}
//               />
//               <TextField
//                 label="HTTP URL"
//                 className="input-bg-color"
//                 placeholder="http://..."
//                 fullWidth
//                 value={form.httpUrl || ""}
//                 onChange={(e) => setField("httpUrl", e.target.value)}
//               />
//               </Stack>

//               {/* Credentials */}
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Username"
//                   className="input-bg-color"
//                   placeholder="Enter camera username"
//                   fullWidth
//                   value={form.username || ""}
//                   onChange={(e) => setField("username", e.target.value)}
//                   helperText="Optional — username for the camera (if needed)"
//                 />

//                 <TextField
//                   label="Password"
//                   className="input-bg-color"
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Enter camera password"
//                   fullWidth
//                   value={form.password || ""}
//                   onChange={(e) => setField("password", e.target.value)}
//                   helperText="Optional — leave blank if the camera has no password"
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           edge="end"
//                           sx={{
//                             color: 'text.secondary',
//                           }}
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
//               </Stack>

//               {/* Hardware Details */}
//               {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
//                 {/* <TextField
//                   label="Model"
//                   className="input-bg-color"
//                   placeholder="Camera Model"
//                   fullWidth
//                   value={form.model || ""}
//                   onChange={(e) => setField("model", e.target.value)}
//                 /> */}
//                 {/* <TextField
//                   label="Firmware Version"
//                   placeholder="v1.0.0"
//                   fullWidth
//                   value={form.firmwareVersion || ""}
//                   onChange={(e) => setField("firmwareVersion", e.target.value)}
//                 /> */}
//               {/* </Stack> */}

//               {/* Location & Date */}
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Location"
//                   className="input-bg-color"
//                   placeholder="e.g., Main Entrance"
//                   fullWidth
//                   value={form.location || ""}
//                   onChange={(e) => setField("location", e.target.value)}
//                   helperText="Specify where the machine is located. Example: Main Entrance"
//                 />
//                 <TextField
//                   label="Installed Date"
//                   className="input-bg-color"
//                   type="date"
//                   fullWidth
//                   value={form.installedDate || ""}
//                   onChange={(e) => setField("installedDate", e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Stack>

//               {/* Buttons */}
//               <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
//                 <Button 
//                   variant="text" 
//                   className="cancel-button" 
//                   onClick={handleCloseDrawer}
//                 >
//                   Cancel
//                 </Button>

//                 <Button 
//                   variant="contained" 
//                   className="edit-button" 
//                   onClick={handleSave}
//                 >
//                   {editingCamera ? "Update Camera" : "Save Camera"}
//                 </Button>
//               </Stack>
//             </Stack>
//           </Box>
//         </Drawer>

//         {/* --- DELETE CONFIRMATION DIALOG --- */}
//         <Dialog
//           open={deleteDialogOpen}
//           onClose={handleCancelDelete}
//           maxWidth="xs"
//           fullWidth
//         >
//           <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
//             Confirm Delete
//           </DialogTitle>
//           <DialogContent>
//             <Typography textAlign="center" color="text.secondary">
//               Are you sure you want to delete this Camera?
//             </Typography>
//           </DialogContent>
//           <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
//             <Button 
//               variant="outlined" 
//               onClick={handleCancelDelete}
//               color="inherit"
//             >
//               Cancel
//             </Button>
//             <Button 
//               variant="contained" 
//               onClick={handleConfirmDelete}
//               color="error"
//               startIcon={<IconifyIcon icon="wpf:delete" />}
//             >
//               Delete
//             </Button>
//           </DialogActions> 
//         </Dialog>
    
//         {/* --- SUCCESS SNACKBAR --- */}
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={3000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         >
//           <Alert 
//             onClose={handleCloseSnackbar} 
//             severity="success" 
//             variant="filled"
//             sx={{ width: "100%" }}
//           >
//             {snackbarMessage}
//           </Alert>
//         </Snackbar>

//       </Stack>
//     </div>
//   );
// };

// export default IPCameraRegister;








// import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
// import {
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
//   useMediaQuery,
//   useTheme,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   InputAdornment,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   Chip,
//   Grid, // Layout component
// } from "@mui/material";

// // --- Date Handling Imports ---
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs, { Dayjs } from 'dayjs';

// import IconifyIcon from "components/base/IconifyIcon";

// // --- Types ---

// type Machine = {
//   id: number;
//   machineName: string;
// };

// type IPCamera = {
//   id: number;
//   machineId: number;
//   cameraName: string;
//   ipAddress: string;
//   rtspUrl?: string;
//   httpUrl?: string;
//   username?: string;
//   password?: string;
//   macAddress?: string;
//   status: "Online" | "Offline" | "Error";
//   location?: string;
//   installedDate?: string; // Format: YYYY-MM-DD
// };

// const IPCameraRegister: React.FC = () => {
//   // -- Data State --
//   const [cameras, setCameras] = useState<IPCamera[]>([]);
//   const [machines, setMachines] = useState<Machine[]>([]);
  
//   // -- UI State --
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingCamera, setEditingCamera] = useState<IPCamera | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);
  
//   // -- Filter State --
//   const [search, setSearch] = useState('');
//   const [filterMachineId, setFilterMachineId] = useState<number | "">("");
//   const [fromDate, setFromDate] = useState<Dayjs | null>(null);
//   const [toDate, setToDate] = useState<Dayjs | null>(null);

//   // -- Delete & Feedback State --
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [cameraToDelete, setCameraToDelete] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   // -- Password Visibility --
//   const [showPassword, setShowPassword] = useState(false);
//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//   // -- Form Initial State --
//   const [form, setForm] = useState<IPCamera>({
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
//     installedDate: dayjs().format("YYYY-MM-DD"),
//   });

//   useEffect(() => {
//     // Mock Data for demonstration
//     setMachines([
//         { id: 1, machineName: "Machine A" },
//         { id: 2, machineName: "Machine B" },
//         { id: 3, machineName: "Machine C" },
//     ]);
//     setCameras([
//         { id: 1, machineId: 1, cameraName: "Cam Front", ipAddress: "192.168.1.10", status: "Online", location: "Gate 1", installedDate: "2023-11-01" },
//         { id: 2, machineId: 2, cameraName: "Cam Back", ipAddress: "192.168.1.11", status: "Offline", location: "Conveyor", installedDate: "2023-12-15" },
//         { id: 3, machineId: 1, cameraName: "Cam Side", ipAddress: "192.168.1.12", status: "Error", location: "Warehouse", installedDate: "2024-01-10" },

//     ]);
//   }, []);

//   // --- Handlers ---

//   const handleOpenAdd = () => {
//     setEditingCamera(null);
//     setForm({
//       id: 0,
//       machineId: 0,
//       cameraName: "",
//       ipAddress: "",
//       rtspUrl: "",
//       httpUrl: "",
//       username: "",
//       password: "",
//       macAddress: "",
//       status: "Offline",
//       location: "",
//       installedDate: dayjs().format("YYYY-MM-DD"),
//     });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (cam: IPCamera) => {
//     setEditingCamera(cam);
//     setForm({ ...cam });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingCamera(null);
//     setFormError(null);
//   };

//   // -- Validation & Save --
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

//   const handleSave = () => {
//     if (!validate()) return;

//     if (editingCamera) {
//       setCameras((prev) => prev.map((c) => (c.id === editingCamera.id ? { ...form, id: editingCamera.id } : c)));
//       setSnackbarMessage("Camera updated successfully");
//     } else {
//       const newCamera: IPCamera = { ...form, id: Date.now() };
//       setCameras((prev) => [newCamera, ...prev]);
//       setSnackbarMessage("Camera added successfully");
//     }
//     setSnackbarOpen(true);
//     handleCloseDrawer();
//   };

//   // -- Delete Handlers --
//   const handleClickDelete = (id: number) => {
//     setCameraToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (cameraToDelete !== null) {
//       setCameras((prev) => prev.filter((c) => c.id !== cameraToDelete));
//       setSnackbarMessage("Camera deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setCameraToDelete(null);
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setCameraToDelete(null);
//   };

//   const handleCloseSnackbar = () => setSnackbarOpen(false);

//   // -- Helper Functions --
//   const setField = (key: keyof IPCamera, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.currentTarget.value);
//   };

//   const handleClearFilters = () => {
//     setSearch("");
//     setFilterMachineId("");
//     setFromDate(null);
//     setToDate(null);
//   };

//   // -- Filter Logic --
//   const filteredCameras = useMemo(() => {
//     return cameras.filter((c) => {
//       // 1. Text Search
//       const matchesSearch =
//         c.cameraName.toLowerCase().includes(search.toLowerCase()) ||
//         c.ipAddress.includes(search);

//       // 2. Machine Filter
//       const matchesMachine = filterMachineId === "" || c.machineId === filterMachineId;

//       // 3. Date Filter (Installed Date)
//       const itemDate = dayjs(c.installedDate); // Ensure installedDate is YYYY-MM-DD string
//       const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
//       const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

//       return matchesSearch && matchesMachine && matchesFromDate && matchesToDate;
//     });
//   }, [cameras, search, filterMachineId, fromDate, toDate]);

//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   // Status Chip Color Helper
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Online": return "success";
//       case "Offline": return "default";
//       case "Error": return "error";
//       default: return "default";
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div className="vm-root">
//         <Stack
//           bgcolor="background.paper"
//           borderRadius={5}
//           width={1}
//           boxShadow={(theme) => theme.shadows[4]}
//         >
//           <main className="vm-content">
            
//             {/* --- PROFESSIONAL HEADER SECTION --- */}
//             <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
//                 {/* Top Row: Title & Add Button */}
//                 <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//                     <Typography variant="h4" fontWeight="bold" color="text.primary">
//                         IP Camera Register
//                     </Typography>
//                     <Button
//                         variant="contained"
//                         onClick={handleOpenAdd}
//                         startIcon={<IconifyIcon icon="mdi:video-plus" />}
//                         sx={{ px: 3, py: 1, borderRadius: 2 }}
//                     >
//                         Add Camera
//                     </Button>
//                 </Stack>

//                 {/* Filter Grid */}
//                 <Grid container spacing={2} alignItems="center">
//                     {/* Search */}
//                     <Grid item xs={12} sm={6} md={3}>
//                         <TextField
//                             variant="outlined"
//                             placeholder="Search Camera or IP..."
//                             size="small"
//                             fullWidth
//                             value={search}
//                             onChange={handleChangeSearch}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <IconifyIcon icon="mdi:search" color="action.active" />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                     </Grid>

//                     {/* From Date */}
//                     <Grid item xs={6} sm={3} md={2}>
//                         <DatePicker
//                             label="From Date"
//                             value={fromDate}
//                             onChange={(newValue) => setFromDate(newValue)}
//                             slotProps={{ textField: { size: 'small', fullWidth: true } }}
//                         />
//                     </Grid>

//                     {/* To Date */}
//                     <Grid item xs={6} sm={3} md={2}>
//                         <DatePicker
//                             label="To Date"
//                             value={toDate}
//                             onChange={(newValue) => setToDate(newValue)}
//                             slotProps={{ textField: { size: 'small', fullWidth: true } }}
//                         />
//                     </Grid>

//                     {/* Machine Dropdown */}
//                     <Grid item xs={12} sm={6} md={2}>
//                         <TextField
//                             select
//                             label="Filter Machine"
//                             variant="outlined"
//                             size="small"
//                             fullWidth
//                             value={filterMachineId}
//                             onChange={(e) => setFilterMachineId(e.target.value === "" ? "" : Number(e.target.value))}
//                         >
//                             <MenuItem value="">
//                                 <em>All Machines</em>
//                             </MenuItem>
//                             {machines.map((m) => (
//                                 <MenuItem key={m.id} value={m.id}>
//                                     {m.machineName}
//                                 </MenuItem>
//                             ))}
//                         </TextField>
//                     </Grid>

//                     {/* Action Buttons */}
//                     <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
//                         <Button 
//                             variant="outlined" 
//                             color="secondary" 
//                             size="medium"
//                             onClick={handleClearFilters}
//                             startIcon={<IconifyIcon icon="mdi:filter-off" />}
//                         >
//                             Clear
//                         </Button>
//                         <IconButton
//                             sx={{
//                                 bgcolor: theme.palette.action.hover,
//                                 color: "primary.main",
//                                 "&:hover": { bgcolor: theme.palette.action.selected },
//                             }}
//                         >
//                             <IconifyIcon icon="mdi:refresh" />
//                         </IconButton>
//                     </Grid>
//                 </Grid>
//             </Box>

//             {/* --- TABLE SECTION --- */}
//             <TableContainer className="vm-table-container">
//               <Table className="vm-table">
//                 <TableHead className="vm-table-header">
//                   <TableRow className="vm-table-row">
//                     <TableCell className="header-name">Camera Name</TableCell>
//                     <TableCell className="header-name">Machine</TableCell>
//                     <TableCell className="header-name">IP Address</TableCell>
//                     {/* <TableCell className="header-name">Mac Address</TableCell> */}
//                     <TableCell className="header-name">RTSP URL</TableCell>
//                     <TableCell className="header-name">Username</TableCell>
//                     <TableCell className="header-name">Location</TableCell>
//                     <TableCell className="header-name">Installed Date</TableCell>
//                     <TableCell className="header-name">Status</TableCell>
//                     <TableCell className="header-name" align="right">Actions</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {filteredCameras.map((cam) => (
//                     <TableRow key={cam.id} hover>
//                       <TableCell>
//                         <Typography variant="subtitle2" fontWeight="600">
//                           {cam.cameraName}
//                         </Typography>
//                       </TableCell>

//                       <TableCell>
//                         {machines.find(m => m.id === cam.machineId)?.machineName || "—"}
//                       </TableCell>
                      
//                       <TableCell>{cam.ipAddress || "—"}</TableCell>
//                       {/* <TableCell>{cam.macAddress || "—"}</TableCell> */}
//                       <TableCell sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                          {cam.rtspUrl || "—"}
//                       </TableCell>
//                       <TableCell>{cam.username || "—"}</TableCell>
//                       <TableCell>{cam.location || "—"}</TableCell>
                      
//                       {/* Formatted Date */}
//                       <TableCell>
//                         {cam.installedDate ? dayjs(cam.installedDate).format('DD MMM YYYY') : "—"}
//                       </TableCell>

//                       <TableCell>
//                         <Chip 
//                           label={cam.status} 
//                           color={getStatusColor(cam.status) as any}
//                           size="small"
//                           sx={{ fontWeight: 'bold' }}
//                         />
//                       </TableCell>

//                       <TableCell align="right">
//                         <Stack direction="row" spacing={1} justifyContent="flex-end">
//                           <IconButton
//                             onClick={() => handleOpenEdit(cam)}
//                             color="primary"
//                             size="small"
//                           >
//                             <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                           </IconButton>

//                           <IconButton
//                             onClick={() => handleClickDelete(cam.id)}
//                             color="error"
//                             size="small"
//                           >
//                             <IconifyIcon icon="wpf:delete" />
//                           </IconButton>
//                         </Stack>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {filteredCameras.length === 0 && (
//                       <TableRow>
//                           <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                             <Typography variant="body1" color="text.secondary">
//                                 No IP Camera found.
//                             </Typography>
//                           </TableCell>
//                       </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </main>

//           {/* --- RIGHT DRAWER (ADD/EDIT) --- */}
//           <Drawer
//             anchor="right"
//             open={drawerOpen}
//             onClose={handleCloseDrawer}
//             PaperProps={{
//               sx: {
//                 width: drawerWidth,
//                 p: 3,
//                 borderTopLeftRadius: { xs: 0, md: 12 },
//                 borderBottomLeftRadius: { xs: 0, md: 12 },
//               },
//             }}
//           >
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//               <Typography variant="h6" fontWeight="bold">
//                 {editingCamera ? "Edit Camera" : "Add New Camera"}
//               </Typography>
//               <IconButton onClick={handleCloseDrawer}>
//                 <IconifyIcon icon="material-symbols:close-rounded" />
//               </IconButton>
//             </Box>

//             <Stack spacing={2.5}>
//               {formError && <Alert severity="error">{formError}</Alert>}

//               {/* Basic Info */}
//               <TextField
//                 label="Camera Name"
//                 placeholder="Enter camera name"
//                 fullWidth
//                 value={form.cameraName}
//                 onChange={(e) => setField("cameraName", e.target.value)}
//               />

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Associated Machine"
//                   select
//                   fullWidth
//                   value={form.machineId || ""}
//                   onChange={(e) => setField("machineId", Number(e.target.value))}
//                 >
//                   <MenuItem value={0}><em>None</em></MenuItem>
//                   {machines.map((m) => (
//                     <MenuItem key={m.id} value={m.id}>
//                       {m.machineName}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <TextField
//                   label="Status"
//                   select
//                   fullWidth
//                   value={form.status}
//                   onChange={(e) => setField("status", e.target.value)}
//                 >
//                   <MenuItem value="Online">Online</MenuItem>
//                   <MenuItem value="Offline">Offline</MenuItem>
//                   <MenuItem value="Error">Error</MenuItem>
//                 </TextField>
//               </Stack>

//               {/* Network Info */}
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="IP Address"
//                   placeholder="e.g., 192.168.1.100"
//                   fullWidth
//                   value={form.ipAddress}
//                   onChange={(e) => setField("ipAddress", e.target.value)}
//                 />
//                  <TextField
//                   label="MAC Address"
//                   placeholder="e.g., AA:BB:CC:DD:EE:FF"
//                   fullWidth
//                   value={form.macAddress || ""}
//                   onChange={(e) => setField("macAddress", e.target.value)}
//                 />
//               </Stack>

//               {/* URLs */}
//               <TextField
//                 label="RTSP URL"
//                 placeholder="rtsp://..."
//                 fullWidth
//                 value={form.rtspUrl || ""}
//                 onChange={(e) => setField("rtspUrl", e.target.value)}
//               />
//               <TextField
//                 label="HTTP URL"
//                 placeholder="http://..."
//                 fullWidth
//                 value={form.httpUrl || ""}
//                 onChange={(e) => setField("httpUrl", e.target.value)}
//               />

//               {/* Credentials */}
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Username"
//                   placeholder="Camera username"
//                   fullWidth
//                   value={form.username || ""}
//                   onChange={(e) => setField("username", e.target.value)}
//                 />

//                 <TextField
//                   label="Password"
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Camera password"
//                   fullWidth
//                   value={form.password || ""}
//                   onChange={(e) => setField("password", e.target.value)}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={handleClickShowPassword}
//                           edge="end"
//                         >
//                           <IconifyIcon icon={showPassword ? "ic:baseline-key-off" : "ic:baseline-key"} />
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Stack>

//               {/* Location & Date */}
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                   label="Location"
//                   placeholder="e.g., Main Entrance"
//                   fullWidth
//                   value={form.location || ""}
//                   onChange={(e) => setField("location", e.target.value)}
//                 />
//                 <TextField
//                   label="Installed Date"
//                   type="date"
//                   fullWidth
//                   value={form.installedDate || ""}
//                   onChange={(e) => setField("installedDate", e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Stack>

//               {/* Buttons */}
//               <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//                 <Button 
//                   onClick={handleCloseDrawer}
//                   color="inherit"
//                 >
//                   Cancel
//                 </Button>

//                 <Button 
//                   variant="contained" 
//                   onClick={handleSave}
//                 >
//                   {editingCamera ? "Update" : "Save"}
//                 </Button>
//               </Stack>
//             </Stack>
//           </Drawer>

//           {/* --- DELETE DIALOG --- */}
//           <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <DialogContent>
//               <Typography>Are you sure you want to delete this Camera?</Typography>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCancelDelete} variant="outlined" color="inherit">Cancel</Button>
//               <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
//             </DialogActions> 
//           </Dialog>
      
//           {/* --- SNACKBAR --- */}
//           <Snackbar
//             open={snackbarOpen}
//             autoHideDuration={3000}
//             onClose={handleCloseSnackbar}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           >
//             <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
//               {snackbarMessage}
//             </Alert>
//           </Snackbar>

//         </Stack>
//       </div>
//     </LocalizationProvider>
//   );
// };

// export default IPCameraRegister;









// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Button,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { useSnackbar } from 'notistack';

// // Sub Components
// import IPCameraMain from "pages/components/IPCameraManage/IPCameraMain";
// import IPCameraDrawer from "pages/components/IPCameraManage/IPCameraDrawer";



// // --- Global Types ---
// export type Machine = {
//   id: number;
//   machineName: string;
// };

// export type IPCamera = {
//   id: number;
//   machineId: number;
//   cameraName: string;
//   ipAddress: string;
//   rtspUrl?: string;
//   httpUrl?: string;
//   username?: string;
//   password?: string;
//   macAddress?: string;
//   status: "Online" | "Offline" | "Error";
//   location?: string;
//   installedDate?: string; // Format: YYYY-MM-DD
// };

// const IPCameraRegister: React.FC = () => {
//   // Data State
//   const [cameras, setCameras] = useState<IPCamera[]>([]);
//   const [machines, setMachines] = useState<Machine[]>([]);
  
//   // UI Control State
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingCamera, setEditingCamera] = useState<IPCamera | null>(null);

//   // Feedback State
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [cameraToDelete, setCameraToDelete] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   const { enqueueSnackbar } = useSnackbar();

//   // Load Mock Data
//   useEffect(() => {
//     setMachines([
//         { id: 1, machineName: "Machine A" },
//         { id: 2, machineName: "Machine B" },
//         { id: 3, machineName: "Machine C" },
//     ]);
//     setCameras([
//         { id: 1, machineId: 1, cameraName: "Cam Front", ipAddress: "192.168.1.10", status: "Online", location: "Gate 1", installedDate: "2023-11-01" },
//         { id: 2, machineId: 2, cameraName: "Cam Back", ipAddress: "192.168.1.11", status: "Offline", location: "Conveyor", installedDate: "2023-12-15" },
//         { id: 3, machineId: 1, cameraName: "Cam Side", ipAddress: "192.168.1.12", status: "Error", location: "Warehouse", installedDate: "2024-01-10" },
        
//     ]);
//   }, []);

//   // --- Handlers ---
//   const handleOpenAdd = () => {
//     setEditingCamera(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (cam: IPCamera) => {
//     setEditingCamera(cam);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingCamera(null);
//   };

//   const handleSave = (formData: IPCamera) => {
//     // Simulate API call
//     if (editingCamera) {
//       setCameras((prev) => prev.map((c) => (c.id === editingCamera.id ? { ...formData, id: editingCamera.id } : c)));
//       enqueueSnackbar("Camera updated successfully", { variant: "success" });
//     } else {
//       const newCamera: IPCamera = { ...formData, id: Date.now() };
//       setCameras((prev) => [newCamera, ...prev]);
//       enqueueSnackbar("Camera added successfully", { variant: "success" });
//     }
//     handleCloseDrawer();
//   };

//   // --- Delete Logic ---
//   const initiateDelete = (id: number) => {
//     setCameraToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (cameraToDelete !== null) {
//       setCameras((prev) => prev.filter((c) => c.id !== cameraToDelete));
//       setSnackbarMessage("Camera deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setCameraToDelete(null);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div className="vm-root">
        
//         {/* 1. Main View (Table, Filters, CSV) */}
//         <IPCameraMain
//           cameras={cameras}
//           machines={machines}
//           onAdd={handleOpenAdd}
//           onEdit={handleOpenEdit}
//           onDelete={initiateDelete}
//         />

//         {/* 2. Drawer View (Form) */}
//         <IPCameraDrawer
//           open={drawerOpen}
//           onClose={handleCloseDrawer}
//           onSave={handleSave}
//           initialData={editingCamera}
//           machines={machines}
//         />

//         {/* 3. Global Dialogs */}
//         <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
//           <DialogTitle>Confirm Delete</DialogTitle>
//           <DialogContent>
//             <Typography>Are you sure you want to delete this Camera?</Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
//             <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
//           </DialogActions>
//         </Dialog>

//         {/* Legacy Snackbar (Optional if using notistack) */}
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={3000}
//           onClose={() => setSnackbarOpen(false)}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         >
//           <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
//             {snackbarMessage}
//           </Alert>
//         </Snackbar>

//       </div>
//     </LocalizationProvider>
//   );
// };

// export default IPCameraRegister;










import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { useSnackbar } from 'notistack';

// Sub Components
import IPCameraMain from "pages/components/IPCameraManage/IPCameraMain";
import IPCameraDrawer from "pages/components/IPCameraManage/IPCameraDrawer";

// Custom CSS (Your existing CSS)
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import IconifyIcon from "components/base/IconifyIcon";
import ipCameraApi from "services/ipCameraApi";

// --- Global Types ---
export type Machine = {
  id: number;
  machineName: string;
};

export type IPCamera = {
  id: number;
  machineId: number;
  cameraName: string;
  ipAddress: string;
  rtspUrl: string;
  httpUrl?: string;
  username: string;
  password: string;
  macAddress: string;
  status: "Online" | "Offline" | "Error";
  location?: string;
  installedDate?: string; // Format: YYYY-MM-DD
};

const IPCameraRegister: React.FC = () => {
  // Data State
  const [cameras, setCameras] = useState<IPCamera[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  
  // UI Control State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<IPCamera | null>(null);
  const [loading, setLoading] = useState(false);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  // const { enqueueSnackbar } = useSnackbar();

  // API / effect------------
  const fetchCamera = async () => {
    setLoading(true);
    try{
      const response = await ipCameraApi.getIPcameraDetails();
      if (response.success) {
        setCameras(response.data)
      } else {
        setSnackbarMessage(response.message || "Failed to register IPcamera");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Somthing error occured try again later";
      setSnackbarMessage(errorMessage)
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };



  // Load Mock Data
  useEffect(() => {
    setLoading(true);
    fetchCamera();
    setMachines([
        { id: 1, machineName: "Machine A" },
        { id: 2, machineName: "Machine B" },
        { id: 3, machineName: "Machine C" },
    ]);
    setCameras([
        { id: 1, machineId: 1, 
          cameraName: "Cam Front", ipAddress: "192.168.1.10", macAddress: "FBW FWU FDU",
          status: "Online", location: "Gate 1", 
          installedDate: "2023-11-01", rtspUrl: "https://cursor.com/", username: "Ram", password: "ram@24" },
        { id: 2, machineId: 2, 
          cameraName: "Cam Back", ipAddress: "192.168.1.11", macAddress: "NDG DVA RSG",
          status: "Offline", location: "Conveyor", 
          installedDate: "2023-12-15", rtspUrl:"https://alpha.com/", username: "kumar", password: "kumar@24"  },
        // { id: 3, machineId: 1, 
        //   cameraName: "Cam Side", ipAddress: "192.168.1.12", 
        //   status: "Error", location: "Warehouse", 
        //   installedDate: "2024-01-10" },
        // { id: 4, machineId: 3, 
        //   cameraName: "Cam Top", ipAddress: "192.168.1.13", 
        //   status: "Online", location: "Assembly", 
        //   installedDate: "2024-02-05" },
        // { id: 5, machineId: 2, 
        //   cameraName: "Cam Entry", ipAddress: "192.168.1.14", 
        //   status: "Online", location: "Entrance", 
        //   installedDate: "2024-03-20" },
    ]);
    setLoading(false);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingCamera(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (cam: IPCamera) => {
    setEditingCamera(cam);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingCamera(null);
  };

  const handleSave = (formData: IPCamera) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editingCamera) {
        setCameras((prev) => prev.map((c) => (c.id === editingCamera.id ? { ...formData, id: editingCamera.id } : c)));
        setSnackbarMessage("Camera updated successfully");
      } else {
        const newCamera: IPCamera = { ...formData, id: Date.now() };
        setCameras((prev) => [newCamera, ...prev]);
        setSnackbarMessage("Camera added successfully");
      }
      setLoading(false);
      setSnackbarOpen(true);
      handleCloseDrawer();
      }, 400);
  };

  // --- Delete Logic ---
  const initiateDelete = (id: number) => {
    setCameraToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cameraToDelete !== null) {
      setCameras((prev) => prev.filter((c) => c.id !== cameraToDelete));
      setSnackbarMessage("Camera deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setCameraToDelete(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View (DataGrid & Filters) */}
        <IPCameraMain
          cameras={cameras}
          machines={machines}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          loading={loading}
          onRefresh={fetchCamera}
        />


        {/* 2. Drawer View (Form) */}
        <IPCameraDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingCamera}
          machines={machines}
          loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this Camera?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-end", pb: 2, gap: 1 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained"
            startIcon={<IconifyIcon icon="wpf:delete"/>}
            >Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Legacy Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </div>
    </LocalizationProvider>
  );
};

export default IPCameraRegister;