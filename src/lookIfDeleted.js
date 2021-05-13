async function lookIfDeleted() {
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
  const dbBlockIds = data.discussions.map((elem) => elem.blockId)

  let pageContent = document.querySelector('.notion-page-content')
  let pageContentElements = [...pageContent.children]
  let currentIds = pageContentElements.map((elem) => elem.attributes['0'].value)

  let deletedBlockIds = dbBlockIds.filter((elem) => {
    if (!currentIds.includes(elem)) return elem
  })

  if (deletedBlockIds.length > 0) {
    console.log('these are the deleted blockIds:', deletedBlockIds)
  }
  return deletedBlockIds
}
