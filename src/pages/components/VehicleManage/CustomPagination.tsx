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
  PaginationItem,
  Pagination as MuiPagination,
  Select,
  MenuItem,
  Stack,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import {
  GridPagination,
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
  gridPaginationModelSelector,
  gridFilteredTopLevelRowCountSelector,
} from '@mui/x-data-grid';

function Pagination({ className }: { className?: string }) {
  const apiRef = useGridApiContext();
  
  // Selectors
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  // use gridFilteredTopLevelRowCountSelector to get the count AFTER filters are applied
  const visibleRows = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);

  // Helper to handle "All" records logic
  const isAllRows = paginationModel.pageSize === -1 || paginationModel.pageSize >= visibleRows;

  // Calculate Range: "Showing 1 - 5 of 20"
  const startRecord = visibleRows === 0 ? 0 : paginationModel.page * paginationModel.pageSize + 1;
  const endRecord = isAllRows 
    ? visibleRows 
    : Math.min((paginationModel.page + 1) * paginationModel.pageSize, visibleRows);

  // Handle Page Change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    apiRef.current.setPage(newPage - 1);
  };

  // Handle Page Size Change (The "Picker")
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    apiRef.current.setPageSize(newSize);
    apiRef.current.setPage(0); // Reset to first page on size change
  };

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        p: 2,
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      {/* LEFT: Record Counter */}
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        Showing {startRecord} - {endRecord} of {visibleRows} Records
      </Typography>

      {/* CENTER: Navigation Numbers */}
      <MuiPagination
        color="primary"
        count={pageCount}
        page={paginationModel.page + 1}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              '&.Mui-selected': {
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: 'primary.dark',
                }
              },
            }}
          />
        )}
      />

      {/* RIGHT: Rows Per Page Picker */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Rows:
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 60 }}>
            <Select
                disableUnderline
                value={paginationModel.pageSize}
                onChange={handlePageSizeChange}
                size="small"
                sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'primary.main',
                    '& .MuiSelect-select': {
                        paddingBottom: 0.5,
                        paddingTop: 0.5,
                        paddingLeft: 1
                    }
                }}
            >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                {/* Value -1 or a very large number represents "All" */}
                <MenuItem value={visibleRows > 0 ? visibleRows : 10000}>All</MenuItem>
            </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}

export default function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}