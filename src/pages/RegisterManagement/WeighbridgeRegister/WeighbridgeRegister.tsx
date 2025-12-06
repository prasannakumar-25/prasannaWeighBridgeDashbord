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

import IconifyIcon from "components/base/IconifyIcon";
import { GridApi, useGridApiRef } from '@mui/x-data-grid';

// --- Types based on your Backend Models ---

// The "Parent" entity for the dropdown (Machine)
type Machine = {
  id: number;
  machineName: string;
  // Other machine fields can exist here, but we mainly need ID and Name for the link
};

// The "Child" entity (Weighbridge)
type Weighbridge = {
  id: number; // Weighbridge_Id
  machineId?: number; // Machine_Id (ForeignKey)
  serialNo: string; // Serial_no
  port: "COM3" | "COM4"; // Port
  baudRate: string; // Baud_rate
  dataBit: number; // Data_bit
  stopBit: number; // Stop_bit
  party: string; // Party (Parity)
  createdAt?: string;
  updatedAt?: string;
};

// --- Mock Data ---

// const initialMachines: Machine[] = [
//   { id: 1, machineName: "Machine A" },
//   { id: 2, machineName: "Machine B" },
//   { id: 3, machineName: "Machine C" },
// ];

// const initialWeighbridges: Weighbridge[] = [
//   {
//     id: 1,
//     machineId: 1,
//     serialNo: "SN-1001-X",
//     port: "COM4",
//     baudRate: "19200",
//     dataBit: 8,
//     stopBit: 1,
//     party: "None",
//   },
//   {
//     id: 2,
//     machineId: 2,
//     serialNo: "SN-2002-Y",
//     port: "COM3",
//     baudRate: "9600",
//     dataBit: 8,
//     stopBit: 2,
//     party: "Even",
//   },
//   {
//     id: 3,
//     machineId: 1,
//     serialNo: "SN-3003-Z",
//     port: "COM4",
//     baudRate: "115200",
//     dataBit: 7,
//     stopBit: 1,
//     party: "Odd",
//   },
// ];

const WeighbridgeRegister: React.FC = () => {
  // State for data
  const [weighbridges, setWeighbridges] = useState<Weighbridge[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]); // Acts like Vendors in previous code
  
  // UI State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Weighbridge | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
 // Filter State (Filter by Machine)
  const [filterMachineId, setFilterMachineId] = useState<number | "">(""); 

  const apiRef = useGridApiRef<GridApi>();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // -- Delete Dialog State --
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  
  // -- Snackbar State --
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Form State
  const [form, setForm] = useState<Weighbridge>({
    id: 0,
    machineId: undefined,
    serialNo: "",
    port: "COM4",
    baudRate: "19200",
    dataBit: 8,
    stopBit: 1,
    party: "None",
  });

  useEffect(() => {
    // Load mock data
    // setWeighbridges(initialWeighbridges);
    // setMachines(initialMachines);
    setMachines([]);
  }, []);

  // --- Handlers ---

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      id: 0,
      machineId: undefined,
      serialNo: "",
      port: "COM4",
      baudRate: "19200",
      dataBit: 8,
      stopBit: 1,
      party: "None",
    });
    setFormError(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (wb: Weighbridge) => {
    setEditingItem(wb);
    setForm({ ...wb });
    setFormError(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingItem(null);
    setFormError(null);
  };

  const validate = (): boolean => {
    if (!form.serialNo || !form.serialNo.trim()) {
      setFormError("Serial Number is required.");
      return false;
    }
    if (!form.machineId) {
      setFormError("Please associate a Machine.");
      return false;
    }
    if (!form.party || !form.party.trim()) {
        setFormError("Party (Parity) is required.");
        return false;
    }
    setFormError(null);
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingItem) {
      // update
      setWeighbridges((prev) => 
        prev.map((item) => (item.id === editingItem.id ? { ...form, id: editingItem.id } : item))
      );
      setSnackbarMessage("Weighbridge updated successfully");
    } else {
      // add new
      const newItem: Weighbridge = { ...form, id: Date.now() };
      setWeighbridges((prev) => [newItem, ...prev]);
      setSnackbarMessage("Weighbridge added successfully");
    }
    setSnackbarOpen(true);
    handleCloseDrawer();
  };

  // --- Delete Handlers ---
  const handleClickDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete !== null) {
      setWeighbridges((prev) => prev.filter((item) => item.id !== itemToDelete));
      setSnackbarMessage("Weighbridge deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const setField = (key: keyof Weighbridge, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

  // Search Logic (Basic client-side filtering)
  const handleGridSearch = useMemo(() => {
    return debounce((searchValue) => {
      apiRef.current.setQuickFilterValues(
        searchValue.split(' ').filter((word: any) => word !== ''),
      );
       // In a real data grid, apiRef would filter. 
       // For this custom table, we use the 'search' state directly in the render.
    }, 250);
  }, [apiRef]);
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.currentTarget.value;
    setSearch(searchValue);
    handleGridSearch(searchValue);
  };

  // Filter Logic: Combine Text Search + Dropdown Filter
  const filteredWeighbridges = weighbridges.filter((wb) => {
    const matchesSearch = 
        wb.serialNo.toLowerCase().includes(search.toLowerCase()) || 
        wb.party.toLowerCase().includes(search.toLowerCase());
    
    const matchesMachine = filterMachineId === "" || wb.machineId === filterMachineId;

    return matchesSearch && matchesMachine;
  });

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
            <Typography variant="h4">Weighbridge Register</Typography>
            
            <TextField
              variant="outlined"
              placeholder="Search Serial No..."
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

            <div className="selection-header-lable">
              <TextField
                select
                variant="outlined"
                fullWidth
                name="table-search-input"
                value={filterMachineId}
                placeholder="Filter Machine..."
                onChange={(e) => setFilterMachineId(e.target.value === "" ? "" : Number(e.target.value))}
                sx={{ maxWidth: 300 }}
              >
                <MenuItem value="">
                  <em>All Machines</em>
                </MenuItem>
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
                Add Weighbridge
              </Button>
            </div>
          </Box>

          {/* TABLE VERSION */}
          <TableContainer className="vm-table-container">
            <Table className="vm-table">
              <TableHead className="vm-table-header">
                <TableRow className="vm-table-row">
                  <TableCell className="header-name">Serial No</TableCell>
                  <TableCell className="header-name">Machine</TableCell>
                  <TableCell className="header-name">Port</TableCell>
                  <TableCell className="header-name">Baud Rate</TableCell>
                  <TableCell className="header-name">Data/Stop</TableCell>
                  <TableCell className="header-name">Party</TableCell>
                  <TableCell className="header-name" align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredWeighbridges.map((wb) => (
                  <TableRow key={wb.id}>
                    <TableCell>
                      <Typography variant="subtitle1" className="vm-row-title">
                        {wb.serialNo}
                      </Typography>
                    </TableCell>

                    <TableCell>
                        {machines.find(m => m.id === wb.machineId)?.machineName || "—"}
                    </TableCell>
                    
                    <TableCell>{wb.port}</TableCell>
                    <TableCell>{wb.baudRate}</TableCell>
                    <TableCell>{`${wb.dataBit} / ${wb.stopBit}`}</TableCell>
                    <TableCell>{wb.party}</TableCell>

                    <TableCell align="right" className="vm-action-cell">
                      <Button
                        onClick={() => handleOpenEdit(wb)}
                        className="vm-btn vm-action-btn-edit"
                      >
                        <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                      </Button>

                      <Button
                        onClick={() => handleClickDelete(wb.id)}
                        className="vm-btn vm-action-btn-delete"
                      >
                        <IconifyIcon icon="wpf:delete" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredWeighbridges.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} align="center">
                            No Weighbridges found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </main>

        {/* Right drawer */}
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
              {editingItem ? "Edit Weighbridge" : "Add New Weighbridge"}
            </Typography>
            <IconButton onClick={handleCloseDrawer} aria-label="close">
              <IconifyIcon icon="material-symbols:close-rounded" />
            </IconButton>
          </Box>

          <Box className="drawer-content">
            {formError && <Box className="form-error">{formError}</Box>}

            <Stack spacing={2}>
              
              {/* Linked Machine */}
              <TextField
                label="Associated Machine"
                className="input-bg-color"
                select
                fullWidth
                value={form.machineId || ""}
                onChange={(e) => setField("machineId", Number(e.target.value))}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {machines.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.machineName}
                  </MenuItem>
                ))}
              </TextField>

              {/* Serial No */}
              <TextField
                label="Serial No"
                className="input-bg-color"
                placeholder="Enter Serial Number"
                fullWidth
                value={form.serialNo}
                onChange={(e) => setField("serialNo", e.target.value)}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                 {/* Port */}
                 <TextField
                    label="Port"
                    className="input-bg-color"
                    select
                    fullWidth
                    value={form.port}
                    onChange={(e) => setField("port", e.target.value)}
                >
                    <MenuItem value="COM3">COM3</MenuItem>
                    <MenuItem value="COM4">COM4</MenuItem>
                </TextField>

                 {/* Baud Rate */}
                 <TextField
                    label="Baud Rate"
                    className="input-bg-color"
                    placeholder="e.g. 19200"
                    fullWidth
                    value={form.baudRate}
                    onChange={(e) => setField("baudRate", e.target.value)}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                 {/* Data Bit */}
                 <TextField
                    label="Data Bit"
                    className="input-bg-color"
                    type="number"
                    fullWidth
                    value={form.dataBit}
                    onChange={(e) => setField("dataBit", Number(e.target.value))}
                />

                 {/* Stop Bit */}
                 <TextField
                    label="Stop Bit"
                    className="input-bg-color"
                    type="number"
                    fullWidth
                    value={form.stopBit}
                    onChange={(e) => setField("stopBit", Number(e.target.value))}
                />
              </Stack>

              {/* Party (Parity) */}
              <TextField
                label="Party (Parity)"
                className="input-bg-color"
                placeholder="e.g. None, Even, Odd"
                fullWidth
                value={form.party}
                onChange={(e) => setField("party", e.target.value)}
              />

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
                  {editingItem ? "Update Weighbridge" : "Save Weighbridge"}
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
          <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography textAlign="center" color="text.secondary">
              Are you sure you want to delete this Weighbridge?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 1 }}>
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

export default WeighbridgeRegister;