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
import { Machine, Vendor } from "pages/RegisterManagement/MachineRegister/MachineRegister";
// Ensure CustomPagination is in the same directory or update the path
import CustomPagination from "../VehicleManage/CustomPagination";

import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface MachineMainProps {
  machines: Machine[];
  vendors: Vendor[];
  onAdd: () => void;
  onEdit: (m: Machine) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const MachineMain: React.FC<MachineMainProps> = ({
  machines,
  vendors,
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
  const [filterVendorId, setFilterVendorId] = useState<number | "">("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

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
        m.machineName.toLowerCase().includes(search.toLowerCase()) ||
        (m.machineMac || "").toLowerCase().includes(search.toLowerCase());

      // 2. Vendor Filter
      const matchesVendor = filterVendorId === "" || m.vendorId === filterVendorId;

      // 3. Date Filter (Last Service Date)
      const itemDate = dayjs(m.lastServiceDate);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesVendor && matchesFromDate && matchesToDate;
    });
  }, [machines, search, filterVendorId, fromDate, toDate]);

  // -- CSV Download Logic --
  const handleDownloadCSV = () => {
    if (filteredMachines.length === 0) {
      enqueueSnackbar("No data to download", { variant: "warning" });
      return;
    }

    const headers = [
      "Machine Name", "Vendor", "MAC Address", "Capacity (Tons)", "Type", "Location", "Model", "Last Servi"
    ];

    const rows = filteredMachines.map(m => {
      const vendorName = vendors.find(v => v.id === m.vendorId)?.vendorName || "Unknown";
      return [
        m.machineName,
        vendorName,
        m.machineMac || "",
        m.capacityTon || "",
        m.machineType,
        m.machineLocation || "",
        m.machineModel || "",
        m.lastServiceDate ? dayjs(m.lastServiceDate).format('YYYY-MM-DD') : ""
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "machine_register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -- DataGrid Columns Definition --
  const columns: GridColDef<Machine>[] = useMemo(() => [
    {
        field: 'machineName',
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
        field: 'vendorId',
        headerName: 'Vendor',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => {
            const row = params.row || params;
            return vendors.find(v => v.id === row.vendorId)?.vendorName || "—";
        }
    },
    {
        field: 'machineMac',
        headerName: 'MAC Address',
        flex: 0.8,
        minWidth: 140,
        renderCell: (params: GridRenderCellParams) => params.value || "—"
    },
    {
        field: 'capacityTon',
        headerName: 'Capacity',
        width: 120,
        renderCell: (params: any) => params.value ? `${params.value} tons` : "—"
    },
    {
        field: 'machineType',
        headerName: 'Type',
        width: 130,
    },
    {
        field: 'machineModel',
        headerName: 'Model',
        width: 150,
        renderCell: (params: GridRenderCellParams) => params.value || "—"
    },
    {
        field: 'machineLocation',
        headerName: 'Location',
        width: 150,
        renderCell: (params: GridRenderCellParams) => params.value || "—"
    },
    {
        field: 'lastServiceDate',
        headerName: 'Last Service',
        width: 140,
        renderCell: (params: any) => {
            if (!params.value) return "—";
            return dayjs(params.value).format('DD MMM YYYY');
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
  ], [vendors, onEdit, onDelete]);

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
              <DatePicker
                label="From Date" // Service Date
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={6} sm={3} md={2}>
              <DatePicker
                label="To Date" // Service Date
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            {/* Vendor Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                label="Filter Vendor"
                variant="outlined"
                size="small"
                fullWidth
                value={filterVendorId}
                onChange={(e) => setFilterVendorId(e.target.value === "" ? "" : Number(e.target.value))}
              >
                <MenuItem value=""><em>All Vendors</em></MenuItem>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.vendorName}</MenuItem>
                ))}
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

              {/* ⭐ Download Button */}
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
                  sx={{
                    color: 'primary.main',
                  }}
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
                rows={filteredMachines}
                columns={columns}
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
                        <Stack height="100%" alignItems="center" justifyContent="center">
                            No Machines found
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
