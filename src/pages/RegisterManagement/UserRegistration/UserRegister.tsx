// import React, { useEffect, useState } from "react";
// import { ChangeEvent, useMemo } from "react";
// import {
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
//   useMediaQuery,
//   useTheme,
//   Table,
//   InputAdornment,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   debounce,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
// } from "@mui/material";

// import IconifyIcon from "components/base/IconifyIcon";
// import { GridApi, useGridApiRef } from '@mui/x-data-grid';



// // User type
// type User = {
//   id: number;
//   username: string;
//   password: "",
//   email: string;
//   fullName?: string;
//   phone?: string;
//   role?: "Admin" | "Manager" | "Operator" | "Viewer";
//   department?: string;
//   // designation?: string;
//   // address?: string;s
//   // location?: string;
//   status?: "Active" | "Inactive";
// };

// // const initialUsers: User[] = [
// //   {
// //     id: 1,
// //     username: "admin001",
// //     email: "admin@company.com",
// //     fullName: "Rajesh Kumar",
// //     phone: "9876543210",
// //     role: "Admin",
// //     department: "IT",
// //     designation: "System Administrator",
// //     address: "12 MG Road, Bangalore",
// //     location: "Bengaluru, Karnataka",
// //     status: "Active",
// //   },
// //   {
// //     id: 2,
// //     username: "manager001",
// //     email: "priya.sharma@company.com",
// //     fullName: "Priya Sharma",
// //     phone: "9876543211",
// //     role: "Manager",
// //     department: "Operations",
// //     designation: "Operations Manager",
// //     address: "45 Park Street, Kolkata",
// //     location: "Kolkata, West Bengal",
// //     status: "Active",
// //   },
// //   {
// //     id: 3,
// //     username: "operator001",
// //     email: "amit.patel@company.com",
// //     fullName: "Amit Patel",
// //     phone: "9876543212",
// //     role: "Operator",
// //     department: "Production",
// //     designation: "Machine Operator",
// //     address: "99 Station Road, Mumbai",
// //     location: "Mumbai, Maharashtra",
// //     status: "Inactive",
// //   },
// // ];

// const UserRegister: React.FC<{ onLogout?: () => void }> = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false)

//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

//   const [search, setSearch] = useState('');
//   const apiRef = useGridApiRef<GridApi>();

//    // -- Delete Dialog State --
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<number | null>(null);
 
//    // -- Snackbar State --
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//     // -- Show password --
//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   // Filter State (Filter by Machine)
//   const [filterUserId, setFilterUserId] = useState<number | "">("");
 

//   // form state (single object)
//   const [form, setForm] = useState<User>({
//     id: 0,
//     username: "",
//     password: "",
//     email: "",
//     fullName: "",
//     phone: "",
//     role: "Operator",
//     department: "",
//     // designation: "",
//     // address: "",
//     // location: "",
//     status: "Active",
//   });

//   useEffect(() => {
//     // Load mock users on first render
//     // setUsers(initialUsers);
//   }, []);

//   // open drawer for add
//   const handleOpenAdd = () => {
//     setEditingUser(null);
//     setForm({
//       id: 0,
//       username: "",
//       password: "",
//       email: "",
//       fullName: "",
//       phone: "",
//       role: "Operator",
//       department: "",
//       // designation: "",
//       // address: "",
//       // location: "",
//       status: "Active",
//     });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   // open drawer for edit
//   const handleOpenEdit = (u: User) => {
//     setEditingUser(u);
//     setForm({ ...u });
//     setFormError(null);
//     setDrawerOpen(true);
//   };

//   // close drawer
//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingUser(null);
//     setFormError(null);
//   };

//   // validate basic fields
//   const validate = (): boolean => {
//     if (!form.username || !form.username.trim()) {
//       setFormError("Username is required.");
//       return false;
//     }
//     if (!form.email || !form.email.trim()) {
//       setFormError("Email is required.");
//       return false;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
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

//   // save user (add or update)
//   const handleSave = () => {
//     if (!validate()) return;

//     if (editingUser) {
//       // update
//       setUsers((prev) => prev.map((p) => (p.id === editingUser.id ? { ...form, id: editingUser.id } : p)));
//       setSnackbarMessage("User updated successfully");
//     } else {
//       // add new
//       const newUser: User = { ...form, id: Date.now() };
//       setUsers((prev) => [newUser, ...prev]);
//       setSnackbarMessage("User added successfully");
//     }
//     setSnackbarOpen(true);
//     handleCloseDrawer();
//   };


//    // --- DELETE HANDLERS ---
  
//   // 1. Open the Dialog
//   const handleClickDelete = (id: number) => {
//     setUserToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   // 2. Confirm Deletion
//   const handleConfirmDelete = () => {
//     if (userToDelete !== null) {
//       setUsers((prev) => prev.filter((v) => v.id !== userToDelete));
      
//       // Show success message
//       setSnackbarMessage("User deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   // 3. Close Dialog without deleting
//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   // --- SNACKBAR HANDLER ---
//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };


// //   const handleDelete = (id: number) => {
// //     if (!confirm("Are you sure you want to delete this user?")) return;
// //     setUsers((prev) => prev.filter((u) => u.id !== id));
// //   };

//   // update form field helper
//   const setField = (key: keyof User, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   // drawer width responsive:
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const handleGridSearch = useMemo(() => {
//     return debounce((searchValue) => {
//       apiRef.current.setQuickFilterValues(
//         searchValue.split(' ').filter((word: any) => word !== ''),
//       );
//     }, 250);
//   }, [apiRef]);

//     // Filter Logic: Combine Text Search + Dropdown Filter
//   const filteredUsers = users.filter((us) => {
//     const matchesSearch = 
//         us.email.toLowerCase().includes(search.toLowerCase())
    
//     const matchesMachine = filterUserId === "" || us.id === filterUserId;

//     return matchesSearch && matchesMachine;
//   });
  
//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const searchValue = event.currentTarget.value;
//     setSearch(searchValue);
//     handleGridSearch(searchValue);
//   };

//   return (
//     // <Stack
//     //   bgcolor="common.white"
//     //   borderRadius={5}
//     //   minHeight={460}
//     //   height={1}
//     //   mx="auto"
//     //   boxShadow={theme.shadows[4]}
//     // >
//     <div className="vm-root">
//       <Stack
//         bgcolor="background.paper"
//         borderRadius={5}
//         width={1}
//         boxShadow={(theme) => theme.shadows[4]}
//         // height={1}
//       >
//         {/* <Stack
//           direction={{ sm: 'row' }}
//           justifyContent="space-between"
//           alignItems="center"
//           padding={3.75}
//           gap={3.75}
//         > */}
        
//           <main className="vm-content">
//               <Box className="vm-header">
//               <Typography variant="h4">User Register</Typography>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search..."
//                 id="search-input"
//                 name="table-search-input"
//                 onChange={handleChange}
//                 value={search}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
//                       <IconifyIcon icon="mdi:search" width={1} height={1} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 fullWidth
//                 sx={{ maxWidth: 330,
//                   p: 2,
//                   mr: 'auto',
//                 }}
//               />

//               <div className="vm-actions">
//                   <Button
//                   variant="contained"
//                   onClick={handleOpenAdd}
//                   className="add-vendor-btn"
//                   >
//                   Add User
//                   </Button>
//               </div>
//               </Box>

//               {/* TABLE VERSION */}
//               <TableContainer className="vm-table-container">
//               <Table className="vm-table">
//                   <TableHead className="vm-table-header">
//                   <TableRow className="vm-table-row">
//                       <TableCell className="header-name">Username</TableCell>
//                       <TableCell className="header-name">Full Name</TableCell>
//                       <TableCell className="header-name">Email</TableCell>
//                       <TableCell className="header-name">Phone</TableCell>
//                       <TableCell className="header-name">Role</TableCell>
//                       <TableCell className="header-name">Department</TableCell>
//                       {/* <TableCell className="header-name">Designation</TableCell>
//                       <TableCell className="header-name">Address</TableCell> */}
//                       <TableCell className="header-name">Status</TableCell>
//                       <TableCell className="header-name" align="right">Actions</TableCell>
//                   </TableRow>
//                   </TableHead>

//                   <TableBody>
//                   {users.map((u) => (
//                       <TableRow key={u.id}>
//                       <TableCell>
//                           <Typography variant="subtitle1" className="vm-row-title">
//                           {u.username}
//                           </Typography>
//                       </TableCell>

//                       <TableCell>{u.fullName || "—"}</TableCell>
//                       <TableCell>{u.email}</TableCell>
//                       <TableCell>{u.phone || "—"}</TableCell>
//                       <TableCell>
//                           <span className="status-badge" style={{ 
//                           backgroundColor: u.role === "Admin" ? "#e3f2fd" : 
//                                           u.role === "Manager" ? "#f3e5f5" : 
//                                           u.role === "Operator" ? "#fff3e0" : "#f5f5f5",
//                           color: u.role === "Admin" ? "#1565c0" : 
//                                   u.role === "Manager" ? "#7b1fa2" : 
//                                   u.role === "Operator" ? "#e65100" : "#616161"
//                           }}>
//                           {u.role}
//                           </span>
//                       </TableCell>
//                       <TableCell>{u.department || "—"}</TableCell>
//                       {/* <TableCell>{u.designation || "—"}</TableCell>
//                       <TableCell>{u.address || "—"}</TableCell> */}

//                       <TableCell>
//                           <span
//                           className={`status-badge ${
//                               u.status === "Active" ? "active" : "inactive"
//                           }`}
//                           >
//                           {u.status}
//                           </span>
//                       </TableCell>

//                       <TableCell align="right" className="vm-action-cell">
//                           <Button
//                           onClick={() => handleOpenEdit(u)}
//                           className="vm-btn vm-action-btn-edit"
//                           >
//                           <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                           </Button>

//                           <Button
//                           onClick={() => handleClickDelete(u.id)}
//                           className="vm-btn vm-action-btn-delete"
//                           >
//                           <IconifyIcon icon="wpf:delete" />
//                           </Button>
//                       </TableCell>
//                       </TableRow>
//                   ))}
//                   {filteredUsers.length === 0 && (
//                       <TableRow>
//                           <TableCell colSpan={10} align="center">
//                               No User found.
//                           </TableCell>
//                       </TableRow>
//                   )}
//                   </TableBody>
//               </Table>
//               </TableContainer>
              
//           </main>

//           {/* Right drawer - slides in from right; full width on small screens */}
//           <Drawer
//               anchor="right"
//               open={drawerOpen}
//               onClose={handleCloseDrawer}
//               PaperProps={{
//               sx: {
//                   width: drawerWidth,
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   padding: "30px",
//                   maxWidth: "100%",
//                   borderTopLeftRadius: { xs: 0, md: 12 },
//                   borderBottomLeftRadius: { xs: 0, md: 12 },
//                   height: { xs: "100vh", md: "100vh" },
//               },
//               }}
//               ModalProps={{ keepMounted: true }}
//           >
//               <Box className="drawer-header">
//               <Typography variant="h6">
//                   {editingUser ? "Edit User" : "Add New User"}
//               </Typography>
//               <IconButton onClick={handleCloseDrawer} aria-label="close">
//                   <IconifyIcon icon="material-symbols:close-rounded" />
//               </IconButton>
//               </Box>

//               <Box className="drawer-content">
//               {formError && <Box className="form-error">{formError}</Box>}

//               <Stack spacing={2}>
//                 <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
//                   <TextField
//                   label="Username"
//                   className="input-bg-color"
//                   placeholder="Enter unique username"
//                   fullWidth
//                   value={form.username}
//                   onChange={(e) => setField("username", e.target.value)}
//                   helperText="Unique identifier for login"
//                   />

//                   <TextField
//                   label="Full Name"
//                   className="input-bg-color"
//                   placeholder="Enter full name"
//                   fullWidth
//                   value={form.fullName}
//                   onChange={(e) => setField("fullName", e.target.value)}
//                   />
//                   </Stack>
//                   <TextField
//                   label="Password"
//                   className="input-bg-color"
//                   type={showPassword ? 'text' : "password"}
//                   placeholder="*********"
//                   fullWidth
//                   value={form.password}
//                   onChange={(e) => setField("password", e.target.value)}
//                     InputProps = {{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             aria-label="toggle password visibility"
//                             // className="input-bg-color"
//                             onClick={handleClickShowPassword}
//                             edge="end"
//                             sx={{
//                               color: 'text.secondary',
//                             }}
//                           >
//                             {showPassword ? (
//                               <IconifyIcon icon="ic:baseline-key-off" />
//                             ) : (
//                               <IconifyIcon icon="ic:baseline-key" />
//                             )}
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />

//                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                   <TextField
//                       label="Email"
//                       className="input-bg-color"
//                       placeholder="e.g., user@example.com"
//                       fullWidth
//                       value={form.email}
//                       onChange={(e) => setField("email", e.target.value)}
//                   />
//                   <TextField
//                       label="Phone"
//                       className="input-bg-color"
//                       placeholder="e.g., +91 9876543210"
//                       fullWidth
//                       value={form.phone}
//                       onChange={(e) => setField("phone", e.target.value)}
//                   />
//                   </Stack>

//                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                   <TextField
//                       label="Role"
//                       className="input-bg-color"
//                       select
//                       fullWidth
//                       value={form.role}
//                       onChange={(e) => setField("role", e.target.value as "Admin" | "Manager" | "Operator" | "Viewer")}
//                   >
//                       <MenuItem value="Admin">Admin</MenuItem>
//                       <MenuItem value="Manager">Manager</MenuItem>
//                       <MenuItem value="Operator">Operator</MenuItem>
//                       <MenuItem value="Viewer">Viewer</MenuItem>
//                   </TextField>
//                   <TextField
//                       label="Department"
//                       className="input-bg-color"
//                       placeholder="e.g., IT, Operations, Sales"
//                       fullWidth
//                       value={form.department}
//                       onChange={(e) => setField("department", e.target.value)}
//                   />

                  
//                   </Stack>

//                   <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                   <TextField
//                       label="Status"
//                       className="input-bg-color"
//                       select
//                       fullWidth
//                       value={form.status}
//                       onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
//                   >
//                       <MenuItem value="Active">Active</MenuItem>
//                       <MenuItem value="Inactive">Inactive</MenuItem>
//                   </TextField>
//                   {/* <TextField
//                       label="Designation"
//                       className="input-bg-color"
//                       placeholder="e.g., Manager, Engineer"
//                       fullWidth
//                       value={form.designation}
//                       onChange={(e) => setField("designation", e.target.value)}
//                   /> */}
//                   </Stack>

//                   {/* <TextField
//                   label="Address"
//                   className="input-bg-color"
//                   placeholder="Building, Street, Area, Pincode"
//                   fullWidth
//                   value={form.address}
//                   onChange={(e) => setField("address", e.target.value)}
//                   /> */}

//                   {/* <TextField
//                   label="Location (City / State)"
//                   className="input-bg-color"
//                   placeholder="e.g., Chennai, Tamil Nadu"
//                   fullWidth
//                   value={form.location}
//                   onChange={(e) => setField("location", e.target.value)}
//                   /> */}

//                   <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
//                   <Button 
//                       variant="text" 
//                       className="cancel-button" 
//                       onClick={handleCloseDrawer}
//                   >
//                       Cancel
//                   </Button>

//                   <Button 
//                       variant="contained" 
//                       className="edit-button" 
//                       onClick={handleSave}
//                   >
//                       {editingUser ? "Update User" : "Save User"}
//                   </Button>
//                   </Stack>
//               </Stack>
//               </Box>
//           </Drawer>
//           {/* --- DELETE CONFIRMATION DIALOG --- */}
//           <Dialog
//             open={deleteDialogOpen}
//             onClose={handleCancelDelete}
//             maxWidth="xs"
//             fullWidth
//           >
//             <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
//               Confirm Delete
//             </DialogTitle>
//             <DialogContent>
//               <Typography textAlign="center" color="text.secondary">
//                 Are you sure you want to delete this User?
//               </Typography>
//             </DialogContent>
//             <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
//               <Button 
//                 variant="outlined" 
//                 onClick={handleCancelDelete}
//                 color="inherit"
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 variant="contained" 
//                 onClick={handleConfirmDelete}
//                 color="error"
//                 startIcon={<IconifyIcon icon="wpf:delete" />}
//               >
//                 Delete
//               </Button>
//             </DialogActions> 
//           </Dialog>
      
//           {/* --- SUCCESS SNACKBAR --- */}
//           <Snackbar
//             open={snackbarOpen}
//             autoHideDuration={3000}
//             onClose={handleCloseSnackbar}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           >
//             <Alert 
//               onClose={handleCloseSnackbar} 
//               severity="success" 
//               variant="filled"
//               sx={{ width: "100%" }}
//             >
//               {snackbarMessage}
//             </Alert>
//           </Snackbar>
//         {/* </Stack>   */}
//       </Stack> 
//     </div>
//   );
// };

// export default UserRegister;








// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Button,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { useSnackbar } from 'notistack';

// // Sub Components
// import UserMain from "pages/components/UserManage/UserMain";
// import UserDrawer from "pages/components/UserManage/UserDrawer";

// import "../MachineRegister/MachineRegister.css"



// // --- Global Types ---
// export type User = {
//   id: number;
//   username: string;
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   role: "Admin" | "Operator" | "Viewer";
//   status: "Active" | "Inactive";
//   createdDate?: string;
// };

// const UserRegister: React.FC = () => {
//   // Data State
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);

//   // UI Control State
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);

//   // Feedback State
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
//   // Optional local snackbar (if not using notistack exclusively)
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   const { enqueueSnackbar } = useSnackbar();

//   // Load Mock Data
//   useEffect(() => {
//     setUsers([
//       { id: 1, username: "John", fullName: "Alice Johnson", email: "alice@company.com", phoneNumber: "9876543210", role: "Admin", status: "Active", createdDate: "2023-11-01" },
//       { id: 2, username: "Smith", fullName: "Bob Smith", email: "bob@company.com", phoneNumber: "8765432109", role: "Operator", status: "Active", createdDate: "2023-12-15" },
//       { id: 3, username: "Charlie", fullName: "Charlie Brown", email: "charlie@company.com", phoneNumber: "7654321098", role: "Viewer", status: "Inactive", createdDate: "2024-01-10" },
//     ]);
//   }, []);

//   // --- Handlers ---
//   const handleOpenAdd = () => {
//     setEditingUser(null);
//     setDrawerOpen(true);
//   };

//   const handleOpenEdit = (user: User) => {
//     setEditingUser(user);
//     setDrawerOpen(true);
//   };

//   const handleCloseDrawer = () => {
//     setDrawerOpen(false);
//     setEditingUser(null);
//   };

//   const handleSave = (formData: User) => {
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       if (editingUser) {
//         setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...formData, id: editingUser.id } : u)));
//         enqueueSnackbar("User updated successfully", { variant: "success" });
//       } else {
//         const newUser: User = { ...formData, id: Date.now() };
//         setUsers((prev) => [newUser, ...prev]);
//         enqueueSnackbar("User added successfully", { variant: "success" });
//       }
//       setLoading(false);
//       handleCloseDrawer();
//     }, 400);
//   };

//   // --- Delete Logic ---
//   const initiateDelete = (id: number) => {
//     setUserToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (userToDelete !== null) {
//       setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
//       setSnackbarMessage("User deleted successfully");
//       setSnackbarOpen(true);
//     }
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div className="vm-root">
        
//         {/* 1. Main View (Table & Filters) */}
//         <UserMain
//           users={users}
//           onAdd={handleOpenAdd}
//           onEdit={handleOpenEdit}
//           onDelete={initiateDelete}
//         />

//         {/* 2. Drawer View (Form) */}
//         <UserDrawer
//           open={drawerOpen}
//           onClose={handleCloseDrawer}
//           onSave={handleSave}
//           initialData={editingUser}
//           loading={loading}
//         />

//         {/* 3. Global Dialogs */}
//         <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
//           <DialogTitle>Confirm Delete</DialogTitle>
//           <DialogContent>
//             <Typography>Are you sure you want to delete this User?</Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
//             <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
//           </DialogActions>
//         </Dialog>

//         {/* Legacy Snackbar (fallback) */}
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={3000}
//           onClose={() => setSnackbarOpen(false)}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         >
//           <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
//             {snackbarMessage}
//           </Alert>
//         </Snackbar>

//       </div>
//     </LocalizationProvider>
//   );
// };

// export default UserRegister;











import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { useSnackbar } from 'notistack';

// Sub Components
import UserMain from "pages/components/UserManage/UserMain";
import UserDrawer from "pages/components/UserManage/UserDrawer";

// Custom CSS (Your existing CSS)
import "../../RegisterManagement/MachineRegister/MachineRegister.css";
import IconifyIcon from "components/base/IconifyIcon";
import userApi from "services/userApi";

// --- Global Types ---
export type User = {
  id: number;
  username: string; // Used as First Name or generic identifier in your code
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "Admin" | "Operator" | "Viewer";
  status: "Active" | "Inactive";
  createdDate: string;
};

const UserRegister: React.FC = () => {
  // Data State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // UI Control State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Feedback State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
  // Optional local snackbar (fallback)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // const { enqueueSnackbar } = useSnackbar();

  // --- API / Effect ---
    const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUserDetails();
      if (response.success) {
        setUsers(response.data); 
      } else {
        setSnackbarMessage(response.message || "Failed to register machine");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data.message || "Something error occured please try again later";
      setSnackbarMessage(errorMessage);
    } finally {
      setSnackbarOpen(true)
      setLoading(false);
    }
  };

  // Load Mock Data
  useEffect(() => {
    fetchUser();
    setUsers([
      { id: 1, username: "John", fullName: "Alice Johnson", email: "alice@company.com", phoneNumber: "9876543210", role: "Admin", status: "Active", createdDate: "2023-11-01" },
      { id: 2, username: "Smith", fullName: "Bob Smith", email: "bob@company.com", phoneNumber: "8765432109", role: "Operator", status: "Active", createdDate: "2023-12-15" },
      { id: 3, username: "Charlie", fullName: "Charlie Brown", email: "charlie@company.com", phoneNumber: "7654321098", role: "Viewer", status: "Inactive", createdDate: "2024-01-10" },
      { id: 4, username: "Dave", fullName: "David Wilson", email: "dave@company.com", phoneNumber: "6543210987", role: "Operator", status: "Active", createdDate: "2024-02-05" },
      { id: 5, username: "Eve", fullName: "Eve Adams", email: "eve@company.com", phoneNumber: "5432109876", role: "Viewer", status: "Active", createdDate: "2024-03-20" },
    ]);
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingUser(null);
  };

  const handleSave = (formData: User) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editingUser) {
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...formData, id: editingUser.id } : u)));
        setSnackbarMessage("User updated successfully");
      } else {
        const newUser: User = { ...formData, id: Date.now() };
        setUsers((prev) => [newUser, ...prev]);
        setSnackbarMessage("User added successfully");
      }
      setLoading(false);
      setSnackbarOpen(true);
      handleCloseDrawer();
    }, 400);
  };

  // --- Delete Logic ---
  const initiateDelete = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete !== null) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      setSnackbarMessage("User deleted successfully");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="vm-root" style={{ padding: '20px' }}>
        
        {/* 1. Main View (DataGrid & Filters) */}
        <UserMain
          users={users}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={initiateDelete}
          onRefresh={fetchUser}
          loading={loading}
        />

        {/* 2. Drawer View (Form) */}
        <UserDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSave}
          initialData={editingUser}
          loading={loading}
        />

        {/* 3. Global Dialogs */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this User?</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, gap: 1 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Cancel</Button>
            <Button onClick={confirmDelete} color="error" 
            variant="contained"
            startIcon={<IconifyIcon icon="wpf:delete"/>}
            >
              Delete
              </Button>
          </DialogActions>
        </Dialog>

        {/* Legacy Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>

      </div>
    </LocalizationProvider>
  );
};

export default UserRegister;