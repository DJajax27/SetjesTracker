self.addEventListener('message', (event) => {
  if (event.data?.type !== 'schedule-reminders') return
  const goals = event.data.goals ?? []
  goals.forEach((name) => {
    self.registration.showNotification('AgentClinic', {
      body: `Vergeet niet: ${name}`,
      icon: '/icon.png',
      tag: `goal-${name}`,
    })
  })
})
