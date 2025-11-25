

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
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import IconifyIcon from "components/base/IconifyIcon";

import './MachineRegister.css'

// Vendor type (for linking)
type Vendor = {
  id: number;
  vendorName: string;
  category?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstNumber?: string;
  address?: string;
  location?: string;
  status?: "Active" | "Inactive";
};

// Machine type
type Machine = {
  id: number;
  vendorId: number;
  machineName: string;
  password: string;
  machineMac?: string;
  machineModel?: string;
  capacityTon?: number;
  lastServiceDate?: string;
  machineType: "Company" | "ThirdParty" | "Estate";
  machineLocation?: string;
};

const initialVendors: Vendor[] = [
  {
    id: 1,
    vendorName: "TechCorp Industries",
    category: "Electronics",
    phone: "9876543210",
    email: "tech@corp.com",
    website: "https://techcorp.com",
    gstNumber: "GST123456",
    address: "12 Marine Drive, Mumbai",
    location: "Mumbai, Maharashtra",
    status: "Active",
  },
  {
    id: 2,
    vendorName: "Global Logistics",
    category: "Logistics",
    phone: "9876543211",
    email: "global@log.com",
    website: "https://globallog.com",
    gstNumber: "GST123457",
    address: "45 Industrial Estate, Delhi",
    location: "New Delhi, Delhi",
    status: "Active",
  },
  {
    id: 3,
    vendorName: "ExpressCargo Solutions",
    category: "Transport",
    phone: "9876543212",
    email: "express@cargo.com",
    website: "https://expresscargo.com",
    gstNumber: "GST123458",
    address: "99 Tech Park, Bangalore",
    location: "Bengaluru, Karnataka",
    status: "Inactive",
  },
];

const initialMachines: Machine[] = [
  {
    id: 1,
    vendorId: 1,
    machineName: "Machine A",
    password: "pass123",
    machineMac: "AA:BB:CC:DD:EE:FF",
    machineModel: "Model X",
    capacityTon: 5.5,
    lastServiceDate: "2024-01-15",
    machineType: "Company",
    machineLocation: "Mumbai, Maharashtra",
  },
  {
    id: 2,
    vendorId: 2,
    machineName: "Machine B",
    password: "secure456",
    machineMac: "11:22:33:44:55:66",
    machineModel: "Model Y",
    capacityTon: 10.0,
    lastServiceDate: "2024-06-20",
    machineType: "ThirdParty",
    machineLocation: "New Delhi, Delhi",
  },
  {
    id: 3,
    vendorId: 1,
    machineName: "Machine C",
    password: "estate789",
    machineMac: "99:88:77:66:55:44",
    machineModel: "Model Z",
    capacityTon: 2.25,
    lastServiceDate: "2024-03-10",
    machineType: "Estate",
    machineLocation: "Bengaluru, Karnataka",
  },
];

const MachineRegister: React.FC<{ onLogout?: () => void }> = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // form state (single object)
  const [form, setForm] = useState<Machine>({
    id: 0,
    vendorId: 0,
    machineName: "",
    password: "",
    machineMac: "",
    machineModel: "",
    capacityTon: undefined,
    lastServiceDate: "",
    machineType: "Company",
    machineLocation: "",
  });

  useEffect(() => {
    // Load mock machines and vendors on first render
    setMachines(initialMachines);
    setVendors(initialVendors);
  }, []);

  // open drawer for add
  const handleOpenAdd = () => {
    setEditingMachine(null);
    setForm({
      id: 0,
      vendorId: 0,
      machineName: "",
      password: "",
      machineMac: "",
      machineModel: "",
      capacityTon: undefined,
      lastServiceDate: "",
      machineType: "Company",
      machineLocation: "",
    });
    setFormError(null);
    setDrawerOpen(true);
  };

  // open drawer for edit
  const handleOpenEdit = (m: Machine) => {
    setEditingMachine(m);
    setForm({ ...m });
    setFormError(null);
    setDrawerOpen(true);
  };

  // close drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingMachine(null);
    setFormError(null);
  };

  // validate basic fields
  const validate = (): boolean => {
    if (!form.machineName || !form.machineName.trim()) {
      setFormError("Machine name is required.");
      return false;
    }
    if (!form.password || !form.password.trim()) {
      setFormError("Password is required.");
      return false;
    }
    if (!form.vendorId || form.vendorId <= 0) {
      setFormError("Please select a vendor.");
      return false;
    }
    setFormError(null);
    return true;
  };

  // save machine (add or update)
  const handleSave = () => {
    if (!validate()) return;

    if (editingMachine) {
      // update
      setMachines((prev) => prev.map((p) => (p.id === editingMachine.id ? { ...form, id: editingMachine.id } : p)));
    } else {
      // add
      const newMachine: Machine = { ...form, id: Date.now() };
      setMachines((prev) => [newMachine, ...prev]);
    }

    handleCloseDrawer();
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this machine?")) return;
    setMachines((prev) => prev.filter((m) => m.id !== id));
  };

  // update form field helper
  const setField = (key: keyof Machine, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // drawer width responsive:
  const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

  return (
    <div className="vm-root">
      <main className="vm-content">
        <Box className="vm-header">
          <Typography variant="h4">Machine Register</Typography>

          <div className="vm-actions">
            <Button
              variant="contained"
              startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
              onClick={handleOpenAdd}
              className="add-vendor-btn"
            >
              Add Machine
            </Button>
          </div>
        </Box>

        {/* TABLE VERSION */}
        <TableContainer className="vm-table-container">
          <Table className="vm-table">
            <TableHead className="vm-table-header">
              <TableRow className="vm-table-row">
                <TableCell>Machine Name</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Capacity (tons)</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Last Service</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {machines.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Typography variant="subtitle1" className="vm-row-title">
                      {m.machineName}
                    </Typography>
                  </TableCell>

                  <TableCell>{vendors.find(v => v.id === m.vendorId)?.vendorName || "—"}</TableCell>
                  <TableCell>{m.machineType}</TableCell>
                  <TableCell>{m.capacityTon ? `${m.capacityTon} tons` : "—"}</TableCell>
                  <TableCell>{m.machineLocation || "—"}</TableCell>

                  <TableCell>
                    {m.lastServiceDate ? new Date(m.lastServiceDate).toLocaleDateString() : "—"}
                  </TableCell>

                  <TableCell align="right" className="vm-action-cell">
                    <Button
                      onClick={() => handleOpenEdit(m)}
                      className="vm-btn vm-action-btn-edit"
                    >
                      Edit
                      <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                    </Button>

                    <Button
                      onClick={() => handleDelete(m.id)}
                      className="vm-btn vm-action-btn-delete"
                    >
                      Delete
                      <IconifyIcon icon="wpf:delete" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>

      {/* Right drawer - slides in from right; full width on small screens */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: drawerWidth ,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
            maxWidth: "100%",
            borderTopLeftRadius: { xs: 0, md: 12 },
            borderBottomLeftRadius: { xs: 0, md: 12 },
            height: { xs: "100vh", md: "100vh" },
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <Box className="drawer-header">
          <Typography variant="h6">{editingMachine ? "Edit Machine" : "Add New Machine"}</Typography>
          <IconButton onClick={handleCloseDrawer} aria-label="close">
            <IconifyIcon icon="material-symbols:close-rounded" />
          </IconButton>
        </Box>

        <Box className="drawer-content">
          {formError && <Box className="form-error">{formError}</Box>}

          <Stack spacing={2}>
            <TextField
              label="Machine Name"
              placeholder="Enter machine name"
              fullWidth
              value={form.machineName}
              onChange={(e) => setField("machineName", e.target.value)}
            />

            <TextField
              label="Vendor"
              select
              fullWidth
              value={form.vendorId}
              onChange={(e) => setField("vendorId", Number(e.target.value))}
            >
              {vendors.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.vendorName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Password"
              type="password"
              placeholder="Enter password"
              fullWidth
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="MAC Address"
                placeholder="e.g., AA:BB:CC:DD:EE:FF"
                fullWidth
                value={form.machineMac || ""}
                onChange={(e) => setField("machineMac", e.target.value)}
              />
              <TextField
                label="Machine Model"
                placeholder="e.g., Model X"
                fullWidth
                value={form.machineModel || ""}
                onChange={(e) => setField("machineModel", e.target.value)}
              />
            </Stack>

            <TextField
              label="Capacity (tons)"
              type="number"
              // step="0.01"
              placeholder="e.g., 5.5"
              fullWidth
              value={form.capacityTon ?? ""}
              onChange={(e) => setField("capacityTon", e.target.value ? parseFloat(e.target.value) : undefined)}
            />

            <TextField
              label="Last Service Date"
              type="date"
              fullWidth
              value={form.lastServiceDate || ""}
              onChange={(e) => setField("lastServiceDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Machine Type"
              select
              fullWidth
              value={form.machineType}
              onChange={(e) => setField("machineType", e.target.value as "Company" | "ThirdParty" | "Estate")}
            >
              <MenuItem value="Company">Company</MenuItem>
              <MenuItem value="ThirdParty">ThirdParty</MenuItem>
              <MenuItem value="Estate">Estate</MenuItem>
            </TextField>

            <TextField
              label="Machine Location"
              placeholder="e.g., City, State"
              fullWidth
              value={form.machineLocation || ""}
              onChange={(e) => setField("machineLocation", e.target.value)}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
              <Button variant="text" className="cancel-button" onClick={handleCloseDrawer} startIcon={<IconifyIcon icon="material-symbols:close-rounded" /> }>
                Cancel
              </Button>

              <Button variant="contained" className="edit-button" onClick={handleSave} startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}>
                {editingMachine ? "Update Machine" : "Save Machine"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </div>
  );
};

export default MachineRegister;