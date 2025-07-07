import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import apiClient from '../api/apiClient';
import RoomingListCard from '../components/RoomingListCard';

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  TextField,
  Popover,
  FormControlLabel,
  Checkbox,
  Input,
  InputAdornment,
  OutlinedInput,
  MenuItem,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';

const RoomingListPage = () => {
  const [roomingLists, setRoomingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); 

  useEffect(() => {
    const fetchRoomingLists = async () => {
      try {
        const response = await apiClient.get('api/rooming-lists');
        setRoomingLists(response.data);
      } catch (err) {
        console.error('Failed to fetch rooming lists', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomingLists();
  }, []);

  const handleInsertData = async () => {
    try {
      await apiClient.post('api/data/insert');
      setSnackbar({ open: true, message: 'Data inserted successfully', severity: 'success' });
      // Reload data
      const res = await apiClient.get('api/rooming-lists');
      setRoomingLists(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error inserting data', severity: 'error' });
    }
  }

  // Function to group rooming lists by event name
  // This function takes an array of rooming lists and returns an object where each key is an event name and the value is an array of rooming lists associated with that event.
  // This allows us to display rooming lists grouped by their respective events in the UI.
  const groupByEvent = (lists) => {
    return lists.reduce((acc, item) => {
      const event = item.event_name;
      if (!acc[event]) acc[event] = [];
      acc[event].push(item);
      return acc;
    }, {});
  };

  // Map statuses to filter values
  // This mapping is used to convert the status values from the API to the values used in the UI for filtering.
  const filterMap = {
    received: 'active',
    completed: 'closed',
    archived: 'cancelled',
  };

  // Filter and sort rooming lists based on search input and status.
  // It uses the debounced search value to avoid performance issues with rapid input changes.
  const filteredLists = roomingLists.filter((item) => {
    const statusMapped = filterMap[item.status?.toLowerCase()];
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(statusMapped);

    const matchesSearch =
      item.event_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.rfp_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.agreement_type.toLowerCase().includes(debouncedSearch.toLowerCase());

    return matchesStatus && matchesSearch;
  });  
  
  // Sort the filtered lists by cut-off date based on the selected sort order
  const sortedLists = [...filteredLists].sort((a, b) => {
    const dateA = new Date(a.cut_off_date);
    const dateB = new Date(b.cut_off_date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Group the sorted lists by event name
  const grouped = groupByEvent(sortedLists);

  if (loading) return <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress /></Box>

  return (
    <>
      <Container sx={{ p: 4 }}>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          flexDirection={{ xs: 'column', sm: 'row' }}
          mt={4} 
          mb={2}
          gap={2}
        >
          <Typography variant="h4" fontWeight="bold">
            Rooming List Management: Events
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleInsertData}
          >
            Insert Bookings and Rooming Lists
          </Button>
        </Box>

        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <OutlinedInput
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ color: 'text.primary', width: "280px", height: '48px' }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />

          <Box position="relative">
            <Button
              variant="outlined"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<TuneIcon sx={{ color: '#00C2A6' }}/>}
              sx={{ color: 'text.primary', border: '1px solid #E4ECF2', height: '48px', ":hover": { bgcolor: '#E0F7F1' } }}
            >
              Filters
            </Button>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              sx={{
                marginTop: '8px'
              }}
            >
              <Box p={2} display="flex" flexDirection="column">
                <Typography variant="body2" color="textSecondary">
                  RFP STATUS
                </Typography>

                {['active', 'closed', 'cancelled'].map((value) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        checked={selectedStatus.includes(value)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...selectedStatus, value]
                            : selectedStatus.filter((v) => v !== value);
                          setSelectedStatus(newValue);
                        }}
                      />
                    }
                    label={value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                ))}

                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setStatusFilter(selectedStatus);
                    setAnchorEl(null);
                  }}
                >
                  Save
                </Button>
              </Box>
            </Popover>
          </Box>
          <TextField
            select
            label="Sort by Cut-Off Date"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="desc" sx={{ bgcolor: 'transparent' }}>Newest First</MenuItem>
            <MenuItem value="asc">Oldest First</MenuItem>
          </TextField>
        </Box>
        
        {Object.keys(grouped).length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No rooming lists found.
            </Typography>
          </Box>
        )}
        {Object.entries(grouped).map(([eventName, lists], index) => (
          <Box key={eventName} sx={{ mb: 4 }}>
            <Box
              display="flex"
              alignItems="center"
              my={3}
            >
              <Box
                flex="1"
                height="1px"
                sx={{
                  backgroundImage: index % 2 === 0
                    ? 'linear-gradient(to right, transparent, #00C2A6)'
                    : 'linear-gradient(to right, transparent, #6707FD)',
                }}
              />
              <Box
                px="8px"
                py="6px"
                mx="16px"
                borderRadius="4px"
                border={index % 2 === 0 ? '1px solid #00C2A6' : '1px solid #6707FD'}
                bgcolor={index % 2 === 0 ? '#E0F7F1' : '#F0E6FF'}
                color={index % 2 === 0 ? '#00C2A6' : '#6707FD'}
                fontWeight="bold"
                fontSize="14px"
              >
                {eventName}
              </Box>
              <Box
                flex="1"
                height="1px"
                sx={{
                  backgroundImage: index % 2 === 0
                    ? 'linear-gradient(to left, transparent, #00C2A6)'
                    : 'linear-gradient(to left, transparent, #6707FD)',
                }}
              />
            </Box>
            <Box display="flex" overflow="auto" className="scroll-x" sx={{ pb: 1 }}>
              {lists.map((list) => (
                <RoomingListCard
                  key={list.rooming_list_id}
                  data={list}
                  onViewBookings={async () => {
                    const res = await apiClient.get(`api/rooming-lists/${list.rooming_list_id}/bookings`);
                    console.log(`Bookings for ${list.rfp_name}:`, res.data);
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RoomingListPage;
