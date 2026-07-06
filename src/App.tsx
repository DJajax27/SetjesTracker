import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewTemplate from './pages/NewTemplate'
import EditTemplate from './pages/EditTemplate'
import SessionView from './pages/SessionView'
import EditSession from './pages/EditSession'
import History from './pages/History'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/template/new" element={<NewTemplate />} />
      <Route path="/template/:id/edit" element={<EditTemplate />} />
      <Route path="/session/:id" element={<SessionView />} />
      <Route path="/session/:id/edit" element={<EditSession />} />
      <Route path="/history" element={<History />} />
    </Routes>
  )
}
