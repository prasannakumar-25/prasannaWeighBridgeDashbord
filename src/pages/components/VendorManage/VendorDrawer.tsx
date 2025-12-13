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
  const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

  const [formError, setFormError] = useState<string | null>(null);

  // Default Form
  const defaultForm: Vendor = {
    id: 0,
    vendorName: "",
    phone: "",
    email: "",
    gstNumber: "",
    address: "",
    website: "",
  };

  const [form, setForm] = useState<Vendor>(defaultForm);

  useEffect(() => {
    if (open) {
      setFormError(null);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm(defaultForm);
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof Vendor, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    if (!form.vendorName || !form.vendorName.trim()) {
      setFormError("Vendor name is required.");
      return false;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
      setFormError("Please enter a valid 10-digit phone number.");
      return false;
    }
    setFormError(null);
    return true;
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
          p: 3,
          borderTopLeftRadius: { xs: 0, md: 12 },
          borderBottomLeftRadius: { xs: 0, md: 12 },
        },
      }}
    >
      <Box className="drawer-header" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
            {initialData ? "Edit Vendor" : "Add New Vendor"}
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
            <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      <Box className="drawer-content">
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
                label="Vendor Name (Business)"
                className="input-bg-color label-black"
                placeholder="Enter business or company name"
                fullWidth
                value={form.vendorName}
                disabled={loading}
                onChange={(e) => setField("vendorName", e.target.value)}
                helperText="Public-facing company / vendor name"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
                label="Email"
                className="input-bg-color label-black"
                placeholder="e.g., vendor@example.com"
                fullWidth
                value={form.email || ""}
                disabled={loading}
                onChange={(e) => setField("email", e.target.value)}
            />
          </Stack>

          <TextField
              label="Address (City / State)"
              className="input-bg-color label-black"
              placeholder="e.g., Chennai, Tamil Nadu"
              fullWidth
              value={form.address || ""}
              disabled={loading}
              onChange={(e) => setField("address", e.target.value)}
          />

          <TextField
            label="Phone"
            className="input-bg-color label-black"
            placeholder="e.g., +91 9876543210"
            fullWidth
            value={form.phone || ""}
            disabled={loading}
            onChange={(e) => setField("phone", e.target.value)}
          />


          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
                label="GST / Tax Number"
                className="input-bg-color label-black"
                placeholder="Enter GST / tax identification number"
                fullWidth
                value={form.gstNumber || ""}
                disabled={loading}
                onChange={(e) => setField("gstNumber", e.target.value)}
            />
          </Stack> 

          <TextField
              label="Website"
              className="input-bg-color label-black"
              placeholder="e.g., https://www.company.com"
              fullWidth
              value={form.website || ""}
              disabled={loading}
              onChange={(e) => setField("website", e.target.value)}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
            <Button variant="text" className="cancel-button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" className="edit-button" onClick={handleSubmit} disabled={loading}>
              {initialData ? "Update Vendor" : "Save Vendor"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default VendorDrawer;