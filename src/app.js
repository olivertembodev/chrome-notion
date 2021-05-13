const clickDiscussion = () => {
  let pageContent = document.querySelector('.notion-page-content')
  let pageContentElements = [...pageContent.children]

  const selectedBlock = pageContentElements.filter(
    (elem) => elem.style['position'] === 'relative'
  )

  let blockId = ''

  if (selectedBlock.length > 0) {
    blockId = selectedBlock[0].attributes['0'].value
    console.log({
      uuid: getCurrentId(),
      blockId,
    })
  }

  fetch(chrome.runtime.getURL('/template.html'))
    .then((r) => r.text())
    .then((html) => {
      // let trueHtml = createElementFromHTML(html)
      // console.log(trueHtml.textContent)
      let container = document.createElement('div')
      container.innerHTML = html
      container
        .querySelector('.discussion-box')
        .setAttribute('blockId', blockId)
      selectedBlock[0].insertAdjacentHTML('afterend', container.innerHTML)
      document.querySelectorAll('.user-name')[0].textContent =
        getCurrentUser().firstName
      // not using innerHTML as it would break js event listeners of the page
    })
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
