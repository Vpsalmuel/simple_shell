// Microsoft single sign-on (Microsoft Entra ID) via MSAL.
// Set VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID (see .env.example) to turn it on.
// Without them Rex Hub runs in demo mode with a persona picker.
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID

export const ssoConfigured = Boolean(clientId && tenantId)

const scopes = ['User.Read']
let pca

async function client() {
  if (!pca) {
    const { PublicClientApplication } = await import('@azure/msal-browser')
    pca = new PublicClientApplication({
      auth: { clientId, authority: `https://login.microsoftonline.com/${tenantId}`, redirectUri: window.location.origin },
      cache: { cacheLocation: 'sessionStorage' },
    })
    await pca.initialize()
  }
  return pca
}

// Finishes a sign-in redirect (or restores an existing session) and returns the person's profile, or null.
export async function restoreSession() {
  const c = await client()
  const result = await c.handleRedirectPromise()
  const account = result?.account ?? c.getActiveAccount() ?? c.getAllAccounts()[0]
  if (!account) return null
  c.setActiveAccount(account)

  // Job title and department come from Microsoft Graph; fall back to the account name if Graph is unavailable.
  let profile = {}
  try {
    const { accessToken } = await c.acquireTokenSilent({ scopes, account })
    const res = await fetch('https://graph.microsoft.com/v1.0/me?$select=displayName,givenName,surname,jobTitle,department,mail,employeeHireDate', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) profile = await res.json()
  } catch {
    // keep account-only profile
  }
  return {
    name: profile.displayName ?? account.name ?? account.username,
    firstName: profile.givenName,
    lastName: profile.surname,
    email: profile.mail ?? account.username,
    jobTitle: profile.jobTitle,
    department: profile.department,
    // Set by HR/IT on the Microsoft 365 profile. Used to decide who is new staff.
    hireDate: profile.employeeHireDate ?? null,
  }
}

export async function signInWithMicrosoft() {
  await (await client()).loginRedirect({ scopes })
}

export async function signOutOfMicrosoft() {
  await (await client()).logoutRedirect({ postLogoutRedirectUri: `${window.location.origin}/login` })
}

// Maps an Entra ID department name onto Rex Hub's departments.
const deptAliases = [
  ['Claims', /claim/i], ['Underwriting', /underwrit/i], ['Customer Care', /customer|cx|care/i], ['HR', /hr|people|human/i],
  ['Finance', /financ|treasur|account/i], ['IT', /\bit\b|technolog|digital|infra/i], ['Brand & Communications', /brand|comms|communicat|marketing/i],
  ['Executive Office', /exec|leadership|md|ceo/i], ['Actuarial', /actuar/i], ['Legal & Compliance', /legal|complian/i],
]
export const mapDepartment = (name = '') => deptAliases.find(([, re]) => re.test(name))?.[0] ?? 'Claims'
