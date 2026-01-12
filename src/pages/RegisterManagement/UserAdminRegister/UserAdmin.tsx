import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Alert,
  LinearProgress
} from "@mui/material";

// --- Imports for Date Picker context ---
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Sub Components
import UserAdminMain from "pages/components/UserAdminManage/UserAdminMain";
import UserAdminDrawer from "pages/components/UserAdminManage/UserAdminDrewer";

// Services
import vendorApi from "services/vendorApi";

// CSS (Reusing your existing CSS for consistency)
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import authApi from "services/authApi";

// --- Global Types based on your Python Model ---
// export type Vendor = {
//   Vendor_Id: number;
//   Vendor_name?: string;
// };

export type SuperAdminUser = {
  Super_ID: number;
  User_name: string;
  Shortname: string;
  Password?: string; // Optional in frontend listing, required in form
  Role: string;
  Vendor_Id: number;
  Vendor_name?: string; // Optional: if backend joins it, otherwise we map it
  Created_On?: string;
  IsActive: number;
};

const UserAdminRegister: React.FC = () => {
  // --- State ---
  const [users, setUsers] = useState<SuperAdminUser[]>([]);
//   const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  // UI State
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Feedback State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- API Fetching ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const response = await authApi.getauthuser()
      console.log(" Admin Data ", response.data)
      if (response.success) {
        setUsers(response.data);
      } else {
        setSnackbarMessage(response.message || "Failed to fetch users");
        setSnackbarOpen(true);
      }

      // 2. Fetch Vendors (for the Drawer dropdown and DataGrid mapping)
      const vendorRes = await vendorApi.getVendordetails();
      if (vendorRes.success) {
        // setVendors(vendorRes.data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Something went wrong. Please try again later.";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSave = async () => {
    setLoading(true);
    await fetchUsers(); // Refresh list from API after adding
    setSnackbarMessage("User added successfully");
    setSnackbarOpen(true);
    handleCloseDrawer();
    setLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View (List) */}
        <UserAdminMain
          users={users}
        //   vendors={vendors}
          onAdd={handleOpenAdd}
          onRefresh={fetchUsers}
          loading={loading}
        />

        {/* 2. Drawer Form (Add Only) */}
        <UserAdminDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
        //   vendorList={vendors}
          loading={loading}
        />

        {/* 3. Feedback Snackbar */}
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

export default UserAdminRegister;