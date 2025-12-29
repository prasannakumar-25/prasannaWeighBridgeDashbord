
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

// --- Global Types ---
export type Machine = {
  id: number;
  machineName: string;
};

export type Weighbridge = {
  Weighbridge_Id: number;
  Machine_Id?: number;
  machines?: string;
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
        const response = await weighBridgeApi.getWeighbridgeDetails();
        if (response.success) {
          setWeighbridges(response.data)
        } else {
          setSnackbarMessage(response.message || "failed to register Weighbridge")
        }
      } catch (error: any) {
        const errorMessage = error.resposponse?.data.message || "Somthing error occured please try again later";
        setSnackbarMessage(errorMessage);
      } finally {
        setSnackbarOpen(true);
        setLoading(false);
      }
    };
 

  // Load Mock Data
  useEffect(() => {
    setLoading(true);
    fetchWeighbridge();
    setMachines([
      { id: 1, machineName: "Machine A" },
      { id: 2, machineName: "Machine B" },
      { id: 3, machineName: "Machine C" },
    ]); 

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
          
          // setSnackbarMessage("Weighbridge deleted successfully")
          // setSnackbarOpen(true);
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
          machines={machines}
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
          machines={machines}
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

export default WeighbridgeRegister;
