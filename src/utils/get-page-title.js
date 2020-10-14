import defaultSettings from '@/settings'

const title = defaultSettings.title || 'WeCross Web App'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
