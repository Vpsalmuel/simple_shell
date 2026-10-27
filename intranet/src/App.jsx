import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import People from './pages/People'
import Claims from './pages/Claims'
import Docs from './pages/Docs'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="claims" element={<Claims />} />
        <Route path="docs" element={<Docs />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
