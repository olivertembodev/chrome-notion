function getCurrentBlockId() {
  let pageContent = document.querySelector('.notion-page-content')
  let pageContentElements = [...pageContent.children]

  const selectedBlock = pageContentElements.filter(
    (elem) => elem.style['position'] === 'relative'
  )

  if (selectedBlock.length > 0) {
    const blockId = selectedBlock[0].attributes['0'].value
    return blockId
  } else return null
}

const clickDiscussion = async (hasBlockId) => {
  let pageContent = document.querySelector('.notion-page-content')
  let pageContentElements = [...pageContent.children]

  const selectedBlock = pageContentElements.filter(
    (elem) => elem.style['position'] === 'relative'
  )

  let blockId = ''
  let discussion

  if (hasBlockId) {
    blockId = hasBlockId
  }

  if (!hasBlockId && selectedBlock.length > 0) {
    blockId = selectedBlock[0].attributes['0'].value
  }

  discussion = await getDiscussion(getCurrentId(), blockId)

  let response = await fetch(chrome.runtime.getURL('/template.html'))
  let html = await response.text()

  //create discussion container
  let container = document.createElement('div')
  container.innerHTML = html

  if (discussion.comments.length === 0) {
    container.querySelector('.no-comments').style.display = 'block'
  }

  //insert messages
  let messages = discussion.comments.map((comment) => {
    const { firstName, lastName, date, message } = comment
    let messageDiv = container.querySelector('.message').cloneNode(true)

    messageDiv.querySelector('.avatar').innerText = firstName[0]
    messageDiv.querySelector('.timestamp').innerText = date

    messageDiv.querySelector(
      '.user-name'
    ).innerText = `${firstName} ${lastName}`

    messageDiv.querySelector('.message-text').innerText = message
    return messageDiv.outerHTML
  })

  container.querySelector('.messages').innerHTML = messages.join('')

  container.querySelector('.discussion-box').setAttribute('blockId', blockId)

  if (hasBlockId) {
    pageContent
      .querySelectorAll(`[data-block-id*='${blockId}']`)[0]
      .insertAdjacentHTML('afterend', container.innerHTML)
  } else {
    selectedBlock[0].insertAdjacentHTML('afterend', container.innerHTML)
  }

  const extensionObj = JSON.parse(localStorage.extension)
  const consoleDiscussions = extensionObj.discussions

  let consoleItem = consoleDiscussions.filter(
    (elem) => elem.blockId === blockId
  )
  const selectedItem = consoleItem[0]

  if (selectedItem) {
    const idx = consoleDiscussions.findIndex(
      (elem) => elem.blockId === selectedItem.blockId
    )
    consoleDiscussions[idx].show = true
  } else {
    consoleDiscussions.push({ blockId, show: true })
  }

  localStorage.setItem(
    'extension',
    JSON.stringify({ discussions: consoleDiscussions })
  )
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
      // for delete api
      const trashIcon = document.querySelector('.trash')
      const trashButton = trashIcon.parentElement.parentElement.parentElement
      trashButton.addEventListener('click', async () => {
        const currentBlockId = getCurrentBlockId()
        let res = await deleteDiscussion(currentBlockId)
      })

      // for discussion button
      let bubbles = document.querySelector('.speechBubbleThin')

      var newNode = document.createElement('div')

      var newNode2 = document.createElement('div')
      newNode2.innerText = 'Discussion'

      newNode.classList.add('discussion-context')
      newNode2.classList.add('discussion-context-text')
      newNode.appendChild(newNode2)
      newNode.onclick = () => clickDiscussion()

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

// onMount
setTimeout(async () => {
  let headings = [...document.querySelectorAll(`[placeholder="Heading 1"]`)]
  showHeadings(headings)
  let discussions = await showDeletedDiscussions()
  openDiscussions(discussions.currentDiscussions)
}, 2000)

const scriptsToAppend = [
  'sendComment.js',
  'openDiscussions.js',
  'deleteDiscussion.js',
  'getCurrentUser.js',
  'getCurrentDate.js',
]

scriptsToAppend.forEach((scriptUrl) => {
  var s = document.createElement('script')
  s.src = chrome.runtime.getURL(scriptUrl)
  s.onload = function () {
    this.remove()
  }
  ;(document.head || document.documentElement).appendChild(s)
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // listen for messages sent from background.js
  if (request.message === 'hello!') {
    if (document.querySelector('#header-list')) {
      document.querySelector('#header-list').remove()
      let headings = [...document.querySelectorAll(`[placeholder="Heading 1"]`)]
      showHeadings(headings)
    }

    setTimeout(async () => {
      if (!document.querySelector('#header-list')) {
        let headings = [
          ...document.querySelectorAll(`[placeholder="Heading 1"]`),
        ]
        showHeadings(headings)
      }

      let discussions = await showDeletedDiscussions()
      openDiscussions(discussions.currentDiscussions)
    }, 2000)
  }
})
