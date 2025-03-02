import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')).render(
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

)
