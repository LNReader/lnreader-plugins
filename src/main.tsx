import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const response = await originalFetch('http://localhost:3001/' + resource, {
    ...config,
    credentials: 'include',
    mode: 'cors',
  });
  return response;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
