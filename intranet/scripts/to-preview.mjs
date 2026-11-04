// Turns dist-preview/index.html into a page fragment (no <html>/<head>/<body>) for hosted preview pages.
import { readFileSync, writeFileSync } from 'node:fs'

const html = readFileSync('dist-preview/index.html', 'utf8')
const head = html.match(/<head>([\s\S]*)<\/head>/)[1]
const body = html.match(/<body>([\s\S]*)<\/body>/)[1]
const keep = head
  .replace(/<meta charset[^>]*>/, '')
  .replace(/<meta name="viewport"[^>]*>/, '')
  .replace(/<link rel="icon"[^>]*>/, '')
  .replace(/<title>[\s\S]*?<\/title>/, '')

writeFileSync('dist-preview/rex-hub.html', `<title>Rex Hub</title>\n${keep.trim()}\n${body.trim()}\n`)
console.log('wrote dist-preview/rex-hub.html')
