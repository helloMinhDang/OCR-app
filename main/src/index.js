import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// import your theme + MUI boilerplate
import theme from './theme';
import { ThemeProvider, CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* resets browser CSS and applies your palette/typography */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// optional: keep this for measuring perf
reportWebVitals();
