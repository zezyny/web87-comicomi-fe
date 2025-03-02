import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import UserManagement from './pages/dashboard/UserManagement'
// import StoryManagement from './pages/dashboard/StoryManagement'
import StoriesManager from './pages/dashboard/StoryManagement'
import DashboardLayout from './components/layout/DashboardLayout'
import HomePage from './pages/home/HomePage'
import AuthForm from './pages/development/DevUseLoginRegister'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<AuthForm/>}/>
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route path='/dashboard/main' element={<Dashboard />} />
          <Route path='/dashboard/users' element={<UserManagement />} />
          <Route path='/dashboard/stories' element={<StoriesManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
