export function getSessionUser() {
  const cookies = new URLSearchParams(document.cookie.split('; ').join('&'))
  const user = cookies.get('user_id')
  return user && user !== 'Guest' ? user : 'Administrator'
}
