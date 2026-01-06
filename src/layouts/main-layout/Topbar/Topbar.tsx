
// import { MouseEventHandler, ReactElement, useEffect, useState } from 'react';
// import {
//   AppBar,
//   Box,
//   Divider,
//   IconButton,
//   Link,
//   Stack,
//   Toolbar,
//   Typography,
// } from '@mui/material';
// import IconifyIcon from 'components/base/IconifyIcon';
// import { drawerWidth } from 'layouts/main-layout';
// import { useLocation } from 'react-router-dom';
// import capitalizePathname from 'helpers/capitalize-pathname';
// import AccountDropdown from './AccountDropdown';
// import Image from 'components/base/Image';
// import Acutuz from 'assets/logo/actuz-logo.webp';

// interface TopbarProps {
//   handleDrawerToggle: MouseEventHandler;
// }

// const Topbar = ({ handleDrawerToggle }: TopbarProps): ReactElement => {
//   const { pathname } = useLocation();
//   const title = capitalizePathname(pathname);

//   // --- TIMER LOGIC ---
//   const [currentTime, setCurrentTime] = useState<Date>(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formattedDate = new Intl.DateTimeFormat('en-US', {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//   }).format(currentTime);

//   const formattedTime = new Intl.DateTimeFormat('en-US', {
//     hour: 'numeric',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true,
//   }).format(currentTime);
//   // -------------------

//   return (
//     <AppBar
//       sx={{
//         width: { lg: `calc(100% - ${drawerWidth}px + 18px)` },
//         ml: { lg: `${drawerWidth}px` },
//         boxShadow: 'none',
//         // bgcolor: 'transparent', 
//       }}
//     >
//       <Toolbar
//         sx={{
//           p: 2.25,
//           justifyContent: 'space-between', 
//         }}
//       >
//         {/* LEFT SECTION */}
//         <Stack direction="row" gap={1}>
//           <Link href="/" width={40} height={40} display={{ xs: 'block', lg: 'none' }}>
//             <IconButton color="inherit" sx={{ p: 0.75, bgcolor: 'inherit' }}>
//               <Image src={Acutuz} width={1} height={1} />   
//             </IconButton>
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
//         </Stack>

//         {/* CENTER SECTION */}
//         <Stack
//           display={{ xs: 'none', lg: 'flex' }}
//           direction="row"
//           alignItems="center"
//           justifyContent={'center'}
//           position="absolute"
//           left="50%"
//           sx={{ transform: 'translateX(-90%)' }}
//         >
//           <Typography 
//             variant="h1" 
//             component="h1" 
//             className='text-dark' 
//             sx={{ 
//               background: "linear-gradient(90deg, #1a1a1aff, #1a1b1bff)",
//               WebkitTextFillColor: "transparent",
//               WebkitBackgroundClip: "text", 
//               fontSize: "34px", 
//               fontFamily: "inherit",
//               fontWeight: 700
//             }}
//           >
//             {pathname === '/' ? 'Dashboard' : title}
//           </Typography>
//         </Stack>

//         {/* RIGHT SECTION - Added the Blue Timer Widget here */}
//         <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.75 }}>
          
//           {/* --- BLUE STYLE TIMER WIDGET --- */}
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={2}
//             sx={{
//               display: { xs: 'none', md: 'flex' },
//               bgcolor: '#e3f2fd', // Light Blue Background
//               border: '1px solid #bbdefb', // Slight Darker Blue Border
//               borderRadius: '16px', // Rounded Pill Shape
//               px: 2.5,
//               py: 1,
//             }}
//           >
//             {/* Date Part */}
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <IconifyIcon 
//                 icon="uis:calender" 
//                 width={22} 
//                 height={22} 
//                 sx={{ color: '#2196f3' }} // Blue Icon
//               />
//               <Typography 
//                 variant="subtitle1" 
//                 fontWeight={700} 
//                 sx={{ color: '#0d47a1', fontSize: '15px' }} // Dark Blue Text
//               >
//                 {formattedDate}
//               </Typography>
//             </Stack>

//             {/* Vertical Divider */}
//             <Box sx={{ width: '1px', height: '20px', bgcolor: '#90caf9' }} />

//             {/* Time Part */}
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <IconifyIcon 
//                 icon="uim:clock" 
//                 width={22} 
//                 height={22} 
//                 sx={{ color: '#ff5e00ff' }} // Orange Icon
//               />
//               <Typography 
//                 variant="subtitle1" 
//                 fontWeight={700} 
//                 sx={{ 
//                   color: '#0d47a1', // Dark Blue Text
//                   fontSize: '15px', 
//                   fontVariantNumeric: 'tabular-nums' 
//                 }}
//               >
//                 {formattedTime}
//               </Typography>
//             </Stack>
//           </Stack>
//           {/* ------------------------------- */}

//           <AccountDropdown />
//         </Stack>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Topbar;








// import { MouseEventHandler, ReactElement, useEffect, useState } from 'react';
// import {
//   AppBar,
//   Box,
//   IconButton,
//   Link,
//   Stack,
//   Toolbar,
//   Typography,
//   keyframes, // Import keyframes for animation
// } from '@mui/material';
// import IconifyIcon from 'components/base/IconifyIcon';
// import { drawerWidth } from 'layouts/main-layout';
// import { useLocation } from 'react-router-dom';
// import capitalizePathname from 'helpers/capitalize-pathname';
// import AccountDropdown from './AccountDropdown';
// import Image from 'components/base/Image';
// import Acutuz from 'assets/logo/actuz-logo.webp';

// // --- ANIMATION DEFINITIONS ---
// const suspension = keyframes`
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-2px); }
// `;

// const scanner = keyframes`
//   0% { transform: translateX(-100%); opacity: 0; }
//   50% { opacity: 1; }
//   100% { transform: translateX(100%); opacity: 0; }
// `;

// const blink = keyframes`
//   0%, 100% { opacity: 1; }
//   50% { opacity: 0.5; }
// `;
// // -----------------------------

// interface TopbarProps {
//   handleDrawerToggle: MouseEventHandler;
// }

// const Topbar = ({ handleDrawerToggle }: TopbarProps): ReactElement => {
//   const { pathname } = useLocation();
//   const title = capitalizePathname(pathname);

//   // --- TIMER LOGIC ---
//   const [currentTime, setCurrentTime] = useState<Date>(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formattedDate = new Intl.DateTimeFormat('en-US', {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//   }).format(currentTime);

//   const formattedTime = new Intl.DateTimeFormat('en-US', {
//     hour: 'numeric',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true,
//   }).format(currentTime);
  
//   // --- WEIGHBRIDGE SIMULATION LOGIC ---
//   // This creates the illusion of live sensor data reading
//   const [weight, setWeight] = useState(12450);
//   const [status, setStatus] = useState<'Active' | 'Scanning'>('Active');

//   useEffect(() => {
//     const weightInterval = setInterval(() => {
//       // Simulate slight weight fluctuation (sensor noise)
//       const fluctuation = Math.floor(Math.random() * 20) - 10; 
//       setWeight(prev => prev + fluctuation);
      
//       // Randomly toggle status text for realism
//       if(Math.random() > 0.8) setStatus(prev => prev === 'Active' ? 'Scanning' : 'Active');
//     }, 2000);

//     return () => clearInterval(weightInterval);
//   }, []);
//   // -------------------

//   return (
//     <AppBar
//       sx={{
//         width: { lg: `calc(100% - ${drawerWidth}px + 18px)` },
//         ml: { lg: `${drawerWidth}px` },
//         boxShadow: 'none',
//         // bgcolor: 'transparent', 
//       }}
//     >
//       <Toolbar
//         sx={{
//           p: 2.25,
//           justifyContent: 'space-between', 
//         }}
//       >
//         {/* LEFT SECTION */}
//         <Stack direction="row" gap={1}>
//           <Link href="/" width={40} height={40} display={{ xs: 'block', lg: 'none' }}>
//             <IconButton color="inherit" sx={{ p: 0.75, bgcolor: 'inherit' }}>
//               <Image src={Acutuz} width={1} height={1} />   
//             </IconButton>
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
//         </Stack>

//         {/* CENTER SECTION */}
//         <Stack
//           display={{ xs: 'none', lg: 'flex' }}
//           direction="row"
//           alignItems="center"
//           justifyContent={'center'}
//           position="absolute"
//           left="50%"
//           sx={{ transform: 'translateX(-90%)' }}
//         >
//           <Typography 
//             variant="h1" 
//             component="h1" 
//             className='text-dark' 
//             sx={{ 
//               background: "linear-gradient(90deg, #1a1a1aff, #1a1b1bff)",
//               WebkitTextFillColor: "transparent",
//               WebkitBackgroundClip: "text", 
//               fontSize: "34px", 
//               fontFamily: "inherit",
//               fontWeight: 700
//             }}
//           >
//             {pathname === '/' ? 'Dashboard' : title}
//           </Typography>
//         </Stack>

//         {/* RIGHT SECTION */}
//         <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.75 }}>
          
//           {/* --- NEW: ANIMATED WEIGHBRIDGE WIDGET --- */}
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={1.5}
//             sx={{
//               display: { xs: 'none', xl: 'flex' }, // Visible on large screens
//               background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)', // Tech Teal Gradient
//               border: '1px solid #80cbc4',
//               borderRadius: '12px',
//               px: 2,
//               py: 0.8,
//               position: 'relative',
//               overflow: 'hidden',
//               boxShadow: 'inset 0 0 10px rgba(0,150,136,0.1)'
//             }}
//           >
//             {/* The Scanner Beam Illusion (Background Animation) */}
//             <Box 
//               sx={{
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '2px',
//                 bgcolor: '#009688',
//                 animation: `${scanner} 2s infinite linear`,
//                 opacity: 0.6
//               }}
//             />

//             {/* Icon Section */}
//             <Box sx={{ position: 'relative' }}>
//                {/* Status Dot */}
//                <Box 
//                 sx={{
//                   position: 'absolute',
//                   top: -2,
//                   right: -2,
//                   width: 8,
//                   height: 8,
//                   borderRadius: '50%',
//                   bgcolor: status === 'Active' ? '#00c853' : '#ff9100',
//                   zIndex: 2,
//                   animation: `${blink} 1s infinite ease-in-out`
//                 }}
//               />
//               <IconifyIcon 
//                 icon="mdi:truck-outline" // Or "ph:truck-duotone"
//                 width={24} 
//                 height={24} 
//                 sx={{ 
//                   color: '#00695c',
//                   animation: `${suspension} 1s infinite ease-in-out` // Bouncing truck effect
//                 }} 
//               />
//             </Box>

//             {/* Text Data Section */}
//             <Stack spacing={0}>
//               <Typography 
//                 variant="caption" 
//                 sx={{ 
//                   fontSize: '10px', 
//                   color: '#00695c', 
//                   textTransform: 'uppercase',
//                   fontWeight: 800,
//                   letterSpacing: 0.5
//                 }}
//               >
//                 WEIGHBRIDGE 01
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 fontWeight={700} 
//                 sx={{ 
//                   color: '#004d40', 
//                   fontFamily: 'monospace', // Monospace for digital look
//                   fontSize: '14px',
//                   lineHeight: 1
//                 }}
//               >
//                 {weight.toLocaleString()} <span style={{fontSize: '10px'}}>KG</span>
//               </Typography>
//             </Stack>
//           </Stack>
//           {/* -------------------------------------- */}

//           {/* --- BLUE STYLE TIMER WIDGET --- */}
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={2}
//             sx={{
//               display: { xs: 'none', md: 'flex' },
//               bgcolor: '#e3f2fd', 
//               border: '1px solid #bbdefb', 
//               borderRadius: '16px', 
//               px: 2.5,
//               py: 1,
//             }}
//           >
//             {/* Date Part */}
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <IconifyIcon 
//                 icon="uis:calender" 
//                 width={22} 
//                 height={22} 
//                 sx={{ color: '#2196f3' }} 
//               />
//               <Typography 
//                 variant="subtitle1" 
//                 fontWeight={700} 
//                 sx={{ color: '#0d47a1', fontSize: '15px' }} 
//               >
//                 {formattedDate}
//               </Typography>
//             </Stack>

//             {/* Vertical Divider */}
//             <Box sx={{ width: '1px', height: '20px', bgcolor: '#90caf9' }} />

//             {/* Time Part */}
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <IconifyIcon 
//                 icon="uim:clock" 
//                 width={22} 
//                 height={22} 
//                 sx={{ color: '#ff5e00ff' }} 
//               />
//               <Typography 
//                 variant="subtitle1" 
//                 fontWeight={700} 
//                 sx={{ 
//                   color: '#0d47a1', 
//                   fontSize: '15px', 
//                   fontVariantNumeric: 'tabular-nums' 
//                 }}
//               >
//                 {formattedTime}
//               </Typography>
//             </Stack>
//           </Stack>
          
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
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
  keyframes,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { drawerWidth } from 'layouts/main-layout';
import { useLocation } from 'react-router-dom';
import capitalizePathname from 'helpers/capitalize-pathname';
import AccountDropdown from './AccountDropdown';
import Image from 'components/base/Image';
import Acutuz from 'assets/logo/actuz-logo.webp';

// --- ANIMATION DEFINITIONS ---

// 1. Truck Suspension (For Weight Widget)
const suspension = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

// 2. Scanner Beam (For Weight Widget)
const scanner = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;

// 3. Status Blink (General)
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// 4. Ticket Printing Illusion (For Transaction Widget)
const printPaper = keyframes`
  0% { height: 0px; opacity: 0; }
  20% { opacity: 1; }
  80% { height: 14px; opacity: 1; }
  100% { height: 0px; opacity: 0; } 
`;
// -----------------------------

interface TopbarProps {
  handleDrawerToggle: MouseEventHandler;
}

const Topbar = ({ handleDrawerToggle }: TopbarProps): ReactElement => {
  const { pathname } = useLocation();
  const title = capitalizePathname(pathname);

  // --- 1. TIMER LOGIC ---
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
  
  // --- 2. WEIGHBRIDGE WEIGHT SIMULATION ---
  const [weight, setWeight] = useState(12450);
  const [status, setStatus] = useState<'Active' | 'Scanning'>('Active');

  useEffect(() => {
    const weightInterval = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 20) - 10; 
      setWeight(prev => prev + fluctuation);
      if(Math.random() > 0.8) setStatus(prev => prev === 'Active' ? 'Scanning' : 'Active');
    }, 2000);
    return () => clearInterval(weightInterval);
  }, []);

  // --- 3. TICKET/TRANSACTION SIMULATION ---
  const [ticketCount, setTicketCount] = useState(84); // Starting count
  
  useEffect(() => {
    // Increment ticket count every 8 seconds to simulate a finished job
    const ticketInterval = setInterval(() => {
      setTicketCount(prev => prev + 1);
    }, 8000);
    return () => clearInterval(ticketInterval);
  }, []);

  return (
    <AppBar
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px + 18px)` },
        ml: { lg: `${drawerWidth}px` },
        boxShadow: 'none',
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

        {/* RIGHT SECTION */}
        <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
          
          {/* --- WIDGET 1: ANIMATED WEIGHBRIDGE (TEAL) --- */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              display: { xs: 'none', xl: 'flex' }, 
              background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)', // Teal Gradient
              border: '1px solid #80cbc4',
              borderRadius: '12px',
              px: 2,
              py: 0.8,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 10px rgba(0,150,136,0.1)'
            }}
          >
            {/* Background Scanner Beam */}
            <Box 
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                bgcolor: '#009688',
                animation: `${scanner} 2s infinite linear`,
                opacity: 0.6
              }}
            />

            {/* Icon Section */}
            <Box sx={{ position: 'relative' }}>
               <Box 
                sx={{
                  position: 'absolute', top: -2, right: -2, width: 8, height: 8,
                  borderRadius: '50%',
                  bgcolor: status === 'Active' ? '#00c853' : '#ff9100',
                  zIndex: 2,
                  animation: `${blink} 1s infinite ease-in-out`
                }}
              />
              <IconifyIcon 
                icon="mdi:truck-outline"
                width={24} 
                height={24} 
                sx={{ 
                  color: '#00695c',
                  animation: `${suspension} 1s infinite ease-in-out` 
                }} 
              />
            </Box>

            {/* Data Section */}
            <Stack spacing={0}>
              <Typography variant="caption" sx={{ fontSize: '10px', color: '#00695c', textTransform: 'uppercase', fontWeight: 800 }}>
                LIVE WEIGHT
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ color: '#004d40', fontFamily: 'monospace', fontSize: '14px', lineHeight: 1 }}>
                {weight.toLocaleString()} <span style={{fontSize: '10px'}}>KG</span>
              </Typography>
            </Stack>
          </Stack>

          {/* --- WIDGET 2: DAILY TRANSACTIONS (INDIGO/PURPLE) --- */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              display: { xs: 'none', xl: 'flex' }, 
              background: 'linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)', // Purple/Indigo Gradient
              border: '1px solid #b39ddb',
              borderRadius: '12px',
              px: 2,
              py: 0.8,
              position: 'relative',
            }}
          >
            {/* Icon Section with "Printing" Animation */}
            <Box sx={{ position: 'relative', height: 24, width: 24, display:'flex', justifyContent:'center' }}>
              
              {/* The Paper Sliding Out */}
              <Box sx={{
                position: 'absolute',
                bottom: -4, 
                width: '12px',
                bgcolor: '#fff',
                border: '1px solid #9575cd',
                borderRadius: '1px',
                zIndex: 0, // Behind the icon
                animation: `${printPaper} 3s infinite ease-out`
              }} />

              {/* The Receipt Icon */}
              <IconifyIcon 
                icon="fluent:receipt-24-filled"
                width={24} 
                height={24} 
                sx={{ color: '#5e35b1', zIndex: 1, position:'relative' }} 
              />
            </Box>

            {/* Data Section */}
            <Stack spacing={0}>
              <Typography variant="caption" sx={{ fontSize: '10px', color: '#5e35b1', textTransform: 'uppercase', fontWeight: 800 }}>
                TRANSACTIONS
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ color: '#311b92', fontFamily: 'monospace', fontSize: '14px', lineHeight: 1 }}>
                #{ticketCount} <span style={{fontSize: '10px'}}>TODAY</span>
              </Typography>
            </Stack>
          </Stack>


          {/* --- WIDGET 3: CLOCK & DATE (BLUE) --- */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              display: { xs: 'none', md: 'flex' },
              bgcolor: '#e3f2fd', 
              border: '1px solid #bbdefb', 
              borderRadius: '16px', 
              px: 2.5,
              py: 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconifyIcon icon="uis:calender" width={22} height={22} sx={{ color: '#2196f3' }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0d47a1', fontSize: '15px' }}>
                {formattedDate}
              </Typography>
            </Stack>

            <Box sx={{ width: '1px', height: '20px', bgcolor: '#90caf9' }} />

            <Stack direction="row" alignItems="center" spacing={1}>
              <IconifyIcon icon="uim:clock" width={22} height={22} sx={{ color: '#ff5e00ff' }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0d47a1', fontSize: '15px', fontVariantNumeric: 'tabular-nums' }}>
                {formattedTime}
              </Typography>
            </Stack>
          </Stack>
          
          <AccountDropdown />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;