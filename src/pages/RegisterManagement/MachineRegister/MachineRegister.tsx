

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
  Vendor_Id: number;
  vendorName: string;
  category?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  location?: string;
  // estate?: string;
  Status?: "";
};

export type Machine = {
  Machine_Id: number;
  vendorId: number;
  Machine_name: string;
  password: string;
  Machine_mac?: string;
  Machine_model: string;
  Capacity_ton?: number;
  Last_service_date?: string;
  Machine_type: "Company" | "ThirdParty" | "Estate";
  Machine_location: string;
  Status: "";
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
      console.log ("Machine data" , response.data)
      if (response.success) {
        setMachines(response.data); 
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
    setLoading(true);
    fetchMachine();
    // Mock Data
    setLoading(false);
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
          setMachines((prev) => prev.map((p) => (p.Machine_Id === editingMachine.Machine_Id ? { ...form, Machine_Id: editingMachine.Machine_Id } : p)));
          setSnackbarMessage("Machine updated successfully",);
        } else {
          const newMachine: Machine = { ...form, Machine_Id: Date.now() };
          setMachines((prev) => [newMachine, ...prev]);
          setSnackbarMessage("Machine added successfully");
        }
        setSnackbarOpen(true);
        handleCloseDrawer();
    }, 400);  
    setLoading(false);
  };

  // --- Delete Logic ---
  const initiateDelete = (Machine_Id: number) => {
    setMachineToDelete(Machine_Id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (machineToDelete !== null) {
      setMachines((prev) => prev.filter((v) => v.Machine_Id !== machineToDelete));
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

