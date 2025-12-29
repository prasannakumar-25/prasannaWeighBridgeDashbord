

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
  Divider,
  Paper,
  Avatar,
  Collapse,
  alpha,
  InputAdornment,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { Weighbridge, Machine } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";
import "../../RegisterManagement/MachineRegister/MachineRegister.css";

import weighBridgeApi from "services/weighBridgeApi";

interface WeighbridgeDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Weighbridge) => void;
  initialData: Weighbridge | null;
  machines: Machine[];
  loading?: boolean;
}

const WeighbridgeDrawer: React.FC<WeighbridgeDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  machines,
  loading = false,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? 800 : "100%";

  // State for form data and specific field errors
  const [form, setForm] = useState<Weighbridge>({
    Weighbridge_Id: 0,
    Machine_Id: undefined,
    Serial_no: "",
    Port: "COM4",
    Baud_rate: "19200",
    Data_bit: 8,
    Stop_bit: 1,
    Party: "None",
    Created_at: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Weighbridge, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Reset or Populate form when Drawer opens
  useEffect(() => {
    if (open) {
      setErrors({});
      setGlobalError(null);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm({
          Weighbridge_Id: 0,
          Machine_Id: undefined,
          Serial_no: "",
          Port: "COM4",
          Baud_rate: "19200",
          Data_bit: 8,
          Stop_bit: 1,
          Party: "None",
          Created_at: new Date().toISOString(),
        });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof Weighbridge, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Weighbridge, string>> = {};
    let isValid = true;

    if (!form.Machine_Id) {
      newErrors.Machine_Id = "Machine selection is required";
      isValid = false;
    }
    if (!form.Serial_no?.trim()) {
      newErrors.Serial_no = "Serial Number is required";
      isValid = false;
    }
    if (!form.Baud_rate) {
        newErrors.Baud_rate = "Baud Rate is required";
        isValid = false;
    }
    if (!form.Party) {
        newErrors.Party = "Parity is required";
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
    if (!validate()) return;
    const payload = {
      Machine_Id: 1,
      Serial_no: form.Serial_no,
      Port: form.Port,
      Baud_rate: form.Baud_rate,
      Data_bit: form.Data_bit,
      Stop_bit: form.Stop_bit,
      Party: form.Party,
      Created_at: form.Created_at
    }
    
    try {
      let response 
      if (initialData && form.Weighbridge_Id > 0) {
        response = await weighBridgeApi.updateWeighbridgeDetails(form.Weighbridge_Id, payload)

      } else {
        response = await weighBridgeApi.addWeighbridgeDetails(payload);
      }
      if (response?.success) {
         console.log("Success", response);
         onSave(response.data)
         onClose();
      }
    } catch (error) {
      console.error("Error subminting form:" , error)
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
              width: 50,
              height: 50,
              boxShadow: theme.shadows[3],
            }}
          >
            <IconifyIcon icon="mdi:scale-balance" width={32} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
                {initialData ? "Edit Weighbridge" : "New Weighbridge"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {initialData ? "Update device parameters" : "Configure new weighing hardware"}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ 
          color: "black", 
          // bgcolor: "rgba(255,255,255,0.1)", 
          '&:hover': { bgcolor: "rgba(255,255,255,0.2)" } 
      }}>
            <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      {/* --- Content Area --- */}
      <Box sx={{ p: 3, overflowY: 'auto', flex: 1, bgcolor: theme.palette.background.default }}>
        <Stack spacing={3}>
            
            {globalError && (
                <Collapse in={!!globalError}>
                    <Alert severity="error" onClose={() => setGlobalError(null)} sx={{ mb: 2 }}>
                        {globalError}
                    </Alert>
                </Collapse>
            )}

            {/* Section 1: Device Identity */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                    Device Identity
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                        label="Associated Machine"
                        className="input-bg-color label-black"
                        select
                        fullWidth
                        value={form.Machine_Id || ""}
                        onChange={(e) => setField("Machine_Id", Number(e.target.value))}
                        disabled={loading}
                        error={!!errors.Machine_Id}
                        helperText={errors.Machine_Id}
                        >
                        <MenuItem value={0} disabled sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Select a Machine
                        </MenuItem>
                        {machines.map((m) => (
                            <MenuItem key={m.id} value={m.id}>
                            {m.machineName}
                            </MenuItem>
                        ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                        label="Serial Number"
                        className="input-bg-color label-black"
                        placeholder="e.g. WB-SN-2024-X"
                        fullWidth
                        value={form.Serial_no}
                        onChange={(e) => setField("Serial_no", e.target.value)}
                        disabled={loading}
                        error={!!errors.Serial_no}
                        helperText={errors.Serial_no}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconifyIcon icon="mdi:barcode" color="action.active" />
                                </InputAdornment>
                            )
                        }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Section 2: Communication Settings */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderColor: alpha(theme.palette.divider, 0.6) }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'block' }}>
                    Serial Communication
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Port"
                            className="input-bg-color label-black"
                            select
                            fullWidth
                            value={form.Port}
                            onChange={(e) => setField("Port", e.target.value)}
                            disabled={loading}
                        >
                            <MenuItem value="COM1">COM1</MenuItem>
                            <MenuItem value="COM2">COM2</MenuItem>
                            <MenuItem value="COM3">COM3</MenuItem>
                            <MenuItem value="COM4">COM4</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Baud Rate"
                            className="input-bg-color label-black"
                            placeholder="e.g. 9600"
                            fullWidth
                            value={form.Baud_rate}
                            onChange={(e) => setField("Baud_rate", e.target.value)}
                            disabled={loading}
                            error={!!errors.Baud_rate}
                            helperText={errors.Baud_rate}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">bps</InputAdornment>
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Data Bit"
                            className="input-bg-color label-black"
                            type="number"
                            fullWidth
                            value={form.Data_bit}
                            onChange={(e) => setField("Data_bit", Number(e.target.value))}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Stop Bit"
                            className="input-bg-color label-black"
                            type="number"
                            fullWidth
                            value={form.Stop_bit}
                            onChange={(e) => setField("Stop_bit", Number(e.target.value))}
                            disabled={loading}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Parity"
                            className="input-bg-color label-black"
                            select
                            fullWidth
                            value={form.Party}
                            onChange={(e) => setField("Party", e.target.value)}
                            disabled={loading}
                            error={!!errors.Party}
                            helperText={errors.Party}
                        >
                             <MenuItem value="None">None</MenuItem>
                             <MenuItem value="Even">Even</MenuItem>
                             <MenuItem value="Odd">Odd</MenuItem>
                             <MenuItem value="Mark">Mark</MenuItem>
                             <MenuItem value="Space">Space</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>
        </Stack>
      </Box>

      {/* Footer Actions */}
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
            {initialData ? "Save Configuration" : "Create Device"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default WeighbridgeDrawer;