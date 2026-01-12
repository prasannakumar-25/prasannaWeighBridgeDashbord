
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
import UserMain from "pages/components/UserManage/UserMain";
import UserDrawer from "pages/components/UserManage/UserDrawer";

// Custom CSS (Your existing CSS)
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import IconifyIcon from "components/base/IconifyIcon";
import userApi from "services/userApi";

// --- Global Types ---
export type User = {
  User_Id: number;
  User_name: string; // Used as First Name or generic identifier in your code
  Password: string;
  Full_name: string;
  Email: string;
  Mobile_number: string;
  Role: "Admin" | "Operator" | "Supervisor";
  // status: "Active" | "Inactive";
  Created_at: string;
};

const UserRegister: React.FC = () => {
  // Data State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // UI Control State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
  // Optional local snackbar (fallback)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // const { enqueueSnackbar } = useSnackbar();

  // --- API / Effect ---
  //   const fetchUser = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await userApi.getUserDetails();
  //     if (response.success) {
  //       setUsers(response.data); 
  //     } else {
  //       setSnackbarMessage(response.message || "Failed to register machine");
  //     }
  //   } catch (error: any) {
  //     const errorMessage = error.response?.data.message || "Something error occured please try again later";
  //     setSnackbarMessage(errorMessage);
  //   } finally {
  //     setSnackbarOpen(true)
  //     setLoading(false);
  //   }
  // };


    // --- API / Effect ---
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await userApi.getUserDetails();
        console.log("User Response:", response);
        if (response.success) {
          setUsers(response.data);
        } else {
          setSnackbarMessage(response.message || "failed to fetch users");
        }
      } catch (error: any) {
          const errorMessage = error.response?.data.message || "Something error occured please try again later";
          setSnackbarMessage(errorMessage);
      } finally {
        setSnackbarOpen(true);
        setLoading(false);
      }
    };



  // Load Mock Data
  useEffect(() => {
    setLoading(true);
    fetchUser();
    setLoading(false);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingUser(null);
  };

  const handleSave = (formData: User) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editingUser) {
        setUsers((prev) => prev.map((u) => (u.User_Id === editingUser.User_Id ? { ...formData, User_Id: editingUser.User_Id } : u)));
        setSnackbarMessage("User updated successfully");
      } else {
        const newUser: User = { ...formData, User_Id: Date.now() };
        setUsers((prev) => [newUser, ...prev]);
        setSnackbarMessage("User added successfully");
      }
      setLoading(false);
      setSnackbarOpen(true);
      handleCloseDrawer();
    }, 400);
  };

  // --- Delete Logic ---
  const initiateDelete = (User_Id: number) => {
    setUserToDelete(User_Id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete !== null) {

    try {
      const response = await userApi.daleteUserDateils(userToDelete);

      if (response.success) {
        setUsers((prev) => 
        prev.filter((u) => u.User_Id !== userToDelete)
      );
      setSnackbarMessage("User deleted successfully");
      setSnackbarOpen(true)
      } else {
        setSnackbarMessage("Failed to delete User");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);

      setSnackbarMessage("Something went wrong while deleting");
      setSnackbarOpen(true);
    }
  }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View (DataGrid & Filters) */}
        <UserMain
          users={users}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          onRefresh={fetchUser}
          loading={loading}
        />

        {/* 2. Drawer View (Form) */}
        <UserDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingUser}
          loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this User?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, gap: 1 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
            <Button onClick={confirmDelete} color="error" 
            variant="contained"
            startIcon={<IconifyIcon icon="wpf:delete"/>}
            >
              Delete
              </Button>
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

export default UserRegister;