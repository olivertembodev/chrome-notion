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
  else throw Error('No user')
}

const addDiscussion = async (notionId, blockId) => {
  await admin
    .firestore()
    .collection('discussions')
    .add({ blockId, notionId, deleted: false })
}

const deleteDiscussion = async (blockId) => {
  try {
    const discussion = await admin
      .firestore()
      .collection('discussions')
      .where('blockId', '==', blockId)
      .get()

    let realDiscussion

    if (!discussion.empty) {
      discussion.forEach((doc) => {
        realDiscussion = { id: doc.id, ...doc.data() }
      })
    }

    if (realDiscussion) {
      await admin
        .firestore()
        .collection('discussions')
        .doc(realDiscussion.id)
        .update({ deleted: true })
    }
  } catch (error) {
    console.error(error)
  }
}

const addUser = async (email, firstName, lastName) => {
  await admin
    .firestore()
    .collection('users')
    .add({ email, firstName, lastName })
}

exports.addComment = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const {
      message,
      blockId,
      user: { email, firstName, lastName },
    } = req.body

    const writeResult = await admin
      .firestore()
      .collection('comments')
      .add({ message, date: new Date(), blockId, email })

    let user
    try {
      user = await findUserByEmail(email)
    } catch (error) {
      addUser(email, firstName, lastName)
    }

    res.json({
      result: `Comment with ID: ${writeResult.id} added.`,
      user,
    })
  })
})

exports.getDiscussion = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const { notionId, blockId } = req.body

    const snapshot = await admin
      .firestore()
      .collection('discussions')
      .where('blockId', '==', blockId)
      .get()

    if (snapshot.empty) {
      addDiscussion(notionId, blockId)
      return res.json({ comments: [] })
    }

    let discussion
    snapshot.forEach((doc) => {
      discussion = { id: doc.id, ...doc.data() }
    })

    let comments = []

    const commentsRef = await admin
      .firestore()
      .collection('comments')
      .where('blockId', '==', discussion.blockId)
      .orderBy('date', 'desc')
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
        discussions.push({ id: doc.id, ...doc.data() })
      })

      // for (const discussion of discussions) {
      //   let comments = []

      //   const commentsRef = await admin
      //     .firestore()
      //     .collection('comments')
      //     .where('blockId', '==', discussion.blockId)
      //     .orderBy('date', 'desc')
      //     .get()

      //   let realComments = []

      //   commentsRef.forEach((doc) => {
      //     realComments.push({ ...doc.data() })
      //   })

      //   // for (const comment of realComments) {
      //   //   let user = await findUserByEmail(comment.email)
      //   //   let date = toDateTime(comment.date._seconds)
      //   //   comment.date = `on ${
      //   //     month_names_short[date.getMonth()]
      //   //   } ${date.getDate()}`

      //   //   comments.push({ ...comment, ...user })
      //   // }

      //   // comments.reverse()
      //   // discussion = { ...discussion, comments }
      //   console.log(discussion)
      // }

      const deletedDiscussions = discussions.filter(
        (discussion) => discussion.deleted === true
      )
      const currentDiscussions = discussions.filter(
        (discussion) => discussion.deleted === false
      )

      return res.json({ deletedDiscussions, currentDiscussions })
    } catch (error) {
      res.send(error)
    }
  })
})

exports.deleteDiscussion = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { blockId } = req.body
      deleteDiscussion(blockId)
      res.send('Success')
    } catch (error) {
      res.send(error)
    }
  })
})

function toDateTime(secs) {
  var time = new Date(1970, 0, 1) // Epoch
  time.setSeconds(secs)
  return time
}
