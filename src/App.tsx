import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewTemplate from './pages/NewTemplate'
import SessionView from './pages/SessionView'
import History from './pages/History'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/template/new" element={<NewTemplate />} />
      <Route path="/session/:id" element={<SessionView />} />
      <Route path="/history" element={<History />} />
    </Routes>
  )
}
