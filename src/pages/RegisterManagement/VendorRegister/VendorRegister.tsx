
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

// import '../MachineRegister/MachineRegister.css'


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




import React, { useState } from "react";
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
  Paper,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";

// import '../MachineRegister/MachineRegister.css'

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
    address: "12 Industrial Estate",
    location: "Mumbai",
    status: "Active",
  },
];

const VendorRegister = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({});

  const handleInputChange = (field: keyof Vendor, value: string) => {
    setNewVendor({ ...newVendor, [field]: value });
  };

  const handleAddVendor = () => {
    if (!newVendor.vendorName) return;

    const vendor: Vendor = {
      id: vendors.length + 1,
      vendorName: newVendor.vendorName || "",
      category: newVendor.category,
      phone: newVendor.phone,
      email: newVendor.email,
      website: newVendor.website,
      gstNumber: newVendor.gstNumber,
      address: newVendor.address,
      location: newVendor.location,
      status: newVendor.status || "Active",
    };

    setVendors([...vendors, vendor]);
    setNewVendor({});
    setDrawerOpen(false);
  };

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Vendor Register
        </Typography>
        <Button
          variant="contained"
          onClick={() => setDrawerOpen(true)}
          startIcon={<IconifyIcon icon="mdi:plus" />}
        >
          Add Vendor
        </Button>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.vendorName}</TableCell>
                <TableCell>{v.category}</TableCell>
                <TableCell>{v.phone}</TableCell>
                <TableCell>{v.email}</TableCell>
                <TableCell>{v.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Drawer Form */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box width={isMobile ? "100vw" : 400} p={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Add Vendor</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <IconifyIcon icon="mdi:close" />
            </IconButton>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Vendor Name"
              value={newVendor.vendorName || ""}
              onChange={(e) => handleInputChange("vendorName", e.target.value)}
              fullWidth
            />
            <TextField
              label="Category"
              value={newVendor.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone"
              value={newVendor.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={newVendor.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Website"
              value={newVendor.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
              fullWidth
            />
            <TextField
              label="GST Number"
              value={newVendor.gstNumber || ""}
              onChange={(e) => handleInputChange("gstNumber", e.target.value)}
              fullWidth
            />
            <TextField
              label="Address"
              value={newVendor.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Location"
              value={newVendor.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={newVendor.status || "Active"}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Stack>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleAddVendor}
          >
            Save Vendor
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default VendorRegister;
