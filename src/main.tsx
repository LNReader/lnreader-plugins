import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

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
