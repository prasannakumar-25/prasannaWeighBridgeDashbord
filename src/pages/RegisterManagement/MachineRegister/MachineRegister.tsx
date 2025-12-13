

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
//   useMediaQuery,
//   useTheme,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";

// import IconifyIcon from "components/base/IconifyIcon";

// import './MachineRegister.css'

// // Vendor type (for linking)
// type Vendor = {
//   id: number;
//   vendorName: string;
//   category?: string;
//   phone?: string;
//   email?: string;
//   website?: string;
//   gstNumber?: string;
//   address?: string;
//   location?: string;
//   status?: "Active" | "Inactive";
// };

// // Machine type
// type Machine = {
//   id: number;
//   vendorId: number;
//   machineName: string;
//   password: string;
//   machineMac?: string;
//   machineModel?: string;
//   capacityTon?: number;
//   lastServiceDate?: string;
//   machineType: "Company" | "ThirdParty" | "Estate";
//   machineLocation?: string;
// };

// const initialVendors: Vendor[] = [
//   {
//     id: 1,
//     vendorName: "TechCorp Industries",
//     category: "Electronics",
//     phone: "9876543210",
//     email: "tech@corp.com",
//     website: "https://techcorp.com",
//     gstNumber: "GST123456",
//     address: "12 Marine Drive, Mumbai",
//     location: "Mumbai, Maharashtra",
//     status: "Active",
//   },
//   {
//     id: 2,
//     vendorName: "Global Logistics",
//     category: "Logistics",
//     phone: "9876543211",
//     email: "global@log.com",
//     website: "https://globallog.com",
//     gstNumber: "GST123457",
//     address: "45 Industrial Estate, Delhi",
//     location: "New Delhi, Delhi",
//     status: "Active",
//   },
//   {
//     id: 3,
//     vendorName: "ExpressCargo Solutions",
//     category: "Transport",
//     phone: "9876543212",
//     email: "express@cargo.com",
//     website: "https://expresscargo.com",
//     gstNumber: "GST123458",
//     address: "99 Tech Park, Bangalore",
//     location: "Bengaluru, Karnataka",
//     status: "Inactive",
//   },
// ];

// const initialMachines: Machine[] = [
//   {
//     id: 1,
//     vendorId: 1,
//     machineName: "Machine A",
//     password: "pass123",
//     machineMac: "AA:BB:CC:DD:EE:FF",
//     machineModel: "Model X",
//     capacityTon: 5.5,
//     lastServiceDate: "2024-01-15",
//     machineType: "Company",
//     machineLocation: "Mumbai, Maharashtra",
//   },
//   {
//     id: 2,
//     vendorId: 2,
//     machineName: "Machine B",
//     password: "secure456",
//     machineMac: "11:22:33:44:55:66",
//     machineModel: "Model Y",
//     capacityTon: 10.0,
//     lastServiceDate: "2024-06-20",
//     machineType: "ThirdParty",
//     machineLocation: "New Delhi, Delhi",
//   },
//   {
//     id: 3,
//     vendorId: 1,
//     machineName: "Machine C",
//     password: "estate789",
//     machineMac: "99:88:77:66:55:44",
//     machineModel: "Model Z",
//     capacityTon: 2.25,
//     lastServiceDate: "2024-03-10",
//     machineType: "Estate",
//     machineLocation: "Bengaluru, Karnataka",
//   },
// ];

// const MachineRegister: React.FC<{ onLogout?: () => void }> = () => {
//   const [machines, setMachines] = useState<Machine[]>([]);
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);

//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//   // form state (single object)
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

//   useEffect(() => {
//     // Load mock machines and vendors on first render
//     setMachines(initialMachines);
//     setVendors(initialVendors);
//   }, []);

//   // open drawer for add
//   const handleOpenAdd = () => {
//     setEditingMachine(null);
//     setForm({
//       id: 0,
//       vendorId: 0,
//       machineName: "",
//       password: "",
//       machineMac: "",
//       machineModel: "",
//       capacityTon: undefined,
//       lastServiceDate: "",
//       machineType: "Company",
//       machineLocation: "",
//     });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   // open drawer for edit
//   const handleOpenEdit = (m: Machine) => {
//     setEditingMachine(m);
//     setForm({ ...m });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   // close drawer
//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingMachine(null);
//     setFormError(null);
//   };

//   // validate basic fields
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

//   // save machine (add or update)
//   const handleSave = () => {
//     if (!validate()) return;

//     if (editingMachine) {
//       // update
//       setMachines((prev) => prev.map((p) => (p.id === editingMachine.id ? { ...form, id: editingMachine.id } : p)));
//     } else {
//       // add
//       const newMachine: Machine = { ...form, id: Date.now() };
//       setMachines((prev) => [newMachine, ...prev]);
//     }

//     handleCloseDrawer();
//   };

//   const handleDelete = (id: number) => {
//     if (!confirm("Are you sure you want to delete this machine?")) return;
//     setMachines((prev) => prev.filter((m) => m.id !== id));
//   };

//   // update form field helper
//   const setField = (key: keyof Machine, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   // drawer width responsive:
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   return (
//     <Stack
//       className="mm-root"
//       bgcolor="common.white"
//       borderRadius={5}
//       mx="auto"
//       boxShadow={theme.shadows[4]}
//     >
//       <main className="mm-content">
//         <Box className="mm-header">
//           <Typography variant="h4">Machine Register</Typography>

//           <div className="mm-actions">
//             <Button
//               variant="contained"
//               onClick={handleOpenAdd}
//               className="add-machine-btn"
//             >
//               Add Machine
//             </Button>
//           </div>
//         </Box>

//         {/* TABLE VERSION */}
//         <TableContainer className="mm-table-container">
//           <Table className="mm-table">
//             <TableHead className="mm-table-header">
//               <TableRow className="mm-table-row">
//                 <TableCell>Machine Name</TableCell>
//                 <TableCell>Vendor</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Capacity (tons)</TableCell>
//                 <TableCell>Location</TableCell>
//                 <TableCell>Last Service</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {machines.map((m) => (
//                 <TableRow key={m.id}>
//                   <TableCell>
//                     <Typography variant="subtitle1" className="mm-row-title">
//                       {m.machineName}
//                     </Typography>
//                   </TableCell>

//                   <TableCell>{vendors.find(v => v.id === m.vendorId)?.vendorName || "—"}</TableCell>
//                   <TableCell>{m.machineType}</TableCell>
//                   <TableCell>{m.capacityTon ? `${m.capacityTon} tons` : "—"}</TableCell>
//                   <TableCell>{m.machineLocation || "—"}</TableCell>

//                   <TableCell>
//                     {m.lastServiceDate ? new Date(m.lastServiceDate).toLocaleDateString() : "—"}
//                   </TableCell>

//                   <TableCell align="right" className="mm-action-cell">
//                     <Button
//                       onClick={() => handleOpenEdit(m)}
//                       className="mm-btn mm-action-btn-edit"
//                     >
//                       <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                     </Button>

//                     <Button
//                       onClick={() => handleDelete(m.id)}
//                       className="mm-btn mm-action-btn-delete"
//                     >
//                       <IconifyIcon icon="wpf:delete" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </main>

//       {/* Right drawer - slides in from right; full width on small screens */}
//       <Drawer
//         anchor="right"
//         open={drawerOpen}
//         onClose={handleCloseDrawer}
//         PaperProps={{
//           sx: {
//             width: drawerWidth ,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: "30px",
//             maxWidth: "100%",
//             borderTopLeftRadius: { xs: 0, md: 12 },
//             borderBottomLeftRadius: { xs: 0, md: 12 },
//             height: { xs: "100vh", md: "100vh" },
//           },
//         }}
//         ModalProps={{ keepMounted: true }}
//       >
//         <Box className="drawer-header">
//           <Typography variant="h6">{editingMachine ? "Edit Machine" : "Add New Machine"}</Typography>
//           <IconButton onClick={handleCloseDrawer} aria-label="close">
//             <IconifyIcon icon="material-symbols:close-rounded" />
//           </IconButton>
//         </Box>

//         <Box className="drawer-content">
//           {formError && <Box className="form-error">{formError}</Box>}

//           <Stack spacing={2}>
//             <TextField
//               label="Machine Name"
//               placeholder="Enter machine name"
//               fullWidth
//               value={form.machineName}
//               onChange={(e) => setField("machineName", e.target.value)}
//             />

//             <TextField
//               label="Vendor"
//               select
//               fullWidth
//               value={form.vendorId}
//               onChange={(e) => setField("vendorId", Number(e.target.value))}
//             >
//               {vendors.map((v) => (
//                 <MenuItem key={v.id} value={v.id}>
//                   {v.vendorName}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               label="Password"
//               type="password"
//               placeholder="Enter password"
//               fullWidth
//               value={form.password}
//               onChange={(e) => setField("password", e.target.value)}
//             />

//             <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <TextField
//                 label="MAC Address"
//                 placeholder="e.g., AA:BB:CC:DD:EE:FF"
//                 fullWidth
//                 value={form.machineMac || ""}
//                 onChange={(e) => setField("machineMac", e.target.value)}
//               />
//               <TextField
//                 label="Machine Model"
//                 placeholder="e.g., Model X"
//                 fullWidth
//                 value={form.machineModel || ""}
//                 onChange={(e) => setField("machineModel", e.target.value)}
//               />
//             </Stack>

//             <TextField
//               label="Capacity (tons)"
//               type="number"
//               placeholder="e.g., 5.5"
//               fullWidth
//               value={form.capacityTon ?? ""}
//               onChange={(e) => setField("capacityTon", e.target.value ? parseFloat(e.target.value) : undefined)}
//             />

//             <TextField
//               label="Last Service Date"
//               type="date"
//               fullWidth
//               value={form.lastServiceDate || ""}
//               onChange={(e) => setField("lastServiceDate", e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />

//             <TextField
//               label="Machine Type"
//               select
//               fullWidth
//               value={form.machineType}
//               onChange={(e) => setField("machineType", e.target.value as "Company" | "ThirdParty" | "Estate")}
//             >
//               <MenuItem value="Company">Company</MenuItem>
//               <MenuItem value="ThirdParty">ThirdParty</MenuItem>
//               <MenuItem value="Estate">Estate</MenuItem>
//             </TextField>

//             <TextField
//               label="Machine Location"
//               placeholder="e.g., City, State"
//               fullWidth
//               value={form.machineLocation || ""}
//               onChange={(e) => setField("machineLocation", e.target.value)}
//             />

//             <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
//               <Button variant="text" className="cancel-button" onClick={handleCloseDrawer}>
//                 Cancel
//               </Button>

//               <Button variant="contained" className="edit-button" onClick={handleSave}>
//                 {editingMachine ? "Update Machine" : "Save Machine"}
//               </Button>
//             </Stack>
//           </Stack>
//         </Box>
//       </Drawer>
//     </Stack>
//   );
// };

// export default MachineRegister;














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
// import IconifyIcon from "components/base/IconifyIcon";
// import { useSnackbar } from 'notistack';
// import machineApi from "services/machineApi";

// // Sub Components
// import MachineMain from "pages/components/MachineManage/MachineMain";
// import MachineDrawer from "pages/components/MachineManage/MachineDrawer";

// // Custom CSS
// import "./MachineRegister.css"

// // --- Global Types ---
// export type Vendor = {
//   id: number;
//   vendorName: string;
//   category?: string;
//   phone?: string;
//   email?: string;
//   website?: string;
//   gstNumber?: string;
//   address?: string;
//   location?: string;
//   status?: "Active" | "Inactive";
// };

// export type Machine = {
//   id: number;
//   vendorId: number;
//   machineName: string;
//   password: string;
//   machineMac?: string;
//   machineModel?: string;
//   capacityTon?: number;
//   lastServiceDate?: string;
//   machineType: "Company" | "ThirdParty" | "Estate";
//   machineLocation?: string;
// };

// const MachineRegister: React.FC<{ onLogout?: () => void }> = () => {
//   // --- State ---
//   const [machines, setMachines] = useState<Machine[]>([]);
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [loading, setLoading] = useState(false);

//   // UI State
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

//   // Feedback State
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [machineToDelete, setMachineToDelete] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   const { enqueueSnackbar } = useSnackbar();

//   // --- API / Effect ---
//   const fetchMachine = async () => {
//     setLoading(true);
//     try {
//       const response = await machineApi.getMachineDetails();
//       if (response.success) {
//         // Assuming response.data contains vendors or machines based on your logic
//         // For this example, I'm setting vendors as per your original code
//         setVendors(response.data); 
//         // Note: You might need to fetch 'machines' here too if the API provides them
//         // For now, I'll initialize empty or mock if needed.
//       } else {
//         enqueueSnackbar(response.message || "Failed to register machine", { variant: "error" });
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data.message || "Something error occured please try again later";
//       enqueueSnackbar(errorMessage, { variant: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMachine();
//     // Mock Data for Machines (since original code had initialMachines commented out but used state)
//     setMachines([
//        { id: 1, vendorId: 1, machineName: "Machine A", password: "123", machineType: "Company", capacityTon: 5.5, lastServiceDate: "2024-01-15", machineMac: "AA:BB:CC" },
//        { id: 2, vendorId: 2, machineName: "Machine B", password: "456", machineType: "ThirdParty", capacityTon: 10, lastServiceDate: "2024-06-20", machineMac: "11:22:33" }
//     ]);
//   }, []);

//   // --- Handlers ---
//   const handleOpenAdd = () => {
//     setEditingMachine(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (m: Machine) => {
//     setEditingMachine(m);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingMachine(null);
//   };

//   const handleSave = (form: Machine) => {
//     if (editingMachine) {
//       setMachines((prev) => prev.map((p) => (p.id === editingMachine.id ? { ...form, id: editingMachine.id } : p)));
//       setSnackbarMessage("Machine updated successfully");
//     } else {
//       const newMachine: Machine = { ...form, id: Date.now() };
//       setMachines((prev) => [newMachine, ...prev]);
//       setSnackbarMessage("Machine added successfully");
//     }
//     setSnackbarOpen(true);
//     handleCloseDrawer();
//   };

//   // --- Delete Logic ---
//   const initiateDelete = (id: number) => {
//     setMachineToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (machineToDelete !== null) {
//       setMachines((prev) => prev.filter((v) => v.id !== machineToDelete));
//       setSnackbarMessage("Machine deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setMachineToDelete(null);
//   };

//   return (
//     <div className="vm-root" style={{ padding: '20px' }}>
      
//       {/* 1. Main View */}
//       <MachineMain
//         machines={machines}
//         vendors={vendors}
//         onAdd={handleOpenAdd}
//         onEdit={handleOpenEdit}
//         onDelete={initiateDelete}
//         loading={loading}
//       />

//       {/* 2. Drawer Form */}
//       <MachineDrawer
//         open={drawerOpen}
//         onClose={handleCloseDrawer}
//         onSave={handleSave}
//         initialData={editingMachine}
//         vendors={vendors}
//         loading={loading}
//       />

//       {/* 3. Delete Dialog */}
//       <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
//         <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <Typography textAlign="center" color="text.secondary">
//             Are you sure you want to delete this Machine?
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
//           <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)} color="inherit">
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={confirmDelete} color="error" startIcon={<IconifyIcon icon="wpf:delete" />}>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* 4. Snackbar */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default MachineRegister;











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
import IconifyIcon from "components/base/IconifyIcon";
// import { useSnackbar } from 'notistack';
import machineApi from "services/machineApi";

// --- 1. Add these Imports for Date Picker Fix ---
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Sub Components
import MachineMain from "pages/components/MachineManage/MachineMain";
import MachineDrawer from "pages/components/MachineManage/MachineDrawer";

// Custom CSS
import "../../RegisterManagement/MachineRegister/MachineRegister.css";

// --- Global Types ---
export type Vendor = {
  id: number;
  vendorName: string;
  category?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  location?: string;
  estate?: string;
  status?: "Active" | "Inactive";
};

export type Machine = {
  id: number;
  vendorId: number;
  machineName: string;
  password: string;
  machineMac?: string;
  machineModel: string;
  capacityTon?: number;
  lastServiceDate?: string;
  machineType: "Company" | "ThirdParty" | "Estate";
  machineLocation: string;
};

const MachineRegister: React.FC<{ onLogout?: () => void }> = () => {
  // --- State ---
  const [machines, setMachines] = useState<Machine[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  // UI State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // const { enqueueSnackbar } = useSnackbar();

  // --- API / Effect ---
  const fetchMachine = async () => {
    setLoading(true);
    try {
      const response = await machineApi.getMachineDetails();
      if (response.success) {
        setVendors(response.data); 
      } else {
        setSnackbarMessage(response.message || "Failed to register machine");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Something error occured please try again later";
      setSnackbarMessage(errorMessage);
    } finally {
      setSnackbarOpen(true)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachine();
    // Mock Data
    setMachines([
       { id: 1, vendorId: 1, machineName: "Machine A", 
        password: "123", machineType: "Company", capacityTon: 5.5, machineLocation: "chennai", machineModel: "Model 242",
        lastServiceDate: "2024-01-15", machineMac: "AA:BB:CC" },
       { id: 2, vendorId: 2, machineName: "Machine B", 
        password: "456", machineType: "ThirdParty", capacityTon: 10, machineLocation: "Kerala", machineModel: "Model 242", 
        lastServiceDate: "2024-06-20", machineMac: "11:22:33" },
       { id: 3, vendorId: 1, machineName: "Machine A", 
        password: "123", machineType: "Company", capacityTon: 5.5, machineLocation: "Coimatore", machineModel: "Model 242",
        lastServiceDate: "2024-01-15", machineMac: "AA:BB:CC" },
       { id: 4, vendorId: 2, machineName: "Machine B", 
        password: "456", machineType: "ThirdParty", capacityTon: 10, machineLocation: "local", machineModel: "Model 242",
        lastServiceDate: "2024-06-20", machineMac: "11:22:33" },
        { id: 5, vendorId: 2, machineName: "Machine B", 
        password: "456", machineType: "ThirdParty", capacityTon: 10, machineLocation: "local", machineModel: "Model 242",
        lastServiceDate: "2024-06-20", machineMac: "11:22:33" },
        { id: 6, vendorId: 2, machineName: "Machine B", 
        password: "456", machineType: "ThirdParty", capacityTon: 10, machineLocation: "local", machineModel: "Model 242",
        lastServiceDate: "2024-06-20", machineMac: "11:22:33" },
    ]);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingMachine(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (m: Machine) => {
    setEditingMachine(m);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingMachine(null);
  };

  const handleSave = (form: Machine) => {
    setLoading(true);
    // Simulate API call'
    setTimeout(() => {
        if (editingMachine) {
          setMachines((prev) => prev.map((p) => (p.id === editingMachine.id ? { ...form, id: editingMachine.id } : p)));
          setSnackbarMessage("Machine updated successfully",);
        } else {
          const newMachine: Machine = { ...form, id: Date.now() };
          setMachines((prev) => [newMachine, ...prev]);
          setSnackbarMessage("Machine added successfully");
        }
        setSnackbarOpen(true);
        handleCloseDrawer();
    }, 400);
  };

  // --- Delete Logic ---
  const initiateDelete = (id: number) => {
    setMachineToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (machineToDelete !== null) {
      setMachines((prev) => prev.filter((v) => v.id !== machineToDelete));
      setSnackbarMessage("Machine deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setMachineToDelete(null);
  };

  return (
    // --- 2. Wrap the entire return block in LocalizationProvider ---
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View */}
        <MachineMain
          machines={machines}
          vendors={vendors}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          onRefresh={fetchMachine}
          loading={loading}
        />

        {/* 2. Drawer Form */}
        <MachineDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingMachine}
          vendors={vendors}
          loading={loading}
        />

        {/* 3. Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle >Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              Are you sure you want to delete this Machine?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, gap: 1 }}>
            <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button variant="contained" onClick={confirmDelete} color="error" startIcon={<IconifyIcon icon="wpf:delete" />}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* 4. Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </LocalizationProvider>
  );
};

export default MachineRegister;

