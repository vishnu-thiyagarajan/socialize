const functions = require('firebase-functions')
const app = require('express')()
const FBAuth = require('./util/fbAuth')
const cors = require('cors')

const {
  getAllPosts,
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
