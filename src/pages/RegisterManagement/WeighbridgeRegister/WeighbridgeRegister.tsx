
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
// import { useSnackbar } from 'notistack';

// Sub Components
import WeighbridgeMain from "pages/components/WeighbridgeManage/WeighbridgeMain";
import WeighbridgeDrawer from "pages/components/WeighbridgeManage/WeighbridgeDrawer";

// Custom CSS (Your existing CSS)
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import IconifyIcon from "components/base/IconifyIcon";
import weighBridgeApi from "services/weighBridgeApi";
import machineApi from "services/machineApi";

// --- Global Types ---
export type Machine = {
  Machine_Id: number;
  Machine_name: string;
};

export type Weighbridge = {
  Weighbridge_Id: number;
  Machine_Id: number;
  Machine_name?: string;
  Serial_no: string;
  Port: "COM3" | "COM4" | string;
  Baud_rate: string;
  Data_bit: number;
  Stop_bit: number;
  Party: string; // "Parity"
  Created_at?: string;
};

const WeighbridgeRegister: React.FC = () => {
  // Data State
  const [weighbridges, setWeighbridges] = useState<Weighbridge[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(false);

  // UI Control State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Weighbridge | null>(null);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // const { enqueueSnackbar } = useSnackbar();

  // API Effect----------
  // const fetchWeighbridge = async () => {
  //   setLoading(true);
  //   try{
  //     const response = await weighBridgeApi.getWeighbridgeDetails();
  //     if (response.success) {
  //       setWeighbridges(response.data)
  //     } else {
  //       setSnackbarMessage(response.message || "failed to register Weighbridge")
  //     }
  //    } catch (error: any) {
  //       const errorMessage = error.response?.data.message || "Somthing error occured please try again later";
  //       setSnackbarMessage(errorMessage);
  //     } finally {
  //       setSnackbarOpen(true);
  //       setLoading(false);
  //     }
  //   };

    // API Effect----------
    const fetchWeighbridge = async () => {
    setLoading(true);
    try {
      // 1. Fetch Weighbridge Table Data
      const response = await weighBridgeApi.getWeighbridgeDetails();
      if (response.success) {
        // Optional: Ensure no nulls exist to prevent the previous .toLowerCase() error
        const sanitizedData = response.data.map((item: any) => ({
             ...item,
             Serial_no: item.Serial_no || "",
             Party: item.Party || "None", 
        }));
        setWeighbridges(sanitizedData);
      } else {
        setSnackbarMessage(response.message || "Failed to fetch Weighbridges");
        setSnackbarOpen(true);
      }

      // 2. Fetch Machines (For the dropdown list)
      const machineRes = await machineApi.getMachineDetails();
      if (machineRes.success) {
        setMachines(machineRes.data); // <--- CORRECT SETTER
      } 

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again later.";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
 

  // Load Mock Data
  useEffect(() => {
    setLoading(true);
    fetchWeighbridge();
    setLoading(false);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (wb: Weighbridge) => {

    
    setEditingItem(wb);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    setLoading(true);
    await fetchWeighbridge();
    setSnackbarMessage(
      editingItem 
      ? "Weighbridge Updated successfully"
      : "Weighbridge added successfully"
    );
    setSnackbarOpen(true);
    handleCloseDrawer();
    setLoading(false);
  };


    // const handleSave = (formData: Weighbridge) => {
    //   setLoading(true);
    //   setTimeout(() => {
    //     if (editingItem) {
    //       setWeighbridges((prev) => 
    //         prev.map((wb) => (wb.Weighbridge_Id === editingItem.Weighbridge_Id ? { ...formData, Weighbridge_Id: editingItem.Weighbridge_Id } : wb))
    //       );
    //       setSnackbarMessage("Weighbridge updated successfully");
    //     } else {
    //       // If the backend doesn't return the Vendor Name immediately, we might need to find it from the vendors list for display
    //       const selectedVendor = machines.find(wb => wb.Machine_Id === formData.Machine_Id);
    //       const newCustomer: Weighbridge = { 
    //           ...formData, 
    //           Weighbridge_Id: Date.now(),
    //           Machine_name: selectedVendor?.Machine_name 
    //       };
    //       setWeighbridges((prev) => [newCustomer, ...prev]);
    //       setSnackbarMessage("Weighbridge added successfully");
    //     }
    //     setSnackbarOpen(true);
    //     handleCloseDrawer();
    //     setLoading(false);
    //   }, 400);
    // };

  // --- Delete Logic ---
  const initiateDelete = (Weighbridge_Id: number) => {
    setItemToDelete(Weighbridge_Id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    if (itemToDelete !== null) {

      try {
        const response = await weighBridgeApi.deleteWeighbridgeDetails(itemToDelete);
        if (response.success) {
          setWeighbridges ((prev) => prev.filter((wb) => wb.Weighbridge_Id !== itemToDelete));
          setSnackbarMessage("Weighbridge deleted successfully");
          
          // setSnackbarMessage("Weighbridge deleted successfully")
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Failed to delete Weighbridge");
          setSnackbarOpen(true);
        }
      }
      catch (error) {
        console.log(error)

        setSnackbarMessage("Something went wrong while deleting");
        setSnackbarOpen(true);
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View (DataGrid & Filters) */}
        <WeighbridgeMain
          weighbridges={weighbridges}
          machineList={machines}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          loading={loading}
          onRefresh={fetchWeighbridge}
        />

        {/* 2. Drawer View (Form) */}
        <WeighbridgeDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingItem}
          machineList={machines}
          loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this Weighbridge?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex_end", pb: 2, gap: 1 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained"
            startIcon={<IconifyIcon icon="wpf:delete"/>}
            >
              Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Legacy Snackbar */}
        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar> */}
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default WeighbridgeRegister;
