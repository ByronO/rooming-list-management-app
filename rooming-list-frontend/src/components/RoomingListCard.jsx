import {
  Card,
  Typography,
  Button,
  Box,
  Tooltip,
  Stack,
  Paper,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';

const RoomingListCard = ({ data, onViewBookings }) => {
  const {
    rfp_name,
    agreement_type,
    cut_off_date,
    start_date,
    end_date,
    bookings_count,
  } = data;

  const formatDate = (start_date, end_date) => {
    const options = { month: 'short', day: 'numeric' };
    const from = new Date(start_date);
    const to = new Date(end_date);
    return `${from.toLocaleDateString('en-US', options)} - ${to.toLocaleDateString('en-US', options)}, ${to.getFullYear()}`;
  };

  return (
    <Card
      sx={{
        minWidth: "400px",
        minHeight: "184px",
        p: "16px",
        mr: "16px",
        mb: "16px",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column">
          <Typography fontWeight="bold" variant="subtitle1" >
            {rfp_name}
          </Typography>
          <Typography variant="body2">
            Agreement: <strong>{agreement_type}</strong>
          </Typography>
        </Box>

        <Box
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Paper
            sx={{
              width: "56px",
              height: "48px",
              borderRadius: "4px",
              overflow: 'hidden',
              textAlign: 'center',
              backgroundColor: '#3E8CFF1A',
              boxShadow: 'none'
            }}
          >
            <Box
              sx={{
                backgroundColor: '#3E8CFF40',
                fontWeight: 'bold',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                color="#3E8CFF"
                letterSpacing={2}
                sx={{ lineHeight: 1 }}
              >
                {new Date(cut_off_date).toLocaleDateString('en-US', {
                  month: 'short',
                }).toUpperCase()}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5" color="#3E8CFF" fontWeight="bold">
                {new Date(cut_off_date).toLocaleDateString('en-US', {
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Paper>
          <Typography variant="caption" color='textSecondary'>
            Cut-Off Date
          </Typography>
        </Box>
      </Box>

      <Box mt="auto">
        <Stack direction="row" spacing={0.5} sx={{ mb: "16px" }}>
          <CalendarMonthIcon fontSize="small" color="action" />
          <Typography variant="body2" color="textSecondary">
            {formatDate(start_date, end_date)}
          </Typography>
        </Stack>

        <Box display="flex" justifyContent="space-between" mt="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={onViewBookings}
            sx={{ width: "100%", mr: "8px" }}
          >
            View Bookings ({bookings_count})
          </Button>

          <Tooltip title="Show Agreement as PDF">
            <Button sx={{ border: '1.5px solid #4323FF', minWidth: "40px" }}>
              <DescriptionIcon fontSize="small" />
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};


export default RoomingListCard;
