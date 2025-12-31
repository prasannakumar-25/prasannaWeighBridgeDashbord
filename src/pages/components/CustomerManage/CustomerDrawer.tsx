import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
  Grid,
  Paper,
  Avatar,
  Collapse,
  alpha,
  InputAdornment,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { Customer, Vendor } from "pages/RegisterManagement/CustomerRegister/CustomerRegister";
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import customerApi from "services/customerApi";

interface CustomerDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Customer) => void;
  initialData: Customer | null;
  vendorList: Vendor[]; // Received from parent
  loading?: boolean;
}

const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  vendorList,
  loading = false,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 800 : "100%";

  // Form State
  const [form, setForm] = useState<Customer>({
    Customer_Id: 0,
    Vendor_Id: 0,
    Customer_code: "",
    Customer_name: "",
    Contact_number: "",
    Email: "",
    Address: "",
    Gst_number: "",
    Status: "Active",
    Created_at: new Date().toISOString(),
  });

  // Validation State
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Reset or Populate form
  useEffect(() => {
    if (open) {
      setErrors({});
      setGlobalError(null);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm({
          Customer_Id: 0,
          Vendor_Id: 0,
          Customer_code: "", // You might want to generate this or let user type
          Customer_name: "",
          Contact_number: "",
          Email: "",
          Address: "",
          Gst_number: "",
          Status: "Active",
          Created_at: new Date().toISOString(),
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof Customer, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Customer, string>> = {};
    let isValid = true;

    if (!form.Vendor_Id) {
        newErrors.Vendor_Id = "Please select a Vendor"; // This links to vendor
        isValid = false;
    }

    if (!form.Customer_name?.trim()) {
      newErrors.Customer_name = "Customer Name is required";
      isValid = false;
    }

    if (!form.Customer_code?.trim()) {
      newErrors.Customer_code = "Customer Code is required";
      isValid = false;
    }

    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.Email?.trim()) {
      newErrors.Email = "Email is required";
      isValid = false;
    } else if (!EmailRegex.test(form.Email)) {
      newErrors.Email = "Invalid Email address";
      isValid = false;
    }

    if (!form.Contact_number?.trim()) {
      newErrors.Contact_number = "Contact Number is required";
      isValid = false;
    }

    if (!form.Gst_number?.trim()) {
        newErrors.Gst_number = "GST Number is required";
        isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setGlobalError("Please correct the highlighted errors below.");
    } else {
      setGlobalError(null);
    }
    return isValid;
  };

  const handleSubmit = async () => {
    
    if(!validate()) return;

    const payload = {
      Vendor_Id: form.Vendor_Id,
      Customer_code: form.Customer_code,
      Customer_name: form.Customer_name,
      Contact_number: form.Contact_number,
      Email: form.Email,
      Address: form.Address,
      Gst_number: form.Gst_number,
      Status: form.Status,
    };

    try {
      let response;
      if (initialData && form.Customer_Id > 0) {
        response = await customerApi.updateCustomerDetails(form.Customer_Id, payload);
      } else {
        response = await customerApi.addCustomerDetails(payload);
      }
      
      if (response?.success) {
        onSave(response.data);
        onClose();
      } else {
        setGlobalError(response?.message || "Operation failed");
      }
    } catch(error: any) {
      console.error("Error submitting form:", error);
      setGlobalError(error.message || "An unexpected error occurred");
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: drawerWidth, boxShadow: theme.shadows[20] },
      }}
    >
      {/* --- Header --- */}
      <Box
        sx={{
          px: 2.5,
          py: 2.3,
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#7bbefdff", width: 46, height: 46, boxShadow: theme.shadows[3] }}>
            <IconifyIcon icon="mdi:domain" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {initialData ? "Edit Customer" : "New Customer"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {initialData ? "Update customer information" : "Register a new customer"}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: "black" }}>
          <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      {/* --- Content --- */}
      <Box sx={{ p: 3, overflowY: "auto", flex: 1, bgcolor: theme.palette.background.default }}>
        <Stack spacing={3}>
          {globalError && (
            <Collapse in={!!globalError}>
              <Alert severity="error" onClose={() => setGlobalError(null)} sx={{ mb: 2 }}>
                {globalError}
              </Alert>
            </Collapse>
          )}

          {/* Section 1: Vendor Link (Critical) */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
             <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Association
            </Typography>
            <Grid container spacing={2}>
                 <Grid item xs={12}>
                    {/* <TextField
                        label="Select Vendor"
                        select
                        fullWidth
                        value={form.Vendor_Id === 0 ? "" : form.Vendor_Id} // Handle 0 as empty
                        onChange={(e) => setField("Vendor_Id", Number(e.target.value))}
                        disabled={loading}
                        error={!!errors.Vendor_Id} // Show error if not selected
                        helperText={errors.Vendor_Id}
                        className="input-bg-color label-black"
                    >
                        {vendorList.map((vendor) => (
                            <MenuItem key={vendor.Vendor_Id} value={vendor.Vendor_Id}>
                                {vendor.Vendor_name}
                            </MenuItem>
                        ))}
                    </TextField> */}

                    <TextField
                      label="Select Vendor"
                      select
                      fullWidth
                      value={form.Vendor_Id === 0 ? "" : form.Vendor_Id}
                      onChange={(e) => setField("Vendor_Id", Number(e.target.value))}
                      disabled={loading}
                      error={!!errors.Vendor_Id}
                      helperText={errors.Vendor_Id}
                      className="input-bg-color label-black"
                      
                      // 1. Customize the Dropdown Container (The "Paper")
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              borderRadius: 2,
                              marginTop: 1,
                              boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', // Soft modern shadow
                              border: '1px solid',
                              borderColor: 'divider',
                              maxHeight: 300, // Good for long lists
                            },
                          },
                          // Remove default padding to handle our own margins
                          MenuListProps: { sx: { py: 1 } } 
                        },
                      }}
                    >
                      {/* Placeholder option (Optional, if you want a clear option) */}
                      <MenuItem value="" disabled sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                        <em>Choose a vendor...</em>
                      </MenuItem>
    
                      {vendorList.map((vendor) => (
                        <MenuItem
                          key={vendor.Vendor_Id}
                          value={vendor.Vendor_Id}
                          divider={false} // Turn off default lines
                          sx={{
                            // 2. The "Floating Pill" Shape
                            borderRadius: '10px',
                            margin: '6px 10px', // Creates space around the item
                            padding: '10px 16px',
                            transition: 'all 0.2s ease-in-out',
    
                            // 3. Hover Effects
                            '&:hover': {
                              backgroundColor: 'primary.lighter', // or 'rgba(25, 118, 210, 0.08)'
                              transform: 'translateX(5px)', // Slide right effect
                              '& .vendor-avatar': {
                                transform: 'scale(1.1) rotate(-5deg)', // Avatar animation
                              }
                            },
    
                            // 4. Selected State Styling
                            '&.Mui-selected': {
                              backgroundColor: 'primary.main',
                              color: 'common.white',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                              // Change sub-text color when selected
                              '& .vendor-id-text': {
                                color: 'rgba(255,255,255,0.7)', 
                              }
                            }
                          }}
                        >
                          {/* Layout for Avatar + Text */}
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            
                            {/* Generated Avatar based on Name */}
                            <Avatar 
                              className="vendor-avatar"
                              sx={{ 
                                width: 28, 
                                height: 28, 
                                mr: 2, 
                                fontSize: '0.75rem',
                                bgcolor: 'primary.main', // or dynamic colors
                                transition: 'transform 0.2s'
                              }}
                            >
                              {vendor.Vendor_name ? vendor.Vendor_name.charAt(0).toUpperCase() : 'V'}
                            </Avatar>
    
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" fontWeight={600}>
                                {vendor.Vendor_name}
                              </Typography>
                              
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>

                 </Grid>
            </Grid>
          </Paper>

          {/* Section 2: Customer Details */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Customer Code"
                  placeholder="e.g. CUST001"
                  fullWidth
                  value={form.Customer_code}
                  onChange={(e) => setField("Customer_code", e.target.value)}
                  disabled={loading}
                  error={!!errors.Customer_code}
                  helperText={errors.Customer_code}
                  className="input-bg-color label-black"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                 <TextField
                  label="GST Number"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  fullWidth
                  value={form.Gst_number}
                  onChange={(e) => setField("Gst_number", e.target.value)}
                  disabled={loading}
                  error={!!errors.Gst_number}
                  helperText={errors.Gst_number}
                  className="input-bg-color label-black"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Customer Name"
                  placeholder="e.g. Acme Industries"
                  fullWidth
                  value={form.Customer_name}
                  onChange={(e) => setField("Customer_name", e.target.value)}
                  disabled={loading}
                  error={!!errors.Customer_name}
                  helperText={errors.Customer_name}
                  className="input-bg-color label-black"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:account-tie" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  placeholder="contact@company.com"
                  fullWidth
                  value={form.Email}
                  onChange={(e) => setField("Email", e.target.value)}
                  disabled={loading}
                  error={!!errors.Email}
                  helperText={errors.Email}
                  className="input-bg-color label-black"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:email-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Number"
                  placeholder="+91 9876543210"
                  fullWidth
                  value={form.Contact_number}
                  onChange={(e) => setField("Contact_number", e.target.value)}
                  disabled={loading}
                  error={!!errors.Contact_number}
                  helperText={errors.Contact_number}
                  className="input-bg-color label-black"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:phone-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Section 3: Address & Status */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Address & Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  placeholder="Full billing address..."
                  multiline
                  rows={3}
                  fullWidth
                  value={form.Address}
                  onChange={(e) => setField("Address", e.target.value)}
                  disabled={loading}
                  className="input-bg-color label-black"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={form.Status}
                  onChange={(e) => setField("Status", e.target.value)}
                  disabled={loading}
                  className="input-bg-color label-black"
                >
                  <MenuItem value="Active">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                        Active
                    </Box>
                  </MenuItem>
                  <MenuItem value="Inactive">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
                        Inactive
                    </Box>
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Box>

      {/* --- Footer --- */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button onClick={onClose} color="inherit" sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          size="large"
          startIcon={<IconifyIcon icon="material-symbols:save-rounded" />}
          sx={{ px: 4, borderRadius: 2, boxShadow: theme.shadows[4] }}
        >
          {initialData ? "Save Changes" : "Create Customer"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default CustomerDrawer;