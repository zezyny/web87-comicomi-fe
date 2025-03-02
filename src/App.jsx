import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import UserManagement from './pages/dashboard/UserManagement'
import StoryManagement from './pages/dashboard/StoryManagement'
import DashboardLayout from './components/layout/DashboardLayout'
import HomePage from './pages/home/HomePage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' />
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route path='/dashboard/main' element={<Dashboard />} />
          <Route path='/dashboard/users' element={<UserManagement />} />
          <Route path='/dashboard/stories' element={<StoryManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
