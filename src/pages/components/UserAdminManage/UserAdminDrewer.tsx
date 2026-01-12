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
  InputAdornment,
  useMediaQuery,
  useTheme,
  Grid,
  Paper,
  Avatar,
  Collapse,
  Alert,
  alpha,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
// import { Vendor } from "pages/RegisterManagement/VendorRegister/VendorRegister";
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import authApi from "services/authApi";

interface UserAdminDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void; // No data passed back, just trigger refresh
//   vendorList: Vendor[];
  loading: boolean;
}

// Define the payload type explicitly based on models
type UserPayload = {
    User_name: string;
    Shortname: string;
    Password: string;
    Role: string;
    // Vendor_Id: number;
    IsActive: number;
};

const UserAdminDrawer: React.FC<UserAdminDrawerProps> = ({
  open,
  onClose,
  onSave,
//   vendorList,
  loading,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 800 : "100%"; // Slightly narrower than machine drawer

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<UserPayload>({
    User_name: "",
    Shortname: "",
    Password: "",
    Role: "",
    // Vendor_Id: 0,
    IsActive: 1 
  });

  // Validation State
  const [errors, setErrors] = useState<Partial<Record<keyof UserPayload, string>>>({});


  useEffect(() => {
    if (open) {
      setForm({
        User_name: "",
        Shortname: "",
        Password: "",
        Role: "",
        // Vendor_Id: 0,
        IsActive: 1
      });
      setErrors({});
      setGlobalError(null);
      setShowPassword(false);
    }
  }, [open]);

  const setField = (key: keyof UserPayload, value: any) => {
    // Specific logic for Shortname (Uppercase, max 3 chars)
    if (key === 'Shortname') {
        value = value.toUpperCase().slice(0, 3);
    }

    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // 1. Username
    if (!form.User_name.trim()) {
      newErrors.User_name = "User name is required.";
      isValid = false;
    } else if (form.User_name.length > 150) {
      newErrors.User_name = "Name too long (max 150).";
      isValid = false;
    }

    // 2. Shortname (Must be 3 chars ideally, based on model String(3))
    if (!form.Shortname.trim()) {
      newErrors.Shortname = "Shortname is required.";
      isValid = false;
    } else if (form.Shortname.length !== 3) {
      newErrors.Shortname = "Shortname must be exactly 3 characters.";
      isValid = false;
    }

    // 3. Password
    if (!form.Password) {
      newErrors.Password = "Password is required.";
      isValid = false;
    } else if (form.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters.";
      isValid = false;
    }

    // 4. Role
    if (!form.Role) {
      newErrors.Role = "Please select a Role.";
      isValid = false;
    }

    // 5. Vendor
    // if (!form.Vendor_Id || form.Vendor_Id === 0) {
    //   newErrors.Vendor_Id = "Please select a Vendor.";
    //   isValid = false;
    // }

    setErrors(newErrors);
    if (!isValid) setGlobalError("Please correct the errors below.");
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      // API CALL (POST Method)
      const response = await authApi.authregister(form);

      if (response && response.success) {
        onSave(); // Trigger parent refresh and close
      } else {
        setGlobalError(response?.message || "Failed to create user.");
      }
    } catch (error: any) {
      console.error("Error submitting user:", error);
      setGlobalError(error.response?.data?.message || "Server error occurred.");
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
      <Box
        sx={{
          px: 2.5,
          py: 2.3,
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 100%)`,
          display: "flex",
          color: "black",
          alignItems: "center",
          justifyContent: "space-between",
        //   borderBottom: `1px solid ${theme.palette.divider}`
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
            <IconifyIcon icon="mdi:account-plus" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              New User Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Create a new SuperAdmin/User credentials
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx ={{ color: "black" }}>
          <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      {/* --- Content Area --- */}
      <Box sx={{ p: 3, overflowY: "auto", flex: 1, bgcolor: theme.palette.background.default }}>
        <Stack spacing={3}>
          {globalError && (
            <Collapse in={!!globalError}>
              <Alert severity="error" onClose={() => setGlobalError(null)}>
                {globalError}
              </Alert>
            </Collapse>
          )}

          {/* User Credentials Section */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="primary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Credentials
            </Typography>
            
            <Grid container spacing={2}>
              {/* User Name */}
              <Grid item xs={12}>
                <TextField
                  label="User Name"
                  placeholder="e.g. John Doe"
                  fullWidth
                  className="input-bg-color"
                  value={form.User_name}
                  onChange={(e) => setField("User_name", e.target.value)}
                  disabled={loading}
                  error={!!errors.User_name}
                  helperText={errors.User_name}
                  InputProps={{
                    startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:user" /></InputAdornment>
                  }}
                />
              </Grid>

              {/* Shortname (Unique 3 chars) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Short ID (Unique)"
                  placeholder=""
                  fullWidth
                  className="input-bg-color"
                  value={form.Shortname}
                  onChange={(e) => setField("Shortname", e.target.value)}
                  disabled={loading}
                  error={!!errors.Shortname}
                  helperText={errors.Shortname || "Max 3 Characters"}
                  inputProps={{ maxLength: 3, style: { textTransform: 'uppercase' } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:tag-text" /></InputAdornment>
                  }}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  fullWidth
                  className="input-bg-color"
                  value={form.Password}
                  onChange={(e) => setField("Password", e.target.value)}
                  disabled={loading}
                  error={!!errors.Password}
                  helperText={errors.Password}
                  InputProps={{
                    startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:lock" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <IconifyIcon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Access Control Section */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="primary" fontWeight={700} sx={{ mb: 2, display: "block" }}>
              Access Control & Organization
            </Typography>

            <Grid container spacing={2}>
              {/* Role Selection */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Role"
                  fullWidth
                  className="input-bg-color"
                  value={form.Role}
                  onChange={(e) => setField("Role", e.target.value)}
                  disabled={loading}
                  error={!!errors.Role}
                  helperText={errors.Role}
                >
                    <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    {/* <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Operator">Operator</MenuItem> */}
                </TextField>
              </Grid>

              {/* Vendor Selection */}
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Vendor"
                  fullWidth
                  className="input-bg-color"
                  value={form.Vendor_Id === 0 ? "" : form.Vendor_Id}
                  onChange={(e) => setField("Vendor_Id", Number(e.target.value))}
                  disabled={loading}
                  error={!!errors.Vendor_Id}
                  helperText={errors.Vendor_Id}
                  SelectProps={{
                    MenuProps: { PaperProps: { sx: { maxHeight: 250 } } }
                  }}
                >
                  {vendorList.map((v) => (
                    <MenuItem key={v.Vendor_Id} value={v.Vendor_Id}>
                        {v.Vendor_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> */}
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
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          size="large"
          startIcon={<IconifyIcon icon="material-symbols:save-rounded" />}
          sx={{ px: 4, borderRadius: 2 }}
        >
          Create User
        </Button>
      </Box>
    </Drawer>
  );
};

export default UserAdminDrawer;