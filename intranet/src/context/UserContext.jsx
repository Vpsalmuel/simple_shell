import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { walkthroughSteps } from '../data/onboarding'
import { mapDepartment, restoreSession, signInWithMicrosoft, signOutOfMicrosoft, ssoConfigured } from '../auth/microsoft'

// Demo personas, used when Microsoft sign-in isn't configured. With SSO the user comes from Microsoft;
// whether someone is new staff should come from the HR system (not available from Microsoft alone).
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
  const [demoSignedIn, setDemoSignedIn] = useLocalStorage('rex-signed-in', false)
  // { [stepId]: true } plus per-step detail (videos watched, policies signed)
  const [progress, setProgress] = useLocalStorage('rex-walkthrough', {})
  const [ssoUser, setSsoUser] = useState(null)
  const [ready, setReady] = useState(!ssoConfigured)

  useEffect(() => {
    if (!ssoConfigured) return
    restoreSession().then(setSsoUser).catch(() => setSsoUser(null)).finally(() => setReady(true))
  }, [])

  const value = useMemo(() => {
    let user
    if (ssoUser) {
      const [first, ...rest] = (ssoUser.name ?? '').split(' ')
      user = {
        id: ssoUser.email,
        firstName: ssoUser.firstName ?? first,
        lastName: ssoUser.lastName ?? rest.join(' '),
        role: ssoUser.jobTitle ?? 'Rex Insurance',
        dept: mapDepartment(ssoUser.department),
        email: ssoUser.email,
      }
    } else {
      user = personas.find((p) => p.id === personaId) ?? personas[1]
    }
    const completed = walkthroughSteps.filter((s) => progress[s.id]).length
    const walkthroughDone = completed === walkthroughSteps.length
    return {
      ready,
      ssoConfigured,
      signedIn: ssoConfigured ? Boolean(ssoUser) : demoSignedIn,
      signIn: (id) => {
        if (ssoConfigured) return signInWithMicrosoft()
        setPersonaId(id)
        setDemoSignedIn(true)
      },
      signOut: () => (ssoConfigured ? signOutOfMicrosoft() : setDemoSignedIn(false)),
      user: { ...user, name: `${user.firstName} ${user.lastName}`.trim() },
      setPersonaId,
      progress,
      updateProgress: (patch) => setProgress((p) => ({ ...p, ...patch })),
      resetWalkthrough: () => setProgress({}),
      walkthroughDone,
      // New staff are held in the walkthrough until every step is complete.
      blocked: Boolean(user.newStaff) && !walkthroughDone,
    }
  }, [ready, ssoUser, demoSignedIn, personaId, progress, setPersonaId, setDemoSignedIn, setProgress])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
