import { news as baseNews } from '../data'
import { useLocalStorage } from './useLocalStorage'

// Stories published from the Admin Workspace, newest first, followed by the built-in stories.
// In production these come from the content API instead of the browser.
export function useNews() {
  const [posts, setPosts] = useLocalStorage('rex-news-posts', [])
  const publish = (post) => setPosts([{ ...post, id: `p${Date.now()}`, likes: 0, comments: 0, image: null, custom: true }, ...posts])
  const remove = (id) => setPosts(posts.filter((p) => p.id !== id))
  return { news: [...posts, ...baseNews], posts, publish, remove }
}
