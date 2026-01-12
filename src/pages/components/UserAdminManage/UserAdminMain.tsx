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
  Menu,        
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
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
import * as XLSX from 'xlsx';

// Import Types and Pagination
import { SuperAdminUser } from "pages/RegisterManagement/UserAdminRegister/UserAdmin";
import CustomPagination from "../VehicleManage/CustomPagination";

import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface UserAdminMainProps {
  users: SuperAdminUser[];
//   vendors: Vendor[];
  onAdd: () => void;
  loading: boolean;
  onRefresh: () => void;
}

const UserAdminMain: React.FC<UserAdminMainProps> = ({
  users,
//   vendors,
  onAdd,
  loading,
  onRefresh,
}) => {
  const theme = useTheme();

  // -- Local Filter State --
  const [search, setSearch] = useState('');
//   const [filterVendorId, setFilterVendorId] = useState<number | "">("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  
  // Feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // -- DOWNLOAD MENU STATE --
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDownloadMenu = Boolean(anchorEl);

  const handleOpenDownloadMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDownloadMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const handleClearFilters = () => {
    setSearch("");
    // setFilterVendorId("");
    setFromDate(null);
    setToDate(null);
  };

  // -- Filter Logic --
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. Text Search (Name, Shortname or Role)
      const matchesSearch =
        u.User_name.toLowerCase().includes(search.toLowerCase()) ||
        u.Shortname.toLowerCase().includes(search.toLowerCase()) ||
        u.Role.toLowerCase().includes(search.toLowerCase());

      // 2. Vendor Filter
    //   const matchesVendor = filterVendorId === "" || u.Vendor_Id === filterVendorId;

      // 3. Date Filter (Created_On)
      const itemDate = dayjs(u.Created_On);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [users, search, fromDate, toDate]);

  // -- Helpers for Mapping --
//   const getVendorName = (id: number) => {
//     const v = vendors.find(ven => ven.Vendor_Id === id);
//     return v ? v.Vendor_name : `ID: ${id}`;
//   };

  // -- PREPARE DATA FOR EXPORT --
  const getExportData = () => {
    if (filteredUsers.length === 0) {
      setSnackbarMessage("No data to download");
      setSnackbarOpen(true);
      return null;
    }
    return filteredUsers.map(u => ({
        "ID": u.Super_ID,
        "User Name": u.User_name,
        "Shortname": u.Shortname,
        "Role": u.Role,
        // "Vendor": getVendorName(u.Vendor_Id),
        "Created On": u.Created_On ? dayjs(u.Created_On).format('YYYY-MM-DD') : "",
        "Status": u.IsActive === 1 ? "Active" : "Inactive"
    }));
  };

  // -- EXPORT HANDLERS --
  const handleExportExcel = () => {
    const data = getExportData();
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const fileName = `User_Register_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    handleCloseDownloadMenu();
    setSnackbarMessage("Exported to Excel successfully");
    setSnackbarOpen(true);
  };

  const handleExportWord = () => {
    // (Implementation similar to MachineMain, simplified for brevity)
    const data = getExportData();
    if (!data) return;
    let tableHTML = `<table border="1" style="border-collapse: collapse; width: 100%;"><thead><tr style="background-color: #f2f2f2;"><th>ID</th><th>User Name</th><th>Shortname</th><th>Role</th><th>Vendor</th><th>Created</th><th>Status</th></tr></thead><tbody>`;
    data.forEach(r => {
      tableHTML += `<tr><td>${r.ID}</td><td>${r["User Name"]}</td><td>${r.Shortname}</td><td>${r.Role}</td><td>${r["Created On"]}</td><td>${r.Status}</td></tr>`;
    });
    tableHTML += `</tbody></table>`;
    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'></head><body>`;
    const postHtml = "</body></html>";
    const html = preHtml + tableHTML + postHtml;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = url;
    downloadLink.download = `User_Register_${dayjs().format('YYYY-MM-DD_HH-mm')}.doc`;
    downloadLink.click();
    document.body.removeChild(downloadLink);
    handleCloseDownloadMenu();
    setSnackbarMessage("Exported to Word successfully");
    setSnackbarOpen(true);
  };

  // -- DataGrid Columns --
  const columns: GridColDef<SuperAdminUser>[] = useMemo(() => [
    {
        field: 'User_name',
        headerName: 'User Name',
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
            <Stack direction="row" spacing={1} alignItems="center">
                <IconifyIcon icon="mdi:user-circle" width={54} height={20} color={theme.palette.primary.main} />
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    {params.value}
                </Typography>
            </Stack>
        )
    },
    {
        field: 'Shortname',
        headerName: 'Short Name',
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
             <Chip label={params.value} size="small" variant="outlined" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }} />
        )
    },
    {
        field: 'Role',
        headerName: 'Role',
        width: 250,
    },
    // {
    //     field: 'Vendor_Id',
    //     headerName: 'Vendor',
    //     width: 260,
    //     renderCell: (params: GridRenderCellParams) => (
    //         <Typography variant="body2" color="text.primary">
    //             {getVendorName(params.value)}
    //         </Typography>
    //     )
    // },
    {
        field: 'Created_On',
        headerName: 'Created On',
        width: 250,
        renderCell: (params: any) => {
            if (!params.value) return "—";
            return dayjs(params.value).format('DD/MMM/YYYY');
        }
    },
    {
      field: 'IsActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 1 ? "Active" : "Inactive"}
          color={params.value === 1 ? "success" : "default"}
          size="small"
          variant="filled"
          sx={{ fontWeight: 'bold', color: 'white' }}
        />
      )
    },
  ], [ theme]);

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
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              User Admin Register
            </Typography>
            <Tooltip title="Add New User" placement="top" arrow>
            <Button
              variant="contained"
              onClick={onAdd}
              startIcon={<IconifyIcon icon="mdi:plus" />}
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
              <TextField
                variant="outlined"
                label="Search"
                placeholder="Name, ID or Role..."
                size="small"
                fullWidth
                value={search}
                onChange={handleChangeSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
                      <IconifyIcon icon="mdi:search" width={1} height={1} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* From Date */}
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>From Date</Typography>
              <DatePicker
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>To Date</Typography>
              <DatePicker
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            {/* Vendor Filter */}
            <Grid item xs={12} sm={6} md={2}>
              {/* <TextField
                select
                label="Filter Vendor"
                variant="outlined"
                size="small"
                fullWidth
                value={filterVendorId}
                onChange={(e) => setFilterVendorId(e.target.value === "" ? "" : Number(e.target.value))}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: { maxHeight: 300, mt: 1, borderRadius: 2 } }
                  },
                }}
              >
                <MenuItem value=""><em>All Vendors</em></MenuItem>
                {vendors.map((v) => (
                  <MenuItem key={v.Vendor_Id} value={v.Vendor_Id}>{v.Vendor_name}</MenuItem>
                ))}
              </TextField> */}
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
             <Tooltip title="Clear Filters" arrow>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleClearFilters}
              >
                <IconifyIcon icon="mdi:filter-off" />
              </Button>
             </Tooltip>

              {/* Export Button */}
              <Tooltip title="Export Options" arrow>
                <IconButton
                  onClick={handleOpenDownloadMenu}
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'rgba(228, 244, 253, 1)',
                    '&:hover': { bgcolor: '#9bcdfcff' },
                  }}
                >
                  <IconifyIcon icon="lucide:download" />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={openDownloadMenu}
                onClose={handleCloseDownloadMenu}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1.5, minWidth: 200, borderRadius: 3 }
                }}
              >
                <MenuItem onClick={handleExportExcel}>
                  <ListItemIcon><IconifyIcon icon="vscode-icons:file-type-excel2" width={24} /></ListItemIcon>
                  <ListItemText primary="Export to Excel" />
                </MenuItem>
                <MenuItem onClick={handleExportWord}>
                  <ListItemIcon><IconifyIcon icon="vscode-icons:file-type-word" width={24} /></ListItemIcon>
                  <ListItemText primary="Export to Word" />
                </MenuItem>
              </Menu>

              <Tooltip title="Refresh Data" arrow>
                <IconButton
                  onClick={onRefresh}
                  disabled={loading}
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'rgba(228, 244, 253, 1)',
                    '&:hover': { bgcolor: '#9bcdfcff' },
                  }}
                >
                  <IconifyIcon icon="charm:refresh" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>

        {/* Feedback Snackbar */}
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
                {snackbarMessage}
            </Alert>
        </Snackbar>

        {/* --- DATA GRID SECTION --- */}
        <Box sx={{ height: 550, width: '100%' }} >
            <DataGrid
                rows={filteredUsers}
                columns={columns}
                getRowId={(row) => row.Super_ID}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                pageSizeOptions={[5, 10, 20]}
                slots={{
                    loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
                    pagination: CustomPagination,
                    noRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center" color="text.secondary">
                             <IconifyIcon icon="mdi:account-off" width={40} height={40} sx={{mb:1, opacity:0.5}}/>
                             <Typography variant="body2">No Users found</Typography>
                        </Stack>
                    ),
                }}
                loading={loading}
                getRowHeight={() => 70}
                disableRowSelectionOnClick
                disableColumnSelector
                disableColumnMenu
                disableColumnSorting
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': { borderBottom: `1px solid ${theme.palette.divider}` },
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

export default UserAdminMain;