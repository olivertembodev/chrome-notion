async function sendComment(message, discussionId) {
  let res = await fetch(
    'http://localhost:5001/chrome-notion/us-central1/addComment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        discussionId,
        email: getCurrentUser().email,
      }),
    }
  )
  let data = await res.json()
  console.log(data)
}
