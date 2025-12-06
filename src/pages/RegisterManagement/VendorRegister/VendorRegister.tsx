

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
import { useSnackbar } from 'notistack'
// import vendorApi from "../../../services/vendorApi"
import vendorApi from "../../../services/vendorApi.ts";



//  * Vendor type

type Vendor = {
  id: number;
  vendorName: string;
  phone?: string;
  email?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  location?: string;
  // description?: string;
  status?: "Active" | "Inactive";
};

// const initialVendors: Vendor[] = [
//   {
//     id: 1,
//     vendorName: "TechCorp Industries",
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

// const VendorRegister: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
const VendorRegister: React.FC<{ onLogout?: () => void }> = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

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
  const { enqueueSnackbar } = useSnackbar()

  // Filter State (Filter by Machine)
  const [filterVendorId, setFilterVendorId] = useState<number | "">(""); 


  // ---------------------------------------------------------------------------

  // form state (single object)
  const [form, setForm] = useState<Vendor>({
    id: 0,
    vendorName: "",
    phone: "",
    email: "",
    gstNumber: "",
    address: "",
    location: "",
    // description: "",
    status: "Active",
  });

  const fetchVendor = async ()=>{
    try {
      const response = await vendorApi.getVendordetails()

      if (response.success) {
        setVendors(response.data)
        console.log("response.data :", response.data)
      } else {
        enqueueSnackbar(response.message || "Fained to register vednro", {
          variant: "error",
        })
      }
    } catch (error){
      const errorMessage = error.response?.data.message || "Something error occured please try again later"
      console.log(errorMessage)
      enqueueSnackbar(errorMessage, {variant: "error"})
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchVendor()
  }, []);

  // open drawer for add
  const handleOpenAdd = () => {
    setEditingVendor(null);
    setForm({
      id: 0,
      vendorName: "",
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
  const handleSave = async () => {
    if (!validate()) return;

    if (editingVendor) {
      // update
      // setVendors((prev) => prev.map((p) => (p.id === editingVendor.id ? { ...form, id: editingVendor.id } : p)));
      setSnackbarMessage("Vendor updated successfully");
    } else {
      // add new
      const newVendor: Vendor = { ...form, id: Date.now() };
      // setVendors((prev) => [newVendor, ...prev]);

      console.log("newVendor :", newVendor)
      setSnackbarMessage("Vendor added successfully")
          try {
      const payload = {
        Vendor_name: form.vendorName.trim(),
        Contact_number: form.phone?.trim(),
        Email: form.email?.trim().toLowerCase(),
        Address: form.address?.trim(),
        Gst_number: form.gstNumber?.trim(),
        Status: form.status?.trim(),
      }

      console.log("payload :", payload)

      const response = await vendorApi.addVendor(payload)

      if (response.success) {
        enqueueSnackbar(response.message || "Vendor registered successfully!", {
          variant: "success",
        })
      } else {
        enqueueSnackbar(response.message || "Fained to register vednro", {
          variant: "error",
        })
      }
    } catch (error){
      const errorMessage = error.response?.data.message || "Something error occured please try again later"
      console.log(errorMessage)
      enqueueSnackbar(errorMessage, {variant: "error"})
    } finally {
      setLoading(false)
    }

    }

    setSnackbarOpen(true);
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
      // setVendors((prev) => prev.filter((v) => v.id !== vendorToDelete));
      
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

    // Filter Logic: Combine Text Search + Dropdown Filter
  const filteredVendorfound = vendors.filter((v) => {
    const matchesSearch = {}
    
    const matchesMachine = filterVendorId === "" || v.id === filterVendorId;

    return matchesSearch && matchesMachine;
  });



  return (
    <div className="vm-root">
    <Stack
      bgcolor="background.paper"
      borderRadius={5}
      width={1}
      boxShadow={(theme) => theme.shadows[4]}
      // height={1}
      // marginRight={3}
    >
      {/* <Stack
        direction={{ sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        padding={3.75}
        gap={3.75}
      > */}
      
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
                  <TableCell className="header-name">Location</TableCell>
                  <TableCell className="header-name">Status</TableCell>
                  <TableCell className="header-name">Website</TableCell>
                  <TableCell className="header-name">GST NO</TableCell>
                  <TableCell className="header-name" align="right">Actions</TableCell>
                  {/* <TableCell className="header-name-action" align="right">Actions</TableCell> */}
                {/* </TableRow> */}
              </TableHead>

              <TableBody>
                {vendors.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <Typography variant="subtitle1" className="vm-row-title">
                        {v.Vendor_name}
                      </Typography>
                      <Typography variant="body2" className="vm-description">
                        {/* {v.description || "—"} */}
                      </Typography>
                    </TableCell>

                    <TableCell>{v.Email || "—"}</TableCell>
                    <TableCell>{v.Contact_number || "—"}</TableCell>
                    <TableCell>{v.location || "—"}</TableCell>
                    

                    <TableCell>
                      <span
                        className={`status-badge ${
                          v.Status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {v.Status}
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
                    <TableCell>{v.Gst_number || "—"}</TableCell>
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
                {filteredVendorfound.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} align="center">
                            No Vendor found.
                        </TableCell>
                    </TableRow>
                )}
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

            <Stack spacing={1}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* <TextField
                label="Full Name"
                //  sx={{
                //   "& .MuiInputBase-root": {
                //     backgroundColor: "red",   // 👈 input background only
                //   },
                // }}
                placeholder="Enter contact person’s full name"
                fullWidth
                value={form.vendorName}
                disabled={loading}
                onChange={(e) => setField("vendorName", e.target.value)}
              /> */}

              <TextField
                label="Vendor Name (Business)"
                className="input-bg-color"
                placeholder="Enter business or company name"
                fullWidth
                value={form.vendorName}
                disabled={loading}
                onChange={(e) => setField("vendorName", e.target.value)}
                helperText="Public-facing company / vendor name"
              />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>


              <TextField
                label="Phone"
                className="input-bg-color"
                placeholder="e.g., +91 9876543210"
                fullWidth
                value={form.phone}
                disabled={loading}
                onChange={(e) => setField("phone", e.target.value)}
              />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Email"
                className="input-bg-color"
                placeholder="e.g., vendor@example.com"
                fullWidth
                value={form.email}
                disabled={loading}
                onChange={(e) => setField("email", e.target.value)}
              />

              {/* <TextField
                label="Website"
                placeholder="e.g., https://www.company.com"
                fullWidth
                value={form.website}
                disabled={loading}
                onChange={(e) => setField("website", e.target.value)}
              /> */}
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="GST / Tax Number"
                className="input-bg-color"
                placeholder="Enter GST / tax identification number"
                fullWidth
                value={form.gstNumber}
                disabled={loading}
                onChange={(e) => setField("gstNumber", e.target.value)}
              />

              <TextField
                label="Address"
                className="input-bg-color"
                placeholder="Building, Street, Area, Pincode"
                fullWidth
                value={form.address}
                disabled={loading}
                onChange={(e) => setField("address", e.target.value)}
              />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Location (City / State)"
                  className="input-bg-color"
                  placeholder="e.g., Chennai, Tamil Nadu"
                  fullWidth
                  value={form.location}
                  disabled={loading}
                  onChange={(e) => setField("location", e.target.value)}
                />
                <TextField
                  label="Status"
                  className="input-bg-color"
                  select
                  value={form.status}
                  disabled={loading}
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
    {/* </Stack> */}
    </div>
  );
};

export default VendorRegister;

