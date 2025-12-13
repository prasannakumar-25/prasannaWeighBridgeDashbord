// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Drawer,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
//   Alert,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import IconifyIcon from "components/base/IconifyIcon";
// // import { Machine, Vehicle, Vendor } from "./VehicleRegister"; // Importing types from Parent
// import { Machine, Vehicle, Vendor } from "pages/RegisterManagement/VehicleRegister/VehicleRegister";

// interface VehicleDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (vehicleData: Vehicle) => void;
//   initialData: Vehicle | null;
//   vendors: Vendor[];
//   machines: Machine[]; // Passed to show linked machines
//   loading: boolean;
// }

// const VehicleDrawer: React.FC<VehicleDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   vendors,
//   machines,
//   loading,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);
  
//   // Default Form State
//   const defaultForm: Vehicle = {
//     id: 0,
//     vehicleType: "",
//     vendorId: undefined,
//     customerId: undefined,
//     tareWeight: undefined,
//     status: "Active",
//     createdDate: new Date().toISOString(),
//   };

//   const [form, setForm] = useState<Vehicle>(defaultForm);

//   // Reset or Populate form when Drawer opens
//   useEffect(() => {
//     if (open) {
//       setFormError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm(defaultForm);
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof Vehicle, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = (): boolean => {
//     if (!form.vehicleType?.trim()) {
//       setFormError("Vehicle type is required.");
//       return false;
//     }
//     if (form.tareWeight && form.tareWeight < 0) {
//       setFormError("Tare weight cannot be negative.");
//       return false;
//     }
//     setFormError(null);
//     return true;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       onSave(form);
//     }
//   };

//   // Helper: Get machines for the drawer dropdown info
//   const getVendorMachines = () => {
//     if (!form.vendorId) return [];
//     return machines.filter((m) => m.vendorId === form.vendorId);
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           width: drawerWidth,
//           p: 3,
//           borderTopLeftRadius: { xs: 0, md: 12 },
//           borderBottomLeftRadius: { xs: 0, md: 12 },
//         },
//       }}
//     >
//       {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h6" fontWeight="bold">
//           {initialData ? "Edit Vehicle" : "Add New Vehicle"}
//         </Typography>
//         <IconButton onClick={onClose}>
//           <IconifyIcon icon="material-symbols:close-rounded" />
//         </IconButton>
        
//       </Box> */}
//       <Box className="drawer-header">
//       <Typography variant="h6">{initialData ? "Edit Machine" : "Add New Machine"}</Typography>
//       <IconButton onClick={onClose} aria-label="close">
//           <IconifyIcon icon="material-symbols:close-rounded" />
//       </IconButton>
//       </Box>

//       <Stack spacing={2.5}>
//         {formError && <Alert severity="error">{formError}</Alert>}

//         <TextField
//           label="Vehicle Type"
//           className="input-bg-color label-black"
//           placeholder="e.g., Truck, Van, Lorry"
//           fullWidth
//           value={form.vehicleType}
//           onChange={(e) => setField("vehicleType", e.target.value)}
//           disabled={loading}
//         />

//         <TextField
//           label="Vendor"
//           className="input-bg-color label-black"
//           select
//           fullWidth
//           value={form.vendorId || ""}
//           onChange={(e) => setField("vendorId", e.target.value ? Number(e.target.value) : undefined)}
//           disabled={loading}
//         >
//           <MenuItem value={0}>
//             <em>None</em>
//           </MenuItem>
//           {vendors.map((v) => (
//             <MenuItem key={v.id} value={v.id}>
//               {v.vendorName}
//             </MenuItem>
//           ))}
//         </TextField>

//         {/* Dynamic info about machines */}
//         {form.vendorId && getVendorMachines().length > 0 && (
//           <Alert severity="info" sx={{ py: 0 }}>
//             <Typography variant="caption" fontWeight="bold">
//               Linked Machines:
//             </Typography>
//             {getVendorMachines().map((machine) => (
//               <Typography key={machine.id} variant="caption" display="block">
//                 • {machine.machineName} ({machine.machineType})
//               </Typography>
//             ))}
//           </Alert>
//         )}

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Customer ID"
//             className="input-bg-color label-black"
//             type="number"
//             placeholder="ID"
//             fullWidth
//             value={form.customerId ?? ""}
//             onChange={(e) => setField("customerId", e.target.value ? Number(e.target.value) : undefined)}
//             disabled={loading}
//           />

//           <TextField
//             label="Tare Weight (kg)"
//             className="input-bg-color label-black"
//             type="number"
//             placeholder="0.00"
//             fullWidth
//             value={form.tareWeight ?? ""}
//             onChange={(e) => setField("tareWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
//             disabled={loading}
//           />
//         </Stack>

//         <TextField
//           label="Status"
//           className="input-bg-color label-black"
//           select
//           fullWidth
//           value={form.status}
//           onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
//           disabled={loading}
//         >
//           <MenuItem value="Active">Active</MenuItem>
//           <MenuItem value="Inactive">Inactive</MenuItem>
//         </TextField>

//         <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//           <Button variant="text" className="cancel-button" onClick={onClose} 
//           >
//               Cancel
//           </Button>

//           <Button variant="contained" className="edit-button" onClick={handleSubmit} 
//           >
//               {initialData ? "Update Machine" : "Save Machine"}
//           </Button>
//           </Stack>

//         {/* <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//           <Button onClick={onClose} color="inherit">
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {initialData ? "Update" : "Save"}
//           </Button>
//         </Stack> */}
//       </Stack>
//     </Drawer>
//   );
// };

// export default VehicleDrawer;









import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { Machine, Vehicle, Vendor } from "pages/RegisterManagement/VehicleRegister/VehicleRegister";

interface VehicleDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (vehicleData: Vehicle) => void;
  initialData: Vehicle | null;
  vendors: Vendor[];
  machines: Machine[]; 
  loading?: boolean;
}

const VehicleDrawer: React.FC<VehicleDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  vendors,
  machines,
  loading = false
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

  const [formError, setFormError] = useState<string | null>(null);
  
  // Default Form State
  const defaultForm: Vehicle = {
    id: 0,
    vehicleType: "",
    vendorId: undefined,
    customerId: undefined,
    tareWeight: undefined,
    status: "Active",
    createdDate: new Date().toISOString(),
  };

  const [form, setForm] = useState<Vehicle>(defaultForm);

  // Reset or Populate form when Drawer opens
  useEffect(() => {
    if (open) {
      setFormError(null);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm(defaultForm);
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof Vehicle, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    if (!form.vehicleType?.trim()) {
      setFormError("Vehicle type is required.");
      return false;
    }
    if (form.tareWeight && form.tareWeight < 0) {
      setFormError("Tare weight cannot be negative.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(form);
    }
  };

  // Helper: Get machines for the drawer dropdown info
  const getVendorMachines = () => {
    if (!form.vendorId) return [];
    return machines.filter((m) => m.vendorId === form.vendorId);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          p: 3,
          borderTopLeftRadius: { xs: 0, md: 12 },
          borderBottomLeftRadius: { xs: 0, md: 12 },
        },
      }}
    >
      <Box className="drawer-header" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
            {initialData ? "Edit Vehicle" : "Add New Vehicle"}
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
            <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      <Stack spacing={2.5}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <TextField
          label="Vehicle Type"
          className="input-bg-color label-black"
          placeholder="e.g., Truck, Van, Lorry"
          fullWidth
          value={form.vehicleType}
          onChange={(e) => setField("vehicleType", e.target.value)}
          disabled={loading}
        />

        <TextField
          label="Vendor"
          className="input-bg-color label-black"
          select
          fullWidth
          value={form.vendorId || ""}
          onChange={(e) => setField("vendorId", e.target.value ? Number(e.target.value) : undefined)}
          disabled={loading}
        >
          <MenuItem value={0}>
            <em>None</em>
          </MenuItem>
          {vendors.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.vendorName}
            </MenuItem>
          ))}
        </TextField>

        {/* Dynamic info about machines */}
        {form.vendorId && getVendorMachines().length > 0 && (
          <Alert severity="info" sx={{ py: 0 }}>
            <Typography variant="caption" fontWeight="bold">
              Linked Machines:
            </Typography>
            {getVendorMachines().map((machine) => (
              <Typography key={machine.id} variant="caption" display="block">
                • {machine.machineName} ({machine.machineType})
              </Typography>
            ))}
          </Alert>
        )}

        {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}> */}
          <TextField
            label="Customer ID"
            className="input-bg-color label-black"
            type="number"
            placeholder="ID"
            fullWidth
            value={form.customerId ?? ""}
            onChange={(e) => setField("customerId", e.target.value ? Number(e.target.value) : undefined)}
            disabled={loading}
          />

          <TextField
            label="Tare Weight (kg)"
            className="input-bg-color label-black"
            type="number"
            placeholder="0.00"
            fullWidth
            value={form.tareWeight ?? ""}
            onChange={(e) => setField("tareWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
            disabled={loading}
          />
        {/* </Stack> */}

        <TextField
          label="Status"
          className="input-bg-color label-black"
          select
          fullWidth
          value={form.status}
          onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
          disabled={loading}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>

        <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
          <Button variant="text" className="cancel-button" onClick={onClose}>
              Cancel
          </Button>

          <Button variant="contained" className="edit-button" onClick={handleSubmit} disabled={loading}>
              {initialData ? "Update Vehicle" : "Save Vehicle"}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default VehicleDrawer;