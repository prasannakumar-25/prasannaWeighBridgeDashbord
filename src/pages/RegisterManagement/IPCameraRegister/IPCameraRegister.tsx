

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
import IPCameraMain from "pages/components/IPCameraManage/IPCameraMain";
import IPCameraDrawer from "pages/components/IPCameraManage/IPCameraDrawer";

// Custom CSS (Your existing CSS)
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import IconifyIcon from "components/base/IconifyIcon";
import ipCameraApi from "services/ipCameraApi";
import machineApi from "services/machineApi";

// --- Global Types ---
export type Machine = {
  Machine_Id: number;
  Machine_name: string;
};

export type IPCamera = {
  Camera_Id: number;
  Machine_Id: number;
  Machine_name?: string;
  Camera_name: string;
  IP_address: string;
  RTSP_URL: string;
  HTTP_URL?: string;
  Username: string;
  Password: string;
  Mac_address: string;
  Status: "Online" | "Offline" | "Error";
  Location?: string;
  Installed_date?: string; // Format: YYYY-MM-DD
};

const IPCameraRegister: React.FC = () => {
  // Data State
  const [cameras, setCameras] = useState<IPCamera[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  
  // UI Control State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<IPCamera | null>(null);
  const [loading, setLoading] = useState(false);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  // const { enqueueSnackbar } = useSnackbar();

  // API / effect------------
  const fetchCamera = async () => {
    setLoading(true);
    try{
      const response = await ipCameraApi.getIPcameraDetails();
      if (response.success) {
        setCameras(response.data)
        console.log("Ip camera Data", response.data)
      } else {
        setSnackbarMessage(response.message || "Failed to register IPcamera");
        setSnackbarOpen(true);
      }
      
      // 2. Fetch Vendors (For the dropdown in Drawer)
      const machineRes = await machineApi.getMachineDetails();
      if (machineRes.success) {
        setMachines(machineRes.data);
      } 

    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Somthing error occured try again later";
      setSnackbarMessage(errorMessage)
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };



  // Load Mock Data
  useEffect(() => {
    setLoading(true);
    fetchCamera();
    setLoading(false);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingCamera(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (cam: IPCamera) => {
    setEditingCamera(cam);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingCamera(null);
  };


  const handleSave = async () => {
    setLoading(true);
    await fetchCamera();
    setSnackbarMessage( editingCamera
      ? "IPcamera updated successfully"
      : "IPCamera added successfully");
    setSnackbarOpen(true);
    handleCloseDrawer();
  }

    // const handleSave = (formData: IPCamera) => {
    //   setLoading(true);
    //   setTimeout(() => {
    //     if (editingCamera) {
    //       setCameras((prev) => 
    //         prev.map((ip) => (ip.Machine_Id === editingCamera.Machine_Id ? { ...formData, Machine_Id: editingCamera.Machine_Id } : ip))
    //       );
    //       setSnackbarMessage("IPcamer updated successfully");
    //       setSnackbarOpen(true);
    //     } else {
    //       const selectedVendor = machines.find(v => v.Machine_Id === formData.Machine_Id);
    //       const newCustomer: IPCamera = { 
    //           ...formData, 
    //           Machine_Id: Date.now(),
    //           Machine_name : selectedVendor?.Machine_name 
    //       };
    //       setCameras((prev) => [newCustomer, ...prev]);
    //       setSnackbarMessage("IP Camera added successfully");
    //       setSnackbarOpen(true);
    //     }
    //     setSnackbarOpen(true);
    //     handleCloseDrawer();
    //     setLoading(false);
    //   }, 400);
    // };

  // --- Delete Logic ---
  const initiateDelete = (Camera_Id: number) => {
    setCameraToDelete(Camera_Id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (cameraToDelete !== null) {

      try {
        const response = await ipCameraApi.deleteIPcameraDetails(cameraToDelete);
        if (response.success) {
          setCameras ((prev) => prev.filter((cam) => cam.Camera_Id !== cameraToDelete));
          setSnackbarMessage("Camera deleted successfully");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("failed to delete IP camera")
          setSnackbarOpen(true);
        }
      } catch (error) { 
        console.log(error);

        setSnackbarMessage("Something went wrong while deleting");
        setSnackbarOpen(true);
      }
    }
    setDeleteDialogOpen(false);
    setCameraToDelete(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View (DataGrid & Filters) */}
        <IPCameraMain
          cameras={cameras}
          machineList={machines}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          loading={loading}
          onRefresh={fetchCamera}
        />


        {/* 2. Drawer View (Form) */}
        <IPCameraDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingCamera}
          machineList={machines} // <--- Passing here
          loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this Camera?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-end", pb: 2, gap: 1 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained"
            startIcon={<IconifyIcon icon="wpf:delete"/>}
            >Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Legacy Snackbar */}
        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
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

export default IPCameraRegister;