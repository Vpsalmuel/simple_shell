// Rex Hub server: serves the built site and the Rex AI chat endpoint.
// The Gemini API key stays here, never in the browser.
//   npm run build && npm start        production (http://localhost:3001)
//   npm run dev:api  +  npm run dev   development (Vite proxies /api to this server)
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenAI } from '@google/genai'

try {
  process.loadEnvFile()
} catch {
  // no .env file; rely on real environment variables
}

const PORT = Number(process.env.PORT ?? 3001)
// Same default model as the AI Studio prototype; override with GEMINI_MODEL.
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash'
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null
if (!ai) console.warn('GEMINI_API_KEY is not set: Rex AI will answer in offline mode.')

const app = express()
app.use(express.json({ limit: '64kb' }))

const systemInstruction = (user) =>
  `You are Rex AI, the assistant inside Rex Hub, the staff intranet of Rex Insurance (formerly Metropulse Insurance). ` +
  `You are talking to ${user.name || 'a colleague'}, ${user.role || 'staff'} in ${user.dept || 'the company'}. ` +
  `Be warm, concise and practical. Point people to the right Rex Hub page when it helps: Request Centre (ask another team for something), ` +
  `Help Desk (IT, HR, Finance and Facilities tickets), Knowledge Center (policies, SOPs, FAQs), Learning, Docs & HR (leave, payslips, documents), ` +
  `People, Departments, News and Events. Never invent policy details, figures or names; if you are not sure, say so and suggest the Knowledge Center ` +
  `or the Help Desk. Do not discuss servers, ports or API configuration. Use short Markdown lists and bold where useful.`

app.post('/api/chat', async (req, res) => {
  const { message, history = [], user = {} } = req.body ?? {}
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Message is required.' })
  if (!ai) return res.json({ text: null, offline: true })

  try {
    const chat = ai.chats.create({
      model: MODEL,
      config: { systemInstruction: systemInstruction(user), temperature: 0.6 },
      // Client sends [{ role: 'user' | 'model', text }]; keep the last 20 turns.
      history: history.slice(-20).map((h) => ({ role: h.role === 'model' ? 'model' : 'user', parts: [{ text: String(h.text ?? '') }] })),
    })
    const response = await chat.sendMessage({ message: message.slice(0, 4000) })
    res.json({ text: response?.text ?? 'Sorry, I could not answer that just now.' })
  } catch (err) {
    console.error('Gemini error:', err)
    res.status(502).json({ error: 'Rex AI is unavailable right now. Please try again shortly.' })
  }
})

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
app.use(express.static(dist))
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))

app.listen(PORT, () => console.log(`Rex Hub running on http://localhost:${PORT}`))
