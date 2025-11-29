
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

// // import '../MachineRegister/MachineRegister.css'
// import './VendorRegister.css'


// //  * Vendor type

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
//   // description?: string;
//   status?: "Active" | "Inactive";
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
//     // description: "Leading hardware supplier with nationwide distribution.",
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
//     // description: "Freight forwarding & warehousing specialists.",
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
//     // description: "Same-day regional shipping & delivery.",
//     status: "Inactive",
//   },
// ];

// // const VendorRegister: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
// const VendorRegister: React.FC<{ onLogout?: () => void }> = () => {
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);

//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//   // form state (single object)
//   const [form, setForm] = useState<Vendor>({
//     id: 0,
//     vendorName: "",
//     category: "",
//     phone: "",
//     email: "",
//     website: "",
//     gstNumber: "",
//     address: "",
//     location: "",
//     // description: "",
//     status: "Active",
//   });

//   useEffect(() => {
//     // Load mock vendors on first render
//     setVendors(initialVendors);
//   }, []);

//   // open drawer for add
//   const handleOpenAdd = () => {
//     setEditingVendor(null);
//     setForm({
//       id: 0,
//       vendorName: "",
//       category: "",
//       phone: "",
//       email: "",
//       website: "",
//       gstNumber: "",
//       address: "",
//       location: "",
//       // description: "",
//       status: "Active",
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
//   const handleSave = () => {
//     if (!validate()) return;

//     if (editingVendor) {
//       // update
//       setVendors((prev) => prev.map((p) => (p.id === editingVendor.id ? { ...form, id: editingVendor.id } : p)));
//     } else {
//       // add
//       const newVendor: Vendor = { ...form, id: Date.now() };
//       setVendors((prev) => [newVendor, ...prev]);
//     }

//     handleCloseDrawer();
//   };

//   const handleDelete = (id: number) => {
//     if (!confirm("Are you sure you want to delete this vendor?")) return;
//     setVendors((prev) => prev.filter((v) => v.id !== id));
//   };

//   // update form field helper
//   const setField = (key: keyof Vendor, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   // drawer width responsive:
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   return (
//     <Stack
//     className="vm-root"
//     bgcolor="common.white"
//     borderRadius={5}
//     // minHeight={460}
//     // padding={26}
//     // height={1}
//     mx="auto"
//     boxShadow={theme.shadows[4]}
//     >
      
//      {/* <Sidebar />s */}

//       <main className="vm-content">
//         <Box className="vm-header">
//           <Typography variant="h4">Vendor Register</Typography>

//           <div className="vm-actions">
//             <Button
//               variant="contained"
//               // startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
//               onClick={handleOpenAdd}
//               className="add-vendor-btn"
//             >
//               Add Vendor
//             </Button>
//           </div>
//         </Box>

//         {/* TABLE VERSION */}
//         <TableContainer className="vm-table-container">
//           <Table className="vm-table">
//             <TableHead className="vm-table-header">
//               <TableRow className="vm-table-row">
//                 <TableCell>Vendor Name</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Phone</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Location</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Website</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {vendors.map((v) => (
//                 <TableRow key={v.id}>
//                   <TableCell>
//                     <Typography variant="subtitle1" className="vm-row-title">
//                       {v.vendorName}
//                     </Typography>
//                     <Typography variant="body2" className="vm-description">
//                       {/* {v.description || "—"} */}
//                     </Typography>
//                   </TableCell>

//                   <TableCell>{v.email || "—"}</TableCell>
//                   <TableCell>{v.phone || "—"}</TableCell>
//                   <TableCell>{v.category || "—"}</TableCell>
//                   <TableCell>{v.location || "—"}</TableCell>

//                   <TableCell>
//                     <span
//                       className={`status-badge ${
//                         v.status === "Active" ? "active" : "inactive"
//                       }`}
//                     >
//                       {v.status}
//                     </span>
//                   </TableCell>

//                   <TableCell className="vm-row-website">
//                     {v.website ? (
//                       <a
//                         href={v.website}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="vm-table-link"
//                       >
//                         <IconifyIcon icon="material-symbols:open-in-new-rounded" />
//                         &nbsp;Visit
//                       </a>
//                     ) : (
//                       "—"
//                     )}
//                   </TableCell>
//                   <TableCell align="right" className="vm-action-cell">
//                     <Button
//                       onClick={() => handleOpenEdit(v)}
//                       className="vm-btn vm-action-btn-edit"
//                     >
//                       <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                     </Button>

//                     <Button
//                       onClick={() => handleDelete(v.id)}
//                       className="vm-btn vm-action-btn-delete"
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
//           <Typography variant="h6">{editingVendor ? "Edit Vendor" : "Add New Vendor"}</Typography>
//           <IconButton onClick={handleCloseDrawer} aria-label="close">
//             <IconifyIcon icon="material-symbols:close-rounded" />
//           </IconButton>
//         </Box>

//         <Box className="drawer-content">
//           {formError && <Box className="form-error">{formError}</Box>}

//           <Stack spacing={2}>
//             <TextField
//               label="Full Name"
//               placeholder="Enter contact person’s full name"
//               fullWidth
//               value={form.vendorName}
//               onChange={(e) => setField("vendorName", e.target.value)}
//             />

//             <TextField
//               label="Vendor Name (Business)"
//               placeholder="Enter business or company name"
//               fullWidth
//               value={form.vendorName}
//               onChange={(e) => setField("vendorName", e.target.value)}
//               helperText="Public-facing company / vendor name"
//             />

//             <TextField
//               label="Category"
//               placeholder="e.g., Electronics, Printing, Services"
//               fullWidth
//               value={form.category}
//               onChange={(e) => setField("category", e.target.value)}
//             />

//             <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <TextField
//                 label="Phone"
//                 placeholder="e.g., +91 9876543210"
//                 fullWidth
//                 value={form.phone}
//                 onChange={(e) => setField("phone", e.target.value)}
//               />
//               <TextField
//                 label="Email"
//                 placeholder="e.g., vendor@example.com"
//                 fullWidth
//                 value={form.email}
//                 onChange={(e) => setField("email", e.target.value)}
//               />
//             </Stack>

//             <TextField
//               label="Website"
//               placeholder="e.g., https://www.company.com"
//               fullWidth
//               value={form.website}
//               onChange={(e) => setField("website", e.target.value)}
//             />

//             <TextField
//               label="GST / Tax Number"
//               placeholder="Enter GST / tax identification number"
//               fullWidth
//               value={form.gstNumber}
//               onChange={(e) => setField("gstNumber", e.target.value)}
//             />

//             <TextField
//               label="Address"
//               placeholder="Building, Street, Area, Pincode"
//               fullWidth
//               value={form.address}
//               onChange={(e) => setField("address", e.target.value)}
//             />

//             <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//               <TextField
//                 label="Location (City / State)"
//                 placeholder="e.g., Chennai, Tamil Nadu"
//                 fullWidth
//                 value={form.location}
//                 onChange={(e) => setField("location", e.target.value)}
//               />
//               <TextField
//                 label="Status"
//                 select
//                 value={form.status}
//                 onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
//               >
//                 <MenuItem value="Active">Active</MenuItem>
//                 <MenuItem value="Inactive">Inactive</MenuItem>
//               </TextField>
//             </Stack>

//             <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
//               <Button variant="text" className="cancel-button" onClick={handleCloseDrawer} 
//               // startIcon={<IconifyIcon icon="material-symbols:close-rounded" /> }
//               >
//                 Cancel
//               </Button>

//               <Button variant="contained" className="edit-button" onClick={handleSave} 
//               // startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
//               >
//                 {editingVendor ? "Update Vendor" : "Save Vendor"}
//               </Button>
//             </Stack>
//           </Stack>
//         </Box>
//       </Drawer>
//     </Stack>
//   );
// };

// export default VendorRegister;






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
//   Paper,
// } from "@mui/material";

// import IconifyIcon from "components/base/IconifyIcon";
// import "./VendorRegister.css";

// // Vendor type
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

// const initialVendors: Vendor[] = [
//   {
//     id: 1,
//     vendorName: "TechCorp Industries",
//     category: "Electronics",
//     phone: "9876543210",
//     email: "tech@corp.com",
//     website: "https://techcorp.com",
//     gstNumber: "GST123456",
//     address: "12, Industrial Area, Chennai",
//     location: "Chennai",
//     status: "Active",
//   },
// ];

// const VendorRegister = () => {
//   const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [formData, setFormData] = useState<Vendor>({
//     id: 0,
//     vendorName: "",
//     category: "",
//     phone: "",
//     email: "",
//     website: "",
//     gstNumber: "",
//     address: "",
//     location: "",
//     status: "Active",
//   });

//   // Handle change
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Open Add Drawer
//   const handleAddVendor = () => {
//     setEditingVendor(null);
//     setFormData({
//       id: vendors.length + 1,
//       vendorName: "",
//       category: "",
//       phone: "",
//       email: "",
//       website: "",
//       gstNumber: "",
//       address: "",
//       location: "",
//       status: "Active",
//     });
//     setOpenDrawer(true);
//   };

//   // Open Edit Drawer
//   const handleEditVendor = (vendor: Vendor) => {
//     setEditingVendor(vendor);
//     setFormData(vendor);
//     setOpenDrawer(true);
//   };

//   // Save Vendor
//   const handleSaveVendor = () => {
//     if (editingVendor) {
//       setVendors((prev) =>
//         prev.map((v) => (v.id === editingVendor.id ? formData : v))
//       );
//     } else {
//       setVendors((prev) => [...prev, formData]);
//     }
//     setOpenDrawer(false);
//   };

//   return (
//     <Box p={2}>
//       <Stack
//         direction={isMobile ? "column" : "row"}
//         justifyContent="space-between"
//         alignItems={isMobile ? "flex-start" : "center"}
//         spacing={2}
//         mb={3}
//       >
//         <Typography variant="h5" fontWeight={600}>
//           Vendor Register
//         </Typography>

//         <Button
//           variant="contained"
//           startIcon={<IconifyIcon icon="mdi:plus" />}
//           onClick={handleAddVendor}
//           sx={{ width: isMobile ? "100%" : "auto" }}
//         >
//           Add Vendor
//         </Button>
//       </Stack>

//       {/* Table Section */}
//       <TableContainer
//         component={Paper}
//         sx={{
//           borderRadius: 2,
//           overflowX: "auto",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>Vendor Name</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Phone</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>GST No.</TableCell>
//               <TableCell>Location</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="center">Action</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {vendors.map((row) => (
//               <TableRow key={row.id} hover>
//                 <TableCell>{row.vendorName}</TableCell>
//                 <TableCell>{row.category}</TableCell>
//                 <TableCell>{row.phone}</TableCell>
//                 <TableCell>{row.email}</TableCell>
//                 <TableCell>{row.gstNumber}</TableCell>
//                 <TableCell>{row.location}</TableCell>
//                 <TableCell>{row.status}</TableCell>
//                 <TableCell align="center">
//                   <IconButton onClick={() => handleEditVendor(row)}>
//                     <IconifyIcon icon="mdi:pencil" />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Drawer Form */}
//       <Drawer
//         anchor="right"
//         open={openDrawer}
//         onClose={() => setOpenDrawer(false)}
//         PaperProps={{
//           sx: {
//             width: isMobile ? "100%" : 420,
//             p: 3,
//           },
//         }}
//       >
//         <Stack spacing={2}>
//           <Typography variant="h6" fontWeight={600}>
//             {editingVendor ? "Edit Vendor" : "Add Vendor"}
//           </Typography>

//           {/* Form Fields */}
//           <TextField
//             label="Vendor Name"
//             name="vendorName"
//             value={formData.vendorName}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             select
//             label="Category"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             fullWidth
//           >
//             <MenuItem value="Electronics">Electronics</MenuItem>
//             <MenuItem value="Mechanical">Mechanical</MenuItem>
//             <MenuItem value="Services">Services</MenuItem>
//           </TextField>

//           <TextField
//             label="Phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Website"
//             name="website"
//             value={formData.website}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="GST Number"
//             name="gstNumber"
//             value={formData.gstNumber}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Address"
//             name="address"
//             multiline
//             minRows={2}
//             value={formData.address}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             label="Location"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             fullWidth
//           />

//           <TextField
//             select
//             label="Status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             fullWidth
//           >
//             <MenuItem value="Active">Active</MenuItem>
//             <MenuItem value="Inactive">Inactive</MenuItem>
//           </TextField>

//           {/* Buttons */}
//           <Stack direction="row" spacing={2}>
//             <Button
//               variant="contained"
//               fullWidth
//               onClick={handleSaveVendor}
//               sx={{ py: 1.4 }}
//             >
//               Save
//             </Button>

//             <Button
//               variant="outlined"
//               fullWidth
//               onClick={() => setOpenDrawer(false)}
//               sx={{ py: 1.4 }}
//             >
//               Cancel
//             </Button>
//           </Stack>
//         </Stack>
//       </Drawer>
//     </Box>
//   );
// };

// export default VendorRegister;








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
//   Paper,
// } from "@mui/material";

// import IconifyIcon from "components/base/IconifyIcon";
// import "./VendorRegister.css";

// // --------------------------- Vendor Type ---------------------------
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

// // ---------------------- Fake Vendor Data ----------------------
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

// // ---------------------- Component ----------------------
// const VendorRegister: React.FC = () => {
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);

//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//   // Hybrid Default:
//   const [viewMode, setViewMode] = useState<"table" | "card">(
//     isMdUp ? "table" : "card"
//   );

//   const [form, setForm] = useState<Vendor>({
//     id: 0,
//     vendorName: "",
//     category: "",
//     phone: "",
//     email: "",
//     website: "",
//     gstNumber: "",
//     address: "",
//     location: "",
//     status: "Active",
//   });

//   useEffect(() => {
//     setVendors(initialVendors);
//   }, []);

//   // ---------------------- Drawer Open Add ----------------------
//   const handleOpenAdd = () => {
//     setEditingVendor(null);
//     setForm({
//       id: 0,
//       vendorName: "",
//       category: "",
//       phone: "",
//       email: "",
//       website: "",
//       gstNumber: "",
//       address: "",
//       location: "",
//       status: "Active",
//     });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   // ---------------------- Drawer Open Edit ----------------------
//   const handleOpenEdit = (v: Vendor) => {
//     setEditingVendor(v);
//     setForm({ ...v });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingVendor(null);
//   };

//   // ---------------------- Validation ----------------------
//   const validate = () => {
//     if (!form.vendorName.trim()) {
//       setFormError("Vendor name is required.");
//       return false;
//     }
//     if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       setFormError("Invalid email format.");
//       return false;
//     }
//     if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
//       setFormError("Invalid phone number.");
//       return false;
//     }
//     setFormError(null);
//     return true;
//   };

//   // ---------------------- Save Vendor ----------------------
//   const handleSave = () => {
//     if (!validate()) return;

//     if (editingVendor) {
//       setVendors((prev) =>
//         prev.map((p) =>
//           p.id === editingVendor.id ? { ...form, id: editingVendor.id } : p
//         )
//       );
//     } else {
//       const newVendor: Vendor = { ...form, id: Date.now() };
//       setVendors((prev) => [newVendor, ...prev]);
//     }
//     handleCloseDrawer();
//   };

//   const handleDelete = (id: number) => {
//     if (!confirm("Delete this vendor?")) return;
//     setVendors((prev) => prev.filter((v) => v.id !== id));
//   };

//   const setField = (key: keyof Vendor, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <Box className="vendor-page">
//       {/* ------------------ Header ------------------ */}
//       <Box className="vendor-header">
//         <Typography variant="h5" className="vendor-title">
//           Vendor Register
//         </Typography>

//         <Stack direction="row" gap={1}>
//           {/* Toggle Buttons */}
//           <IconButton
//             className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
//             onClick={() => setViewMode("table")}
//           >
//             <IconifyIcon icon="mdi:table" width={22} />
//           </IconButton>

//           <IconButton
//             className={`toggle-btn ${viewMode === "card" ? "active" : ""}`}
//             onClick={() => setViewMode("card")}
//           >
//             <IconifyIcon icon="mdi:view-grid" width={22} />
//           </IconButton>

//           {/* Add Button */}
//           <Button
//             variant="contained"
//             className="add-vendor-btn"
//             onClick={handleOpenAdd}
//           >
//             + Add Vendor
//           </Button>
//         </Stack>
//       </Box>

//       {/* ------------------ TABLE VIEW ------------------ */}
//       {viewMode === "table" && (
//         <TableContainer component={Paper} className="vendor-table-container">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Vendor</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Phone</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {vendors.map((v) => (
//                 <TableRow key={v.id} hover>
//                   <TableCell>{v.vendorName}</TableCell>
//                   <TableCell>{v.category}</TableCell>
//                   <TableCell>{v.email}</TableCell>
//                   <TableCell>{v.phone}</TableCell>
//                   <TableCell>{v.status}</TableCell>
//                   <TableCell align="center">
//                     <IconButton onClick={() => handleOpenEdit(v)}>
//                       <IconifyIcon icon="mdi:pencil" />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(v.id)}>
//                       <IconifyIcon icon="mdi:delete" className="delete-icon" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* ------------------ CARD VIEW ------------------ */}
//       {viewMode === "card" && (
//         <Box className="vendor-card-grid">
//           {vendors.map((v) => (
//             <Box key={v.id} className="vendor-card">
//               <Typography className="vendor-card-title">
//                 {v.vendorName}
//               </Typography>

//               <Box className="vendor-card-field">
//                 <strong>Category:</strong> {v.category}
//               </Box>

//               <Box className="vendor-card-field">
//                 <strong>Email:</strong> {v.email}
//               </Box>

//               <Box className="vendor-card-field">
//                 <strong>Phone:</strong> {v.phone}
//               </Box>

//               <Box className="vendor-card-actions">
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   onClick={() => handleOpenEdit(v)}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   size="small"
//                   color="error"
//                   variant="outlined"
//                   onClick={() => handleDelete(v.id)}
//                 >
//                   Delete
//                 </Button>
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       )}

//       {/* ------------------ Drawer Form ------------------ */}
//       <Drawer
//         anchor="right"
//         open={drawerOpen}
//         onClose={handleCloseDrawer}
//         className="vendor-drawer"
//       >
//         <Box className="drawer-content">
//           <Typography variant="h6" className="drawer-title">
//             {editingVendor ? "Edit Vendor" : "Add Vendor"}
//           </Typography>

//           <Stack spacing={2} mt={3}>
//             <TextField
//               label="Vendor Name"
//               value={form.vendorName}
//               onChange={(e) => setField("vendorName", e.target.value)}
//             />

//             <TextField
//               label="Category"
//               value={form.category}
//               onChange={(e) => setField("category", e.target.value)}
//             />

//             <TextField
//               label="Email"
//               value={form.email}
//               onChange={(e) => setField("email", e.target.value)}
//             />

//             <TextField
//               label="Phone"
//               value={form.phone}
//               onChange={(e) => setField("phone", e.target.value)}
//             />

//             <TextField
//               label="Website"
//               value={form.website}
//               onChange={(e) => setField("website", e.target.value)}
//             />

//             <TextField
//               label="GST No"
//               value={form.gstNumber}
//               onChange={(e) => setField("gstNumber", e.target.value)}
//             />

//             <TextField
//               label="Address"
//               value={form.address}
//               onChange={(e) => setField("address", e.target.value)}
//             />

//             <TextField
//               label="Location"
//               value={form.location}
//               onChange={(e) => setField("location", e.target.value)}
//             />

//             {formError && (
//               <Typography className="form-error">{formError}</Typography>
//             )}

//             <Stack direction="row" gap={2} mt={2}>
//               <Button variant="contained" onClick={handleSave}>
//                 Save
//               </Button>
//               <Button variant="outlined" onClick={handleCloseDrawer}>
//                 Cancel
//               </Button>
//             </Stack>
//           </Stack>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// export default VendorRegister;







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
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import './VendorRegister.css'

type Vendor = {
  id: number;
  vendorName: string;
  category?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  location?: string;
  status?: "Active" | "Inactive";
};

const initialVendors: Vendor[] = [
  {
    id: 1,
    vendorName: "TechCorp Industries",
    category: "Electronics",
    phone: "9876543210",
    email: "tech@corp.com",
    website: "https://techcorp.com",
    gstNumber: "GST123456",
    address: "12 Marine Drive, Mumbai",
    location: "Mumbai, Maharashtra",
    status: "Active",
  },
  {
    id: 2,
    vendorName: "Global Logistics",
    category: "Logistics",
    phone: "9876543211",
    email: "global@log.com",
    website: "https://globallog.com",
    gstNumber: "GST123457",
    address: "45 Industrial Estate, Delhi",
    location: "New Delhi, Delhi",
    status: "Active",
  },
  {
    id: 3,
    vendorName: "ExpressCargo Solutions",
    category: "Transport",
    phone: "9876543212",
    email: "express@cargo.com",
    website: "https://expresscargo.com",
    gstNumber: "GST123458",
    address: "99 Tech Park, Bangalore",
    location: "Bengaluru, Karnataka",
    status: "Inactive",
  },
];

const VendorRegister: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [form, setForm] = useState<Vendor>({
    id: 0,
    vendorName: "",
    category: "",
    phone: "",
    email: "",
    website: "",
    gstNumber: "",
    address: "",
    location: "",
    status: "Active",
  });

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setForm({
      id: 0,
      vendorName: "",
      category: "",
      phone: "",
      email: "",
      website: "",
      gstNumber: "",
      address: "",
      location: "",
      status: "Active",
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setForm(v);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (editingVendor) {
      setVendors(prev =>
        prev.map(item => (item.id === editingVendor.id ? form : item))
      );
    } else {
      setVendors(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setDrawerOpen(false);
  };

  useEffect(() => {
    setViewMode(isMdUp ? "table" : "card");
  }, [isMdUp]);

  return (
    <Box className="vendor-page">
      {/* Header */}
      <Stack className="vendor-header">
        <Typography variant="h5" className="vendor-title">
          Vendor Register
        </Typography>

        <Stack direction="row" gap={1} className="vendor-header-right">
          {/* View toggle buttons */}
          <IconButton
            className={`view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <TableRowsOutlinedIcon />
          </IconButton>

          <IconButton
            className={`view-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
          >
            <GridViewOutlinedIcon />
          </IconButton>

          <Button className="add-btn" onClick={handleOpenAdd}>
            + Add Vendor
          </Button>
        </Stack>
      </Stack>

      {/* Table Mode */}
      {viewMode === "table" && (
        <Paper className="vendor-table-wrapper">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vendors.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.vendorName}</TableCell>
                    <TableCell>{v.category}</TableCell>
                    <TableCell>{v.email}</TableCell>
                    <TableCell>{v.phone}</TableCell>
                    <TableCell>{v.status}</TableCell>
                    <TableCell>
                      <Stack direction="row" gap={1}>
                        <IconButton onClick={() => handleOpenEdit(v)}>
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Card Mode */}
      {viewMode === "card" && (
        <Box className="vendor-card-container">
          {vendors.map(v => (
            <Box className="vendor-card" key={v.id}>
              <Typography className="card-title">{v.vendorName}</Typography>
              <Typography className="card-line">
                <strong>Category:</strong> {v.category}
              </Typography>
              <Typography className="card-line">
                <strong>Email:</strong> {v.email}
              </Typography>
              <Typography className="card-line">
                <strong>Phone:</strong> {v.phone}
              </Typography>

              <Stack direction="row" gap={1} mt={1}>
                <IconButton onClick={() => handleOpenEdit(v)}>
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      {/* Drawer for Add/Edit */}
      <Drawer
        anchor="right"
        className="vendor-drawer"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box className="drawer-content">
          <Typography className="drawer-title">
            {editingVendor ? "Edit Vendor" : "Add Vendor"}
          </Typography>

          <Stack gap={2} mt={2}>
            <TextField
              label="Vendor Name"
              fullWidth
              value={form.vendorName}
              onChange={e =>
                setForm({ ...form, vendorName: e.target.value })
              }
            />

            <TextField
              label="Category"
              fullWidth
              value={form.category}
              onChange={e =>
                setForm({ ...form, category: e.target.value })
              }
            />

            <TextField
              label="Email"
              fullWidth
              value={form.email}
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <TextField
              label="Phone"
              fullWidth
              value={form.phone}
              onChange={e =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </Stack>

          <Button className="save-btn" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default VendorRegister;





// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   IconButton,
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
//   Paper,
// } from "@mui/material";

// import IconifyIcon from "components/base/IconifyIcon";
// import "./VendorRegister.css";

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

// const initialVendors: Vendor[] = [
//   {
//     id: 1,
//     vendorName: "TechCorp Industries",
//     category: "Electronics",
//     phone: "9876543210",
//     email: "tech@corp.com",
//     gstNumber: "GST123456",
//     address: "123 Street",
//     status: "Active",
//   },
//   {
//     id: 2,
//     vendorName: "Global Logistics",
//     category: "Logistics",
//     phone: "9876543211",
//     email: "global@log.com",
//     gstNumber: "GST654321",
//     address: "45 Avenue",
//     status: "Active",
//   },
// ];

// const VendorRegister = () => {
//   const [vendors] = useState(initialVendors);
//   const [viewMode, setViewMode] = useState<"table" | "card">("table");

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   return (
//     <Box className="vendor-page-container">

//       {/* ---------- PAGE HEADER ---------- */}
//       <Box className="vendor-header">
//         <Typography variant="h5" className="vendor-title">
//           Vendor Register
//         </Typography>

//         <Stack direction="row" spacing={1} className="vendor-header-right">
//           {/* View Mode Buttons A (Table) & B (Card) */}
//           <IconButton
//             className={`view-btn ${viewMode === "table" ? "active" : ""}`}
//             onClick={() => setViewMode("table")}
//           >
//             <IconifyIcon icon="mdi:table" width={22} />
//           </IconButton>

//           <IconButton
//             className={`view-btn ${viewMode === "card" ? "active" : ""}`}
//             onClick={() => setViewMode("card")}
//           >
//             <IconifyIcon icon="mdi:view-grid-outline" width={22} />
//           </IconButton>

//           {/* Add Vendor */}
//           <Button
//             variant="contained"
//             className="add-vendor-btn"
//             startIcon={<IconifyIcon icon="mdi:plus" />}
//           >
//             Add Vendor
//           </Button>
//         </Stack>
//       </Box>

//       {/* ---------- TABLE OR CARD VIEW ---------- */}
//       <Box className="vendor-content-wrapper">
//         {/* Auto-switch to card on mobile */}
//         {isMobile || viewMode === "card" ? (
//           <Box className="vendor-card-list">
//             {vendors.map((vendor) => (
//               <Paper className="vendor-card" key={vendor.id}>
//                 <Typography className="vendor-card-title">{vendor.vendorName}</Typography>
//                 <Typography className="vendor-card-sub">
//                   {vendor.category}
//                 </Typography>

//                 <Box className="vendor-card-info">
//                   <span>Email:</span> {vendor.email}
//                 </Box>
//                 <Box className="vendor-card-info">
//                   <span>Phone:</span> {vendor.phone}
//                 </Box>

//                 <Box className="vendor-card-footer">
//                   <span
//                     className={`status-pill ${vendor.status?.toLowerCase()}`}
//                   >
//                     {vendor.status}
//                   </span>

//                   <Stack direction="row" spacing={1}>
//                     <IconButton className="action-icon">
//                       <IconifyIcon icon="mdi:pencil-outline" />
//                     </IconButton>
//                     <IconButton className="action-icon">
//                       <IconifyIcon icon="mdi:delete-outline" />
//                     </IconButton>
//                   </Stack>
//                 </Box>
//               </Paper>
//             ))}
//           </Box>
//         ) : (
//           <TableContainer component={Paper} className="vendor-table-container">
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Vendor</TableCell>
//                   <TableCell>Category</TableCell>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Phone</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {vendors.map((vendor) => (
//                   <TableRow key={vendor.id}>
//                     <TableCell>{vendor.vendorName}</TableCell>
//                     <TableCell>{vendor.category}</TableCell>
//                     <TableCell>{vendor.email}</TableCell>
//                     <TableCell>{vendor.phone}</TableCell>
//                     <TableCell>
//                       <span
//                         className={`status-pill ${vendor.status?.toLowerCase()}`}
//                       >
//                         {vendor.status}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <Stack direction="row" spacing={1}>
//                         <IconButton className="action-icon">
//                           <IconifyIcon icon="mdi:pencil-outline" />
//                         </IconButton>
//                         <IconButton className="action-icon">
//                           <IconifyIcon icon="mdi:delete-outline" />
//                         </IconButton>
//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>

//     </Box>
//   );
// };

// export default VendorRegister;
