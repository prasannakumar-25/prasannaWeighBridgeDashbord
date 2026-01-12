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

// Sub Components
import CustomerMain from "pages/components/CustomerManage/CustomerMain";
import CustomerDrawer from "pages/components/CustomerManage/CustomerDrawer";
// Custom CSS
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import IconifyIcon from "components/base/IconifyIcon";


// API Services (Assuming these exist based on your pattern)
import customerApi from "services/customerApi";
import vendorApi from "services/vendorApi"; // Needed to populate the dropdown

// --- Global Types ---
export type Vendor = {
  Vendor_Id: number;
  Vendor_name: string;
};

export type Customer = {
  Customer_Id: number;
  Vendor_Id: number;
  // Optional: For display purposes if your backend joins the table
  Vendor_name?: string; 
  Customer_code: string;
  Customer_name: string;
  Contact_number: string;
  Email: string;
  Address: string;
  Gst_number: string;
  Status: "Active" | "Inactive";
  Created_at: string;
};

const CustomerRegister: React.FC = () => {
  // Data State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]); // To pass to Drawer
  const [loading, setLoading] = useState(false);

  // UI Control State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- API / Effect ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Customers
      const customerRes = await customerApi.getCustomerDetails();
      if (customerRes.success) {
        setCustomers(customerRes.data);
      } else {
        setSnackbarMessage(customerRes.message || "Failed to fetch customers");
        setSnackbarOpen(true);
      }

      // 2. Fetch Vendors (For the dropdown in Drawer)
      const vendorRes = await vendorApi.getVendordetails();
      if (vendorRes.success) {
        setVendors(vendorRes.data);
      } 

    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Something went wrong, please try again later";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingCustomer(null);
  };

    const handleSave = async () => {
    setLoading(true);
     await fetchData();          // 🔹 refresh list from API
     setSnackbarMessage(
       editingCustomer
         ? "Customer updated successfully"
         : "Customer added successfully"
     );
     setSnackbarOpen(true);
     handleCloseDrawer();          // 🔹 close drawer
     setLoading(false);
    
  }

//   const handleSave = (formData: Customer) => {
//     // In a real scenario, you usually re-fetch or optimistically update
//     // Here we update local state for immediate feedback based on your previous code
//     setLoading(true);
//     setTimeout(() => {
//       if (editingCustomer) {
//         setCustomers((prev) => 
//           prev.map((c) => (c.Customer_Id === editingCustomer.Customer_Id ? { ...formData, Customer_Id: editingCustomer.Customer_Id } : c))
//         );
//         setSnackbarMessage("Customer updated successfully");
//       } else {
//         // If the backend doesn't return the Vendor Name immediately, we might need to find it from the vendors list for display
//         const selectedVendor = vendors.find(v => v.Vendor_Id === formData.Vendor_Id);
//         const newCustomer: Customer = { 
//             ...formData, 
//             Customer_Id: Date.now(),
//             Vendor_name: selectedVendor?.Vendor_name 
//         };
//         setCustomers((prev) => [newCustomer, ...prev]);
//         setSnackbarMessage("Customer added successfully");
//     }
//       setLoading(false);
//       setSnackbarOpen(true);
//       handleCloseDrawer();
//     }, 400);
//   };

  // --- Delete Logic ---
  const initiateDelete = (Customer_Id: number) => {
    setCustomerToDelete(Customer_Id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    if (customerToDelete !== null) {
      try {
        const response = await customerApi.deleteCustomerDetails(customerToDelete);

        if (response.success) {
          setCustomers((prev) => prev.filter((c) => c.Customer_Id !== customerToDelete));
          setSnackbarMessage("Customer deleted successfully");
        } else {
          setSnackbarMessage("Failed to delete Customer");
        }
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Something went wrong while deleting");
      }
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
    setLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View */}
        <CustomerMain
          customers={customers}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          onRefresh={fetchData}
          loading={loading}
        />

        {/* 2. Drawer View */}
        <CustomerDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingCustomer}
          vendorList={vendors} // <--- Passing Vendors here
          loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this Customer?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, gap: 1 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained"
              startIcon={<IconifyIcon icon="wpf:delete"/>}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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

export default CustomerRegister;