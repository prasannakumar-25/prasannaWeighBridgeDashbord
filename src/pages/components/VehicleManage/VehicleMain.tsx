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
// // import { Vehicle, Vendor } from "./VehicleRegister"; // Importing types
// import { Vehicle, Vendor } from "pages/RegisterManagement/VehicleRegister/VehicleRegister";

// interface VehicleMainProps {
//   vehicles: Vehicle[];
//   vendors: Vendor[];
//   onAdd: () => void;
//   onEdit: (vehicle: Vehicle) => void;
//   onDelete: (id: number) => void;
// }

// const VehicleMain: React.FC<VehicleMainProps> = ({
//   vehicles,
//   vendors,
//   onAdd,
//   onEdit,
//   onDelete,
// }) => {
//   const theme = useTheme();
//   const { enqueueSnackbar } = useSnackbar();

//   // -- Local Filter State --
//   const [search, setSearch] = useState('');
//   const [filterVendorId, setFilterVendorId] = useState<number | "">("");
//   const [fromDate, setFromDate] = useState<Dayjs | null>(null);
//   const [toDate, setToDate] = useState<Dayjs | null>(null);

//   // -- Filter Logic --
//   const filteredVehicles = useMemo(() => {
//     return vehicles.filter((v) => {
//       // 1. Text Search
//       const matchesSearch = v.vehicleType.toLowerCase().includes(search.toLowerCase());

//       // 2. Dropdown Filter
//       const matchesVendor = filterVendorId === "" || v.vendorId === filterVendorId;

//       // 3. Date Filter
//       const itemDate = dayjs(v.createdDate);
//       const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
//       const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

//       return matchesSearch && matchesVendor && matchesFromDate && matchesToDate;
//     });
//   }, [vehicles, search, filterVendorId, fromDate, toDate]);

//   const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.currentTarget.value);
//   };

//   const handleClearFilters = () => {
//     setSearch("");
//     setFilterVendorId("");
//     setFromDate(null);
//     setToDate(null);
//   };

//   // -- CSV Download Logic --
//   const handleDownloadCSV = () => {
//     if (filteredVehicles.length === 0) {
//       enqueueSnackbar("No data to download", { variant: "warning" });
//       return;
//     }
//     const headers = ["ID", "Vehicle Type", "Vendor", "Customer ID", "Tare Weight", "Status", "Date"];
//     const rows = filteredVehicles.map(v => {
//       const vendorName = vendors.find(ven => ven.id === v.vendorId)?.vendorName || "";
//       return [
//         v.id,
//         v.vehicleType,
//         vendorName,
//         v.customerId || "",
//         v.tareWeight || "",
//         v.status,
//         v.createdDate ? dayjs(v.createdDate).format('YYYY-MM-DD') : ""
//       ].join(",");
//     });

//     const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "vehicle_register.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <Stack
//       bgcolor="background.paper"
//       borderRadius={5}
//       width={1}
//       boxShadow={(theme) => theme.shadows[4]}
//     >
//       <main className="vm-content">
//         {/* --- PROFESSIONAL HEADER (Grid Layout) --- */}
//         <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
//           {/* Top Row */}
//           <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//             <Typography variant="h4" fontWeight="bold" color="text.primary">
//               Vehicle Register
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={onAdd}
//               startIcon={<IconifyIcon icon="mdi:plus" />}
//               sx={{ px: 3, py: 1, borderRadius: 2 }}
//             >
//               Add Vehicle
//             </Button>
//           </Stack>

//           {/* Filter Grid */}
//           <Grid container spacing={2} alignItems="center">
//             {/* Search */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search Vehicle Type..."
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
//                 label="From Date"
//                 value={fromDate}
//                 onChange={(newValue) => setFromDate(newValue)}
//                 slotProps={{ textField: { size: 'small', fullWidth: true } }}
//               />
//             </Grid>

//             {/* To Date */}
//             <Grid item xs={6} sm={3} md={2}>
//               <DatePicker
//                 label="To Date"
//                 value={toDate}
//                 onChange={(newValue) => setToDate(newValue)}
//                 slotProps={{ textField: { size: 'small', fullWidth: true } }}
//               />
//             </Grid>

//             {/* Vendor Dropdown */}
//             <Grid item xs={12} sm={6} md={2}>
//               <TextField
//                 select
//                 label="Filter Vendor"
//                 variant="outlined"
//                 size="small"
//                 fullWidth
//                 value={filterVendorId}
//                 onChange={(e) => setFilterVendorId(e.target.value === "" ? "" : Number(e.target.value))}
//               >
//                 <MenuItem value=""><em>All Vendors</em></MenuItem>
//                 {vendors.map((v) => (
//                   <MenuItem key={v.id} value={v.id}>{v.vendorName}</MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {/* Actions */}
//             <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
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
//                   onClick={() => console.log("Refresh logic")}
//                   sx={{
//                     color: 'primary.main',
//                     // bgcolor: theme.palette.action.hover,
//                     // "&:hover": { bgcolor: theme.palette.action.selected },
//                   }}
//                 >
//                   <IconifyIcon icon="mdi:refresh" />
//                 </IconButton>
//               </Tooltip>
//             </Grid>
//           </Grid>
//         </Box>

//         {/* --- TABLE SECTION --- */}
//         <TableContainer className="vm-table-container">
//           <Table className="vm-table">
//             <TableHead className="vm-table-header">
//               <TableRow className="vm-table-row">
//                 <TableCell className="header-name">Vehicle Type</TableCell>
//                 <TableCell className="header-name">Vendor</TableCell>
//                 {/* <TableCell className="header-name">Customer ID</TableCell> */}
//                 <TableCell className="header-name">Tare Weight</TableCell>
//                 <TableCell className="header-name">Created Date</TableCell>
//                 <TableCell className="header-name">Status</TableCell>
//                 <TableCell className="header-name" align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filteredVehicles.map((v) => (
//                 <TableRow key={v.id} hover>
//                   <TableCell>
//                     <Typography variant="subtitle2" fontWeight={600}>
//                       {v.vehicleType}
//                     </Typography>
//                   </TableCell>

//                   <TableCell>
//                     {v.vendorId ? vendors.find(vendor => vendor.id === v.vendorId)?.vendorName || "—" : "—"}
//                   </TableCell>
//                   {/* <TableCell>{v.customerId || "—"}</TableCell> */}
//                   <TableCell>
//                     {v.tareWeight ? `${v.tareWeight.toFixed(2)} kg` : "—"}
//                   </TableCell>

//                   <TableCell>
//                     {v.createdDate ? dayjs(v.createdDate).format('DD MMM YYYY') : "—"}
//                   </TableCell>

//                   <TableCell>
//                     <Chip
//                       label={v.status}
//                       color={v.status === "Active" ? "success" : "default"}
//                       size="small"
//                       variant="outlined"
//                       sx={{ fontWeight: 'bold' }}
//                     />
//                   </TableCell>

//                   <TableCell align="right">
//                     <Stack direction="row" spacing={1} justifyContent="flex-end">
//                       <IconButton onClick={() => onEdit(v)} color="primary" size="small">
//                         <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                       </IconButton>
//                       <IconButton onClick={() => onDelete(v.id)} color="error" size="small">
//                         <IconifyIcon icon="wpf:delete" />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {filteredVehicles.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                     <Typography variant="body1" color="text.secondary">
//                       No vehicles found.
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

// export default VehicleMain;






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
import IconifyIcon from "components/base/IconifyIcon"; // Adjust path as needed
import { useSnackbar } from 'notistack';

import { Vehicle, Vendor } from "pages/RegisterManagement/VehicleRegister/VehicleRegister";
import CustomPagination from "./CustomPagination";

interface VehicleMainProps {
  vehicles: Vehicle[];
  vendors: Vendor[];
  onAdd: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const VehicleMain: React.FC<VehicleMainProps> = ({
  vehicles,
  vendors,
  onAdd,
  onEdit,
  onDelete,
  loading,
  onRefresh,

}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // -- Local Filter State --
  const [search, setSearch] = useState('');
  const [filterVendorId, setFilterVendorId] = useState<number | "">("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  // -- Filter Logic (Applied to rows before passing to DataGrid) --
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // 1. Text Search
      const matchesSearch = v.vehicleType.toLowerCase().includes(search.toLowerCase());

      // 2. Dropdown Filter
      const matchesVendor = filterVendorId === "" || v.vendorId === filterVendorId;

      // 3. Date Filter
      const itemDate = dayjs(v.createdDate);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesVendor && matchesFromDate && matchesToDate;
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

  // -- CSV Download Logic --
  const handleDownloadCSV = () => {
    if (filteredVehicles.length === 0) {
      enqueueSnackbar("No data to download", { variant: "warning" });
      return;
    }
    const headers = ["ID", "Vehicle Type", "Vendor", "Customer ID", "Tare Weight", "Status", "Date"];
    const rows = filteredVehicles.map(v => {
      const vendorName = vendors.find(ven => ven.id === v.vendorId)?.vendorName || "";
      return [
        v.id,
        v.vehicleType,
        vendorName,
        v.customerId || "",
        v.tareWeight || "",
        v.status,
        v.createdDate ? dayjs(v.createdDate).format('YYYY-MM-DD') : ""
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vehicle_register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -- DataGrid Columns Definition --
  const columns: GridColDef<Vehicle>[] = useMemo(() => [
    {
      field: 'vehicleType',
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
      field: 'vendorId',
      headerName: 'Vendor',
      color:'text.primary',
      flex: 1,
      minWidth: 150,
      
      renderCell: (params: GridRenderCellParams) => {
        // params is value if using simple valueGetter in v6, or row in v5. 
        // Safer to use row lookup.
        
        const row = params.row || params; 
        if (!row.vendorId) return "—";
        return vendors.find(v => v.id === row.vendorId)?.vendorName || "Unknown";
      }
    },
    {
      field: 'tareWeight',
      headerName: 'Tare Weight',
      flex: 0.7,
      minWidth: 120,
      renderCell: (params:GridRenderCellParams) => { (
        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
          {params.value}
        </Typography>
      )
        if (!params.value) return "—";
        return `${Number(params.value).toFixed(2)} kg`;
      }
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams) => {
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
        // <Stack direction="row" spacing={1} justifyContent="flex-end" width="100%">
        //   <IconButton onClick={() => onEdit(params.row)} color="primary" size="small">
        //     <IconifyIcon icon="fluent:notepad-edit-16-regular" />
        //   </IconButton>
        //   <IconButton onClick={() => onDelete(params.row.id)} color="error" size="small">
        //     <IconifyIcon icon="wpf:delete" />
        //   </IconButton>
        // </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton 
          onClick={() => onEdit(params.row)} color="primary"  
          className="vm-btn vm-action-btn-edit"
          >
            <IconifyIcon icon="fluent:notepad-edit-16-regular" />
          </IconButton>
          <IconButton 
          onClick={() => onDelete(params.row.id)} color="error"
          className="vm-btn vm-action-btn-delete"
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
        {/* --- HEADER --- */}
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
        {/* <Box > */}
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
                label="Search Vehicle Type"
                placeholder="Search ..."
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

            {/* Vendor Dropdown */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
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

              <Tooltip title="Download CSV" arrow>
                <IconButton
                  onClick={handleDownloadCSV}
                  sx={{ color: 'primary.main', '&:hover': { bgcolor: theme.palette.primary.light + '40' } }}
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
                rows={filteredVehicles}
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
                            No vehicles found
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

export default VehicleMain;