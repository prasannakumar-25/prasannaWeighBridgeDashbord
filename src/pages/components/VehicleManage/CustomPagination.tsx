// import { PaginationItem, TablePaginationProps, Typography } from '@mui/material';
// import {
//   GridPagination,
//   gridExpandedRowCountSelector,
//   gridPageCountSelector,
//   gridPaginationRowRangeSelector,
//   useGridApiContext,
//   useGridSelector,
// } from '@mui/x-data-grid';
// import MuiPagination from '@mui/material/Pagination';
// import { useTheme, useMediaQuery } from '@mui/material';

// function Pagination({
//   page,
//   className,
// }: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className' | 'ref'>) {
//   const apiRef = useGridApiContext();
//   const theme = useTheme();
//   // Using standard MUI media query if you don't have a specific provider
//   const belowSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   const pageCount = useGridSelector(apiRef, gridPageCountSelector);
//   const available = useGridSelector(apiRef, gridExpandedRowCountSelector);
//   const paginationRowRange = useGridSelector(apiRef, gridPaginationRowRangeSelector);

//   return (
//     <>
//       {pageCount !== 0 ? (
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           mr="auto"
//           ml={belowSmallScreen ? 'auto' : ''}
//           sx={{ pl: 2 }} 
//         >
//           Showing {(paginationRowRange?.firstRowIndex as number) + 1} -{' '}
//           {(paginationRowRange?.lastRowIndex as number) + 1} of {available} Records
//         </Typography>
//       ) : (
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           mr="auto"
//           ml={belowSmallScreen ? 'auto' : ''}
//           sx={{ pl: 2 }}
//         >
//           Showing 0 - 0 of {available} Records
//         </Typography>
//       )}
//       <MuiPagination
//         color="primary"
//         className={className}
//         count={pageCount}
//         page={page + 1}
//         onChange={(_event, newPage) => apiRef.current.setPage(newPage - 1)}
//         renderItem={(item) => (
//           <PaginationItem
//             {...item}
//             slots={{
//               previous: () => <>Prev</>,
//               next: () => <>Next</>,
//             }}
//             sx={(theme) => ({
//               '&.Mui-selected': {
//                 color: theme.palette.common.white,
//                 bgcolor: theme.palette.primary.main,
//                 '&:hover': {
//                     bgcolor: theme.palette.primary.dark,
//                 }
//               },
//               '&.Mui-disabled': {
//                 color: theme.palette.text.secondary,
//               },
//             })}
//           />
//         )}
//         sx={{
//           mx: { xs: 'auto', sm: 'initial' },
//         }}
//       />
//     </>
//   );
// }

// export default function CustomPagination(props: object) {
//   return <GridPagination ActionsComponent={Pagination} {...props} />;
// }





import React from 'react';
import {
  Box,
  Typography,
  Pagination,
  PaginationItem,
  Select,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
} from '@mui/material';
import {
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
  gridExpandedRowCountSelector,
  gridPaginationModelSelector,
} from '@mui/x-data-grid';

function CustomPaginationToolbar() {
  const apiRef = useGridApiContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get Grid State
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const rowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);

  // Calculate Ranges
  const { page, pageSize } = paginationModel;
  const startRecord = rowCount > 0 ? page * pageSize + 1 : 0;
  const endRecord = rowCount > 0 ? Math.min((page + 1) * pageSize, rowCount) : 0;

  // Handlers
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    apiRef.current.setPage(value - 1);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    apiRef.current.setPageSize(Number(event.target.value));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        width: '100%',
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        gap: 2,
      }}
    >
      {/* LEFT SIDE: Record Status */}
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        Showing <Box component="span" >{startRecord}</Box> 
        {' - '} 
        <Box component="span">{endRecord}</Box> 
        {' of '} 
        <Box component="span">{rowCount}</Box> 
        {' records'}
      </Typography>

      {/* RIGHT SIDE: Controls */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
        
        {/* Feature 1: Page Size Selector */}
        {/* <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <FormControl variant="standard" size="small">
            <Select
              value={pageSize}
              variant='outlined'
              onChange={handlePageSizeChange}
              disableUnderline
              sx={{
                fontWeight: 600,
                // color: theme.palette.primary.main,
                '& .MuiSelect-select': { py: 0.5, pr: 3,}, 
              }}
            >
              {[3,5, 10, 25, 50, 100].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack> */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          Rows per page:
        </Typography>

        <FormControl size="small" variant="outlined">
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            sx={{
              height: 36,
              minWidth: 72,
              fontSize: 14,
              fontWeight: 500,
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                padding: '6px 32px 6px 12px',
              },
            }}
          >
            {[1, 2, 3, 5, 10, 25, 50, 100].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>


        {/* Feature 2: Navigation Buttons */}
        <Pagination
          count={pageCount}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={1}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              components={{
                previous: () => <Typography variant="body2" fontWeight="bold">Prev</Typography>,
                next: () => <Typography variant="body2" fontWeight="bold">Next</Typography>,
              }}
              sx={{
                '&.Mui-selected': {
                  color: '#fff',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle professional shadow
                },
                '&.MuiPaginationItem-previousNext': {
                    px: 2, // Give the text buttons breathing room
                    borderRadius: 4, 
                }
              }}
            />
          )}
        />
      </Stack>
    </Box>
  );
}

// Wrapper for the DataGrid
export default function CustomPagination(props: any) {
    // Note: We use slots={{ footer: ... }} in the DataGrid, not just ActionsComponent
    // This allows us to take over the ENTIRE bottom bar area for maximum control.
    return <CustomPaginationToolbar />;
}