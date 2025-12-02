import React, { useEffect, useState } from "react";
import { ChangeEvent, useMemo } from "react";
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
  InputAdornment,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  debounce,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import IconifyIcon from "components/base/IconifyIcon";
import { GridApi, useGridApiRef } from '@mui/x-data-grid';



// User type
type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  role?: "Admin" | "Manager" | "Operator" | "Viewer";
  department?: string;
  designation?: string;
  address?: string;
  location?: string;
  status?: "Active" | "Inactive";
};

const initialUsers: User[] = [
  {
    id: 1,
    username: "admin001",
    email: "admin@company.com",
    fullName: "Rajesh Kumar",
    phone: "9876543210",
    role: "Admin",
    department: "IT",
    designation: "System Administrator",
    address: "12 MG Road, Bangalore",
    location: "Bengaluru, Karnataka",
    status: "Active",
  },
  {
    id: 2,
    username: "manager001",
    email: "priya.sharma@company.com",
    fullName: "Priya Sharma",
    phone: "9876543211",
    role: "Manager",
    department: "Operations",
    designation: "Operations Manager",
    address: "45 Park Street, Kolkata",
    location: "Kolkata, West Bengal",
    status: "Active",
  },
  {
    id: 3,
    username: "operator001",
    email: "amit.patel@company.com",
    fullName: "Amit Patel",
    phone: "9876543212",
    role: "Operator",
    department: "Production",
    designation: "Machine Operator",
    address: "99 Station Road, Mumbai",
    location: "Mumbai, Maharashtra",
    status: "Inactive",
  },
];

const UserRegister: React.FC<{ onLogout?: () => void }> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [search, setSearch] = useState('');
  const apiRef = useGridApiRef<GridApi>();

   // -- Delete Dialog State --
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
 
   // -- Snackbar State --
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
 

  // form state (single object)
  const [form, setForm] = useState<User>({
    id: 0,
    username: "",
    email: "",
    fullName: "",
    phone: "",
    role: "Operator",
    department: "",
    designation: "",
    address: "",
    location: "",
    status: "Active",
  });

  useEffect(() => {
    // Load mock users on first render
    setUsers(initialUsers);
  }, []);

  // open drawer for add
  const handleOpenAdd = () => {
    setEditingUser(null);
    setForm({
      id: 0,
      username: "",
      email: "",
      fullName: "",
      phone: "",
      role: "Operator",
      department: "",
      designation: "",
      address: "",
      location: "",
      status: "Active",
    });
    setFormError(null);
    setDrawerOpen(true);
  };

  // open drawer for edit
  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setForm({ ...u });
    setFormError(null);
    setDrawerOpen(true);
  };

  // close drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingUser(null);
    setFormError(null);
  };

  // validate basic fields
  const validate = (): boolean => {
    if (!form.username || !form.username.trim()) {
      setFormError("Username is required.");
      return false;
    }
    if (!form.email || !form.email.trim()) {
      setFormError("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
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

  // save user (add or update)
  const handleSave = () => {
    if (!validate()) return;

    if (editingUser) {
      // update
      setUsers((prev) => prev.map((p) => (p.id === editingUser.id ? { ...form, id: editingUser.id } : p)));
    } else {
      // add
      const newUser: User = { ...form, id: Date.now() };
      setUsers((prev) => [newUser, ...prev]);
    }

    handleCloseDrawer();
  };


   // --- DELETE HANDLERS ---
  
  // 1. Open the Dialog
  const handleClickDelete = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 2. Confirm Deletion
  const handleConfirmDelete = () => {
    if (userToDelete !== null) {
      setUsers((prev) => prev.filter((v) => v.id !== userToDelete));
      
      // Show success message
      setSnackbarMessage("User deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // 3. Close Dialog without deleting
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // --- SNACKBAR HANDLER ---
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


//   const handleDelete = (id: number) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;
//     setUsers((prev) => prev.filter((u) => u.id !== id));
//   };

  // update form field helper
  const setField = (key: keyof User, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // drawer width responsive:
  const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

  const handleGridSearch = useMemo(() => {
    return debounce((searchValue) => {
      apiRef.current.setQuickFilterValues(
        searchValue.split(' ').filter((word: any) => word !== ''),
      );
    }, 250);
  }, [apiRef]);
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.currentTarget.value;
    setSearch(searchValue);
    handleGridSearch(searchValue);
  };

  return (
    // <Stack
    //   bgcolor="common.white"
    //   borderRadius={5}
    //   minHeight={460}
    //   height={1}
    //   mx="auto"
    //   boxShadow={theme.shadows[4]}
    // >
    <Stack
      bgcolor="background.paper"
      borderRadius={5}
      width={1}
      boxShadow={(theme) => theme.shadows[4]}
      height={1}
    >
      <Stack
        direction={{ sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        padding={3.75}
        gap={3.75}
      >
      
        <main className="vm-content">
            <Box className="vm-header">
            <Typography variant="h4">User Register</Typography>
            <TextField
              variant="outlined"
              placeholder="Search..."
              id="search-input"
              name="table-search-input"
              onChange={handleChange}
              value={search}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
                    <IconifyIcon icon="mdi:search" width={1} height={1} />
                  </InputAdornment>
                ),
              }}
              fullWidth
              sx={{ maxWidth: 330}}
            />

            <div className="vm-actions">
                <Button
                variant="contained"
                onClick={handleOpenAdd}
                className="add-vendor-btn"
                >
                Add User
                </Button>
            </div>
            </Box>

            {/* TABLE VERSION */}
            <TableContainer className="vm-table-container">
            <Table className="vm-table">
                <TableHead className="vm-table-header">
                <TableRow className="vm-table-row">
                    <TableCell className="header-name">Username</TableCell>
                    <TableCell className="header-name">Full Name</TableCell>
                    <TableCell className="header-name">Email</TableCell>
                    <TableCell className="header-name">Phone</TableCell>
                    <TableCell className="header-name">Role</TableCell>
                    <TableCell className="header-name">Department</TableCell>
                    <TableCell className="header-name">Status</TableCell>
                    <TableCell className="header-name" align="right">Actions</TableCell>
                </TableRow>
                </TableHead>

                <TableBody>
                {users.map((u) => (
                    <TableRow key={u.id}>
                    <TableCell>
                        <Typography variant="subtitle1" className="vm-row-title">
                        {u.username}
                        </Typography>
                    </TableCell>

                    <TableCell>{u.fullName || "—"}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone || "—"}</TableCell>
                    <TableCell>
                        <span className="status-badge" style={{ 
                        backgroundColor: u.role === "Admin" ? "#e3f2fd" : 
                                        u.role === "Manager" ? "#f3e5f5" : 
                                        u.role === "Operator" ? "#fff3e0" : "#f5f5f5",
                        color: u.role === "Admin" ? "#1565c0" : 
                                u.role === "Manager" ? "#7b1fa2" : 
                                u.role === "Operator" ? "#e65100" : "#616161"
                        }}>
                        {u.role}
                        </span>
                    </TableCell>
                    <TableCell>{u.department || "—"}</TableCell>

                    <TableCell>
                        <span
                        className={`status-badge ${
                            u.status === "Active" ? "active" : "inactive"
                        }`}
                        >
                        {u.status}
                        </span>
                    </TableCell>

                    <TableCell align="right" className="vm-action-cell">
                        <Button
                        onClick={() => handleOpenEdit(u)}
                        className="vm-btn vm-action-btn-edit"
                        >
                        <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                        </Button>

                        <Button
                        onClick={() => handleClickDelete(u.id)}
                        className="vm-btn vm-action-btn-delete"
                        >
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
                width: drawerWidth,
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
            <Typography variant="h6">
                {editingUser ? "Edit User" : "Add New User"}
            </Typography>
            <IconButton onClick={handleCloseDrawer} aria-label="close">
                <IconifyIcon icon="material-symbols:close-rounded" />
            </IconButton>
            </Box>

            <Box className="drawer-content">
            {formError && <Box className="form-error">{formError}</Box>}

            <Stack spacing={2}>
                <TextField
                label="Username"
                placeholder="Enter unique username"
                fullWidth
                value={form.username}
                onChange={(e) => setField("username", e.target.value)}
                helperText="Unique identifier for login"
                />

                <TextField
                label="Full Name"
                placeholder="Enter full name"
                fullWidth
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                    label="Email"
                    placeholder="e.g., user@example.com"
                    fullWidth
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                />
                <TextField
                    label="Phone"
                    placeholder="e.g., +91 9876543210"
                    fullWidth
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                    label="Role"
                    select
                    fullWidth
                    value={form.role}
                    onChange={(e) => setField("role", e.target.value as "Admin" | "Manager" | "Operator" | "Viewer")}
                >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Operator">Operator</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                </TextField>

                <TextField
                    label="Status"
                    select
                    fullWidth
                    value={form.status}
                    onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
                >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                    label="Department"
                    placeholder="e.g., IT, Operations, Sales"
                    fullWidth
                    value={form.department}
                    onChange={(e) => setField("department", e.target.value)}
                />
                <TextField
                    label="Designation"
                    placeholder="e.g., Manager, Engineer"
                    fullWidth
                    value={form.designation}
                    onChange={(e) => setField("designation", e.target.value)}
                />
                </Stack>

                <TextField
                label="Address"
                placeholder="Building, Street, Area, Pincode"
                fullWidth
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                />

                <TextField
                label="Location (City / State)"
                placeholder="e.g., Chennai, Tamil Nadu"
                fullWidth
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
                <Button 
                    variant="text" 
                    className="cancel-button" 
                    onClick={handleCloseDrawer}
                >
                    Cancel
                </Button>

                <Button 
                    variant="contained" 
                    className="edit-button" 
                    onClick={handleSave}
                >
                    {editingUser ? "Update User" : "Save User"}
                </Button>
                </Stack>
            </Stack>
            </Box>
        </Drawer>
        {/* --- DELETE CONFIRMATION DIALOG --- */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography textAlign="center" color="text.secondary">
              Are you sure you want to delete this User?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={handleCancelDelete}
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleConfirmDelete}
              color="error"
              startIcon={<IconifyIcon icon="wpf:delete" />}
            >
              Delete
            </Button>
          </DialogActions> 
        </Dialog>
    
        {/* --- SUCCESS SNACKBAR --- */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Stack>  
    </Stack>
  );
};

export default UserRegister;