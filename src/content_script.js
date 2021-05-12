// gets uuid of current post
function getCurrentId() {
  let url = window.location.href
  url = url.split('#')[0].split('-')
  const uuid = url[url.length - 1]
  return uuid
}

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

const clickDiscussion = () => {
  let pageContent = document.querySelector('.notion-page-content')
  let pageContentElements = [...pageContent.children]

  const selectedBlock = pageContentElements.filter(
    (elem) => elem.style['position'] === 'relative'
  )
  if (selectedBlock.length > 0) {
    const blockId = selectedBlock[0].attributes['data-block-id'].nodeValue
    console.log({
      uuid: getCurrentId(),
      blockId,
    })
  }
}

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
      let bubbles = document.querySelector('.speechBubbleThin')

      var newNode = document.createElement('div')

      var newNode2 = document.createElement('div')
      newNode2.innerText = 'Discussion'

      newNode.classList.add('discussion-context')
      newNode2.classList.add('discussion-context-text')
      newNode.appendChild(newNode2)
      newNode.onclick = lookIfDeleted

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

const observer = new MutationObserver(callback)
observer.observe(targetNode, config)

async function lookIfDeleted() {
  const response = await fetch(
    'http://localhost:5001/chrome-notion/us-central1/getPostDiscussions',
    {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notionId: '6f3c8f13921c45c391c3d52927245ffa',
      }),
    }
  )
  let data = await response.json()
  console.log(data)

  const dbBlockIds = ['abc123', 'aeac8a51-e5e8-41f8-a337-50261857d3d1']

  let pageContent = document.querySelector('.notion-page-content')
  let pageContentElements = [...pageContent.children]
  let currentIds = pageContentElements.map(
    (elem) => elem.attributes['data-block-id'].nodeValue
  )

  let deletedBlockIds = dbBlockIds.filter((elem) => {
    if (!currentIds.includes(elem)) return elem
  })

  console.log(deletedBlockIds)
}

// headings code
function showHeadings(headers) {
  if (
    headers.length > 0 &&
    document.querySelector('.notion-sidebar-switcher')
  ) {
    let scroller = document.querySelector(
      '.notion-sidebar-switcher'
    ).parentElement

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

// onMount
setTimeout(() => {
  let headings = [...document.querySelectorAll(`[placeholder="Heading 1"]`)]
  showHeadings(headings)
  lookIfDeleted()
}, 4500)
