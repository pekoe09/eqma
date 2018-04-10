export const getTokenHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    return `bearer ${user.token}`
  }
  return null
}