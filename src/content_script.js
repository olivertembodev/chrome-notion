// chrome.runtime.sendMessage({
//   type: 'SEND_TITLE',
//   configData: { title },
// })

function prepareData(headers) {
  if (
    headers.length > 0 &&
    document.querySelector('.notion-sidebar-switcher')
  ) {
    let scroller = document.querySelector('.notion-sidebar-switcher')
      .parentElement

    let headerList = document.createElement('ul')

    headers.forEach((elem, index) => {
      elem.id = `header-${index}`
      let header = document.createElement('li')
      let destination = document.createElement('a')
      destination.innerText = elem.textContent
      destination.href = `#header-${index}`

      header.appendChild(destination)
      header.classList.add('header-list-item')

      headerList.appendChild(header)
    })

    scroller.appendChild(headerList)
  }
}

// to get uuid of current post
function getCurrentId() {
  let url = window.location.href
  url = url.split('#')[0].split('-')
  const uuid = url[url.length - 1]
  return uuid
}

setTimeout(() => {
  let headings = [...document.querySelectorAll(`[placeholder="Heading 1"]`)]
  console.log(headings)
  prepareData(headings)
  console.log(getCurrentId())
}, 1000)
