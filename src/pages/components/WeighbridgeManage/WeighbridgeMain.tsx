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
//   Tooltip,
//   useTheme,
// } from "@mui/material";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs, { Dayjs } from 'dayjs';
// import IconifyIcon from "components/base/IconifyIcon";
// import { useSnackbar } from 'notistack';
// // import { Machine, Weighbridge } from "./WeighbridgeRegister"; // Import types
// import { Machine, Weighbridge } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";

// interface WeighbridgeMainProps {
//   weighbridges: Weighbridge[];
//   machines: Machine[];
//   onAdd: () => void;
//   onEdit: (wb: Weighbridge) => void;
//   onDelete: (id: number) => void;
// }

// const WeighbridgeMain: React.FC<WeighbridgeMainProps> = ({
//   weighbridges,
//   machines,
//   onAdd,
//   onEdit,
//   onDelete,
// }) => {
//   const theme = useTheme();
//   const { enqueueSnackbar } = useSnackbar();

//   // -- Filter State --
//   const [search, setSearch] = useState('');
//   const [filterMachineId, setFilterMachineId] = useState<number | "">("");
//   const [fromDate, setFromDate] = useState<Dayjs | null>(null);
//   const [toDate, setToDate] = useState<Dayjs | null>(null);

//   const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.currentTarget.value);
//   };

//   const handleClearFilters = () => {
//     setSearch("");
//     setFilterMachineId("");
//     setFromDate(null);
//     setToDate(null);
//   };

//   // -- Filter Logic --
//   const filteredWeighbridges = useMemo(() => {
//     return weighbridges.filter((wb) => {
//       // 1. Text Search
//       const matchesSearch =
//         wb.serialNo.toLowerCase().includes(search.toLowerCase()) ||
//         wb.party.toLowerCase().includes(search.toLowerCase());

//       // 2. Machine Filter
//       const matchesMachine = filterMachineId === "" || wb.machineId === filterMachineId;

//       // 3. Date Filter
//       const itemDate = dayjs(wb.createdAt);
//       const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
//       const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

//       return matchesSearch && matchesMachine && matchesFromDate && matchesToDate;
//     });
//   }, [weighbridges, search, filterMachineId, fromDate, toDate]);

//   // -- CSV Download Logic --
//   const handleDownloadCSV = () => {
//     if (filteredWeighbridges.length === 0) {
//       enqueueSnackbar("No data to download", { variant: "warning" });
//       return;
//     }

//     const headers = ["Serial No", "Machine", "Port", "Baud Rate", "Data Bit", "Stop Bit", "Parity", "Date"];
//     const rows = filteredWeighbridges.map(wb => {
//       const machineName = machines.find(m => m.id === wb.machineId)?.machineName || "Unknown";
//       return [
//         wb.serialNo,
//         machineName,
//         wb.port,
//         wb.baudRate,
//         wb.dataBit,
//         wb.stopBit,
//         wb.party,
//         wb.createdAt ? dayjs(wb.createdAt).format('YYYY-MM-DD') : ""
//       ].join(",");
//     });

//     const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "weighbridge_register.csv");
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
        
//         {/* --- Header & Filters --- */}
//         <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
//           {/* Top Row */}
//           <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//             <Typography variant="h4" fontWeight="bold" color="text.primary">
//               Weighbridge Register
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={onAdd}
//               startIcon={<IconifyIcon icon="mdi:plus" />}
//               sx={{ px: 3, py: 1, borderRadius: 2 }}
//             >
//               Add New
//             </Button>
//           </Stack>

//           {/* Filter Grid */}
//           <Grid container spacing={2} alignItems="center">
//             {/* Search */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search Serial No..."
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

//             {/* Machine Filter */}
//             <Grid item xs={12} sm={6} md={2}>
//               <TextField
//                 select
//                 label="Filter Machine"
//                 variant="outlined"
//                 size="small"
//                 fullWidth
//                 value={filterMachineId}
//                 onChange={(e) => setFilterMachineId(e.target.value === "" ? "" : Number(e.target.value))}
//               >
//                 <MenuItem value=""><em>All Machines</em></MenuItem>
//                 {machines.map((m) => (
//                   <MenuItem key={m.id} value={m.id}>{m.machineName}</MenuItem>
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
//             </Grid>
//           </Grid>
//         </Box>

//         {/* --- Table --- */}
//         <TableContainer className="vm-table-container">
//           <Table className="vm-table">
//             <TableHead className="vm-table-header">
//               <TableRow className="vm-table-row">
//                 <TableCell className="header-name">Serial No</TableCell>
//                 <TableCell className="header-name">Machine</TableCell>
//                 <TableCell className="header-name">Created Date</TableCell>
//                 <TableCell className="header-name">Port</TableCell>
//                 <TableCell className="header-name">Baud Rate</TableCell>
//                 <TableCell className="header-name">Data/Stop</TableCell>
//                 <TableCell className="header-name">Party</TableCell>
//                 <TableCell className="header-name" align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filteredWeighbridges.map((wb) => (
//                 <TableRow key={wb.id} hover>
//                   <TableCell>
//                     <Typography variant="subtitle2" fontWeight={600}>
//                       {wb.serialNo}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     {machines.find(m => m.id === wb.machineId)?.machineName || "—"}
//                   </TableCell>
//                   <TableCell>
//                     {wb.createdAt ? dayjs(wb.createdAt).format('DD MMM YYYY') : "—"}
//                   </TableCell>
//                   <TableCell>{wb.port}</TableCell>
//                   <TableCell>{wb.baudRate}</TableCell>
//                   <TableCell>{`${wb.dataBit} / ${wb.stopBit}`}</TableCell>
//                   <TableCell>{wb.party}</TableCell>

//                   <TableCell align="right">
//                     <Stack direction="row" spacing={1} justifyContent="flex-end">
//                       <IconButton 
//                       onClick={() => onEdit(wb)}  
//                       className="vm-btn vm-action-btn-edit"
//                       >
//                         <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                       </IconButton>
//                       <IconButton 
//                       onClick={() => onDelete(wb.id)} 
//                       className="vm-btn vm-action-btn-delete"
//                       >
//                         <IconifyIcon icon="wpf:delete" />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {filteredWeighbridges.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
//                     <Typography variant="body1" color="text.secondary">
//                       No records found matching your filters.
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

// export default WeighbridgeMain;





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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";


// Import Types and Pagination
import { Weighbridge, Machine } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";
import CustomPagination from "../VehicleManage/CustomPagination";

import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface WeighbridgeMainProps {
  weighbridges: Weighbridge[];
  machines: Machine[];
  onAdd: () => void;
  onEdit: (wb: Weighbridge) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const WeighbridgeMain: React.FC<WeighbridgeMainProps> = ({
  weighbridges,
  machines,
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
  const [filterMachineId, setFilterMachineId] = useState<number | "">("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const openExportMenu = Boolean(exportAnchorEl);
  
  const handleOpenExportMenu = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };
  
  const handleCloseExportMenu = () => {
    setExportAnchorEl(null);
  };

  const handleExportExcel = () => {
  handleCloseExportMenu();
  enqueueSnackbar("Excel export coming soon", { variant: "info" });
  // TODO: Excel logic
  };
  
  const handleExportWord = () => {
    handleCloseExportMenu();
    enqueueSnackbar("Word export coming soon", { variant: "info" });
    // TODO: Word logic
  };



  const handleClearFilters = () => {
    setSearch("");
    setFilterMachineId("");
    setFromDate(null);
    setToDate(null);
  };



  // -- Filter Logic --
  const filteredWeighbridges = useMemo(() => {
    return weighbridges.filter((wb) => {
      // 1. Text Search
      const matchesSearch =
        wb.serialNo.toLowerCase().includes(search.toLowerCase()) ||
        wb.party.toLowerCase().includes(search.toLowerCase());

      // 2. Machine Filter
      const matchesMachine = filterMachineId === "" || wb.machineId === filterMachineId;

      // 3. Date Filter
      const itemDate = dayjs(wb.createdAt);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesMachine && matchesFromDate && matchesToDate;
    });
  }, [weighbridges, search, filterMachineId, fromDate, toDate]);

  // -- CSV Download Logic --
  const handleDownloadCSV = () => {
    if (filteredWeighbridges.length === 0) {
      enqueueSnackbar("No data to download", { variant: "warning" });
      return;
    }

    const headers = ["Serial No", "Machine", "Port", "Baud Rate", "Data Bit", "Stop Bit", "Parity", "Date"];
    const rows = filteredWeighbridges.map(wb => {
      const machineName = machines.find(m => m.id === wb.machineId)?.machineName || "Unknown";
      return [
        wb.serialNo,
        machineName,
        wb.port,
        wb.baudRate,
        wb.dataBit,
        wb.stopBit,
        wb.party,
        wb.createdAt ? dayjs(wb.createdAt).format('YYYY-MM-DD') : ""
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "weighbridge_register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -- DataGrid Columns Definition --
  const columns: GridColDef<Weighbridge>[] = useMemo(() => [
    {
        field: 'serialNo',
        headerName: 'Serial No',
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                {params.value}
            </Typography>
        )
    },
    {
        field: 'machineId',
        headerName: 'Machine',
        flex: 1,
        minWidth: 100,
        // valueGetter: (params: any) => {
        //     const row = params.row || params;
        //     return machines.find(m => m.id === row.machineId)?.machineName || "—";
        // }
    },
    {
        field: 'createdAt',
        headerName: 'Created Date',
        width: 140,
        renderCell: (params: GridRenderCellParams) => {
            if (!params.value) return "—";
            return dayjs(params.value).format('DD MMM YYYY');
        }
    },
    {
        field: 'port',
        headerName: 'Port',
        width: 150,
    },
    {
        field: 'baudRate',
        headerName: 'Baud Rate',
        width: 120,
    },
    
    {
        field: 'dataConfig', // Virtual field for Data/Stop
        headerName: 'Data/Stop',
        width: 120,
        renderCell: (params: GridRenderCellParams) => {
            const row = params.row || params;
            return `${row.dataBit} / ${row.stopBit}`;
        }
    },
    {
        field: 'party',
        headerName: 'Party (Parity)',
        width: 120,
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
  ], [machines, onEdit, onDelete]);

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
              Weighbridge Register
            </Typography>
            <Tooltip title="Add Weighbridge" placement="top" arrow>
            <Button
              variant="contained"
              onClick={onAdd}
              startIcon={<IconifyIcon icon="material-symbols:monitor-weight-gain-outline-rounded" />}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Add New
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
                placeholder="Search Serial No..."
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
                className="header-search-section"
                label="From Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={6} sm={3} md={2}>
              <DatePicker
                className="header-search-section"
                label="To Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            {/* Machine Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                label="Filter Machine"
                variant="outlined"
                size="small"
                fullWidth
                value={filterMachineId}
                onChange={(e) => setFilterMachineId(e.target.value === "" ? "" : Number(e.target.value))}
              >
                <MenuItem value=""><em>All Machines</em></MenuItem>
                {machines.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.machineName}</MenuItem>
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
                  // disabled={loading}
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
                rows={filteredWeighbridges}
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
                            No weighbridges found
                        </Stack>
                    ),
                }}

                // Styling
                loading={loading}
                getRowHeight={() => 70}
                disableRowSelectionOnClick
                disableColumnSelector
                disableColumnMenu
                
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

export default WeighbridgeMain;









