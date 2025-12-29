

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

// --- Global Types ---
export type Machine = {
  id: number;
  machineName: string;
};

export type IPCamera = {
  Camera_Id: number;
  Machine_Id: number;
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
    setMachines([
        { id: 1, machineName: "Machine A" },
        { id: 2, machineName: "Machine B" },
        { id: 3, machineName: "Machine C" },
    ]);
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

  // const handleSave = (formData: IPCamera) => {
  //   setLoading(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     if (editingCamera) {
  //       setCameras((prev) => prev.map((c) => (c.Camera_Id === editingCamera.Camera_Id ? { ...formData, Camera_Id: editingCamera.Camera_Id } : c)));
  //       setSnackbarMessage("Camera updated successfully");
  //     } else {
  //       const newCamera: IPCamera = { ...formData, Camera_Id: Date.now() };
  //       setCameras((prev) => [newCamera, ...prev]);
  //       setSnackbarMessage("Camera added successfully");
  //     }
  //     setLoading(false);
  //     setSnackbarOpen(true);
  //     handleCloseDrawer();
  //     }, 400);
  // };

  const handleSave = async () => {
    setLoading(true);
    await fetchCamera();
    setSnackbarMessage( editingCamera? "IPcamera updated successfully": "IPCamera added successfully");
    setSnackbarOpen(true);
    handleCloseDrawer();
  }

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
          machines={machines}
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
          machines={machines}
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