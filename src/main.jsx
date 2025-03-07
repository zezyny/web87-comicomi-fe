import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from 'antd'
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookiesProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#445489',
            colorBgContainer: '#fff',
            colorBgBase: '#f4f3f9',
            borderRadius: 10
          },
          components: {
            Breadcrumb: {
              itemColor: '#a7b5e7',
              lastItemColor: '#f3f8ff',
              separatorColor: '#a7b5e7'
            }
          }
        }}
      >
        <App />
      </ConfigProvider>
    </CookiesProvider>
  </React.StrictMode>

)
