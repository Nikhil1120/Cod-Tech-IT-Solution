import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Dashboard from '../pages/Dashboard'
import Projects from '../pages/Projects'
import Backlogs from '../pages/Backlogs'

function Protected({ children }) {
  const token = useSelector((s) => s.auth.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/projects" element={<Protected><Projects /></Protected>} />
      <Route path="/backlogs" element={<Protected><Backlogs /></Protected>} />
    </Routes>
  )
}
