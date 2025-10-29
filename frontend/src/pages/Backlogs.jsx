import Navbar from '../components/Common/Navbar'

export default function Backlogs() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Backlogs</h1>
        <p className="text-gray-600 mt-2">Backlog items will appear here.</p>
      </div>
    </div>
  )
}
