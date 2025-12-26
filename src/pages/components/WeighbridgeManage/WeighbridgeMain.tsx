

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
  Dialog,             // <--- ADDED
  DialogTitle,        // <--- ADDED
  DialogContent,      // <--- ADDED
  DialogActions,      // <--- ADDED
  Divider,            // <--- ADDED
  Chip,               // <--- ADDED
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

// Import Types and Pagination
import { Weighbridge, Machine } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";
import CustomPagination from "../VehicleManage/CustomPagination";

import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface WeighbridgeMainProps {
  weighbridges: Weighbridge[];
  machines: Machine[];
  onAdd: () => void;
  onEdit: (wb: Weighbridge) => void;
  onDelete: (Weighbridge_Id: number) => void;
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

  // -- Local Filter State --
  const [search, setSearch] = useState('');
  const [filterMachineId, setFilterMachineId] = useState<number | "">("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  // -- DOWNLOAD MENU STATE --
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDownloadMenu = Boolean(anchorEl);

  // -- DETAIL CARD STATE (NEW) --
  const [selectedWeighbridge, setSelectedWeighbridge] = useState<Weighbridge | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);

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
    setFilterMachineId("");
    setFromDate(null);
    setToDate(null);
  };

  // -- HANDLE DETAIL MODAL ACTIONS --
  const handleOpenDetail = (wb: Weighbridge) => {
    setSelectedWeighbridge(wb);
    setOpenDetailModal(true);
  };

  const handleCloseDetail = () => {
    setOpenDetailModal(false);
    setSelectedWeighbridge(null);
  };

  const handleEditFromCard = () => {
    if (selectedWeighbridge) {
      onEdit(selectedWeighbridge);
      handleCloseDetail();
    }
  };

  const handleDeleteFromCard = () => {
    if (selectedWeighbridge) {
      onDelete(selectedWeighbridge.Weighbridge_Id);
      handleCloseDetail();
    }
  };

  // -- Filter Logic --
  const filteredWeighbridges = useMemo(() => {
    return weighbridges.filter((wb) => {
      const matchesSearch =
        wb.Serial_no.toLowerCase().includes(search.toLowerCase()) ||
        wb.Party.toLowerCase().includes(search.toLowerCase());

      const matchesMachine = filterMachineId === "" || wb.Machine_Id === filterMachineId;

      const itemDate = dayjs(wb.Created_at);
      const matchesFromDate = fromDate ? itemDate.isValid() && (itemDate.isAfter(fromDate, 'day') || itemDate.isSame(fromDate, 'day')) : true;
      const matchesToDate = toDate ? itemDate.isValid() && (itemDate.isBefore(toDate, 'day') || itemDate.isSame(toDate, 'day')) : true;

      return matchesSearch && matchesMachine && matchesFromDate && matchesToDate;
    });
  }, [weighbridges, search, filterMachineId, fromDate, toDate]);

  // -- EXPORT LOGIC --
  const getExportData = () => {
    if (filteredWeighbridges.length === 0) {
      enqueueSnackbar("No data to download", { variant: "warning" });
      return null;
    }
    return filteredWeighbridges.map(wb => {
      const machineName = machines.find(m => m.id === wb.Machine_Id)?.machineName || "Unknown";
      return {
        "ID": wb.Weighbridge_Id,
        "Serial No": wb.Serial_no,
        "Machine": machineName,
        "Port": wb.Port,
        "Baud Rate": wb.Baud_rate,
        "Data Bit": wb.Data_bit,
        "Stop Bit": wb.Stop_bit,
        "Parity": wb.Party,
        "Created Date": wb.Created_at ? dayjs(wb.Created_at).format('YYYY-MM-DD') : ""
      };
    });
  };

  const handleExportExcel = () => {
    const data = getExportData();
    if (!data) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Weighbridges");
    XLSX.writeFile(workbook, "Weighbridge_Register.xlsx");
    handleCloseDownloadMenu();
    enqueueSnackbar("Exported to Excel successfully", { variant: "success" });
  };

  const handleExportWord = () => {
    const data = getExportData();
    if (!data) return;
    let tableHTML = `
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>ID</th><th>Serial No</th><th>Machine</th><th>Port</th><th>Baud Rate</th><th>Data/Stop</th><th>Parity</th><th>Created Date</th>
          </tr>
        </thead>
        <tbody>`;
    data.forEach((row) => {
      tableHTML += `<tr>
          <td>${row["ID"]}</td><td>${row["Serial No"]}</td><td>${row["Machine"]}</td><td>${row["Port"]}</td>
          <td>${row["Baud Rate"]}</td><td>${row["Data Bit"]}/${row["Stop Bit"]}</td><td>${row["Parity"]}</td><td>${row["Created Date"]}</td>
        </tr>`;
    });
    tableHTML += `</tbody></table>`;
    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Weighbridge Register</title></head><body>`;
    const postHtml = "</body></html>";
    const html = preHtml + tableHTML + postHtml;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    if (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0) {
        (window.navigator as any).msSaveOrOpenBlob(blob, "Weighbridge_Register.doc");
    } else {
        downloadLink.href = url;
        downloadLink.download = "Weighbridge_Register.doc";
        downloadLink.click();
    }
    document.body.removeChild(downloadLink);
    handleCloseDownloadMenu();
    enqueueSnackbar("Exported to Word successfully", { variant: "success" });
  };

  // -- DataGrid Columns Definition --
  const columns: GridColDef<Weighbridge>[] = useMemo(() => [
    {
        field: 'Serial_no',
        headerName: 'Serial No',
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
            <Tooltip title="Double click for details" arrow placement="top">
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer', // Show hand cursor
                        '&:hover': {
                            color: theme.palette.primary.main,
                            fontWeight: 'bold'
                        }
                    }}
                    // TRIGGER THE DETAIL CARD ON DOUBLE CLICK
                    onDoubleClick={(e) => {
                        e.stopPropagation(); // Prevent row click events if any
                        handleOpenDetail(params.row);
                    }}
                >
                    <Typography variant="subtitle2" fontWeight={600} color="inherit">
                        {params.value}
                    </Typography>
                </Box>
            </Tooltip>
        )
    },
    {
        field: 'machineId',
        headerName: 'Machine',
        flex: 1,
        minWidth: 100,
        renderCell: (params: any) => {
             const row = params.row || params;
             return machines.find(m => m.id === row.Machine_Id)?.machineName || "—";
        }
    },
    {
        field: 'Created_at',
        headerName: 'Created Date',
        width: 140,
        renderCell: (params: GridRenderCellParams) => {
            if (!params.value) return "—";
            return dayjs(params.value).format('DD/ MMM/ YYYY');
        }
    },
    {
        field: 'Port',
        headerName: 'Port',
        width: 150,
    },
    {
        field: 'Baud_rate',
        headerName: 'Baud Rate',
        width: 120,
    },
    
    {
        field: 'dataConfig',
        headerName: 'Data/Stop',
        width: 120,
        renderCell: (params: GridRenderCellParams) => {
            const row = params.row || params;
            return `${row.Data_bit} / ${row.Stop_bit}`;
        }
    },
    {
        field: 'Party',
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
                    color="primary"
                >
                    <IconifyIcon icon="fluent:notepad-edit-16-regular" />
                </IconButton>
                <IconButton 
                    onClick={() => onDelete(params.row.Weighbridge_Id)} 
                    className="vm-btn vm-action-btn-delete"
                    color="error"
                >
                    <IconifyIcon icon="wpf:delete" />
                </IconButton>
            </Stack>
        )
    }
  ], [machines, onEdit, onDelete, theme]);

  // -- Helper for Detail Card Row --
  const DetailRow = ({ label, value, icon }: { label: string, value: string | React.ReactNode, icon: string }) => (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5, borderBottom: `1px dashed ${theme.palette.divider}` }}>
        <Box 
            sx={{ 
                minWidth: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: 'primary.lighter', 
                color: 'primary.main',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            <IconifyIcon icon={icon} width={20} height={20} />
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {label}
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={600} sx={{ mt: 0.5 }}>
                {value}
            </Typography>
        </Box>
    </Stack>
  );

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
            {/* ... Filters (Search, Date, Machine) ... */}
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
                  startAdornment: (
                    <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
                      <IconifyIcon icon="mdi:search" width={1} height={1} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="caption" fontWeight={300} fontSize={14} color="text.secondary" display="block" mb={0.5}>
                  From Date
              </Typography>
              <DatePicker
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true, InputProps: { sx: { borderRadius: 2, bgcolor: 'background.default' } } } }}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="caption" fontWeight={300} fontSize={14} color="text.secondary" display="block" mb={0.8}>
                  To Date
              </Typography>
              <DatePicker
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true, InputProps: { sx: { borderRadius: 2, bgcolor: 'background.default' } } } }}
              />
            </Grid>

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

            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
              <Tooltip title="Clear Filters" arrow>
                <Button variant="outlined" color="secondary" size="small" onClick={handleClearFilters} startIcon={<IconifyIcon icon="mdi:filter-off" />} />
              </Tooltip>

              <Tooltip title="Export Options" arrow>
                <IconButton onClick={handleOpenDownloadMenu} sx={{ color: 'primary.main', bgcolor: 'rgba(228, 244, 253, 1)', '&:hover': { bgcolor: '#9bcdfcff' } }}>
                  <IconifyIcon icon="lucide:download" />
                </IconButton>
              </Tooltip>

              <Menu anchorEl={anchorEl} open={openDownloadMenu} onClose={handleCloseDownloadMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem onClick={handleExportExcel}><ListItemIcon><IconifyIcon icon="vscode-icons:file-type-excel2" color="success.main" /></ListItemIcon><ListItemText>Export to Excel</ListItemText></MenuItem>
                <MenuItem onClick={handleExportWord}><ListItemIcon><IconifyIcon icon="vscode-icons:file-type-word" color="info.main" /></ListItemIcon><ListItemText>Export to Word</ListItemText></MenuItem>
              </Menu>

              <Tooltip title="Refresh" arrow>
                <IconButton onClick={onRefresh} disabled={loading} sx={{ color: 'primary.main', bgcolor: 'rgba(228, 244, 253, 1)', '&:hover': { bgcolor: '#9bcdfcff' } }}>
                  <IconifyIcon icon="charm:refresh" />
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
                getRowId={(row) => row.Weighbridge_Id}
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                pageSizeOptions={[5, 10, 20]}
                slots={{
                    loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
                    pagination: CustomPagination,
                    noRowsOverlay: () => <Stack height="100%" alignItems="center" justifyContent="center">No weighbridges found</Stack>,
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
                    '& .MuiDataGrid-columnHeaders': { bgcolor: theme.palette.background.default, borderBottom: `2px solid ${theme.palette.divider}`, fontWeight: 'bold' },
                }}
            />
        </Box>

        {/* --- PROFESSIONAL DETAIL MODAL / CARD --- */}
        <Dialog 
            open={openDetailModal} 
            onClose={handleCloseDetail}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, overflow: 'hidden' }
            }}
        >
            {selectedWeighbridge && (
                <>
                    {/* Header */}
                    <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Serial Number</Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {selectedWeighbridge.Serial_no}
                                </Typography>
                            </Box>
                            <Box 
                                sx={{ 
                                    bgcolor: 'white', 
                                    color: 'primary.main', 
                                    borderRadius: '50%', 
                                    width: 40, height: 40, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}
                            >
                                <IconifyIcon icon="ph:barcode-bold" width={24} />
                            </Box>
                        </Stack>
                    </DialogTitle>

                    {/* Content */}
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <DetailRow 
                                    label="Machine Name" 
                                    value={machines.find(m => m.id === selectedWeighbridge.Machine_Id)?.machineName || "Unknown"} 
                                    icon="mdi:factory"
                                />
                                <DetailRow 
                                    label="Port Connected" 
                                    value={selectedWeighbridge.Port} 
                                    icon="material-symbols:usb-rounded"
                                />
                                <Stack direction="row" spacing={2} width="100%">
                                    <Box flex={1}>
                                        <DetailRow label="Baud Rate" value={selectedWeighbridge.Baud_rate} icon="mdi:speedometer" />
                                    </Box>
                                    <Box flex={1}>
                                        <DetailRow label="Parity" value={selectedWeighbridge.Party} icon="mdi:code-tags-check" />
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={2} width="100%">
                                    <Box flex={1}>
                                        <DetailRow label="Data Bit" value={selectedWeighbridge.Data_bit.toString()} icon="mdi:numeric-8-box-multiple-outline" />
                                    </Box>
                                    <Box flex={1}>
                                        <DetailRow label="Stop Bit" value={selectedWeighbridge.Stop_bit.toString()} icon="mdi:stop-circle-outline" />
                                    </Box>
                                </Stack>
                                <Box mt={2}>
                                    <Typography variant="caption" color="text.secondary">Creation Date</Typography>
                                    <Chip 
                                        size="small" 
                                        icon={<IconifyIcon icon="mdi:calendar" />}
                                        label={selectedWeighbridge.Created_at ? dayjs(selectedWeighbridge.Created_at).format('DD MMM, YYYY - hh:mm A') : "N/A"}
                                        sx={{ mt: 0.5, bgcolor: 'background.default' }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <Divider />

                    {/* Actions */}
                    <DialogActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: 'background.neutral' }}>
                         <Button onClick={handleCloseDetail} color="inherit">
                            Close
                         </Button>
                         
                         <Stack direction="row" spacing={1}>
                             <Button 
                                variant="outlined" 
                                color="primary" 
                                startIcon={<IconifyIcon icon="fluent:notepad-edit-16-regular" />}
                                onClick={handleEditFromCard}
                             >
                                Edit
                             </Button>
                             <Button 
                                variant="contained" 
                                color="error" 
                                startIcon={<IconifyIcon icon="wpf:delete" />}
                                onClick={handleDeleteFromCard}
                                sx={{ boxShadow: 'none' }}
                             >
                                Delete
                             </Button>
                         </Stack>
                    </DialogActions>
                </>
            )}
        </Dialog>

      </main>
    </Stack>
  );
};

export default WeighbridgeMain;