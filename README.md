Part I

- mini map of placeholder h1 like google docs (done)

Part II
capture data in chrome extension

- Discussion button (separate comment feature)
- Individual blocks -> separate discussions (Pic, name, date, comment) (done)
- Collapse button
- Other icon for message (or maybe the same one)
- get the uuid of the post (done)
- get user data from notion (done)
- show discussion on deleted block

discussions
id
notionId // to which notion uuid is referring
blockId // to which block of the content is referring
// also show something to know when it's deleted

comments
id
message
date
discussionId (FK)
userId (FK)

users
id
email
firstName
lastName

Different types of notion texts with css classes:
notion-page-content //the main div which contains multiple stuff like this

// each block has an id -> data-block-id, which is the blockId in the discussion field
notion-text-block
notion-header-block
notion-divider-block
notion-to_do-block
notion-page-block
notion-bookmark-block

// code for getting blockIds from all elements in current page
let pageContent = document.querySelector('.notion-page-content')
let pageContentElements = [...pageContent.children]
pageContentElements.forEach(elem => console.log(elem.attributes["data-block-id"].nodeValue))

// context menu
let scrollers = [...document.querySelectorAll('.notion-scroller.vertical')]
let contextMenu = scrollers[scrollers.length - 1]

// get comment div in context menu
let bubbles = document.querySelector('.speechBubbleThin')
console.log(bubbles.parentElement.parentElement.parentElement.parentElement.parentElement)
