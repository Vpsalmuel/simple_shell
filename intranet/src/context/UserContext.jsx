import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { walkthroughSteps } from '../data/onboarding'

// Demo personas. In production the signed-in user (and `newStaff`) comes from SSO / the HR system.
export const personas = [
  { id: 'new', firstName: 'Samuel', lastName: 'Adebayo', role: 'Junior Claims Analyst', dept: 'Claims', newStaff: true, manager: 'Arthur Pendelton', buddy: 'Sarah Jenkins' },
  { id: 'claims', firstName: 'Sarah', lastName: 'Jenkins', role: 'Senior Claims Specialist', dept: 'Claims' },
  { id: 'underwriting', firstName: 'Rebecca', lastName: 'Sterling', role: 'Lead Commercial Underwriter', dept: 'Underwriting' },
  { id: 'care', firstName: 'Marcus', lastName: 'Vance', role: 'Senior CX Manager', dept: 'Customer Care' },
  { id: 'hr', firstName: 'Thomas', lastName: 'Mueller', role: 'Head of Recruitment & Onboarding', dept: 'HR' },
  { id: 'finance', firstName: 'Amanda', lastName: 'Lin', role: 'Senior Financial Controlling Analyst', dept: 'Finance' },
  { id: 'it', firstName: 'David', lastName: 'Kojo', role: 'IT Support Supervisor', dept: 'IT' },
  { id: 'comms', firstName: 'Elena', lastName: 'Rostova', role: 'Communications Lead', dept: 'Brand & Communications' },
  { id: 'md', firstName: 'Victoria', lastName: 'Hawthorne', role: 'Managing Director & CEO', dept: 'Executive Office' },
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
