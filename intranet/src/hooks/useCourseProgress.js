import { courses } from '../data'
import { useLocalStorage } from './useLocalStorage'

const initialPct = Object.fromEntries(courses.map((c) => [c.id, c.progress]))

// Course progress lives in two places: `rex-learning` holds each course's % (read by Home and Learning),
// `rex-lessons` holds which lessons are done. Courses with no lesson record yet start from their %.
export function useCourseProgress() {
  const [pctMap, setPctMap] = useLocalStorage('rex-learning', initialPct)
  const [lessonMap, setLessonMap] = useLocalStorage('rex-lessons', {})

  const pct = (c) => pctMap[c.id] ?? 0
  const doneLessons = (c) => lessonMap[c.id] ?? c.lessons.slice(0, Math.floor((pct(c) / 100) * c.lessons.length)).map((l) => l.id)

  const completeLesson = (c, lessonId) => {
    const done = doneLessons(c)
    if (done.includes(lessonId)) return pct(c)
    const next = [...done, lessonId]
    const nextPct = Math.round((next.length / c.lessons.length) * 100)
    setLessonMap((m) => ({ ...m, [c.id]: next }))
    setPctMap((m) => ({ ...m, [c.id]: nextPct }))
    return nextPct
  }

  return { pct, doneLessons, completeLesson }
}
