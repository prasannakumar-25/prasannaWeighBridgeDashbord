
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
  LinearProgress,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import Slide, { SlideProps } from "@mui/material/Slide";

// import { useSnackbar } from 'notistack';

// Sub Components
import VehicleMain from "pages/components/VehicleManage/VehicleMain";
import VehicleDrawer from "pages/components/VehicleManage/VehicleDawer";

import IconifyIcon from "components/base/IconifyIcon";
import vehicletypeApi from "services/vehicletypeApi";

// --- Types ---
export type Vendor = {
  Vendor_Id: number;
  vendorName: string;
};

export type Machine = {
  Customer_Id: number;
  vendorId: number;
  machineName: string;
  machineType: string;
};

export type Vehicle = {
  Vehicle_Id: number;
  Vehicle_type: string;
  Vendor_Id?: number;
  customerId?: number;
  Tare_weight?: number;
  status: "Active" | "Inactive";
  Created_at?: string;
};

const VehicleRegister: React.FC = () => {
  // --- Global Data State ---
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  
  // --- UI Control State ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Feedback State ---
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  // const { enqueueSnackbar } = useSnackbar();


    // API Fetch-----------
  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const response  = await vehicletypeApi.getVehicleDetails();
      console.log("Vehicle API Response:", response);
      if (response.success) {
        setVehicles(response.data);
      } else {
        setSnackbarMessage(response.message || "Failed to fetch vehicle data");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Something error occurred please try again later";
      setSnackbarMessage(errorMessage);
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };



  // Load Data Mock
  useEffect(() => {
    setLoading(true);
    fetchVehicle();
    // setVendors([
    //     { id: 1, vendorName: "TechCorp Industries" },
    //     { id: 2, vendorName: "Global Logistics" }
    // ]);
    // setMachines([
    //     { id: 101, vendorId: 1, machineName: "Machine A", machineType: "Company" }
    // ]);
    setLoading(false);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingVehicle(null);
  };


    const handleSaveVehicle = async () => {
    setLoading(true);
     await fetchVehicle();          // 🔹 refresh list from API
     setSnackbarMessage(
       editingVehicle
         ? "Vehicle updated successfully"
         : "Vehicle added successfully"
     );
     setSnackbarOpen(true);
     handleCloseDrawer();           // 🔹 close drawer
    
  }

  // --- Delete Logic ---
  const initiateDelete = (Vehicle_Id: number) => {
    setVehicleToDelete(Vehicle_Id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    if (vehicleToDelete !== null) {

      try {
        const response = await vehicletypeApi.deleteVehicleDetails(vehicleToDelete);
        console.log("response--------",response)
        if (response.success) {
          setVehicles ((prev) => prev.filter((v) => v.Vehicle_Id !== vehicleToDelete));
          console.log("---show the error----", vehicleToDelete)

          setSnackbarMessage("Vehicle deleted successfully");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("failed to delete Vehicle");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error(error);

        setSnackbarMessage("Something went wrong while deleting");
        setSnackbarOpen(true);
      }
    }
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
    setLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main Table View */}
        <VehicleMain 
            vehicles={vehicles}
            vendors={vendors}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={initiateDelete}
            onRefresh={fetchVehicle}
            loading={loading}
        />
        

        {/* 2. Drawer Form */}
        <VehicleDrawer
            open={drawerOpen}
            onClose={handleCloseDrawer}
            onSave={handleSaveVehicle}
            initialData={editingVehicle}
            vendors={vendors}
            machines={machines}
            loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this Vehicle?</Typography>
            </DialogContent>
            <DialogActions sx={{justifyContent: "flex-end", pb: 2, gap: 1}}>
                <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
                <Button onClick={confirmDelete} color="error" variant="contained"
                startIcon={<IconifyIcon icon = "wpf:delete"/>}
                >Delete</Button>
            </DialogActions> 
        </Dialog>

        {/* 4. Global Snackbar */}
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
                {snackbarMessage}
                 <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                mt: 1,
                height: 4,
                borderRadius: 2,
                bgcolor: '#c8e6c9',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#66bb6a',
                  animation: 'snackbarProgress 3.5s linear forwards',
                },
                '@keyframes snackbarProgress': {
                  to: { width: '100%' },
                  from: { width: '0%' },
                },
              }}
            />
            </Alert>
        </Snackbar>
      </div>
    </LocalizationProvider>
  );
};

export default VehicleRegister;