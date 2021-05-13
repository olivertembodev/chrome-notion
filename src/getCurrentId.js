// gets uuid of current post
function getCurrentId() {
  let url = window.location.href
  url = url.split('#')[0].split('-')
  const uuid = url[url.length - 1]
  return uuid
}
