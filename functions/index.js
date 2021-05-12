const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebase = require('firebase')
require('firebase/firestore')

// const firebaseConfig = {
//   apiKey: 'AIzaSyCv34L3w2BlDgf2fdZQ7GKlzZuVj1NiJU8',
//   authDomain: 'chrome-notion.firebaseapp.com',
//   databaseURL:
//     'https://chrome-notion-default-rtdb.europe-west1.firebasedatabase.app',
//   projectId: 'chrome-notion',
//   storageBucket: 'chrome-notion.appspot.com',
//   messagingSenderId: '940135582054',
//   appId: '1:940135582054:web:8637cb4d862fa0420160a7',
// }
// firebase.initializeApp(firebaseConfig)
// let db = firebase.firestore()

admin.initializeApp()

exports.addDiscussion = functions.https.onRequest(async (req, res) => {
  const { notionId, blockId } = req.body
  const writeResult = await admin
    .firestore()
    .collection('discussions')
    .add({ blockId, notionId, deleted: false })

  res.json({ result: `Discussion with ID: ${writeResult.id} created.` })
})

exports.addComment = functions.https.onRequest(async (req, res) => {
  const { message, discussionId, userId } = req.body
  const writeResult = await admin
    .firestore()
    .collection('comments')
    .add({ message, date: new Date(), discussionId, userId })

  res.json({ result: `Comment with ID: ${writeResult.id} added.` })
})

exports.addUser = functions.https.onRequest(async (req, res) => {
  const { email, firstName, lastName } = req.body

  const writeResult = await admin
    .firestore()
    .collection('users')
    .add({ email, firstName, lastName })

  res.json({ result: `User with ID: ${writeResult.id} added.` })
})

exports.getDiscussion = functions.https.onRequest(async (req, res) => {
  const { blockId } = req.body

  const discussionsRef = admin
    .firestore()
    .collection('discussions')
    .where('blockId', '==', blockId)

  let discussion
  const snapshot = await discussionsRef.get()
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data())
    discussion = { id: doc.id, blockId: doc.data().blockId }
  })

  let comments = []

  const commentsRef = admin
    .firestore()
    .collection('comments')
    .where('discussionId', '==', discussion.id)

  const snapshot2 = await commentsRef.get()

  snapshot2.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() })
  })

  for (const comment of comments) {
    console.log(comment)
    let user = await admin
      .firestore()
      .collection('users')
      .doc(comment.userId)
      .get()
    comment.user = user.data()
  }

  return res.json({ discussion, comments })
})

exports.makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log('Uppercasing', context.params.documentId, original)

    const uppercase = original.toUpperCase()

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true })
  })
