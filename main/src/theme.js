// theme.js
import { createTheme } from '@mui/material/styles';

// Your color palette with semantic names
const colorTokens = {
  // Primary colors
  steelBlue: '#6482AD', // Primary main
  periwinkle: '#7FA1C3', // Primary light
  slateBlue: '#4E6389', // Primary dark
  
  // Secondary colors
  softBeige: '#E2DAD6', // Secondary main
  paleWhite: '#F5EDED', // Secondary light / Background default
  lightTaupe: '#C5BDB9', // Secondary dark
  
  // Neutral colors
  darkCharcoal: '#333333', // Text primary
  white: '#FFFFFF', // Background paper
  mediumGray: '#9E9E9E', // Text disabled
};

// Theme color structure
const themeColors = {
  primary: {
    main: colorTokens.steelBlue,
    light: colorTokens.periwinkle,
    dark: colorTokens.slateBlue,
    contrastText: colorTokens.white,
  },
  secondary: {
    main: colorTokens.softBeige,
    light: colorTokens.paleWhite,
    dark: colorTokens.lightTaupe,
    contrastText: colorTokens.darkCharcoal,
  },
  background: {
    default: colorTokens.paleWhite,
    paper: colorTokens.white,
    accent: colorTokens.softBeige,
  },
  text: {
    primary: colorTokens.darkCharcoal,
    secondary: colorTokens.steelBlue,
    disabled: colorTokens.mediumGray,
  },
};

// Create the theme
const theme = createTheme({
  palette: {
    primary: themeColors.primary,
    secondary: themeColors.secondary,
    background: themeColors.background,
    text: themeColors.text,
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    // These are the most important base components that will affect many UI elements
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.background.paper,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(100, 130, 173, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.primary.main,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: `${themeColors.primary.light}20`, // Very light primary color with 20% opacity
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: themeColors.primary.main,
          color: themeColors.primary.contrastText,
        },
      },
    },
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(100, 130, 173, 0.05)',
    '0px 4px 8px rgba(100, 130, 173, 0.08)',
    '0px 6px 12px rgba(100, 130, 173, 0.12)',
    // ... keep other shadows as default, just examples for key ones
  ],
});

// Export the theme
export default theme;