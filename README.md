Part I

[x] mini map of placeholder h1 like google docs (done)

Part II
capture data in chrome extension

[x] Individual blocks -> separate discussions (Pic, name, date, comment)
[x] Collapse button (done)
[x] get the uuid of the post (done)
[x] get user data from notion (done)
[x] Discussion button (separate comment feature) (done)
[x] get messages for block, api (done)

[ ] display messages in block
[ ] api function to verify if block is deleted and then update db
[ ] Other icon for message (or maybe the same one, get number of comments and display it there)
[ ] show discussions on deleted block
[ ] fix "Discussion" button sometimes disappearing

<br>
DB SCHEMA:<br>
discussions<br>
id<br>
notionId // to which notion uuid is referring<br>
blockId // to which block of the content is referring<br>
deleted<br>
<br><br>
comments<br>
id<br>
message<br>
date<br>
discussionId (FK)<br>
userId (FK)<br>
<br><br>
users<br>
id<br>
email<br>
firstName<br>
lastName<br>
