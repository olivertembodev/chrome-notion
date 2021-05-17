const clickDiscussion = async () => {
  let pageContent = document.querySelector('.notion-page-content')
  let pageContentElements = [...pageContent.children]

  const selectedBlock = pageContentElements.filter(
    (elem) => elem.style['position'] === 'relative'
  )

  let blockId = ''
  let discussion

  if (selectedBlock.length > 0) {
    blockId = selectedBlock[0].attributes['0'].value
    discussion = await getDiscussion(getCurrentId(), blockId)
  }

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

  container.querySelector('.messages').innerHTML = messages.join()

  container.querySelector('.discussion-box').setAttribute('blockId', blockId)
  selectedBlock[0].insertAdjacentHTML('afterend', container.innerHTML)
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
      newNode.onclick = clickDiscussion

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
setTimeout(() => {
  let headings = [...document.querySelectorAll(`[placeholder="Heading 1"]`)]
  showHeadings(headings)
  lookIfDeleted()
}, 2000)

// for commenting
var s = document.createElement('script')
s.src = chrome.runtime.getURL('sendComment.js')
s.onload = function () {
  this.remove()
}
;(document.head || document.documentElement).appendChild(s)

var s2 = document.createElement('script')
s2.src = chrome.runtime.getURL('getCurrentUser.js')
s2.onload = function () {
  this.remove()
}
;(document.head || document.documentElement).appendChild(s2)

var s3 = document.createElement('script')
s3.src = chrome.runtime.getURL('getCurrentDate.js')
s3.onload = function () {
  this.remove()
}
;(document.head || document.documentElement).appendChild(s3)
