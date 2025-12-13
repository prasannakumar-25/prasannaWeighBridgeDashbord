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
// // import { Machine, Weighbridge } from "./WeighbridgeRegister"; // Import types from Parent
// import { Machine, Weighbridge } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";

// interface WeighbridgeDrawerProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: Weighbridge) => void;
//   initialData: Weighbridge | null;
//   machines: Machine[];
//   loading?: boolean;
// }

// const WeighbridgeDrawer: React.FC<WeighbridgeDrawerProps> = ({
//   open,
//   onClose,
//   onSave,
//   initialData,
//   machines,
//   loading = false,
// }) => {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

//   const [formError, setFormError] = useState<string | null>(null);

//   // Default Form State
//   const defaultForm: Weighbridge = {
//     id: 0,
//     machineId: undefined,
//     serialNo: "",
//     port: "COM4",
//     baudRate: "19200",
//     dataBit: 8,
//     stopBit: 1,
//     party: "None",
//     createdAt: new Date().toISOString(),
//   };

//   const [form, setForm] = useState<Weighbridge>(defaultForm);

//   // Reset or Populate form when Drawer opens
//   useEffect(() => {
//     if (open) {
//       setFormError(null);
//       if (initialData) {
//         setForm({ ...initialData });
//       } else {
//         setForm({ ...defaultForm, createdAt: new Date().toISOString() });
//       }
//     }
//   }, [open, initialData]);

//   const setField = (key: keyof Weighbridge, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const validate = (): boolean => {
//     if (!form.serialNo?.trim()) {
//       setFormError("Serial Number is required.");
//       return false;
//     }
//     if (!form.machineId) {
//       setFormError("Please associate a Machine.");
//       return false;
//     }
//     if (!form.party?.trim()) {
//       setFormError("Party (Parity) is required.");
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
//           {initialData ? "Edit Weighbridge" : "Add New Weighbridge"}
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
//           label="Associated Machine"
//           className="input-bg-color label-black"
//           select
//           fullWidth
//           value={form.machineId || ""}
//           onChange={(e) => setField("machineId", Number(e.target.value))}
//           disabled={loading}
//         >
//           <MenuItem value={0}>
//             <em>None</em>
//           </MenuItem>
//           {machines.map((m) => (
//             <MenuItem key={m.id} value={m.id}>
//               {m.machineName}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           label="Serial No"
//           className="input-bg-color label-black"
//           placeholder="Enter Serial Number"
//           fullWidth
//           value={form.serialNo}
//           onChange={(e) => setField("serialNo", e.target.value)}
//           disabled={loading}
//         />

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Port"
//             className="input-bg-color label-black"
//             select
//             fullWidth
//             value={form.port}
//             onChange={(e) => setField("port", e.target.value)}
//             disabled={loading}
//           >
//             <MenuItem value="COM3">COM3</MenuItem>
//             <MenuItem value="COM4">COM4</MenuItem>
//           </TextField>

//           <TextField
//             label="Baud Rate"
//             className="input-bg-color label-black"
//             placeholder="e.g. 19200"
//             fullWidth
//             value={form.baudRate}
//             onChange={(e) => setField("baudRate", e.target.value)}
//             disabled={loading}
//           />
//         </Stack>

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <TextField
//             label="Data Bit"
//             className="input-bg-color label-black"
//             type="number"
//             fullWidth
//             value={form.dataBit}
//             onChange={(e) => setField("dataBit", Number(e.target.value))}
//             disabled={loading}
//           />

//           <TextField
//             label="Stop Bit"
//             className="input-bg-color label-black"
//             type="number"
//             fullWidth
//             value={form.stopBit}
//             onChange={(e) => setField("stopBit", Number(e.target.value))}
//             disabled={loading}
//           />
//         </Stack>

//         <TextField
//           label="Party (Parity)"
//           className="input-bg-color label-black"
//           placeholder="e.g. None, Even, Odd"
//           fullWidth
//           value={form.party}
//           onChange={(e) => setField("party", e.target.value)}
//           disabled={loading}
//         />

//         <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
//         <Button variant="text" className="cancel-button" onClick={onClose} 
//         >
//             Cancel
//         </Button>
//         <Button variant="contained" className="edit-button" onClick={handleSubmit} 
//         >
//             {initialData ? "Update Machine" : "Save Machine"}
//         </Button>
//         </Stack>

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

// export default WeighbridgeDrawer;










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
import { Weighbridge, Machine } from "pages/RegisterManagement/WeighbridgeRegister/WeighbridgeRegister";
import "../../RegisterManagement/MachineRegister/MachineRegister.css";

interface WeighbridgeDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Weighbridge) => void;
  initialData: Weighbridge | null;
  machines: Machine[];
  loading?: boolean;
}

const WeighbridgeDrawer: React.FC<WeighbridgeDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  machines,
  loading = false,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const drawerWidth = isMdUp ? Math.min(700, Math.round(window.innerWidth * 0.55)) : window.innerWidth;

  const [formError, setFormError] = useState<string | null>(null);

  // Default Form State
  const defaultForm: Weighbridge = {
    id: 0,
    machineId: undefined,
    serialNo: "",
    port: "COM4",
    baudRate: "19200",
    dataBit: 8,
    stopBit: 1,
    party: "None",
    createdAt: new Date().toISOString(),
  };

  const [form, setForm] = useState<Weighbridge>(defaultForm);

  // Reset or Populate form when Drawer opens
  useEffect(() => {
    if (open) {
      setFormError(null);
      if (initialData) {
        setForm({ ...initialData });
      } else {
        setForm({ ...defaultForm, createdAt: new Date().toISOString() });
      }
    }
  }, [open, initialData]);

  const setField = (key: keyof Weighbridge, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    if (!form.serialNo?.trim()) {
      setFormError("Serial Number is required.");
      return false;
    }
    if (!form.machineId) {
      setFormError("Please associate a Machine.");
      return false;
    }
    if (!form.party?.trim()) {
      setFormError("Party (Parity) is required.");
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
            {initialData ? "Edit Weighbridge" : "Add New Weighbridge"}
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
            <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
      </Box>

      <Stack spacing={2.5}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <TextField
          label="Associated Machine"
          className="input-bg-color label-black"
          select
          fullWidth
          value={form.machineId || ""}
          onChange={(e) => setField("machineId", Number(e.target.value))}
          disabled={loading}
        >
          <MenuItem value={0}>
            <em>None</em>
          </MenuItem>
          {machines.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.machineName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Serial No"
          className="input-bg-color label-black"
          placeholder="Enter Serial Number"
          fullWidth
          value={form.serialNo}
          onChange={(e) => setField("serialNo", e.target.value)}
          disabled={loading}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Port"
            className="input-bg-color label-black"
            select
            fullWidth
            value={form.port}
            onChange={(e) => setField("port", e.target.value)}
            disabled={loading}
          >
            <MenuItem value="COM3">COM3</MenuItem>
            <MenuItem value="COM4">COM4</MenuItem>
          </TextField>

          <TextField
            label="Baud Rate"
            className="input-bg-color label-black"
            placeholder="e.g. 19200"
            fullWidth
            value={form.baudRate}
            onChange={(e) => setField("baudRate", e.target.value)}
            disabled={loading}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Data Bit"
            className="input-bg-color label-black"
            type="number"
            fullWidth
            value={form.dataBit}
            onChange={(e) => setField("dataBit", Number(e.target.value))}
            disabled={loading}
          />

          <TextField
            label="Stop Bit"
            className="input-bg-color label-black"
            type="number"
            fullWidth
            value={form.stopBit}
            onChange={(e) => setField("stopBit", Number(e.target.value))}
            disabled={loading}
          />
        </Stack>

        <TextField
          label="Party (Parity)"
          className="input-bg-color label-black"
          placeholder="e.g. None, Even, Odd"
          fullWidth
          value={form.party}
          onChange={(e) => setField("party", e.target.value)}
          disabled={loading}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end" pt={2}>
            <Button variant="text" className="cancel-button" onClick={onClose}>
                Cancel
            </Button>
            <Button variant="contained" className="edit-button" onClick={handleSubmit} disabled={loading}>
                {initialData ? "Update Weighbridge" : "Save Weighbridge"}
            </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default WeighbridgeDrawer;