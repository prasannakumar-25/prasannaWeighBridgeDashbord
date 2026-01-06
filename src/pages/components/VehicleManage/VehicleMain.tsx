
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
import * as XLSX from 'xlsx'; // <--- ADDED: Import XLSX for Excel export

import { Vehicle, Vendor } from "pages/RegisterManagement/VehicleRegister/VehicleRegister";
import CustomPagination from "./CustomPagination";

interface VehicleMainProps {
  vehicles: Vehicle[];
  vendorList: Vendor[]; // Received from parent
  onAdd: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const VehicleMain: React.FC<VehicleMainProps> = ({
  vehicles,
  vendorList,
  onAdd,
  onEdit,
  onDelete,
  loading,
  onRefresh,

}) => {
  const theme = useTheme();

  // -- Local Filter State --
  const [search, setSearch] = useState('');
  const [filterVendorId, setFilterVendorId] = useState<number | "">("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  // -- DOWNLOAD MENU STATE (ADDED) --
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDownloadMenu = Boolean(anchorEl);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleOpenDownloadMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDownloadMenu = () => {
    setAnchorEl(null);
  };



  const filteredVehicles = useMemo(() => {
  return vehicles.filter((v) => {
    // 1. Text Search (Vehicle Type)
    const matchesSearch =
      v.Vehicle_type?.toLowerCase().includes(search.toLowerCase());

    // 2. Vendor Filter
    const matchesVendor =
      filterVendorId === "" || v.Vendor_Id === Number(filterVendorId);

    // 3. Date Filter
    const itemDate = dayjs(v.Created_at);
    const matchesFromDate = fromDate
      ? itemDate.isValid() &&
        (itemDate.isAfter(fromDate, "day") ||
          itemDate.isSame(fromDate, "day"))
      : true;

    const matchesToDate = toDate
      ? itemDate.isValid() &&
        (itemDate.isBefore(toDate, "day") ||
          itemDate.isSame(toDate, "day"))
      : true;

    return (
      matchesSearch &&
      matchesVendor &&
      matchesFromDate &&
      matchesToDate
    );
  });
}, [vehicles, search, filterVendorId, fromDate, toDate]);




  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };



  const handleClearFilters = () => {
    setSearch("");
    setFilterVendorId("");
    setFromDate(null);
    setToDate(null);
  };

  // -- PREPARE DATA FOR EXPORT --
  const getExportData = () => {
    if (filteredVehicles.length === 0) {
      setSnackbarMessage("No data to download");
      setSnackbarOpen(true);
      return null;
    }
    return filteredVehicles.map(v => {
      // const vendorName = vendors.find(ven => ven.Vendor_Id === v.Vendor_Id)?.vendorName || "";
      return {
        "ID": v.Vehicle_Id,
        "Vehicle Type": v.Vehicle_type,
        "Vendor": v.Vendor_name || v.Vendor_Id,
        "Customer ID": v.customerId || "",
        "Tare Weight": v.Tare_weight || "",
        "Status": v.status,
        "Created Date": v.Created_at ? dayjs(v.Created_at).format('YYYY-MM-DD') : ""
      };
    });
  };

  // -- EXPORT TO EXCEL FUNCTION --
  const handleExportExcel = () => {
    const data = getExportData();
    if (!data) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");

    const fileName = `Vehicle_Register_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`;

    // Generate buffer and trigger download
    XLSX.writeFile(workbook, fileName); // <--- Use variable
    
    handleCloseDownloadMenu();
    setSnackbarMessage("Exported to Excel successfully");
    setSnackbarOpen(true);
  };

  // -- EXPORT TO WORD FUNCTION --
  const handleExportWord = () => {
    const data = getExportData();
    if (!data) return;

    // Create an HTML Table string
    let tableHTML = `
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>ID</th>
            <th>Vehicle Type</th>
            <th>Vendor</th>
            <th>Customer ID</th>
            <th>Tare Weight</th>
            <th>Status</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((row) => {
      tableHTML += `
        <tr>
          <td>${row["ID"]}</td>
          <td>${row["Vehicle Type"]}</td>
          <td>${row["Vendor"]}</td>
          <td>${row["Customer ID"]}</td>
          <td>${row["Tare Weight"]}</td>
          <td>${row["Status"]}</td>
          <td>${row["Created Date"]}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;

    // Wrap in standard HTML structure for Word
    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Vehicle Register</title></head><body>`;
    const postHtml = "</body></html>";
    const html = preHtml + tableHTML + postHtml;

    // Create Blob and Download
    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const fileName = `Vehicle_Register_${dayjs().format('YYYY-MM-DD/HH-mm')}.doc`;

    // Create download link
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    
    if (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0) {
        // IE Support
        (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
    } else {
        downloadLink.href = url;
        downloadLink.download =fileName;
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
    handleCloseDownloadMenu();
    setSnackbarMessage("Exported to Word successfully");
    setSnackbarOpen(true);
  };

  // -- DataGrid Columns Definition --
  const columns: GridColDef<Vehicle>[] = useMemo(() => [
    {
      field: 'Vehicle_type',
      headerName: 'Vehicle Type',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
          {params.value}
        </Typography>
      )
    },
    {
        field: 'Vendor_name', // Assuming mapped or using valueGetter
        headerName: 'Vendor',
        minWidth: 140,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="body2" color="text.primary">
                {params.row.Vendor_name || params.row.Vendor_Id}
            </Typography>
        )
    },
    {
      field: 'Tare_weight',
      headerName: 'Tare Weight',
      flex: 0.7,
      minWidth: 120,
      renderCell: (params:GridRenderCellParams) => {
        if (!params.value) return "—";
        return `${Number(params.value).toFixed(2)} kg`;
      }
    },
    {
      field: 'Created_at',
      headerName: 'Created Date',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return "—";
        return dayjs(params.value).format('DD/ MMM/ YYYY');
      }
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 120,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <Chip
    //       label={params.value}
    //       color={params.value === "Active" ? "success" : "default"}
    //       variant="outlined"
    //       sx={{ fontWeight: 'bold' }}
    //     />
    //   )
    // },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'right',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton 
          onClick={() => onEdit(params.row)} color="primary"  
          className="vm-btn vm-action-btn-edit"
          >
            <IconifyIcon icon="fluent:notepad-edit-16-regular" />
          </IconButton>
          <IconButton 
          onClick={() => onDelete(params.row.Vehicle_Id)} color="error"
          className="vm-btn vm-action-btn-delete"
          >
            <IconifyIcon icon="wpf:delete" />
          </IconButton>
        </Stack>
      )
    }
  ], [vendorList, onEdit, onDelete]);

  return (
    <Stack
      bgcolor="background.paper"
      borderRadius={5}
      width={1}
      boxShadow={(theme) => theme.shadows[4]}
    >
      <main className="vm-content">
        {/* --- HEADER --- */}
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          
          {/* Title Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Vehicle Register
            </Typography>
            <Tooltip title="Add Vehicle" placement="top" arrow>
            <Button
              variant="contained"
              onClick={onAdd}
              startIcon={<IconifyIcon icon="fluent:vehicle-truck-checkmark-28-regular" />}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Add Vehicle
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
                placeholder="Search Vehicle Type..."
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
              <Typography variant="caption" fontWeight={300} fontSize={14} color="text.secondary" display="block" mb={0.8}>
                  From Date
              </Typography>
              <DatePicker
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  slotProps={{ 
                      textField: { 
                          size: "small", 
                          fullWidth: true,
                          InputProps: { sx: { borderRadius: 2, bgcolor: 'background.default' } }
                      } 
                  }}
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="caption" fontWeight={300} fontSize={14} color="text.secondary" display="block" mb={0.8}>
                  To Date
              </Typography>
              <DatePicker
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  slotProps={{ 
                      textField: { 
                          size: "small", 
                          fullWidth: true,
                          InputProps: { sx: { borderRadius: 2, bgcolor: 'background.default' } }
                      } 
                  }}
              />
            </Grid>

            {/* Vendor Dropdown */}
            <Grid item xs={12} sm={6} md={2}>
              {/* <TextField
                select
                label="Filter Vendor"
                placeholder="Filter Vendor"
                variant="outlined"
                size="small"
                fullWidth
                value={filterVendorId}
                onChange={(e) => setFilterVendorId(e.target.value === "" ? "" : Number(e.target.value))}
              >
                <MenuItem value=""><em>All Vendors</em></MenuItem>
                {vendorList.map((v) => (
                  <MenuItem key={v.Vendor_Id} value={v.Vendor_Id}>{v.Vendor_name}</MenuItem>
                ))}
              </TextField> */}

              <TextField
                select
                label="Filter Vendor"
                placeholder="Filter Vendor"
                variant="outlined"
                size="small"
                fullWidth
                value={filterVendorId}
                onChange={(e) => setFilterVendorId(e.target.value === "" ? "" : Number(e.target.value))}
                
                // 1. Style the Dropdown Container
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        mt: 1, // Add space between input and menu
                        borderRadius: 2,
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', // Soft modern shadow
                        border: '1px solid',
                        borderColor: 'divider',
                        maxHeight: 300,
                      },
                    },
                    MenuListProps: { sx: { py: 1 } }, // Remove default padding for cleaner margins
                  },
                }}
              >
                {/* 2. Style "All Vendors" Option */}
                <MenuItem 
                  value="" 
                  sx={{
                    borderRadius: 1.5,
                    mx: 1, // Horizontal margin
                    my: 0.5, // Vertical spacing
                    py: 1,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateX(5px)', // Slide effect
                    },
                  }}
                >
                  <em style={{ fontWeight: 500, color: 'text.secondary' }}>All Vendors</em>
                </MenuItem>

                {/* 3. Style Dynamic Options */}
                {vendorList.map((v) => (
                  <MenuItem 
                    key={v.Vendor_Id} 
                    value={v.Vendor_Id}
                    sx={{
                      borderRadius: 1.5,
                      mx: 1,
                      my: 0.5,
                      py: 1,
                      transition: 'all 0.2s ease-in-out',
                      
                      // Hover State
                      '&:hover': {
                        bgcolor: 'primary.lighter', // Or 'rgba(25, 118, 210, 0.08)'
                        transform: 'translateX(5px)',
                        fontWeight: 600,
                      },

                      // Selected State
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'common.white',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }
                    }}
                  >
                    {v.Vendor_name}
                  </MenuItem>
                ))}
              </TextField>

            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
              <Tooltip title="Clear Filters" arrow>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleClearFilters}
                startIcon={<IconifyIcon icon="mdi:filter-off" />}
              >
                
              </Button>
              </Tooltip>

              {/* --- CHANGED: DOWNLOAD DROPDOWN --- */}
              <Tooltip title="Export Options" arrow>
                <IconButton
                  onClick={handleOpenDownloadMenu}
                  sx={{
                    color: 'primary.main',
                    backgroundColor: 'rgba(228, 244, 253, 1)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                
                    '&:hover': {
                      backgroundColor: '#9bcdfcff',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    },
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
                  <ListItemIcon>
                    <IconifyIcon icon="vscode-icons:file-type-excel2" color="success.main" />
                  </ListItemIcon>
                  <ListItemText>Export to Excel</ListItemText>
                </MenuItem>
                
                <MenuItem onClick={handleExportWord}>
                  <ListItemIcon>
                    <IconifyIcon icon="vscode-icons:file-type-word" color="info.main" />
                  </ListItemIcon>
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
              {/* ---------------------------------- */}

              <Tooltip title="Refresh Data" arrow>
                <IconButton
                  onClick={onRefresh}
                  disabled={loading}
                  sx={{
                    color: 'primary.main',
                    backgroundColor: 'rgba(228, 244, 253, 1)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                
                    '&:hover': {
                      backgroundColor: '#9bcdfcff',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    },
                  }}
                >
                  <IconifyIcon icon="charm:refresh" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>

        {/* 4. Global Snackbar */}
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

        {/* --- DATA GRID SECTION --- */}
        
        <Box sx={{ height: 550, width: '100%' }}>
            <DataGrid
                rows={filteredVehicles}
                columns={columns}
                getRowId={(row) => row.Created_at ? row.Vehicle_Id : Math.random()}
                
                // --- PAGINATION CONFIGURATION ---
                initialState={{
                    pagination: { 
                        paginationModel: { pageSize: 5, page: 0 } 
                    },
                }}
                
                pageSizeOptions={[5, 10, 20, 50]} 
                
                // --- SLOTS ---
                slots={{
                    loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
                    // This replaces the default footer entirely with your custom one
                    pagination: CustomPagination, 
                    noRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center" color="text.secondary">
                             <IconifyIcon icon="fluent:box-search-24-regular" width={40} height={40} sx={{mb:1, opacity:0.5}}/>
                             <Typography variant="body2">No vehicles found</Typography>
                        </Stack>
                    ),
                }}

                // --- STYLING ---
                loading={loading}
                getRowHeight={() => 65}
                disableRowSelectionOnClick
                disableColumnSelector
                disableColumnMenu
                disableColumnSorting // Optional: Keep or remove based on preference
                
                // Ensure the default footer doesn't conflict (though CustomPagination overrides it)
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        bgcolor: theme.palette.background.default,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        fontWeight: 'bold',
                        color: theme.palette.text.secondary,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem'
                    },
                    // Hides the default footer provided by DataGrid if it accidentally tries to render borders
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: `1px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.background.paper, 
                    }
                }}
            />
        </Box>  
      </main>
    </Stack>
  );
};

export default VehicleMain;