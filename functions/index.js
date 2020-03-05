const functions = require('firebase-functions')
const app = require('express')()
const FBAuth = require('./util/fbAuth')

const {
  getAllPosts,
  postOnePost
} = require('./handlers/posts')
const {
  signup,
  login,
  uploadImage,
  addUserDetails
} = require('./handlers/users')
app.get('/posts', FBAuth, getAllPosts)
app.post('/posts', FBAuth, postOnePost)

app.post('/user', FBAuth, addUserDetails)
app.post('/signup', signup)
app.post('/uploadImg', FBAuth, uploadImage)
app.post('/login', login)

exports.api = functions.region('asia-east2').https.onRequest(app)
