// import { MouseEventHandler, ReactElement } from 'react';
// import {
//   AppBar,
//   Badge,
//   IconButton,
//   // InputAdornment,
//   Link,
//   Stack,
//   // TextField,
//   Toolbar,
//   Typography,
// } from '@mui/material';
// import IconifyIcon from 'components/base/IconifyIcon';
// import { drawerWidth } from 'layouts/main-layout';

// import { useLocation } from 'react-router-dom';
// import capitalizePathname from 'helpers/capitalize-pathname';
// import AccountDropdown from './AccountDropdown';
// // import LanguageDropdown from './LanguageDropdown';
// import Image from 'components/base/Image';
// import Acutuz from 'assets/logo/actuz-logo.webp';

// interface TopbarProps {
//   handleDrawerToggle: MouseEventHandler;
// }

// const Topbar = ({ handleDrawerToggle }: TopbarProps): ReactElement => {
//   const { pathname } = useLocation();
//   const title = capitalizePathname(pathname);

//   return (
//     <AppBar
//       sx={{
//         width: { lg: `calc(100% - ${drawerWidth}px + 18px)` },
//         ml: { lg: `${drawerWidth}px` },
//       }}
//     >
//       <Toolbar
//         sx={{
//           p: 2.25,
//         }}
//       >
//         <Stack direction="row" gap={1}>
//           <Link href="/" width={40} height={40} display={{ xs: 'block', lg: 'none' }}>
//             <IconButton color="inherit" sx={{ p: 0.75, bgcolor: 'inherit' }}>
//               <Image src={Acutuz} width={1} height={1} />
//             </IconButton>
//             {/* <h1>Acutuz Management Dashboard</h1> */}
//           </Link>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{
//               width: 40,
//               height: 40,
//               m: 0,
//               p: 0.75,
//               display: { lg: 'none' },
//               bgcolor: 'inherit',
//             }}
//           >
//             <IconifyIcon icon="mdi:menu" sx={{ color: "black" }} />
//           </IconButton>
//           {/* <IconButton
//             color="inherit"
//             sx={{
//               width: 40,
//               height: 40,
//               p: 1,
//               display: { xs: 'flex', lg: 'none' },
//               mr: 'auto',
//               bgcolor: 'inherit',
//             }}
//           >
//             <IconifyIcon icon="mdi:search" width={1} height={1} />
//           </IconButton> */}
//         </Stack>
//         <Stack
//           display={{ xs: 'none', lg: 'flex' }}
//           direction="row"
//           gap={{ lg: 6.25 }}
//           alignItems="center"
//           flex={'1 1 auto'}
//           justifyContent={'center'}
//           letterSpacing={1}
//           fontWeight={400}
//         >
//           {/* <Typography variant="h5" component="h5" className='text-dark' sx={{ color: "#000000" }}>
//             {pathname === '/' ? 'Dashboard' : title}
//           </Typography> */}
//           {/* <TextField
//             variant="outlined"
//             placeholder="Search..."
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
//                   <IconifyIcon icon="mdi:search" width={1} height={1} />
//                 </InputAdornment>
//               ),
//             }}
//             fullWidth
//             sx={{ maxWidth: 330 }}
//           /> */}
//           {/* <Typography variant="h1" component="h1" className='text-dark' sx={{ color: "#303030ff", fontSize: "34px" , fontFamily: "inherit"}}> */}
//           <Typography variant="h1" component="h1" className='text-dark' 
//           sx={{ background: "linear-gradient(90deg, #1a1a1aff, #1a1b1bff)",WebkitTextFillColor: "transparent",WebkitBackgroundClip: "text", fontSize: "34px" , fontFamily: "inherit"}}>
//             {pathname === '/' ? 'Dashboard' : title}
//           </Typography>
//         </Stack>
//         <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.75 }}>
//           {/* <LanguageDropdown /> */}
//           {/* <IconButton color="inherit" centerRipple sx={{ bgcolor: 'inherit', p: 0.75 }}>
//             <Badge badgeContent={4} color="primary">
//               <IconifyIcon icon="carbon:notification-filled" width={24} height={24} />
//             </Badge>
//           </IconButton> */}
//           <AccountDropdown />
//         </Stack>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Topbar;





import { MouseEventHandler, ReactElement, useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { drawerWidth } from 'layouts/main-layout';
import { useLocation } from 'react-router-dom';
import capitalizePathname from 'helpers/capitalize-pathname';
import AccountDropdown from './AccountDropdown';
import Image from 'components/base/Image';
import Acutuz from 'assets/logo/actuz-logo.webp';

interface TopbarProps {
  handleDrawerToggle: MouseEventHandler;
}

const Topbar = ({ handleDrawerToggle }: TopbarProps): ReactElement => {
  const { pathname } = useLocation();
  const title = capitalizePathname(pathname);

  // --- TIMER LOGIC ---
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(currentTime);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(currentTime);
  // -------------------

  return (
    <AppBar
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px + 18px)` },
        ml: { lg: `${drawerWidth}px` },
        boxShadow: 'none',
        // bgcolor: 'transparent', 
      }}
    >
      <Toolbar
        sx={{
          p: 2.25,
          justifyContent: 'space-between', 
        }}
      >
        {/* LEFT SECTION */}
        <Stack direction="row" gap={1}>
          <Link href="/" width={40} height={40} display={{ xs: 'block', lg: 'none' }}>
            <IconButton color="inherit" sx={{ p: 0.75, bgcolor: 'inherit' }}>
              <Image src={Acutuz} width={1} height={1} />   
            </IconButton>
          </Link>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              width: 40,
              height: 40,
              m: 0,
              p: 0.75,
              display: { lg: 'none' },
              bgcolor: 'inherit',
            }}
          >
            <IconifyIcon icon="mdi:menu" sx={{ color: "black" }} />
          </IconButton>
        </Stack>

        {/* CENTER SECTION */}
        <Stack
          display={{ xs: 'none', lg: 'flex' }}
          direction="row"
          alignItems="center"
          justifyContent={'center'}
          position="absolute"
          left="50%"
          sx={{ transform: 'translateX(-90%)' }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            className='text-dark' 
            sx={{ 
              background: "linear-gradient(90deg, #1a1a1aff, #1a1b1bff)",
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text", 
              fontSize: "34px", 
              fontFamily: "inherit",
              fontWeight: 700
            }}
          >
            {pathname === '/' ? 'Dashboard' : title}
          </Typography>
        </Stack>

        {/* RIGHT SECTION - Added the Blue Timer Widget here */}
        <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.75 }}>
          
          {/* --- BLUE STYLE TIMER WIDGET --- */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              display: { xs: 'none', md: 'flex' },
              bgcolor: '#e3f2fd', // Light Blue Background
              border: '1px solid #bbdefb', // Slight Darker Blue Border
              borderRadius: '16px', // Rounded Pill Shape
              px: 2.5,
              py: 1,
            }}
          >
            {/* Date Part */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconifyIcon 
                icon="uis:calender" 
                width={22} 
                height={22} 
                sx={{ color: '#2196f3' }} // Blue Icon
              />
              <Typography 
                variant="subtitle1" 
                fontWeight={700} 
                sx={{ color: '#0d47a1', fontSize: '15px' }} // Dark Blue Text
              >
                {formattedDate}
              </Typography>
            </Stack>

            {/* Vertical Divider */}
            <Box sx={{ width: '1px', height: '20px', bgcolor: '#90caf9' }} />

            {/* Time Part */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconifyIcon 
                icon="uim:clock" 
                width={22} 
                height={22} 
                sx={{ color: '#ff5e00ff' }} // Orange Icon
              />
              <Typography 
                variant="subtitle1" 
                fontWeight={700} 
                sx={{ 
                  color: '#0d47a1', // Dark Blue Text
                  fontSize: '15px', 
                  fontVariantNumeric: 'tabular-nums' 
                }}
              >
                {formattedTime}
              </Typography>
            </Stack>
          </Stack>
          {/* ------------------------------- */}

          <AccountDropdown />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;