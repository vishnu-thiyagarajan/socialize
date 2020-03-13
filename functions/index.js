const functions = require('firebase-functions')
const app = require('express')()
const FBAuth = require('./util/fbAuth')
const cors = require('cors')
// const { db } = require('./util/admin')

const {
  getAllPosts,
  getPosts,
  postOnePost,
  getPost,
  commentOnPost,
  deletePost,
  likePost,
  unlikePost
} = require('./handlers/posts')
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require('./handlers/users')

app.use(cors())
app.get('/posts', getAllPosts)
app.get('/posts/:offSet/:limit', getPosts)
app.post('/posts', FBAuth, postOnePost)
app.get('/posts/:postId', FBAuth, getPost)
app.post('/posts/:postId/comment', FBAuth, commentOnPost)
app.delete('/posts/:postId', FBAuth, deletePost)
app.get('/posts/:postId/like', FBAuth, likePost)
app.get('/posts/:postId/unlike', FBAuth, unlikePost)

app.get('/user', FBAuth, getAuthenticatedUser)
app.post('/user', FBAuth, addUserDetails)
app.post('/signup', signup)
app.post('/uploadImg', FBAuth, uploadImage)
app.post('/login', login)
app.get('/user/:handle', getUserDetails)
app.post('/notifications', FBAuth, markNotificationsRead)
exports.api = functions.region('asia-east2').https.onRequest(app)

// exports.createNotificationOnLike = functions
//   .region('asia-east2')
//   .firestore.document('likes/{id}')
//   .onCreate((snapshot) => {
//     return db
//       .doc(`/post/${snapshot.data().postId}`)
//       .get()
//       .then((doc) => {
//         if (
//           doc.exists &&
//           doc.data().userHandle !== snapshot.data().userHandle
//         ) {
//           return db.doc(`/notifications/${snapshot.id}`).set({
//             createdAt: new Date().toISOString(),
//             recipient: doc.data().userHandle,
//             sender: snapshot.data().userHandle,
//             type: 'like',
//             read: false,
//             postId: doc.id
//           })
//         }
//       })
//       .catch((err) => console.error(err))
//   })
// exports.deleteNotificationOnUnLike = functions
//   .region('asia-east2')
//   .firestore.document('likes/{id}')
//   .onDelete((snapshot) => {
//     return db
//       .doc(`/notifications/${snapshot.id}`)
//       .delete()
//       .catch((err) => {
//         console.error(err)
//       })
//   })
// exports.createNotificationOnComment = functions
//   .region('asia-east2')
//   .firestore.document('comments/{id}')
//   .onCreate((snapshot) => {
//     return db
//       .doc(`/post/${snapshot.data().postId}`)
//       .get()
//       .then((doc) => {
//         if (
//           doc.exists &&
//           doc.data().userHandle !== snapshot.data().userHandle
//         ) {
//           return db.doc(`/notifications/${snapshot.id}`).set({
//             createdAt: new Date().toISOString(),
//             recipient: doc.data().userHandle,
//             sender: snapshot.data().userHandle,
//             type: 'comment',
//             read: false,
//             postId: doc.id
//           })
//         }
//       })
//       .catch((err) => {
//         console.error(err)
//       })
//   })
