async function sendComment() {
  let res = await fetch(
    'http://localhost:5001/chrome-notion/us-central1/addComment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'This is my message from gmail notion',
        date:
          'Thu May 07 2021 22:49:52 GMT+0300 (Eastern European Summer Time)',
        discussionId: 'gLo3fIfLZ06jtoy6j0gi',
        userId: 'ksvTa1Nu4XEEZvo76Kho',
      }),
    }
  )
  let data = await res.json()
  console.log(data)
}
