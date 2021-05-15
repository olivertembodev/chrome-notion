Part I

[x] mini map of placeholder h1 like google docs

Part II
capture data in chrome extension

[x] Individual blocks -> separate discussions (Pic, name, date, comment)
[x] Collapse button
[x] get the uuid of the post
[x] get user data from notion
[x] Discussion button (separate comment feature)
[x] get messages for block, api

[ ] display messages in block
[ ] api function to verify if block is deleted and then update db
[ ] Other icon for message (or maybe the same one, get number of comments and display it there)
[ ] show discussions on deleted block
[ ] fix "Discussion" button sometimes disappearing
[ ] have comments opened per user

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
blockId<br>
email<br>
<br><br>
users<br>
id<br>
email<br>
firstName<br>
lastName<br>
