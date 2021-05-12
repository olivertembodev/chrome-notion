// chrome.runtime.sendMessage({
//   type: 'SEND_TITLE',
//   configData: { title },
// })

function prepareData(headers) {
  if (
    headers.length > 0 &&
    document.querySelector('.notion-sidebar-switcher')
  ) {
    let scroller = document.querySelector('.notion-sidebar-switcher')
      .parentElement

    let headerList = document.createElement('ul')

    headers.forEach((elem, index) => {
      elem.id = `header-${index}`
      let header = document.createElement('li')
      let destination = document.createElement('a')
      destination.innerText = elem.textContent
      destination.href = `#header-${index}`

      header.appendChild(destination)
      header.classList.add('header-list-item')

      headerList.appendChild(header)
    })

    scroller.appendChild(headerList)
  }
}

// to get uuid of current post
function getCurrentId() {
  let url = window.location.href
  url = url.split('#')[0].split('-')
  const uuid = url[url.length - 1]
  return uuid
}

function getCurrentUser() {
  const userObj = JSON.parse(localStorage.ajs_user_traits)
  const user = {
    firstName: userObj.first_name,
    lastName: userObj.last_name,
    email: userObj.email,
  }
  return user
}

setTimeout(() => {
  let headings = [...document.querySelectorAll(`[placeholder="Heading 1"]`)]
  console.log(headings)
  prepareData(headings)
  console.log(getCurrentId(), getCurrentUser())
}, 1000)

// Select the node that will be observed for mutations
const targetNode = document.getElementById('notion-app')

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true }

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (const mutation of mutationsList) {
    if (
      mutation.type === 'childList' &&
      document.querySelector('.speechBubbleThin') &&
      !document.querySelector('.discussion-context')
    ) {
      console.log('am deschis meniul')
      let bubbles = document.querySelector('.speechBubbleThin')

      var newNode = document.createElement('div')

      var newNode2 = document.createElement('div')
      newNode2.innerText = 'Discussion'

      newNode.classList.add('discussion-context')
      newNode2.classList.add('discussion-context-text')
      newNode.appendChild(newNode2)
      newNode.onclick = () => console.log(getCurrentUser())

      let commentDivBlock =
        bubbles.parentElement.parentElement.parentElement.parentElement
          .parentElement
      commentDivBlock.parentNode.insertBefore(
        newNode,
        commentDivBlock.nextSibling
      )
    }
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback)

// Start observing the target node for configured mutations
observer.observe(targetNode, config)
