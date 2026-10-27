import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { walkthroughSteps } from '../data/onboarding'

// Demo personas. In production the signed-in user (and `newStaff`) comes from SSO / the HR system.
export const personas = [
  { id: 'new', firstName: 'Kemi', lastName: 'Adebayo', role: 'Graduate Trainee', dept: 'Underwriting', newStaff: true },
  { id: 'claims', firstName: 'Ada', lastName: 'Okafor', role: 'Senior Claims Analyst', dept: 'Claims' },
  { id: 'underwriting', firstName: 'Chinedu', lastName: 'Obi', role: 'Underwriter II', dept: 'Underwriting' },
  { id: 'care', firstName: 'Zainab', lastName: 'Lawal', role: 'Customer Care Lead', dept: 'Customer Care' },
  { id: 'hr', firstName: 'Sarah', lastName: 'Johnson', role: 'HR Business Partner', dept: 'HR' },
  { id: 'finance', firstName: 'Bola', lastName: 'Martins', role: 'Financial Controller', dept: 'Finance' },
  { id: 'it', firstName: 'Emeka', lastName: 'Nwosu', role: 'IT Service Manager', dept: 'IT' },
]

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [personaId, setPersonaId] = useLocalStorage('rex-persona', 'claims')
  // { [stepId]: true } plus per-step detail (videos watched, policies signed)
  const [progress, setProgress] = useLocalStorage('rex-walkthrough', {})

  const value = useMemo(() => {
    const user = personas.find((p) => p.id === personaId) ?? personas[1]
    const completed = walkthroughSteps.filter((s) => progress[s.id]).length
    const walkthroughDone = completed === walkthroughSteps.length
    return {
      user: { ...user, name: `${user.firstName} ${user.lastName}` },
      setPersonaId,
      progress,
      updateProgress: (patch) => setProgress((p) => ({ ...p, ...patch })),
      resetWalkthrough: () => setProgress({}),
      walkthroughDone,
      // New staff are held in the walkthrough until every step is complete.
      blocked: Boolean(user.newStaff) && !walkthroughDone,
    }
  }, [personaId, progress, setPersonaId, setProgress])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
