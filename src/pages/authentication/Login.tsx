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










import { ReactElement, Suspense, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import authApi from 'services/authApi';
import Authlogin from 'assets/authentication-banners/login1.webp';
import IconifyIcon from 'components/base/IconifyIcon';
import Acutuz from 'assets/logo/actuz-logo.webp';
import Image from 'components/base/Image';
import '../RegisterManagement/MachineRegister/MachineRegister.css';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

// 1. Define Types for better Type Safety
interface FormErrors {
  username?: string;
  password?: string;
}

const Login = (): ReactElement => {
  const navigate = useNavigate();

  // State Management
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 2. Add Loading State
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  
  // 3. Add Error State Management
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null); // For global API errors (e.g. 401 Unauthorized)

  // 4. Validation Logic
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
    } 
    else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    
    // 5. Clear specific field error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    setApiError(null); 


    if (!validateForm()) {
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
        localStorage.setItem("vendor_id",response.user.vendor_id)
        localStorage.setItem("Role",response.user.Role)
        localStorage.setItem("access_token",response.user.token)
        navigate('/');
        enqueueSnackbar("Login Successfull")
        console.log("Login Successfull")
      } else {
        setApiError(response.message || 'Invalid credentials provided.');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setApiError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleCloseSnackbar = () => {
    setApiError(null);
  };

  return (
    <Stack
      direction="row"
      bgcolor="background.paper"
      boxShadow={(theme) => theme.shadows[3]}
      height={560}
      width={{ md: 960 }}
    >
      <Snackbar 
        open={!!apiError} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {apiError}
        </Alert>
      </Snackbar>

      <Stack width={{ md: 0.5 }} m={2.5} gap={10}>
        <Link href="/" width="fit-content">
          <Image src={Acutuz} width={65.8} />
        </Link>
        <Stack alignItems="center" gap={2.5} width={330} mx="auto">
          <Typography variant="h3">Login</Typography>

          {/* Username Field */}
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink htmlFor="username" error={!!errors.username}>
              Username
            </InputLabel>
            <TextField
              variant="filled"
              className="input-bg-color label-black"
              placeholder="Enter your Username"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={loading} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconifyIcon 
                      icon="ic:baseline-email" 
                      color={errors.username ? 'error.main' : 'text.secondary'}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {/* Password Field */}
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink htmlFor="password" error={!!errors.password}>
              Password
            </InputLabel>
            <TextField
              variant="filled"
              className="input-bg-color label-black"
              placeholder="********"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      disabled={loading}
                      sx={{ color: errors.password ? 'error.main' : 'text.secondary' }}
                    >
                      {showPassword ? (
                        <IconifyIcon icon="ic:baseline-key-off" />
                      ) : (
                        <IconifyIcon icon="ic:baseline-key" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              // Allow submitting by pressing Enter
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
          </FormControl>

          {/* Login Button with Loading State */}
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSubmit}
            disabled={loading} // Prevent double clicks
            size="large"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Log in'
            )}
          </Button>
        </Stack>
      </Stack>
      
      <Suspense
        fallback={
          <Skeleton variant="rectangular" height={1} width={1} sx={{ bgcolor: 'primary.main' }} />
        }
      >
        <Image
          alt="Login banner"
          src={Authlogin}
          sx={{
            width: 0.5,
            display: { xs: 'none', md: 'block' },
            objectFit: 'cover'
          }}
        />
      </Suspense>
    </Stack>
  );
};

export default Login;
