async function getDiscussion(notionId, blockId) {
  let res = await fetch(
    'http://localhost:5001/chrome-notion/us-central1/getDiscussion',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notionId,
        blockId,
      }),
    }
  )
  let data = await res.json()
  return data
}
