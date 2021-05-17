const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebase = require('firebase')
require('firebase/firestore')

const cors = require('cors')({ origin: true })

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
// let admin.firestore() = firebase.firestore()

admin.initializeApp()

const month_names_short = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const findUserByEmail = async (email) => {
  const user = await admin
    .firestore()
    .collection('users')
    .where('email', '==', email)
    .get()

  if (!user.empty) return user.docs[0].data()
  else return {}
}

exports.addDiscussion = functions.https.onRequest(async (req, res) => {
  const { notionId, blockId } = req.body
  const writeResult = await admin
    .firestore()
    .collection('discussions')
    .add({ blockId, notionId, deleted: false })

  res.json({ result: `Discussion with ID: ${writeResult.id} created.` })
})

exports.addComment = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const { message, blockId, email } = req.body

    const writeResult = await admin
      .firestore()
      .collection('comments')
      .add({ message, date: new Date(), blockId, email })

    let user = await findUserByEmail(email)

    res.json({
      result: `Comment with ID: ${writeResult.id} added.`,
      user,
    })
  })
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
  return cors(req, res, async () => {
    const { blockId } = req.body

    const discussionsRef = admin
      .firestore()
      .collection('discussions')
      .where('blockId', '==', blockId)

    let discussion
    const snapshot = await discussionsRef.get()
    snapshot.forEach((doc) => {
      discussion = { id: doc.id, ...doc.data() }
    })

    let comments = []

    const commentsRef = await admin
      .firestore()
      .collection('comments')
      .where('blockId', '==', discussion.blockId)
      .get()

    let realComments = []

    commentsRef.forEach((doc) => {
      realComments.push({ ...doc.data() })
    })

    for (const comment of realComments) {
      let user = await findUserByEmail(comment.email)
      let date = toDateTime(comment.date._seconds)
      comment.date = `on ${
        month_names_short[date.getMonth()]
      } ${date.getDate()}`

      comments.push({ ...comment, ...user })
    }

    comments.reverse()

    return res.json({ discussion, comments })
  })
})

exports.getPostDiscussions = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { notionId } = req.body

      const discussionsRef = admin
        .firestore()
        .collection('discussions')
        .where('notionId', '==', notionId)

      let discussions = []
      const snapshot = await discussionsRef.get()
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data())
        discussions.push({ id: doc.id, ...doc.data() })
      })

      return res.json({ discussions })
    } catch (error) {
      res.send(error)
    }
  })
})

// exports.verifyDeleted = functions.https.onRequest((req, res) => {
//   return cors(req, res, async () => {
//     try {
//       const { deletedBlockIds, notionId } = req.body

//       const discussions = await admin
//         .firestore()
//         .collection('discussions')
//         .where('notionId', '==', notionId)
//         .get()

//       let discussions = []
//       let user = {}
//       const snapshot = await discussionsRef.get()
//       snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data())
//         discussions.push({ id: doc.id, ...doc.data() })
//       })

//       return res.json({ discussions })
//     } catch (error) {
//       res.send(error)
//     }
//   })
// })

function toDateTime(secs) {
  var time = new Date(1970, 0, 1) // Epoch
  time.setSeconds(secs)
  return time
}
