

// import React, { useEffect, useState} from "react";
// import { ChangeEvent, useMemo } from "react";
// import {
//   // Avatar,
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   MenuItem,
//   Stack,
//   // LinearProgress,
//   TextField,
//   Typography,
//   useMediaQuery,
//   useTheme,
//   Table,
//   // Tooltip,
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
// } from "@mui/material";
// import { GridApi, useGridApiRef } from '@mui/x-data-grid';
// import IconifyIcon from "components/base/IconifyIcon";
// import '../MachineRegister/MachineRegister.css'
// import { useSnackbar } from 'notistack'
// import vendorApi from "services/vendorApi";


// //  * Vendor type

// type Vendor = {
//   id: number;
//   vendorName: string;
//   phone?: string;
//   email?: string;
//   website?: string;
//   gstNumber?: string;
//   address?: string;
//   // description?: string;
// };

// // const initialVendors: Vendor[] = [
// //   {
// //     id: 1,
// //     vendorName: "TechCorp Industries",
// //     phone: "9876543210",
// //     email: "tech@corp.com",
// //     website: "https://techcorp.com",
// //     gstNumber: "GST123456",
// //     address: "12 Marine Drive, Mumbai",
// //     location: "Mumbai, Maharashtra",
// //     // description: "Leading hardware supplier with nationwide distribution.",
// //     status: "Active",
// //   },
// //   {
// //     id: 2,
// //     vendorName: "Global Logistics",
// //     phone: "9876543211",
// //     email: "global@log.com",
// //     website: "https://globallog.com",
// //     gstNumber: "GST123457",
// //     address: "45 Industrial Estate, Delhi",
// //     location: "New Delhi, Delhi",
// //     // description: "Freight forwarding & warehousing specialists.",
// //     status: "Active",
// //   },
// //   {
// //     id: 3,
// //     vendorName: "ExpressCargo Solutions",
// //     phone: "9876543212",
// //     email: "express@cargo.com",
// //     website: "https://expresscargo.com",
// //     gstNumber: "GST123458",
// //     address: "99 Tech Park, Bangalore",
// //     location: "Bengaluru, Karnataka",
// //     // description: "Same-day regional shipping & delivery.",
// //     status: "Inactive",
// //   },
// // ];

// // const VendorRegister: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
// const VendorRegister: React.FC<{ onLogout?: () => void }> = () => {
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false)

//   const [search, setSearch] = useState('');
//   const apiRef = useGridApiRef<GridApi>();

//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//    // -- Delete Dialog State --
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);

//   // -- Snackbar State --
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const { enqueueSnackbar } = useSnackbar()

//   // Filter State (Filter by Machine)
//   const [filterVendorId, setFilterVendorId] = useState<number | "">(""); 


//   // ---------------------------------------------------------------------------

//   // form state (single object)
//   const [form, setForm] = useState<Vendor>({
//     id: 0,
//     vendorName: "",
//     phone: "",
//     email: "",
//     gstNumber: "",
//     address: "",
//     website: "",
//     // location: "",
//     // description: "",
//   });

//   const fetchVendor = async ()=>{
//     try {
//       const response = await vendorApi.getVendordetails()
//       console.log("--response---",response)

//       if (response.success) {
//         setVendors(response.data)
//         console.log("response.data :", response.data)
//       } else {
//         enqueueSnackbar(response.message || "Failed to register vendor", {
//           variant: "error",
//         })
//       }
//     } catch (error){
//       const errorMessage = error.response?.data.message || "Something error occured please try again later"
//       console.log(errorMessage)
//       enqueueSnackbar(errorMessage, {variant: "error"})
//     } finally {
//       setLoading(false)
//     }

//   }

//   useEffect(() => {
//     fetchVendor()
//   }, []);

//   // open drawer for add
//   const handleOpenAdd = () => {
//     setEditingVendor(null);
//     setForm({
//       id: 0,
//       vendorName: "",
//       phone: "",
//       email: "",
//       website: "",
//       gstNumber: "",
//       address: "",
//       // description: "",
//     });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   // open drawer for edit
//   const handleOpenEdit = (v: Vendor) => {
//     setEditingVendor(v);
//     setForm({ ...v });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   // close drawer
//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingVendor(null);
//     setFormError(null);
//   };

//   // validate basic fields
//   const validate = (): boolean => {
//     if (!form.vendorName || !form.vendorName.trim()) {
//       setFormError("Vendor name is required.");
//       return false;
//     }
//     if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       setFormError("Please enter a valid email address.");
//       return false;
//     }
//     if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
//       setFormError("Please enter a valid 10-digit phone number.");
//       return false;
//     }
//     setFormError(null);
//     return true;
//   };

//   // save vendor (add or update)
//   const handleSave = async () => {
//     if (!validate()) return;

//     if (editingVendor) {
//       // update
//       // setVendors((prev) => prev.map((p) => (p.id === editingVendor.id ? { ...form, id: editingVendor.id } : p)));
//       setSnackbarMessage("Vendor updated successfully");
//     } else {
//       // add new
//       const newVendor: Vendor = { ...form, id: Date.now() };
//       // setVendors((prev) => [newVendor, ...prev]);

//       console.log("newVendor :", newVendor)
//       setSnackbarMessage("Vendor added successfully")
//     try {
//       const payload = {
//         Vendor_name: form.vendorName.trim(),
//         Contact_number: form.phone?.trim(),
//         Email: form.email?.trim().toLowerCase(),
//         Address: form.address?.trim(),
//         // Location: form.location?.trim(),
//         Gst_number: form.gstNumber?.trim(),
//       }

//       console.log("payload :", payload)

//       const response = await vendorApi.addVendor(payload)

//       if (response.success) {
//         enqueueSnackbar(response.message || "Vendor registered successfully!", {
//           variant: "success",
//         })
//       } else {
//         enqueueSnackbar(response.message || "Fained to register vednro", {
//           variant: "error",
//         })
//       }
//     } catch (error){
//       const errorMessage = error.response?.data.message || "Something error occured please try again later"
//       console.log(errorMessage)
//       enqueueSnackbar(errorMessage, {variant: "error"})
//     } finally {
//       setLoading(false)
//     }
//     }

//     setSnackbarOpen(true);
//     handleCloseDrawer();
//   };
  

//   // --- DELETE HANDLERS ---
  
//   // 1. Open the Dialog
//   const handleClickDelete = (id: number) => {
//     setVendorToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   // 2. Confirm Deletion
//   const handleConfirmDelete = () => {
//     if (vendorToDelete !== null) {
//       // setVendors((prev) => prev.filter((v) => v.id !== vendorToDelete));
      
//       // Show success message
//       setSnackbarMessage("Vendor deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setVendorToDelete(null);
//   };

//   // 3. Close Dialog without deleting
//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setVendorToDelete(null);
//   };

//   // --- SNACKBAR HANDLER ---
//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   // const handleDelete = (id: number) => {
//   //   if (!confirm("Are you sure you want to delete this vendor?")) return;
//   //   setVendors((prev) => prev.filter((v) => v.id !== id));
//   // };

//   // update form field helper
//   const setField = (key: keyof Vendor, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   // drawer width responsive:
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const handleGridSearch = useMemo(() => {
//     return debounce((searchValue) => {
//       apiRef.current.setQuickFilterValues(
//         searchValue.split(' ').filter((word: any) => word !== ''),
//       );
//     }, 250);
//   }, [apiRef]);

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const searchValue = event.currentTarget.value;
//     setSearch(searchValue);
//     handleGridSearch(searchValue);
//   };

//     // Filter Logic: Combine Text Search + Dropdown Filter
//   const filteredVendorfound = vendors.filter((v) => {
//     const matchesSearch = {}
    
//     const matchesMachine = filterVendorId === "" || v.id === filterVendorId;

//     return matchesSearch && matchesMachine;
//   });



//   return (
//     <div className="vm-root">
//     <Stack
//       bgcolor="background.paper"
//       borderRadius={5}
//       width={1}
//       boxShadow={(theme) => theme.shadows[4]}
//       // height={1}
//       // marginRight={3}
//     >
//       {/* <Stack
//         direction={{ sm: 'row' }}
//         justifyContent="space-between"
//         alignItems="center"
//         padding={3.75}
//         gap={3.75}
//       > */}
      
//        {/* <Sidebar />s */}

//         <main className="vm-content">
//           <Box className="vm-header"
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gab: 2
//             }}
//           >
//             <Typography  variant="h4" >Vendor Register</Typography> 
//             <TextField
//             variant="outlined"
//             placeholder="Search..."
//             id="search-input"
//             name="table-search-input"
//             onChange={handleChange}
//             value={search}
//             className="header-search-section"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
//                   <IconifyIcon icon="mdi:search" width={1} height={1} />
//                 </InputAdornment>
//               ),
//             }} 
//             fullWidth
//             sx={{ maxWidth: 330,
//               p: 2,
//               mr: 'auto',
//             }}
//           /> 
//             {/* ✅ Refresh Button */}
//             <IconButton
//                 // onClick={handleRefresh}
//                 disabled={loading}
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
//                 disabled={loading}
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
//                 // startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
//                 onClick={handleOpenAdd}
//                 className="add-vendor-btn"
//               >
//                 Add Vendor
//               </Button>
//             </div>
            
//           </Box>

//           {/* TABLE VERSION */}
//           <TableContainer className="vm-table-container">
//             <Table className="vm-table">
//               <TableHead className="vm-table-header">
//                 {/* <TableRow className="vm-table-row"> */}
//                   <TableCell className="header-name">Vendor Name</TableCell>
//                   <TableCell className="header-name">Email</TableCell>
//                   <TableCell className="header-name">Phone</TableCell>
//                   <TableCell className="header-name">Address</TableCell>
//                   <TableCell className="header-name">GST /Tax Number</TableCell>
//                   <TableCell className="header-name">Website</TableCell>
//                   <TableCell className="header-name" align="right">Actions</TableCell>
//                   {/* <TableCell className="header-name-action" align="right">Actions</TableCell> */}
//                 {/* </TableRow> */}
//               </TableHead>

//               <TableBody>
//                 {vendors.map((v) => (
//                   <TableRow key={v.id}>
//                     <TableCell>
//                       <Typography variant="subtitle1" className="vm-row-title">
//                         {v.Vendor_name}
//                       </Typography>
//                       <Typography variant="body2" className="vm-description">
//                         {/* {v.description || "—"} */}
//                       </Typography>
//                     </TableCell>

//                     <TableCell>{v.Email || "—"}</TableCell>
//                     <TableCell>{v.Contact_number || "—"}</TableCell>
//                     <TableCell>{v.Address || "—"}</TableCell>
//                     <TableCell>{v.Gst_number || "—"}</TableCell>
                    

//                     <TableCell className="vm-row-website">
//                       {v.Website ? (//harshith
//                         <a
//                           href={v.Website}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="vm-table-link"
//                         >
//                           <IconifyIcon icon="material-symbols:open-in-new-rounded" />
//                           &nbsp;Visit
//                         </a>
//                       ) : (
//                         "—"
//                       )}
//                     </TableCell>
//                     {/* <TableCell>{v.Gst_number || "—"}</TableCell> */}
//                     <TableCell align="right" className="vm-action-cell">
//                       <Button
//                         onClick={() => handleOpenEdit(v)}
//                         className="vm-btn vm-action-btn-edit"
//                       >
//                         <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                       </Button>

//                       <Button
//                         onClick={() => handleClickDelete(v.id)}
//                         className="vm-btn vm-action-btn-delete"
//                       >
//                         <IconifyIcon icon="wpf:delete" />
//                       </Button>
//                     </TableCell>

//                   </TableRow>
//                 ))}
//                 {filteredVendorfound.length === 0 && (
//                     <TableRow>
//                         <TableCell colSpan={8} align="center">
//                             No Vendor found.
//                         </TableCell>
//                     </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
          
//         </main>
        


//         {/* Right drawer - slides in from right; full width on small screens */}
//         <Drawer
//           anchor="right"
//           open={drawerOpen}
//           onClose={handleCloseDrawer}
//           PaperProps={{
//             sx: {
//               width: drawerWidth ,
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
//             <Typography variant="h6">{editingVendor ? "Edit Vendor" : "Add New Vendor"}</Typography>
//             <IconButton onClick={handleCloseDrawer} aria-label="close">
//               <IconifyIcon icon="material-symbols:close-rounded" />
//             </IconButton>
//           </Box>

//           <Box className="drawer-content">
//             {formError && <Box className="form-error">{formError}</Box>}

//             <Stack spacing={1}>
//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               {/* <TextField
//                 label="Full Name"
//                 //  sx={{
//                 //   "& .MuiInputBase-root": {
//                 //     backgroundColor: "red",   // 👈 input background only
//                 //   },
//                 // }}
//                 placeholder="Enter contact person’s full name"
//                 fullWidth
//                 value={form.vendorName}
//                 disabled={loading}
//                 onChange={(e) => setField("vendorName", e.target.value)}
//               /> */}

//               <TextField
//                 label="Vendor Name (Business)"
//                 className="input-bg-color"
//                 placeholder="Enter business or company name"
//                 fullWidth
//                 value={form.vendorName}
//                 disabled={loading}
//                 onChange={(e) => setField("vendorName", e.target.value)}
//                 helperText="Public-facing company / vendor name"
//               />
//               </Stack>

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <TextField
//                 label="Email"
//                 className="input-bg-color"
//                 placeholder="e.g., vendor@example.com"
//                 fullWidth
//                 value={form.email}
//                 disabled={loading}
//                 onChange={(e) => setField("email", e.target.value)}
//               />

              
//               </Stack>
//               {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
              
//               <TextField
//                 label="Phone"
//                 className="input-bg-color"
//                 placeholder="e.g., +91 9876543210"
//                 fullWidth
//                 value={form.phone}
//                 disabled={loading}
//                 onChange={(e) => setField("phone", e.target.value)}
//               />
//               <TextField
//                   label="Address (City / State)"
//                   className="input-bg-color"
//                   placeholder="e.g., Chennai, Tamil Nadu"
//                   fullWidth
//                   value={form.address}
//                   disabled={loading}
//                   onChange={(e) => setField("address", e.target.value)}
//                 />

              
//               {/* </Stack> */}

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <TextField
//                 label="GST / Tax Number"
//                 className="input-bg-color"
//                 placeholder="Enter GST / tax identification number"
//                 fullWidth
//                 value={form.gstNumber}
//                 disabled={loading}
//                 onChange={(e) => setField("gstNumber", e.target.value)}
//               />

//               {/* <TextField
//                 label="Address"
//                 className="input-bg-color"
//                 placeholder="Building, Street, Area, Pincode"
//                 fullWidth
//                 value={form.address}
//                 disabled={loading}
//                 onChange={(e) => setField("address", e.target.value)}
//               />*/}
//               </Stack> 

//               {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
                
//                 <TextField
//                   label="Website"
//                   className="input-bg-color"
//                   placeholder="e.g., https://www.company.com"
//                   fullWidth
//                   value={form.website}
//                   disabled={loading}
//                   onChange={(e) => setField("website", e.target.value)}
//                 />
                
//               {/* </Stack> */}

//               <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
//                 <Button variant="text" className="cancel-button" onClick={handleCloseDrawer} 
//                 // startIcon={<IconifyIcon icon="material-symbols:close-rounded" /> }
//                 >
//                   Cancel
//                 </Button>

//                 <Button variant="contained" className="edit-button" onClick={handleSave} 
//                 // startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
//                 >
//                   {editingVendor ? "Update Vendor" : "Save Vendor"}
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
//               Are you sure you want to delete this vendor?
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
//     {/* </Stack> */}
//     </div>
//   );
// };

// export default VendorRegister;








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
import IconifyIcon from "components/base/IconifyIcon";
import { useSnackbar } from 'notistack';
import vendorApi from "services/vendorApi";

// Sub Components
import VendorMain from "pages/components/VendorManage/VendorMain";
import VendorDrawer from "pages/components/VendorManage/VendorDrawer";

// Custom CSS
import "../MachineRegister/MachineRegister.css"; 

// --- Global Types ---
export type Vendor = {
  id: number;
  vendorName: string;
  phone?: string;
  email?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  createdAt?: string; // Added for Date Filtering
};

// Interface for API Raw Response
interface ApiVendor {
  id: number;
  Vendor_name: string;
  Contact_number?: string;
  Email?: string;
  Website?: string;
  Gst_number?: string;
  Address: string;
  Created_at?: string; // Assuming API returns this
}

const VendorRegister: React.FC<{ onLogout?: () => void }> = () => {
  // --- State ---
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  // UI State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  // --- API / Effect ---
  const fetchVendor = async () => {
    setLoading(true);
    try {
      const response = await vendorApi.getVendordetails();
      if (response.success) {
        const mappedData: Vendor[] = response.data.map((v: ApiVendor) => ({
          id: v.id,
          vendorName: v.Vendor_name,
          phone: v.Contact_number,
          email: v.Email,
          website: v.Website,
          gstNumber: v.Gst_number,
          address: v.Address,
          createdAt: v.Created_at || new Date().toISOString(),
        }));
        setVendors(mappedData);
      } else {
        enqueueSnackbar(response.message || "Failed to fetch vendors", { variant: "error" });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Error fetching vendors";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If you are using API, call fetchVendor(). 
    // For Mock display purposes:
    setLoading(true);
    setTimeout(() => {
        setVendors([
            {
                id: 1,
                vendorName: "TechCorp Solutions",
                phone: "9876543210",
                email: "contact@techcorp.com",
                website: "www.techcorp.com",
                gstNumber: "29ABCDE1234F1Z5",
                address: "Bangalore, Karnataka",
                createdAt: "2023-11-01"
            },
            {
                id: 2,
                vendorName: "Global Logistics Ltd",
                phone: "8765432109",
                email: "info@globallogistics.in",
                website: "www.globallogistics.in",
                gstNumber: "27AABBCC1234F1Z5",
                address: "Mumbai, Maharashtra",
                createdAt: "2023-12-15"
            },
            {
                id: 3,
                vendorName: "Sunrise Traders",
                phone: "7654321098",
                email: "sales@sunrisetraders.com",
                website: "",
                gstNumber: "33AABBCC1234F1Z5",
                address: "Chennai, Tamil Nadu",
                createdAt: "2024-01-10"
            }
        ]);
        setLoading(false);
    }, 500);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingVendor(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingVendor(null);
  };

  const handleSave = async (form: Vendor) => {
    setLoading(true);
    try {
      // const payload = {
      //   Vendor_name: form.vendorName.trim(),
      //   Contact_number: form.phone?.trim(),
      //   Email: form.email?.trim().toLowerCase(),
      //   Address: form.address?.trim(),
      //   Gst_number: form.gstNumber?.trim(),
      //   Website: form.website?.trim()
      // };

      if (editingVendor) {
        setVendors((prev) => prev.map((v) => (v.id === editingVendor.id ? { ...form, id: editingVendor.id, createdAt: v.createdAt } : v)));
        setSnackbarMessage("Vendor updated successfully");
        setLoading(false);
      } else {
        // const response = await vendorApi.addVendor(payload);
        // if (response.success) { ... }
        
        // Mock Add
        const newVendor = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
        setVendors(prev => [newVendor, ...prev]);
        setSnackbarMessage("Vendor registered successfully!");
      }
      setSnackbarOpen(true);
      handleCloseDrawer();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data.message || "Error saving vendor", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Logic ---
  const initiateDelete = (id: number) => {
    setVendorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vendorToDelete !== null) {
      setVendors((prev) => prev.filter((v) => v.id !== vendorToDelete));
      setSnackbarMessage("Vendor deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        <VendorMain
          vendors={vendors}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          loading={loading}
          onRefresh={fetchVendor}
        />
        <VendorDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingVendor}
          loading={loading}
        />
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">Are you sure you want to delete this vendor?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-end", pb: 2, gap: 1 }}>
            <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
            <Button variant="contained" onClick={confirmDelete} color="error" startIcon={<IconifyIcon icon="wpf:delete" />}>Delete</Button>
          </DialogActions>
        </Dialog>
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

export default VendorRegister;