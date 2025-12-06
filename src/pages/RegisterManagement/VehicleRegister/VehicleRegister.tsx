
import React, { useEffect, useState } from "react";
import { ChangeEvent, useMemo } from "react";
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
  InputAdornment,
  TableHead,
  TableRow,
  debounce,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import IconifyIcon from "components/base/IconifyIcon";

import { GridApi, useGridApiRef } from '@mui/x-data-grid';

// Vendor type (for linking)
type Vendor = {
  id: number;
  vendorName: string;
  category?: string;
  phone?: string;
  email: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  location?: string;
  status?: "Active" | "Inactive";
};

// Machine type (for linking)
type Machine = {
  id: number;
  vendorId: number;
  machineName: string;
  password: string;
  machineMac?: string;
  machineModel?: string;
  capacityTon?: number;
  lastServiceDate?: string;
  machineType: "Company" | "ThirdParty" | "Estate";
  machineLocation?: string;
};

// Vehicle type
type Vehicle = {
  id: number;
  vehicleType: string;
  vendorId?: number;
  customerId?: number;
  tareWeight?: number;
  status?: "Active" | "Inactive";
};

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

// const initialVehicles: Vehicle[] = [
//   {
//     id: 1,
//     vehicleType: "Truck",
//     vendorId: 1,
//     customerId: 101,
//     tareWeight: 2500.50,
//     status: "Active",
//   },
//   {
//     id: 2,
//     vehicleType: "Van",
//     vendorId: 2,
//     customerId: 102,
//     tareWeight: 1800.00,
//     status: "Active",
//   },
//   {
//     id: 3,
//     vehicleType: "Lorry",
//     vendorId: 3,
//     customerId: 103,
//     tareWeight: 3200.75,
//     status: "Inactive",
//   },
// ];

const VehicleRegister: React.FC<{ onLogout?: () => void }> = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  
  const [search, setSearch] = useState('');
  const apiRef = useGridApiRef<GridApi>();

     // -- Delete Dialog State --
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);

  // Filter State (Filter by Machine)
  const [filterVehicleId, setFilterVehicleId] = useState<number | "">("");

  // -- Snackbar State --
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // form state (single object)
  const [form, setForm] = useState<Vehicle>({
    id: 0,
    vehicleType: "",
    vendorId: undefined,
    customerId: undefined,
    tareWeight: undefined,
    status: "Active",
  });

  useEffect(() => {
    // Load mock vehicles, vendors and machines on first render
    // setVehicles(initialVehicles);
    // setVendors(initialVendors);
    setVendors([]);
    // setMachines(initialMachines);
    setMachines([]);
  }, []);

  // open drawer for add
  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setForm({
      id: 0,
      vehicleType: "",
      vendorId: undefined,
      customerId: undefined,
      tareWeight: undefined,
      status: "Active",
    });
    setFormError(null);
    setDrawerOpen(true);
  };

  // open drawer for edit
  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({ ...v });
    setFormError(null);
    setDrawerOpen(true);
  };

  // close drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingVehicle(null);
    setFormError(null);
  };

  // validate basic fields
  const validate = (): boolean => {
    if (!form.vehicleType || !form.vehicleType.trim()) {
      setFormError("Vehicle type is required.");
      return false;
    }
    if (form.tareWeight && form.tareWeight < 0) {
      setFormError("Tare weight cannot be negative.");
      return false;
    }
    setFormError(null);
    return true;
  };

  // save vehicle (add or update)
  const handleSave = () => {
    if (!validate()) return;

    if (editingVehicle) {
      // update
      setVehicles((prev) => prev.map((p) => (p.id === editingVehicle.id ? { ...form, id: editingVehicle.id } : p)));
      setSnackbarMessage("Vehicle updated successfully");
    } else {
      // add new
      const newVehicle: Vehicle = { ...form, id: Date.now() };
      setVehicles((prev) => [newVehicle, ...prev]);
      setSnackbarMessage("Vehicle added successfully");
    }
    setSnackbarOpen(true);
    handleCloseDrawer();
  };


   // --- DELETE HANDLERS ---
  
  // 1. Open the Dialog
  const handleClickDelete = (id: number) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 2. Confirm Deletion
  const handleConfirmDelete = () => {
    if (vehicleToDelete !== null) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete));
      
      // Show success message
      setSnackbarMessage("Vehicle deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  // 3. Close Dialog without deleting
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  // --- SNACKBAR HANDLER ---
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // const handleDelete = (id: number) => {
  //   if (!confirm("Are you sure you want to delete this vehicle?")) return;
  //   setVehicles((prev) => prev.filter((v) => v.id !== id));
  // };

  // update form field helper
  const setField = (key: keyof Vehicle, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Get machines filtered by selected vendor
  const getVendorMachines = () => {
    if (!form.vendorId) return [];
    return machines.filter(m => m.vendorId === form.vendorId);
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
  const filteredVehicles = vehicles.filter((vh) => {
    const matchesSearch = {}
    
    const matchesMachine = filterVehicleId === "" || vh.id === filterVehicleId;

    return matchesSearch && matchesMachine;
  });

  return (
    // <Stack
    //   bgcolor="common.white"
    //   borderRadius={5}
    //   minHeight={460}
    //   height={1}
    //   mx="auto"
    //   boxShadow={theme.shadows[4]}
    // >
    <div className="vm-root">
      <Stack
        bgcolor="background.paper"
        borderRadius={5}
        width={1}
        boxShadow={(theme) => theme.shadows[4]}
        // height={1}
      >
        {/* <Stack
          direction={{ sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          padding={3.75}
          gap={3.75}
        > */}

          <main className="vm-content">
              <Box className="vm-header">
              <Typography variant="h4">Vehicle Register</Typography>
              <TextField
                variant="outlined"
                placeholder="Search..."
                id="search-input"
                name="table-search-input"
                onChange={handleChange}
                value={search}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
                      <IconifyIcon icon="mdi:search" width={1} height={1} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                sx={{ maxWidth: 300,
                  // display: "flex",
                  // alignItems: "end"
                }}
              />
              <div className="selection-header-lable">
                <TextField
                variant="outlined"
                // label="Vendor"
                select
                fullWidth
                name="table-search-input"
                value={form.vendorId || ""}
                onChange={(e) => setField("vendorId", e.target.value ? Number(e.target.value) : undefined)}
                // helperText="Select vendor (optional)"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {vendors.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                     {v.vendorName}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="vm-actions">
                  <Button
                  variant="contained"
                  onClick={handleOpenAdd}
                  className="add-vendor-btn"
                  >
                  Add Vehicle
                  </Button>
              </div>
              </Box>

              {/* TABLE VERSION */}
              <TableContainer className="vm-table-container">
              <Table className="vm-table">
                  <TableHead className="vm-table-header">
                  <TableRow className="vm-table-row">
                      <TableCell className="header-name">Vehicle Type</TableCell>
                      <TableCell className="header-name">Vendor</TableCell>
                      <TableCell className="header-name">Customer ID</TableCell>
                      <TableCell className="header-name">Tare Weight (kg)</TableCell>
                      <TableCell className="header-name">Status</TableCell>
                      <TableCell className="header-name">Status</TableCell>
                      {/* <TableCell className="header-name">Available Machines</TableCell> */}
                      <TableCell className="header-name" align="right">Actions</TableCell>
                  </TableRow>
                  </TableHead>

                  <TableBody>
                  {vehicles.map((v) => (
                      <TableRow key={v.id}>
                      <TableCell>
                          <Typography variant="subtitle1" className="vm-row-title">
                          {v.vehicleType}
                          </Typography>
                      </TableCell>

                      <TableCell>
                          {v.vendorId ? vendors.find(vendor => vendor.id === v.vendorId)?.vendorName || "—" : "—"}
                      </TableCell>
                      <TableCell>{v.customerId || "—"}</TableCell>
                      <TableCell>
                          {v.tareWeight ? `${v.tareWeight.toFixed(2)} kg` : "—"}
                      </TableCell>

                      <TableCell>
                          <span
                          className={`status-badge ${
                              v.status === "Active" ? "active" : "inactive"
                          }`}
                          >
                          {v.status}
                          </span>
                      </TableCell>

                      <TableCell>
                          {v.vendorId ? (
                          machines.filter(m => m.vendorId === v.vendorId).length > 0 ? (
                              <Typography variant="body2">
                              {machines.filter(m => m.vendorId === v.vendorId).length} machine(s)
                              </Typography>
                          ) : (
                              "No machines"
                          )
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
                  {filteredVehicles.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={7} align="center">
                              No Vehicle found.
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
                  width: drawerWidth,
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
              <Typography variant="h6">
                  {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </Typography>
              <IconButton onClick={handleCloseDrawer} aria-label="close">
                  <IconifyIcon icon="material-symbols:close-rounded" />
              </IconButton>
              </Box>

              <Box className="drawer-content">
              {formError && <Box className="form-error">{formError}</Box>}

              <Stack spacing={2}>
                  <TextField
                  label="Vehicle Type"
                  placeholder="e.g., Truck, Van, Lorry"
                  className="input-bg-color"
                  fullWidth
                  value={form.vehicleType}
                  onChange={(e) => setField("vehicleType", e.target.value)}
                  helperText="Specify the type of vehicle"
                  />

                  <TextField
                  label="Vendor"
                  className="input-bg-color"
                  select
                  fullWidth
                  value={form.vendorId || ""}
                  onChange={(e) => setField("vendorId", e.target.value ? Number(e.target.value) : undefined)}
                  helperText="Select vendor (optional)"
                  >
                  <MenuItem value="">
                      <em>None</em>
                  </MenuItem>
                  {vendors.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                      {v.vendorName}
                      </MenuItem>
                  ))}
                  </TextField>

                  {form.vendorId && getVendorMachines().length > 0 && (
                  <Box 
                      sx={{ 
                      p: 2, 
                      bgcolor: 'action.hover', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                      }}
                  >
                      <Typography variant="subtitle2" gutterBottom>
                      Available Machines from Selected Vendor:
                      </Typography>
                      {getVendorMachines().map((machine) => (
                      <Typography key={machine.id} variant="body2" sx={{ ml: 1 }}>
                          • {machine.machineName} ({machine.machineType})
                      </Typography>
                      ))}
                  </Box>
                  )}

                  <TextField
                  label="Customer ID"
                  className="input-bg-color"
                  type="number"
                  placeholder="Enter customer ID"
                  fullWidth
                  value={form.customerId ?? ""}
                  onChange={(e) => setField("customerId", e.target.value ? Number(e.target.value) : undefined)}
                  helperText="Optional customer identifier"
                  />

                  <TextField
                  label="Tare Weight (kg)"
                  className="input-bg-color"
                  type="number"
                  placeholder="e.g., 2500.50"
                  fullWidth
                  value={form.tareWeight ?? ""}
                  onChange={(e) => setField("tareWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
                  helperText="Weight in kilograms (optional)"
                  />

                  <TextField
                  label="Status"
                  className="input-bg-color"
                  select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
                  >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>

                  <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
                  <Button 
                      variant="text" 
                      className="cancel-button" 
                      onClick={handleCloseDrawer}
                  >
                      Cancel
                  </Button>

                  <Button 
                      variant="contained" 
                      className="edit-button" 
                      onClick={handleSave}
                  >
                      {editingVehicle ? "Update Vehicle" : "Save Vehicle"}
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
                Are you sure you want to delete this Vehicle?
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
        {/* </Stack> */}
      </Stack>
    </div>
  );
};

export default VehicleRegister;