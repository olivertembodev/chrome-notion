async function deleteDiscussion(blockId) {
  let res = await fetch(
    'http://localhost:5001/chrome-notion/us-central1/deleteDiscussion',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blockId,
      }),
    }
  )
  let data = await res.text()
  return `${data}: deleted ${blockId}`
}
