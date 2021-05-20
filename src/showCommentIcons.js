let msgIconHTML = `<div style='width: 0px; height: 0px;'>
  <div
    class='notion-focusable'
    role='button'
    tabindex='0'
    style='user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border-radius: 3px; height: 24px; padding: 0px 6px; align-self: flex-start; margin-left: 4px; margin-top: 3px;'
  >
    <svg
      viewBox='0 0 16 16'
      class='speechBubble'
      style='width: 14px; height: 14px; display: block; fill: rgba(202, 204, 206, 0.6); flex-shrink: 0; backface-visibility: hidden;'
    >
      <path d='M4.32 15.424c.39 0 .677-.192 1.149-.609l2.344-2.064h4.116c2.057 0 3.213-1.19 3.213-3.22V4.22c0-2.03-1.156-3.22-3.213-3.22H3.213C1.163 1 0 2.19 0 4.22V9.53c0 2.037 1.196 3.22 3.165 3.22h.28v1.675c0 .608.322.998.875.998zm.342-1.531v-1.949c0-.403-.178-.56-.56-.56H3.26c-1.285 0-1.9-.65-1.9-1.894V4.26c0-1.243.615-1.893 1.9-1.893h8.627c1.278 0 1.893.65 1.893 1.894v5.23c0 1.243-.615 1.893-1.893 1.893h-4.15c-.417 0-.622.068-.909.369l-2.167 2.14z'></path>
    </svg>
    <div style='font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255, 255, 255, 0.6); margin-left: 4px;'>
      <span class="msgIcon" style='margin-left: 2px; color: rgba(255, 255, 255, 0.4); font-weight: 600;'>
        1
      </span>
    </div>
  </div>
</div>
`

function showCommentIcons(currentDiscussions) {
  let pageContent = document.querySelector('.notion-page-content')
  let pageContentElements = [...pageContent.children]
  // pageContent.querySelectorAll(`[data-block-id]`)
  console.log(currentDiscussions)
  currentDiscussions.forEach((discussion) => {
    if (discussion.messages > 0) {
      const selectedBlock = pageContentElements.filter(
        (elem) => elem.attributes['0'].value === discussion.blockId
      )

      let block = selectedBlock[0]

      const msgIconDiv = document.createElement('div')
      msgIconDiv.innerHTML = msgIconHTML
      msgIconDiv.querySelector('.msgIcon').textContent = discussion.messages
      msgIconDiv.querySelector('.notion-focusable').onclick = (e) => {
        e.stopPropagation()
        clickDiscussion(block.attributes['0'].value)
        console.log('comment clicked', block.attributes['0'].value)
      }

      block
        .querySelectorAll(`[contenteditable]`)[0]
        .parentElement.append(msgIconDiv)
    }
  })
}
