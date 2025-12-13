

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
//   Grid,
//   Chip,
//   Tooltip,
// } from "@mui/material";

// // --- Date Imports ---
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs, { Dayjs } from 'dayjs';

// import IconifyIcon from "components/base/IconifyIcon";
// import vehicletypeApi from "services/vehicletypeApi"; // Keep your API service
// import { useSnackbar } from 'notistack';

// // --- Types ---

// type Vendor = {
//   id: number;
//   vendorName: string;
// };

// type Machine = {
//   id: number;
//   vendorId: number;
//   machineName: string;
//   machineType: string;
// };

// type Vehicle = {
//   id: number;
//   vehicleType: string;
//   vendorId?: number;
//   customerId?: number;
//   tareWeight?: number;
//   status: "Active" | "Inactive";
//   createdDate?: string; // Added for Date Filtering logic
// };

// const VehicleRegister: React.FC = () => {
//   // -- Data State --
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [machines, setMachines] = useState<Machine[]>([]);
  
//   // -- UI State --
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
  
//   // -- Filter State --
//   const [search, setSearch] = useState('');
//   const [filterVendorId, setFilterVendorId] = useState<number | "">("");
//   const [fromDate, setFromDate] = useState<Dayjs | null>(null);
//   const [toDate, setToDate] = useState<Dayjs | null>(null);

//   // -- Feedback State --
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
  
//   const { enqueueSnackbar } = useSnackbar();
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//   // -- Form State --
//   const [form, setForm] = useState<Vehicle>({
//     id: 0,
//     vehicleType: "",
//     vendorId: undefined,
//     customerId: undefined,
//     tareWeight: undefined,
//     status: "Active",
//     createdDate: dayjs().format("YYYY-MM-DD"),
//   });

//   useEffect(() => {
//     // Initialize data (Mocking for display, replace with your API calls)
//     setVendors([
//         { id: 1, vendorName: "TechCorp Industries" },
//         { id: 2, vendorName: "Global Logistics" }
//     ]);
//     setMachines([
//         { id: 101, vendorId: 1, machineName: "Machine A", machineType: "Company" }
//     ]);
//     setVehicles([
//         { id: 1, vehicleType: "Truck", vendorId: 1, tareWeight: 2500, status: "Active", createdDate: "2023-11-01" },
//         { id: 2, vehicleType: "Van", vendorId: 2, tareWeight: 1800, status: "Active", createdDate: "2023-12-15" },
//         { id: 3, vehicleType: "Lorry", vendorId: 1, tareWeight: 3200, status: "Inactive", createdDate: "2024-01-10" },
//     ]);
//   }, []);

//   // --- Handlers ---

//   const handleOpenAdd = () => {
//     setEditingVehicle(null);
//     setForm({
//       id: 0,
//       vehicleType: "",
//       vendorId: undefined,
//       customerId: undefined,
//       tareWeight: undefined,
//       status: "Active",
//       createdDate: dayjs().format("YYYY-MM-DD"),
//     });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (v: Vehicle) => {
//     setEditingVehicle(v);
//     setForm({ ...v });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingVehicle(null);
//     setFormError(null);
//   };

//   // --- CSV Download Logic ---
//   const handleDownloadCSV = () => {
//     if (filteredVehicles.length === 0) {
//         enqueueSnackbar("No data to download", { variant: "warning" });
//         return;
//     }

//     // 1. Create Header
//     const headers = ["ID", "Vehicle Type", "Vendor", "Customer ID", "Tare Weight", "Status", "Date"];
    
//     // 2. Map Rows
//     const rows = filteredVehicles.map(v => {
//         const vendorName = vendors.find(ven => ven.id === v.vendorId)?.vendorName || "";
//         return [
//             v.id,
//             v.vehicleType,
//             vendorName,
//             v.customerId || "",
//             v.tareWeight || "",
//             v.status,
//             v.createdDate || ""
//         ].join(","); // Join columns with comma
//     });

//     // 3. Combine
//     const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    
//     // 4. Trigger Download
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "vehicle_register.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
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

//   const handleSave = async () => {
//     if (!validate()) return;
//     setLoading(true);

//     const payload = {
//       "Vehicle_type": form.vehicleType,
//       "Vendor_Id": form.vendorId,
//       "Customer_Id": form.customerId,
//       "Tare_weight": form.tareWeight,
//       "Status": form.status
//     };

//     try {
//       // Mocking API call for now since I don't have your backend
//       // const response = await vehicletypeApi.addVehicleDetails(payload);
      
//       // Simulate success for UI demo
//       const success = true; 
      
//       if (success) {
//         if (editingVehicle) {
//              setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? {...form, id: editingVehicle.id} : v));
//              enqueueSnackbar("Vehicle updated successfully!", { variant: "success" });
//         } else {
//              const newVehicle = { ...form, id: Date.now() };
//              setVehicles(prev => [newVehicle, ...prev]);
//              enqueueSnackbar("Vehicle added successfully!", { variant: "success" });
//         }
//         handleCloseDrawer();
//       } else {
//         enqueueSnackbar("Failed to register vehicle", { variant: "error" });
//       }
//     } catch (error: any) {
//       enqueueSnackbar(error.message || "Something went wrong", { variant: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Delete Handlers ---
//   const handleClickDelete = (id: number) => {
//     setVehicleToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (vehicleToDelete !== null) {
//       setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete));
//       setSnackbarMessage("Vehicle deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setVehicleToDelete(null);
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setVehicleToDelete(null);
//   };
  
//   const handleCloseSnackbar = () => setSnackbarOpen(false);
  
//   const handleClearFilters = () => {
//       setSearch("");
//       setFilterVendorId("");
//       setFromDate(null);
//       setToDate(null);
//   };

//   const setField = (key: keyof Vehicle, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   // Helper: Get machines for the drawer dropdown
//   const getVendorMachines = () => {
//     if (!form.vendorId) return [];
//     return machines.filter(m => m.vendorId === form.vendorId);
//   };

//   const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.currentTarget.value);
//   };

//   // --- Filter Logic ---
//   const filteredVehicles = useMemo(() => {
//     return vehicles.filter((v) => {
//         // 1. Text Search
//         const matchesSearch = v.vehicleType.toLowerCase().includes(search.toLowerCase());
        
//         // 2. Dropdown Filter
//         const matchesVendor = filterVendorId === "" || v.vendorId === filterVendorId;

//         // 3. Date Filter
//         const itemDate = dayjs(v.createdDate);
//         const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
//         const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

//         return matchesSearch && matchesVendor && matchesFromDate && matchesToDate;
//     });
//   }, [vehicles, search, filterVendorId, fromDate, toDate]);

//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <div className="vm-root">
//         <Stack
//             bgcolor="background.paper"
//             borderRadius={5}
//             width={1}
//             boxShadow={(theme) => theme.shadows[4]}
//         >
//             <main className="vm-content">
                
//                 {/* --- PROFESSIONAL HEADER (Grid Layout) --- */}
//                 <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
//                     {/* Top Row */}
//                     <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//                         <Typography variant="h4" fontWeight="bold" color="text.primary">
//                             Vehicle Register
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             onClick={handleOpenAdd}
//                             startIcon={<IconifyIcon icon="mdi:plus" />}
//                             sx={{ px: 3, py: 1, borderRadius: 2 }}
//                         >
//                             Add Vehicle
//                         </Button>
//                     </Stack>

//                     {/* Filter Grid */}
//                     <Grid container spacing={2} alignItems="center">
//                         {/* Search */}
//                         <Grid item xs={12} sm={6} md={3}>
//                             <TextField
//                                 variant="outlined"
//                                 placeholder="Search Vehicle Type..."
//                                 size="small"
//                                 fullWidth
//                                 value={search}
//                                 onChange={handleChangeSearch}
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <IconifyIcon icon="mdi:search" color="action.active" />
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                         </Grid>

//                         {/* From Date */}
//                         <Grid item xs={6} sm={3} md={2}>
//                             <DatePicker
//                                 label="From Date"
//                                 value={fromDate}
//                                 onChange={(newValue) => setFromDate(newValue)}
//                                 slotProps={{ textField: { size: 'small', fullWidth: true } }}
//                             />
//                         </Grid>

//                         {/* To Date */}
//                         <Grid item xs={6} sm={3} md={2}>
//                             <DatePicker
//                                 label="To Date"
//                                 value={toDate}
//                                 onChange={(newValue) => setToDate(newValue)}
//                                 slotProps={{ textField: { size: 'small', fullWidth: true } }}
//                             />
//                         </Grid>

//                         {/* Vendor Dropdown */}
//                         <Grid item xs={12} sm={6} md={2}>
//                             <TextField
//                                 select
//                                 label="Filter Vendor"
//                                 variant="outlined"
//                                 size="small"
//                                 fullWidth
//                                 value={filterVendorId}
//                                 onChange={(e) => setFilterVendorId(e.target.value === "" ? "" : Number(e.target.value))}
//                             >
//                                 <MenuItem value=""><em>All Vendors</em></MenuItem>
//                                 {vendors.map((v) => (
//                                     <MenuItem key={v.id} value={v.id}>{v.vendorName}</MenuItem>
//                                 ))}
//                             </TextField>
//                         </Grid>

//                         {/* Actions (Clear, Download, Refresh) */}
//                         <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
//                             <Button 
//                                 variant="outlined" 
//                                 color="secondary" 
//                                 size="medium"
//                                 onClick={handleClearFilters}
//                                 startIcon={<IconifyIcon icon="mdi:filter-off" />}
//                             >
//                                 Clear
//                             </Button>
                            
//                             {/* ⭐ Download Button */}
//                             <Tooltip title="Download CSV">
//                                 <IconButton 
//                                     onClick={handleDownloadCSV}
//                                     sx={{ 
//                                         // bgcolor: theme.palette.primary.light + '20', 
//                                         color: 'primary.main',
//                                         '&:hover': { bgcolor: theme.palette.primary.light + '40' }
//                                     }}
//                                 >
//                                     <IconifyIcon icon="mdi:download" />
//                                 </IconButton>
//                             </Tooltip>

//                             <Tooltip title="Refresh">
//                                 <IconButton
//                                     onClick={() => console.log("Refresh logic")}
//                                     sx={{
//                                         bgcolor: theme.palette.action.hover,
//                                         color: 'primary.main',
//                                         "&:hover": { bgcolor: theme.palette.action.selected },
//                                     }}
//                                 >
//                                     <IconifyIcon icon="mdi:refresh" />
//                                 </IconButton>
//                             </Tooltip>
//                         </Grid>
//                     </Grid>
//                 </Box>

//                 {/* --- TABLE SECTION --- */}
//                 <TableContainer className="vm-table-container">
//                 <Table className="vm-table">
//                     <TableHead className="vm-table-header">
//                     <TableRow className="vm-table-row">
//                         <TableCell className="header-name">Vehicle Type</TableCell>
//                         <TableCell className="header-name">Vendor</TableCell>
//                         <TableCell className="header-name">Customer ID</TableCell>
//                         <TableCell className="header-name">Tare Weight</TableCell>
//                         <TableCell className="header-name">Created Date</TableCell>
//                         <TableCell className="header-name">Status</TableCell>
//                         <TableCell className="header-name" align="right">Actions</TableCell>
//                     </TableRow>
//                     </TableHead>

//                     <TableBody>
//                     {filteredVehicles.map((v) => (
//                         <TableRow key={v.id} hover>
//                         <TableCell>
//                             <Typography variant="subtitle2" fontWeight={600}>
//                             {v.vehicleType}
//                             </Typography>
//                         </TableCell>

//                         <TableCell>
//                             {v.vendorId ? vendors.find(vendor => vendor.id === v.vendorId)?.vendorName || "—" : "—"}
//                         </TableCell>
//                         <TableCell>{v.customerId || "—"}</TableCell>
//                         <TableCell>
//                             {v.tareWeight ? `${v.tareWeight.toFixed(2)} kg` : "—"}
//                         </TableCell>
                        
//                         <TableCell>
//                             {v.createdDate ? dayjs(v.createdDate).format('DD MMM YYYY') : "—"}
//                         </TableCell>

//                         <TableCell>
//                             <Chip 
//                                 label={v.status} 
//                                 color={v.status === "Active" ? "success" : "default"}
//                                 size="small"
//                                 variant="outlined"
//                                 sx={{ fontWeight: 'bold' }}
//                             />
//                         </TableCell>

//                         <TableCell align="right">
//                             <Stack direction="row" spacing={1} justifyContent="flex-end">
//                                 <IconButton
//                                     onClick={() => handleOpenEdit(v)}
//                                     color="primary"
//                                     size="small"
//                                 >
//                                     <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                                 </IconButton>
//                                 <IconButton
//                                     onClick={() => handleClickDelete(v.id)}
//                                     color="error"
//                                     size="small"
//                                 >
//                                     <IconifyIcon icon="wpf:delete" />
//                                 </IconButton>
//                             </Stack>
//                         </TableCell>
//                         </TableRow>
//                     ))}
//                     {filteredVehicles.length === 0 && (
//                         <TableRow>
//                             <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                                 <Typography variant="body1" color="text.secondary">
//                                     No vehicles found.
//                                 </Typography>
//                             </TableCell>
//                         </TableRow>
//                     )}
//                     </TableBody>
//                 </Table>
//                 </TableContainer>
                
//             </main>

//             {/* --- RIGHT DRAWER (ADD/EDIT) --- */}
//             <Drawer
//                 anchor="right"
//                 open={drawerOpen}
//                 onClose={handleCloseDrawer}
//                 PaperProps={{
//                 sx: {
//                     width: drawerWidth,
//                     p: 3,
//                     borderTopLeftRadius: { xs: 0, md: 12 },
//                     borderBottomLeftRadius: { xs: 0, md: 12 },
//                 },
//                 }}
//             >
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//                 <Typography variant="h6" fontWeight="bold">
//                     {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
//                 </Typography>
//                 <IconButton onClick={handleCloseDrawer}>
//                     <IconifyIcon icon="material-symbols:close-rounded" />
//                 </IconButton>
//                 </Box>

//                 <Stack spacing={2.5}>
//                     {formError && <Alert severity="error">{formError}</Alert>}

//                     <TextField
//                     label="Vehicle Type"
//                     placeholder="e.g., Truck, Van, Lorry"
//                     fullWidth
//                     value={form.vehicleType}
//                     onChange={(e) => setField("vehicleType", e.target.value)}
//                     disabled={loading}
//                     />

//                     <TextField
//                     label="Vendor"
//                     select
//                     fullWidth
//                     value={form.vendorId || ""}
//                     onChange={(e) => setField("vendorId", e.target.value ? Number(e.target.value) : undefined)}
//                     disabled={loading}
//                     >
//                     <MenuItem value={0}><em>None</em></MenuItem>
//                     {vendors.map((v) => (
//                         <MenuItem key={v.id} value={v.id}>{v.vendorName}</MenuItem>
//                     ))}
//                     </TextField>

//                     {/* Dynamic info about machines */}
//                     {form.vendorId && getVendorMachines().length > 0 && (
//                     <Alert severity="info" sx={{ py: 0 }}>
//                         <Typography variant="caption" fontWeight="bold">
//                         Linked Machines:
//                         </Typography>
//                         {getVendorMachines().map((machine) => (
//                         <Typography key={machine.id} variant="caption" display="block">
//                             • {machine.machineName} ({machine.machineType})
//                         </Typography>
//                         ))}
//                     </Alert>
//                     )}

//                     <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                         <TextField
//                         label="Customer ID"
//                         type="number"
//                         placeholder="ID"
//                         fullWidth
//                         value={form.customerId ?? ""}
//                         onChange={(e) => setField("customerId", e.target.value ? Number(e.target.value) : undefined)}
//                         disabled={loading}
//                         />

//                         <TextField
//                         label="Tare Weight (kg)"
//                         type="number"
//                         placeholder="0.00"
//                         fullWidth
//                         value={form.tareWeight ?? ""}
//                         onChange={(e) => setField("tareWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
//                         disabled={loading}
//                         />
//                     </Stack>

//                     <TextField
//                     label="Status"
//                     select
//                     fullWidth
//                     value={form.status}
//                     onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
//                     disabled={loading}
//                     >
//                     <MenuItem value="Active">Active</MenuItem>
//                     <MenuItem value="Inactive">Inactive</MenuItem>
//                     </TextField>

//                     <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//                         <Button onClick={handleCloseDrawer} color="inherit">Cancel</Button>
//                         <Button variant="contained" onClick={handleSave} disabled={loading}>
//                             {editingVehicle ? "Update" : "Save"}
//                         </Button>
//                     </Stack>
//                 </Stack>
//             </Drawer>

//             {/* --- DELETE DIALOG --- */}
//             <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
//                 <DialogTitle>Confirm Delete</DialogTitle>
//                 <DialogContent>
//                 <Typography>Are you sure you want to delete this Vehicle?</Typography>
//                 </DialogContent>
//                 <DialogActions>
//                 <Button onClick={handleCancelDelete} color="inherit">Cancel</Button>
//                 <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
//                 </DialogActions> 
//             </Dialog>
        
//             {/* --- SNACKBAR --- */}
//             <Snackbar
//                 open={snackbarOpen}
//                 autoHideDuration={3000}
//                 onClose={handleCloseSnackbar}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             >
//                 <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
//                 {snackbarMessage}
//                 </Alert>
//             </Snackbar>

//         </Stack>
//         </div>
//     </LocalizationProvider>
//   );
// };

// export default VehicleRegister;





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
// import IconifyIcon from "components/base/IconifyIcon";
// import { useSnackbar } from 'notistack';

// // Sub Components
// import VehicleMain from "pages/components/VehicleManage/VehicleMain";
// import VehicleDrawer from "pages/components/VehicleManage/VehicleDawer";



// // --- Types (Exported so children can use them) ---
// export type Vendor = {
//   id: number;
//   vendorName: string;
// };

// export type Machine = {
//   id: number;
//   vendorId: number;
//   machineName: string;
//   machineType: string;
// };

// export type Vehicle = {
//   id: number;
//   vehicleType: string;
//   vendorId?: number;
//   customerId?: number;
//   tareWeight?: number;
//   status: "Active" | "Inactive";
//   createdDate?: string;
// };

// const VehicleRegister: React.FC = () => {
//   // --- Global Data State ---
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [machines, setMachines] = useState<Machine[]>([]);
  
//   // --- UI Control State ---
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
//   const [loading, setLoading] = useState(false);

//   // --- Feedback State ---
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
  
//   const { enqueueSnackbar } = useSnackbar();

//   // Load Data Mock
//   useEffect(() => {
//     setVendors([
//         { id: 1, vendorName: "TechCorp Industries" },
//         { id: 2, vendorName: "Global Logistics" }
//     ]);
//     setMachines([
//         { id: 101, vendorId: 1, machineName: "Machine A", machineType: "Company" }
//     ]);
//     setVehicles([
//         { id: 1, vehicleType: "Truck", vendorId: 1, tareWeight: 2500, status: "Active", createdDate: "2023-11-01" },
//         { id: 2, vehicleType: "Van", vendorId: 2, tareWeight: 1800, status: "Active", createdDate: "2023-12-15" },
//         { id: 3, vehicleType: "Lorry", vendorId: 1, tareWeight: 3200, status: "Inactive", createdDate: "2024-01-10" },
//         { id: 4, vehicleType: "Auto", vendorId: 1, tareWeight: 2500, status: "Active", createdDate: "2023-11-01" },
//         { id: 5, vehicleType: "Container", vendorId: 2, tareWeight: 1800, status: "Active", createdDate: "2023-12-15" },
//         { id: 6, vehicleType: "Container", vendorId: 2, tareWeight: 1800, status: "Active", createdDate: "2023-12-15" },



//     ]);
//   }, []);

//   // --- Handlers ---
//   const handleOpenAdd = () => {
//     setEditingVehicle(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (v: Vehicle) => {
//     setEditingVehicle(v);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingVehicle(null);
//   };

//   const handleSaveVehicle = async (formData: Vehicle) => {
//     setLoading(true);
//     // Mimic API Call
//     try {
//       setTimeout(() => {
//         if (editingVehicle) {
//              setVehicles(prev => prev.map(v => v.id === formData.id ? formData : v));
//              enqueueSnackbar("Vehicle updated successfully!", { variant: "success" });
//         } else {
//              const newVehicle = { ...formData, id: Date.now() };
//              setVehicles(prev => [newVehicle, ...prev]);
//              enqueueSnackbar("Vehicle added successfully!", { variant: "success" });
//         }
//         setLoading(false);
//         handleCloseDrawer();
//       }, 500); 
//     } catch (error) {
//        enqueueSnackbar("Error saving data", { variant: "error" });
//        setLoading(false);
//     }
//   };

//   // --- Delete Logic ---
//   const initiateDelete = (id: number) => {
//     setVehicleToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (vehicleToDelete !== null) {
//       setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete));
//       setSnackbarMessage("Vehicle deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setVehicleToDelete(null);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div className="vm-root">
        
//         {/* 1. Main Table View */}
//         <VehicleMain 
//             vehicles={vehicles}
//             vendors={vendors}
//             onAdd={handleOpenAdd}
//             onEdit={handleOpenEdit}
//             onDelete={initiateDelete}
//         />
        

//         {/* 2. Drawer Form */}
//         <VehicleDrawer
//             open={drawerOpen}
//             onClose={handleCloseDrawer}
//             onSave={handleSaveVehicle}
//             initialData={editingVehicle}
//             vendors={vendors}
//             machines={machines}
//             loading={loading}
//         />

//         {/* 3. Global Dialogs */}
//         <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <DialogContent>
//                 <Typography>Are you sure you want to delete this Vehicle?</Typography>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
//                 <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
//             </DialogActions> 
//         </Dialog>

//         {/* 4. Global Snackbar (Legacy, usually useNotistack is enough) */}
//         <Snackbar
//             open={snackbarOpen}
//             autoHideDuration={3000}
//             onClose={() => setSnackbarOpen(false)}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         >
//             <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
//                 {snackbarMessage}
//             </Alert>
//         </Snackbar>

//       </div>
//     </LocalizationProvider>
//   );
// };

// export default VehicleRegister;





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
import VehicleMain from "pages/components/VehicleManage/VehicleMain";
import VehicleDrawer from "pages/components/VehicleManage/VehicleDawer";

import IconifyIcon from "components/base/IconifyIcon";
import vehicletypeApi from "services/vehicletypeApi";

// --- Types ---
export type Vendor = {
  id: number;
  vendorName: string;
};

export type Machine = {
  id: number;
  vendorId: number;
  machineName: string;
  machineType: string;
};

export type Vehicle = {
  id: number;
    vehicleType: string;
  vendorId?: number;
  customerId?: number;
  tareWeight?: number;
  status: "Active" | "Inactive";
  createdDate?: string;
};

const VehicleRegister: React.FC = () => {
  // --- Global Data State ---
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  
  // --- UI Control State ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Feedback State ---
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  // const { enqueueSnackbar } = useSnackbar();

  // API Fetch-----------
  const fetchVehicle = async ()=> {
    setLoading(true);
    try{
      const response = await vehicletypeApi.getVehicleDetails();
      if (response.success) {
        setVehicles(response.data);
      } else {
       setSnackbarMessage(response.message || " Failed to register machine");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Somthing error occured please try again later";
      setSnackbarMessage(errorMessage);
    } finally {
      setSnackbarOpen(true)
      setLoading(false);
    }
  }

  // Load Data Mock
  useEffect(() => {
    setLoading(true)
    fetchVehicle();
    setVendors([
        { id: 1, vendorName: "TechCorp Industries" },
        { id: 2, vendorName: "Global Logistics" }
    ]);
    setMachines([
        { id: 101, vendorId: 1, machineName: "Machine A", machineType: "Company" }
    ]);
    setVehicles([
        { id: 1, vehicleType: "Truck", vendorId: 1, tareWeight: 2500, status: "Active", createdDate: "2023-11-01" },
        { id: 2, vehicleType: "Van", vendorId: 2, tareWeight: 1800, status: "Active", createdDate: "2023-12-15" },
        { id: 3, vehicleType: "Lorry", vendorId: 1, tareWeight: 3200, status: "Inactive", createdDate: "2024-01-10" },
        { id: 4, vehicleType: "Pickup", vendorId: 2, tareWeight: 1500, status: "Active", createdDate: "2024-02-20" },
        { id: 5, vehicleType: "Semi", vendorId: 1, tareWeight: 8000, status: "Active", createdDate: "2024-03-05" },
        { id: 6, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 7, vehicleType: "Pickup", vendorId: 2, tareWeight: 1500, status: "Active", createdDate: "2024-02-20" },
        { id: 8, vehicleType: "Semi", vendorId: 1, tareWeight: 8000, status: "Active", createdDate: "2024-03-05" },
        { id: 9, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 10, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 11, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 12, vehicleType: "Van", vendorId: 2, tareWeight: 1800, status: "Active", createdDate: "2023-12-15" },
        { id: 13, vehicleType: "Lorry", vendorId: 1, tareWeight: 3200, status: "Inactive", createdDate: "2024-01-10" },
        { id: 14, vehicleType: "Pickup", vendorId: 2, tareWeight: 1500, status: "Active", createdDate: "2024-02-20" },
        { id: 15, vehicleType: "Semi", vendorId: 1, tareWeight: 8000, status: "Active", createdDate: "2024-03-05" },
        { id: 16, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 17, vehicleType: "Pickup", vendorId: 2, tareWeight: 1500, status: "Active", createdDate: "2024-02-20" },
        { id: 18, vehicleType: "Semi", vendorId: 1, tareWeight: 8000, status: "Active", createdDate: "2024-03-05" },
        { id: 19, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 20, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 21, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 22, vehicleType: "Van", vendorId: 2, tareWeight: 1800, status: "Active", createdDate: "2023-12-15" },
        { id: 23, vehicleType: "Lorry", vendorId: 1, tareWeight: 3200, status: "Inactive", createdDate: "2024-01-10" },
        { id: 24, vehicleType: "Pickup", vendorId: 2, tareWeight: 1500, status: "Active", createdDate: "2024-02-20" },
        { id: 25, vehicleType: "Semi", vendorId: 1, tareWeight: 8000, status: "Active", createdDate: "2024-03-05" },
         { id: 26, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 27, vehicleType: "Pickup", vendorId: 2, tareWeight: 1500, status: "Active", createdDate: "2024-02-20" },
        { id: 28, vehicleType: "Semi", vendorId: 1, tareWeight: 8000, status: "Active", createdDate: "2024-03-05" },
        { id: 29, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 30, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
        { id: 31, vehicleType: "Forklift", vendorId: 1, tareWeight: 1200, status: "Inactive", createdDate: "2024-03-12" },
    ]);
    setLoading(false)
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingVehicle(null);
  };

  const handleSaveVehicle = async (formData: Vehicle) => {
    setLoading(true);
    // Mimic API Call
    try {
      setTimeout(() => {
        if (editingVehicle) {
             setVehicles(prev => prev.map(v => v.id === formData.id ? formData : v));
             setSnackbarMessage("Vehicle updated successfully!");
        } else {
             const newVehicle = { ...formData, id: Date.now() };
             setVehicles(prev => [newVehicle, ...prev]);
             setSnackbarMessage("Vehicle added successfully!");
        }
        setLoading(false);
        setSnackbarOpen(true)
        handleCloseDrawer();
      }, 500); 
    } catch (error) {
       setSnackbarMessage("Error saving data");
       setLoading(false);
    }
  };

  // --- Delete Logic ---
  const initiateDelete = (id: number) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete !== null) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete));
      setSnackbarMessage("Vehicle deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main Table View */}
        <VehicleMain 
            vehicles={vehicles}
            vendors={vendors}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={initiateDelete}
            onRefresh={fetchVehicle}
            loading={loading}
        />
        

        {/* 2. Drawer Form */}
        <VehicleDrawer
            open={drawerOpen}
            onClose={handleCloseDrawer}
            onSave={handleSaveVehicle}
            initialData={editingVehicle}
            vendors={vendors}
            machines={machines}
            loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this Vehicle?</Typography>
            </DialogContent>
            <DialogActions sx={{justifyContent: "flex-end", pb: 2, gap: 1}}>
                <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
                <Button onClick={confirmDelete} color="error" variant="contained"
                startIcon={<IconifyIcon icon = "wpf:delete"/>}
                >Delete</Button>
            </DialogActions> 
        </Dialog>

        {/* 4. Global Snackbar */}
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

export default VehicleRegister;