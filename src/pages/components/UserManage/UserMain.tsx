// import React, { useState, useMemo, ChangeEvent } from "react";
// import {
//   Box,
//   Button,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   InputAdornment,
//   Grid,
//   Chip,
//   Tooltip,
//   useTheme,
// } from "@mui/material";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs, { Dayjs } from 'dayjs';
// import IconifyIcon from "components/base/IconifyIcon";
// import { useSnackbar } from 'notistack';
// // import { User } from "./UserRegister"; // Import types
// import { User } from "pages/RegisterManagement/UserRegistration/UserRegister";

// import "../../RegisterManagement/MachineRegister/MachineRegister.css"

// interface UserMainProps {
//   users: User[];
//   onAdd: () => void;
//   onEdit: (user: User) => void;
//   onDelete: (id: number) => void;
// }

// const UserMain: React.FC<UserMainProps> = ({
//   users,
//   onAdd,
//   onEdit,
//   onDelete,
// }) => {
//   const theme = useTheme();
//   const { enqueueSnackbar } = useSnackbar();

//   // -- Filter State --
//   const [search, setSearch] = useState('');
//   const [filterRole, setFilterRole] = useState<string>("");
//   const [fromDate, setFromDate] = useState<Dayjs | null>(null);
//   const [toDate, setToDate] = useState<Dayjs | null>(null);

//   const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.currentTarget.value);
//   };

//   const handleClearFilters = () => {
//     setSearch("");
//     setFilterRole("");
//     setFromDate(null);
//     setToDate(null);
//   };

//   // -- Filter Logic --
//   const filteredUsers = useMemo(() => {
//     return users.filter((u) => {
//       // 1. Text Search (Name or Email)
//       const matchesSearch =
//         u.fullName.toLowerCase().includes(search.toLowerCase()) ||
//         u.email.toLowerCase().includes(search.toLowerCase());

//       // 2. Role Filter
//       const matchesRole = filterRole === "" || u.role === filterRole;

//       // 3. Date Filter
//       const itemDate = dayjs(u.createdDate);
//       const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
//       const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

//       return matchesSearch && matchesRole && matchesFromDate && matchesToDate;
//     });
//   }, [users, search, filterRole, fromDate, toDate]);

//   // -- CSV Download Logic --
//   const handleDownloadCSV = () => {
//     if (filteredUsers.length === 0) {
//       enqueueSnackbar("No data to download", { variant: "warning" });
//       return;
//     }

//     const headers = ["ID", "Full Name", "Email", "Phone", "Role", "Status", "Joined Date"];
//     const rows = filteredUsers.map(u => {
//       return [
//         u.id,
//         u.fullName,
//         u.email,
//         u.phoneNumber,
//         u.role,
//         u.status,
//         u.createdDate ? dayjs(u.createdDate).format('YYYY-MM-DD') : ""
//       ].join(",");
//     });

//     const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "user_register.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Status Chip Color Helper
//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case "Admin": return "primary";
//       case "Operator": return "info";
//       case "Viewer": return "default";
//       default: return "default";
//     }
//   };

//   return (
//     <Stack
//       bgcolor="background.paper"
//       borderRadius={5}
//       width={1}
//       boxShadow={(theme) => theme.shadows[4]}
//     >
//       <main className="vm-content">
        
//         {/* --- Header & Filters --- */}
//         <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
//           {/* Top Row */}
//           <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//             {/* <Typography variant="h4" fontWeight="bold" color="text.primary">
//               User Register
//             </Typography> */}
//             <Typography variant="h4" sx={{ flexGrow: 1 }}>User Register</Typography>
//             <Button
//               variant="contained"
//               onClick={onAdd}
//               // startIcon={<IconifyIcon icon="mdi:account-plus" />}
//               sx={{ px: 3, py: 1, borderRadius: 2 }}
//             >
//               Add User
//             </Button>
//           </Stack>

//           {/* Filter Grid */}
//           <Grid container spacing={2} alignItems="center">
//             {/* Search */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search Name or Email..."
//                 size="small"
//                 fullWidth
//                 value={search}
//                 onChange={handleChangeSearch}
//                 InputProps={{
//                   startAdornment: (
//                     // <InputAdornment position="start">
//                     //   <IconifyIcon icon="mdi:search" color="action.active" />
//                     // </InputAdornment>
//                     <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
//                       <IconifyIcon icon="mdi:search" width={1} height={1} />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>

//             {/* From Date */}
//             <Grid item xs={6} sm={3} md={2}>
//               <DatePicker
//                 // label="From Date"
//                 className="header-search-section"
//                 value={fromDate}
//                 onChange={(newValue) => setFromDate(newValue)}
//                 slotProps={{ textField: { size: 'small', fullWidth: true } }}
//               />
//             </Grid>

//             {/* To Date */}
//             <Grid item xs={6} sm={3} md={2}>
//               <DatePicker
//                 // label="To Date"
//                 className="header-search-section"
//                 value={toDate}
//                 onChange={(newValue) => setToDate(newValue)}
//                 slotProps={{ textField: { size: 'small', fullWidth: true } }}
//               />
//             </Grid>

//             {/* Role Filter */}
//             <Grid item xs={12} sm={6} md={2}>
//               <TextField
//                 select
//                 // label="Filter Role"
//                 variant="outlined"
//                 placeholder="Filter Role"
//                 size="small"
//                 fullWidth
//                 value={filterRole}
//                 onChange={(e) => setFilterRole(e.target.value)}
                
//               >
//                 <MenuItem value=""><em>All Roles</em></MenuItem>
//                 <MenuItem value="Admin">Admin</MenuItem>
//                 <MenuItem value="Operator">Operator</MenuItem>
//                 <MenuItem value="Viewer">Viewer</MenuItem>
//               </TextField>
//             </Grid>

//             {/* Actions */}
//             <Grid title= "Clear" item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 size="medium"
//                 onClick={handleClearFilters}
//                 startIcon={<IconifyIcon icon="mdi:filter-off" />}
//               >
//                 Clear
//               </Button>

//               {/* ⭐ Download Button */}
//               <Tooltip title="Download CSV">
//                 <IconButton
//                   onClick={handleDownloadCSV}
//                   sx={{
//                     color: 'primary.main',
//                     '&:hover': { bgcolor: theme.palette.primary.light + '40' }
//                   }}
//                 >
//                   <IconifyIcon icon="mdi:download" />
//                 </IconButton>
//               </Tooltip>

//               <Tooltip title="Refresh">
//                 <IconButton
//                   onClick={() => console.log("Refresh")}
//                   sx={{
//                     color: 'primary.main',
//                     // bgcolor: theme.palette.action.hover,
//                     // "&:hover": { bgcolor: theme.palette.action.selected },
//                   }}
//                 >
//                   <IconifyIcon icon="mdi:refresh" />
//                 </IconButton>
//               </Tooltip>
//               {/* <IconButton
//                   // onClick={handleRefresh}
//                   // disabled={loading}
//                   sx={{
//                     // bgcolor: "#e25b5bff",
//                     color: "#e02121ff",
//                     // "&:hover": { bgcolor: "red" },
//                     borderRadius: "50%",
//                     width: 40,
//                     height: 40
//                   }}
//               >
//                   <IconifyIcon icon="material-symbols:close" />
//               </IconButton> */}
//             </Grid>
//           </Grid>
//         </Box>

//         {/* --- Table --- */}
//         <TableContainer className="vm-table-container">
//           <Table className="vm-table">
//             <TableHead className="vm-table-header">
//               <TableRow className="vm-table-row">
//                 <TableCell className="header-name">Full Name</TableCell>
//                 <TableCell className="header-name">Full Name</TableCell>
//                 <TableCell className="header-name">Email</TableCell>
//                 <TableCell className="header-name">Phone</TableCell>
//                 <TableCell className="header-name">Role</TableCell>
//                 <TableCell className="header-name">Joined Date</TableCell>
//                 <TableCell className="header-name">Status</TableCell>
//                 <TableCell className="header-name" align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filteredUsers.map((u) => (
                
//                 <TableRow key={u.id} hover>
//                   <TableCell>
//                     <Typography variant="subtitle2" fontWeight={600}>
//                       {u.username}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="subtitle2" fontWeight={600}>
//                       {u.fullName}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>{u.email}</TableCell>
//                   <TableCell>{u.phoneNumber}</TableCell>
                  
//                   <TableCell>
//                     <Chip 
//                         label={u.role} 
//                         color={getRoleColor(u.role) as any}
//                         size="small" 
//                         variant="outlined"
//                     />
//                   </TableCell>

//                   <TableCell>
//                     {u.createdDate ? dayjs(u.createdDate).format('DD MMM YYYY') : "—"}
//                   </TableCell>

//                   <TableCell>
//                     <Chip 
//                       label={u.status} 
//                       color={u.status === "Active" ? "success" : "default"}
//                       size="small"
//                       sx={{ fontWeight: 'bold' }}
//                     />
//                   </TableCell>

//                   <TableCell align="right">
//                     <Stack direction="row" spacing={1} justifyContent="flex-end">
//                       <IconButton 
//                       onClick={() => onEdit(u)}  
//                       className="vm-btn vm-action-btn-edit"
//                       >
//                         <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                       </IconButton>
//                       <IconButton 
//                       onClick={() => onDelete(u.id)} 
//                       className="vm-btn vm-action-btn-delete"
//                       >
//                         <IconifyIcon icon="wpf:delete" />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {filteredUsers.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                     <Typography variant="body1" color="text.secondary">
//                       No users found.
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </main>
//     </Stack>
//   );
// };

// export default UserMain;










import React, { useState, useMemo, ChangeEvent } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Grid,
  Chip,
  Tooltip,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { 
  DataGrid, 
  GridColDef, 
  GridRenderCellParams, 
  GridSlots 
} from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import IconifyIcon from "components/base/IconifyIcon";
import { useSnackbar } from 'notistack';

// Import Types and Pagination
import { User } from "pages/RegisterManagement/UserRegistration/UserRegister";  
import CustomPagination from "../VehicleManage/CustomPagination"

import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface UserMainProps {
  users: User[];
  onAdd: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const UserMain: React.FC<UserMainProps> = ({
  users,
  onAdd,
  onEdit,
  onDelete,
  loading,
  onRefresh,
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // -- Filter State --
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterRole("");
    setFromDate(null);
    setToDate(null);
  };

  // -- Filter Logic --
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. Text Search (Name or Email)
      const matchesSearch =
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      // 2. Role Filter
      const matchesRole = filterRole === "" || u.role === filterRole;

      // 3. Date Filter
      const itemDate = dayjs(u.createdDate);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesRole && matchesFromDate && matchesToDate;
    });
  }, [users, search, filterRole, fromDate, toDate]);

  // -- CSV Download Logic --
  const handleDownloadCSV = () => {
    if (filteredUsers.length === 0) {
      enqueueSnackbar("No data to download", { variant: "warning" });
      return;
    }

    const headers = ["ID", "Full Name", "Email", "Phone", "Role", "Status", "Joined Date"];
    const rows = filteredUsers.map(u => {
      return [
        u.id,
        u.fullName,
        u.email,
        u.phoneNumber,
        u.role,
        u.status,
        u.createdDate ? dayjs(u.createdDate).format('YYYY-MM-DD') : ""
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Chip Colors
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "primary";
      case "Operator": return "info";
      case "Viewer": return "default";
      default: return "default";
    }
  };

  // -- DataGrid Columns Definition --
  const columns: GridColDef<User>[] = useMemo(() => [
    {
        field: 'fullName',
        headerName: 'Full Name',
        // flex: 1,
        minWidth: 160,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                {params.value}
            </Typography>
        )
    },
    {
        field: 'email',
        headerName: 'Email Address',
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'phoneNumber',
        headerName: 'Phone Number',
        flex: 0.8,
        minWidth: 140,
    },
    {
        field: 'role',
        headerName: 'Role',
        width: 130,
        renderCell: (params: GridRenderCellParams) => (
            <Chip 
                label={params.value} 
                color={getRoleColor(params.value as string) as any}
                size="small" 
                variant="outlined"
                sx={{ fontWeight: 600 }}
            />
        )
    },
    {
        field: 'createdDate',
        headerName: 'Joined Date',
        flex: 0.8,
        minWidth: 140,
        renderCell: (params: any) => {
            if (!params.value) return "—";
            return dayjs(params.value).format('DD/ MMM/ YYYY');
        }
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
            <Chip 
                label={params.value} 
                color={params.value === "Active" ? "success" : "default"}
                // size="small"
                sx={{ fontWeight: 'bold' }}
            />
        )
    },
    {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        filterable: false,
        align: 'right',
        headerAlign: 'right',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
            <Stack direction="row" spacing={1} justifyContent="flex-end" width="100%">
                <IconButton 
                    onClick={() => onEdit(params.row)}  
                    className="vm-btn vm-action-btn-edit"
                    // size="small"
                >
                    <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                </IconButton>
                <IconButton 
                    onClick={() => onDelete(params.row.id)} 
                    className="vm-btn vm-action-btn-delete"
                    // size="small"
                >
                    <IconifyIcon icon="wpf:delete" />
                </IconButton>
            </Stack>
        )
    }
  ], [onEdit, onDelete]);

  return (
    <Stack
      bgcolor="background.paper"
      borderRadius={5}
      width={1}
      boxShadow={(theme) => theme.shadows[4]}
    >
      <main className="vm-content">
        
        {/* --- Header & Filters --- */}
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          {/* Top Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                User Register
            </Typography>
            <Tooltip title="Add User" placement="top" arrow>
            <Button
              variant="contained"
              onClick={onAdd}
              startIcon={<IconifyIcon icon="gridicons:user-add"/>}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Add User
            </Button>
            </Tooltip>
          </Stack>

          {/* Filter Grid */}
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} sm={6} md={3}>
              {/* <Tooltip title="Search Name or Email" arrow> */}
              <TextField
                variant="outlined"
                label="Search "
                placeholder="Search Name or Email..."
                size="small"
                fullWidth
                value={search}
                onChange={handleChangeSearch}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
                      <IconifyIcon icon="mdi:search" width={1} height={1} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* From Date */}
            <Grid item xs={6} sm={3} md={2}>
              <DatePicker
                label="From Date"
                className="header-search-section"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={6} sm={3} md={2}>
              <DatePicker
                label="To Date"
                className="header-search-section"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            {/* Role Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                variant="outlined"
                label="Filter Role"
                size="small"
                fullWidth
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value=""><em>All Roles</em></MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Operator">Operator</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </TextField>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
              <Tooltip title="Clear" arrow>
              <Button
                variant="outlined"
                color="secondary"
                size="medium"
                onClick={handleClearFilters}
                startIcon={<IconifyIcon icon="mdi:filter-off" />}
              >
                Clear
              </Button>
              </Tooltip>

              <Tooltip title="Download CSV" arrow>
                <IconButton
                  onClick={handleDownloadCSV}
                  sx={{
                    color: 'primary.main',
                    '&:hover': { bgcolor: theme.palette.primary.light + '40' }
                  }}
                >
                  <IconifyIcon icon="mdi:download" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh" arrow>
                <IconButton
                  onClick={onRefresh}
                  disabled={loading}
                  sx={{ color: 'primary.main' }}
                >
                  <IconifyIcon icon="mdi:refresh" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>

        {/* --- DATA GRID SECTION --- */}
        <Box sx={{ height: 550, width: '100%' }}>
            <DataGrid
                rows={filteredUsers}
                columns={columns}
                // Pagination Setup
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                pageSizeOptions={[5, 10, 20]}
                
                // Slots for Custom Components
                slots={{
                    loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
                    pagination: CustomPagination,
                    noRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                            No users found
                        </Stack>
                    ),
                }}

                // Styling
                loading={loading}
                getRowHeight={() => 70}
                disableRowSelectionOnClick
                disableColumnSelector
                disableColumnMenu
                disableColumnSorting
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        bgcolor: theme.palette.background.default,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        fontWeight: 'bold',
                    },
                }}
            />
        </Box>
      </main>
    </Stack>
  );
};

export default UserMain;