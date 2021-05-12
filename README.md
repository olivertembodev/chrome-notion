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
