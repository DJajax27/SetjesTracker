import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewTemplate from './pages/NewTemplate'
import EditTemplate from './pages/EditTemplate'
import SessionView from './pages/SessionView'
import EditSession from './pages/EditSession'
import History from './pages/History'
import Goals from './pages/Goals'
import GoalNew from './pages/GoalNew'
import GoalEdit from './pages/GoalEdit'
import Progress from './pages/Progress'
import ExercisePicker from './pages/ExercisePicker'
import Account from './pages/Account'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import { registerServiceWorker, scheduleGoalNotifications } from './services/notificationService'
import { initBackgroundSync } from './lib/backgroundSync'
import { useAuthStore } from './store/authStore'
import { db } from './db/db'

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
    initBackgroundSync()
    registerServiceWorker().then(async () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return
      const goals = await db.goals.toArray()
      scheduleGoalNotifications(goals)
    })
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/template/new" element={<NewTemplate />} />
      <Route path="/template/:id/edit" element={<EditTemplate />} />
      <Route path="/session/:id" element={<SessionView />} />
      <Route path="/session/:id/edit" element={<EditSession />} />
      <Route path="/history" element={<History />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/goals/new" element={<GoalNew />} />
      <Route path="/goals/:id/edit" element={<GoalEdit />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/exercise-picker" element={<ExercisePicker />} />
      <Route path="/account" element={<Account />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}
