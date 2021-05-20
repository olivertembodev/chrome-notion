// headings code
function showHeadings(headers) {
  if (
    headers.length > 0 &&
    document.querySelector('.notion-sidebar-switcher')
  ) {
    let scroller = document.querySelector(
      '.notion-sidebar-switcher'
    ).parentElement

    let headerList = document.createElement('ul')
    headerList.id = 'header-list'

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
