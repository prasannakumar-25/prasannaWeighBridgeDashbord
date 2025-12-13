
// import React, { useEffect, useState, useMemo } from "react";
// import { ChangeEvent } from "react";
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
//   Grid, // ⭐ UPDATED: Imported Grid for alignment
//   Tooltip
// } from "@mui/material";

// // ⭐ NEW: Imports for Date Handling
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs, { Dayjs } from 'dayjs';

// import IconifyIcon from "components/base/IconifyIcon";
// // import { GridApi, useGridApiRef } from '@mui/x-data-grid'; // (Optional if not using DataGrid component directly)

// // --- Types ---

// type Machine = {
//   id: number;
//   machineName: string;
// };

// type Weighbridge = {
//   id: number;
//   machineId?: number;
//   serialNo: string;
//   port: "COM3" | "COM4";
//   baudRate: string;
//   dataBit: number;
//   stopBit: number;
//   party: string;
//   createdAt: string; // ⭐ UPDATED: Ensure this exists for date filtering
// };

// const WeighbridgeRegister: React.FC = () => {
//   // State for data
//   const [weighbridges, setWeighbridges] = useState<Weighbridge[]>([]);
//   const [machines, setMachines] = useState<Machine[]>([]);

//   // UI State
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<Weighbridge | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);
//   const [search, setSearch] = useState('');

//   // Filter State
//   const [filterMachineId, setFilterMachineId] = useState<number | "">("");
  
//   // ⭐ NEW: Date Filter State
//   const [fromDate, setFromDate] = useState<Dayjs | null>(null);
//   const [toDate, setToDate] = useState<Dayjs | null>(null);

//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//   // -- Dialog & Snackbar State --
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   // Form State
//   const [form, setForm] = useState<Weighbridge>({
//     id: 0,
//     machineId: undefined,
//     serialNo: "",
//     port: "COM4",
//     baudRate: "19200",
//     dataBit: 8,
//     stopBit: 1,
//     party: "None",
//     createdAt: new Date().toISOString(), // Default for new items
//   });

//   useEffect(() => {
//     // ⭐ MOCK DATA WITH DATES for testing
//     setMachines([
//         { id: 1, machineName: "Machine A" },
//         { id: 2, machineName: "Machine B" }
//     ]);
//     setWeighbridges([
//         { id: 1, machineId: 1, serialNo: "SN-100", port: "COM4", baudRate: "9600", dataBit: 8, stopBit: 1, party: "None", createdAt: "2023-10-01" },
//         { id: 2, machineId: 2, serialNo: "SN-200", port: "COM3", baudRate: "19200", dataBit: 8, stopBit: 1, party: "Even", createdAt: "2023-12-15" },
//         { id: 3, machineId: 1, serialNo: "SN-300", port: "COM4", baudRate: "9600", dataBit: 8, stopBit: 1, party: "None", createdAt: "2024-01-20" },
//     ]);
//   }, []);

//   // --- Handlers ---

//   const handleOpenAdd = () => {
//     setEditingItem(null);
//     setForm({
//       id: 0,
//       machineId: undefined,
//       serialNo: "",
//       port: "COM4",
//       baudRate: "19200",
//       dataBit: 8,
//       stopBit: 1,
//       party: "None",
//       createdAt: new Date().toISOString(),
//     });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (wb: Weighbridge) => {
//     setEditingItem(wb);
//     setForm({ ...wb });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingItem(null);
//     setFormError(null);
//   };

//   const validate = (): boolean => {
//     if (!form.serialNo || !form.serialNo.trim()) {
//       setFormError("Serial Number is required.");
//       return false;
//     }
//     if (!form.party || !form.party.trim()) {
//         setFormError("Party (Parity) is required.");
//         return false;
//     }
//     setFormError(null);
//     return true;
//   };

//   const handleSave = () => {
//     if (!validate()) return;
//     if (editingItem) {
//       setWeighbridges((prev) => 
//         prev.map((item) => (item.id === editingItem.id ? { ...form, id: editingItem.id } : item))
//       );
//       setSnackbarMessage("Weighbridge updated successfully");
//     } else {
//       const newItem: Weighbridge = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
//       setWeighbridges((prev) => [newItem, ...prev]);
//       setSnackbarMessage("Weighbridge added successfully");
//     }
//     setSnackbarOpen(true);
//     handleCloseDrawer();
//   };

//   // --- Delete Handlers ---
//   const handleClickDelete = (id: number) => {
//     setItemToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (itemToDelete !== null) {
//       setWeighbridges((prev) => prev.filter((item) => item.id !== itemToDelete));
//       setSnackbarMessage("Weighbridge deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const handleCloseSnackbar = () => setSnackbarOpen(false);

//   const setField = (key: keyof Weighbridge, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.currentTarget.value);
//   };

//   // ⭐ UPDATED: Clear Filters Logic
//   const handleClearFilters = () => {
//     setSearch("");
//     setFilterMachineId("");
//     setFromDate(null);
//     setToDate(null);
//   };

  

//   // ⭐ UPDATED: Filter Logic to include Dates
//   const filteredWeighbridges = useMemo(() => {
//     return weighbridges.filter((wb) => {
//         // 1. Text Search
//         const matchesSearch = 
//             wb.serialNo.toLowerCase().includes(search.toLowerCase()) || 
//             wb.party.toLowerCase().includes(search.toLowerCase());
        
//         // 2. Machine Filter
//         const matchesMachine = filterMachineId === "" || wb.machineId === filterMachineId;

//         // 3. Date Filter (From)
//         const itemDate = dayjs(wb.createdAt);
//         const matchesFromDate = fromDate ? itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day') : true;
        
//         // 4. Date Filter (To)
//         const matchesToDate = toDate ? itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day') : true;

//         return matchesSearch && matchesMachine && matchesFromDate && matchesToDate;
//     });
//   }, [weighbridges, search, filterMachineId, fromDate, toDate]);

//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   return (
//     // ⭐ NEW: Wrap in LocalizationProvider for DatePickers
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div className="vm-root">
//         <Stack
//           bgcolor="background.paper"
//           borderRadius={5}
//           width={1}
//           boxShadow={(theme) => theme.shadows[4]}
//         >
//           <main className="vm-content">
            
//             {/* ⭐ UPDATED: Professional Header Box Layout using Grid */}
//             <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
//                 {/* Top Row: Title & Main Action */}
//                 <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//                     <Typography variant="h4" fontWeight="bold" color="text.primary">
//                         Weighbridge Register
//                     </Typography>
//                     <Button
//                         variant="contained"
//                         onClick={handleOpenAdd}
//                         startIcon={<IconifyIcon icon="mdi:plus" />}
//                         sx={{ px: 3, py: 1, borderRadius: 2 }}
//                     >
//                         Add New
//                     </Button>
//                 </Stack>

//                 {/* Filter Row: Grid System for alignment */}
//                 <Grid container spacing={2} alignItems="center">
                    
//                     {/* Search Field */}
//                     <Grid item xs={12} sm={6} md={3}>
//                         <TextField
//                             variant="outlined"
//                             placeholder="Search Serial No..."
//                             size="small"
//                             fullWidth
//                             value={search}
//                             onChange={handleChange}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <IconifyIcon icon="mdi:search" color="action.active" />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                     </Grid>

//                     {/* ⭐ NEW: From Date Picker */}
//                     <Grid item xs={6} sm={3} md={2}>
//                         <DatePicker
//                             label="From Date"
//                             value={fromDate}
//                             onChange={(newValue) => setFromDate(newValue)}
//                             slotProps={{ textField: { size: 'small', fullWidth: true } }}
//                         />
//                     </Grid>

//                     {/* ⭐ NEW: To Date Picker */}
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

//                     {/* Action Buttons (Refresh / Clear) */}
//                     {/* Actions (Clear, Download, Refresh) */}
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
                        
//                         {/* ⭐ Download Button */}
//                         <Tooltip title="Download CSV">
//                             <IconButton 
//                                 onClick={handleDownloadCSV}
//                                 sx={{ 
//                                     // bgcolor: theme.palette.primary.light + '20', 
//                                     color: 'primary.main',
//                                     '&:hover': { bgcolor: theme.palette.primary.light + '40' }
//                                 }}
//                             >
//                                 <IconifyIcon icon="mdi:download" />
//                             </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Refresh">
//                             <IconButton
//                                 onClick={() => console.log("Refresh logic")}
//                                 sx={{
//                                     bgcolor: theme.palette.action.hover,
//                                     color: 'primary.main',
//                                     "&:hover": { bgcolor: theme.palette.action.selected },
//                                 }}
//                             >
//                                 <IconifyIcon icon="mdi:refresh" />
//                             </IconButton>
//                         </Tooltip>
//                     </Grid>
//                 </Grid>
//             </Box>

//             {/* TABLE SECTION */}
//             <TableContainer className="vm-table-container">
//               <Table className="vm-table">
//                 <TableHead className="vm-table-header">
//                   <TableRow className="vm-table-row">
//                     <TableCell className="header-name">Serial No</TableCell>
//                     <TableCell className="header-name">Machine</TableCell>
//                     <TableCell className="header-name">Created Date</TableCell> {/* Added Date Column */}
//                     <TableCell className="header-name">Port</TableCell>
//                     <TableCell className="header-name">Baud Rate</TableCell>
//                     <TableCell className="header-name">Data/Stop</TableCell>
//                     <TableCell className="header-name">Party</TableCell>
//                     <TableCell className="header-name" align="right">Actions</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {filteredWeighbridges.map((wb) => (
//                     <TableRow key={wb.id} hover>
//                       <TableCell>
//                         <Typography variant="subtitle2" fontWeight={600}>
//                           {wb.serialNo}
//                         </Typography>
//                       </TableCell>

//                       <TableCell>
//                           {machines.find(m => m.id === wb.machineId)?.machineName || "—"}
//                       </TableCell>

//                        {/* Display Formatted Date */}
//                        <TableCell>
//                           {wb.createdAt ? dayjs(wb.createdAt).format('DD MMM YYYY') : "—"}
//                       </TableCell>
                      
//                       <TableCell>{wb.port}</TableCell>
//                       <TableCell>{wb.baudRate}</TableCell>
//                       <TableCell>{`${wb.dataBit} / ${wb.stopBit}`}</TableCell>
//                       <TableCell>{wb.party}</TableCell>

//                       <TableCell align="right">
//                         <Stack direction="row" spacing={1} justifyContent="flex-end">
//                             <IconButton 
//                                 onClick={() => handleOpenEdit(wb)} 
//                                 color="primary" 
//                                 size="small"
//                             >
//                                 <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                             </IconButton>

//                             <IconButton 
//                                 onClick={() => handleClickDelete(wb.id)} 
//                                 color="error" 
//                                 size="small"
//                             >
//                                 <IconifyIcon icon="wpf:delete" />
//                             </IconButton>
//                         </Stack>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {filteredWeighbridges.length === 0 && (
//                       <TableRow>
//                           <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
//                               <Typography variant="body1" color="text.secondary">
//                                   No records found matching your filters.
//                               </Typography>
//                           </TableCell>
//                       </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </main>

//           {/* Right drawer (Add/Edit) */}
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
//                 {editingItem ? "Edit Weighbridge" : "Add New Weighbridge"}
//               </Typography>
//               <IconButton onClick={handleCloseDrawer}>
//                 <IconifyIcon icon="material-symbols:close-rounded" />
//               </IconButton>
//             </Box>

//             <Stack spacing={2.5}>
//               {formError && <Alert severity="error">{formError}</Alert>}

//               <TextField
//                 label="Associated Machine"
//                 select
//                 fullWidth
//                 value={form.machineId || ""}
//                 onChange={(e) => setField("machineId", Number(e.target.value))}
//               >
//                 <MenuItem value=""><em>None</em></MenuItem>
//                 {machines.map((m) => (
//                   <MenuItem key={m.id} value={m.id}>{m.machineName}</MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 label="Serial No"
//                 fullWidth
//                 value={form.serialNo}
//                 onChange={(e) => setField("serialNo", e.target.value)}
//               />

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                  <TextField
//                     label="Port"
//                     select
//                     fullWidth
//                     value={form.port}
//                     onChange={(e) => setField("port", e.target.value)}
//                 >
//                     <MenuItem value="COM3">COM3</MenuItem>
//                     <MenuItem value="COM4">COM4</MenuItem>
//                 </TextField>

//                  <TextField
//                     label="Baud Rate"
//                     fullWidth
//                     value={form.baudRate}
//                     onChange={(e) => setField("baudRate", e.target.value)}
//                 />
//               </Stack>

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                  <TextField
//                     label="Data Bit"
//                     type="number"
//                     fullWidth
//                     value={form.dataBit}
//                     onChange={(e) => setField("dataBit", Number(e.target.value))}
//                 />
//                  <TextField
//                     label="Stop Bit"
//                     type="number"
//                     fullWidth
//                     value={form.stopBit}
//                     onChange={(e) => setField("stopBit", Number(e.target.value))}
//                 />
//               </Stack>

//               <TextField
//                 label="Party (Parity)"
//                 fullWidth
//                 value={form.party}
//                 onChange={(e) => setField("party", e.target.value)}
//               />

//               <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//                 <Button onClick={handleCloseDrawer} color="inherit">Cancel</Button>
//                 <Button variant="contained" onClick={handleSave}>
//                   {editingItem ? "Update" : "Save"}
//                 </Button>
//               </Stack>
//             </Stack>
//           </Drawer>

//           {/* DELETE DIALOG */}
//           <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <DialogContent>
//               <Typography>Are you sure you want to delete this Weighbridge?</Typography>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCancelDelete} color="inherit">Cancel</Button>
//               <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
//             </DialogActions>
//           </Dialog>

//           {/* SNACKBAR */}
//           <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
//             <Alert severity="success" variant="filled">{snackbarMessage}</Alert>
//           </Snackbar>

//         </Stack>
//       </div>
//     </LocalizationProvider>
//   );
// };

// export default WeighbridgeRegister;





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
// import WeighbridgeMain from "pages/components/WeighbridgeManage/WeighbridgeMain";
// import WeighbridgeDrawer from "pages/components/WeighbridgeManage/WeighbridgeDrawer";


// // --- Global Types ---
// export type Machine = {
//   id: number;
//   machineName: string;
// };

// export type Weighbridge = {
//   id: number;
//   machineId?: number;
//   serialNo: string;
//   port: "COM3" | "COM4";
//   baudRate: string;
//   dataBit: number;
//   stopBit: number;
//   party: string;
//   createdAt?: string;
// };

// const WeighbridgeRegister: React.FC = () => {
//   // Data State
//   const [weighbridges, setWeighbridges] = useState<Weighbridge[]>([]);
//   const [machines, setMachines] = useState<Machine[]>([]);
//   const [loading, setLoading] = useState(false);

//   // UI Control State
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<Weighbridge | null>(null);

//   // Feedback State
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   const { enqueueSnackbar } = useSnackbar();

//   // Load Mock Data
//   useEffect(() => {
//     setMachines([
//       { id: 1, machineName: "Machine A" },
//       { id: 2, machineName: "Machine B" },
//     ]);
//     setWeighbridges([
//       { id: 1, machineId: 1, serialNo: "SN-100", port: "COM4", baudRate: "9600", dataBit: 8, stopBit: 1, party: "None", createdAt: "2023-10-01" },
//       { id: 2, machineId: 2, serialNo: "SN-200", port: "COM3", baudRate: "19200", dataBit: 8, stopBit: 1, party: "Even", createdAt: "2023-12-15" },
//     ]);
//   }, []);

//   // --- Handlers ---
//   const handleOpenAdd = () => {
//     setEditingItem(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (wb: Weighbridge) => {
//     setEditingItem(wb);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingItem(null);
//   };

//   const handleSave = (formData: Weighbridge) => {
//     setLoading(true);
//     // Simulate API save
//     setTimeout(() => {
//         if (editingItem) {
//         setWeighbridges((prev) =>
//             prev.map((item) => (item.id === editingItem.id ? { ...formData, id: editingItem.id } : item))
//         );
//         enqueueSnackbar("Weighbridge updated successfully", { variant: "success" });
//         } else {
//         const newItem: Weighbridge = { ...formData, id: Date.now() };
//         setWeighbridges((prev) => [newItem, ...prev]);
//         enqueueSnackbar("Weighbridge added successfully", { variant: "success" });
//         }
//         setLoading(false);
//         handleCloseDrawer();
//     }, 400);
//   };

//   // --- Delete Logic ---
//   const initiateDelete = (id: number) => {
//     setItemToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (itemToDelete !== null) {
//       setWeighbridges((prev) => prev.filter((item) => item.id !== itemToDelete));
//       setSnackbarMessage("Weighbridge deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div className="vm-root">
        
//         {/* 1. Main View (Table & Filters) */}
//         <WeighbridgeMain
//           weighbridges={weighbridges}
//           machines={machines}
//           onAdd={handleOpenAdd}
//           onEdit={handleOpenEdit}
//           onDelete={initiateDelete}
//         />

//         {/* 2. Drawer View (Form) */}
//         <WeighbridgeDrawer
//           open={drawerOpen}
//           onClose={handleCloseDrawer}
//           onSave={handleSave}
//           initialData={editingItem}
//           machines={machines}
//           loading={loading}
//         />

//         {/* 3. Global Dialogs */}
//         <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
//           <DialogTitle>Confirm Delete</DialogTitle>
//           <DialogContent>
//             <Typography>Are you sure you want to delete this Weighbridge?</Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
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

// export default WeighbridgeRegister;










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
import WeighbridgeMain from "pages/components/WeighbridgeManage/WeighbridgeMain";
import WeighbridgeDrawer from "pages/components/WeighbridgeManage/WeighbridgeDrawer";

// Custom CSS (Your existing CSS)
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import IconifyIcon from "components/base/IconifyIcon";
import weighBridgeApi from "services/weighBridgeApi";

// --- Global Types ---
export type Machine = {
  id: number;
  machineName: string;
};

export type Weighbridge = {
  id: number;
  machineId?: number;
  machines?: string;
  serialNo: string;
  port: "COM3" | "COM4" | string;
  baudRate: string;
  dataBit: number;
  stopBit: number;
  party: string; // "Parity"
  createdAt?: string;
};

const WeighbridgeRegister: React.FC = () => {
  // Data State
  const [weighbridges, setWeighbridges] = useState<Weighbridge[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(false);

  // UI Control State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Weighbridge | null>(null);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // const { enqueueSnackbar } = useSnackbar();

  // API Effect----------
  const fetchWeighbridge = async () => {
    setLoading(true);
    try{
      const response = await weighBridgeApi.getWeighbridgeDetails();
      if (response.success) {
        setWeighbridges(response.data)
      } else {
        setSnackbarMessage(response.message || "failed to register Weighbridge")
      }
     } catch (error: any) {
        const errorMessage = error.response?.data.message || "Somthing error occured please try again later";
        setSnackbarMessage(errorMessage);
      } finally {
        setSnackbarOpen(true);
        setLoading(false);
      }
    };


  // Load Mock Data
  useEffect(() => {
    setLoading(true);
    fetchWeighbridge();
    setMachines([
      { id: 1, machineName: "Machine A" },
      { id: 2, machineName: "Machine B" },
      { id: 3, machineName: "Machine C" },
    ]);
    setWeighbridges([
      { id: 1, machineId: 1, serialNo: "SN-100", port: "COM4", baudRate: "9600", dataBit: 8, stopBit: 1, party: "None", createdAt: "2023-10-01" },
      { id: 2, machineId: 2, serialNo: "SN-200", port: "COM3", baudRate: "19200", dataBit: 8, stopBit: 1, party: "Even", createdAt: "2023-12-15" },
      { id: 3, machineId: 1, serialNo: "SN-300", port: "COM3", baudRate: "9600", dataBit: 8, stopBit: 1, party: "Odd", createdAt: "2024-01-20" },
      { id: 4, machineId: 3, serialNo: "SN-400", port: "COM4", baudRate: "115200", dataBit: 8, stopBit: 2, party: "None", createdAt: "2024-02-10" },
      { id: 5, machineId: 2, serialNo: "SN-500", port: "COM3", baudRate: "9600", dataBit: 8, stopBit: 1, party: "Even", createdAt: "2024-03-05" },
      { id: 6, machineId: 3, serialNo: "SN-600", port: "COM4", baudRate: "9600", dataBit: 8, stopBit: 1, party: "None", createdAt: "2024-03-12" },
    ]);
    setLoading(true);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (wb: Weighbridge) => {
    setEditingItem(wb);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingItem(null);
  };

  const handleSave = (formData: Weighbridge) => {
    setLoading(true);
    // Simulate API save
    setTimeout(() => {
        if (editingItem) {
        setWeighbridges((prev) =>
            prev.map((item) => (item.id === editingItem.id ? { ...formData, id: editingItem.id } : item))
        );
        setSnackbarMessage("Weighbridge updated successfully");
        } else {
        const newItem: Weighbridge = { ...formData, id: Date.now() };
        setWeighbridges((prev) => [newItem, ...prev]);
        setSnackbarMessage("Weighbridge added successfully");
        }
        setLoading(false);
        setSnackbarOpen(true)
        handleCloseDrawer();
    }, 400);
  };

  // --- Delete Logic ---
  const initiateDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      setWeighbridges((prev) => prev.filter((item) => item.id !== itemToDelete));
      setSnackbarMessage("Weighbridge deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View (DataGrid & Filters) */}
        <WeighbridgeMain
          weighbridges={weighbridges}
          machines={machines}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          loading={loading}
          onRefresh={fetchWeighbridge}
        />

        {/* 2. Drawer View (Form) */}
        <WeighbridgeDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingItem}
          machines={machines}
          loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this Weighbridge?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex_end", pb: 2, gap: 1 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained"
            startIcon={<IconifyIcon icon="wpf:delete"/>}
            >
              Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Legacy Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
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

export default WeighbridgeRegister;