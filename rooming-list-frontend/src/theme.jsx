import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4323FF',
    },
    secondary: {
      main: '#00ACC1',
    },
    background: {
      default: '#f9f9fb',
    },
  },
  typography: {
    fontFamily: 'Poppins',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          border: '1px solid #E4ECF2',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '6px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E4ECF2',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E4ECF2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E4ECF2',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '& .MuiInputBase-input': {
            padding: '6px 12px',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'transparent !important',
          }
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: '#777E90',
          borderRadius: '8px',
          border: '1px solid #E4ECF2',
          padding: '7px',
        },
      },
    },
  },
});

export default theme;
