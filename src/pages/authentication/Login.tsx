// import { ReactElement, Suspense, useState } from 'react';
// import {
//   Button,
//   FormControl,
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   Link,
//   Skeleton,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// // import loginBanner from 'assets/authentication-banners/login.png';
// import authApi from 'services/authApi';
// import Authlogin from 'assets/authentication-banners/login1.webp'
// import IconifyIcon from 'components/base/IconifyIcon';
// // import logo from 'assets/logo/elegant-logo.png';
// import Acutuz from 'assets/logo/actuz-logo.webp';
// import Image from 'components/base/Image';
// import "../RegisterManagement/MachineRegister/MachineRegister.css"
// import { useNavigate } from 'react-router-dom';

// const Login = (): ReactElement => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [form, setForm] = useState({
//   username: '',
//   password: '',
//       });

// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setForm({
//     ...form,
//     [e.target.name]: e.target.value,
//   });
// };

// const navigate=useNavigate()

// const handleSubmit=async()=>{

//       try{

//         const payload={
//           User_name:form.username,
//           Password:form.password
//         }

//         const response = await authApi.addauthuser(payload)

//         if (response.success)
//         {
//           console.log("successs")
//           navigate("/")
//         }
//         else
//         {
//           console.log("failed to login")
//         }

//       }
//       catch(error)
//       {
//           console.error("failed to login in fetch APi")
//           throw error
//       }

// }

//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   return (
//     <Stack
//       direction="row"
//       bgcolor="background.paper"
//       boxShadow={(theme) => theme.shadows[3]}
//       height={560}
//       width={{ md: 960 }}
//     >
//       <Stack width={{ md: 0.5 }} m={2.5} gap={10}>
//         <Link href="/" width="fit-content">
//           <Image src={Acutuz} width={65.8} />
//         </Link>
//         <Stack alignItems="center" gap={2.5} width={330} mx="auto">
//           <Typography variant="h3">Login</Typography>
//           <FormControl variant="standard" fullWidth>
//             <InputLabel shrink htmlFor="email">
//               Username
//             </InputLabel>
//            <TextField
//             variant="filled"
//             className="input-bg-color label-black"
//             placeholder="Enter your Username"
//             id="email"
//             name="username"         
//             value={form.username}
//             onChange={handleChange}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconifyIcon icon="ic:baseline-email" />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           </FormControl>
//           <FormControl variant="standard" fullWidth>
//             <InputLabel shrink htmlFor="password">
//               Password
//             </InputLabel>
//             <TextField
//               variant="filled"
//               className="input-bg-color label-black"
//               placeholder="********"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               value={form.password}
//               onChange={handleChange}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleClickShowPassword}
//                     edge= "end"
//                     sx ={{ color: 'text.secondary' }}
//                     >
//                       {showPassword ? (
//                         <IconifyIcon icon="ic:baseline-key-off" />
//                       ) : (
//                         <IconifyIcon icon="ic:baseline-key" />
//                       )}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//           </FormControl>
//           {/* <Typography
//             variant="body1"
//             sx={{
//               alignSelf: 'flex-end',
//             }}
//           >
//             <Link href="/authentication/forgot-password" underline="hover">
//               Forget password
//             </Link>
//           </Typography> */}
//           <Button variant="contained" fullWidth onClick={handleSubmit}>
//             Log in
//           </Button>
//           {/* <Typography variant="body2" color="text.secondary">
//             Don't have an account ?{' '}
//             <Link
//               href="/authentication/sign-up"
//               underline="hover"
//               fontSize={(theme) => theme.typography.body1.fontSize}
//             >
//               Sign up
//             </Link>
//           </Typography> */}
//         </Stack>
//       </Stack>
//       <Suspense
//         fallback={
//           <Skeleton variant="rectangular" height={1} width={1} sx={{ bgcolor: 'primary.main' }} />
//         }
//       >
//         <Image
//           alt="Login banner"
//           src={Authlogin}
//           sx={{
//             width: 0.5,
//             display: { xs: 'none', md: 'block' },
//           }}
//         />
//       </Suspense>
//     </Stack>
//   );
// };

// export default Login;













// import { ReactElement, Suspense, useState } from 'react';
// import {
//   Alert,
//   Button,
//   CircularProgress,
//   Checkbox,         // Added
//   FormControl,
//   FormControlLabel, // Added
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   Link,
//   Skeleton,
//   Snackbar,
//   Stack,
//   TextField,
//   Typography,
//   LinearProgress
// } from '@mui/material';
// import authApi from 'services/authApi';
// import Authlogin from 'assets/authentication-banners/login1.webp';
// import IconifyIcon from 'components/base/IconifyIcon';
// import Acutuz from 'assets/logo/actuz-logo.webp';
// import Image from 'components/base/Image';
// import '../RegisterManagement/MachineRegister/MachineRegister.css';
// import { useAsyncError, useNavigate } from 'react-router-dom';


// interface FormErrors {
//   username?: string;
//   password?: string;
// }

// const Login = (): ReactElement => {
//   const navigate = useNavigate();
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // 1. New State for Stay Logged In
//   const [rememberMe, setRememberMe] = useState(false);

//   const [form, setForm] = useState({
//     username: '',
//     password: '',
//   });
  
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [apiError, setApiError] = useState<string | null>(null);

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
//     let isValid = true;

//     if (!form.username.trim()) {
//       newErrors.username = 'Username is required';
//       isValid = false;
//     }

//     if (!form.password) {
//       newErrors.password = 'Password is required';
//       isValid = false;
//     } 
//     else if (form.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({
//       ...form,
//       [name]: value,
//     });
    
//     if (errors[name as keyof FormErrors]) {
//       setErrors({
//         ...errors,
//         [name]: undefined,
//       });
//     }
//   };

//   const handleClickShowPassword = () => setShowPassword(!showPassword);

//   const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
//     event.preventDefault();
//   };

//   const handleSubmit = async () => {
//     setApiError(null); 

//     if (!validateForm()) {
//       setSnackbarMessage("Please fill in all required fields correctly.");
//       setSnackbarOpen(true);
//       return;
//     }
//      setLoading(true);

//     try {
//       const payload = {
//         User_name: form.username,
//         Password: form.password,
//       };

//       const response = await authApi.addauthuser(payload);

//       if (response.success) {
//         // 2. Modified Storage Logic
//         const storage = rememberMe ? localStorage : sessionStorage;

//         storage.setItem("vendor_id", response.user.vendor_id);
//         storage.setItem("Role", response.user.Role);
//         storage.setItem("access_token", response.user.token);

//         navigate('/');
//         setSnackbarMessage("Login Successfull");
//         setSnackbarOpen(true);
//         console.log("Login Successfull");
//       } else {
//         setApiError(response.message || 'Invalid credentials provided.');
//       }
//     } catch (error: any) {
//       console.error("Login failed:", error);
//       // ... error handling logic ...
//       let errorMessage = "";
//       if (error.response?.status === 401) {
//         errorMessage = "Invalid username or password.";
//       } else if (error.response?.status === 403) {
//         errorMessage = "You do not have permission to access this account.";
//       } else if (error.response?.status >= 500) {
//         errorMessage = "Server error. Please try again later.";
//       } else if (error.message === "Network Error") {
//         errorMessage = "Network error. Please check your internet connection.";
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
//       setApiError(errorMessage);
//       setSnackbarMessage(errorMessage);
//       setSnackbarOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleCloseSnackbar = () => {
//   //   setApiError(null);
//   // };

//   return (
//     <Stack
//       direction="row"
//       bgcolor="background.paper"
//       boxShadow={(theme) => theme.shadows[3]}
//       height={560}
//       width={{ md: 960 }}
//     >
//         {/* ... Snackbar and Logo code ... */}
//       {/* <Snackbar 
//         open={!!apiError} 
//         autoHideDuration={6000} 
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
//           {apiError}
//         </Alert>
//       </Snackbar> */}

//       <Stack width={{ md: 0.5 }} m={1.1} gap={5}>
//         <Link href="/" width="fit-content">
//           <Image src={Acutuz} width={70.8} />
//         </Link>
//         <Stack alignItems="center" gap={2.5} width={330} mx="auto">
//           <Typography variant="h3">Login</Typography>

//           <FormControl variant="standard" fullWidth>
//              {/* ... Username Field ... */}
//             <InputLabel shrink htmlFor="username" error={!!errors.username}>
//               Username
//             </InputLabel>
//             <TextField
//               variant="filled"
//               className="input-bg-color label-black"
//               placeholder="Enter your Username"
//               id="username"
//               name="username"
//               value={form.username}
//               onChange={handleChange}
//               error={!!errors.username}
//               helperText={errors.username}
//               disabled={loading} 
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconifyIcon 
//                       icon="ic:baseline-email" 
//                       color={errors.username ? 'error.main' : 'text.secondary'}
//                     />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </FormControl>

//           <FormControl variant="standard" fullWidth>
//             {/* ... Password Field ... */}
//             <InputLabel shrink htmlFor="password" error={!!errors.password}>
//               Password
//             </InputLabel>
//             <TextField
//               variant="filled"
//               className="input-bg-color label-black"
//               placeholder="********"
//               id="password"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               value={form.password}
//               onChange={handleChange}
//               error={!!errors.password}
//               helperText={errors.password}
//               disabled={loading} 
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={handleClickShowPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                       disabled={loading}
//                       sx={{ color: errors.password ? 'error.main' : 'text.secondary' }}
//                     >
//                       {showPassword ? (
//                         <IconifyIcon icon="ic:baseline-key-off" />
//                       ) : (
//                         <IconifyIcon icon="ic:baseline-key" />
//                       )}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') handleSubmit();
//               }}
//             />
//           </FormControl>

//           {/* 3. New Checkbox UI Added Here */}
//           <Stack direction="row" alignItems="center" width="100%" sx={{ mt: -1 }}>
//             <FormControlLabel
//               control={
//                 <Checkbox 
//                   checked={rememberMe} 
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   color="primary"
//                 />
//               }
//               label="Stay logged in"
//               sx={{ color: 'text.secondary' }}
//             />
//           </Stack>

//           <Button 
//             variant="contained" 
//             fullWidth 
//             onClick={handleSubmit}
//             disabled={loading} 
//             size="large"
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               'Log in'
//             )}
//           </Button>
//         </Stack>
//       </Stack>
      
//       <Suspense
//         fallback={
//           <Skeleton variant="rectangular" height={1} width={1} sx={{ bgcolor: 'primary.main' }} />
//         }
//       >
//         <Image
//           alt="Login banner"
//           src={Authlogin}
//           sx={{
//             width: 0.5,
//             display: { xs: 'none', md: 'block' },
//             objectFit: 'cover'
//           }}
//         />
//       </Suspense>
//       <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={3500}
//           onClose={() => setSnackbarOpen(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//           <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
//               {snackbarMessage}
//                <LinearProgress
//             variant="determinate"
//             value={100}
//             sx={{
//               mt: 1,
//               height: 4,
//               borderRadius: 2,
//               bgcolor: '#c8e6c9',
//               '& .MuiLinearProgress-bar': {
//                 bgcolor: '#66bb6a',
//                 animation: 'snackbarProgress 3.5s linear forwards',
//               },
//               '@keyframes snackbarProgress': {
//                 to: { width: '100%' },
//                 from: { width: '0%' },
//               },
//             }}
//           />
//           </Alert>
//       </Snackbar>
//     </Stack>
//   );
// };

// export default Login;








import { ReactElement, Suspense, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  LinearProgress,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import authApi from 'services/authApi';
import Authlogin from 'assets/authentication-banners/login1.webp';
import IconifyIcon from 'components/base/IconifyIcon';
import Acutuz from 'assets/logo/actuz-logo.webp';
import Image from 'components/base/Image';
import '../RegisterManagement/MachineRegister/MachineRegister.css'; // Keeping your CSS import
import { useNavigate } from 'react-router-dom';

interface FormErrors {
  username?: string;
  password?: string;
}

const Login = (): ReactElement => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTinyScreen = useMediaQuery('(max-width:300px)');

  // UI State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form State
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // --- Logic Section (Unchanged) ---
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields correctly.");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);

    try {
      const payload = {
        User_name: form.username,
        Password: form.password,
      };

      const response = await authApi.addauthuser(payload);

      if (response.success) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("vendor_id", response.user.vendor_id);
        storage.setItem("Role", response.user.Role);
        storage.setItem("access_token", response.user.token);

        navigate('/');
        setSnackbarMessage("Login Successful");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(response.message || 'Invalid credentials provided.');
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.response?.status === 401) errorMessage = "Invalid username or password.";
      else if (error.response?.status === 403) errorMessage = "Permission denied.";
      else if (error.message === "Network Error") errorMessage = "Network error. Check connection.";
      else if (error.response?.data?.message) errorMessage = error.response.data.message;
      
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        // minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default', 
        p: 2,
        overflowY: 'auto'
      }}
    >
      {/* Animation Styles */}
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Main Card Container */}
      <Paper
        elevation={6}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          maxWidth: 960,
          borderRadius: 4,
          overflow: 'hidden',
          animation: 'slideUpFade 0.6s ease-out',
          bgcolor: 'background.paper',
        }}
      >
        {/* Left Side: Form Section */}
        <Stack
          flex={1}
          justifyContent="center"
          alignItems="center"
          sx={{
            p: { xs: 3, sm: 5 },
            minWidth: { xs: '100%', md: '50%' },
            position: 'relative'
          }}
        >
          
          <Box 
            component={Link} 
            href="/" 
            sx={{ 
              mb: 4, 
              alignSelf: 'flex-start',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' } 
            }}
          >
            <Image src={Acutuz} width={isTinyScreen ? 50 : 70.8} />
          </Box>

          <Stack width="100%" maxWidth={400}  spacing={3}>
            {/* Header Text */}
            <Stack spacing={1} alignItems={'center'}>
              <Typography variant="h3"  fontWeight="bold" color="text.primary">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter your details to sign in.
              </Typography>
            </Stack>

            {/* Inputs */}
            <Stack spacing={2.5}>
              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="username" error={!!errors.username}>
                  Username
                </InputLabel>
                <TextField
                  variant="outlined"
                  placeholder="Enter your Username"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconifyIcon
                          icon="ic:baseline-person" // Changed to person icon for username
                          color={errors.username ? 'error.main' : 'text.disabled'}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <FormControl variant="standard" fullWidth>
                <InputLabel shrink htmlFor="password" error={!!errors.password}>
                  Password
                </InputLabel>
                <TextField
                  variant="outlined"
                  placeholder="********"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          disabled={loading}
                        >
                          <IconifyIcon
                            icon={showPassword ? "ic:baseline-visibility-off" : "ic:baseline-visibility"}
                            color={errors.password ? 'error.main' : 'text.disabled'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit();
                  }}
                />
              </FormControl>
            </Stack>

            {/* Options Row (Checkbox & Forgot Password) */}
            <Stack 
              direction={isTinyScreen ? "column" : "row"} 
              alignItems={isTinyScreen ? "flex-start" : "center"} 
              justifyContent="space-between"
              sx={{ mt: -1 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Stay logged in</Typography>}
              />
              {/* Optional: Add Forgot Password link here later if needed */}
              {/* <Link href="#" variant="body2" underline="hover" sx={{ ml: isTinyScreen ? 4 : 0 }}>
                Forgot Password?
              </Link> */}
            </Stack>

            {/* Submit Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Log in'
              )}
            </Button>
          </Stack>
        </Stack>

        {/* Right Side: Image/Banner Section */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: '50%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Suspense
            fallback={
              <Skeleton variant="rectangular" height="100%" width="100%" sx={{ bgcolor: 'grey.300' }} />
            }
          >
            <Image
              alt="Login banner"
              src={Authlogin}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // Optional: Zoom effect on the image
                animation: 'zoomIn 20s infinite alternate',
                '@keyframes zoomIn': {
                  from: { transform: 'scale(1)' },
                  to: { transform: 'scale(1.1)' }
                }
              }}
            />
          </Suspense>
          
          {/* Optional Overlay text on Image */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              p: 4,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h5" fontWeight="bold">Manage your machines efficiently.</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>Secure and reliable access.</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarMessage.includes("Success") ? "success" : "error"} 
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {snackbarMessage}
          {snackbarMessage.includes("Success") && (
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                mt: 1,
                height: 4,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white',
                  animation: 'snackbarProgress 3.5s linear forwards',
                },
                '@keyframes snackbarProgress': {
                  to: { width: '100%' },
                  from: { width: '0%' },
                },
              }}
            />
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;