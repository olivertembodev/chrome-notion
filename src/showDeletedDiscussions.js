async function showDeletedDiscussions() {
  const response = await fetch(
    'http://localhost:5001/chrome-notion/us-central1/getPostDiscussions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notionId: getCurrentId(),
      }),
    }
  )
  let data = await response.json()
  const { currentDiscussions, deletedDiscussions } = data

  const page = document.querySelector('.notion-scroller.vertical.horizontal')
  let myDiv = document.createElement('ul')
  myDiv.id = 'deleted-blocks-list'
  deletedDiscussions.forEach((discussion) => {
    let discElement = document.createElement('li')
    discElement.innerText = discussion.blockId
    discElement.onclick = () => clickDeletedDiscussion(discussion.blockId)
    myDiv.append(discElement)
  })
  page.prepend(myDiv)

  showCommentIcons(currentDiscussions)
  return data
}

const clickDeletedDiscussion = async (blockId) => {
  let response = await fetch(chrome.runtime.getURL('/template.html'))
  let html = await response.text()

  const deletedDiscussion = document.getElementById('deleted-discussion')

  if (deletedDiscussion) {
    deletedDiscussion.remove()
  }

  let container = document.createElement('div')
  container.id = 'deleted-discussion'
  container.innerHTML = html
  container.querySelector('.comment-box').style.display = 'none'

  let discussion = await getDiscussion(getCurrentId(), blockId)
  console.log(discussion)

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

  const deletedBlocksList = document.getElementById('deleted-blocks-list')

  deletedBlocksList.append(container)
}
