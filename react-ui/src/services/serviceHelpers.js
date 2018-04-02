export const getTokenHeader = () => {
  const user = localStorage.getItem(user)
  if (user && user.token) {
    return `bearer ${user.token}`
  }
  return null
}