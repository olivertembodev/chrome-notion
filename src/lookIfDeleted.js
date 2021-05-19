async function lookIfDeleted() {
  const pageContent = document.querySelector('.notion-page-content')
  const pageContentElements = [...pageContent.children]
  const currentBlocks = pageContentElements.map(
    (elem) => elem.attributes['0'].value
  )

  const response = await fetch(
    'http://localhost:5001/chrome-notion/us-central1/getPostDiscussions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notionId: getCurrentId(),
        currentBlocks,
      }),
    }
  )
  let data = await response.json()
  console.log(data)
}
