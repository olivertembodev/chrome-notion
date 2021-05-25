async function sendComment(message, blockId, messagesDiv) {
  if (message !== '') {
    const { firstName, lastName } = getCurrentUser()

    messagesDiv.parentElement.querySelector('.no-comments').style.display =
      'none'

    let res = await fetch(
      'http://localhost:5001/chrome-notion/us-central1/addComment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          blockId,
          user: getCurrentUser(),
        }),
      }
    )
    let data = await res.json()

    let messageDiv = document.createElement('div')
    messageDiv.innerHTML = `
    <div class="message">
      <div class="message-info">
        <div class="avatar">S</div>
        <span class="user-name">Sam Corcos</span>
        <span class="timestamp">on Mar 8</span>
      </div>
      <div class="message-text">I like this idea! Let's do it!</div>
    </div>
`

    messageDiv.querySelector('.avatar').innerText = firstName[0]
    messageDiv.querySelector('.timestamp').innerText = getCurrentDate()

    messageDiv.querySelector(
      '.user-name'
    ).innerText = `${firstName} ${lastName}`

    messageDiv.querySelector('.message-text').innerText = message
    messagesDiv.innerHTML += messageDiv.outerHTML
    messagesDiv.parentElement.querySelector('.comment-input').value = ''
  }
}
