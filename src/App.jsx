import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import UserManagement from './pages/dashboard/UserManagement'
// import StoryManagement from './pages/dashboard/StoryManagement'
import StoriesManager from './pages/dashboard/StoryManagement'
import DashboardLayout from './components/layout/DashboardLayout'
import HomePage from './pages/home/HomePage'
import AuthForm from './pages/development/DevUseLoginRegister'
import UserManagementDetail from './pages/dashboard/UserManagementDetail'
import ComicEditor from './pages/ComicEditor/ComicEditor'
import NovelEditor from './pages/NovelEditor/NovelEditor'
// import ChapterManagement from ''
import ChapterManagement from './pages/dashboard/ChapterManagement'
import EditorPortal from './pages/portals/editorPortal'
import UniversalReader from './pages/reader/universalReader'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Revenue from './pages/dashboard/Revenue'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<AuthForm/>}/>
        <Route path='/editor/comic/:chapterId' element={<ComicEditor />}/>
        <Route path='/editor/novel/:chapterId' element={<NovelEditor />}/>
        <Route path='/editor/portal/:storyId/chapter/:chapterId' element={<EditorPortal />}/>
        <Route path='/reader/:storyId/chapter/:chapterId' element={<UniversalReader />}/>
        <Route path='/dashboard' element={<DashboardLayout />}>
        <Route path='/dashboard/main' element={<Dashboard />} />
        <Route path='/login' element={<AuthForm />} />
        <Route path='/editor/comic/:chapterId' element={<ComicEditor />} />
        <Route path='/editor/novel/:chapterId' element={<NovelEditor />} />
        <Route path='/editor/portal/:storyId/chapter/:chapterId' element={<EditorPortal />} />
        <Route element={<DashboardLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/users' element={<UserManagement />} />
          <Route path='/dashboard/stories' element={<StoriesManager />} />
          <Route path='/dashboard/revenue' element={<Revenue />} />
          <Route path='/dashboard/users/:id/detail' element={<UserManagementDetail />} />
          <Route path='/dashboard/stories/:storyId/detail' element={<ChapterManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
