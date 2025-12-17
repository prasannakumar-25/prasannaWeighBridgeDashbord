

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   Stack,
//   TextField,
//   Typography,
//   Alert,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// import { Vendor } from "pages/RegisterManagement/VendorRegister/VendorRegister"; 


// interface VendorDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: Vendor) => void;
//   initialData: Vendor | null;
//   loading: boolean;
// }

// const VendorDrawer: React.FC<VendorDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   loading,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);

//   // Default Form
//   const defaultForm: Vendor = {
//     id: 0,
//     vendorName: "",
//     phone: "",
//     email: "",
//     gstNumber: "",
//     address: "",
//     website: "",
//   };

//   const [form, setForm] = useState<Vendor>(defaultForm);

//   useEffect(() => {
//     if (open) {
//       setFormError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm(defaultForm);
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof Vendor, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = (): boolean => {
//     if (!form.vendorName || !form.vendorName.trim()) {
//       setFormError("Vendor name is required.");
//       return false;
//     }
//     if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       setFormError("Please enter a valid email address.");
//       return false;
//     }
//     if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
//       setFormError("Please enter a valid 10-digit phone number.");
//       return false;
//     }
//     setFormError(null);
//     return true;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       onSave(form);
//     }
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: drawerWidth,
//           p: 3,
//           borderTopLeftRadius: { xs: 0, md: 12 },
//           borderBottomLeftRadius: { xs: 0, md: 12 },
//         },
//       }}
//     >
//       <Box className="drawer-header" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h6" fontWeight="bold">
//             {initialData ? "Edit Vendor" : "Add New Vendor"}
//         </Typography>
//         <IconButton onClick={onClose} aria-label="close">
//             <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
//       </Box>

//       <Box className="drawer-content">
//         {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

//         <Stack spacing={2.5}>
//           <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//             <TextField
//                 label="Vendor Name (Business)"
//                 className="input-bg-color label-black"
//                 placeholder="Enter business or company name"
//                 fullWidth
//                 value={form.vendorName}
//                 disabled={loading}
//                 onChange={(e) => setField("vendorName", e.target.value)}
//                 helperText="Public-facing company / vendor name"
//             />
//           </Stack>

//           <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//             <TextField
//                 label="Email"
//                 className="input-bg-color label-black"
//                 placeholder="e.g., vendor@example.com"
//                 fullWidth
//                 value={form.email || ""}
//                 disabled={loading}
//                 onChange={(e) => setField("email", e.target.value)}
//             />
//           </Stack>

//           <TextField
//               label="Address (City / State)"
//               className="input-bg-color label-black"
//               placeholder="e.g., Chennai, Tamil Nadu"
//               fullWidth
//               value={form.address || ""}
//               disabled={loading}
//               onChange={(e) => setField("address", e.target.value)}
//           />

//           <TextField
//             label="Phone"
//             className="input-bg-color label-black"
//             placeholder="e.g., +91 9876543210"
//             fullWidth
//             value={form.phone || ""}
//             disabled={loading}
//             onChange={(e) => setField("phone", e.target.value)}
//           />


//           <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//             <TextField
//                 label="GST / Tax Number"
//                 className="input-bg-color label-black"
//                 placeholder="Enter GST / tax identification number"
//                 fullWidth
//                 value={form.gstNumber || ""}
//                 disabled={loading}
//                 onChange={(e) => setField("gstNumber", e.target.value)}
//             />
//           </Stack> 

//           <TextField
//               label="Website"
//               className="input-bg-color label-black"
//               placeholder="e.g., https://www.company.com"
//               fullWidth
//               value={form.website || ""}
//               disabled={loading}
//               onChange={(e) => setField("website", e.target.value)}
//           />

//           <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//             <Button variant="text" className="cancel-button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button variant="contained" className="edit-button" onClick={handleSubmit} disabled={loading}>
//               {initialData ? "Update Vendor" : "Save Vendor"}
//             </Button>
//           </Stack>
//         </Stack>
//       </Box>
//     </Drawer>
//   );
// };

// export default VendorDrawer;














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
  const drawerWidth = isMdUp ? 650 : "100%";

  // State
  const [form, setForm] = useState<Vendor>({
    id: 0,
    vendorName: "",
    phone: "",
    email: "",
    gstNumber: "",
    address: "",
    website: "",
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
          id: 0,
          vendorName: "",
          phone: "",
          email: "",
          gstNumber: "",
          address: "",
          website: "",
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
    if (!form.vendorName?.trim()) {
      newErrors.vendorName = "Vendor name is required";
      isValid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email?.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone Validation (Indian format example based on your previous code)
    // Phone Validation
    if (!form.phone?.trim()) {
      newErrors.phone = "Phone Number is required";
      isValid = false;
    } else if (form.phone.length < 10) {
        newErrors.phone = "Phone number seems too short";
        isValid = false;
    }


    // GST Validation (Optional check, if provided)
    // if (form.gstNumber && form.gstNumber.length < 5) {
    //     newErrors.gstNumber = "GST Number seems too short";
    //     isValid = false;
    // }
    if (form.gstNumber && String(form.gstNumber).trim().length < 15) {
      newErrors.gstNumber = "GST Number must be 15 characters";
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
                  value={form.vendorName}
                  onChange={(e) => setField("vendorName", e.target.value)}
                  disabled={loading}
                  error={!!errors.vendorName}
                  helperText={errors.vendorName}
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
                  label="Email Address"
                  className="input-bg-color label-black"
                  placeholder="vendor@example.com"
                  fullWidth
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  disabled={loading}
                  error={!!errors.email}
                  helperText={errors.email}
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
                  label="Phone Number"
                  className="input-bg-color label-black"
                  placeholder="+91 9876543210"
                  fullWidth
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  disabled={loading}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:phone-outline" />
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
                  value={form.website || ""}
                  onChange={(e) => setField("website", e.target.value)}
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

          {/* Section 2: Legal & Address */}
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
                  value={form.gstNumber || ""}
                  onChange={(e) => setField("gstNumber", e.target.value)}
                  disabled={loading}
                  error={!!errors.gstNumber}
                  helperText={errors.gstNumber}
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
                  label="Business Address"
                  className="input-bg-color label-black"
                  placeholder="e.g. 123 Industrial Estate, Chennai"
                  fullWidth
                  multiline
                  minRows={2}
                  value={form.address || ""}
                  onChange={(e) => setField("address", e.target.value)}
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
