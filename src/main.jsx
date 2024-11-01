/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux-contexts/redux/store/store';
import { ResponsiveProvider } from './redux-contexts/context/responsive';
import ThemeContext from "./redux-contexts/context/ThemeContext";

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (
    args[0].includes('Warning: [react-bootstrap] Specifying only the `"hover"` trigger limits the visibility') ||
    args[0].includes('Warning: Maximum update depth exceeded') ||
    args[0].includes('Warning: Invalid DOM property `class`. Did you mean `className`?')
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (
    args[0].includes('Warning: [react-bootstrap] Specifying only the `"hover"` trigger limits the visibility') ||
    args[0].includes('Warning: Maximum update depth exceeded') ||
    args[0].includes('Warning: Invalid DOM property `class`. Did you mean `className`?') ||
    args[0].includes('Warning: A component is changing a controlled')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ResponsiveProvider>
    <ThemeContext>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeContext>
  </ResponsiveProvider>
);


/* eslint-enable no-console */