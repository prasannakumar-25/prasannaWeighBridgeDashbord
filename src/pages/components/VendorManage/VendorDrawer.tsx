

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
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
import { Vendor } from "pages/RegisterManagement/VendorRegister/VendorRegister";

interface VendorDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Vendor) => void;
  initialData: Vendor | null;
  loading: boolean;
}

const VendorDrawer: React.FC<VendorDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  loading,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 800 : "100%";

  // State
  const [form, setForm] = useState<Vendor>({
    Vendor_Id: 0,
    Vendor_name: "",
    Contact_number: "",
    Email: "",
    Gst_number: "",
    Address: "",
    Website: "",
  });

  // Validation State
  const [errors, setErrors] = useState<Partial<Record<keyof Vendor, string>>>({});
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
          Vendor_Id: 0,
          Vendor_name: "",
          Contact_number: "",
          Email: "",
          Gst_number: "",
         Address: "",
          Website: "",
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof Vendor, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear specific error on type
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Vendor, string>> = {};
    let isValid = true;

    // Name Validation
    if (!form.Vendor_name?.trim()) {
      newErrors.Vendor_name = "Vendor name is required";
      isValid = false;
    }

    // Email Validation
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.Email?.trim()) {
      newErrors.Email = "Email is required";
      isValid = false;
    } else if (!EmailRegex.test(form.Email)) {
      newErrors.Email = "Please enter a valid EmailAddress";
      isValid = false;
    }

    // Contact_number Validation (Indian format example based on your previous code)
    // Contact_number Validation
    if (!form.Contact_number?.trim()) {
      newErrors.Contact_number = "Contact_number Number is required";
      isValid = false;
    } else if (form.Contact_number.length < 10) {
        newErrors.Contact_number = "Contact_number number seems too short";
        isValid = false;
    }


    // GST Validation (Optional check, if provided)
    // if (form.Gst_number && form.Gst_number.length < 5) {
    //     newErrors.Gst_number = "GST Number seems too short";
    //     isValid = false;
    // }
    // if (form.Gst_number && String(form.Gst_number).trim().length < 15) {
    //   newErrors.Gst_number = "GST Number must be 15 characters";
    //   isValid = false;
    // }
    if (!form.Gst_number?.trim()) {
      newErrors.Gst_number = "Gst_number Number is required";
      isValid = false;
    } else if (form.Gst_number.length < 15) {
        newErrors.Gst_number = "Gst_number must be 15 characters";
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

  const handleSubmit = () => {
    if (validate()) {
      onSave(form);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          boxShadow: theme.shadows[20],
        },
      }}
    >
      {/* --- Stylish Header --- */}
      <Box
        sx={{
          px: 2.5,
          py: 2.3,
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 100%)`,
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "#7bbefdff",
              width: 50,
              height: 50,
              boxShadow: theme.shadows[3],
            }}
          >
            <IconifyIcon icon="mdi:domain" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {initialData ? "Edit Vendor" : "New Vendor"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {initialData ? "Update business details" : "Register a new supplier or partner"}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            color: "Black",
            // bgcolor: "rgba(255,255,255,0.1)",
            // "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      {/* --- Content Area --- */}
      <Box sx={{ p: 3, overflowY: "auto", flex: 1, bgcolor: theme.palette.background.default }}>
        <Stack spacing={3}>
          {globalError && (
            <Collapse in={!!globalError}>
              <Alert severity="error" onClose={() => setGlobalError(null)} sx={{ mb: 2 }}>
                {globalError}
              </Alert>
            </Collapse>
          )}

          {/* Section 1: Company Profile */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Company Profile
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Vendor Name (Business)"
                  className="input-bg-color label-black"
                  placeholder="e.g. Acme Industries Ltd."
                  fullWidth
                  value={form.Vendor_name}
                  onChange={(e) => setField("Vendor_name", e.target.value)}
                  disabled={loading}
                  error={!!errors.Vendor_name}
                  helperText={errors.Vendor_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:store-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="EmailAddress"
                  className="input-bg-color label-black"
                  placeholder="vendor@example.com"
                  fullWidth
                  value={form.Email}
                  onChange={(e) => setField("Email", e.target.value)}
                  disabled={loading}
                  error={!!errors.Email}
                  helperText={errors.Email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:Email-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact_number Number"
                  className="input-bg-color label-black"
                  placeholder="+91 9876543210"
                  fullWidth
                  value={form.Contact_number}
                  onChange={(e) => setField("Contact_number", e.target.value)}
                  disabled={loading}
                  error={!!errors.Contact_number}
                  helperText={errors.Contact_number}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:Contact_number-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Website"
                  className="input-bg-color label-black"
                  placeholder="https://www.company.com"
                  fullWidth
                  value={form.Website || ""}
                  onChange={(e) => setField("Website", e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:web" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Section 2: Legal &Address */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Legal & Location
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="GST / Tax Number"
                  className="input-bg-color label-black"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  fullWidth
                  value={form.Gst_number || ""}
                  onChange={(e) => setField("Gst_number", e.target.value)}
                  disabled={loading}
                  error={!!errors.Gst_number}
                  helperText={errors.Gst_number}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:file-document-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="BusinessAddress"
                  className="input-bg-color label-black"
                  placeholder="e.g. 123 Industrial Estate, Chennai"
                  fullWidth
                  multiline
                  minRows={2}
                  value={form.Address || ""}
                  onChange={(e) => setField("Address", e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end" sx={{ mt: 3.5 }}>
                        <IconifyIcon icon="mdi:map-marker-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Box>

      {/* --- Footer Actions --- */}
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
          sx={{
            px: 4,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          {initialData ? "Save Changes" : "Create Vendor"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default VendorDrawer;
