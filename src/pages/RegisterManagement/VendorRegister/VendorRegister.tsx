

// import { ChangeEvent, ReactElement, useMemo, useState, useEffect } from 'react';
// import {
//   Avatar,
//   Divider,
//   InputAdornment,
//   LinearProgress,
//   Link,
//   Stack,
//   TextField,
//   Tooltip, 
//   Typography,
//   debounce,
//   Box,
//   Button,
//   // Drawer,
//   // IconButton,
//   // MenuItem,
//   useMediaQuery,
//   useTheme,
//   // Table,
//   // TableBody,
//   // TableCell,
//   // TableContainer,
//   // TableHead,
//   // TableRow,
// } from '@mui/material';
// import { DataGrid, GridApi, GridColDef, GridSlots, useGridApiRef } from '@mui/x-data-grid';
// import IconifyIcon from 'components/base/IconifyIcon';
// import { DataRow, rows } from 'data/products';
// // import CustomPagination from './CustomPagination';
// import CustomPagination from 'components/sections/dashboard/Home/Sales/TopSellingProduct/CustomPagination';
// import { currencyFormat } from 'helpers/format-functions';

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


// const columns: GridColDef<DataRow>[] = [
  
  
//   {
//     field: 'id',
//     headerName: 'ID',
//   },
//   {
//     field: 'product',
//     headerName: 'Product',
//     flex: 1,
//     minWidth: 182.9625,
//     valueGetter: (params: any) => {
//       return params.title + ' ' + params.subtitle;
//     },
//     renderCell: (params: any) => {
//       return (
//         <Stack direction="row" spacing={1.5} alignItems="center" component={Link} href="#!">
//           <Tooltip title={params.row.product.title} placement="top" arrow>
//             <Avatar src={params.row.product.avatar} sx={{ objectFit: 'cover' }} />
//           </Tooltip>
//           <Stack direction="column" spacing={0.5} justifyContent="space-between">
//             <Typography variant="body1" color="text.primary">
//               {params.row.product.title}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {params.row.product.subtitle}
//             </Typography>
//           </Stack>
//         </Stack>
//       );
//     },
//     sortComparator: (v1: string, v2: string) => v1.localeCompare(v2),
//   },
//   {
//     field: 'orders',
//     headerName: 'Orders',
//     flex: 0.75,
//     minWidth: 137.221875,
//   },
//   {
//     field: 'price',
//     headerName: 'Price',
//     flex: 0.75,
//     minWidth: 137.221875,
//     valueGetter: (params: any) => {
//       return currencyFormat(params);
//     },
//   },
//   {
//     field: 'adsSpent',
//     headerName: 'Ads Spent',
//     flex: 0.75,
//     minWidth: 137.221875,
//     valueGetter: (params: any) => {
//       return currencyFormat(params, { minimumFractionDigits: 3 });
//     },
//   },
//   {
//     field: 'refunds',
//     headerName: 'Refunds',
//     flex: 0.75,
//     minWidth: 137.221875,
//     renderCell: ({ row: { refunds } }: any) => {
//       if (refunds > 0) return `> ${refunds}`;
//       else return `< ${-refunds}`;
//     },
//     filterable: false,
//   },
// ];

// const TopSellingProduct = (): ReactElement => {
//   const apiRef = useGridApiRef<GridApi>();
//   const [search, setSearch] = useState('');

//   const visibleColumns = useMemo(
//     () =>
//       columns
//         .filter((column) => column.field !== 'id')
//         .map((column) => {
//           if (column.field === 'refunds') {
//             return {
//               ...column,
//               getApplyQuickFilterFn: undefined,
//               filterable: false,
//             };
//           }
//           return column;
//         }),
//     [columns],
//   );

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

//   useEffect(() => {
//     // Load mock vendors on first render
//     setVendors(initialVendors);
//   }, []);

//   return (
//     <Stack
//       bgcolor="background.paper"
//       className='main-first-container'
//       borderRadius={5}
//       width={1}
//       boxShadow={(theme) => theme.shadows[4]}
//       // height={1}
//       sx={{
//         padding: "30px"
//       }}
//     >
//       <Stack
//         className='container-head'
//         direction={{ sm: 'row' }}
//         justifyContent="space-between"
//         alignItems="center"
//         padding={2.75}
//         gap={3.75}
//       >
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
//         {/* <Typography className='header-title-content' variant="h5" color="text.primary">
//           Top Selling Product
//         </Typography> */}
//         <TextField
//           variant="filled"
//           className='header-search-section'
//           placeholder="Search..."
//           id="search-input"
//           name="table-search-input"
//           onChange={handleChange}
//           value={search}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
//                 <IconifyIcon icon="mdi:search" width={1} height={1} />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Stack>
//       <Divider />
//       <Stack height={1}>
//         <DataGrid
//           apiRef={apiRef}
//           columns={visibleColumns}
//           rows={rows}
//           getRowHeight={() => 70}
//           hideFooterSelectedRowCount
//           disableColumnResize
//           disableColumnSelector
//           disableRowSelectionOnClick
//           rowSelection={false}
//           initialState={{
//             pagination: { paginationModel: { pageSize: 5, page: 0 } },
//             columns: {
//               columnVisibilityModel: {
//                 id: false,
//               },
//             },
//           }}
//           pageSizeOptions={[5]}
//           onResize={() => {
//             apiRef.current.autosizeColumns({
//               includeOutliers: true,
//               expand: true,
//             });
//           }}
//           slots={{
//             loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
//             pagination: CustomPagination,
//             noRowsOverlay: () => <section>No rows available</section>,
//           }}
//           sx={{
//             height: 1,
//             width: 1,
//           }}
//         />
//       </Stack>
//     </Stack>
//   );
// };

// export default VendorRegister;
// // export default TopSellingProduct;














import React, { useEffect, useState} from "react";
import { ChangeEvent, useMemo } from "react";
import {
  // Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  // LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Table,
  // Tooltip,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  debounce,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { GridApi, useGridApiRef } from '@mui/x-data-grid';
import IconifyIcon from "components/base/IconifyIcon";

import '../MachineRegister/MachineRegister.css'


//  * Vendor type

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
  // description?: string;
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
    // description: "Leading hardware supplier with nationwide distribution.",
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
    // description: "Freight forwarding & warehousing specialists.",
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
    // description: "Same-day regional shipping & delivery.",
    status: "Inactive",
  },
];

// const VendorRegister: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
const VendorRegister: React.FC<{ onLogout?: () => void }> = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const apiRef = useGridApiRef<GridApi>();

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

   // -- Delete Dialog State --
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);

  // -- Snackbar State --
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  // ---------------------------------------------------------------------------

  // form state (single object)
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
    // description: "",
    status: "Active",
  });

  useEffect(() => {
    // Load mock vendors on first render
    setVendors(initialVendors);
  }, []);

  // open drawer for add
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
      // description: "",
      status: "Active",
    });
    setFormError(null);
    setDrawerOpen(true);
  };

  // open drawer for edit
  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setForm({ ...v });
    setFormError(null);
    setDrawerOpen(true);
  };

  // close drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingVendor(null);
    setFormError(null);
  };

  // validate basic fields
  const validate = (): boolean => {
    if (!form.vendorName || !form.vendorName.trim()) {
      setFormError("Vendor name is required.");
      return false;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
      setFormError("Please enter a valid 10-digit phone number.");
      return false;
    }
    setFormError(null);
    return true;
  };

  // save vendor (add or update)
  const handleSave = () => {
    if (!validate()) return;

    if (editingVendor) {
      // update
      setVendors((prev) => prev.map((p) => (p.id === editingVendor.id ? { ...form, id: editingVendor.id } : p)));
    } else {
      // add
      const newVendor: Vendor = { ...form, id: Date.now() };
      setVendors((prev) => [newVendor, ...prev]);
    }

    handleCloseDrawer();
  };


  // --- DELETE HANDLERS ---
  
  // 1. Open the Dialog
  const handleClickDelete = (id: number) => {
    setVendorToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 2. Confirm Deletion
  const handleConfirmDelete = () => {
    if (vendorToDelete !== null) {
      setVendors((prev) => prev.filter((v) => v.id !== vendorToDelete));
      
      // Show success message
      setSnackbarMessage("Vendor deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  // 3. Close Dialog without deleting
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  // --- SNACKBAR HANDLER ---
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // const handleDelete = (id: number) => {
  //   if (!confirm("Are you sure you want to delete this vendor?")) return;
  //   setVendors((prev) => prev.filter((v) => v.id !== id));
  // };

  // update form field helper
  const setField = (key: keyof Vendor, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // drawer width responsive:
  const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

  const handleGridSearch = useMemo(() => {
    return debounce((searchValue) => {
      apiRef.current.setQuickFilterValues(
        searchValue.split(' ').filter((word: any) => word !== ''),
      );
    }, 250);
  }, [apiRef]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.currentTarget.value;
    setSearch(searchValue);
    handleGridSearch(searchValue);
  };


  return (
    <Stack
      bgcolor="background.paper"
      borderRadius={5}
      width={1}
      boxShadow={(theme) => theme.shadows[4]}
      height={1}
    >
      <Stack
        direction={{ sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        padding={3.75}
        gap={3.75}
      >
      
       {/* <Sidebar />s */}

        <main className="vm-content">
          <Box className="vm-header">
            <Typography className="header-content-h4" variant="h4">Vendor Register</Typography>

            
            <TextField
            variant="outlined"
            placeholder="Search..."
            id="search-input"
            name="table-search-input"
            onChange={handleChange}
            value={search}
            className="header-search-section"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
                  <IconifyIcon icon="mdi:search" width={1} height={1} />
                </InputAdornment>
              ),
            }} 
            fullWidth
            sx={{ maxWidth: 330}}
          /> 

            <div className="vm-actions">
              <Button
                variant="contained"
                // startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
                onClick={handleOpenAdd}
                className="add-vendor-btn"
              >
                Add Vendor
              </Button>
            </div>
          </Box>

          {/* TABLE VERSION */}
          <TableContainer className="vm-table-container">
            <Table className="vm-table">
              <TableHead className="vm-table-header">
                {/* <TableRow className="vm-table-row"> */}
                  <TableCell className="header-name">Vendor Name</TableCell>
                  <TableCell className="header-name">Email</TableCell>
                  <TableCell className="header-name">Phone</TableCell>
                  <TableCell className="header-name">Category</TableCell>
                  <TableCell className="header-name">Location</TableCell>
                  <TableCell className="header-name">Status</TableCell>
                  <TableCell className="header-name">Website</TableCell>
                  <TableCell className="header-name" align="right">Actions</TableCell>
                {/* </TableRow> */}
              </TableHead>

              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <Typography variant="subtitle1" className="vm-row-title">
                        {v.vendorName}
                      </Typography>
                      <Typography variant="body2" className="vm-description">
                        {/* {v.description || "—"} */}
                      </Typography>
                    </TableCell>

                    <TableCell>{v.email || "—"}</TableCell>
                    <TableCell>{v.phone || "—"}</TableCell>
                    <TableCell>{v.category || "—"}</TableCell>
                    <TableCell>{v.location || "—"}</TableCell>

                    <TableCell>
                      <span
                        className={`status-badge ${
                          v.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {v.status}
                      </span>
                    </TableCell>

                    <TableCell className="vm-row-website">
                      {v.website ? (
                        <a
                          href={v.website}
                          target="_blank"
                          rel="noreferrer"
                          className="vm-table-link"
                        >
                          <IconifyIcon icon="material-symbols:open-in-new-rounded" />
                          &nbsp;Visit
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="right" className="vm-action-cell">
                      <Button
                        onClick={() => handleOpenEdit(v)}
                        className="vm-btn vm-action-btn-edit"
                      >
                        <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                      </Button>

                      <Button
                        onClick={() => handleClickDelete(v.id)}
                        className="vm-btn vm-action-btn-delete"
                      >
                        <IconifyIcon icon="wpf:delete" />
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
        </main>
        


        {/* Right drawer - slides in from right; full width on small screens */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            sx: {
              width: drawerWidth ,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px",
              maxWidth: "100%",
              borderTopLeftRadius: { xs: 0, md: 12 },
              borderBottomLeftRadius: { xs: 0, md: 12 },
              height: { xs: "100vh", md: "100vh" },
            },
          }}
          ModalProps={{ keepMounted: true }}
        >
          <Box className="drawer-header">
            <Typography variant="h6">{editingVendor ? "Edit Vendor" : "Add New Vendor"}</Typography>
            <IconButton onClick={handleCloseDrawer} aria-label="close">
              <IconifyIcon icon="material-symbols:close-rounded" />
            </IconButton>
          </Box>

          <Box className="drawer-content">
            {formError && <Box className="form-error">{formError}</Box>}

            <Stack spacing={2}>
              <TextField
                label="Full Name"
                placeholder="Enter contact person’s full name"
                fullWidth
                value={form.vendorName}
                onChange={(e) => setField("vendorName", e.target.value)}
              />

              <TextField
                label="Vendor Name (Business)"
                placeholder="Enter business or company name"
                fullWidth
                value={form.vendorName}
                onChange={(e) => setField("vendorName", e.target.value)}
                helperText="Public-facing company / vendor name"
              />

              <TextField
                label="Category"
                placeholder="e.g., Electronics, Printing, Services"
                fullWidth
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Phone"
                  placeholder="e.g., +91 9876543210"
                  fullWidth
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
                <TextField
                  label="Email"
                  placeholder="e.g., vendor@example.com"
                  fullWidth
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </Stack>

              <TextField
                label="Website"
                placeholder="e.g., https://www.company.com"
                fullWidth
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
              />

              <TextField
                label="GST / Tax Number"
                placeholder="Enter GST / tax identification number"
                fullWidth
                value={form.gstNumber}
                onChange={(e) => setField("gstNumber", e.target.value)}
              />

              <TextField
                label="Address"
                placeholder="Building, Street, Area, Pincode"
                fullWidth
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Location (City / State)"
                  placeholder="e.g., Chennai, Tamil Nadu"
                  fullWidth
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                />
                <TextField
                  label="Status"
                  select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
                <Button variant="text" className="cancel-button" onClick={handleCloseDrawer} 
                // startIcon={<IconifyIcon icon="material-symbols:close-rounded" /> }
                >
                  Cancel
                </Button>

                <Button variant="contained" className="edit-button" onClick={handleSave} 
                // startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
                >
                  {editingVendor ? "Update Vendor" : "Save Vendor"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Drawer>
        {/* --- DELETE CONFIRMATION DIALOG --- */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography textAlign="center" color="text.secondary">
              Are you sure you want to delete this vendor?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={handleCancelDelete}
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleConfirmDelete}
              color="error"
              startIcon={<IconifyIcon icon="wpf:delete" />}
            >
              Delete
            </Button>
          </DialogActions> 
        </Dialog>
  
        {/* --- SUCCESS SNACKBAR --- */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
};

export default VendorRegister;

