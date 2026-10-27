import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import People from './pages/People'
import Claims from './pages/Claims'
import Docs from './pages/Docs'
import Walkthrough from './pages/Walkthrough'
import News from './pages/News'
import Events from './pages/Events'
import Learning from './pages/Learning'
import Departments from './pages/Departments'
import RequireAccess from './components/RequireAccess'

export default function App() {
  return (
    <Routes>
      <Route path="welcome" element={<Walkthrough />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="claims" element={<RequireAccess to="/claims"><Claims /></RequireAccess>} />
        <Route path="docs" element={<Docs />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<News />} />
        <Route path="events" element={<Events />} />
        <Route path="learning" element={<Learning />} />
        <Route path="departments" element={<Departments />} />
        <Route path="departments/:id" element={<Departments />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
