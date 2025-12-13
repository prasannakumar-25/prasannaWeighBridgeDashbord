import React, { useState, useMemo, ChangeEvent } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Grid,
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
import { Vendor } from "pages/RegisterManagement/VendorRegister/VendorRegister"; 
import CustomPagination from "../VehicleManage/CustomPagination";



interface VendorMainProps {
  vendors: Vendor[];
  onAdd: () => void;
  onEdit: (v: Vendor) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const VendorMain: React.FC<VendorMainProps> = ({
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
  const [filterGst, setFilterGst] = useState(''); // New State for GST
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const handleChangeGst = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterGst(event.currentTarget.value);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterGst("");
    setFromDate(null);
    setToDate(null);
  };

  // -- Filter Logic --
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      // 1. Text Search (Name, Email, Phone)
      const matchesSearch =
        v.vendorName.toLowerCase().includes(search.toLowerCase()) ||
        (v.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (v.phone || "").includes(search);

      // 2. GST Filter
      const matchesGst = filterGst === "" || (v.gstNumber || "").toLowerCase().includes(filterGst.toLowerCase());

      // 3. Date Filter (Created Date)
      const itemDate = dayjs(v.createdAt);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesGst && matchesFromDate && matchesToDate;
    });
  }, [vendors, search, filterGst, fromDate, toDate]);

  // -- CSV Download Logic --
  const handleDownloadCSV = () => {
    if (filteredVendors.length === 0) {
      enqueueSnackbar("No data to download", { variant: "warning" });
      return;
    }
    const headers = ["ID", "Vendor Name", "Email", "Phone", "Address", "GST Number", "Website", "Created Date"];
    const rows = filteredVendors.map(v => [
      v.id,
      v.vendorName,
      v.email || "",
      v.phone || "",
      v.address || "",
      v.gstNumber || "",
      v.website || "",
      v.createdAt ? dayjs(v.createdAt).format('YYYY-MM-DD') : ""
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendor_register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -- DataGrid Columns --
  const columns: GridColDef<Vendor>[] = useMemo(() => [
    {
      field: 'vendorName',
      headerName: 'Vendor Name',
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      renderCell: (params: any) => params.value || "—"
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params: any) => params.value || "—"
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params: any) => params.value || "—"
    },
    {
        field: 'createdAt',
        headerName: 'Joined Date',
        width: 140,
        renderCell: (params: any) => {
            if (!params.value) return "—";
            return dayjs(params.value).format('DD MMM YYYY');
        }
    },
    {
      field: 'gstNumber',
      headerName: 'GST / Tax',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
             {params.value || "—"}
        </Typography>
      )
    },
    {
      field: 'website',
      headerName: 'Website',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? (
          <a
            href={params.value.startsWith('http') ? params.value : `https://${params.value}`}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: theme.palette.primary.main }}
          >
            <IconifyIcon icon="material-symbols:open-in-new-rounded" />
            &nbsp;Visit
          </a>
        ) : (
          "—"
        )
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
  ], [theme, onEdit, onDelete]);

  return (
    <Stack
      bgcolor="background.paper"
      borderRadius={5}
      width={1}
      boxShadow={(theme) => theme.shadows[4]}
    >
      <main className="vm-content">
        
        {/* --- Header --- */}
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          {/* Top Row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Vendor Register
            </Typography>
            <Tooltip title="Add Vendor" arrow placement="top">
            <Button
              variant="contained"
              onClick={onAdd}
              startIcon={<IconifyIcon icon="mdi:plus" />}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Add Vendor
            </Button>
            </Tooltip>
          </Stack>

          {/* Filter Grid */}
          <Grid container spacing={2} alignItems="center">
            {/* Search (Name/Email/Phone) */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                variant="outlined"
                label="Search"
                placeholder="Search Name, Email..."
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
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={6} sm={3} md={2}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            {/* ✅ New GST Filter */}
            <Grid item xs={12} sm={6} md={2}>
                
              <TextField
                variant="outlined"
                label="Filter"
                placeholder="Filter GST No..."
                size="small"
                fullWidth
                value={filterGst}
                onChange={handleChangeGst}
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
             <Tooltip title="Claer" arrow>
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

        {/* --- DataGrid --- */}
        <Box sx={{ height: 550, width: '100%' }}>
            <DataGrid
                rows={filteredVendors}
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
                            No Vendors found
                        </Stack>
                    ),
                }}
                loading={loading}
                // Styling
                getRowHeight={() => 70}
                disableRowSelectionOnClick
                disableColumnSelector
                disableColumnMenu
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

export default VendorMain;