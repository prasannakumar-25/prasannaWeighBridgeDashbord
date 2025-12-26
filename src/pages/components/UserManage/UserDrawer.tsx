
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
import { User } from "pages/RegisterManagement/UserRegistration/UserRegister";
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import userApi from "services/userApi";

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data:User) => void;
  initialData: User | null;
  loading?: boolean;
}

const UserDrawer: React.FC<UserDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  loading = false,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 650 : "100%";

  // Form State
  const [form, setForm] = useState<User>({
    User_Id: 0,
    User_name: "", // Usually auto-generated or same as Email, keeping empty for now
    Password: "",
    Full_name: "",
    Email: "",
    Mobile_number: "",
    Role: "Operator",
    // status: "Active",
    Created_at: new Date().toISOString(),
  });

  // Validation State
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(false);

  // Reset or Populate form
  useEffect(() => {
    if (open) {
      setErrors({});
      setGlobalError(null);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm({
          User_Id: 0,
          User_name: "",
          Password: "",
          Full_name: "",
          Email: "",
          Mobile_number: "",
          Role: "Operator",
          // status: "Active",
          Created_at: new Date().toISOString(),
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof User, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear specific error when user types
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof User, string>> = {};
    let isValid = true;

    // Full Name Validation
    if (!form.Full_name?.trim()) {
      newErrors.Full_name = "Full Name is required";
      isValid = false;
    }

    // Email Validation
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.Email?.trim()) {
      newErrors.Email = "Email is required";
      isValid = false;
    } else if (!EmailRegex.test(form.Email)) {
      newErrors.Email = "Please enter a valid Email address";
      isValid = false;
    }

    // Phone Validation
    if (!form.Mobile_number?.trim()) {
      newErrors.Mobile_number = "Phone Number is required";
      isValid = false;
    } else if (form.Mobile_number.length < 10) {
        newErrors.Mobile_number = "Phone number seems too short";
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

  // const handleSubmit = async () => {
  //   if (!validate()) return;

  //   const payload = {
  //     User_name: form.User_name,
  //     Password: form.Password,
  //     Full_name: form.Full_name,
  //     Email: form.Email,
  //     Mobile_number: form.Mobile_number,
  //     Role: form.Role,
  //   }
  //   try{  
  //     const response = await userApi.addUserDetails(payload)
  //     if (response?.success) {
  //       onSave(response.data);
  //       onClose();
  //     } else {
  //     setSnackbarMessage(response.message || "Failed to Create user");
  //     }
  //   } catch (error) {
  //     console.error("Create user error", error);
  //     setGlobalError("Somthing went wrong. Please try again.");
  //   }
  //   };

  const handleSubmit = async () => {
    if(!validate()) return;

    const payload = {
      User_name: form.User_name,
      Password: form.Password,
      Full_name: form.Full_name,
      Email: form.Email,
      Mobile_number: form.Mobile_number,
      Role: form.Role,
    };

    try {
      let response
      if (initialData && form.User_Id > 0) {
        response = await userApi.updateUserDetails(form.User_Id, payload);
      } else {
        response = await userApi.addUserDetails(payload);
      }
      if (response?.success) {
        console.log("Success :", response)
        onSave(response.data);
        onClose();
      }
    } catch(error) {
      console.error("Reeoe submitting form:", error);
    }
  }


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
      {/* --- Header --- */}
      <Box
        sx={{
          px: 2.5,
          py: 2.3,
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 100%)`,
          // background: "linear-gradient(135deg, #d4ecfdff 0%, #bbdefb 100%)",
          // color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "#7bbefdff",
              width: 46,
              height: 46,
              boxShadow: theme.shadows[3],
            }}
          >
            <IconifyIcon icon="mdi:account-circle-outline" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {initialData ? "Edit User" : "New User"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {initialData ? "Update user details & access" : "Create a new system user"}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            color: "black",
            // bgcolor: "rgba(227, 248, 255, 0.9)",
            // "&:hover": { bgcolor: "rgba(24, 23, 23, 0.2)" },=
          }}
        >
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

          {/* Section 1: Personal Details */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Personal Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  className="input-bg-color label-black"
                  placeholder="e.g. John Doe"
                  fullWidth
                  value={form.Full_name}
                  onChange={(e) => setField("Full_name", e.target.value)}
                  disabled={loading}
                  error={!!errors.Full_name}
                  helperText={errors.Full_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:account-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Access Password"
                  className="input-bg-color label-black"
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  fullWidth
                  value={form.Password}
                  onChange={(e) => setField("Password", e.target.value)}
                  disabled={loading}
                  error={!!errors.Password}
                  helperText={errors.Password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:lock-outline" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'text.secondary' }} 
                        >
                          {showPassword ? (
                            <IconifyIcon icon="ic:baseline-key-off" />
                          ) : (
                            <IconifyIcon icon="ic:baseline-key" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  placeholder="e.g. john@example.com"
                  className="input-bg-color label-black"
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

              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  placeholder="e.g. +91 98765 43210"
                  className="input-bg-color label-black"
                  fullWidth
                  value={form.Mobile_number}
                  onChange={(e) => setField("Mobile_number", e.target.value)}
                  disabled={loading}
                  error={!!errors.Mobile_number}
                  helperText={errors.Mobile_number}
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
                  label="UserName"
                  className="input-bg-color label-black"
                  placeholder="e.g. admin 1"
                  fullWidth
                  value={form.User_name}
                  onChange={(e) => setField("User_name", e.target.value)}
                  disabled={loading}
                  error={!!errors.User_name}
                  helperText={errors.User_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon icon="mdi:account-outline" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Section 2: Account Settings */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Account Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Role"
                  className="input-bg-color label-black"
                  select
                  fullWidth
                  value={form.Role}
                  onChange={(e) => setField("Role", e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Operator">Operator</MenuItem>
                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* <TextField
                  label="Status"
                  className="input-bg-color label-black"
                  select
                  fullWidth
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                  disabled={loading}
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
                </TextField> */}
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
          sx={{
            px: 4,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
          }}
        >
          {initialData ? "Save Changes" : "Create User"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default UserDrawer;