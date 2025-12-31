
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
  Menu,           // <--- ADDED
  ListItemIcon,   // <--- ADDED
  ListItemText,   // <--- ADDED
  ListSubheader,
  Divider,
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

// Import Types and Pagination
import { Machine, Vendor } from "pages/RegisterManagement/MachineRegister/MachineRegister";
import CustomPagination from "../VehicleManage/CustomPagination";

import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface MachineMainProps {
  machines: Machine[];
  onAdd: () => void;
  onEdit: (m: Machine) => void;
  onDelete: (Machine_Id: number) => void;
  vendorList: Vendor[]; // Received from parent
  loading: boolean;
  onRefresh: () => void;
}

const MachineMain: React.FC<MachineMainProps> = ({
  machines,
  onAdd,
  onEdit,
  onDelete,
  vendorList,
  loading,
  onRefresh,
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  // const [snackbarMessage, setSnackbarMessage] = useState(false);

  // -- Local Filter State --
  const [search, setSearch] = useState('');
  const [filterVendorId, setFilterVendorId] = useState<number | "">("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  // -- DOWNLOAD MENU STATE (ADDED) --
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
    setFilterVendorId("");
    setFromDate(null);
    setToDate(null);
  };

  // -- Filter Logic --
  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      // 1. Text Search (Name or Mac Address)
      const matchesSearch =
        m.Machine_name.toLowerCase().includes(search.toLowerCase()) ||
        (m.Machine_mac || "").toLowerCase().includes(search.toLowerCase());

      // 2. Vendor Filter
      const matchesVendor = filterVendorId === "" || m.Vendor_Id === filterVendorId;

      // 3. Date Filter (Last Service Date)
      const itemDate = dayjs(m.Last_service_date);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesVendor && matchesFromDate && matchesToDate;
    });
  }, [machines, search, filterVendorId, fromDate, toDate]);

  // -- PREPARE DATA FOR EXPORT --
  const getExportData = () => {
    if (filteredMachines.length === 0) {
      enqueueSnackbar("No data to download", { variant: "warning" });
      return null;
    }
    return filteredMachines.map(m => {
      // const vendorName = vendors.find(v => v.Vendor_Id === m.Vendor_Id)?.vendorName || "Unknown";
      return {
        "ID": m.Machine_Id,
        "Machine Name": m.Machine_name,
        "Vendor": m.Vendor_name || m.Vendor_Id,
        "MAC Address": m.Machine_mac || "",
        "Capacity (Ton)": m.Capacity_ton || "",
        "Type": m.Machine_type,
        "Model": m.Machine_model || "",
        "Location": m.Machine_location || "",
        "Last Service": m.Last_service_date ? dayjs(m.Last_service_date).format('YYYY-MM-DD') : "",
        "Status": m.Status || ""
      };
    });
  };

  // -- EXPORT TO EXCEL FUNCTION --
  const handleExportExcel = () => {
    const data = getExportData();
    if (!data) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Machines");

    const fileName = `Machine_Register_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`;

    // Generate buffer and trigger download
    XLSX.writeFile(workbook, fileName); // <--- Use variable
    
    handleCloseDownloadMenu();
    enqueueSnackbar("Exported to Excel successfully", { variant: "success" });
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
            <th>Machine Name</th>
            <th>Vendor</th>
            <th>MAC Address</th>
            <th>Capacity</th>
            <th>Type</th>
            <th>Location</th>
            <th>Last Service</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((row) => {
      tableHTML += `
        <tr>
          <td>${row["ID"]}</td>
          <td>${row["Machine Name"]}</td>
          <td>${row["Vendor"]}</td>
          <td>${row["MAC Address"]}</td>
          <td>${row["Capacity (Ton)"]}</td>
          <td>${row["Type"]}</td>
          <td>${row["Location"]}</td>
          <td>${row["Last Service"]}</td>
          <td>${row["Status"]}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;

    // Wrap in standard HTML structure for Word
    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Machine Register</title></head><body>`;
    const postHtml = "</body></html>";
    const html = preHtml + tableHTML + postHtml;

    // Create Blob and Download
    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const fileName = `Machine_Register_${dayjs().format('YYYY-MM-DD_HH-mm')}.doc`;

    // Create download link
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    
    if (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0) {
        // IE Support
        (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
    } else {
        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
    handleCloseDownloadMenu();
    enqueueSnackbar("Exported to Word successfully", { variant: "success" });
  };

  // -- DataGrid Columns Definition --
  const columns: GridColDef<Machine>[] = useMemo(() => [
    {
        field: 'Machine_name',
        headerName: 'Machine Name',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                {params.value}
            </Typography>
        )
    },
    {
            field: 'Vendor_name',
            headerName: 'Vendor',
            minWidth: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" color="text.primary">
                    {params.row.Vendor_name || params.row.Vendor_Id}
                </Typography>
            )
        },
    {
        field: 'Machine_mac',
        headerName: 'MAC Address',
        flex: 0.8,
        minWidth: 140,
        renderCell: (params: GridRenderCellParams) => params.value || "—"
    },
    {
        field: 'Capacity_ton',
        headerName: 'Capacity',
        width: 120,
        renderCell: (params: any) => params.value ? `${params.value} tons` : "—"
    },
    {
        field: 'Machine_type',
        headerName: 'Type',
        width: 130,
    },
    {
        field: 'Machine_model',
        headerName: 'Model',
        width: 150,
        renderCell: (params: GridRenderCellParams) => params.value || "—"
    },
    {
        field: 'Machine_location',
        headerName: 'Location',
        width: 150,
        renderCell: (params: GridRenderCellParams) => params.value || "—"
    },
    {
        field: 'Last_service_date',
        headerName: 'Last Service',
        width: 140,
        renderCell: (params: any) => {
            if (!params.value) return "—";
            return dayjs(params.value).format('DD/ MMM/ YYYY');
        }
    },
    {
      field: 'Status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value === "Active" ? "success" : "default"}
          size="small"
          variant="outlined"
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
                    color="primary"
                >
                    <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                </IconButton>
                <IconButton 
                    onClick={() => onDelete(params.row.Machine_Id)} 
                    className="vm-btn vm-action-btn-delete"
                    color="error"
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
        
        {/* --- Header & Filters --- */}
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          
          {/* Top Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Machine Register
            </Typography>
            <Tooltip title="Add Machine" placement="top" arrow>
            <Button
              variant="contained"
              onClick={onAdd}
              startIcon={<IconifyIcon icon="mdi:plus" />}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Add Machine
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
                placeholder="Search Machine..."
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

            {/* Vendor Filter Dropdown */}
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

              {/* --- DOWNLOAD DROPDOWN --- */}
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


              <Tooltip title="Refresh Dataq" arrow>
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

        {/* --- DATA GRID SECTION --- */}
        <Box sx={{ height: 550, width: '100%' }} >
            <DataGrid
                rows={filteredMachines}
                columns={columns}
                getRowId={(row) => row.Machine_Id}
                // Pagination
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                pageSizeOptions={[5, 10, 20]}
                
                // Slots
                slots={{
                    loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
                    pagination: CustomPagination,
                    noRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center" color="text.secondary">
                             <IconifyIcon icon="fluent:box-search-24-regular" width={40} height={40} sx={{mb:1, opacity:0.5}}/>
                             <Typography variant="body2">No Machines found</Typography>
                        </Stack>
                    ),
                }}
                loading={loading}
                // Styling
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

export default MachineMain;