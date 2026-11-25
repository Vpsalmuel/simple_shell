import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Walkthrough from './pages/Walkthrough'
import Login from './pages/Login'
import News from './pages/News'
import Events from './pages/Events'
import CoursePlayer from './pages/CoursePlayer'
import Departments from './pages/Departments'
import RequireAccess from './components/RequireAccess'
import Requests from './pages/Requests'
import Knowledge from './pages/Knowledge'
import Help from './pages/Help'
import Admin from './pages/Admin'
import Celebrations from './pages/Celebrations'
import Wellbeing from './pages/Wellbeing'

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="welcome" element={<Walkthrough />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="requests" element={<Requests />} />
        <Route path="knowledge" element={<Knowledge />} />
        <Route path="knowledge/:id" element={<Knowledge />} />
        <Route path="learning/:id" element={<CoursePlayer />} />
        <Route path="help" element={<Help />} />
        <Route path="admin" element={<RequireAccess to="/admin"><Admin /></RequireAccess>} />
        <Route path="celebrations" element={<Celebrations />} />
        <Route path="wellbeing" element={<Wellbeing />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<News />} />
        <Route path="events" element={<Events />} />
        <Route path="departments" element={<Departments />} />
        <Route path="departments/:id" element={<Departments />} />
        {/* Retired pages keep working links. */}
        <Route path="learning" element={<Navigate to="/knowledge?tab=courses" replace />} />
        <Route path="docs" element={<Navigate to="/knowledge?tab=documents" replace />} />
        <Route path="milestones" element={<Navigate to="/celebrations" replace />} />
        <Route path="rewards" element={<Navigate to="/wellbeing" replace />} />
        <Route path="people" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
