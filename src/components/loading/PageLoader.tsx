// import { Box, CircularProgress, Stack, StackOwnProps } from '@mui/material';
// import { caribbeanGreen, downy, orange, watermelon } from 'theme/colors';

// const PageLoader = (props: StackOwnProps) => {
//   return (
//     <Stack alignItems="center" width={1} justifyContent="center" height={1} {...props}>
//       <Box height={'10vh'} width={'25vw'} textAlign={'center'}>
//         <svg width={0} height={0}>
//           <defs>
//             <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
//               <stop offset="0%" stopColor={orange[500]} />
//               <stop offset="33%" stopColor={caribbeanGreen[500]} />
//               <stop offset="67%" stopColor={downy[500]} />
//               <stop offset="100%" stopColor={watermelon[500]} />
//             </linearGradient>
//           </defs>
//         </svg>
//         <CircularProgress
//           size={100}
//           thickness={3}
//           sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
//         />

//       </Box>
//     </Stack>
//   );
// };

// export default PageLoader;















import { Box, CircularProgress, Stack, StackOwnProps, Typography } from '@mui/material';
import { caribbeanGreen, downy, orange, watermelon } from 'theme/colors';

const PageLoader = (props: StackOwnProps) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width={1}
      height="100vh"
      spacing={2}
      {...props}
    >
      {/* Gradient Definition */}
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="page_loader_gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={orange[500]} />
            <stop offset="33%" stopColor={caribbeanGreen[500]} />
            <stop offset="67%" stopColor={downy[500]} />
            <stop offset="100%" stopColor={watermelon[500]} />
          </linearGradient>
        </defs>
      </svg>

      {/* Loader */}
      {/* <Box>
        <CircularProgress
          size={90}
          thickness={3.2}
          sx={{
            'svg circle': {
              stroke: 'url(#page_loader_gradient)',
              strokeLinecap: 'round',
            },
          }}
        />
      </Box> */}
      <Box
        sx={{
          width: 60,
          height: 60,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0.5,
          animation: 'containerRotate 2s linear infinite',
          '@keyframes containerRotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Box
            key={i}
            sx={{
              bgcolor: i === 4 ? 'transparent' : 'primary.main',
              borderRadius: 0.5,
              animation: 'blockPulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
              '@keyframes blockPulse': {
                '0%, 100%': { opacity: 0.3 },
                '50%': { opacity: 1 },
              },
            }}
          />
        ))}
      </Box>
      {/* Optional Text */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ letterSpacing: 0.5 }}
      >
        Loading, please wait...
      </Typography>
    </Stack>
  );
};

export default PageLoader;
