async function sendComment(message, blockId, messagesDiv) {
  if (message !== '') {
    const { firstName, lastName, email } = getCurrentUser()

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
          email,
        }),
      }
    )
    let data = await res.json()
    console.log(data)

    let messageDiv = messagesDiv.querySelector('.message').cloneNode(true)

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
