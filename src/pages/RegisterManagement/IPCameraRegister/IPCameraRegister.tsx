
import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
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
  InputAdornment,
  debounce,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  // useStepContext,
} from "@mui/material";

import IconifyIcon from "components/base/IconifyIcon";
import { GridApi, useGridApiRef } from '@mui/x-data-grid';

// --- Types based on your SQLAlchemy Models ---

type Machine = {
  id: number;
  machineName: string;
  // Included minimal fields needed for the dropdown reference
};

type IPCamera = {
  id: number; // Maps to Camera (PK)
  machineId: number; // Maps to Machine_Id (FK)
  cameraName: string;
  ipAddress: string;
  rtspUrl?: string;
  httpUrl?: string;
  username?: string;
  password?: string;
  macAddress?: string;
  model?: string;
  firmwareVersion?: string;
  status: "Online" | "Offline" | "Error";
  location?: string;
  installedDate?: string;
};

// --- Mock Data ---

// const initialMachines: Machine[] = [
//   { id: 1, machineName: "Machine A" },
//   { id: 2, machineName: "Machine B" },
//   { id: 3, machineName: "Machine C" },
// ];

// const initialCameras: IPCamera[] = [
//   {
//     id: 1,
//     machineId: 1,
//     cameraName: "Cam A-Front",
//     ipAddress: "192.168.1.101",
//     rtspUrl: "rtsp://192.168.1.101/live",
//     status: "Online",
//     location: "Entrance Gate",
//     model: "Hikvision v4",
//     installedDate: "2024-01-10",
//   },
//   {
//     id: 2,
//     machineId: 2,
//     cameraName: "Cam B-Internal",
//     ipAddress: "192.168.1.102",
//     status: "Offline",
//     location: "Internal Conveyor",
//     model: "Dahua T3",
//     installedDate: "2024-02-15",
//   },
//   {
//     id: 3,
//     machineId: 1,
//     cameraName: "Cam A-Rear",
//     ipAddress: "192.168.1.103",
//     status: "Error",
//     location: "Rear Exit",
//     installedDate: "2024-03-01",
//   },
// ];

const IPCameraRegister: React.FC = () => {
  // -- Data State --
  const [cameras,  setCameras] = useState<IPCamera[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  
  // -- UI State --
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<IPCamera | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // -- Delete & Feedback State --
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Filter State (Filter by Machine)
  const [filterIPcameraId, setFilterIPcameraId] = useState<number | "">("");

  // --- show password ---
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const apiRef = useGridApiRef<GridApi>();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // -- Form Initial State --
  const [form, setForm] = useState<IPCamera>({
    id: 0,
    machineId: 0,
    cameraName: "",
    ipAddress: "",
    rtspUrl: "",
    httpUrl: "",
    username: "",
    password: "",
    macAddress: "",
    model: "",
    // firmwareVersion: "",
    status: "Offline",
    location: "",
    installedDate: "",
  });

  useEffect(() => {
    // Load mock data
    // setCameras(initialCameras);
    // setMachines(initialMachines);
    setMachines([]);
  }, []);

  // -- Drawer Handlers --

  const handleOpenAdd = () => {
    setEditingCamera(null);
    setForm({
      id: 0,
      machineId: 0,
      cameraName: "",
      ipAddress: "",
      rtspUrl: "",
      httpUrl: "",
      username: "",
      password: "",
      macAddress: "",
      model: "",
      firmwareVersion: "",
      status: "Offline", // Default per model
      location: "",
      installedDate: "",
    });
    setFormError(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (cam: IPCamera) => {
    setEditingCamera(cam);
    setForm({ ...cam });
    setFormError(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingCamera(null);
    setFormError(null);
  };

  // -- Validation & Save --

  const validate = (): boolean => {
    if (!form.cameraName || !form.cameraName.trim()) {
      setFormError("Camera name is required.");
      return false;
    }
    if (!form.ipAddress || !form.ipAddress.trim()) {
      setFormError("IP Address is required.");
      return false;
    }
    if (!form.machineId || form.machineId <= 0) {
      setFormError("Please associate a Machine.");
      return false;
    }
    if (!form.password || form.password.trim()) {
      setFormError("Password is required")
    }
    setFormError(null);
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingCamera) {
      // Update existing
      setCameras((prev) => prev.map((c) => (c.id === editingCamera.id ? { ...form, id: editingCamera.id } : c)));
      setSnackbarMessage("Camera updated successfully");
    } else {
      // Add new
      const newCamera: IPCamera = { ...form, id: Date.now() };
      setCameras((prev) => [newCamera, ...prev]);
      setSnackbarMessage("Camera added successfully");
    }
    setSnackbarOpen(true);
    handleCloseDrawer();
  };

  // -- Delete Handlers --

  const handleClickDelete = (id: number) => {
    setCameraToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (cameraToDelete !== null) {
      setCameras((prev) => prev.filter((c) => c.id !== cameraToDelete));
      setSnackbarMessage("Camera deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setCameraToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCameraToDelete(null);
  };

    // --- SNACKBAR HANDLER ---
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // -- Helper Functions --

  const setField = (key: keyof IPCamera, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGridSearch = useMemo(() => {
    return debounce((searchValue) => {
      apiRef.current.setQuickFilterValues(
        searchValue.split(' ').filter((word: any) => word !== ''),
      );
      // Logic for grid filtering if using DataGrid, 
      // currently just setting state for potential manual filtering
    }, 250);
  }, []);
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.currentTarget.value;
    setSearch(searchValue);
    handleGridSearch(searchValue);
  };

  // Filter cameras based on search and selected filter (optional logic)
  const filteredCameras = cameras.filter((c) => {
    const matchesSearch =
      c.cameraName.toLowerCase().includes(search.toLowerCase()) ||
      c.ipAddress.includes(search)

    const matchesMachine = filterIPcameraId === "" || c.machineId === filterIPcameraId;

    return matchesSearch && matchesMachine;
});

  const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

  // Status Chip Color Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "success";
      case "Offline": return "default";
      case "Error": return "error";
      default: return "default";
    }
  };

  return (
    <div className="vm-root">
      <Stack
        bgcolor="background.paper"
        borderRadius={5}
        width={1}
        boxShadow={(theme) => theme.shadows[4]}
      >
        <main className="vm-content">
          <Box className="vm-header">
            <Typography variant="h4">IP Camera Register</Typography>
            
            <TextField
              variant="outlined"
              placeholder="Search Camera or IP..."
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
              sx={{ maxWidth: 300 }}
            />

            {/* Filter by Machine dropdown (Replaces Vendor dropdown) */}
            <div className="selection-header-lable">
              <TextField
                select
                fullWidth
                variant="outlined"
                name="table-search-input"
                value={form.machineId || ""}
                placeholder="Filter by Machine"
                onChange={(e) => {
                   // This is just UI logic for the filter dropdown in header 
                   // currently tied to form state for demo, but typically would be a separate filter state
                   setField("machineId", Number(e.target.value)); 
                }}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {machines.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.machineName}
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
                Add Camera
              </Button>
            </div>
          </Box>

          {/* TABLE */}
          <TableContainer className="vm-table-container">
            <Table className="vm-table">
              <TableHead className="vm-table-header">
                <TableRow className="vm-table-row">
                  <TableCell className="header-name">Camera Name</TableCell>
                  <TableCell className="header-name">Machine</TableCell>
                  <TableCell className="header-name">IP Address</TableCell>
                  <TableCell className="header-name">Location</TableCell>
                  <TableCell className="header-name">Model</TableCell>
                  <TableCell className="header-name">Status</TableCell>
                  <TableCell className="header-name" align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCameras.map((cam) => (
                  <TableRow key={cam.id}>
                    <TableCell>
                      <Typography variant="subtitle1" className="vm-row-title">
                        {cam.cameraName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {machines.find(m => m.id === cam.machineId)?.machineName || "—"}
                    </TableCell>
                    
                    <TableCell>{cam.ipAddress}</TableCell>
                    <TableCell>{cam.location || "—"}</TableCell>
                    <TableCell>{cam.model || "—"}</TableCell>

                    <TableCell>
                      <Chip 
                        label={cam.status} 
                        color={getStatusColor(cam.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="right" className="vm-action-cell">
                      <Button
                        onClick={() => handleOpenEdit(cam)}
                        className="vm-btn vm-action-btn-edit"
                      >
                        <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                      </Button>

                      <Button
                        onClick={() => handleClickDelete(cam.id)}
                        className="vm-btn vm-action-btn-delete"
                      >
                        <IconifyIcon icon="wpf:delete" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCameras.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} align="center">
                            No IP Camera found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </main>

        {/* --- RIGHT DRAWER (ADD/EDIT) --- */}
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
            <Typography variant="h6">{editingCamera ? "Edit Camera" : "Add New Camera"}</Typography>
            <IconButton onClick={handleCloseDrawer} aria-label="close">
              <IconifyIcon icon="material-symbols:close-rounded" />
            </IconButton>
          </Box>

          <Box className="drawer-content">
            {formError && <Box className="form-error">{formError}</Box>}

            <Stack spacing={2}>
              {/* Basic Info */}
              <TextField
                label="Camera Name"
                className="input-bg-color"
                placeholder="Enter camera name"
                fullWidth
                value={form.cameraName}
                onChange={(e) => setField("cameraName", e.target.value)}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Associated Machine"
                  className="input-bg-color"
                  select
                  fullWidth
                  value={form.machineId}
                  onChange={(e) => setFilterIPcameraId(e.target.value === "" ? "" : Number(e.target.value))}
                >
                  <MenuItem>
                    <em>None</em>
                  </MenuItem>
                  {machines.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.machineName}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Status"
                  className="input-bg-color"
                  select
                  fullWidth
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                  <MenuItem value="Error">Error</MenuItem>
                </TextField>
              </Stack>

              {/* Network Info */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="IP Address"
                  className="input-bg-color"
                  placeholder="e.g., 192.168.1.100"
                  fullWidth
                  value={form.ipAddress}
                  onChange={(e) => setField("ipAddress", e.target.value)}
                />
                 <TextField
                  label="MAC Address"
                  className="input-bg-color"
                  placeholder="e.g., AA:BB:CC:DD:EE:FF"
                  fullWidth
                  value={form.macAddress || ""}
                  onChange={(e) => setField("macAddress", e.target.value)}
                />
              </Stack>

              {/* URLs */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="RTSP URL"
                className="input-bg-color"
                placeholder="rtsp://..."
                fullWidth
                value={form.rtspUrl || ""}
                onChange={(e) => setField("rtspUrl", e.target.value)}
              />
              <TextField
                label="HTTP URL"
                className="input-bg-color"
                placeholder="http://..."
                fullWidth
                value={form.httpUrl || ""}
                onChange={(e) => setField("httpUrl", e.target.value)}
              />
              </Stack>

              {/* Credentials */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Username"
                  className="input-bg-color"
                  placeholder="Enter camera username"
                  fullWidth
                  value={form.username || ""}
                  onChange={(e) => setField("username", e.target.value)}
                  helperText="Optional — username for the camera (if needed)"
                />

                <TextField
                  label="Password"
                  className="input-bg-color"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter camera password"
                  fullWidth
                  value={form.password || ""}
                  onChange={(e) => setField("password", e.target.value)}
                  helperText="Optional — leave blank if the camera has no password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{
                            color: 'text.secondary',
                          }}
                        >
                          {showPassword ? (
                            <IconifyIcon icon="ic:baseline-key-off" />
                          ) : (
                            <IconifyIcon icon="ic:baseline-key" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              {/* Hardware Details */}
              {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
                <TextField
                  label="Model"
                  className="input-bg-color"
                  placeholder="Camera Model"
                  fullWidth
                  value={form.model || ""}
                  onChange={(e) => setField("model", e.target.value)}
                />
                {/* <TextField
                  label="Firmware Version"
                  placeholder="v1.0.0"
                  fullWidth
                  value={form.firmwareVersion || ""}
                  onChange={(e) => setField("firmwareVersion", e.target.value)}
                /> */}
              {/* </Stack> */}

              {/* Location & Date */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Location"
                  className="input-bg-color"
                  placeholder="e.g., Main Entrance"
                  fullWidth
                  value={form.location || ""}
                  onChange={(e) => setField("location", e.target.value)}
                  helperText="Specify where the machine is located. Example: Main Entrance"
                />
                <TextField
                  label="Installed Date"
                  className="input-bg-color"
                  type="date"
                  fullWidth
                  value={form.installedDate || ""}
                  onChange={(e) => setField("installedDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              {/* Buttons */}
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
                  {editingCamera ? "Update Camera" : "Save Camera"}
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
              Are you sure you want to delete this Camera?
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
    </div>
  );
};

export default IPCameraRegister;