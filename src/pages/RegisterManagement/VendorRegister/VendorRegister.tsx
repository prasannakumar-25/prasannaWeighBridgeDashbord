
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
import IconifyIcon from "components/base/IconifyIcon";
import { useSnackbar } from 'notistack';
import vendorApi from "services/vendorApi";

// Sub Components
import VendorMain from "pages/components/VendorManage/VendorMain";
import VendorDrawer from "pages/components/VendorManage/VendorDrawer";

// Custom CSS
import "../MachineRegister/MachineRegister.css"; 

export type SuperAdmin = {
  Super_ID: number;
  User_name: string;
}

// --- Global Types ---
export type Vendor = {
  Vendor_Id: number;
  Super_ID: number;
  User_name?: string;
  Vendor_name: string;
  Contact_number?: string;
  Email?: string;
  Website?: string;
  Gst_number?: string;
  Address?: string;
  Created_at?: string; // Added for Date Filtering
};

// Interface for API Raw Response
// interface ApiVendor {
//   id: number;
//   Vendor_name: string;
//   Contact_number?: string;
//   Email?: string;
//   Website?: string;
//   Gst_number?: string;
//   Address: string;
//   Created_at?: string; // Assuming API returns this
// }

const VendorRegister: React.FC<{ onLogout?: () => void }> = () => {
  // --- State ---
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  // UI State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  // --- API / Effect ---
  // const fetchVendor = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await vendorApi.getVendordetails();
  //     if (response.success) {
  //       const mappedData: Vendor[] = response.data.map((v: ApiVendor) => ({
  //         id: v.id,
  //         Vendor_name: v.Vendor_name,
  //         Contact_number: v.Contact_number,
  //         Email: v.Email,
  //         Website: v.Website,
  //         Gst_number: v.Gst_number,
  //         Address: v.Address,
  //         Created_at: v.Created_at || new Date().toISOString(),
  //       }));
  //       setVendors(mappedData);
  //     } else {
  //       enqueueSnackbar(response.message || "Failed to fetch vendors", { variant: "error" });
  //     }
  //   } catch (error: any) {
  //     const errorMessage = error.response?.data.message || "Error fetching vendors";
  //     enqueueSnackbar(errorMessage, { variant: "error" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

    // --- API / Effect ---
    const fetchVendor = async () => {
      setLoading(true);
      try{
        const response = await vendorApi.getVendordetails();
        console.log("Vendor API response:" , response)
        if (response.success) {
          setVendors(response.data)
        } else {
          setSnackbarMessage(response.message || "Failed to Fetch Vendor data")
        }
      } catch (error:any) {
        const errorMessage = error.response?.data.message || "Something error occurred please try agin latter";
        setSnackbarMessage(errorMessage);
      } finally {
        setSnackbarOpen(true);
        setLoading(false);
      }
    };

  useEffect(() => {
    // If you are using API, call fetchVendor(). 
    // For Mock display purposes:
    setLoading(true);
    fetchVendor();
    setLoading(false);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingVendor(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingVendor(null);
  };

  // const handleSave = async (form: Vendor) => {
  //   setLoading(true);
  //   try {
  //     const payload = {
  //       Super_Id: 0,
  //       Vendor_name: form.Vendor_name.trim(),
  //       Contact_number: form.Contact_number?.trim(),
  //       Email: form.Email?.trim().toLowerCase(),
  //       Address: form.Address?.trim(),

  //       Gst_number: form.Gst_number?.trim(),
  //       Website: form.Website?.trim()
  //     };
  //     // const response = await vendorApi.addVendor(payload);
      

  //     if (editingVendor) {
        
  //       setVendors((prev) => prev.map((v) => (v.Vendor_Id === editingVendor.Vendor_Id ? { ...form, Vendor_Id: editingVendor.Vendor_Id, Created_at: v.Created_at } : v)));
  //       setSnackbarMessage("Vendor updated successfully");
  //       setLoading(false);
  //     } else {
  //       const response = await vendorApi.addVendor(payload);
  //       if (response.success) {
  //         setVendors(response.data)
  //       } else {
  //         setSnackbarMessage(response.message || "failed to Added the Vendor")
  //       }
        
  //       // Mock Add
  //       const newVendor = { ...form, Vendor_Id: Date.now(), Created_at: new Date().toISOString() };
  //       setVendors(prev => [newVendor, ...prev]);
  //       setSnackbarMessage("Vendor registered successfully!");
  //     }
  //     setSnackbarOpen(true);
  //     handleCloseDrawer();
  //   } catch (error: any) {
  //     setSnackbarMessage(error.response?.data.message || "Error saving vendor");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = async (form: Vendor) => {
    setLoading(true);
    try {
      // 1. Prepare the payload
      const payload = {
        Super_Id: 0,
        Vendor_name: form.Vendor_name.trim(),
        Contact_number: form.Contact_number?.trim(),
        Email: form.Email?.trim().toLowerCase(),
        Address: form.Address?.trim(),
        Gst_number: form.Gst_number?.trim(),
        Website: form.Website?.trim()
      };

      if (editingVendor) {
        // ===== UPDATE LOGIC
        const response = await vendorApi.updateVendordetails(editingVendor.Vendor_Id, payload);

        if (response.success || response.status === 200) { 
          setVendors((prev) => 
            prev.map((v) => 
              v.Vendor_Id === editingVendor.Vendor_Id 
                ? { ...v, ...payload }
                : v
            )
          );
          setSnackbarMessage("Vendor updated successfully");
        } else {
          throw new Error(response.message || "Failed to update vendor");
        }

      } else {
        // ==== ADD LOGIC 
        const response = await vendorApi.addVendor(payload);
        
        if (response.success || response.status === 200) {
          setVendors(prev => [response.data, ...prev]);
          setSnackbarMessage("Vendor registered successfully!");
        } else {
          throw new Error(response.message || "Failed to add vendor");
        }
      }

      setSnackbarOpen(true);
      handleCloseDrawer();
    } catch (error: any) {
      console.error("Handle Save Error:", error);
      setSnackbarMessage(error.response?.data?.message || error.message || "Error saving vendor");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Logic ---
  const initiateDelete = (Vendor_Id: number) => {
    setVendorToDelete(Vendor_Id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (vendorToDelete !== null) {

      try {
        const response = await vendorApi.deleteVendordetails(vendorToDelete);
        if (response.success) {
          setVendors((prev) => 
          prev.filter((v) => v.Vendor_Id !== vendorToDelete));
          setSnackbarMessage("Vendor Deleted successfully");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Failed to delete ");
          setSnackbarOpen(true)
        }
      } catch (error) {
        console.error(error)

      setSnackbarMessage("Something went wrong while deleting");
      setSnackbarOpen(true);
      }
    }
    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        <VendorMain
          vendors={vendors}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          loading={loading}
          onRefresh={fetchVendor}
        />
        <VendorDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingVendor}
          loading={loading}
        />
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">Are you sure you want to delete this vendor?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "flex-end", pb: 2, gap: 1 }}>
            <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
            <Button variant="contained" onClick={confirmDelete} color="error" startIcon={<IconifyIcon icon="wpf:delete" />}>Delete</Button>
          </DialogActions>
        </Dialog>
        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
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

export default VendorRegister;