import Navbar from '../components/Common/Navbar'

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to PBMS.</p>
      </div>
    </div>
  )
}
