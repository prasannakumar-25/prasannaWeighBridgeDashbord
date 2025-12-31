


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
  InputAdornment,
  useMediaQuery,
  useTheme,
  Grid,
  Paper,
  Avatar,
  Collapse,
  alpha,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { IPCamera, Machine } from "pages/RegisterManagement/IPCameraRegister/IPCameraRegister"; 
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import ipCameraApi from "services/ipCameraApi";

interface IPCameraDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: IPCamera) => void;
  initialData: IPCamera | null;
  machineList: Machine[];
  loading: boolean;
}

const IPCameraDrawer: React.FC<IPCameraDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  machineList,
  loading,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 800 : "100%";

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<IPCamera>({
    Camera_Id: 0,
    Machine_Id: 0,
    Camera_name: "",
    IP_address: "",
    RTSP_URL: "",
    HTTP_URL: "",
    Username: "",
    Password: "",
    Mac_address: "",
    Status: "Offline",
    Location: "",
    Installed_date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IPCamera, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Reset or Populate form
  useEffect(() => {
    if (open) {
      setErrors({});
      setGlobalError(null);
      setShowPassword(false);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm({
            Camera_Id: 0,
            Machine_Id: 0,
            Camera_name: "",
            IP_address: "",
            RTSP_URL: "",
            HTTP_URL: "",
            Username: "",
            Password: "",
            Mac_address: "",
            Status: "Offline",
            Location: "",
            Installed_date: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof IPCamera, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error on type
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof IPCamera, string>> = {};
    let isValid = true;

    if (!form.Camera_name?.trim()) {
      newErrors.Camera_name = "Camera name is required";
      isValid = false;
    }
    if (!form.Machine_Id || form.Machine_Id === 0) {
      newErrors.Machine_Id = "Associated Machine is required";
      isValid = false;
    }
    if (!form.IP_address?.trim()) {
      newErrors.IP_address = "IP Address is required";
      isValid = false;
    }
    // Optional: Validate IP format regex if needed
    
    setErrors(newErrors);

    if (!isValid) {
        setGlobalError("Please correct the highlighted errors below.");
    } else {
        setGlobalError(null);
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload =  {
      Machine_Id: form.Machine_Id,
      Camera_name: form.Camera_name,
      IP_address: form.IP_address,
      RTSP_URL: form.RTSP_URL,
      HTTP_URL: form.HTTP_URL,
      Username: form.Username,
      Password: form.Password,
      Mac_address: form.Mac_address,
      Status: form.Status,
      Location: form.Location,
      Installed_date: form.Installed_date,
    }
    try {
      let response 
      if (initialData && form.Camera_Id > 0) {
        response = await ipCameraApi.updateIPcameraDetails(form.Camera_Id, payload);

      } else {
        response = await ipCameraApi.addIPcameraDetails(payload);

      }
      if (response?.success) {
        console.log("Success", response);
        onSave(response.data)
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form: ", error)
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
            <IconifyIcon icon="mdi:cctv" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {initialData ? "Edit Camera" : "New Camera"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {initialData ? "Update surveillance details" : "Register a new IP camera"}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ 
          color: "black", 
          // bgcolor: "rgba(255,255,255,0.1)", 
          // '&:hover': { bgcolor: "rgba(255,255,255,0.2)" } 
          }}>
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

          {/* Section 1: General Information */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                General Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Camera Name"
                        className="input-bg-color  "
                        placeholder="e.g. Main Gate Camera 01"
                        fullWidth
                        value={form.Camera_name}
                        onChange={(e) => setField("Camera_name", e.target.value)}
                        disabled={loading}
                        error={!!errors.Camera_name}
                        helperText={errors.Camera_name}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:videocam-outline" /></InputAdornment>
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Associated Machine"
                        className="input-bg-color label-black"
                        select
                        fullWidth
                        value={form.Machine_Id || 0}
                        onChange={(e) => setField("Machine_Id", Number(e.target.value))}
                        disabled={loading}
                        error={!!errors.Machine_Id}
                        helperText={errors.Machine_Id}
                    >
                        <MenuItem value={0} disabled sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Select Machine
                        </MenuItem>
                        {machineList.map((m) => (
                        <MenuItem key={m.Machine_Id} value={m.Machine_Id}>
                            {m.Machine_name}
                        </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Status"
                        className="input-bg-color label-black"
                        select
                        fullWidth
                        value={form.Status}
                        onChange={(e) => setField("Status", e.target.value)}
                        disabled={loading}
                    >
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Offline">Offline</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Location"
                        className="input-bg-color label-black"
                        placeholder="e.g. Main Entrance"
                        fullWidth
                        value={form.Location || ""}
                        onChange={(e) => setField("Location", e.target.value)}
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="end">
                              <IconifyIcon icon="mdi:map-marker-outline" />
                            </InputAdornment>
                          ),
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Installed Date"
                        className="input-bg-color label-black"
                        type="date"
                        fullWidth
                        value={form.Installed_date || ""}
                        onChange={(e) => setField("Installed_date", e.target.value)}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
          </Paper>

          {/* Section 2: Network Configuration */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                Network Configuration
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="IP Address"
                        className="input-bg-color label-black"
                        placeholder="192.168.1.X"
                        fullWidth
                        value={form.IP_address}
                        onChange={(e) => setField("IP_address", e.target.value)}
                        disabled={loading}
                        error={!!errors.IP_address}
                        helperText={errors.IP_address}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:ip-network" /></InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="MAC Address"
                        className="input-bg-color label-black"
                        placeholder="AA:BB:CC:DD:EE:FF"
                        fullWidth
                        value={form.Mac_address || ""}
                        onChange={(e) => setField("Mac_address", e.target.value)}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="RTSP URL"
                        className="input-bg-color label-black"
                        placeholder="rtsp://user:pass@ip:port/stream"
                        fullWidth
                        value={form.RTSP_URL || ""}
                        onChange={(e) => setField("RTSP_URL", e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:cast-connected" /></InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="HTTP URL"
                        placeholder="http://ip:port/video"
                        className="input-bg-color label-black"
                        fullWidth
                        value={form.HTTP_URL || ""}
                        onChange={(e) => setField("HTTP_URL", e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:web" /></InputAdornment>
                        }}
                    />
                </Grid>
            </Grid>
          </Paper>

          {/* Section 3: Credentials */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                Security Credentials
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Username"
                        className="input-bg-color label-black"
                        fullWidth
                        value={form.Username || ""}
                        onChange={(e) => setField("Username", e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:account-outline" /></InputAdornment>
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Password"
                        className="input-bg-color label-black"
                        type={showPassword ? 'text' : 'Password'}
                        fullWidth
                        value={form.Password || ""}
                        onChange={(e) => setField("Password", e.target.value)}
                        disabled={loading}
                        InputProps={{
                        startAdornment: <InputAdornment position="end"><IconifyIcon icon="mdi:lock-outline" /></InputAdornment>,
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
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
          alignItems: "center"
        }}
      >
         <Button onClick={onClose} color="inherit" sx={{ color: 'text.secondary' }}>
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
                boxShadow: theme.shadows[4]
            }}
          >
            {initialData ? "Save Changes" : "Create Camera"}
          </Button>
      </Box>
    </Drawer>
  );
};

export default IPCameraDrawer;

