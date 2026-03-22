import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AccountProvider } from './context/AccountContext';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_GLITCHTIP_DSN,
  tracesSampleRate: 0.01,
  autoSessionTracking: false,
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AccountProvider>
          <Sentry.ErrorBoundary fallback={<p>Something went wrong. Please refresh the page.</p>}>
            <App />
          </Sentry.ErrorBoundary>
        </AccountProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
