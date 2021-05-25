function openDiscussions(currentDiscussions) {
  if (!localStorage.extension) {
    const newObject = JSON.stringify({
      discussions: [],
    })
    localStorage.setItem('extension', newObject)
    return
  }

  const extensionObj = JSON.parse(localStorage.extension)
  const consoleDiscussions = extensionObj.discussions

  currentDiscussions.forEach((discussion) => {
    let item = consoleDiscussions.filter(
      (elem) => elem.blockId === discussion.blockId
    )

    const selectedItem = item[0]

    if (selectedItem && selectedItem.show) {
      let pageContent = document.querySelector('.notion-page-content')
      pageContent
        .querySelectorAll(`[data-block-id*='${selectedItem.blockId}']`)[0]
        .querySelector('.notion-focusable')
        .click()
    }
  })
}

function closeDiscussion(blockId) {
  const extensionObj = JSON.parse(localStorage.extension)
  const consoleDiscussions = extensionObj.discussions

  let consoleItem = consoleDiscussions.filter(
    (elem) => elem.blockId === blockId
  )
  const selectedItem = consoleItem[0]

  if (selectedItem) {
    const idx = consoleDiscussions.findIndex(
      (elem) => elem.blockId === selectedItem.blockId
    )
    consoleDiscussions[idx].show = false
  } else {
    consoleDiscussions.push({ blockId, show: false })
  }

  localStorage.setItem(
    'extension',
    JSON.stringify({ discussions: consoleDiscussions })
  )
}
