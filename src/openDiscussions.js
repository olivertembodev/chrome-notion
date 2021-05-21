function openDiscussions(currentDiscussions) {
  if (!localStorage.extension) {
    const newObject = JSON.stringify({
      discussions: [
        // { blockId: '5f38e229-bf0a-4b97-b97c-66355c6f038b', show: true },
        // { blockId: 'aeac8a51-e5e8-41f8-a337-50261857d3d1', show: false },
        // { blockId: '253da95d-f90c-4c0d-88cf-139e98fa936b', show: true },
      ],
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
