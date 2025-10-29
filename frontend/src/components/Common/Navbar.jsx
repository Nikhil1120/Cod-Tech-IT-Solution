import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../store/authSlice'

export default function Navbar() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-semibold">PBMS</Link>
          <Link to="/projects" className="text-gray-600 hover:text-gray-900">Projects</Link>
          <Link to="/backlogs" className="text-gray-600 hover:text-gray-900">Backlogs</Link>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">{user?.full_name}</span>
          <button onClick={onLogout} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Logout</button>
        </div>
      </div>
    </nav>
  )
}
