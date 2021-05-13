// gets current user info
function getCurrentUser() {
  const userObj = JSON.parse(localStorage.ajs_user_traits)
  const user = {
    firstName: userObj.first_name,
    lastName: userObj.last_name,
    email: userObj.email,
  }
  return user
}
