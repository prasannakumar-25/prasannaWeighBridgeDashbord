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
import { useSnackbar } from 'notistack';
import * as XLSX from 'xlsx'; 

// Import Types
import { Customer } from "pages/RegisterManagement/CustomerRegister/CustomerRegister";
import CustomPagination from "../VehicleManage/CustomPagination";
import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface CustomerMainProps {
  customers: Customer[];
  onAdd: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (Customer_Id: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const CustomerMain: React.FC<CustomerMainProps> = ({
  customers,
  onAdd,
  onEdit,
  onDelete,
  loading,
  onRefresh,
}) => {
  const theme = useTheme();

  // -- Local Filter State --
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
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
    setFilterStatus("");
    setFromDate(null);
    setToDate(null);
  };

  // -- Filter Logic --
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // 1. Text Search (Name, Code, Email)
      const searchLower = search.toLowerCase();
      const matchesSearch =
        c.Customer_name.toLowerCase().includes(searchLower) ||
        c.Customer_code.toLowerCase().includes(searchLower) ||
        c.Email.toLowerCase().includes(searchLower);

      // 2. Status Filter
      const matchesStatus = filterStatus === "" || c.Status === filterStatus;

      // 3. Date Filter
      const itemDate = dayjs(c.Created_at);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesStatus && matchesFromDate && matchesToDate;
    });
  }, [customers, search, filterStatus, fromDate, toDate]);

  // -- PREPARE DATA FOR EXPORT --
  const getExportData = () => {
    if (filteredCustomers.length === 0) {
      setSnackbarMessage("No data to download");
      setSnackbarOpen(true);
      return null;
    }
    return filteredCustomers.map(c => ({
      "ID": c.Customer_Id,
      "Code": c.Customer_code,
      "Customer Name": c.Customer_name,
      "Vendor": c.Vendor_name || c.Vendor_Id,
      "Email": c.Email,
      "Contact": c.Contact_number,
      "GST No": c.Gst_number,
      "Address": c.Address,
      "Status": c.Status,
      "Created Date": c.Created_at ? dayjs(c.Created_at).format('YYYY-MM-DD') : ""
    }));
  };

  // -- EXPORT TO EXCEL --
  const handleExportExcel = () => {
    const data = getExportData();
    if (!data) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    
    const fileName = `Customer_Register_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    handleCloseDownloadMenu();
    setSnackbarMessage("Exported to Excel successfully");
    setSnackbarOpen(true);
  };

  // -- EXPORT TO WORD --
  const handleExportWord = () => {
    const data = getExportData();
    if (!data) return;

    let tableHTML = `
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Code</th>
            <th>Name</th>
            <th>Vendor</th>
            <th>Email</th>
            <th>Contact</th>
            <th>GST</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((row) => {
      tableHTML += `
        <tr>
          <td>${row["Code"]}</td>
          <td>${row["Customer Name"]}</td>
          <td>${row["Vendor"]}</td>
          <td>${row["Email"]}</td>
          <td>${row["Contact"]}</td>
          <td>${row["GST No"]}</td>
          <td>${row["Status"]}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;

    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Customer Register</title></head><body>`;
    const postHtml = "</body></html>";
    const html = preHtml + tableHTML + postHtml;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const fileName = `Customer_Register_${dayjs().format('YYYY-MM-DD_HH-mm')}.doc`;
    
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    
    if (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0) {
        (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
    } else {
        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
    handleCloseDownloadMenu();
    setSnackbarMessage("Exported to Word successfully");
    setSnackbarOpen(true);
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "success" : "error";
  };

  // -- DataGrid Columns --
  const columns: GridColDef<Customer>[] = useMemo(() => [
    {
        field: 'Customer_code',
        headerName: 'Code',
        width: 100,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="body2" fontWeight={600} color="text.secondary">
                {params.value}
            </Typography>
        )
    },
    {
        field: 'Customer_name',
        headerName: 'Customer Name',
        minWidth: 120,
        flex: 1,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                {params.value}
            </Typography>
        )
    },
    {
        field: 'Vendor_name', // Assuming mapped or using valueGetter
        headerName: 'Vendor',
        minWidth: 120,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="body2" color="text.primary">
                {params.row.Vendor_name || params.row.Vendor_Id}
            </Typography>
        )
    },
    {
        field: 'Email',
        headerName: 'Email',
        minWidth: 180,
    },
    {
        field: 'Contact_number',
        headerName: 'Phone',
        width: 140,
    },
    {
        field: 'Gst_number',
        headerName: 'GST No',
        width: 170,
    },
    {
        field: 'Status',
        headerName: 'Status',
        width: 100,
        renderCell: (params: GridRenderCellParams) => (
            <Chip 
                label={params.value} 
                color={getStatusColor(params.value as string) as any}
                size="small" 
                variant="outlined"
                sx={{ fontWeight: 600 }}
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
                    color="primary"
                >
                    <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                </IconButton>
                <IconButton 
                    onClick={() => onDelete(params.row.Customer_Id)} 
                    className="vm-btn vm-action-btn-delete"
                    color="error"
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
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
                Customer Register
            </Typography>
            <Tooltip title="Add Customer" placement="top" arrow>
            <Button
              variant="contained"
              onClick={onAdd}
              startIcon={<IconifyIcon icon="mdi:account-plus"/>}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Add Customer
            </Button>
            </Tooltip>
          </Stack>

          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                variant="outlined"
                label="Search"
                placeholder="Name, Code or Email..."
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
              <Typography variant="caption" fontWeight={300} fontSize={14} color="text.secondary" display="block" mb={0.8}>From Date</Typography>
              <DatePicker
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  slotProps={{ 
                      textField: { size: "small", fullWidth: true, InputProps: { sx: { borderRadius: 2 } } } 
                  }}
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="caption" fontWeight={300} fontSize={14} color="text.secondary" display="block" mb={0.8}>To Date</Typography>
              <DatePicker
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  slotProps={{ 
                      textField: { size: "small", fullWidth: true, InputProps: { sx: { borderRadius: 2 } } } 
                  }}
              />
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                variant="outlined"
                label="Filter Status"
                size="small"
                fullWidth
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                // sx={{ mt: 2.5 }} // Align with dates visually
              >
                <MenuItem value=""><em>All Status</em></MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1, mt: 2.5 }}>
              <Tooltip title="Clear Filters" arrow>
                <Button variant="outlined" color="secondary" size="small" onClick={handleClearFilters}>
                  <IconifyIcon icon="mdi:filter-off" />
                </Button>
              </Tooltip>

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

              {/* <Menu
                anchorEl={anchorEl}
                open={openDownloadMenu}
                onClose={handleCloseDownloadMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleExportExcel}>
                  <ListItemIcon><IconifyIcon icon="vscode-icons:file-type-excel2" /></ListItemIcon>
                  <ListItemText>Export to Excel</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportWord}>
                  <ListItemIcon><IconifyIcon icon="vscode-icons:file-type-word" /></ListItemIcon>
                  <ListItemText>Export to Word</ListItemText>
                </MenuItem>
              </Menu> */}

               <Menu
                  anchorEl={anchorEl}
                  open={openDownloadMenu}
                  onClose={handleCloseDownloadMenu}
                  // TransitionComponent={Fade} 
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  
                  // 1. Container Styling (Glassmorphism & Shadow)
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))', // Deep, soft shadow
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: 3, // Modern rounded edges
                      border: '1px solid',
                      borderColor: 'divider',
                      
                      // The "Speech Bubble" Arrow
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        borderTop: '1px solid',
                        borderLeft: '1px solid',
                        borderColor: 'divider',
                      },
                    },
                  }}
                >
                  {/* Option 1: Excel */}
                  <MenuItem 
                    onClick={handleExportExcel}
                    sx={{ 
                      py: 1.5, // Taller rows for modern feel
                      mx: 1,   // Spacing on sides for "floating" feel
                      my: 0.5,
                      borderRadius: 1.5,
                      transition: 'all 0.3s ease',
                      
                      // HOVER EFFECTS
                      '&:hover': {
                        bgcolor: 'success.lighter', // Requires theme setup, or use 'rgba(0, 200, 83, 0.08)'
                        transform: 'translateX(4px)', // Slight slide to the right
                        
                        // Target the Icon inside on hover
                        '& .MuiListItemIcon-root': {
                          transform: 'scale(1.2)', // Icon grows
                          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                        },
                        // Target the Text inside on hover
                        '& .MuiListItemText-primary': {
                          color: 'success.dark',
                          fontWeight: 'bold',
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ transition: 'transform 0.2s ease-in-out' }}>
                      <IconifyIcon icon="vscode-icons:file-type-excel2" width={24} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Export to Excel" 
                      primaryTypographyProps={{ 
                        variant: 'body2', 
                        sx: { transition: 'color 0.2s ease' } 
                      }} 
                    />
                  </MenuItem>
  
                  {/* Option 2: Word */}
                  <MenuItem 
                    onClick={handleExportWord}
                    sx={{ 
                      py: 1.5,
                      mx: 1,
                      my: 0.5,
                      borderRadius: 1.5,
                      transition: 'all 0.3s ease',
                      
                      // HOVER EFFECTS
                      '&:hover': {
                        bgcolor: 'info.lighter', // or 'rgba(24, 144, 255, 0.08)'
                        transform: 'translateX(4px)',
                        
                        '& .MuiListItemIcon-root': {
                          transform: 'scale(1.2) rotate(-5deg)', // Icon grows and tilts slightly
                          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                        },
                        '& .MuiListItemText-primary': {
                          color: 'info.dark',
                          fontWeight: 'bold',
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ transition: 'transform 0.2s ease-in-out' }}>
                      <IconifyIcon icon="vscode-icons:file-type-word" width={24} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Export to Word" 
                      primaryTypographyProps={{ 
                        variant: 'body2', 
                        sx: { transition: 'color 0.2s ease' } 
                      }} 
                    />
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

        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
                {snackbarMessage}
                 <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    mt: 1,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: '#c8e6c9',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#66bb6a',
                      animation: 'snackbarProgress 3.5s linear forwards',
                    },
                    '@keyframes snackbarProgress': {
                      to: { width: '100%' },
                      from: { width: '0%' },
                    },
                  }}
                />
            </Alert>
        </Snackbar>

        {/* --- DATA GRID --- */}
        <Box sx={{ height: 550, width: '100%' }}>
            <DataGrid
                rows={filteredCustomers}
                columns={columns}
                getRowId={(row) => row.Customer_Id}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                pageSizeOptions={[5, 10, 20]}
                slots={{
                    loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
                    pagination: CustomPagination,
                    noRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center" color="text.secondary">
                             <IconifyIcon icon="fluent:box-search-24-regular" width={40} height={40} sx={{mb:1, opacity:0.5}}/>
                             <Typography variant="body2">No customers found</Typography>
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

export default CustomerMain;