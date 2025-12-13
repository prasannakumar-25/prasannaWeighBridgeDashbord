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
// // import { IPCamera, Machine } from "./IPCameraRegister"; // Import types
// import { IPCamera, Machine } from "pages/RegisterManagement/IPCameraRegister/IPCameraRegister";

// interface IPCameraMainProps {
//   cameras: IPCamera[];
//   machines: Machine[];
//   onAdd: () => void;
//   onEdit: (cam: IPCamera) => void;
//   onDelete: (id: number) => void;
// }

// const IPCameraMain: React.FC<IPCameraMainProps> = ({
//   cameras,
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
//   const filteredCameras = useMemo(() => {
//     return cameras.filter((c) => {
//       // 1. Text Search
//       const matchesSearch =
//         c.cameraName.toLowerCase().includes(search.toLowerCase()) ||
//         c.ipAddress.includes(search);

//       // 2. Machine Filter
//       const matchesMachine = filterMachineId === "" || c.machineId === filterMachineId;

//       // 3. Date Filter (Installed Date)
//       const itemDate = dayjs(c.installedDate);
//       const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
//       const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

//       return matchesSearch && matchesMachine && matchesFromDate && matchesToDate;
//     });
//   }, [cameras, search, filterMachineId, fromDate, toDate]);

//   // -- CSV Download Logic --
//   const handleDownloadCSV = () => {
//     if (filteredCameras.length === 0) {
//       enqueueSnackbar("No data to download", { variant: "warning" });
//       return;
//     }

//     const headers = [
//       "Camera Name", "Machine", "IP Address", "RTSP URL", "Location", "Installed Date", "Status"
//     ];

//     const rows = filteredCameras.map(c => {
//       const machineName = machines.find(m => m.id === c.machineId)?.machineName || "Unknown";
//       return [
//         c.cameraName,
//         machineName,
//         c.ipAddress,
//         c.rtspUrl || "",
//         c.location || "",
//         c.installedDate ? dayjs(c.installedDate).format('YYYY-MM-DD') : "",
//         c.status
//       ].join(",");
//     });

//     const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "ip_cameras.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Status Chip Color Helper
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Online": return "success";
//       case "Offline": return "default";
//       case "Error": return "error";
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
//             <Typography variant="h4" fontWeight="bold" color="text.primary">
//               IP Camera Register
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={onAdd}
//               startIcon={<IconifyIcon icon="mdi:video-plus" />}
//               sx={{ px: 3, py: 1, borderRadius: 2 }}
//             >
//               Add Camera
//             </Button>
//           </Stack>

//           {/* Filter Grid */}
//           <Grid container spacing={2} alignItems="center">
//             {/* Search */}
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 variant="outlined"
//                 placeholder="Search Camera or IP..."
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
//                 <TableCell className="header-name">Camera Name</TableCell>
//                 <TableCell className="header-name">Machine</TableCell>
//                 <TableCell className="header-name">IP Address</TableCell>
//                 <TableCell className="header-name">MAC Address</TableCell>
//                 <TableCell className="header-name">RTSP URL</TableCell>
//                 <TableCell className="header-name">HTTP URL</TableCell>
//                 <TableCell className="header-name">Username</TableCell>
//                 <TableCell className="header-name">Location</TableCell>
//                 <TableCell className="header-name">Installed Date</TableCell>
//                 <TableCell className="header-name">Status</TableCell>
//                 <TableCell className="header-name" align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {filteredCameras.map((cam) => (
//                 <TableRow key={cam.id} hover>
//                   <TableCell>
//                     <Typography variant="subtitle2" fontWeight={600}>
//                       {cam.cameraName}
//                     </Typography>
//                   </TableCell>

//                   <TableCell>
//                     {machines.find(m => m.id === cam.machineId)?.machineName || "—"}
//                   </TableCell>
                  
//                   <TableCell>{cam.ipAddress || "—"}</TableCell>
//                   <TableCell>{cam.macAddress || "—"}</TableCell>
//                   <TableCell sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                      {cam.rtspUrl || "—"}
//                   </TableCell>
//                   <TableCell sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                      {cam.httpUrl || "—"}
//                   </TableCell>
//                   <TableCell>{cam.username || "—"}</TableCell>
//                   <TableCell>{cam.location || "—"}</TableCell>
                  
//                   <TableCell>
//                     {cam.installedDate ? dayjs(cam.installedDate).format('DD MMM YYYY') : "—"}
//                   </TableCell>

//                   <TableCell>
//                     <Chip 
//                       label={cam.status} 
//                       color={getStatusColor(cam.status) as any}
//                       size="small"
//                       sx={{ fontWeight: 'bold' }}
//                     />
//                   </TableCell>

//                   <TableCell align="right">
//                     <Stack direction="row" spacing={1} justifyContent="flex-end">
//                       <IconButton 
//                       onClick={() => onEdit(cam)}  
//                       className="vm-btn vm-action-btn-edit"
//                       >
//                         <IconifyIcon icon="fluent:notepad-edit-16-regular" />
//                       </IconButton>
//                       <IconButton 
//                       onClick={() => onDelete(cam.id)} 
//                       className="vm-btn vm-action-btn-delete"
//                       >
//                         <IconifyIcon icon="wpf:delete" />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {filteredCameras.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                     <Typography variant="body1" color="text.secondary">
//                       No IP Camera found.
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

// export default IPCameraMain;








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
  import { IPCamera, Machine } from "pages/RegisterManagement/IPCameraRegister/IPCameraRegister";  
import CustomPagination from "../VehicleManage/CustomPagination";

import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface IPCameraMainProps {
  cameras: IPCamera[];
  machines: Machine[];
  onAdd: () => void;
  onEdit: (cam: IPCamera) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const IPCameraMain: React.FC<IPCameraMainProps> = ({
  cameras,
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

  const handleClearFilters = () => {
    setSearch("");
    setFilterMachineId("");
    setFromDate(null);
    setToDate(null);
  };

  // -- Filter Logic --
  const filteredCameras = useMemo(() => {
    return cameras.filter((c) => {
      // 1. Text Search
      const matchesSearch =
        c.cameraName.toLowerCase().includes(search.toLowerCase()) ||
        c.ipAddress.includes(search);

      // 2. Machine Filter
      const matchesMachine = filterMachineId === "" || c.machineId === filterMachineId;

      // 3. Date Filter (Installed Date)
      const itemDate = dayjs(c.installedDate);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesMachine && matchesFromDate && matchesToDate;
    });
  }, [cameras, search, filterMachineId, fromDate, toDate]);

  // -- CSV Download Logic --
  const handleDownloadCSV = () => {
    if (filteredCameras.length === 0) {
      enqueueSnackbar("No data to download", { variant: "warning" });
      return;
    }

    const headers = [
      "Camera Name", "Machine", "IP Address", "RTSP URL", "Location", "Installed Date", "Status"
    ];

    const rows = filteredCameras.map(c => {
      const machineName = machines.find(m => m.id === c.machineId)?.machineName || "Unknown";
      return [
        c.cameraName,
        machineName,
        c.ipAddress,
        c.macAddress,
        c.rtspUrl || "",
        c.httpUrl || "",
        c.location || "",
        c.installedDate ? dayjs(c.installedDate).format('YYYY-MM-DD') : "",
        c.status
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ip_cameras.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Chip Color Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "success";
      case "Offline": return "default";
      case "Error": return "error";
      default: return "default";
    }
  };

  // -- DataGrid Columns Definition --
  const columns: GridColDef<IPCamera>[] = useMemo(() => [
    {
        field: 'cameraName',
        headerName: 'Camera Name',
        flex: 1,
        minWidth: 150,
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
        minWidth: 150,
        renderCell: (params: any) => {
            const row = params.row || params;
            return machines.find(m => m.id === row.machineId)?.machineName || "—";
        }
    },
    {
        field: 'ipAddress',
        headerName: 'IP Address',
        flex: 0.8,
        minWidth: 130,
    },
    {
        field: 'macAddress',
        headerName: 'MAC Address',
        flex: 0.8,
        minWidth: 140,
        // valueFormatter: (params: any) => params.value || "—"
    },
    {
        field: 'installedDate',
        headerName: 'Installed Date',
        width: 140,
        renderCell: (params: any) => {
            if (!params.value) return "—";
            return dayjs(params.value).format('DD MMM YYYY');
        }
    },
    {
        field: 'rtspUrl',
        headerName: 'RTSP Url',
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
        field: 'username',
        headerName: 'User Name',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="subtitle2" fontWeight={200} color="text.primary">
                {params.value}
            </Typography>
        )
    },
     {
        field: 'password',
        headerName: 'PassWord',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="subtitle2" fontWeight={200} color="text.primary">
                {params.value}
            </Typography>
            
        )
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 100,
        renderCell: (params: GridRenderCellParams) => (
            <Chip 
                label={params.value} 
                color={getStatusColor(params.value as string) as any}
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
              IP Camera Register
            </Typography>
            <Tooltip title="Add Camera" placement="top" arrow>
            <Button
              variant="contained"
              onClick={onAdd}
              startIcon={<IconifyIcon icon="mdi:video-plus" />}
              sx={{ px: 3, py: 1, borderRadius: 2 }}
            >
              Add Camera
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
                placeholder="Search Camera or IP..."
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
              <Tooltip title="Clear data" arrow>
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
                rows={filteredCameras}
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
                            No IP Cameras found
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

export default IPCameraMain;